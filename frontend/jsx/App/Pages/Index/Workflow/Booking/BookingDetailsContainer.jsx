import View from './BookingDetailsView';
import * as Actions from '../../IndexActions';
import * as Steps from '../WorkflowSteps';

import {
	connect,
} from 'react-redux';

const mapStateToProps = (state) => {
	return {
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
	onNext() {
		dispatch(Actions.setWorkflowStep(Steps.PERSONAL_INFORMATION));
	},
});

export default connect(mapStateToProps, mapDispatchToProps)(View);
