import View from "./PackageView";
import { connect, } from "react-redux";
import * as OfferSteps from "../../Components/OfferWorkflow/OfferWorkflowSteps";
import * as OfferActions
  from "../../Components/OfferWorkflow/OfferWorkflowActions";
import * as AppActions from "../../AppActions";

const mapStateToProps = (state, props) => {
	const pack = state.Package.packages.items.find((pa) => pa.Id == props.id);
	return {
		...props,
		...state.Package,
		offerClientObject: state.OfferWorkflow.clientObject,
		modalOpen: state.App.modalOpen,
		screenType: state.App.screenType,
		pack,
	};
};

const mapDispatchToProps = (dispatch) => ({
	openModal(pack, clientObject) {
		dispatch(
			OfferActions.setClientObject({
				...clientObject,
				startDate: null,
				endDate: null,
				selectedOffer: pack,
			})
		);
		dispatch(OfferActions.setStep(OfferSteps.OFFER_AND_DATE_SELECTION));
		dispatch(AppActions.setModalOpen(1));
	},
	closeModal() {
		dispatch(AppActions.setModalOpen(-1));
	},
});

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(View);
