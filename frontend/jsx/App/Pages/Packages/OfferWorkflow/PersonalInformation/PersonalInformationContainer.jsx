import View from './PersonalInformationView';
import * as Actions from '../../PackagesActions';
import * as Steps from '../OfferWorkflowSteps';

import {
	connect,
} from 'react-redux';

const mapStateToProps = (state) => {
	return {
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
		dispatch(Actions.setModalOpen(-1));
	},
});

export default connect(mapStateToProps, mapDispatchToProps)(View);
