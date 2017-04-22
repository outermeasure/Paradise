import View from './CalendarOptionsView';
import * as Actions from '../../PackagesActions';
import * as Steps from '../OfferWorkflowSteps';
import {
	connect,
} from 'react-redux';

const mapStateToProps = (state) => {
	return {
		screenType: state.App.screenType,
		...state.Packages,
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
		dispatch(Actions.setOfferWorkflowStep(Steps.PERSONAL_INFORMATION));
	},
});

export default connect(mapStateToProps, mapDispatchToProps)(View);
