import React from 'react';
import * as Steps from './WorkflowSteps';
import PersonalInformation from
	'./PersonalInformation/PersonalInformationContainer';
import BookingDetails from
	'./Booking/BookingDetailsContainer';

const getComponentByStep = (step) => {
	switch (step) {
		case Steps.PERSONAL_INFORMATION:
			return <PersonalInformation/>;
		case Steps.BOOKING_DETAILS:
			return <BookingDetails/>;
		default:
			return null;
	}
};

const View = ({
	closeModal,
	workflowStep,
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
			getComponentByStep(workflowStep)
		}
	</div>;
};

View.propTypes = {
	closeModal: React.PropTypes.func,
	workflowStep: React.PropTypes.string,
};

export default View;
