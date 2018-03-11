import View from './WorkflowView';
import * as AppActions from '../../../AppActions';
import * as Actions from './../IndexActions';
import * as Steps from './WorkflowSteps';

import {
	connect,
} from 'react-redux';

const mapStateToProps = (state) => {
	return {
		...state.Index,
	};
};

const mapDispatchToProps = (dispatch) => ({
	closeModal(step) {
		if (step === Steps.CONFIRMATION) {
			dispatch(Actions.clearClientDates());
		}

		dispatch(AppActions.setModalOpen(-1));
	},
});

export default connect(mapStateToProps, mapDispatchToProps)(View);
