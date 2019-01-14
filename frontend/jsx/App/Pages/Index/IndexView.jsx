import React from 'react';
import PaperRipple from 'react-paper-ripple';
import * as Colors from '../../../../js/colors';
import * as Utils from '../../../../js/utils';
import Workflow from './Workflow/WorkflowContainer';
import OfferWorkflow from
	'../../Components/OfferWorkflow/OfferWorkflowContainer';
import Modal from '../../Components/Modal/Modal';
import DatePicker from '../../Components/DatePicker/DatePicker';
import * as Viewport from '../../../../js/viewport';
import PropTypes from 'prop-types';

import * as PaddingTools from '../../Components/PaddingTools';

const DateTimeFormat = global.Intl.DateTimeFormat;

const BookTopPaperRipple = (props) => <PaperRipple
	{...props}
	color={Colors.colorLuminance(Colors.PRIMARY, 0.5)}
	opacity={0.4}
	rmConfig={{
		stiffness: 50,
		damping: 20,
	}}
/>;

const BookOfferPaperRipple = (props) => <PaperRipple
	{...props}
	color={Colors.colorLuminance(Colors.ACCENT, 0.9)}
	opacity={0.45}
	rmConfig={{
		stiffness: 50,
		damping: 20,
	}}
/>;

const DetailsPaperRipple = (props) => <PaperRipple
	{...props}
	color={Colors.colorLuminance(Colors.LIGHT, -0.25)}
	opacity={0.3}
	rmConfig={{
		stiffness: 50,
		damping: 20,
	}}
/>;

const CardPaperRipple = (props) => <PaperRipple
	{...props}
	color={Colors.colorLuminance(Colors.LIGHT, -0.1)}
	opacity={0.2}
	rmConfig={{
		stiffness: 50,
		damping: 20,
	}}
/>;

const View = ({
	packages,
	openModal,
	closeModal,
	onChange,
	modalOpen,
	screenType,
	clientObject,
	offerClientObject,
}) => {
	const {
		startDate,
		endDate,
	} = clientObject;

	let startDatePicker = null,
		endDatePicker = null;

	const disableStartDates = (date) =>
		(endDate && endDate.getTime() <= date.getTime()) ||
		Date.now() - 24 * 3600 * 1000 > date.getTime();

	const disableEndDates = (date) =>
		startDate && startDate.getTime() >= date.getTime() ||
		Date.now() - 24 * 3600 * 1000 > date.getTime();

	const openToDate = (datePicker, date) => {
		if (datePicker !== null &&
			datePicker.state.date === undefined &&
			date !== null) {
			datePicker.setState({dialogDate: date})
		}
	};

	return <div id="Index">
		<Modal
			contentLabel={""}
			isOpen={modalOpen !== -1}
			onRequestClose={closeModal}
			shouldCloseOnOverlayClick={true}
			parentSelector={() => document.body}>
			{
				modalOpen === 0 ?
					<Workflow /> : (modalOpen === 1 ? <OfferWorkflow /> : null)
			}
		</Modal>
		<div className="presentation">
			<div className="main">
				<div className="row">
					<div className="short-description six column text-left">
						<h1 className="text"><span>PARADISE DELTA HOUSE</span><br />pensiune de lux<span className="stars">****</span><br />in mijlocul Deltei Dunarii</h1>
						<p>
							Pensiunea este aflată pe o insulă in fața localității Mila 23 și este cel mai bun punct de plecare din Delta Dunării. Îți oferim excursii în sălbăticie, la pescuit sau la Marea Neagră, ca să te poți relaxa în vacanța ta.
						</p>
					</div>
					<div className="six column text-right">
						<div className="row gallery">
							<h2 className="section">
								<i className="icon-photo2"></i> Galerie Foto
							</h2>
							<span className="edenred-logo" title="Posibilitate de plata cu tichete de vacanta: Edenred, Sodexo, Chèque Déjeuner"></span>
							<table className="default-table">
								<tbody>
									<tr>
										<td className="a"><a href="/galerie/pensiune">Pensiune</a></td>
										<td className="b"><a href="/galerie/camere">Camere</a></td>
									</tr>
									<tr>
										<td className="d"><a href="/galerie/excursii">Excursii</a></td>
										<td className="c"><a href="/galerie/pescuit">Pescuit</a></td>
									</tr>
									<tr>
										<td className="e"><a href="/galerie/piscina">Piscina</a></td>
										<td className="f"><a href="/galerie/restaurant">Restaurant</a></td>
									</tr>
								</tbody>
							</table>
						</div>
					</div>
				</div>
				<form className="twelve columns text-center">
					<DatePicker
						ref={(datePicker) => startDatePicker = datePicker}
						injectedTag={
							<h2 className="section abs"><i className="icon-bed"></i> Rezervare Cazare</h2>
						}
						value={startDate}
						container="dialog"
						screenType={screenType}
						autoOk={true}
						shouldDisableDate={disableStartDates}
						mode={screenType === Viewport.SCREEN_DESKTOP ?
							"landscape" : "portrait"}
						onChange={(e, date) => {
							onChange("startDate", date, clientObject);
						}}
						locale="ro"
						DateTimeFormat={DateTimeFormat}
						placeholder={"Din"}
						onShow={() => openToDate(startDatePicker, endDate)}
					/>
					<DatePicker
						ref={(datePicker) => endDatePicker = datePicker}
						value={endDate}
						container="dialog"
						screenType={screenType}
						autoOk={true}
						shouldDisableDate={disableEndDates}
						mode={screenType === Viewport.SCREEN_DESKTOP ?
							"landscape" : "portrait"}
						onChange={(e, date) => {
							onChange("endDate", date, clientObject);
						}}
						DateTimeFormat={DateTimeFormat}
						locale="ro"
						placeholder={"Pana in"}
						onShow={() => openToDate(endDatePicker, startDate)}
					/>
					<BookTopPaperRipple
						tag="button"
						disabled={
							!clientObject.startDate || !clientObject.endDate
						}
						type="submit"
						onClick={(e) => {
							e.preventDefault();
							openModal(0);
						}}
						className="primary big">
						{!clientObject.startDate || !clientObject.endDate ? "Selecteaza perioada" : "Rezervare"}
					</BookTopPaperRipple>
				</form>
			</div>
		</div>
		<div className="main">
			<ul className="card-collection">
				{
					packages.items.map(
						(pack, index) => <li
							key={index}
							className="card">
							{index === 0 ? <h2 className="section abs"><i className="icon-local_offer"></i> Oferte</h2> : null}
							<CardPaperRipple
								className="content"
                                href={`oferta/${pack.Url}`}
								tag="a">
								<img src={pack.CardPhoto} />
								<div className="info">
									<h3>{pack.CardTitle}</h3>
									<p>{pack.CardDescription}</p>
									<div className="price">
										{ pack.Price === 0 ? "La cerere" : (Utils.formatPrice(pack.Price) + " " + pack.Currency + " / persoană") }
									</div>
								</div>
							</CardPaperRipple>
							<div className="actions">
								<DetailsPaperRipple
									onClick={(e) => {
										e.preventDefault();
										window.location =
											`oferta/${pack.Url}`;
									}}
									tag="button">
									Detalii
								</DetailsPaperRipple>
								<BookOfferPaperRipple
									onClick={(e) => {
										e.preventDefault();
										openModal(1, pack,
											offerClientObject);
									}}
									tag="button"
									className="accent">
									Rezervă
								</BookOfferPaperRipple>
							</div>
						</li>)
				}
				{
					PaddingTools.addPadding(3, packages.items.length).map(
						(_, i) => <li key={i} className="card empty" />)
				}
			</ul>
		</div>
	</div>;
};

View.propTypes = {
	packages: PropTypes.shape({
		items: PropTypes.arrayOf(
			PropTypes.shape({
				Price: PropTypes.number.isRequired,
				Currency: PropTypes.string.isRequired,
				CardPhoto: PropTypes.string.isRequired,
				CardTitle: PropTypes.string.isRequired,
				CardDescription: PropTypes.string.isRequired,
			})
		).isRequired,
		isFetching: PropTypes.bool,
		receivedAt: PropTypes.number,
	}),
	openModal: PropTypes.func,
};

export default View;
