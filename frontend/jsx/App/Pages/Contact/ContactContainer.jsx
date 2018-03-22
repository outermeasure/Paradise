import View from './ContactView';
import * as Actions from './ContactActions';
import { connect, } from 'react-redux';

const mapStateToProps = (state) => {
	return {
		...state.Contact,
	};
};

const mapDispatchToProps = (dispatch) => ({
	onChange(fieldName, fieldValue, contactObject) {
		dispatch(Actions.setContactObject({
				...contactObject,
				[fieldName]: fieldValue,
			}
		));
	},
	setErrors(errors) {
		dispatch(Actions.setErrors(errors));
	},
	setErrors(errors) {
		dispatch(Actions.setErrors(errors));
	},
	onSendMessage(contactObject) {
		dispatch(Actions.onSendMessage(contactObject));
	},
});

export default connect(mapStateToProps, mapDispatchToProps)(View);
