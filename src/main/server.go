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

func get(context *air.Context) error {
	stat, _ := os.Stat(gApplicationState.Configuration.Assets)
	if stat.ModTime().After(gApplicationState.AssetModificationTime) {
		gApplicationState.Page.UnsafeTemplateData,
			gApplicationState.Page.SafeTemplateJs =
			loadResources(gApplicationState.Configuration.Assets)
	}
	gApplicationState.Page.Platform = getPlatform(context.Request.UserAgent())

	context.Data["Platform"] = gApplicationState.Page.Platform
	context.Data["Title"] = gApplicationState.Page.Title
	context.Data["UnsafeTemplateData"] = gApplicationState.Page.UnsafeTemplateData
	context.Data["SafeTemplateJs"] = gApplicationState.Page.SafeTemplateJs

	return context.Render("index.gohtml", "layouts/default.gohtml")
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