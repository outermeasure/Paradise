import React from 'react';
import Ripple from 'react-paper-ripple';
import * as Colors from '../../../../../js/colors';
import StepProgressBar from
	'../../../Components/StepProgressBar/StepProgressBar';
import * as Steps from '../OfferWorkflowSteps';
import DatePicker from '../../../Components/DatePicker/DatePicker';
import * as Viewport from '../../../../../js/viewport';

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
	onChangeStartDate,
	onNext,
	clientObject,
	step,
	screenType,
}) => {

	const {
		startDate,
		endDate,
		selectedOffer,
	} = clientObject;

	const disableStartDates = (date) =>
		Date.now() - 24 * 3600 * 1000 > date.getTime();

	const security = 30 * selectedOffer.Price / 100;

	return <div
		className="popup"
		id="CalendarOptions">
		<StepProgressBar
			steps={Steps.getNumberOfSteps()}
			progress={Steps.getStepIndexByLabel(step) /
				(Steps.getNumberOfSteps() - 1)}/>
		<div className="min-height">
			<h3>{selectedOffer.Title}</h3>
			<form>
				<ul className="vertical-layout">
					<li>
						<DatePicker
							value={startDate}
							container="dialog"
							autoOk={true}
							screenType={screenType}
							shouldDisableDate={disableStartDates}
							mode={screenType === Viewport.SCREEN_DESKTOP ?
								"landscape" : "portrait"}
							onChange={(e, date) => {
								onChangeStartDate(date, clientObject);
							}}
							locale="ro"
							DateTimeFormat={DateTimeFormat}
							placeholder={"Din"}/>

					</li>

					<li>
						<DatePicker
							value={endDate}
							disabled={true}
							autoOk={true}
							container="dialog"
							screenType={screenType}
							mode={screenType === Viewport.SCREEN_DESKTOP ?
								"landscape" : "portrait"}
							DateTimeFormat={DateTimeFormat}
							locale="ro"
							placeholder={"Pana in"}/>
					</li>
				</ul>
			</form>
			<em>
				Plata avansului de {security} lei nerambursabil
				trebuie efectuata in cel mult 24 de ore dupa
				completarea rezervarii online pentru confirmarea
				acesteia
			</em>
		</div>
		<div className="actions">
			<PaperRipple
				tag="button"
				disabled={startDate === null}
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
