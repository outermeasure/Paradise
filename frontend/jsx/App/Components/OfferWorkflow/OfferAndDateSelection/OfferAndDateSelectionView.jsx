import React from 'react';
import Ripple from 'react-paper-ripple';
import * as Colors from '../../../../../js/colors';
import * as Utils from '../../../../../js/utils';
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

	let disableStartDates = (date) =>
    Date.now() - 24 * 3600 * 1000 > date.getTime();

    // Easter
	if (selectedOffer.Id === 23) {
		const oldDisable = disableStartDates;
		disableStartDates = (date) => {
			return oldDisable(date) || Utils.getRoDate(date) !== "27/4/2019";
		};
		if (!startDate) {
			onChangeStartDate(new Date(`2019/04/27`), clientObject);
		}
	}

	// St - Mary
	if (selectedOffer.Id === 29) {
		const oldDisable = disableStartDates;
		disableStartDates = (date) => {
			return oldDisable(date) || Utils.getRoDate(date) !== "15/8/2019";
		};
		if (!startDate) {
			onChangeStartDate(new Date("2019/08/15"), clientObject);
		}
	}

	// Rusalii
	if (selectedOffer.Id === 26) {
		const oldDisable = disableStartDates;
		disableStartDates = (date) => {
			return oldDisable(date) || Utils.getRoDate(date) !== "13/6/2019";
		};
		if (!startDate) {
			onChangeStartDate(new Date("2019/06/13"), clientObject);
		}
	}

	// 1 may
	if (selectedOffer.Id === 25) {
		const oldDisable = disableStartDates;
		disableStartDates = (date) => {
			return oldDisable(date) || Utils.getRoDate(date) !== "30/4/2019";
		};
		if (!startDate) {
			onChangeStartDate(new Date("2019/04/30"), clientObject);
		}
	}

	let explanationString = false;
	if (selectedOffer.Id === 27 || selectedOffer.Id === 30
		|| selectedOffer.Id === 31 || selectedOffer.Id === 32
		|| selectedOffer.Id === 35 || selectedOffer.Id === 36) {

		explanationString = true;
		const oldDisable = disableStartDates;
		disableStartDates = (date) => {
			return oldDisable(date) ||
				date.getDay() !== 0 && date.getDay() !== 4;
		};
	}

	let explanationString2 = false;
	if (selectedOffer.Id === 28) {

		explanationString2 = true;
		const oldDisable = disableStartDates;
		disableStartDates = (date) => {
			return oldDisable(date) ||
				date.getDay() !== 0;
		};
	}

	const areDatesPredefined = selectedOffer.Id === 23 || selectedOffer.Id === 26 || selectedOffer.Id === 25;
	const security = Utils.formatPrice(30 * selectedOffer.Price / 100);

	return <div
		className="popup"
		id="CalendarOptions">
		<StepProgressBar
			steps={Steps.getNumberOfSteps()}
			progress={Steps.getStepIndexByLabel(step) /
			(Steps.getNumberOfSteps() - 1)}/>
		<div className="min-height">
			<h3>{selectedOffer.CardTitle}</h3>
			<form>
				<ul className="vertical-layout">
					<li>
						<DatePicker
							value={startDate}
							disabled={areDatesPredefined}
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
				{explanationString ? <div>
					<p>Pentru aceasta oferta, intrarile se fac doar <strong>joi</strong> si <strong>duminica</strong>.</p>
				</div> : null}
				{explanationString2 ? <div>
					<p>Pentru aceasta oferta, intrarile se fac doar <strong>Duminica</strong>.</p>
				</div> : null}
				<p>Rezervarea se face prin achitarea unui avans de <strong>30%</strong> din costul pachetului ales. Avansul este nerambursabil.</p>
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
				className="primary workflow right">{startDate === null ? "Selecteaza data de inceput": "Pasul Urmator"}
			</PaperRipple>
		</div>
	</div>;
};

View.propTypes = {};

export default View;
