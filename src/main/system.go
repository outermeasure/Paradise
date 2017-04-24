package main

import (
	"io/ioutil"
	"os"
)

func readFileRaw(file string) []byte {
	content, err := ioutil.ReadFile(file)
	runtimeAssert(err)
	return content
}

func readFileMemoized(file string) (string, bool) {
	needsRead := false
	if (gApplicationState.Files[file] == "") {
		needsRead = true
	}
	stat, _ := os.Stat(file)
	if stat.ModTime().After(gApplicationState.FilesModificationTime[file]) {
		needsRead = true
		gApplicationState.FilesModificationTime[file] = stat.ModTime()
	}

	if needsRead {
		gApplicationState.Files[file] = string(readFileRaw(file))
	}

	return gApplicationState.Files[file], needsRead
}

func readFileBytesMemoized(file string) ([]byte, bool) {
	needsRead := false
	if (gApplicationState.FilesBytes[file] == nil) {
		needsRead = true
	}
	stat, _ := os.Stat(file)
	if stat.ModTime().After(gApplicationState.FilesBytesModificationTime[file]) {
		needsRead = true
		gApplicationState.FilesBytesModificationTime[file] = stat.ModTime()
	}

	if needsRead {
		gApplicationState.FilesBytes[file] = readFileRaw(file)
	}

	return gApplicationState.FilesBytes[file], needsRead
}
