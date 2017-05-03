import View from './PersonalInformationView';
import * as Actions from '../OfferWorkflowActions';
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
		dispatch(Actions.setStep(Steps.OFFER_AND_DATE_SELECTION));
	},

	onNext() {
		dispatch(Actions.setStep(Steps.BOOKING_MESSAGE));
	},
});

export default connect(mapStateToProps, mapDispatchToProps)(View);
