import React from 'react';
import * as Steps from './OfferWorkflowSteps';
import PersonalInformation from
	'./PersonalInformation/PersonalInformationContainer';

const getComponentByStep = (step) => {
	switch (step) {
	case Steps.PERSONAL_INFORMATION:
		return <PersonalInformation/>;
	default:
		return null;
	}
};

const View = ({
	closeModal,
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
			getComponentByStep(Steps.PERSONAL_INFORMATION)
		}
	</div>;
};

View.propTypes = {
	modalOpen: React.PropTypes.number,
	closeModal: React.PropTypes.func,
	workflowStep: React.PropTypes.string,
};

export default View;
