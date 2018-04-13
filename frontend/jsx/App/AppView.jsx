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
import Contact from './Pages/Contact/ContactContainer';
import PropTypes from 'prop-types';

const getPage = (route, parameters) => {
    switch (route) {
        case '/':
            return <Index />;
        case '/oferta':
            return <Packages />;
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
            return <Gallery />;
        case '/edit':
            return <Edit />;
        case '/recenzii':
            return <Reviews />;
        case '/contact':
            return <Contact 
                markdownHTML={parameters["markdownHTML"]}
            />;
        default:
            return <FourOhFour />;
    }
};

const AppView = ({
    selectedTab,
    route,
    parameters,
}) => {
    return <div>
        <header id="Header">
            <NavigationBar selected={selectedTab} />
        </header>
        <main id="Content">
            {getPage(route, parameters)}
        </main>
        <footer id="Footer">
            <div className="presentation">
                <div className="main">
                    <div className="row">
                        <div className="four columns">
                            <a href="https://www.facebook.com/ParadiseDeltaHouse/" target="_blank"><i className="icon-067-official"></i> Gaseste-ne pe Facebook</a>
                        </div>
                        <div className="four columns">
                            <a href="https://www.booking.com/hotel/ro/paradise-delta-house.html" target="_blank"><i className="icon-blur_circular"></i>Profilul Booking</a>
                        </div>
                        <div className="four columns">
                            <a href="https://www.tripadvisor.com/Hotel_Review-g1652471-d3292201-Reviews-Pensiunea_Paradise_Delta_House-Sulina_Tulcea_County_Southeast_Romania.html" target="_blank"><i className="icon-0023"></i> Profilul Trip Advisor</a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    </div>;
};

AppView.propTypes = {
    selectedTab: PropTypes.number.isRequired,
    route: PropTypes.string.isRequired,
    parameters: PropTypes.object,
};
export default AppView;
