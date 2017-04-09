import React from 'react';
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton';
import * as Steps from '../WorkflowSteps';
import StepProgressBar from
	'../../../../Components/StepProgressBar/StepProgressBar';
import {RoomTypes, Data} from '../WorkflowRoomTypes';
import _ from 'lodash';


const makeRoom = (roomType) => `${Data[roomType].labelRo}`;

const View = ({
	onChange,
	onNext,
	workflowStep,
	clientObject,
}) => {




	return <div className="service">
		<h4>Tip camera</h4>
		<p><span></span></p>
	</div>;
};

View.propTypes = {};

export default View;
