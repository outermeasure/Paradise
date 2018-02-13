import * as Utils from '../../../../js/utils';
import _ from 'lodash';
import * as RoomTypes from '../Index/Workflow/WorkflowRoomTypes';

export const
	REQUEST_PACKAGES = "PACKAGE.REQUEST_PACKAGES",
    RECEIVE_PACKAGES = "PACKAGE.RECEIVE_PACKAGES";

export const
	requestPackages = () => ({
		type: REQUEST_PACKAGES,
	}),
	receivePackages = (response) => ({
		type: RECEIVE_PACKAGES,
		items: response,
		receivedAt: Date.now(),
	}),
	fetchPackages = (next) => (dispatch) => {
		dispatch(requestPackages());
		return Utils.getJSON(
			'/api/packages',
			(response, error) => {
				if (error) {
					console.log(error);
				} else {
					dispatch(
						receivePackages(
							response
						)
					);
					next();
				}
			}
		);
	};
