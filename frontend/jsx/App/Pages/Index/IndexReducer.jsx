import * as Actions from './IndexActions';
import * as Steps from './Workflow/WorkflowSteps';

const
	BASE_BOOKING = {
		firstName: "",
		lastName: "",
		phoneNumber: "",
		email: "",

		doubleRoom: false,
		singleRoom: false,
		familyRoom: false,

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
		modalOpen: false,
		workflowStep: Steps.SERVICES_HOUSING,
		clientObject: BASE_BOOKING,
	};

const IndexReducer = (state = BASE_STATE, action) => {
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
	case Actions.SET_WORKFLOW_STEP:
		return {
			...state,
			workflowStep: action.workflowStep,
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

export default IndexReducer;
