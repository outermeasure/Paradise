import View from './PersonalInformationView';
import * as Actions from '../OfferWorkflowActions';
import * as AppActions from '../../../AppActions';
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
		dispatch(AppActions.setModalOpen(-1));
	},
});

export default connect(mapStateToProps, mapDispatchToProps)(View);
