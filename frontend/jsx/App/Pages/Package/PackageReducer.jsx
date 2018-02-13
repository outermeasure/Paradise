import * as Actions from './PackageActions';
import * as Steps from '../Index/Workflow/WorkflowSteps';

const
	BASE_PACKAGES = {
		receivedAt: -1,
		isFetching: false,
		items: [],
	},
	BASE_STATE = {
		packages: BASE_PACKAGES,
	};

const PackageReducer = (state = BASE_STATE, action) => {
	switch (action.type) {
		case Actions.REQUEST_PACKAGES:
			return {
				...state,
				packages: {
					...state.packages,
					isFetching: true,
				},
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

export default PackageReducer;
