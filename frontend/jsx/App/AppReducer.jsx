import * as AppActions from './AppActions';
import IndexReducer from './Pages/Index/IndexReducer';
import GalleryReducer from './Pages/Gallery/GalleryReducer';
import PackagesReducer from './Pages/Packages/PackagesReducer';
import ReviewsReducer from './Pages/Reviews/ReviewsReducer';
import OfferWorkflowReducer from
	'./Components/OfferWorkflow/OfferWorkflowReducer';
import {
	combineReducers,
} from 'redux';
import PackageReducer from './Pages/Package/PackageReducer';

const BASE_STATE = {
	route: null,
	parameters: null,
	screenType: null,
	googleLibraries: null,
	modalOpen: -1,
};

const AppReducer = (state = BASE_STATE, action) => {
	switch (action.type) {
		case AppActions.SET_MODAL_OPEN:
			return {
				...state,
				modalOpen: action.modalOpen,
			};
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
		case AppActions.SET_GOOGLE_LIBRARIES:
			return {
				...state,
				googleLibraries: action.googleLibraries,
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
	OfferWorkflow: OfferWorkflowReducer,
	Gallery: GalleryReducer,
    Reviews: ReviewsReducer,
    Package: PackageReducer,
});
