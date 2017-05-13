package main

import (
	"database/sql"
	"github.com/labstack/gommon/log"
	"encoding/json"
)

import (
	_ "github.com/go-sql-driver/mysql"
)

func readPackageById(id int) Package {
	db, err := sql.Open("mysql", gApplicationState.Configuration.DbConnectionString)
	if (err != nil) {
		log.Error(err)
		return Package{}
	}
	defer db.Close()

	rows, err := db.Query("SELECT Data FROM Packages WHERE Id=?", id)
	if (err != nil) {
		log.Error(err)
		return Package{}
	}
	defer rows.Close()

	for rows.Next() {
		var Data string
		err := rows.Scan(&Data)
		if (err != nil) {
			log.Error(err)
			return Package{}
		}
		q := Package{}
		err = json.Unmarshal([]byte(Data), &q)
		if (err != nil) {
			log.Error(err)
			return Package{}
		}
		return q
	}
	// Nothing found
	return Package{}
}

func readPackages() []Package {
	db, err := sql.Open("mysql", gApplicationState.Configuration.DbConnectionString)
	if (err != nil) {
		log.Error(err)
		return []Package{}
	}
	defer db.Close()

	rows, err := db.Query("SELECT Id, Data FROM Packages")
	if (err != nil) {
		log.Error(err)
		return []Package{}
	}
	defer rows.Close()

	a := []Package{}
	for rows.Next() {
		var Data string
		var Id int
		err := rows.Scan(&Id, &Data)
		if (err != nil) {
			log.Error(err)
			return a
		}
		q := Package{}
		err = json.Unmarshal([]byte(Data), &q)
		if (err != nil) {
			log.Error(err)
			return a
		}
		q.Id = &Id
		a = append(a, q)
	}
	return a
}

func insertOrUpdatePackage(pack Package) bool {
	db, err := sql.Open("mysql", gApplicationState.Configuration.DbConnectionString)
	if (err != nil) {
		log.Error(err)
		return false
	}
	defer db.Close()

	if pack.Id == nil {
		jData, _ := json.Marshal(pack)
		_, err := db.Query(
			"INSERT INTO Packages (Data) VALUES (?)",
			jData,
		)
		if (err != nil) {
			log.Error(err)
			return false
		}
		return true
	} else {
		jData, _ := json.Marshal(pack)
		_, err := db.Query(
			"UPDATE Packages SET Data=? WHERE ID=?",
			jData,
			*pack.Id,
		)
		if (err != nil) {
			log.Error(err)
			return false
		}
		return true
	}
}

func migrate() {
	packs := readPackages()

	for i := 0; i < len(packs); i++ {
		markdownString, _ := readFileMemoized("data/" + packs[i].PageDetailsMarkdown)
		packs[i].PageDetailsMarkdownString = markdownString;
		insertOrUpdatePackage(packs[i]);
	}
}

func deletePackage(id int) bool {
	db, err := sql.Open("mysql", gApplicationState.Configuration.DbConnectionString)
	if (err != nil) {
		log.Error(err)
		return false
	}
	defer db.Close()
	_, err = db.Query(
		"DELETE FROM Packages WHERE Id=?",
		id,
	)
	if (err != nil) {
		log.Error(err)
		return false
	}
	return true
}
