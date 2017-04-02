import React from 'react';
import * as Redux from 'redux';
import thunkMiddleware from 'redux-thunk';
import AppReducer from './jsx/App/AppReducer';
import App from './jsx/App/AppContainer';
import * as AppActions from './jsx/App/AppActions';
import * as IndexActions from './jsx/App/Pages/Index/IndexActions.jsx';

import {
	Provider,
} from 'react-redux';
import {
	render,
} from 'react-dom';
import {
	createLogger,
} from 'redux-logger';

const store = Redux.createStore(
	AppReducer,
	Redux.applyMiddleware(
		thunkMiddleware, // lets us dispatch() functions
		createLogger() // neat middleware that logs actions
	)
);

document.addEventListener("touchstart", () => {}, true);
store.dispatch(AppActions.setRoute(window.ROUTE));

if (window.ROUTE === '/') {
	store.dispatch(IndexActions.fetchPackages());
}

render(
	<Provider store={store}>
		<App />
	</Provider>,
	document.getElementById('paradise')
);
