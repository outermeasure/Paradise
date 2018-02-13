import * as Utils from '../../../../js/utils';
import _ from 'lodash';

export const
	REQUEST_PACKAGES = "PACKAGES.REQUEST_PACKAGES",
	RECEIVE_PACKAGES = "PACKAGES.RECEIVE_PACKAGES";

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
							_.filter(response, (p) => p.ShowOnPackagePage)
						)
					);
					next();
				}
			}
		);
	};
