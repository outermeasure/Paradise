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
		q.Id = &id
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

	rows, err := db.Query("SELECT Id, Data, Version FROM Packages")
	if (err != nil) {
		log.Error(err)
		return []Package{}
	}
	defer rows.Close()

	a := []Package{}
	for rows.Next() {
		var Data string
		var Id int
		var Version int
		err := rows.Scan(&Id, &Data, &Version)
		if (err != nil) {
			log.Error(err)
			return a
		}

		if (Version != 2) {
			continue
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

func insertOrUpdatePackage(pack interface{}) bool {
	var err error = nil
	var version int
	var db *sql.DB
	var jData []byte = []byte("")
	var create bool = false
	var update bool = false
	var id int

	switch p := pack.(type) {
	case Package:
		create = p.Id == nil
		update = !create
		if update {
			id = *p.Id;
		}

		p.Id = nil
		jData, _ = json.Marshal(p)
	}

	db, err = sql.Open("mysql", gApplicationState.Configuration.DbConnectionString)
	if (err != nil) {
		log.Error(err)
		return false
	}
	defer db.Close()

	switch pack.(type) {
	case Package: {
		version = 2
		break;
	}}

	if create {
		_, err = db.Query(
			"INSERT INTO Packages (Data, Version) VALUES (?, ?)",
			jData,
			version,
		)
	}

	if update {
		_, err = db.Query(
			"UPDATE Packages SET Data=?, Version=? WHERE Id=?",
			jData,
			version,
			id,
		)
	}
	if (err != nil) {
		log.Error(err)
		return false
	}
	return true
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
