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
	case '/oferta':
		selectedTab = 1;
		break;
	case '/locatie':
		selectedTab = 2;
		break;
	case '/recenzii':
		selectedTab = 3;
		break;
	case '/tarife':
		selectedTab = 4;
		break;
	case '/contact':
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
