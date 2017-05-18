import React from 'react';
import * as Steps from './WorkflowSteps';
import PersonalInformation from
	'./PersonalInformation/PersonalInformationContainer';
import BookingDetails from
	'./Booking/BookingDetailsContainer';
import Confirmation from
	'./Confirmation/ConfirmationContainer';
import BookingMessage from
	'./BookingMessage/BookingMessageContainer';
import PropTypes from 'prop-types';

const getComponentByStep = (step) => {
	switch (step) {
		case Steps.PERSONAL_INFORMATION:
			return <PersonalInformation/>;
		case Steps.BOOKING_DETAILS:
			return <BookingDetails/>;
		case Steps.BOOKING_MESSAGE:
			return <BookingMessage/>;
		case Steps.CONFIRMATION:
			return <Confirmation/>;
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
	closeModal: PropTypes.func,
	workflowStep: PropTypes.string,
};

export default View;
