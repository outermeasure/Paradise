import View from './IndexView';
import * as Actions from './IndexActions';

import {
	connect,
} from 'react-redux';

const mapStateToProps = (state) => {
	return {
		...state.Index,
	};
};

const mapDispatchToProps = (dispatch) => ({
	openModal() {
		dispatch(Actions.setModalOpen(true));
	},
	closeModal() {
		dispatch(Actions.setModalOpen(false));
	},
	onChange(fieldName, fieldValue, clientObject) {
		dispatch(Actions.setClientObject(
			{
				...clientObject,
				[fieldName]: fieldValue,
			}
		));
	},
});

export default connect(mapStateToProps, mapDispatchToProps)(View);
