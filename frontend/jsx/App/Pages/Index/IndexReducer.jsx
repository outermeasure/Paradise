import * as Actions from './IndexActions.jsx';

const
	BASE_PACKAGES = {
		receivedAt: -1,
		isFetching: false,
		items: [],
	},
	BASE_STATE = {
		packages: BASE_PACKAGES,
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
