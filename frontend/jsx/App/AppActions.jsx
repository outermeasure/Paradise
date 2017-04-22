export const
	SET_ROUTE = "APP.SET_ROUTE",
	SET_SCREEN_TYPE = "APP.SET_SCREEN_TYPE",
	SET_PARAMETERS = "APP.SET_PARAMETERS";

export const
	setParameters = (parameters) => ({
		type: SET_PARAMETERS,
		parameters,
	}),
	setRoute = (route) => ({
		type: SET_ROUTE,
		route,
	}),
	setScreenType = (screenType) => ({
		type: SET_SCREEN_TYPE,
		screenType,
	});
