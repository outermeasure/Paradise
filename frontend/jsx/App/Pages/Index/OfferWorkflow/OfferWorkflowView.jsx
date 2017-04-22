import React from 'react';
import * as Steps from './OfferWorkflowSteps';
import PersonalInformation from
	'./PersonalInformation/PersonalInformationContainer';
import CalendarOptions from
	'./CalendarOptions/CalendarOptionsContainer';

const getComponentByStep = (step) => {
	switch (step) {
		case Steps.PERSONAL_INFORMATION:
			return <PersonalInformation/>;
		case Steps.CALENDAR_OPTIONS:
			return <CalendarOptions/>;
		default:
			return null;
	}
};

const View = ({
	closeModal,
	offerWorkflowStep,
}) => {
	return <div>
		<div className="close">
			<button onClick={(e) => {
				e.preventDefault();
				closeModal();
			}}>
				<i className="icon-close2"/>
			</button>
		</div>
		{
			getComponentByStep(offerWorkflowStep)
		}
	</div>;
};

View.propTypes = {
	modalOpen: React.PropTypes.number,
	closeModal: React.PropTypes.func,
	workflowStep: React.PropTypes.string,
};

export default View;
