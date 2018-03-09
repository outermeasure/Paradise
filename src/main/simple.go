package main

import (
	"bytes"
	"compress/gzip"
	"encoding/json"
	"fmt"
	"html/template"
	"image/jpeg"
	"io"
	"io/ioutil"
	"net"
	"net/http"
	"os"
	"path"
	"path/filepath"
	"sort"
	"strconv"
	"strings"

	"github.com/julienschmidt/httprouter"
	"github.com/labstack/gommon/log"
	"github.com/nfnt/resize"
	"github.com/russross/blackfriday"
)

func Template(path string) string {
	return gApplicationState.Configuration.Templates + path
}

func gcd(a int, b int) int {
	if a%b == 0 {
		return b
	} else {
		return gcd(b, a%b)
	}
}

func lcmN(n int) int {
	p := 1
	for i := 1; i <= n; i++ {
		p = p * i / gcd(p, i)
	}
	return p
}

func addPadding(maxItemsPerRow int, numberOfItems int) []byte {
	result := []byte{}
	n := lcmN(maxItemsPerRow)
	for i := numberOfItems; i%n != 0; i++ {
		result = append(result, byte(0))
	}
	return result
}

func BaseContext(r *http.Request) *Page {
	stat, _ := os.Stat(gApplicationState.Configuration.Assets)
	if stat.ModTime().After(gApplicationState.AssetModificationTime) {
		gApplicationState.AssetModificationTime = stat.ModTime()
		gApplicationState.Page.UnsafeTemplateData,
			gApplicationState.Page.SafeTemplateJs,
			gApplicationState.Page.SafeTemplateCss =
			loadResources(gApplicationState.Configuration.Assets)
	}
	page := gApplicationState.Page
	page.Platform = getPlatform(r.UserAgent())
	page.GoogleSiteVerification = gApplicationState.Configuration.GoogleSiteVerification
	if stripPort(r.Host) == "hotelparadise.ro" {
		page.GoogleSiteVerification = gApplicationState.Configuration.HotelParadiseGoogleSiteVerification
	}

	page.Route = r.URL.Path
	page.Parameters = map[string]string{}
	page.Parameters["ExplicitRuntimeMode"] =
		gApplicationState.Configuration.Mode

	return &page
}

func LazyLoadTemplate(templateName string) {
	if gApplicationState.Templates[templateName] == nil {
		gApplicationState.Templates[templateName] =
			LoadTemplate(templateName, template.New(templateName))
	}
}

func LoadTemplate(templateName string, t *template.Template) *template.Template {
	file, load := readFileMemoized(Template(templateName))
	if load {
		return template.Must(t.New(templateName).Parse(file))
	}
	return t
}

func LazyLoadLayout() {
	if gApplicationState.Templates["template"] == nil {
		t := template.New("template")
		LoadTemplate("layout/components/head.gohtml", t)
		LoadTemplate("layout/components/header.gohtml", t)
		LoadTemplate("layout/components/main.gohtml", t)
		LoadTemplate("layout/components/footer.gohtml", t)
		LoadTemplate("layout/layout.gohtml", t)
		gApplicationState.Templates["template"] = t
	}
}

func RenderBookingEmail(booking *Booking) []byte {
	LazyLoadTemplate("email/booking.gohtml")
	buffer := &bytes.Buffer{}
	gApplicationState.Templates["email/booking.gohtml"].Execute(buffer, booking)
	return buffer.Bytes()
}

func RenderPackageBookingEmail(booking *PackageBooking) []byte {
	LazyLoadTemplate("email/package_booking.gohtml")
	buffer := &bytes.Buffer{}
	gApplicationState.Templates["email/package_booking.gohtml"].Execute(buffer, booking)
	return buffer.Bytes()
}

func Render(w io.Writer, templateName string, page *Page) {
	LazyLoadLayout()
	LazyLoadTemplate(templateName)

	buffer := &bytes.Buffer{}
	gApplicationState.Templates[templateName].Execute(buffer, page)
	page.InheritedHTML = template.HTML(buffer.Bytes())
	err := gApplicationState.Templates["template"].ExecuteTemplate(w, "layout/layout.gohtml", page)
	if err != nil {
		fmt.Println(err)
	}
}

type gzipResponseWriter struct {
	io.Writer
	http.ResponseWriter
}

func (w gzipResponseWriter) Write(b []byte) (int, error) {
	if "" == w.Header().Get("Content-Type") {
		// If no content type, apply sniffing algorithm to un-gzipped body.
		w.Header().Set("Content-Type", http.DetectContentType(b))
	}
	return w.Writer.Write(b)
}

func makeStripWWWHandler(fn httprouter.Handle) httprouter.Handle {
	return func(w http.ResponseWriter, r *http.Request, p httprouter.Params) {
		onlyHost := stripPort(r.Host)
		if strings.HasPrefix(onlyHost, "www.") {
			onlyHost = strings.TrimPrefix(onlyHost, "www.")
			port := "80"
			extractedPort := portOnly(r.Host)
			if extractedPort != "" {
				port = extractedPort
			}
			toURL := "http://" + net.JoinHostPort(onlyHost, port)
			ssl := gApplicationState.Configuration.SSL
			if ssl != nil {
				toURL = "https://" + net.JoinHostPort(onlyHost, strconv.Itoa(ssl.Port))
			}
			toURL += r.URL.RequestURI()
			w.Header().Set("Connection", "close")
			http.Redirect(w, r, toURL, http.StatusMovedPermanently)
			return
		}
		fn(w, r, p)
	}
}

func makeGzipHandler(fn httprouter.Handle) httprouter.Handle {
	return func(w http.ResponseWriter, r *http.Request, p httprouter.Params) {
		if !strings.Contains(r.Header.Get("Accept-Encoding"), "gzip") {
			fn(w, r, p)
			return
		}
		w.Header().Set("Content-Encoding", "gzip")
		gz := gzip.NewWriter(w)
		defer gz.Close()
		gzr := gzipResponseWriter{Writer: gz, ResponseWriter: w}
		fn(gzr, r, p)
	}
}

func makePseudoSecureHandler(fn httprouter.Handle) httprouter.Handle {
	return func(w http.ResponseWriter, r *http.Request, p httprouter.Params) {

		auth := r.Header.Get("X-Authorization")
		if auth != gApplicationState.Configuration.PseudoSecureUrl {
			w.Header().Set("Content-Type", "text/plain")
			w.WriteHeader(401)
			w.Write([]byte("Unauthorized"))
			return
		}
		fn(w, r, p)
	}
}

func makeCachedHandler(fn httprouter.Handle) httprouter.Handle {
	return func(w http.ResponseWriter, r *http.Request, p httprouter.Params) {
		w.Header().Set("Cache-Control", "max-age=31536000")
		fn(w, r, p)
	}
}

func makeVaryAcceptEncoding(fn httprouter.Handle) httprouter.Handle {
	return func(w http.ResponseWriter, r *http.Request, p httprouter.Params) {
		w.Header().Set("Vary", "Accept-Encoding")
		fn(w, r, p)
	}
}

func getIndex(w http.ResponseWriter, r *http.Request, p httprouter.Params) {
	context := BaseContext(r)
	context.NavbarSelected = -1
	all := getParadisePackages(
		gApplicationState.Configuration.Data,
	)
	sort.Sort(ByIndexPage(all))

	context.Packages = []Package{}
	for i := 0; i < len(all); i++ {
		if all[i].ShowOnIndexPage {
			context.Packages = append(context.Packages, all[i])
		}
	}
	context.Padding = addPadding(3, len(context.Packages))

	context.SEOContentLanguage = "ro_RO"
	context.SEODescription = "Pensiunea Paradise Delta House  este o zona de lux, 4 stele, aflata in Delta Dunarii. Camerele, restaurantul precum si locatia, va ofera decorul ideal pentru a va elibera de stres."
	context.SEOKeywords = "cazare lux delta dunarii,paradise delta house, sejur delta dunarii, team building delta, bird watching, pescuit in delta, oferta de paste, oferta de lux, oferta 1 mai 2018, pachet de Rusalii,sejur all inclusive in delta dunarii 2018, cazare mila 23"
	context.Title = "Paradise Delta House- Pensiune 4 stele - Delta Dunarii - Mila 23"

	Render(w, "index.gohtml", context)
}

func getPrices(w http.ResponseWriter, r *http.Request, p httprouter.Params) {
	context := BaseContext(r)
	context.NavbarSelected = 4

	file, _ := readFileBytesMemoized(
		gApplicationState.Configuration.Data + "prices/prices.md",
	)
	html := blackfriday.MarkdownBasic(
		file,
	)
	context.RenderedPricesMarkdown =
		template.HTML(
			html,
		)
	context.Parameters["markdownHTML"] = string(html)

	context.SEOContentLanguage = "ro_RO"
	context.SEODescription = "Preturile si tarifele Hotel Paradise | Paradise Delta House din Delta Dunarii"
	context.SEOKeywords = "pret hotel paradise,pret paradise delta house,tarif sejur delta dunarii,pret tarif delta dunarii"
	context.Title = "Tarife complex Hotel Paradise"

	Render(w, "prices.gohtml", context)
}
func getPackages(w http.ResponseWriter, r *http.Request, p httprouter.Params) {
	context := BaseContext(r)
	context.NavbarSelected = 1
	all := getParadisePackages(
		gApplicationState.Configuration.Data,
	)
	sort.Sort(ByPackagePage(all))
	context.Packages = []Package{}
	for i := 0; i < len(all); i++ {
		if all[i].ShowOnPackagePage {
			context.Packages = append(context.Packages, all[i])
		}
	}
	context.Padding = addPadding(
		3,
		len(context.Packages),
	)
	context.SEOContentLanguage = "ro_RO"
	context.SEODescription = "Oferte turistice 2018 Delta Dunarii -  Paradise Delta House - 4 stele"
	context.SEOKeywords = "pachete turistice delta,oferte delta dunarii,sejur delta,oferte de lux,all iclusive,oferte paste 2018 delta dunarii,oferta 4 zile 3 nopti,pecuit in delta,1 mai 2018 delta dunarii,pachet de rusalii 2018,Sejur de lux, 4 zile in Delta Dunarii"
	context.Title = "Oferte turistice 2018 Delta Dunarii -  Paradise Delta House - Mila 23"

	Render(w, "packages.gohtml", context)
}

func getReviews(w http.ResponseWriter, r *http.Request, p httprouter.Params) {
	context := BaseContext(r)
	context.NavbarSelected = 3
	all := getParadiseReviews(
		gApplicationState.Configuration.Data,
	)
	context.Reviews = []Review{}
	for i := 0; i < len(all); i++ {
		context.Reviews = append(context.Reviews, all[i])
	}
	context.Padding = addPadding(
		3,
		len(context.Reviews),
	)
	context.SEOContentLanguage = "ro_RO"
	context.SEODescription = "Ce cred clientii complexului Hotel Paradise din Delta Dunarii"
	context.SEOKeywords = "pareri clienti hotel paradise,paradise delta house,recenzii hotel paradise"
	context.Title = "Recenzii complex Hotel Paradise"

	Render(w, "reviews.gohtml", context)
}

func getApiReviews(w http.ResponseWriter, r *http.Request, _ httprouter.Params) {
	jData, _ := json.Marshal(
		getParadiseReviews(
			gApplicationState.Configuration.Data,
		),
	)
	w.Header().Set("Content-Type", "application/json")
	w.Write(jData)
}

func getPackage(w http.ResponseWriter, r *http.Request, p httprouter.Params) {
	switch p.ByName("url") {
	case "pachet_pasti_2018.html":
		redirectToPath("/oferta/oferta_paste_2018_delta_dunarii.html")(
			w, r, p,
		)
		return
	}
	context := BaseContext(r)
	context.NavbarSelected = -1
	context.PackageDetails = getParadisePackageByUrl(
		gApplicationState.Configuration.Data,
		p.ByName("url"),
	)
	context.Route = "/oferta/:url"

	if context.PackageDetails != nil {
		html := blackfriday.MarkdownBasic(
			[]byte(context.PackageDetails.PageDetailsMarkdown),
		)

		context.RenderedPackageMarkdown =
			template.HTML(
				html,
			)

		if context.PackageDetails.Title != nil {
			context.RenderedPackageTitle = *context.PackageDetails.Title
		}

		context.RenderedPackageCover = template.HTMLAttr(
			context.PackageDetails.PageDetailsCoverPhoto,
		)

		context.Parameters["url"] = context.PackageDetails.Url
		context.Parameters["id"] = strconv.Itoa(*context.PackageDetails.Id)
		context.Parameters["markdownHTML"] = string(html)
		context.Parameters["cover"] = context.PackageDetails.PageDetailsCoverPhoto

		if context.PackageDetails.SEOTitle != nil {
			context.Title = *context.PackageDetails.SEOTitle
		}
		if context.PackageDetails.SEOContentLanguage != nil {
			context.SEOContentLanguage = *context.PackageDetails.SEOContentLanguage
		}
		if context.PackageDetails.SEODescription != nil {
			context.SEODescription = *context.PackageDetails.SEODescription
		}
		if context.PackageDetails.SEOKeywords != nil {
			context.SEOKeywords = *context.PackageDetails.SEOKeywords
		}
	}

	Render(w, "package.gohtml", context)
}

func getRestaurant(w http.ResponseWriter, r *http.Request, p httprouter.Params) {
	context := BaseContext(r)
	context.NavbarSelected = -1

	context.SEOContentLanguage = "ro_RO"
	context.SEODescription = "Restaurant Paradise Delta House"
	context.SEOKeywords = "restaurant hotel paradise,restaurant paradise delta house"
	context.Title = "Restaurant Hotel Paradise"

	Render(w, "restaurant.gohtml", context)
}
func getLocation(w http.ResponseWriter, r *http.Request, p httprouter.Params) {
	context := BaseContext(r)
	context.NavbarSelected = 2
	file, _ := readFileBytesMemoized(
		gApplicationState.Configuration.Data + "location/location.md",
	)
	html := blackfriday.MarkdownBasic(
		file,
	)
	context.RenderedLocationMarkdown =
		template.HTML(
			html,
		)
	context.Parameters["markdownHTML"] = string(html)
	if gApplicationState.Configuration.GoogleApiKey != nil {
		context.Parameters["GoogleApiKey"] = *gApplicationState.Configuration.GoogleApiKey
	}

	context.SEOContentLanguage = "ro_RO"
	context.SEODescription = "Paradise Delta House 4 stele - localizata in mijlocul Deltei Dunarii - sat Mila 23"
	context.SEOKeywords = "locatie hotel paradise delta,locatie paradise delta house,harta hotel paradise,locatie hotel paradise, delta dunarii, mila 23, pensiune delta, pensiune 4 stele, barca, salupa, transfer Tulcea"
	context.Title = "Locatie Paradise Delta House 4 stele- Delta Dunarii - sat Mila 23"

	Render(w, "location.gohtml", context)
}

func getGallery(w http.ResponseWriter, r *http.Request, p httprouter.Params) {
	context := BaseContext(r)
	context.NavbarSelected = -1
	context.Parameters["Gallery"] = p.ByName("url")
	context.Route = "/galerie/:url"
	context.SEOContentLanguage = "ro_RO"
	context.SEODescription = "Galerie foto complex Hotel Paradise"
	context.SEOKeywords = "galerie hotel paradise delta,galerie paradise delta house,galerie hotel paradise,poze hotel paradise"
	context.Title = "Galerie Hotel Paradise"

	Render(w, "gallery.gohtml", context)
}

func getApiPackage(w http.ResponseWriter, _ *http.Request, p httprouter.Params) {
	id, err := strconv.Atoi(p.ByName("id"))
	pack := (*Package)(nil)
	if err == nil {
		pack = getParadisePackage(
			gApplicationState.Configuration.Data,
			id,
		)
	}

	jData, _ := json.Marshal(pack)
	w.Header().Set("Content-Type", "application/json")
	w.Write(jData)
}

var gApplicationState *ApplicationState

func loadResources(filename string) (UnsafeTemplateData, SafeTemplateJs, SafeTemplateCss) {
	assets, err := ioutil.ReadFile(filename)
	runtimeAssert(err)
	m := make(map[string]VersionedScript)
	n := make(UnsafeTemplateData)
	o := make(SafeTemplateJs)
	p := make(SafeTemplateCss)
	err = json.Unmarshal(assets, &m)
	runtimeAssert(err)

	if m["inline_sync_top"].Js != "" {
		file, _ := readFileMemoized("public/" + m["inline_sync_top"].Js)
		o["inline_sync_js_top"] =
			template.JS(file)
	}
	if m["inline_sync_top"].Css != "" {
		file, _ := readFileMemoized("public/" + m["inline_sync_top"].Css)
		p["inline_sync_css_top"] =
			template.CSS(file)
	}

	if m["async"].Js != "" {
		n["async_js"] = "/public/" + m["async"].Js
	}

	if m["async"].Css != "" {
		n["async_css"] = "/public/" + m["async"].Css
	}
	return n, o, p
}

func getApiPackagesByIndexPage(w http.ResponseWriter, r *http.Request, _ httprouter.Params) {
	all := getParadisePackages(gApplicationState.Configuration.Data)
	sort.Sort(ByIndexPage(all))
	jData, _ := json.Marshal(
		all,
	)
	w.Header().Set("Content-Type", "application/json")
	w.Write(jData)
}

func getApiPackagesByPackagePage(w http.ResponseWriter, r *http.Request, _ httprouter.Params) {
	all := getParadisePackages(gApplicationState.Configuration.Data)
	sort.Sort(ByPackagePage(all))
	jData, _ := json.Marshal(
		all,
	)
	w.Header().Set("Content-Type", "application/json")
	w.Write(jData)
}

func postApiPackageBooking(w http.ResponseWriter, r *http.Request, _ httprouter.Params) {
	decoder := json.NewDecoder(r.Body)
	packageBooking := PackageBooking{}
	jData := []byte{}

	err := decoder.Decode(&packageBooking)

	if err == nil {
		packageBooking.IsClient = false
		SendEmail(
			gApplicationState.GmailClient,
			EmailMessage{
				From:    packageBooking.FirstName + " " + packageBooking.LastName,
				ReplyTo: packageBooking.Email,
				To:      gApplicationState.Configuration.BookingEmailAddress,
				Subject: packageBooking.FirstName + " " + packageBooking.LastName + ", check in: " + packageBooking.CheckIn + ", pachet: " + packageBooking.PackageName,
				Body:    string(RenderPackageBookingEmail(&packageBooking)),
			})
		jData, _ = json.Marshal(true)
	} else {
		jData, _ = json.Marshal(err.Error())
	}

	w.Header().Set("Content-Type", "application/json")
	w.Write(jData)
}

func putApiPackage(w http.ResponseWriter, r *http.Request, p httprouter.Params) {
	decoder := json.NewDecoder(r.Body)
	pack := Package{}
	err := decoder.Decode(&pack)
	success := false
	if err == nil {
		success = insertOrUpdatePackage(pack)
	} else {
		log.Error(err)
	}

	w.Header().Set("Content-Type", "application/json")
	jData, _ := json.Marshal(success)
	w.Write(jData)
}

func putApiReview(w http.ResponseWriter, r *http.Request, p httprouter.Params) {
	decoder := json.NewDecoder(r.Body)
	rev := Review{}
	err := decoder.Decode(&rev)
	success := false
	if err == nil {
		success = insertOrUpdateReview(rev)
	} else {
		log.Error(err)
	}

	w.Header().Set("Content-Type", "application/json")
	jData, _ := json.Marshal(success)
	w.Write(jData)
}

func deleteApiPackage(w http.ResponseWriter, r *http.Request, p httprouter.Params) {
	id, err := strconv.Atoi(p.ByName("id"))
	success := false
	if err == nil {
		success = deletePackage(id)
	} else {
		log.Error(err)
	}
	jData, _ := json.Marshal(success)
	w.Header().Set("Content-Type", "application/json")
	w.Write(jData)
}

func deleteApiReview(w http.ResponseWriter, r *http.Request, p httprouter.Params) {
	id, err := strconv.Atoi(p.ByName("id"))
	success := false
	if err == nil {
		success = deleteReview(id)
	} else {
		log.Error(err)
	}
	jData, _ := json.Marshal(success)
	w.Header().Set("Content-Type", "application/json")
	w.Write(jData)
}

func postApiBooking(w http.ResponseWriter, r *http.Request, _ httprouter.Params) {
	decoder := json.NewDecoder(r.Body)
	booking := Booking{}
	jData := []byte{}

	err := decoder.Decode(&booking)

	if err == nil {
		booking.IsClient = false
		SendEmail(
			gApplicationState.GmailClient,
			EmailMessage{
				From:    booking.FirstName + " " + booking.LastName,
				ReplyTo: booking.Email,
				To:      gApplicationState.Configuration.BookingEmailAddress,
				Subject: booking.FirstName + " " + booking.LastName + ", check in: " + booking.CheckIn + ", durata: " + booking.Duration,
				Body:    string(RenderBookingEmail(&booking)),
			})
		jData, _ = json.Marshal(true)
	} else {
		jData, _ = json.Marshal(err.Error())
	}
	w.Header().Set("Content-Type", "application/json")
	w.Write(jData)
}

func getApiPhotos(w http.ResponseWriter, r *http.Request, p httprouter.Params) {
	photos := []Photo{}
	filepath.Walk(
		gApplicationState.Configuration.Data+"gallery/images/"+p.ByName("url")+"/",
		func(stringPath string, info os.FileInfo, err error) error {
			stringPath = path.Clean(filepath.ToSlash(stringPath))

			if err != nil {
				return err
			}

			if info.IsDir() {
				return nil
			}
			_, file := path.Split(stringPath)
			ext := strings.ToLower(path.Ext(stringPath))

			if ext != ".jpg" && ext != ".jpeg" {
				return nil
			}

			if _, err := os.Stat(gApplicationState.Configuration.Data + "gallery/full/" + p.ByName("url") + "/" + file); os.IsNotExist(err) {
				photo, err := os.Open(stringPath)
				runtimeAssert(err)
				img, err := jpeg.Decode(photo)
				photo.Close()
				m := resize.Resize(1200, 0, img, resize.Lanczos3)
				out, err := os.Create(gApplicationState.Configuration.Data + "gallery/full/" + p.ByName("url") + "/" + file)
				runtimeAssert(err)
				defer out.Close()
				jpeg.Encode(out, m, nil)
			}

			if _, err := os.Stat(gApplicationState.Configuration.Data + "gallery/thumbnails/" + p.ByName("url") + "/" + file); os.IsNotExist(err) {
				photo, err := os.Open(stringPath)
				runtimeAssert(err)
				img, err := jpeg.Decode(photo)
				photo.Close()
				m := resize.Resize(400, 0, img, resize.Lanczos3)
				out, err := os.Create(gApplicationState.Configuration.Data + "gallery/thumbnails/" + p.ByName("url") + "/" + file)
				runtimeAssert(err)
				defer out.Close()
				jpeg.Encode(out, m, nil)
			}

			photos = append(photos, Photo{
				Thumbnail:   "/static/gallery/thumbnails/" + p.ByName("url") + "/" + file,
				FullPicture: "/static/gallery/full/" + p.ByName("url") + "/" + file,
			})
			return err
		},
	)
	jData, _ := json.Marshal(
		photos,
	)
	w.Header().Set("Content-Type", "application/json")
	w.Write(jData)
}

func stripPort(hostport string) string {
	colon := strings.IndexByte(hostport, ':')
	if colon == -1 {
		return hostport
	}
	if i := strings.IndexByte(hostport, ']'); i != -1 {
		return strings.TrimPrefix(hostport[:i], "[")
	}
	return hostport[:colon]
}

func portOnly(hostport string) string {
	colon := strings.IndexByte(hostport, ':')
	if colon == -1 {
		return ""
	}
	if i := strings.Index(hostport, "]:"); i != -1 {
		return hostport[i+len("]:"):]
	}
	if strings.Contains(hostport, "]") {
		return ""
	}
	return hostport[colon+len(":"):]
}

func redirectToHTTPS(w http.ResponseWriter, r *http.Request) {
	toURL := "https://" + net.JoinHostPort(stripPort(r.Host), strconv.Itoa(gApplicationState.Configuration.SSL.Port))
	toURL += r.URL.RequestURI()
	w.Header().Set("Connection", "close")
	http.Redirect(w, r, toURL, http.StatusMovedPermanently)
}

func redirectToNew(w http.ResponseWriter, r *http.Request, _ httprouter.Params) {
	port := "80"
	extractedPort := portOnly(r.Host)
	if extractedPort != "" {
		port = extractedPort
	}
	toURL := "http://" + net.JoinHostPort(stripPort(r.Host), port)
	ssl := gApplicationState.Configuration.SSL
	if ssl != nil {
		toURL = "https://" + net.JoinHostPort(stripPort(r.Host), strconv.Itoa(ssl.Port))
	}
	http.Redirect(w, r, toURL, http.StatusMovedPermanently)
	w.Header().Set("Connection", "close")
}

func redirectToPackages(w http.ResponseWriter, r *http.Request, _ httprouter.Params) {
	port := "80"
	extractedPort := portOnly(r.Host)
	if extractedPort != "" {
		port = extractedPort
	}
	toURL := "http://" + net.JoinHostPort(stripPort(r.Host), port)
	ssl := gApplicationState.Configuration.SSL
	if ssl != nil {
		toURL = "https://" + net.JoinHostPort(stripPort(r.Host), strconv.Itoa(ssl.Port))
	}
	toURL += "/oferta"
	http.Redirect(w, r, toURL, http.StatusMovedPermanently)
	w.Header().Set("Connection", "close")
}

func redirectToPath(path string) func(http.ResponseWriter, *http.Request, httprouter.Params) {
	return func(w http.ResponseWriter, r *http.Request, _ httprouter.Params) {
		port := "80"
		extractedPort := portOnly(r.Host)
		if extractedPort != "" {
			port = extractedPort
		}
		toURL := "http://" + net.JoinHostPort(stripPort(r.Host), port)
		ssl := gApplicationState.Configuration.SSL
		if ssl != nil {
			toURL = "https://" + net.JoinHostPort(stripPort(r.Host), strconv.Itoa(ssl.Port))
		}
		toURL += path
		http.Redirect(w, r, toURL, http.StatusMovedPermanently)
		w.Header().Set("Connection", "close")
	}
}

func ServeFilesGzipped(r *httprouter.Router, path string, root http.FileSystem) {
	if len(path) < 10 || path[len(path)-10:] != "/*filepath" {
		panic("path must end with /*filepath in path '" + path + "'")
	}
	fileServer := http.FileServer(root)

	r.GET(path,
		makeCachedHandler(
			makeVaryAcceptEncoding(
				makeGzipHandler(
					makeStripWWWHandler(
						func(w http.ResponseWriter, req *http.Request, ps httprouter.Params) {
							req.URL.Path = ps.ByName("filepath")
							fileServer.ServeHTTP(w, req)
						}),
				),
			),
		),
	)
}

func getAuthorization(w http.ResponseWriter, r *http.Request, p httprouter.Params) {
	context := BaseContext(r)
	context.NavbarSelected = -1
	if p.ByName("secret") == gApplicationState.Configuration.PseudoSecureUrl {
		context.Parameters["PseudoAuthorization"] =
			gApplicationState.Configuration.PseudoSecureUrl
	}
	Render(w, "empty.gohtml", context)
}

func getEdit(w http.ResponseWriter, r *http.Request, _ httprouter.Params) {
	context := BaseContext(r)
	context.NavbarSelected = -1
	context.Platform.Short = context.Platform.Short + " show-tracker"
	Render(w, "empty.gohtml", context)
}

func runApplicationSimple(applicationState *ApplicationState) {
	gApplicationState = applicationState

	router := httprouter.New()
	router.GET("/", makeVaryAcceptEncoding(makeGzipHandler(makeStripWWWHandler(getIndex))))
	router.GET("/tarife", makeVaryAcceptEncoding(makeGzipHandler(makeStripWWWHandler(getPrices))))
	router.GET("/oferta", makeVaryAcceptEncoding(makeGzipHandler(makeStripWWWHandler(getPackages))))
	router.GET("/oferte", makeVaryAcceptEncoding(makeGzipHandler(
		redirectToPath("/oferta"),
	)))
	router.GET("/recenzii", makeVaryAcceptEncoding(makeGzipHandler(makeStripWWWHandler(getReviews))))
	router.GET("/oferta/:url", makeVaryAcceptEncoding(makeGzipHandler(makeStripWWWHandler(getPackage))))
	router.GET("/restaurant", makeVaryAcceptEncoding(makeGzipHandler(makeStripWWWHandler(getRestaurant))))
	router.GET("/locatie", makeVaryAcceptEncoding(makeGzipHandler(makeStripWWWHandler(getLocation))))
	router.GET("/galerie/:url", makeVaryAcceptEncoding(makeGzipHandler(makeStripWWWHandler(getGallery))))

	router.GET("/edit", makeVaryAcceptEncoding(makeGzipHandler(makeStripWWWHandler(getEdit))))

	router.GET("/api/package", makeVaryAcceptEncoding(makeGzipHandler(makeStripWWWHandler(getApiPackagesByIndexPage))))
	router.GET("/api/packages", makeVaryAcceptEncoding(makeGzipHandler(makeStripWWWHandler(getApiPackagesByPackagePage))))
	router.GET("/api/review", makeVaryAcceptEncoding(makeGzipHandler(makeStripWWWHandler(getApiReviews))))

	router.POST("/api/package/booking", makeVaryAcceptEncoding(makeGzipHandler(makeStripWWWHandler(postApiPackageBooking))))
	router.POST("/api/booking", makeVaryAcceptEncoding(makeGzipHandler(makeStripWWWHandler(postApiBooking))))

	router.GET("/api/package/:id", makeVaryAcceptEncoding(makeGzipHandler(makeStripWWWHandler(getApiPackage))))

	router.PUT("/api/package", makePseudoSecureHandler(
		makeVaryAcceptEncoding(makeGzipHandler(makeStripWWWHandler(putApiPackage)))))
	router.PUT("/api/review", makePseudoSecureHandler(
		makeVaryAcceptEncoding(makeGzipHandler(makeStripWWWHandler(putApiReview)))))
	router.DELETE("/api/package/:id", makePseudoSecureHandler(
		makeVaryAcceptEncoding(makeGzipHandler(makeStripWWWHandler(deleteApiPackage)))))
	router.DELETE("/api/review/:id", makePseudoSecureHandler(
		makeVaryAcceptEncoding(makeGzipHandler(makeStripWWWHandler(deleteApiReview)))))

	router.GET("/api/photo/:url", makeVaryAcceptEncoding(makeGzipHandler(makeStripWWWHandler(getApiPhotos))))

	router.GET("/authorization/:secret", makeVaryAcceptEncoding(makeGzipHandler(makeStripWWWHandler(getAuthorization))))

	router.GET("/index.php", makeStripWWWHandler(redirectToNew))
	router.GET("/en", makeStripWWWHandler(redirectToNew))
	router.GET("/en/:page", makeStripWWWHandler(redirectToNew))

	router.GET("/forum", makeStripWWWHandler(redirectToNew))
	router.GET("/forum/:page", makeStripWWWHandler(redirectToNew))
	router.GET("/oferte-pensiune-delta-dunarii", makeStripWWWHandler(redirectToPackages))
	router.GET("/oferte-pensiune-delta-dunarii/:page", makeStripWWWHandler(redirectToPackages))

	ServeFilesGzipped(router, "/public/*filepath", http.Dir(applicationState.Configuration.Public))
	ServeFilesGzipped(router, "/static/*filepath", http.Dir(applicationState.Configuration.Data))
	router.NotFound = http.FileServer(http.Dir(applicationState.Configuration.Data + "public/"))

	configuration := applicationState.Configuration
	ssl := configuration.SSL
	httpAddress := net.JoinHostPort(configuration.Host, strconv.Itoa(configuration.Port))

	if ssl != nil {
		tlsAddress := net.JoinHostPort(configuration.Host, strconv.Itoa(ssl.Port))
		fmt.Fprintf(os.Stdout, "Listening on %s...\n", tlsAddress)
		go http.ListenAndServeTLS(tlsAddress, ssl.Cert, ssl.Key, router)

		fmt.Fprintf(os.Stdout, "Listening on %s...\n", httpAddress)
		http.ListenAndServe(httpAddress, http.HandlerFunc(redirectToHTTPS))
	} else {
		fmt.Fprintf(os.Stdout, "Listening on %s...\n", httpAddress)
		http.ListenAndServe(httpAddress, router)
	}
}
