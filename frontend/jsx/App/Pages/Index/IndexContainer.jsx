import View from './IndexView';
import * as Actions from './IndexActions';
import * as Steps from './Workflow/WorkflowSteps';
import * as OfferSteps from './OfferWorkflow/OfferWorkflowSteps';

import {
	connect,
} from 'react-redux';

const mapStateToProps = (state) => {
	return {
		...state.Index,
		screenType: state.App.screenType,
	};
};

const mapDispatchToProps = (dispatch) => ({
	openModal(which) {
		switch (which) {
			case 0:
				dispatch(Actions.setWorkflowStep(Steps.BOOKING_DETAILS));
				break;
			case 1:
				dispatch(Actions.setOfferWorkflowStep(OfferSteps.CALENDAR_OPTIONS));
				break;
			default:
				break;
		}
		dispatch(Actions.setModalOpen(which));
	},
	closeModal() {
		dispatch(Actions.setModalOpen(-1));
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
