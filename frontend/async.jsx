import React from 'react';
import * as Redux from 'redux';
import thunkMiddleware from 'redux-thunk';
import AppReducer from './jsx/App/AppReducer';
import App from './jsx/App/AppContainer';
import * as AppActions from './jsx/App/AppActions';
import * as IndexActions from './jsx/App/Pages/Index/IndexActions';
import * as PackagesActions from './jsx/App/Pages/Packages/PackagesActions';
import * as PackageAction from './jsx/App/Pages/Package/PackageActions';
import * as ReviewsActions from './jsx/App/Pages/Reviews/ReviewsActions';
import * as GalleryActions from './jsx/App/Pages/Gallery/GalleryActions';
import injectTapEventPlugin from 'react-tap-event-plugin';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppTheme from './jsx/App/AppTheme';
import {
	addOnScreenTypeChangedListener,
} from './js/viewport';
import {
	Provider,
} from 'react-redux';
import {
	render,
} from 'react-dom';
import {
	createLogger,
} from 'redux-logger';

if (window.localStorage) {
	if (window.PARAMETERS.hasOwnProperty("PseudoAuthorization")) {
		window.localStorage.setItem("XAUTHORIZATION",
			window.PARAMETERS.PseudoAuthorization);
		window.location = '/edit';
	}
}
if (window.PARAMETERS.hasOwnProperty("PseudoAuthorization")) {
	delete window.PARAMETERS.PseudoAuthorization;
}

let middleware;

if (window.PARAMETERS.ExplicitRuntimeMode === "develop") {
	middleware = Redux.applyMiddleware(
		thunkMiddleware, // lets us dispatch() functions
		createLogger() // neat middleware that logs actions
	);
} else {
	middleware = Redux.applyMiddleware(
		thunkMiddleware // lets us dispatch() functions
	);
}

const store = Redux.createStore(
	AppReducer,
	middleware
);

document.addEventListener("touchstart", () => {
}, true);
injectTapEventPlugin();

addOnScreenTypeChangedListener(
	(screenType) => {
		store.dispatch(AppActions.setScreenType(screenType));
	}
);

store.dispatch(AppActions.setRoute(window.ROUTE));
store.dispatch(AppActions.setParameters(window.PARAMETERS));

const renderApplication = () => {
	render(
		<Provider store={store}>
			<MuiThemeProvider muiTheme={getMuiTheme(AppTheme)}>
				<App />
			</MuiThemeProvider>
		</Provider>,
		document.getElementById('paradise')
	);
};
if (window.ROUTE === '/') {
	store.dispatch(IndexActions.fetchPackages(
		renderApplication
	));
} else if (window.ROUTE === '/oferta') {
	store.dispatch(PackagesActions.fetchPackages(
		renderApplication
	));
} else if (window.ROUTE === '/oferta/:url') {
	store.dispatch(PackageAction.fetchPackages(
		renderApplication
	));
} else if (window.ROUTE.substr(0, 8) === '/galerie') {
	store.dispatch(GalleryActions.fetchPhotos(
		0,
		window.PARAMETERS["Gallery"],
		renderApplication
	));
} else if (window.ROUTE === '/recenzii') {
    store.dispatch(ReviewsActions.fetchReviews(
        renderApplication
    ));
} else {
	renderApplication();
}
