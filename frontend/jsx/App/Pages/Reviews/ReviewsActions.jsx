import * as Utils from '../../../../js/utils';

export const
    REQUEST_REVIEWS = "PACKAGES.REQUEST_REVIEWS",
	RECEIVE_REVIEWS = "PACKAGES.RECEIVE_REVIEWS";

export const
	requestReviews = () => ({
		type: REQUEST_REVIEWS,
	}),
	receiveReviews = (response) => ({
		type: RECEIVE_REVIEWS,
		items: response,
		receivedAt: Date.now(),
	}),
	fetchReviews = (next) => (dispatch) => {
		dispatch(requestReviews());
		return Utils.getJSON(
			'/api/review',
			(response, error) => {
				if (error) {
					console.log(error);
				} else {
					dispatch(
                        receiveReviews(response)
					);
					next();
				}
			}
		);
	};
