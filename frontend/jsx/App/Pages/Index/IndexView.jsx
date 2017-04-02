import React from 'react';
import PaperRipple from 'react-paper-ripple';
import * as Colors from '../../../../js/colors';

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

const View = ({
	packages,
}) => {
	return <div>
		<div className="presentation">
			<div className="main">
				<h1
					className={
						"top light text-center " +
						"text-bolder twelve columns"
					}>
					Pensiune de lux aflată în mijlocul Deltei Dunării</h1>
				<form className="twelve columns text-center">
					<div className="calendar">
						<input
							type="text"
							className="big"
							name="from"
							placeholder="Data inceput"/>
						<i className="big icon-calendar2"/>
					</div>
					<div className="calendar">
						<input
							type="text"
							className="big"
							name="until"
							placeholder="Pana in"/>
						<i className="big icon-calendar2"/>
					</div>
					<BookTopPaperRipple
						tag="button"
						type="submit"
						onClick={(e) => e.preventDefault()}
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
							return <li key={index} className="card">
								<img src={pack.Photo}/>
								<div className="info">
									<h3>{pack.Title}</h3>
									<p>{pack.Description}</p>
									<div className="price">
										{pack.Price} lei / persoană</div>
								</div>
								<div className="actions">
									<DetailsPaperRipple
										tag="button">
										Detalii
									</DetailsPaperRipple>
									<BookOfferPaperRipple
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
};

export default View;
