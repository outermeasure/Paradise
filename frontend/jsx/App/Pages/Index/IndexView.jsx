import React from 'react';
import PaperRipple from 'react-paper-ripple';
import * as Colors from '../../../../js/colors';
import Workflow from './Workflow/WorkflowContainer';
import OfferWorkflow from
	'../../Components/OfferWorkflow/OfferWorkflowContainer';
import Modal from 'react-modal';
import DatePicker from '../../Components/DatePicker/DatePicker';
import * as Viewport from '../../../../js/viewport';

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
						type="submit"
						onClick={(e) => {
							e.preventDefault();
							openModal(0);
						}}
						className="primary big">Rezervare
					</BookTopPaperRipple>
				</form>
			</div>
		</div>
		<div className="main">
			<ul className="card-collection">
				{
					packages.items.map(
						(pack, index) => {
							return <li
								key={index}
								className="card">

								<CardPaperRipple
									className="content"
									onClick={(e) => {
										e.preventDefault();
										window.location = `package/${pack.Url}`;
									}}
									tag="div">
									<img
										src={pack.Photo}/>

									<div className="info">
										<h3>{pack.Title}</h3>
										<p>{pack.Description}</p>
										<div className="price">
											{pack.Price} lei / persoană
										</div>
									</div>
								</CardPaperRipple>
								<div className="actions">
									<DetailsPaperRipple
										onClick={(e) => {
											e.preventDefault();
											window.location =
												`package/${pack.Url}`;
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
							</li>;
						}
					)
				}
			</ul>
		</div>
	</div>;
};

View.propTypes = {
	packages: React.PropTypes.shape({
		items: React.PropTypes.arrayOf(
			React.PropTypes.shape({
				Price: React.PropTypes.number.isRequired,
				Photo: React.PropTypes.string.isRequired,
				Title: React.PropTypes.string.isRequired,
				Description: React.PropTypes.string.isRequired,
			})
		).isRequired,
		isFetching: React.PropTypes.bool,
		receivedAt: React.PropTypes.number,
	}),
	openModal: React.PropTypes.func,
};

export default View;
