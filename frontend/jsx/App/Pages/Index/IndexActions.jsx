import * as Utils from '../../../../js/utils';
import _ from 'lodash';
import * as RoomTypes from './Workflow/WorkflowRoomTypes';

export const
	REQUEST_PACKAGES = "INDEX.REQUEST_PACKAGES",
	RECEIVE_PACKAGES = "INDEX.RECEIVE_PACKAGES",
	SET_WORKFLOW_STEP = "INDEX.SET_WORKFLOW_STEP",
	SET_BUSY = "INDEX.SET_BUSY",
	SET_CLIENT_OBJECT = "INDEX.SET_CLIENT_OBJECT";

export const
	requestPackages = () => ({
		type: REQUEST_PACKAGES,
	}),
	receivePackages = (response) => ({
		type: RECEIVE_PACKAGES,
		items: response,
		receivedAt: Date.now(),
	}),
	setWorkflowStep = (workflowStep) => ({
		type: SET_WORKFLOW_STEP,
		workflowStep,
	}),
	setClientObject = (clientObject) => ({
		type: SET_CLIENT_OBJECT,
		clientObject,
	}),
	setBusy = (busy) => ({
		type: SET_BUSY,
		busy,
	}),
	createBookingRequest = (clientObject, next) => (dispatch) => {
		dispatch(setBusy(true));


		const numberOfNights = Utils.getDaysBetween(
			clientObject.startDate,
            clientObject.endDate);

        const full = Utils.computePrice(
            clientObject.startDate,
            clientObject.endDate,
            RoomTypes.Data[clientObject.roomType].priceLei,
            RoomTypes.Data[clientObject.roomType].priceLeiSeason,
        );

		const security = 30 * full / 100;

		const apiObject = {
			firstName: clientObject.firstName,
			lastName: clientObject.lastName,
			phoneNumber: clientObject.phoneNumber,
			email: clientObject.email,
			nid: clientObject.nid,
			bookingMessage: clientObject.bookingMessage,
			roomType: RoomTypes.Data[clientObject.roomType].labelRo,
			checkIn: Utils.getRoDate(clientObject.startDate),
			checkOut: Utils.getRoDate(clientObject.endDate),
			duration: numberOfNights > 0 ? numberOfNights === 1 ? "o noapte" :
				`${numberOfNights} nopti` : "o zi",
			security: security,
			total: full,
		};

		Utils.postJSON(
			'/api/booking',
			apiObject,
			(response, errors) => {
				dispatch(setBusy(false));
				next(response, errors);
			}
		);
	},
	fetchPackages = (next) => (dispatch) => {
		dispatch(requestPackages());
		return Utils.getJSON(
			'/api/package',
			(response, error) => {
				if (error) {
					console.log(error);
				} else {
					dispatch(
						receivePackages(
							_.filter(response, (p) => p.ShowOnIndexPage)
						)
					);
					next();
				}
			}
		);
	};
