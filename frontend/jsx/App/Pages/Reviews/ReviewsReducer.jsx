import * as Actions from './ReviewsActions';

const
    BASE_REVIEWS = {
        receivedAt: -1,
        isFetching: false,
        items: [],
    },
    BASE_STATE = {
        reviews: BASE_REVIEWS,
    };

const ReviewsReducer = (state = BASE_STATE, action) => {
    switch (action.type) {
        case Actions.REQUEST_REVIEWS:
            return {
                ...state,
                reviews: {
                    ...state.reviews,
                    isFetching: true,
                },
            };
        case Actions.RECEIVE_REVIEWS:
            return {
                ...state,
                reviews: {
                    ...state.reviews,
                    isFetching: false,
                    items: action.items,
                    receivedAt: action.receivedAt,
                },
            };
        default:
            return state;
    }
};

export default ReviewsReducer;
