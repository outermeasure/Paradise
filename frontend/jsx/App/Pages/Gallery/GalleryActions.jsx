import * as Fetch from '../../../../js/fetch';

export const
	REQUEST_PHOTOS = "GALLERY.REQUEST_PHOTOS",
	RECEIVE_PHOTOS = "GALLERY.RECEIVE_PHOTOS",
	SET_SELECTED_PHOTO = "GALLERY.SET_SELECTED_PHOTO";

export const
	requestPhotos = () => ({
		type: REQUEST_PHOTOS,
	}),
	receivePhotos = (items, page) => ({
		type: RECEIVE_PHOTOS,
		items: items,
		page: page,
		receivedAt: Date.now(),
	}),
	setSelectedPhoto = (selectedPhoto) => ({
		type: SET_SELECTED_PHOTO,
		selectedPhoto,
	}),
	fetchPhotos = (page, next) => (dispatch) => {
		dispatch(requestPhotos());
		Fetch.Photos.all(
			page,
			(items, error) => {
				if (error) {
					console.log(error);
				} else {
					dispatch(
						receivePhotos(
							items,
							page
						)
					);
					next();
				}
			}
		);
	};
