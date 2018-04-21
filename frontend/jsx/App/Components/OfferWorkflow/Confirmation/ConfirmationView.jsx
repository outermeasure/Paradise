import React from 'react';
import Ripple from 'react-paper-ripple';
import * as Colors from '../../../../../js/colors';
import StepProgressBar from
	'../../../Components/StepProgressBar/StepProgressBar';
import * as Steps from '../OfferWorkflowSteps';
import * as Utils from '../../../../../js/utils';

const PaperRipple = (props) => <Ripple
	{...props}
	color={Colors.colorLuminance(Colors.PRIMARY, 0.5)}
	opacity={0.4}
	rmConfig={{
		stiffness: 50,
		damping: 20,
	}}
/>;

const GrayPaperRipple = (props) => <Ripple
	{...props}
	color={Colors.colorLuminance(Colors.LIGHT, -0.25)}
	opacity={0.3}
	rmConfig={{
		stiffness: 50,
		damping: 20,
	}}
/>;

const View = ({
	onClose,
	step,
	fromBeginning,
	clientObject,
}) => {
	const {
		email,
		selectedOffer,
	} = clientObject;
	const numberOfNights = selectedOffer.Nights;
	const full = selectedOffer.Price;
	const security = Utils.formatPrice(30 * full / 100);

	return <div
		className="popup"
		id="Confirmation">
		<StepProgressBar
			steps={Steps.getNumberOfSteps()}
			progress={Steps.getStepIndexByLabel(step) /
			(Steps.getNumberOfSteps() - 1)}/>
		<div className="min-height">
			<h3>Cererea de rezervare pentru { numberOfNights > 0 ? (numberOfNights === 1 ? "o noapte" : `${numberOfNights} nopti`) : "o zi" } a fost efectuata</h3>
			<div className="font-container">
				<i className="icon-circle-check"/>
			</div>
			<p className="payment">Va multumim pentru solicitare !</p>
			<p className="notification">Va vom trimite prin email datele necesare efectuarii rezervarii precum si disponibilitatea.</p>
		</div>
		<div className="actions">
			<GrayPaperRipple
				tag="button"
				type="submit"
				onClick={(e) => {
					e.preventDefault();
					fromBeginning();
				}}
				className="flat workflow left">De la inceput
			</GrayPaperRipple>
			<PaperRipple
				tag="button"
				type="submit"
				onClick={(e) => {
					e.preventDefault();
					onClose();
				}}
				className="primary workflow right">Inchide
			</PaperRipple>
		</div>
	</div>;
};

View.propTypes = {};

export default View;
