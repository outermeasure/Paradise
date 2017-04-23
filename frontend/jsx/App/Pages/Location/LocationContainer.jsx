import View from './LocationView';
import {
	connect,
} from 'react-redux';

const mapStateToProps = (state, props) => {
	return {
		...props,
	};
};

const mapDispatchToProps = () => ({});

export default connect(mapStateToProps, mapDispatchToProps)(View);
