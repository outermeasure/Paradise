import View from './GalleryView';
import * as AppActions from '../../AppActions';
import * as Actions from './GalleryActions';
import {
	connect,
} from 'react-redux';

const mapStateToProps = (state) => {
	return {
		...state.Gallery,
	};
};

const mapDispatchToProps = (dispatch) => ({
	closeModal() {
		dispatch(Actions.setCloseModal());
		dispatch(Actions.setSelectedPhoto(0));
	},
	openPhoto(index) {
		dispatch(Actions.setSelectedPhoto(index));
		dispatch(Actions.setOpenModal());
	},
	nextPhoto() {
		dispatch(Actions.nextPhoto());
	},
	previousPhoto() {
		dispatch(Actions.previousPhoto());
	},
});

export default connect(mapStateToProps, mapDispatchToProps)(View);
