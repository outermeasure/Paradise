import View from './BookingMessageView';
import * as Actions from '../OfferWorkflowActions';
import * as AppActions from '../../../AppActions';
import * as Steps from '../OfferWorkflowSteps';
import {
	connect,
} from 'react-redux';

const mapStateToProps = (state) => {
	return {
		screenType: state.App.screenType,
		...state.OfferWorkflow,
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
		dispatch(Actions.setStep(Steps.PERSONAL_INFORMATION));
	},

	onNext() {
		dispatch(Actions.setStep(Steps.CONFIRMATION));
	},
});

export default connect(mapStateToProps, mapDispatchToProps)(View);
