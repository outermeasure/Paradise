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

func redirectToHTTPS(w http.ResponseWriter, r *http.Request) {
	ssl := gApplicationState.Configuration.SSL;
	port := ssl.Port;
	host := gApplicationState.Configuration.Host;
	toURL := "https://" + net.JoinHostPort(host, strconv.Itoa(port));
	toURL += r.URL.RequestURI()
	w.Header().Set("Connection", "close")
	http.Redirect(w, r, toURL, http.StatusMovedPermanently)
}

func runApplicationSimple(applicationState *ApplicationState) {
	gApplicationState = applicationState
	router := httprouter.New();

	router.GET("/", getIndex)
	router.GET("/prices", getPrices)
	router.GET("/packages", getPackages)
	router.GET("/package/:url", getPackage)
	router.GET("/restaurant", getRestaurant)
	router.GET("/location", getLocation)
	router.GET("/gallery", getGallery)

	router.GET("/api/package", getApiPackages)
	router.GET("/api/package/:id", getApiPackage)

	router.ServeFiles("/public/*filepath", http.Dir(applicationState.Configuration.Public))
	router.ServeFiles("/static/*filepath", http.Dir(applicationState.Configuration.Data))
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
