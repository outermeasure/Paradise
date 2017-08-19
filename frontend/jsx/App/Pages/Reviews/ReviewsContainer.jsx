import View from './ReviewsView';

import {
	connect,
} from 'react-redux';

const mapStateToProps = (state) => {
	return {
		...state.Reviews,
	};
};

const mapDispatchToProps = () => ({

});

export default connect(mapStateToProps, mapDispatchToProps)(View);
