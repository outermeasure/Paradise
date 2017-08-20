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
	case '/tarife':
		selectedTab = 1;
		break;
	case '/oferte':
		selectedTab = 2;
		break;
	case '/restaurant':
		selectedTab = 3;
		break;
	case '/locatie':
		selectedTab = 4;
		break;
	case '/galerie':
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
