import View from './AppView';
import {
	connect,
} from 'react-redux';

const mapStateToProps = (state) => {
	let selectedTab;

	switch (state.App.route) {
	case '/':
		selectedTab = 0;
		break;
	case '/prices':
		selectedTab = 1;
		break;
	case '/packages':
		selectedTab = 2;
		break;
	case '/restaurant':
		selectedTab = 3;
		break;
	case '/location':
		selectedTab = 4;
		break;
	case '/gallery':
		selectedTab = 5;
		break;
	default:
		selectedTab = -1;
	}
	return {
		...state.App,
		selectedTab,
	};
};

const mapDispatchToProps = () => ({

});

export default connect(mapStateToProps, mapDispatchToProps)(View);
