import View from './FourOhFourView';
import {
	connect,
} from 'react-redux';

const mapStateToProps = (state) => {
	return {
		...state,
	};
};

const mapDispatchToProps = () => ({});

export default connect(mapStateToProps, mapDispatchToProps)(View);
