import * as Actions from './ContactActions';

const
	BASE_ERRORS = {
		lastName: '',
		firstName: '',
		email: '',
		message: '',
	},
	BASE_CONTACT = {
		lastName: '',
		firstName: '',
		phoneNumber: '',
		email: '',
		message: '',
	},
	BASE_STATE = {
		notificationType: null,
		busy: false,
        errors: BASE_ERRORS,
        contactObject: BASE_CONTACT
	};

const ContactReducer = (state = BASE_STATE, action) => {
	switch (action.type) {
		case Actions.SET_NOTIFICATION:
			return {
				...state,
				notificationType: action.notificationType,
			};
		case Actions.SET_BUSY:
			return {
				...state,
				busy: action.busy,
			};
		case Actions.SET_ERRORS:
			return {
				...state,
				errors: action.errors,
			};
        case Actions.SET_CONTACT_OBJECT:
			return {
				...state,
				contactObject: action.contactObject,
			};
        case Actions.CLEAR_CONTACT_FORM:
			return {
				...state,
				contactObject: {
					lastName: '',
					firstName: '',
					phoneNumber: '',
					email: '',
					message: '',
				}
			};
		default:
			return state;
	}
};

export default ContactReducer;
