package main

import (
	"html/template"
	"time"
	"github.com/ua-parser/uap-go/uaparser"
)

type UnsafeTemplateData map[string]string
type SafeTemplateJs map[string]template.JS
type SafeTemplateCss map[string]template.CSS

type Configuration struct {
	Host      string `json:"Host"`
	Port      int `json:"Port"`
	Assets    string `json:"Assets"`
	Public    string `json:"Public"`
	Data      string `json:"Data"`
	Templates string `json:"Templates"`
	Mode      string `json:"Mode"`
	SSL       *SSL `json:"SSL,omitempty"`
}

type ApplicationState struct {
	Configuration         *Configuration
	Templates             map[string]*template.Template
	AssetModificationTime time.Time
	Page                  Page
	Files                 map[string]string
	FilesBytes            map[string][]byte
	Parser                *uaparser.Parser
}

type VersionedScript struct {
	Js  string `json:"js"`
	Css string `json:"css"`
}

type Page struct {
	SafeTemplateJs     SafeTemplateJs
	UnsafeTemplateData UnsafeTemplateData
	SafeTemplateCss    SafeTemplateCss
	Platform           Platform
	Title              string
	Route              string
	NavbarSelected     int
	Packages           []Package
	InheritedHTML      template.HTML
}

type Engine struct {
	Name    string
	Version string
}

type Browser struct {
	Name    string
	Version string
}

type Platform struct {
	Short string
}

type Package struct {
	Price       float64 `json:"Price"`
	Photo       string `json:"Photo"`
	Title       string `json:"Title"`
	Description string `json:"Description"`
}

type SSL struct {
	Port int `json:"Port"`
	Key  string `json:"Key"`
	Cert string `json:"Cert"`
}