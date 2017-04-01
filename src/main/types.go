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
	Address   string `json:"Address"`
	Assets    string `json:"Assets"`
	Public    string `json:"Public"`
	Data 			string `json:"Data"`
	Templates string `json:"Templates"`
	Mode      string `json:"Mode"`
}

type ApplicationState struct {
	Configuration         *Configuration
	Templates             *template.Template
	AssetModificationTime time.Time
	Page                  Page
	Files                 map[string]string
	Parser                *uaparser.Parser
	Offers								[]Offer
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
	NavbarSelected     string
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

type Offer struct {
	Price       float64
	Photo       string
	Title       string
	Description string
}