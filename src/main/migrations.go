package main

func migrate() {
	packs := readPackages()
	for i := 0; i < len(packs); i++ {
		markdownString, _ := readFileMemoized("data/" + packs[i].PageDetailsMarkdown)
		packs[i].PageDetailsMarkdownString = markdownString
		insertOrUpdatePackage(packs[i])
	}
}

func migrate2() {
	packs := readPackages()
	for i := 0; i < len(packs); i++ {
		c := PackageV2{}
		c.Id = nil

		c.Url = packs[i].Url
		c.Price = packs[i].Price
		c.Currency = "RON"
		c.AllowedDates = nil
		c.Nights = packs[i].Nights

		c.CardTitle = packs[i].Title
		c.CardPhoto = packs[i].Photo
		c.CardDescription = packs[i].Description


		c.PageDetailsCoverPhoto = packs[i].PageDetailsCover
		c.PageDetailsMarkdown = packs[i].PageDetailsMarkdownString

		c.ShowOnIndexPage = packs[i].ShowOnIndexPage
		c.ShowOnPackagePage = packs[i].ShowOnPackagePage

		c.RankOnIndexPage = 0
		c.RankOnPackagePage = 0
		c.Photos = nil

		insertOrUpdatePackage(c);
	}
}
