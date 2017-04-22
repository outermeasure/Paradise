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
	onChange(fieldName, fieldValue, clientObject) {
		dispatch(Actions.setClientObject(
			{
				...clientObject,
				[fieldName]: fieldValue,
			}
		));
	},

	onNext() {
		dispatch(Actions.setStep(Steps.PERSONAL_INFORMATION));
	},
});

export default connect(mapStateToProps, mapDispatchToProps)(View);
