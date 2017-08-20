import React from 'react';
import PaperRipple from 'react-paper-ripple';
import * as Colors from '../../../../js/colors';
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

	const disableStartDates = (date) =>
	(endDate && endDate.getTime() <= date.getTime()) ||
	Date.now() - 24 * 3600 * 1000 > date.getTime();

	const disableEndDates = (date) =>
	startDate && startDate.getTime() >= date.getTime() ||
	Date.now() - 24 * 3600 * 1000 > date.getTime();

	return <div>
		<Modal
			contentLabel={""}
			isOpen={modalOpen !== -1}
			onRequestClose={closeModal}
			shouldCloseOnOverlayClick={true}
			parentSelector={() => document.body}>
			{
				modalOpen === 0 ?
					<Workflow/> : (modalOpen === 1 ? <OfferWorkflow/> : null)
			}
		</Modal>
		<div className="presentation">
			<div className="main">
				<div className="phone-number">(+4)0755-248-260</div>
				<div className="phone-number">(+4)0741-991-297</div>
				<h1
					className={
						"top light text-center " +
						"text-bolder twelve columns"
					}>
					Pensiune de lux aflată în mijlocul Deltei Dunării</h1>
				<form className="twelve columns text-center">
					<DatePicker
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
						placeholder={"Din"}/>
					<DatePicker
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
						placeholder={"Pana in"}/>
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
						Rezervare
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

							<CardPaperRipple
								className="content"
								onClick={(e) => {
									e.preventDefault();
									window.location =
										`oferta/${pack.Url}`;
								}}
								tag="div">
								<img src={pack.CardPhoto}/>
								<div className="info">
									<h3>{pack.CardTitle}</h3>
									<p>{pack.CardDescription}</p>
									<div className="price">
										{pack.Price} {pack.Currency} / persoană
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
						(_, i) => <li key={i} className="card empty"/>)
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
