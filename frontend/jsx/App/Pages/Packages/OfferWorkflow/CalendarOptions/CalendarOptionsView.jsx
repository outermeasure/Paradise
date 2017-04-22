import React from 'react';
import Ripple from 'react-paper-ripple';
import * as Colors from '../../../../../../js/colors';
import StepProgressBar from
	'../../../../Components/StepProgressBar/StepProgressBar';
import * as Steps from '../OfferWorkflowSteps';
import DatePicker from '../../../../Components/DatePicker/DatePicker';
import * as Viewport from '../../../../../../js/viewport';
import * as Utils from '../../../../../../js/utils';


const PaperRipple = (props) => <Ripple
	{...props}
	color={Colors.colorLuminance(Colors.PRIMARY, 0.5)}
	opacity={0.4}
	rmConfig={{
		stiffness: 50,
		damping: 20,
	}}
/>;

const DateTimeFormat = global.Intl.DateTimeFormat;


const View = ({
	onChange,
	onNext,
	clientObject,
	offerWorkflowStep,
	screenType,
}) => {

	const {
		startDate,
		endDate,
	} = clientObject;

	const disableStartDates = (date) => (endDate && endDate.getTime() <= date.getTime()) || Date.now() - 24 * 3600 * 1000 > date.getTime();
	const disableEndDates = (date) => startDate && startDate.getTime() >= date.getTime() || Date.now() - 24 * 3600 * 1000 > date.getTime();

	const hasBothDates = startDate && endDate;

	return <div
		className="popup"
		id="CalendarOptions">
		<StepProgressBar
			steps={Steps.getNumberOfSteps()}
			progress={Steps.getStepIndexByLabel(offerWorkflowStep) / (Steps.getNumberOfSteps() - 1)}/>
		<div className="min-height">
			<h3>Perioada rezervare</h3>
			<form>
				<ul className="vertical-layout">
					<li>
						<DatePicker
							value={startDate}
							container="dialog"
							screenType={screenType}
							shouldDisableDate={disableStartDates}
							mode={screenType === Viewport.SCREEN_DESKTOP ? "landscape" : "portrait"}
							onChange={(e, date) => {
								onChange("startDate", date, clientObject);
							}}
							locale="ro"
							DateTimeFormat={DateTimeFormat}
							placeholder={"Din"}/>

					</li>

					<li>
						<DatePicker
							value={endDate}
							disabled={true}
							container="dialog"
							screenType={screenType}
							shouldDisableDate={disableEndDates}
							mode={screenType === Viewport.SCREEN_DESKTOP ? "landscape" : "portrait"}
							onChange={(e, date) => {
								onChange("endDate", date, clientObject);
							}}
							DateTimeFormat={DateTimeFormat}
							locale="ro"
							placeholder={"Pana in"}/>
					</li>
				</ul>
			</form>
			{
				hasBothDates ? <div className="nights">{Utils.getNights(startDate, endDate)}</div> : null
			}
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
