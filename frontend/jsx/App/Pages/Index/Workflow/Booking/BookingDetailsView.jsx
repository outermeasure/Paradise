import React from 'react';
import Ripple from 'react-paper-ripple';
import * as Colors from '../../../../../../js/colors';
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton';
import * as Steps from '../WorkflowSteps';
import StepProgressBar from
	'../../../../Components/StepProgressBar/StepProgressBar';
import {RoomTypes, Data} from '../WorkflowRoomTypes';
import _ from 'lodash';

const PaperRipple = (props) => <Ripple
	{...props}
	color={Colors.colorLuminance(Colors.PRIMARY, 0.5)}
	opacity={0.4}
	rmConfig={{
		stiffness: 50,
		damping: 20,
	}}
/>;

const styles = {
	block: {
		maxWidth: 250,
	},
	radioButton: {
		marginBottom: 16,
	},
};

const makeRoomLabel = (roomType) => `Camera ${Data[roomType].labelRo} - ${Data[roomType].priceLei} lei / noapte`;

const View = ({
	onChange,
	onNext,
	workflowStep,
	clientObject,
}) => {
	const roomTypes = _.toPairs(RoomTypes);


	return <div className="popup" id="BookingDetails">
		<StepProgressBar steps={Steps.getNumberOfSteps()}
		                 progress={Steps.getStepIndexByLabel(workflowStep) / (Steps.getNumberOfSteps() - 1)}/>
		<div className="min-height">
			<h3>Detalii rezervare</h3>
			<form>
				<ul className="vertical-layout">
					<li>
						<RadioButtonGroup name="roomType"
						                  onChange={
							                  (e, v) => {
								                  e.preventDefault();
								                  onChange("roomType", v, clientObject);
							                  }
						                  }
						                  valueSelected={clientObject.roomType}>
								{
									roomTypes.map(
										rt => <RadioButton
												labelStyle={{color: "auto"}}
												key={rt[0]}
												label={makeRoomLabel(rt[1])}
												value={rt[1]}
												style={styles.radioButton}
											/>
									)
								}
						</RadioButtonGroup>
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
					onNext();
				}}
				className="primary workflow right">Pasul urmator
			</PaperRipple>
		</div>
	</div>;
};

View.propTypes = {};

export default View;
