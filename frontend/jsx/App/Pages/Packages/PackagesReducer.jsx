import * as Actions from './PackagesActions';
import * as OfferSteps from './OfferWorkflow/OfferWorkflowSteps';

const
	BASE_BOOKING = {
		firstName: "",
		lastName: "",
		phoneNumber: "",
		email: "",

		roomType: 0,

		lunch: false,
		dinner: false,

		boatTransfer: false,

		birdWatching: false,
		northLakes: false,
		letea: false,
		sulina: false,

		startDate: null,
		endDate: null,
	},
	BASE_PACKAGES = {
		receivedAt: -1,
		isFetching: false,
		items: [],
	},
	BASE_STATE = {
		packages: BASE_PACKAGES,
		modalOpen: -1,
		offerWorkflowStep: OfferSteps.PERSONAL_INFORMATION,
		clientObject: BASE_BOOKING,
	};

const PackagesReducer = (state = BASE_STATE, action) => {
	switch (action.type) {
		case Actions.REQUEST_PACKAGES:
			return {
				...state,
				packages: {
					...state.packages,
					isFetching: true,
				},
			};
		case Actions.SET_MODAL_OPEN:
			return {
				...state,
				modalOpen: action.modalOpen,
			};
		case Actions.SET_OFFER_WORKFLOW_STEP:
			return {
				...state,
				offerWorkflowStep: action.offerWorkflowStep,
			};
		case Actions.SET_CLIENT_OBJECT:
			return {
				...state,
				clientObject: action.clientObject,
			};
		case Actions.RECEIVE_PACKAGES:
			return {
				...state,
				packages: {
					...state.packages,
					isFetching: false,
					items: action.items,
					receivedAt: action.receivedAt,
				},
			};
		default:
			return state;
	}
};

export default PackagesReducer;
