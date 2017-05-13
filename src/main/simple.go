package main

import (
	"net/http"
	"html/template"
	"github.com/julienschmidt/httprouter"
	"os"
	"bytes"
	"io"
	"fmt"
	"encoding/json"
	"io/ioutil"
	"net"
	"strconv"
	"github.com/russross/blackfriday"
	"path/filepath"
	"github.com/nfnt/resize"
	"path"
	"image/jpeg"
	"strings"
	"github.com/labstack/gommon/log"
	"compress/gzip"
)

func Template(path string) string {
	return gApplicationState.Configuration.Templates + path;
}

func gcd(a int, b int) int {
	if (a % b == 0) {
		return b
	} else {
		return gcd(b, a % b)
	}
}

func lcmN(n int) int {
	p := 1
	for i := 1; i <= n; i++ {
		p = p * i / gcd(p, i)
	}
	return p
}

func addPaddingToPackages(maxItemsPerRow int, items []Package) []Package {
	result := []Package{}
	n := lcmN(maxItemsPerRow)

	for i := 0; i < len(items); i++ {
		items[i].Empty = false
		result = append(result, items[i])
	}

	for i := len(items); i % n != 0; i++ {
		result = append(result, Package{
			Empty: true,
		})
	}

	return result;
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
	page.Route = r.URL.Path
	page.Parameters = map[string]string{}
	page.Parameters["ExplicitRuntimeMode"] =
		gApplicationState.Configuration.Mode
	return &page
}

func LazyLoadTemplate(templateName string) {
	if (gApplicationState.Templates[templateName] == nil) {
		gApplicationState.Templates[templateName] =
			LoadTemplate(templateName, template.New(templateName))
	}
}

func LoadTemplate(templateName string, t *template.Template) *template.Template {
	file, load := readFileMemoized(Template(templateName))
	if (load) {
		return template.Must(t.New(templateName).Parse(file))
	}
	return t;
}

func LazyLoadLayout() {
	if (gApplicationState.Templates["template"] == nil) {
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
		if (auth != gApplicationState.Configuration.PseudoSecureUrl) {
			w.Header().Set("Content-Type", "text/plain")
			w.WriteHeader(401)
			w.Write([]byte("Unauthorized"));
			return;
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
	context.NavbarSelected = 0
	all := getParadisePackages(
		gApplicationState.Configuration.Data,
	)
	context.Packages = []Package{}
	for i := 0; i < len(all); i++ {
		if (all[i].ShowOnIndexPage) {
			context.Packages = append(context.Packages, all[i])
		}
	}
	context.Packages = addPaddingToPackages(3, context.Packages);

	Render(w, "index.gohtml", context)
}

func getPrices(w http.ResponseWriter, r *http.Request, p httprouter.Params) {
	context := BaseContext(r)
	context.NavbarSelected = 1

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
	Render(w, "prices.gohtml", context);
}
func getPackages(w http.ResponseWriter, r *http.Request, p httprouter.Params) {
	context := BaseContext(r)
	context.NavbarSelected = 2
	all := getParadisePackages(
		gApplicationState.Configuration.Data,
	)
	context.Packages = []Package{}
	for i := 0; i < len(all); i++ {
		if (all[i].ShowOnPackagePage) {
			context.Packages = append(context.Packages, all[i])
		}
	}
	context.Packages = addPaddingToPackages(3, context.Packages);
	Render(w, "packages.gohtml", context)
}

func getPackage(w http.ResponseWriter, r *http.Request, p httprouter.Params) {
	context := BaseContext(r)
	context.NavbarSelected = 0
	context.PackageDetails = getParadisePackageByUrl(
		gApplicationState.Configuration.Data,
		p.ByName("url"),
	)
	context.Route = "/package/:url"

	if (context.PackageDetails != nil) {
		html := blackfriday.MarkdownBasic(
			[]byte(context.PackageDetails.PageDetailsMarkdownString),
		);

		context.RenderedPackageMarkdown =
			template.HTML(
				html,
			)

		context.RenderedPackageCover = template.HTMLAttr(
			context.PackageDetails.PageDetailsCover,
		)

		context.Parameters["url"] = context.PackageDetails.Url;
		context.Parameters["id"] = strconv.Itoa(*context.PackageDetails.Id)
		context.Parameters["markdownHTML"] = string(html)
		context.Parameters["cover"] = context.PackageDetails.PageDetailsCover
	}

	Render(w, "package.gohtml", context)
}

func getRestaurant(w http.ResponseWriter, r *http.Request, p httprouter.Params) {
	context := BaseContext(r)
	context.NavbarSelected = 3
	Render(w, "restaurant.gohtml", context)
}
func getLocation(w http.ResponseWriter, r *http.Request, p httprouter.Params) {
	context := BaseContext(r)
	context.NavbarSelected = 4
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
	if (gApplicationState.Configuration.GoogleApiKey != nil) {
		context.Parameters["GoogleApiKey"] = *gApplicationState.Configuration.GoogleApiKey
	}
	Render(w, "location.gohtml", context)
}

func getGallery(w http.ResponseWriter, r *http.Request, p httprouter.Params) {
	context := BaseContext(r)
	context.NavbarSelected = 5
	Render(w, "gallery.gohtml", context)
}

func getApiPackage(w http.ResponseWriter, _ *http.Request, p httprouter.Params) {
	id, err := strconv.Atoi(p.ByName("id"));
	pack := (*Package)(nil)
	if (err == nil) {
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

	if (m["inline_sync_top"].Js != "") {
		file, _ := readFileMemoized("public/" + m["inline_sync_top"].Js)
		o["inline_sync_js_top"] =
			template.JS(file)
	}
	if (m["inline_sync_top"].Css != "") {
		file, _ := readFileMemoized("public/" + m["inline_sync_top"].Css)
		p["inline_sync_css_top"] =
			template.CSS(file)
	}

	if (m["async"].Js != "") {
		n["async_js"] = "/public/" + m["async"].Js
	}

	if (m["async"].Css != "") {
		n["async_css"] = "/public/" + m["async"].Css
	}
	return n, o, p
}

func getApiPackages(w http.ResponseWriter, r *http.Request, _ httprouter.Params) {
	jData, _ := json.Marshal(
		getParadisePackages(
			gApplicationState.Configuration.Data,
		),
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
		packageBooking.IsClient = true
		SendEmail(
			gApplicationState.GmailClient,
			EmailMessage{
				From: "Hotel Paradise",
				ReplyTo: "paradisedeltahouse@yahoo.com",
				To: packageBooking.Email,
				Subject: "Rezervare Hotel Paradise",
				Body: string(RenderPackageBookingEmail(&packageBooking)),
			});

		packageBooking.IsClient = false
		SendEmail(
			gApplicationState.GmailClient,
			EmailMessage{
				From: packageBooking.FirstName + " " + packageBooking.LastName,
				ReplyTo: packageBooking.Email,
				To: "paradisedeltahouse@yahoo.com",
				Subject: packageBooking.FirstName + " " + packageBooking.LastName + ", check in: " + packageBooking.CheckIn + ", pachet: " + packageBooking.PackageName,
				Body: string(RenderPackageBookingEmail(&packageBooking)),
			});
		jData, _ = json.Marshal(true)
	} else {
		jData, _ = json.Marshal(err.Error())
	}

	w.Header().Set("Content-Type", "application/json")
	w.Write(jData);
}

func putApiPackage(w http.ResponseWriter, r *http.Request, p httprouter.Params) {
	decoder := json.NewDecoder(r.Body)
	pack := Package{}
	err := decoder.Decode(&pack)
	success := false
	if (err == nil) {
		success = insertOrUpdatePackage(pack)
	} else {
		log.Error(err)
	}

	w.Header().Set("Content-Type", "application/json")
	jData, _ := json.Marshal(success)
	w.Write(jData)
}

func deleteApiPackage(w http.ResponseWriter, r *http.Request, p httprouter.Params) {
	id, err := strconv.Atoi(p.ByName("id"));
	success := false
	if (err == nil) {
		success = deletePackage(id)
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
		booking.IsClient = true
		SendEmail(
			gApplicationState.GmailClient,
			EmailMessage{
				From: "Hotel Paradise",
				ReplyTo: "paradisedeltahouse@yahoo.com",
				To: booking.Email,
				Subject: "Rezervare Hotel Paradise",
				Body: string(RenderBookingEmail(&booking)),
			});

		booking.IsClient = false
		SendEmail(
			gApplicationState.GmailClient,
			EmailMessage{
				From: booking.FirstName + " " + booking.LastName,
				ReplyTo: booking.Email,
				To: "paradisedeltahouse@yahoo.com",
				Subject: booking.FirstName + " " + booking.LastName + ", check in: " + booking.CheckIn + ", durata: "+ booking.Duration,
				Body: string(RenderBookingEmail(&booking)),
			});
		jData, _ = json.Marshal(true)
	} else {
		jData, _ = json.Marshal(err.Error())
	}
	w.Header().Set("Content-Type", "application/json")
	w.Write(jData);
}

func getApiPhotos(w http.ResponseWriter, r *http.Request, _ httprouter.Params) {
	photos := []Photo{}
	filepath.Walk(
		gApplicationState.Configuration.Data + "gallery/images/",
		func(stringPath string, info os.FileInfo, err error) error {
			stringPath = path.Clean(filepath.ToSlash(stringPath))

			if (err != nil) {
				return err
			}

			if (info.IsDir()) {
				return nil
			}
			_, file := path.Split(stringPath)
			ext := strings.ToLower(path.Ext(stringPath))

			if (ext != ".jpg" && ext != ".jpeg") {
				return nil
			}

			if _, err := os.Stat(gApplicationState.Configuration.Data + "gallery/full/" + file); os.IsNotExist(err) {
				photo, err := os.Open(stringPath)
				runtimeAssert(err)
				img, err := jpeg.Decode(photo)
				photo.Close()
				m := resize.Resize(1200, 0, img, resize.Lanczos3)
				out, err := os.Create(gApplicationState.Configuration.Data + "gallery/full/" + file)
				runtimeAssert(err)
				defer out.Close()
				jpeg.Encode(out, m, nil)
			}

			if _, err := os.Stat(gApplicationState.Configuration.Data + "gallery/thumbnails/" + file); os.IsNotExist(err) {
				photo, err := os.Open(stringPath)
				runtimeAssert(err)
				img, err := jpeg.Decode(photo)
				photo.Close()
				m := resize.Resize(400, 0, img, resize.Lanczos3)
				out, err := os.Create(gApplicationState.Configuration.Data + "gallery/thumbnails/" + file)
				runtimeAssert(err)
				defer out.Close()
				jpeg.Encode(out, m, nil)
			}

			photos = append(photos, Photo{
				Thumbnail: "/static/gallery/thumbnails/" + file,
				FullPicture: "/static/gallery/full/" + file,
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

func redirectToHTTPS(w http.ResponseWriter, r *http.Request) {
	ssl := gApplicationState.Configuration.SSL;
	port := ssl.Port;
	host := gApplicationState.Configuration.Host;
	toURL := "https://" + net.JoinHostPort(host, strconv.Itoa(port));
	toURL += r.URL.RequestURI()
	w.Header().Set("Connection", "close")
	http.Redirect(w, r, toURL, http.StatusMovedPermanently)
}

func ServeFilesGzipped(r *httprouter.Router, path string, root http.FileSystem) {
	if len(path) < 10 || path[len(path) - 10:] != "/*filepath" {
		panic("path must end with /*filepath in path '" + path + "'")
	}
	fileServer := http.FileServer(root)

	r.GET(path,
		makeCachedHandler(
			makeVaryAcceptEncoding(
				makeGzipHandler(
					func(w http.ResponseWriter, req *http.Request, ps httprouter.Params) {
						req.URL.Path = ps.ByName("filepath")
						fileServer.ServeHTTP(w, req)
					}),
			),
		),
	)
}

func getAuthorization(w http.ResponseWriter, r *http.Request, p httprouter.Params) {
	context := BaseContext(r)
	context.NavbarSelected = -1
	if (p.ByName("secret") == gApplicationState.Configuration.PseudoSecureUrl) {
		context.Parameters["PseudoAuthorization"] =
			gApplicationState.Configuration.PseudoSecureUrl
	}
	Render(w, "empty.gohtml", context)
}

func getEdit(w http.ResponseWriter, r *http.Request, _ httprouter.Params) {
	context := BaseContext(r)
	context.NavbarSelected = -1
	Render(w, "empty.gohtml", context)
}

func runApplicationSimple(applicationState *ApplicationState) {
	gApplicationState = applicationState
	router := httprouter.New();
	router.GET("/", makeVaryAcceptEncoding(makeGzipHandler(getIndex)))
	router.GET("/edit", makeVaryAcceptEncoding(makeGzipHandler(getEdit)))
	router.GET("/prices", makeVaryAcceptEncoding(makeGzipHandler(getPrices)))
	router.GET("/packages", makeVaryAcceptEncoding(makeGzipHandler(getPackages)))
	router.GET("/package/:url", makeVaryAcceptEncoding(makeGzipHandler(getPackage)))
	router.GET("/restaurant", makeVaryAcceptEncoding(makeGzipHandler(getRestaurant)))
	router.GET("/location", makeVaryAcceptEncoding(makeGzipHandler(getLocation)))
	router.GET("/gallery", makeVaryAcceptEncoding(makeGzipHandler(getGallery)))

	router.GET("/api/package", makeVaryAcceptEncoding(makeGzipHandler(getApiPackages)))


	router.POST("/api/package/booking", makeVaryAcceptEncoding(makeGzipHandler(postApiPackageBooking)))
	router.POST("/api/booking", makeVaryAcceptEncoding(makeGzipHandler(postApiBooking)))

	router.GET("/api/package/:id", makeVaryAcceptEncoding(makeGzipHandler(getApiPackage)))

	router.PUT("/api/package", makePseudoSecureHandler(
		makeVaryAcceptEncoding(makeGzipHandler(putApiPackage))))
	router.DELETE("/api/package/:id", makePseudoSecureHandler(
		makeVaryAcceptEncoding(makeGzipHandler(deleteApiPackage))))

	router.GET("/api/photo", makeVaryAcceptEncoding(makeGzipHandler(getApiPhotos)))

	router.GET("/authorization/:secret", makeVaryAcceptEncoding(makeGzipHandler(getAuthorization)))

	ServeFilesGzipped(router, "/public/*filepath", http.Dir(applicationState.Configuration.Public));
	ServeFilesGzipped(router, "/static/*filepath", http.Dir(applicationState.Configuration.Data));
	router.NotFound = http.FileServer(http.Dir(applicationState.Configuration.Data + "public/"))

	configuration := applicationState.Configuration;
	ssl := configuration.SSL;
	httpAddress := net.JoinHostPort(configuration.Host, strconv.Itoa(configuration.Port))

	if ssl != nil {
		tlsAddress := net.JoinHostPort(configuration.Host, strconv.Itoa(ssl.Port))
		fmt.Fprintf(os.Stdout, "Listening on %s...\n", tlsAddress)
		go http.ListenAndServeTLS(tlsAddress, ssl.Cert, ssl.Key, router)

		fmt.Fprintf(os.Stdout, "Listening on %s...\n", httpAddress)
		http.ListenAndServe(httpAddress, http.HandlerFunc(redirectToHTTPS));
	} else {
		fmt.Fprintf(os.Stdout, "Listening on %s...\n", httpAddress)
		http.ListenAndServe(httpAddress, router)
	}
}
