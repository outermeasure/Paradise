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
