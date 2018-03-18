import * as Fetch from '../../../../js/fetch';

export const
	REQUEST_PHOTOS = "GALLERY.REQUEST_PHOTOS",
	RECEIVE_PHOTOS = "GALLERY.RECEIVE_PHOTOS",
	SET_SELECTED_PHOTO = "GALLERY.SET_SELECTED_PHOTO",
	NEXT_PHOTO = "GALLERY.NEXT_PHOTO",
	PREVIOUS_PHOTO = "GALLERY.PREVIOUS_PHOTO",
	SET_OPEN_MODAL = "GALLERY.SET_OPEN_MODAL",
	SET_CLOSE_MODAL = "GALLERY.SET_CLOSE_MODAL";

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
	nextPhoto = () => ({
		type: NEXT_PHOTO,
	}),
	previousPhoto = () => ({
		type: PREVIOUS_PHOTO,
	}),
	setOpenModal = () => ({
		type: SET_OPEN_MODAL,
	}),
	setCloseModal = () => ({
		type: SET_CLOSE_MODAL,
	}),
	fetchPhotos = (page, which, next) => (dispatch) => {
		dispatch(requestPhotos());
		Fetch.Photos.all(
			page,
			which,
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
