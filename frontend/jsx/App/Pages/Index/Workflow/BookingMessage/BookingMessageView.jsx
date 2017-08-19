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
	workflowStep,
	onPrevious,
	onNext,
	clientObject,
	busy,
	onChange,
}) => {
	const {
		bookingMessage,
	} = clientObject;

	return <div
		className="popup"
		id="BookingMessage">
		<StepProgressBar
			steps={Steps.getNumberOfSteps()}
			progress={Steps.getStepIndexByLabel(workflowStep) /
			(Steps.getNumberOfSteps() - 1)}/>
		<div className="min-height">
			<h3>Mesaj aditional rezervare</h3>
			<div className="font-container">
				<i className="icon-mail"/>
			</div>
			<form>
				<ul className="vertical-layout">
					<li>
						<textarea
							rows={4}
							onBlur={(e) => {
								e.preventDefault();
								onChange(
									"bookingMessage",
									e.target.value, clientObject);
							}}
							placeholder=
								"Va rugam sa specificati numarul si tipul de camere daca doriti mai mult de una"
							defaultValue={bookingMessage}
						>
						</textarea>
					</li>
				</ul>
			</form>
			<em>
				Va vom contacta prin email/telefonic pentru a raspunde la intrebarile adresate.
			</em>
		</div>
		<div className="actions">
			<GrayPaperRipple
				tag="button"
				type="submit"
				onClick={(e) => {
					e.preventDefault();
					onPrevious();
				}}
				className="flat workflow left">Inapoi
			</GrayPaperRipple>
			<PaperRipple
				tag="button"
				type="submit"
				onClick={(e) => {
					e.preventDefault();
					!busy && onNext(clientObject);
				}}
				className="primary workflow right">
				{
					!busy ? "Rezervare" : [
						"Se proceseaza ",
						<i
							key={1}
							className="icon-donut_large spin"/>,
					]
				}
			</PaperRipple>
		</div>
	</div>;
};

View.propTypes = {};

export default View;
