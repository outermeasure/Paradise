import * as Utils from '../../../../js/utils';

export const
	SET_BUSY = "OFFER_WORKFLOW.SET_BUSY",
	SET_STEP = "OFFER_WORKFLOW.SET_STEP",
	SET_CLIENT_OBJECT = "OFFER_WORKFLOW.SET_CLIENT_OBJECT";

export const
	setStep = (step) => ({
		type: SET_STEP,
		step,
	}),
	setBusy = (busy) => ({
		type: SET_BUSY,
		busy,
	}),
	createOfferBookingRequest = (clientObject, next) => (dispatch) => {
		dispatch(setBusy(true));
		const numberOfNights = Utils.getDaysBetween(
			clientObject.startDate,
			clientObject.endDate);

		const full = clientObject.selectedOffer.Price;
		const security = 30 * full / 100;

		const protocol = location.protocol;
		const slashes = protocol.concat("//");
		let host = slashes.concat(
			window.location.hostname);

		if (window.location.port !== "80" &&
			window.location.port !== "443") {
			host = `${host}:${window.location.port}`;
		}

		const apiObject = {
			firstName: clientObject.firstName,
			lastName: clientObject.lastName,
			phoneNumber: clientObject.phoneNumber,
			email: clientObject.email,
			bookingMessage: clientObject.bookingMessage,
			packageName: clientObject.selectedOffer.Title,
			packageUrl: `${host}/package/${clientObject.selectedOffer.Url}`,
			checkIn: Utils.getRoDate(clientObject.startDate),
			checkOut: Utils.getRoDate(clientObject.endDate),
			duration: numberOfNights > 0 ? numberOfNights === 1 ? "o noapte" :
				`${numberOfNights} nopti` : "o zi",
			security: security,
			total: full,
		};

		Utils.postJSON(
			'/api/package/booking',
			apiObject,
			(response, errors) => {
				dispatch(setBusy(false));
				next(response, errors);
			}
		);
	},
	setClientObject = (clientObject) => ({
		type: SET_CLIENT_OBJECT,
		clientObject,
	});
