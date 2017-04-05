import React from 'react';
import Ripple from 'react-paper-ripple';
import * as Colors from '../../../../../../js/colors';
import StepProgressBar from
	'../../../../Components/StepProgressBar/StepProgressBar';
import DatePicker from 'material-ui/DatePicker';

const PaperRipple = (props) => <Ripple
	{...props}
	color={Colors.colorLuminance(Colors.PRIMARY, 0.5)}
	opacity={0.4}
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
}) => {
	return <div className="popup" id="PersonalInformation">
		<StepProgressBar steps={4} progress={0.0 / 3}/>
		<div className="min-height">
			<h3>Rezervare</h3>
			<form>
				<ul className="vertical-layout">
				</ul>
			</form>
		</div>
		<div className="actions">
			<PaperRipple
				tag="button"
				type="submit"
				onClick={(e) => {
					e.preventDefault();
					onNext();
				}}
				className="primary right">Pasul urmator
			</PaperRipple>
		</div>
	</div>;
};

View.propTypes = {};

export default View;
