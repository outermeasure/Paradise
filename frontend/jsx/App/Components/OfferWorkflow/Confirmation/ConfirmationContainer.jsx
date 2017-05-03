import View from './ConfirmationView';
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
	onClose() {
		dispatch(AppActions.setModalOpen(-1));
	},
	fromBeginning() {
		dispatch(Actions.setStep(Steps.OFFER_AND_DATE_SELECTION));
	},
});

export default connect(mapStateToProps, mapDispatchToProps)(View);
