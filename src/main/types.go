package main

import "html/template"

type UnsafeTemplateData map[string]string
type SafeTemplateJs map[string]template.JS

type Configuration struct {
	Port      int32 `json:"Port"`
	Assets    string `json:"Assets"`
	Public    string `json:"Public"`
	Templates string `json:"Templates"`
}

type VersionedScript struct {
	Js  string `json:"js"`
	Css string `json:"css"`
}

type Page struct {
	SafeTemplateJs SafeTemplateJs
	UnsafeTemplateData UnsafeTemplateData
	Platform  Platform
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
	Short     string
}
