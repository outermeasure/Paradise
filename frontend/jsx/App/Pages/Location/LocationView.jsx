import React from 'react';
import GoogleMap from '../../Components/GoogleMap/GoogleMapContainer';

const View = ({
	markdownHTML,
}) => {
	return <div className="card card-big" id="Location">
		<div
			className="markdown markdown-light"
			dangerouslySetInnerHTML={{
				__html: markdownHTML,
			}}>
		</div>
		<GoogleMap
			className="map-address"
			zoom={10}
			center={{
				lat: 45.229771,
				lng: 29.257587,
			}}/>
	</div>;
};

View.propTypes = {
	markdownHTML: React.PropTypes.string,
	cover: React.PropTypes.string,
	googleMapKey: React.PropTypes.string,
};

export default View;
