package main

func getParadisePackages(_ string) []Package {
	return readPackages()
}

func getParadisePackage(_ string, id int) *Package {
	p := readPackageById(id);
	if (p.Id == nil) {
		return nil;
	}
	return &p;
}

func getParadisePackageByUrl(_ string, url string) *Package {
	packages := readPackages()
	for i := 0; i < len(packages); i++ {
		if (packages[i].Url == url) {
			return &packages[i]
		}
	}
	return nil
}