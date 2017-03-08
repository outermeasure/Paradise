package main

import (
	"encoding/json"
	"fmt"
	"html/template"
	"io/ioutil"
	"net/http"
	"os"
	"time"
)

const ENVIRONMENT = "Environment.json"

var templates *template.Template
var modificationTime time.Time
var page Page
var configuration Configuration
var files = map[string]string{}

func loadConfig() {
	f, err := os.Open(ENVIRONMENT)
	runtimeAssert(err)
	defer f.Close()
	d := json.NewDecoder(f)
	d.Decode(&configuration)
}

type Strings []string

func (a Strings) Len() int {
	return len(a)
}
func (a Strings) Swap(i, j int) {
	a[i], a[j] = a[j], a[i]
}
func (a Strings) Less(i, j int) bool {
	return a[i] < a[j]
}

func readFileMemoized(file string) string {
	if (files[file] == "") {
		content, err := ioutil.ReadFile(file)
		runtimeAssert(err)
		files[file] = string(content)
	}
	return files[file]
}

func loadResources(filename string) (UnsafeTemplateData, SafeTemplateJs) {

	assets, err := ioutil.ReadFile(filename)
	runtimeAssert(err)
	m := make(map[string]VersionedScript)
	n := make(UnsafeTemplateData)
	o := make(SafeTemplateJs)
	err = json.Unmarshal(assets, &m)
	runtimeAssert(err)

	if (m["inline_sync_js_top"].Js != "") {
		o["inline_sync_js_top"] =
			template.JS(readFileMemoized("public/" + m["inline_sync_js_top"].Js))
	}

	if (m["async_js"].Js != "") {
		n["async_js"] = "/public/" + m["async_js"].Js
	}

	if (m["async_js"].Css != "") {
		n["sync_css_top"] = "/public/" + m["async_js"].Css
	}

	return n, o
}

func renderTemplate(w http.ResponseWriter, html string) {
	err := templates.ExecuteTemplate(w, html, page)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}
}

func indexHandler(w http.ResponseWriter, r *http.Request) {
	stat, _ := os.Stat(configuration.Assets)
	if stat.ModTime().After(modificationTime) {
		page.UnsafeTemplateData,
			page.SafeTemplateJs = loadResources(configuration.Assets)
	}

	page.Platform = getPlatform(r.Header["User-Agent"][0])
	renderTemplate(w, "index.gohtml")
}

func loadApplication() {
	templates =
		template.Must(template.ParseFiles(configuration.Templates + "index.gohtml"))
}

func main() {
	fmt.Fprintln(os.Stdout, "Loading...")
	loadConfig()
	loadApplication()
	http.Handle(
		"/public/",
		http.StripPrefix(
			"/public/",
			http.FileServer(http.Dir(configuration.Public)),
		),
	)
	http.HandleFunc("/", indexHandler)
	fmt.Fprintf(os.Stdout, "Running on port %d...\n", configuration.Port)
	http.ListenAndServe(fmt.Sprintf(":%d", configuration.Port), nil)
}
