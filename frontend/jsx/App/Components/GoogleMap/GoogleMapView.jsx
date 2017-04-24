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
				marker = new googleLibraries.maps.Marker({
					position: center,
					map: map,
					title: 'Hotel Paradise',
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
