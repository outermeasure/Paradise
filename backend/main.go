package main

import (
	"encoding/json"
	"fmt"
	"net/http"
	"html/template"
	"regexp"
	"errors"
	"os"
)

type Configuration struct {
	Port int32 `json:"Port"`
}

func loadConfig() *Configuration {
	f, _ := os.Open("../Environment.json")
	defer f.Close()
	d := json.NewDecoder(f)
	m := &Configuration{}
	d.Decode(m)
	return m
}

var templates *template.Template
var validPath *regexp.Regexp

func validatePath(w http.ResponseWriter, r *http.Request) (bool, error) {
	m := validPath.FindStringSubmatch(r.URL.Path)
	if m == nil {
		http.NotFound(w, r)
		return false, errors.New("Invalid path")
	}
	return true, nil
}

func renderTemplate(w http.ResponseWriter, html string) {
	err := templates.ExecuteTemplate(w, html + ".html", nil)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}
}

func indexHandler(w http.ResponseWriter, r *http.Request) {
	valid, _ := validatePath(w, r)
	if (valid) {
		renderTemplate(w, "index")
	}
}

func load() {
	templates, validPath =
		template.Must(template.ParseFiles("templates/index.html")), regexp.MustCompile("^[/]$")
}

func main() {
	fmt.Fprintln(os.Stdout, "Loading...")
	conf := loadConfig()
	load()
	http.HandleFunc("/", indexHandler)
	fmt.Fprintf(os.Stdout, "Running on port %d...\n", conf.Port)
	http.ListenAndServe(fmt.Sprintf(":%d", conf.Port), nil)
}