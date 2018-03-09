import View from './OfferWorkflowView';
import * as AppActions from '../../AppActions';
import {
	connect,
} from 'react-redux';

const mapStateToProps = (state) => {
	const packages = {};
	if (state.App.route === '/') {
		packages.packages = state.Index.packages.items;
	} else if (state.App.route === '/oferta') {
		packages.packages = state.Packages.packages.items;
	} else if (state.App.route === '/oferta/:url') {
        packages.packages = state.Package.packages.items;
    }

	return {
		...packages,
		...state.OfferWorkflow,
	};
};

const mapDispatchToProps = (dispatch) => ({
	closeModal() {
		dispatch(AppActions.setModalOpen(-1));
	},
});

export default connect(mapStateToProps, mapDispatchToProps)(View);
