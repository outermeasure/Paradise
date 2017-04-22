import * as AppActions from './AppActions';
import IndexReducer from './Pages/Index/IndexReducer';
import PackagesReducer from './Pages/Packages/PackagesReducer';
import {
	combineReducers,
} from 'redux';

const BASE_STATE = {
	route: null,
	parameters: null,
	screenType: null,
};

const AppReducer = (state = BASE_STATE, action) => {
	switch (action.type) {
		case AppActions.SET_PARAMETERS:
			return {
				...state,
				parameters: action.parameters,
			};
		case AppActions.SET_SCREEN_TYPE:
			return {
				...state,
				screenType: action.screenType,
			};
		case AppActions.SET_ROUTE:
			return {
				...state,
				route: action.route,
			};
		default:
			return state;
	}
};

export default combineReducers({
	App: AppReducer,
	Index: IndexReducer,
	Packages: PackagesReducer,
});
