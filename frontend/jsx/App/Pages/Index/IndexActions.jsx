import * as Utils from '../../../../js/utils';

export const
	REQUEST_PACKAGES = "INDEX.REQUEST_PACKAGES",
	RECEIVE_PACKAGES = "INDEX.RECEIVE_PACKAGES",
	SET_MODAL_OPEN = "INDEX.SET_MODAL_OPEN";

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
