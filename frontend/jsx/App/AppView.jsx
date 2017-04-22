import React from 'react';
import NavigationBar from './Components/NavigationBar/NavigationBar';
import Index from './Pages/Index/IndexContainer';
import Packages from './Pages/Packages/PackagesContainer';
import Package from './Pages/Package/PackageContainer';
import FourOhFour from './Pages/FourOhFour/FourOhFourContainer';

const getPage = (route, parameters) => {
	switch (route) {
		case '/':
			return <Index/>;
		case '/packages':
			return <Packages/>;
		case '/package/:url':
			return <Package
				id={parameters["id"]}
				url={parameters["url"]}
			/>;
		default:
			return <FourOhFour/>;
	}
};

const AppView = ({
	selectedTab,
	route,
	parameters,
}) => {
	return <div>
		<header id="Header">
			<NavigationBar selected={selectedTab}/>
		</header>
		<main>
			{getPage(route, parameters)}
		</main>
	</div>;
};

AppView.propTypes = {
	selectedTab: React.PropTypes.number.isRequired,
	route: React.PropTypes.string.isRequired,
	parameters: React.PropTypes.object,
};
export default AppView;
