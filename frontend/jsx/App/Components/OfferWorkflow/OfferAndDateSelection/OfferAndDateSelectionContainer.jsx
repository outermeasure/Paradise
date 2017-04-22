import View from './OfferAndDateSelectionView';
import * as Actions from '../OfferWorkflowActions';
import * as Steps from '../OfferWorkflowSteps';
import {
	connect,
} from 'react-redux';

const mapStateToProps = (state) => {
	const packages = {};
	if (state.App.route === '/') {
		packages.packages = state.Index.packages.items;
	} else if (state.App.route === '/packages') {
		packages.packages = state.Packages.packages.items;
	}

	return {
		screenType: state.App.screenType,
		...packages,
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
