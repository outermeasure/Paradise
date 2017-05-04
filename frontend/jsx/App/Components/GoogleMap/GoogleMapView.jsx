import React from 'react';

const View = ({
	className,
	googleLibraries,
	loadGoogleLibraries,
	parameters,
	center,
	zoom,
}) => {
	if (googleLibraries === null) {
		loadGoogleLibraries(parameters['GoogleApiKey']);
		return <div
			className={`map ${className}`}></div>;
	}

	let map;
	let marker;
	return <div
		className={`map ${className}`}
		ref={(div) => {
			if (div) {
				map = new googleLibraries.maps.Map(div, {
					center: center,
					zoom: zoom,
				});
				new googleLibraries.maps.Marker({
					position: center,
					map: map,
					title: 'Hotel Paradise',
				});
				new googleLibraries.maps.Marker({
					position: {
						lat: 45.181193,
						lng: 28.804419,
					},
					map: map,
					title: 'Imbarcare Tulcea',
				});
				new googleLibraries.maps.Marker({
					position: {
						lat: 45.229203,
						lng: 29.252907,
					},
					map: map,
					title: 'Casa Francesca',
				});
			} else {
				map = null;
			}
		}}
	></div>;
};

View.propTypes = {
	className: React.PropTypes.string,
	googleLibraries: React.PropTypes.object,
	loadGoogleLibraries: React.PropTypes.func,
	parameters: React.PropTypes.object,
};

export default View;
