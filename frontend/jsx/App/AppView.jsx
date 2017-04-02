import React from 'react';
import NavigationBar from './Components/NavigationBar/NavigationBar';
import Index from './Pages/Index/IndexContainer';
import Packages from './Pages/Packages/PackagesContainer';
import FourOhFour from './Pages/FourOhFour/FourOhFourContainer';

const getPage = (route) => {
	switch (route) {
	case '/':
		return <Index/>;
	case '/packages':
		return <Packages/>;
	default:
		return <FourOhFour/>;
	}
};

const AppView = ({
	selectedTab,
	route,
}) => {
	return <div>
		<header id="Header">
			<NavigationBar selected={selectedTab}/>
		</header>
		<main>
			{getPage(route)}
		</main>
	</div>;
};

AppView.propTypes = {
	selectedTab: React.PropTypes.number.isRequired,
	route: React.PropTypes.string.isRequired,
};
export default AppView;
