import React from 'react';
import NavigationBar from './Components/NavigationBar/NavigationBar';
import Index from './Pages/Index/IndexContainer';
import Packages from './Pages/Packages/PackagesContainer';
import Package from './Pages/Package/PackageContainer';
import Prices from './Pages/Prices/PricesContainer';
import Location from './Pages/Location/LocationContainer';
import Edit from './Pages/Edit/Edit';
import Gallery from './Pages/Gallery/GalleryContainer';
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
				markdownHTML={parameters["markdownHTML"]}
				cover={parameters["cover"]}
			/>;
		case '/prices':
			return <Prices
				markdownHTML={parameters["markdownHTML"]}
			/>;
		case '/location':
			return <Location
				markdownHTML={parameters["markdownHTML"]}
			/>;
		case '/gallery':
			return <Gallery/>;
		case '/edit':
			return <Edit/>;
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
