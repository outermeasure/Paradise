import View from './PackagesView';
import * as OfferWorkflowActions from
	'../../Components/OfferWorkflow/OfferWorkflowActions';
import * as AppActions from '../../AppActions';
import * as OfferSteps from '../../Components/OfferWorkflow/OfferWorkflowSteps';

import {
	connect,
} from 'react-redux';

const mapStateToProps = (state) => {
	return {
		...state.Packages,
		clientObject: state.OfferWorkflow.clientObject,
		modalOpen: state.App.modalOpen,
		screenType: state.App.screenType,
	};
};

const mapDispatchToProps = (dispatch) => ({
	openModal(which, pack, clientObject) {
		switch (which) {
			case 1:
				dispatch(OfferWorkflowActions.setClientObject(
					{
						...clientObject,
						startDate: null,
						endDate: null,
						selectedOffer: pack,
					}
				));
				dispatch(OfferWorkflowActions.setStep(
					OfferSteps.OFFER_AND_DATE_SELECTION));
				break;
			default:
				break;
		}
		dispatch(AppActions.setModalOpen(which));
	},
	closeModal() {
		dispatch(AppActions.setModalOpen(-1));
	},
	onChange(fieldName, fieldValue, clientObject) {
		dispatch(OfferWorkflowActions.setClientObject(
			{
				...clientObject,
				[fieldName]: fieldValue,
			}
		));
	},
});

export default connect(mapStateToProps, mapDispatchToProps)(View);
