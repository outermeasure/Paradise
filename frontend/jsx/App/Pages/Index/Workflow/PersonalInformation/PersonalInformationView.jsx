import React from 'react';
import Ripple from 'react-paper-ripple';
import * as Colors from '../../../../../../js/colors';
import StepProgressBar from
	'../../../../Components/StepProgressBar/StepProgressBar';

const PaperRipple = (props) => <Ripple
	{...props}
	color={Colors.colorLuminance(Colors.PRIMARY, 0.5)}
	opacity={0.4}
	rmConfig={{
		stiffness: 50,
		damping: 20,
	}}
/>;

const View = () => {
	return <div className="popup" id="PersonalInformation">
		<StepProgressBar steps={4} progress={0.0 / 3}/>
		<div className="min-height">
			<h3>Informatii personale</h3>
			<form>
				<ul className="vertical-layout">
					<li>
						<label>Nume</label>
						<input
							className="medium-big"
							type="text" placeholder="Ex: Pop"/>
					</li>
					<li>
						<label>Prenume</label>
						<input
							className="medium-big"
							type="text" placeholder="Ex: Ioan"/>
					</li>
					<li>
						<label>Telefon</label>
						<input
							className="medium-big"
							type="text" placeholder="XXXX-XXX-XXX"/>
					</li>
					<li>
						<label>Email</label>
						<input
							className="medium-big"
							type="text" placeholder="Ex: pop.ioan@gmail.com"/>
					</li>
				</ul>
			</form>
		</div>
		<div className="actions">
			<PaperRipple
				tag="button"
				type="submit"
				onClick={(e) => {
					e.preventDefault();
				}}
				className="primary right">Pasul urmator
			</PaperRipple>
		</div>
	</div>;
};

View.propTypes = {};

export default View;
