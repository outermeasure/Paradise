import React from 'react';
import Ripple from 'react-paper-ripple';
import * as Colors from '../../../../../../js/colors';
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton';
import * as Steps from '../WorkflowSteps';
import StepProgressBar from
	'../../../../Components/StepProgressBar/StepProgressBar';
import * as RoomTypes from '../WorkflowRoomTypes';
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

const View = ({
	onChange,
	onNext,
	onBack,
	workflowStep,
	clientObject,
}) => {
	const roomTypes = _.toPairs(RoomTypes);


	return <div className="popup" id="BookingView">
		<StepProgressBar steps={Steps.getNumberOfSteps()}
		                 progress={Steps.getStepIndexByLabel(workflowStep) / (Steps.getNumberOfSteps() - 1)}/>
		<div className="min-height">
			<h3>Detalii Rezervare</h3>
				<form>
					<ul className="vertical-layout">
						<li>
							<RadioButtonGroup name="roomType"
							                  valueSelected={clientObject.roomType}
							                  defaultSelected="not_light">
								{
									roomTypes.map(
										rt => <RadioButton
											key={rt[0]}
											label={rt[0]}
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
