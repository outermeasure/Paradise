import * as Actions from './OfferWorkflowActions';
import * as Steps from './OfferWorkflowSteps';

const
	BASE_PACKAGE = {
		Id: null,
		ShowOnIndexPage: false,
		ShowOnPackagePage: false,
		PageDetailsCoverPhoto: "",
		PageDetailsMarkdown: "",
		Currency: "EUR",
		Url: "",
		Price: 9999,
		CardPhoto: "",
		CardTitle: "",
		CardDescription: "",
		Nights: 0,
	},
	BASE_BOOKING = {
		firstName: "",
		lastName: "",
		phoneNumber: "",
		email: "",
		bookingMessage: "",
		selectedOffer: BASE_PACKAGE,
		privacyAgreement: false,
		startDate: null,
		endDate: null,
	},
	BASE_STATE = {
		step: Steps.PERSONAL_INFORMATION,
		busy: false,
		clientObject: BASE_BOOKING,
	};

const OfferWorkflowReducer = (state = BASE_STATE, action) => {
	switch (action.type) {
		case Actions.SET_STEP:
			return {
				...state,
				step: action.step,
			};
		case Actions.SET_BUSY:
			return {
				...state,
				busy: action.busy,
			};
		case Actions.SET_CLIENT_OBJECT:
			return {
				...state,
				clientObject: action.clientObject,
			};
		default:
			return state;
	}
};

export default OfferWorkflowReducer;
