import View from './OfferAndDateSelectionView';
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
	onChangeStartDate(fieldValue, clientObject) {
		const startDate = new Date(fieldValue.getTime());
		const endDate = new Date(fieldValue.getTime()
			+ clientObject.selectedOffer.Nights * 24 * 3600 * 1000);
		dispatch(Actions.setClientObject(
			{
				...clientObject,
				startDate: startDate,
				endDate: endDate,
			}
		));
	},

	onNext() {
		dispatch(Actions.setStep(Steps.PERSONAL_INFORMATION));
	},
});

export default connect(mapStateToProps, mapDispatchToProps)(View);
