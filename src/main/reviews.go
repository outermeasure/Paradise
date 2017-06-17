package main

func getParadiseReviews(_ string) []Review {
	return readReviews()
}

func getParadiseReview(_ string, id int) *Review {
	p := readReviewById(id);
	if (p.Id == nil) {
		return nil;
	}
	return &p;
}
