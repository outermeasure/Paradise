import React from 'react';
import Ripple from 'react-paper-ripple';
import * as Colors from '../../../../../../js/colors';
import StepProgressBar from
	'../../../../Components/StepProgressBar/StepProgressBar';
import * as Steps from '../WorkflowSteps';

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
	} = clientObject;
	const security = 30 * 32 / 100;

	return <div
		className="popup"
		id="Confirmation">
		<StepProgressBar
			steps={Steps.getNumberOfSteps()}
			progress={Steps.getStepIndexByLabel(step) /
			(Steps.getNumberOfSteps() - 1)}/>
		<div className="min-height">
			<h3>Rezervare efectuata</h3>
			<div className="font-container">
				<i className="icon-circle-check"/>
			</div>
			<p className="top">Aveti de transferat</p>
			<p className="payment">{security} RON</p>
			<p className="bottom">in decurs de <strong>
				24 de ore</strong></p>
			<p className="notification">V-am trimis email la adresa {email} cu
				pachetul dumneavoastra si detaliile platii.</p>
		</div>
		<div className="actions">
			<GrayPaperRipple
				tag="button"
				type="submit"
				onClick={(e) => {
					e.preventDefault();
					fromBeginning(clientObject);
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
