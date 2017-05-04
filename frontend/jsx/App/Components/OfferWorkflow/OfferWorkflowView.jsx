import React from 'react';
import * as Steps from './OfferWorkflowSteps';
import PersonalInformation from
	'./PersonalInformation/PersonalInformationContainer';
import OfferAndDateSelection from
	'./OfferAndDateSelection/OfferAndDateSelectionContainer';
import Confirmation from
	'./Confirmation/ConfirmationContainer';
import BookingMessage from
	'./BookingMessage/BookingMessageContainer';

const getComponentByStep = (step) => {
	switch (step) {
		case Steps.PERSONAL_INFORMATION:
			return <PersonalInformation/>;
		case Steps.OFFER_AND_DATE_SELECTION:
			return <OfferAndDateSelection/>;
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
	step,
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
			getComponentByStep(step)
		}
	</div>;
};

View.propTypes = {
	closeModal: React.PropTypes.func,
	step: React.PropTypes.string,
};

export default View;
