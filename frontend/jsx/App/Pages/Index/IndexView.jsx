import React from 'react';
import PaperRipple from 'react-paper-ripple';
import * as Colors from '../../../../js/colors';
import Workflow from './Workflow/WorkflowContainer';
import DatePicker from '../../Components/DatePicker/DatePicker';

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
	onChange,
	clientObject,
}) => {
	return <div>
		<Workflow/>
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
						value={clientObject.startDate}
						container="inline" mode="landscape"
						onChange={(e, date) => {
							onChange("startDate", date, clientObject);
						}}
						placeholder={"Data inceput"}/>
					<DatePicker
						value={clientObject.endDate}
						container="inline" mode="landscape"
						onChange={(e, date) => {
							onChange("endDate", date, clientObject);
						}}
						placeholder={"Pana in"}/>
					<BookTopPaperRipple
						tag="button"
						type="submit"
						onClick={(e) => {
							e.preventDefault();
							openModal();
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
										onClick={(e) => e.preventDefault()}
										tag="button">
										Detalii
									</DetailsPaperRipple>
									<BookOfferPaperRipple
										onClick={(e) => e.preventDefault()}
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
