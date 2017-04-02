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
)

func Template(path string) string {
	return gApplicationState.Configuration.Templates + path;
}

func BaseContext(r *http.Request) *Page {
	stat, _ := os.Stat(gApplicationState.Configuration.Assets)
	if stat.ModTime().After(gApplicationState.AssetModificationTime) {
		gApplicationState.Page.UnsafeTemplateData,
			gApplicationState.Page.SafeTemplateJs,
			gApplicationState.Page.SafeTemplateCss =
			loadResources(gApplicationState.Configuration.Assets)
	}
	page := gApplicationState.Page
	page.Platform = getPlatform(r.UserAgent())
	page.Route = r.URL.Path
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
	context.Packages = getParadisePackages(
		gApplicationState.Configuration.Data,
	)
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
	context.Packages = getParadisePackages(
		gApplicationState.Configuration.Data,
	)
	Render(w, "packages.gohtml", context)
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
	jData, _ := json.Marshal(p.ByName("id"))
	w.Header().Set("Content-Type", "application/json")
	w.Write(jData)
}

var gApplicationState *ApplicationState

func readFileMemoized(file string) (string, bool) {
	loaded := false
	if (gApplicationState.Files[file] == "") {
		content, err := ioutil.ReadFile(file)
		runtimeAssert(err)
		gApplicationState.Files[file] = string(content)
		loaded = true
	}
	return gApplicationState.Files[file], loaded
}

func readFileBytesMemoized(file string) []byte {
	if gApplicationState.FilesBytes[file] == nil {
		content, err := ioutil.ReadFile(file)
		runtimeAssert(err)
		gApplicationState.FilesBytes[file] = content
	}
	return gApplicationState.FilesBytes[file]
}

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

func runApplicationSimple(applicationState *ApplicationState) {
	gApplicationState = applicationState
	router := httprouter.New();

	router.GET("/", getIndex)
	router.GET("/prices", getPrices)
	router.GET("/packages", getPackages)
	router.GET("/restaurant", getRestaurant)
	router.GET("/location", getLocation)
	router.GET("/gallery", getGallery)

	router.GET("/api/package", getApiPackages)
	router.GET("/api/package/:id", getApiPackage)

	router.ServeFiles("/public/*filepath", http.Dir(applicationState.Configuration.Public))
	router.ServeFiles("/static/*filepath", http.Dir(applicationState.Configuration.Data))

	http.ListenAndServe(applicationState.Configuration.Address, router)
}
