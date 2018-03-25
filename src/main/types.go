package main

import (
	"html/template"
	"net/http"
	"time"

	"github.com/ua-parser/uap-go/uaparser"
)

type UnsafeTemplateData map[string]string
type SafeTemplateJs map[string]template.JS
type SafeTemplateCss map[string]template.CSS

type Configuration struct {
	Host      string `json:"Host"`
	Port      int    `json:"Port"`
	Assets    string `json:"Assets"`
	Public    string `json:"Public"`
	Data      string `json:"Data"`
	Templates string `json:"Templates"`
	Mode      string `json:"Mode"`
	SSL       *SSL   `json:"SSL,omitempty"`

	GoogleApiKey          *string `json:"GoogleApiKey,omitempty"`
	GoogleApiClientSecret *string `json:"GoogleApiClientSecret"`
	GmailAccessToken      *string `json:"GmailAccessToken"`

	PropertyOwnerEmailAddress string `json:"PropertyOwnerEmailAddress"`

	DbConnectionString                  string `json:"DbConnectionString"`
	PseudoSecureUrl                     string `json:"PseudoSecureUrl"`
	GoogleSiteVerification              string `json:"GoogleSiteVerification"`
	HotelParadiseGoogleSiteVerification string `json:"HotelParadiseGoogleSiteVerification"`
}

type ApplicationState struct {
	Configuration         *Configuration
	Templates             map[string]*template.Template
	AssetModificationTime time.Time
	Page                  Page

	Files                 map[string]string
	FilesModificationTime map[string]time.Time

	FilesBytes                 map[string][]byte
	FilesBytesModificationTime map[string]time.Time

	Parser      *uaparser.Parser
	GmailClient *http.Client
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

	SEODescription         string
	SEOKeywords            string
	SEOContentLanguage     string
	GoogleSiteVerification string

	Route          string
	Parameters     map[string]string
	NavbarSelected int

	Packages []Package
	Reviews  []Review
	Padding  []byte

	PackageDetails           *Package
	RenderedPackageMarkdown  template.HTML
	RenderedPackageTitle     string
	RenderedPackageCover     template.HTMLAttr
	RenderedPricesMarkdown   template.HTML
	RenderedLocationMarkdown template.HTML
	RenderedContactMarkdown  template.HTML
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
	Id *int `json:"Id,omitempty"`

	Url          string       `json:"Url"`
	Price        float64      `json:"Price"`
	Currency     string       `json:"Currency"`
	AllowedDates *[]time.Time `json:"AllowedDates,omitempty"`
	Nights       int          `json:"Nights"`
	Title        *string      `json:"Title,omitempty"`

	CardTitle       string `json:"CardTitle"`
	CardPhoto       string `json:"CardPhoto"`
	CardDescription string `json:"CardDescription"`

	SEOTitle           *string `json:"SEOTitle,omitempty"`
	SEOKeywords        *string `json:"SEOKeywords,omitempty"`
	SEOContentLanguage *string `json:"SEOContentLanguage,omitempty"`
	SEODescription     *string `json:"SEODescription,omitempty"`

	PageDetailsCoverPhoto string `json:"PageDetailsCoverPhoto"`
	PageDetailsMarkdown   string `json:"PageDetailsMarkdown"`

	ShowOnIndexPage   bool `json:"ShowOnIndexPage"`
	ShowOnPackagePage bool `json:"ShowOnPackagePage"`

	RankOnIndexPage   float64 `json:"RankOnIndexPage"`
	RankOnPackagePage float64 `json:"RankOnPackagePage"`

	Photos *[]string `json:"Photos,omitempty"`
}

type ByIndexPage []Package

func (s ByIndexPage) Len() int {
	return len(s)
}
func (s ByIndexPage) Swap(i, j int) {
	s[i], s[j] = s[j], s[i]
}
func (s ByIndexPage) Less(i, j int) bool {
	return s[i].RankOnIndexPage < s[j].RankOnIndexPage
}

type ByPackagePage []Package

func (s ByPackagePage) Len() int {
	return len(s)
}
func (s ByPackagePage) Swap(i, j int) {
	s[i], s[j] = s[j], s[i]
}
func (s ByPackagePage) Less(i, j int) bool {
	return s[i].RankOnPackagePage < s[j].RankOnPackagePage
}

type SSL struct {
	Port int    `json:"Port"`
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
	Nid            string `json:"nid"`
	BookingMessage string `json:"bookingMessage"`
	RoomType       string `json:"roomType"`

	CheckIn  string `json:"checkIn"`
	CheckOut string `json:"checkOut"`
	Duration string `json:"duration"`

	IsClient bool

	Security int `json:"security"`
	Total    int `json:"total"`
}

type ContactForm struct {
	FirstName   string `json:"firstName"`
	LastName    string `json:"lastName"`
	PhoneNumber string `json:"phoneNumber"`
	Email       string `json:"email"`
	Message     string `json:"message"`
}

type PackageBooking struct {
	FirstName   string `json:"firstName"`
	LastName    string `json:"lastName"`
	PhoneNumber string `json:"phoneNumber"`
	Email       string `json:"email"`
	Nid         string `json:"nid"`

	BookingMessage string `json:"bookingMessage"`
	PackageName    string `json:"packageName"`
	PackageUrl     string `json:"packageUrl"`

	CheckIn  string `json:"checkIn"`
	CheckOut string `json:"checkOut"`
	Duration string `json:"duration"`

	IsClient bool

	Security int `json:"security"`
	Total    int `json:"total"`

	Currency string `json:"currency"`
}

type EmailMessage struct {
	To      string
	Subject string
	ReplyTo string
	Body    string
	From    string
}

type Review struct {
	Id      *int `json:"Id,omitempty"`
	Name    string
	Date    string
	Content string
}
