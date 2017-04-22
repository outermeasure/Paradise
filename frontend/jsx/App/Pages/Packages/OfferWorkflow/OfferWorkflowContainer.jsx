import View from './OfferWorkflowView';
import * as Actions from '../PackagesActions';
import {
	connect,
} from 'react-redux';

const mapStateToProps = (state) => {
	return {
		...state.Packages,
	};
};

const mapDispatchToProps = (dispatch) => ({
	closeModal() {
		dispatch(Actions.setModalOpen(-1));
	},
});

export default connect(mapStateToProps, mapDispatchToProps)(View);
