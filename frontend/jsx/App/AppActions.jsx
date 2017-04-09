export const
	SET_ROUTE = "APP.SET_ROUTE",
	SET_SCREEN_TYPE = "APP.SET_SCREEN_TYPE";

export const
	setRoute = (route) => ({
		type: SET_ROUTE,
		route,
	}),
	setScreenType = (screenType) => ({
		type: SET_SCREEN_TYPE,
		screenType,
	});
