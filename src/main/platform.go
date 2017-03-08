package main

import (
	"github.com/ua-parser/uap-go/uaparser"
	"regexp"
	"fmt"
)

var windowsRegex = regexp.MustCompile("Windows")
var windowsPhoneRegex = regexp.MustCompile("Windows Phone")
var macRegex = regexp.MustCompile("Mac")
var iosRegex = regexp.MustCompile("iOS")
var androidRegex = regexp.MustCompile("Android")
var blackberryRegex = regexp.MustCompile("BlackBerry")

func getPlatform(ua string) Platform {
	parser, err := uaparser.New("regexes.yaml")
	runtimeAssert(err)
	uas := parser.Parse(ua)
	short := "default"
	if (windowsRegex.MatchString(uas.Os.Family)) {
		short = "win"
	}

	if (windowsPhoneRegex.MatchString(uas.Os.Family)) {
		short = "wp"
	}

	if (macRegex.MatchString(uas.Os.Family)) {
		short = "mac sf"
	}

	if (iosRegex.MatchString(uas.Os.Family)) {
		short = "ios sf"
	}

	if (androidRegex.MatchString(uas.Os.Family)) {
		short = "roboto android"
	}

	if (blackberryRegex.MatchString(uas.Os.Family)) {
		short = "bb10"
	}

	fmt.Println(uas.Os.Family)

	return Platform{
		Short: short,
	}
}