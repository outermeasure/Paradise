import React from 'react';

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
							placeholder="Data sfarsit"/>
						<i className="big icon-calendar2"/>
					</div>
					<button
						type="submit"
						className="primary big">Rezervare
					</button>
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
									<button>Detalii</button>
									<button className="accent">Rezervă</button>
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
