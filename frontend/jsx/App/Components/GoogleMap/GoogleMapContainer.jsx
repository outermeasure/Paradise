import View from './GoogleMapView';
import * as AppActions from '../../AppActions';
import {
	connect,
} from 'react-redux';

const asyncLoadGoogleMaps = (apiKey, callback) => {
	if (window.google) {
		callback(window.google);
		return;
	}
	const script = document.createElement('script');
	script.setAttribute(
		'src',
		`https://maps.googleapis.com/maps/api/js?key=${apiKey}` +
		`&callback=GOOGLE_CALLBACK` +
		`&language=ro&region=RO`
	);
	script.setAttribute('async', 'async');
	script.setAttribute('defer', 'defer');

	window.GOOGLE_CALLBACK = () => {
		callback(window.google);
		// Cleanup
		document.getElementsByTagName('body')[0].removeChild(script);
		delete window.GOOGLE_CALLBACK;
	};
	document.getElementsByTagName('body')[0].appendChild(script);
};

const mapStateToProps = (state, props) => {
	return {
		...props,
		...state.App,
	};
};

const mapDispatchToProps = (dispatch) => ({
	closeModal() {
		dispatch(AppActions.setModalOpen(-1));
	},
	loadGoogleLibraries(apiKey) {
		asyncLoadGoogleMaps(
			apiKey,
			(googleLibraries) => {
				dispatch(AppActions.setGoogleLibraries(googleLibraries));
			}
		);
	},
});

export default connect(mapStateToProps, mapDispatchToProps)(View);
