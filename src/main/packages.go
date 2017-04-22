package main

import (
	"encoding/json"
	"fmt"
)

func getParadisePackages(dataFolder string) []Package {
	type Packages struct {
		Packages   []Package `json:"packages"`
	}
	packages := Packages{}
	file, _ := readFileBytesMemoized(dataFolder + "packages.json")

	if err := json.Unmarshal(file, &packages); err != nil {
		fmt.Println(err)
	}
	return packages.Packages
}


func getParadisePackage(dataFolder string, id int) *Package {
	packages := getParadisePackages(dataFolder)
	for i := 0; i < len(packages); i++ {
		if (packages[i].Id == id) {
			return &packages[i]
		}
	}
	return nil
}


func getParadisePackageByUrl(dataFolder string, url string) *Package {
	packages := getParadisePackages(dataFolder)
	for i := 0; i < len(packages); i++ {
		if (packages[i].Url == url) {
			return &packages[i]
		}
	}
	return nil
}