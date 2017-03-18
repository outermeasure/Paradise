package main

import (
	"github.com/sheng/air"
	"github.com/sheng/gases"
	"os"
	"io/ioutil"
	"html/template"
	"encoding/json"
)

var gApplicationState *ApplicationState

func readFileMemoized(file string) string {
	if (gApplicationState.Files[file] == "") {
		content, err := ioutil.ReadFile(file)
		runtimeAssert(err)
		gApplicationState.Files[file] = string(content)
	}
	return gApplicationState.Files[file]
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
		o["inline_sync_js_top"] =
			template.JS(readFileMemoized("public/" + m["inline_sync_top"].Js))
	}
	if (m["inline_sync_top"].Css != "") {
		p["inline_sync_css_top"] =
			template.CSS(readFileMemoized("public/" + m["inline_sync_top"].Css))
	}

	if (m["async"].Js != "") {
		n["async_js"] = "/public/" + m["async"].Js
	}

	if (m["async"].Css != "") {
		n["async_css"] = "/public/" + m["async"].Css
	}
	return n, o, p
}

func buildBaseContext(context * air.Context) {
	stat, _ := os.Stat(gApplicationState.Configuration.Assets)
	if stat.ModTime().After(gApplicationState.AssetModificationTime) {
		gApplicationState.Page.UnsafeTemplateData,
			gApplicationState.Page.SafeTemplateJs,
			gApplicationState.Page.SafeTemplateCss =
			loadResources(gApplicationState.Configuration.Assets)
	}
	gApplicationState.Page.Platform = getPlatform(context.Request.UserAgent())

	context.Data["Platform"] = gApplicationState.Page.Platform
	context.Data["Title"] = gApplicationState.Page.Title
	context.Data["UnsafeTemplateData"] = gApplicationState.Page.UnsafeTemplateData
	context.Data["SafeTemplateJs"] = gApplicationState.Page.SafeTemplateJs
	context.Data["SafeTemplateCss"] = gApplicationState.Page.SafeTemplateCss
}

func get(context *air.Context) error {
	buildBaseContext(context)
	context.Data["NavbarSelected"] = 0
	return context.Render("index.gohtml", "layouts/default.gohtml")
}
func getPrices(context *air.Context) error {
	buildBaseContext(context)
	context.Data["NavbarSelected"] = 1
	return context.Render("prices.gohtml", "layouts/default.gohtml")
}
func getOffers(context *air.Context) error {
	buildBaseContext(context)
	context.Data["NavbarSelected"] = 2
	return context.Render("offers.gohtml", "layouts/default.gohtml")
}
func getRestaurant(context *air.Context) error {
	buildBaseContext(context)
	context.Data["NavbarSelected"] = 3
	return context.Render("restaurant.gohtml", "layouts/default.gohtml")
}
func getExperience(context *air.Context) error {
	buildBaseContext(context)
	context.Data["NavbarSelected"] = 4
	return context.Render("experience.gohtml", "layouts/default.gohtml")
}

func getGallery(context *air.Context) error {
	buildBaseContext(context)
	context.Data["NavbarSelected"] = 5
	return context.Render("gallery.gohtml", "layouts/default.gohtml")
}

func post(context *air.Context) error {
	return context.String("post")
}

func del(context *air.Context) error {
	return context.String("del")
}

func put(context *air.Context) error {
	return context.String("put")
}

func runApplication(applicationState *ApplicationState) {
	airServer := air.New()
	airServer.Config.AppName = "Paradise"
	airServer.Config.Address = applicationState.Configuration.Address
	airServer.Config.TemplateRoot = applicationState.Configuration.Templates
	airServer.Config.TemplateExts = []string{"gohtml"}

	airServer.Contain(gases.Recover())
	if (applicationState.Configuration.Mode == "develop") {
		airServer.Config.DebugMode = true
		airServer.Contain(gases.Logger())
	}
	airServer.HTTPErrorHandler = httpErrorHandler
	airServer.Renderer.SetTemplateFunc("last", last)

	airServer.Static("/" + applicationState.Configuration.Public,
		applicationState.Configuration.Public)
	airServer.GET("/", get)
	airServer.GET("/prices", getPrices)
	airServer.GET("/offers", getOffers)
	airServer.GET("/restaurant", getRestaurant)
	airServer.GET("/experience", getExperience)
	airServer.GET("/gallery", getGallery)


	airServer.POST("/", post)
	airServer.DELETE("/", del)
	airServer.PUT("/", put)


	gApplicationState = applicationState
	airServer.Serve()
}

func last(is []interface{}) interface{} {
	if len(is) > 0 {
		return is[len(is)-1]
	}
	return nil
}

func httpErrorHandler(err error, c *air.Context) {
	he := air.ErrInternalServerError
	if che, ok := err.(*air.HTTPError); ok {
		he = che
	} else {
		he.Message = err.Error()
	}
	if !c.Response.Written() {
		c.Response.WriteHeader(he.Code)
		c.Data["SelectedNavIndex"] = -1
		c.Data["PageTitle"] = he.Code
		c.Data["Error"] = he
		c.Render("error.gohtml", "layouts/default.html")
	}
	c.Air.Logger.Error(err)
}