package main

import (
	"encoding/json"
	"errors"
	"fmt"
	"html/template"
	"io/ioutil"
	"net/http"
	"os"
	"regexp"
	"time"
)

const ENVIRONMENT = "Environment.json"
var templates *template.Template
var validPath *regexp.Regexp
var modificationTime time.Time
var page Page
var configuration Configuration


func runtimeAssert(err error) {
	if err != nil {
		message := fmt.Sprintf("Assertion failed: %s...", err.Error())
		fmt.Fprintln(os.Stderr, message)
		os.Exit(500)
	}
}

func loadConfig() {
	f, err := os.Open(ENVIRONMENT)
	runtimeAssert(err)
	defer f.Close()
	d := json.NewDecoder(f)
	d.Decode(&configuration)
}

type Strings []string

func (a Strings) Len() int           { return len(a) }
func (a Strings) Swap(i, j int)      { a[i], a[j] = a[j], a[i] }
func (a Strings) Less(i, j int) bool { return a[i] < a[j] }

func loadResources(filename string) *map[string][]string {
	assets, err := ioutil.ReadFile(filename)
	runtimeAssert(err)
	m := make(map[string]VersionedScript)
	n := make(map[string][]string)
	err = json.Unmarshal(assets, &m)
	runtimeAssert(err)

	for _, v := range m {
		if v.Js != "" {
			n["async_js"] = append(n["js"], "/public/"+v.Js)
		}
		if v.Css != "" {
			n["css"] = append(n["css"], "/public/"+v.Css)
		}
	}
	return &n
}

func validatePath(w http.ResponseWriter, r *http.Request) (bool, error) {
	m := validPath.FindStringSubmatch(r.URL.Path)
	if m == nil {
		http.NotFound(w, r)
		return false, errors.New("Invalid path")
	}
	return true, nil
}

func renderTemplate(w http.ResponseWriter, html string) {
	err := templates.ExecuteTemplate(w, html, page)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}
}

func indexHandler(w http.ResponseWriter, r *http.Request) {
	valid, _ := validatePath(w, r)
	if valid {
		stat, _ := os.Stat(configuration.Assets)
		if stat.ModTime().After(modificationTime) {
			page.Resources = loadResources(configuration.Assets)
		}

		page.Platform = getPlatform(r.Header["User-Agent"][0])
		renderTemplate(w, "index.gohtml")
	}
}

func loadApplication() {
	templates, validPath =
		template.Must(template.ParseFiles(configuration.Templates + "index.gohtml")),
		regexp.MustCompile("^[/]$")
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
