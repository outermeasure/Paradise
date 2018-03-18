import * as Actions from './GalleryActions';

const
	BASE_PHOTO = {
		thumbnail: "",
		fullPicture: "",
	},
	BASE_PAGE = {
		receivedAt: -1,
		page: -1,
		items: [],
	},
	BASE_PHOTOS = {
		isFetching: false,
		pages: {},
	},
	BASE_STATE = {
		photos: BASE_PHOTOS,
		selectedPhoto: 0,
		isModalOpen: false,
	};

const GalleryReducer = (state = BASE_STATE, action) => {
	switch (action.type) {
		case Actions.SET_SELECTED_PHOTO:
			return {
				...state,
				selectedPhoto: action.selectedPhoto,
			};
		case Actions.NEXT_PHOTO:
			return {
				...state,
				selectedPhoto: state.selectedPhoto + 1,
			};
		case Actions.PREVIOUS_PHOTO:
			return {
				...state,
				selectedPhoto: state.selectedPhoto - 1,
			};
		case Actions.SET_OPEN_MODAL:
			return {
				...state,
				isModalOpen: true,
			};
		case Actions.SET_CLOSE_MODAL:
			return {
				...state,
				isModalOpen: false,
			};
		case Actions.REQUEST_PHOTOS:
			return {
				...state,
				photos: {
					...state.photos,
					isFetching: true,
				},
			};
		case Actions.RECEIVE_PHOTOS:
			return {
				...state,
				photos: {
					...state.photos,
					isFetching: false,
					pages: {
						...state.photos.pages,
						[action.page]: {
							...BASE_PAGE,
							receivedAt: action.receivedAt,
							page: action.page,
							items: action.items,
						},
					},
				},
			};
		default:
			return state;
	}
};

export default GalleryReducer;
