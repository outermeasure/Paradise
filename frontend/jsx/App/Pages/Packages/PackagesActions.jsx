import * as Utils from '../../../../js/utils';
import _ from 'lodash';

export const
	REQUEST_PACKAGES = "PACKAGES.REQUEST_PACKAGES",
	RECEIVE_PACKAGES = "PACKAGES.RECEIVE_PACKAGES",
	SET_MODAL_OPEN = "PACKAGES.SET_MODAL_OPEN",
	SET_OFFER_WORKFLOW_STEP = "PACKAGES.SET_OFFER_WORKFLOW_STEP",
	SET_CLIENT_OBJECT = "PACKAGES.SET_CLIENT_OBJECT";

export const
	requestPackages = () => ({
		type: REQUEST_PACKAGES,
	}),
	receivePackages = (response) => ({
		type: RECEIVE_PACKAGES,
		items: response,
		receivedAt: Date.now(),
	}),
	setModalOpen = (modalOpen) => ({
		type: SET_MODAL_OPEN,
		modalOpen,
	}),
	setOfferWorkflowStep = (offerWorkflowStep) => ({
		type: SET_OFFER_WORKFLOW_STEP,
		offerWorkflowStep,
	}),
	setClientObject = (clientObject) => ({
		type: SET_CLIENT_OBJECT,
		clientObject,
	}),
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
							_.filter(response, (p) => p.ShowOnPackagePage)
						)
					);
					next();
				}
			}
		);
	};
