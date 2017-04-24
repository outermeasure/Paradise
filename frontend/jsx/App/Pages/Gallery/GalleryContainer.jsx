import View from './GalleryView';
import * as AppActions from '../../AppActions';
import * as Actions from './GalleryActions';
import {
	connect,
} from 'react-redux';

const mapStateToProps = (state) => {
	return {
		...state.Gallery,
		modalOpen: state.App.modalOpen,
	};
};

const mapDispatchToProps = (dispatch) => ({
	closeModal() {
		dispatch(AppActions.setModalOpen(-1));
	},
	openPhoto(photo) {
		dispatch(Actions.setSelectedPhoto(photo));
		dispatch(AppActions.setModalOpen(2));
	},
});

export default connect(mapStateToProps, mapDispatchToProps)(View);
