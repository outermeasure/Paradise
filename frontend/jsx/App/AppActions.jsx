export const
	SET_ROUTE = "APP.SET_ROUTE",
	SET_MODAL_OPEN = "APP.SET_MODAL_OPEN",
	SET_GOOGLE_LIBRARIES = 'APP.SET_GOOGLE_LIBRARIES',
	SET_SCREEN_TYPE = "APP.SET_SCREEN_TYPE",
	SET_PARAMETERS = "APP.SET_PARAMETERS";

export const
	setModalOpen = (modalOpen) => ({
		type: SET_MODAL_OPEN,
		modalOpen,
	}),
	setParameters = (parameters) => ({
		type: SET_PARAMETERS,
		parameters,
	}),
	setRoute = (route) => ({
		type: SET_ROUTE,
		route,
	}),
	setGoogleLibraries = (googleLibraries) => ({
		type: SET_GOOGLE_LIBRARIES,
		googleLibraries,
	}),
	setScreenType = (screenType) => ({
		type: SET_SCREEN_TYPE,
		screenType,
	});
