import * as Utils from '../../../../js/utils';

export const
	SET_ERRORS = "CONTACT.SET_ERRORS",
	SET_CONTACT_OBJECT = "CONTACT.SET_CONTACT_OBJECT",
	SET_BUSY = "CONTACT.SET_BUSY",
	SET_NOTIFICATION = "CONTACT.SET_NOTIFICATION",
	CLEAR_CONTACT_FORM = "CONTACT.CLEAR_CONTACT_FORM";

export const
	setErrors = (errors) => ({
		type: SET_ERRORS,
		errors,
	}),
	setBusy = (busy) => ({
		type: SET_BUSY,
		busy,
	}),
	clearContactForm = () => ({
		type: CLEAR_CONTACT_FORM,
	}),
    setContactObject = (contactObject) => ({
		type: SET_CONTACT_OBJECT,
		contactObject,
	}),
    setNotification = (notificationType) => ({
		type: SET_NOTIFICATION,
		notificationType,
	}),
	onSendMessage = (contactObject) => (dispatch) => {
		dispatch(setBusy(true));

		Utils.postJSON(
			'/api/contact',
			contactObject,
			(response, errors) => {
				dispatch(setBusy(false));

				if (!errors) {
					dispatch(clearContactForm());
					dispatch(setNotification('success'));
				} else {
					dispatch(setNotification('failed'));
				}
			}
		);
	};
