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
	"compress/gzip"
)

func Template(path string) string {
	return gApplicationState.Configuration.Templates + path;
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

func getIndex(w http.ResponseWriter, r *http.Request, p httprouter.Params) {
	context := BaseContext(r)
	context.NavbarSelected = 0
	all := getParadisePackages(
		gApplicationState.Configuration.Data,
	)
	context.Packages = []Package{}
	for i := 0; i < len(all); i++ {
		if(all[i].ShowOnIndexPage) {
			context.Packages = append(context.Packages, all[i])
		}
	}
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
		if(all[i].ShowOnPackagePage) {
			context.Packages = append(context.Packages, all[i])
		}
	}
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
		file, _ := readFileBytesMemoized(
			gApplicationState.Configuration.Data + context.PackageDetails.PageDetailsMarkdown,
		)

		html := blackfriday.MarkdownBasic(
			file,
		);

		context.RenderedPackageMarkdown =
			template.HTML(
				html,
			)

		context.RenderedPackageCover = template.HTMLAttr(
			context.PackageDetails.PageDetailsCover,
		)

		context.Parameters["url"] = context.PackageDetails.Url;
		context.Parameters["id"] = strconv.Itoa(context.PackageDetails.Id)
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
	if len(path) < 10 || path[len(path)-10:] != "/*filepath" {
		panic("path must end with /*filepath in path '" + path + "'")
	}
	fileServer := http.FileServer(root)

	r.GET(path, makeGzipHandler(func(w http.ResponseWriter, req *http.Request, ps httprouter.Params) {
		req.URL.Path = ps.ByName("filepath")
		fileServer.ServeHTTP(w, req)
	}))
}

func runApplicationSimple(applicationState *ApplicationState) {
	gApplicationState = applicationState
	router := httprouter.New();

	router.GET("/", makeGzipHandler(getIndex))
	router.GET("/prices", makeGzipHandler(getPrices))
	router.GET("/packages", makeGzipHandler(getPackages))
	router.GET("/package/:url", makeGzipHandler(getPackage))
	router.GET("/restaurant", makeGzipHandler(getRestaurant))
	router.GET("/location", makeGzipHandler(getLocation))
	router.GET("/gallery", makeGzipHandler(getGallery))

	router.GET("/api/package", getApiPackages)
	router.GET("/api/package/:id", getApiPackage)
	router.GET("/api/photo", getApiPhotos)

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
