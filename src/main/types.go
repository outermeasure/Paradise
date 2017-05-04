package main

import (
	"html/template"
	"time"
	"github.com/ua-parser/uap-go/uaparser"
	"net/http"
)

type UnsafeTemplateData map[string]string
type SafeTemplateJs map[string]template.JS
type SafeTemplateCss map[string]template.CSS

type Configuration struct {
	Host                  string `json:"Host"`
	Port                  int `json:"Port"`
	Assets                string `json:"Assets"`
	Public                string `json:"Public"`
	Data                  string `json:"Data"`
	Templates             string `json:"Templates"`
	Mode                  string `json:"Mode"`
	SSL                   *SSL `json:"SSL,omitempty"`

	GoogleApiKey          *string `json:"GoogleApiKey,omitempty"`
	GoogleApiClientSecret string `json:"GoogleApiClientSecret"`
	GmailAccessToken      string `json:"GmailAccessToken"`
}

type ApplicationState struct {
	Configuration              *Configuration
	Templates                  map[string]*template.Template
	AssetModificationTime      time.Time
	Page                       Page

	Files                      map[string]string
	FilesModificationTime      map[string]time.Time

	FilesBytes                 map[string][]byte
	FilesBytesModificationTime map[string]time.Time

	Parser                     *uaparser.Parser
	GmailClient                *http.Client
}

type VersionedScript struct {
	Js  string `json:"js"`
	Css string `json:"css"`
}

type Page struct {
	SafeTemplateJs           SafeTemplateJs
	UnsafeTemplateData       UnsafeTemplateData
	SafeTemplateCss          SafeTemplateCss
	Platform                 Platform
	Title                    string
	Route                    string
	Parameters               map[string]string
	NavbarSelected           int
	Packages                 []Package
	PackageDetails           *Package
	RenderedPackageMarkdown  template.HTML
	RenderedPackageCover     template.HTMLAttr
	RenderedPricesMarkdown   template.HTML
	RenderedLocationMarkdown template.HTML
	InheritedHTML            template.HTML
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
	Id                  int `json:"Id"`
	ShowOnIndexPage     bool `json:"ShowOnIndexPage"`
	ShowOnPackagePage   bool `json:"ShowOnPackagePage"`
	PageDetailsCover    string `json:"PageDetailsCover"`
	PageDetailsMarkdown string `json:"PageDetailsMarkdown"`
	Url                 string `json:"Url"`
	Price               float64 `json:"Price"`
	Photo               string `json:"Photo"`
	Title               string `json:"Title"`
	Description         string `json:"Description"`
	Nights              int `json:"Nights"`
	Empty               bool
}

type SSL struct {
	Port int `json:"Port"`
	Key  string `json:"Key"`
	Cert string `json:"Cert"`
}

type Photo struct {
	Thumbnail   string `json:"thumbnail"`
	FullPicture string `json:"fullPicture"`
}

type Booking struct {
	FirstName      string `json:"firstName"`
	LastName       string `json:"lastName"`
	PhoneNumber    string `json:"phoneNumber"`
	Email          string `json:"email"`
	BookingMessage string `json:"bookingMessage"`
	RoomType       string `json:"roomType"`

	CheckIn        string `json:"checkIn"`
	CheckOut       string `json:"checkOut"`
	Duration       string `json:"duration"`

	PricePerNight  int `json:"pricePerNight"`
	Security       int `json:"security"`
	Total          int `json:"total"`
}

type PackageBooking struct {
	FirstName      string `json:"firstName"`
	LastName       string `json:"lastName"`
	PhoneNumber    string `json:"phoneNumber"`
	Email          string `json:"email"`
	BookingMessage string `json:"bookingMessage"`
	PackageName    string `json:"packageName"`
	PackageUrl     string `json:"packageUrl"`

	CheckIn        string `json:"checkIn"`
	CheckOut       string `json:"checkOut"`
	Duration       string `json:"duration"`

	Security       int `json:"security"`
	Total          int `json:"total"`
}

type EmailMessage struct {
	To      string
	Subject string
	ReplyTo string
	Body    string
	From    string
}