import React from 'react';
import Modal from 'react-modal';
import * as Steps from './WorkflowSteps';
import PersonalInformation from
	'./PersonalInformation/PersonalInformationContainer';
import ServicesHousing from
	'./Booking/BookingContainer';

const getComponentByStep = (step) => {
	switch (step) {
	case Steps.PERSONAL_INFORMATION:
		return <PersonalInformation/>;
	case Steps.SERVICES_HOUSING:
		return <ServicesHousing/>;
	default:
		return null;
	}
};

const View = ({
	modalOpen,
	closeModal,
	workflowStep,
}) => {
	return <Modal
		contentLabel={""}
		isOpen={modalOpen}
		onRequestClose={closeModal}
		shouldCloseOnOverlayClick={true}
		parentSelector={() => document.body}>
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
	</Modal>;
};

View.propTypes = {
	modalOpen: React.PropTypes.bool,
	closeModal: React.PropTypes.func,
	workflowStep: React.PropTypes.string,
};

export default View;
