import View from './ConfirmationView';
import * as Actions from '../../IndexActions';
import * as AppActions from '../../../../AppActions';
import * as Steps from '../WorkflowSteps';
import {
	connect,
} from 'react-redux';

const mapStateToProps = (state) => {
	return {
		screenType: state.App.screenType,
		...state.Index,
	};
};

const mapDispatchToProps = (dispatch) => ({
	onClose() {
		dispatch(AppActions.setModalOpen(-1));
	},
	fromBeginning(clientObject) {
		dispatch(Actions.setClientObject(
			{
				...clientObject,
				startDate: null,
				endDate: null,
			}
		));
		dispatch(Actions.setWorkflowStep(Steps.BOOKING_DETAILS));
	},
});

export default connect(mapStateToProps, mapDispatchToProps)(View);
