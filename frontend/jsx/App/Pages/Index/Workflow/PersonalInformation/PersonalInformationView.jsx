import React from 'react';
import Ripple from 'react-paper-ripple';
import * as Colors from '../../../../../../js/colors';
import StepProgressBar from
	'../../../../Components/StepProgressBar/StepProgressBar';
import TextField from 'material-ui/TextField'
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
	onChange,
	onNext,
	onBack,
	clientObject,
	workflowStep
}) => {
	return <div className="popup" id="PersonalInformation">
		<StepProgressBar steps={Steps.getNumberOfSteps()}
		                 progress={Steps.getStepIndexByLabel(workflowStep) / (Steps.getNumberOfSteps() - 1)}/>
		<div className="min-height">
			<h3>Informatii personale</h3>
			<form>
				<ul className="vertical-layout">
					<li>
						<TextField
							id="LastName"
							value={clientObject.lastName}
							fullWidth={true}
							className="medium-big"
							floatingLabelText={"Nume"}
							onChange={(e, v) => {
								e.preventDefault();
								onChange("lastName", v, clientObject);
							}}
							type="text"
							hintText="Ex: Pop"/>
					</li>
					<li>
						<TextField
							value={clientObject.firstName}
							fullWidth={true}
							className="medium-big"
							floatingLabelText={"Prenume"}
							onChange={(e, v) => {
								e.preventDefault();
								onChange("firstName", v, clientObject);
							}}
							type="text"
							hintText="Ex: Ioan"/>
					</li>
					<li>
						<TextField
							value={clientObject.phoneNumber}
							fullWidth={true}
							className="medium-big"
							floatingLabelText={"Telefon"}
							onChange={(e, v) => {
								e.preventDefault();
								onChange("phoneNumber", v, clientObject);
							}}
							type="text"
							hintText="XXXX-XXX-XXX"/>
					</li>
					<li>
						<TextField
							value={clientObject.email}
							fullWidth={true}
							className="medium-big"
							floatingLabelText={"Email"}
							onChange={(e, v) => {
								e.preventDefault();
								onChange("email", v, clientObject);
							}}
							type="text"
							hintText="Ex: pop.ioan@gmail.com"/>
					</li>
				</ul>
			</form>
		</div>
		<div className="actions">
			<GrayPaperRipple
				tag="button"
				type="submit"
				onClick={(e) => {
					e.preventDefault();
					onBack();
				}}
				className="flat workflow left">Inapoi
			</GrayPaperRipple>
			<PaperRipple
				tag="button"
				type="submit"
				onClick={(e) => {
					e.preventDefault();
					onNext();
				}}
				className="primary workflow right">Pasul Urmator
			</PaperRipple>
		</div>
	</div>;
};

View.propTypes = {};

export default View;
