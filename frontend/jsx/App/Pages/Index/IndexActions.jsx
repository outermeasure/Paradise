import * as Utils from '../../../../js/utils';

export const
	REQUEST_PACKAGES = "INDEX.REQUEST_PACKAGES",
	RECEIVE_PACKAGES = "INDEX.RECEIVE_PACKAGES",
	SET_MODAL_OPEN = "INDEX.SET_MODAL_OPEN",
	SET_WORKFLOW_STEP = "INDEX.SET_WORKFLOW_STEP",
	SET_OFFER_WORKFLOW_STEP = "INDEX.SET_OFFER_WORKFLOW_STEP",
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
	setModalOpen = (modalOpen) => ({
		type: SET_MODAL_OPEN,
		modalOpen,
	}),
	setWorkflowStep = (workflowStep) => ({
		type: SET_WORKFLOW_STEP,
		workflowStep,
	}),
	setOfferWorkflowStep = (offerWorkflowStep) => ({
		type: SET_OFFER_WORKFLOW_STEP,
		offerWorkflowStep,
	}),
	setClientObject = (clientObject) => ({
		type: SET_CLIENT_OBJECT,
		clientObject,
	}),
	fetchPackages = () => (dispatch) => {
		dispatch(requestPackages());
		return Utils.getJSON(
			'/api/package',
			(response, error) => {
				if (error) {
					console.log(error);
				} else {
					dispatch(receivePackages(response));
				}
			}
		);
	};
