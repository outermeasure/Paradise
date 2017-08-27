import React from 'react';
import NavigationBar from './Components/NavigationBar/NavigationBar';
import Index from './Pages/Index/IndexContainer';
import Packages from './Pages/Packages/PackagesContainer';
import Reviews from './Pages/Reviews/ReviewsContainer';
import Package from './Pages/Package/PackageContainer';
import Prices from './Pages/Prices/PricesContainer';
import Location from './Pages/Location/LocationContainer';
import Edit from './Pages/Edit/Edit';
import Gallery from './Pages/Gallery/GalleryContainer';
import FourOhFour from './Pages/FourOhFour/FourOhFourContainer';
import PropTypes from 'prop-types';

const getPage = (route, parameters) => {
	switch (route) {
		case '/':
			return <Index/>;
		case '/oferte':
			return <Packages/>;
		case '/oferta/:url':
			return <Package
				id={parameters["id"]}
				markdownHTML={parameters["markdownHTML"]}
				cover={parameters["cover"]}
			/>;
		case '/tarife':
			return <Prices
				markdownHTML={parameters["markdownHTML"]}
			/>;
		case '/locatie':
			return <Location
				markdownHTML={parameters["markdownHTML"]}
			/>;
		case '/galerie/:url':
			return <Gallery/>;
		case '/edit':
			return <Edit/>;
		case '/recenzii':
            return <Reviews/>;
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
	selectedTab: PropTypes.number.isRequired,
	route: PropTypes.string.isRequired,
	parameters: PropTypes.object,
};
export default AppView;
