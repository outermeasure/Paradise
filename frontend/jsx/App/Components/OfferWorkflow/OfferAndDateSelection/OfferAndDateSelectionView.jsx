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

	// St - Mary
	if (selectedOffer.Id === 29) {
		const oldDisable = disableStartDates;
		disableStartDates = (date) => {
			return oldDisable(date) || Utils.getRoDate(date) !== "13/8/2017";
		};
		if (!startDate) {
			onChangeStartDate(new Date("2017/08/13"), clientObject);
		}
	}

	// Rusalii
	if (selectedOffer.Id === 26) {
		const oldDisable = disableStartDates;
		disableStartDates = (date) => {
			return oldDisable(date) || Utils.getRoDate(date) !== "1/6/2017";
		};
		if (!startDate) {
			onChangeStartDate(new Date("2017/06/01"), clientObject);
		}
	}

	// 1 may
	if (selectedOffer.Id === 25) {
		const oldDisable = disableStartDates;
		disableStartDates = (date) => {
			return oldDisable(date) || Utils.getRoDate(date) !== "28/4/2017";
		};
		if (!startDate) {
			onChangeStartDate(new Date("2017/04/28"), clientObject);
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

	const security = 30 * selectedOffer.Price / 100;

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
					Pentru aceasta oferta, intrarile se fac doar <strong>
					joi</strong> si <strong>duminica</strong>.
					<br/>
				</div> : null}
				{explanationString2 ? <div>
					Pentru aceasta oferta, intrarile se fac doar <strong>
					Duminica</strong>.
					<br/>
				</div> : null}
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
				className="primary workflow right">{startDate === null ? "Selecteaza data de inceput": "Pasul Urmator"}
			</PaperRipple>
		</div>
	</div>;
};

View.propTypes = {};

export default View;
