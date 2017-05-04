import View from './BookingMessageView';
import * as Actions from '../../IndexActions';
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
	onChange(fieldName, fieldValue, clientObject) {
		dispatch(Actions.setClientObject(
			{
				...clientObject,
				[fieldName]: fieldValue,
			}
		));
	},

	onPrevious() {
		dispatch(Actions.setWorkflowStep(Steps.PERSONAL_INFORMATION));
	},

	onNext(clientObject) {
		dispatch(Actions.createBookingRequest(
			clientObject,
			(response, errors) => {
				if (!errors) {
					dispatch(Actions.setWorkflowStep(Steps.CONFIRMATION));
				}
			}
		));
	},
});

export default connect(mapStateToProps, mapDispatchToProps)(View);
