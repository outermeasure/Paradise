import View from './WorkflowView';
import * as Actions from '../IndexActions';
import {
	connect,
} from 'react-redux';

const mapStateToProps = (state) => {
	return {
		...state.Index,
	};
};

const mapDispatchToProps = (dispatch) => ({
	closeModal() {
		dispatch(Actions.setModalOpen(false));
	},
});

export default connect(mapStateToProps, mapDispatchToProps)(View);
