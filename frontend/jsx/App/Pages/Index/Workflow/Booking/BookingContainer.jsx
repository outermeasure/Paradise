import View from './BookingView';
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
	onNext() {
		dispatch(Actions.setWorkflowStep(Steps.PERSONAL_INFORMATION));
	},
});

export default connect(mapStateToProps, mapDispatchToProps)(View);
