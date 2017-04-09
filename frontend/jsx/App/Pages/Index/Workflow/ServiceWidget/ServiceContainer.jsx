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
});

export default connect(mapStateToProps, mapDispatchToProps)(View);
