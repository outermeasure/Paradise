import View from './IndexView';
import * as Actions from './IndexActions';
import * as Steps from './Workflow/WorkflowSteps';
import * as OfferSteps from '../../Components/OfferWorkflow/OfferWorkflowSteps';
import * as OfferActions from
	'../../Components/OfferWorkflow/OfferWorkflowActions';
import * as AppActions from '../../AppActions';

import {
	connect,
} from 'react-redux';

const mapStateToProps = (state) => {
	return {
		...state.Index,
		offerClientObject: state.OfferWorkflow.clientObject,
		modalOpen: state.App.modalOpen,
		screenType: state.App.screenType,
	};
};

const mapDispatchToProps = (dispatch) => ({
	openModal(which, pack, clientObject) {
		switch (which) {
			case 0:
				dispatch(Actions.setWorkflowStep(Steps.BOOKING_DETAILS));
				break;
			case 1:
				dispatch(OfferActions.setClientObject(
					{
						...clientObject,
						startDate: null,
						endDate: null,
						selectedOffer: pack,
					}
				));
				dispatch(OfferActions.setStep(
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
		dispatch(Actions.setClientObject(
			{
				...clientObject,
				[fieldName]: fieldValue,
			}
		));
	},
});

export default connect(mapStateToProps, mapDispatchToProps)(View);
