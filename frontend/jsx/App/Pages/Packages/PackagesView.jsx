import React from 'react';
import PaperRipple from 'react-paper-ripple';
import * as Colors from '../../../../js/colors';
import * as Utils from '../../../../js/utils';
import OfferWorkflow from
	'../../Components/OfferWorkflow/OfferWorkflowContainer';
import Modal from '../../Components/Modal/Modal';
import PropTypes from 'prop-types';
import * as PaddingTools from '../../Components/PaddingTools';

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
	clientObject,
	closeModal,
	modalOpen,
}) => {
	return <div id="Packages" >
		<Modal
			contentLabel={""}
			isOpen={modalOpen !== -1}
			onRequestClose={closeModal}
			shouldCloseOnOverlayClick={true}
			parentSelector={() => document.body}>
			<OfferWorkflow/>
		</Modal>
		<div className="main">
            <h1>Oferte 2019 delta dunarii - Paradise Delta House</h1>
			<ul className="card-collection">
				{
					packages.items.map(
						(pack, index) => <li
							key={index}
							className="card">

							<CardPaperRipple
								className="content"
                                href={`oferta/${pack.Url}`}
								tag="a">
								<img
									src={pack.CardPhoto}/>

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
										openModal(1, pack, clientObject);
									}}
									tag="button"
									className="accent">
									Rezervă
								</BookOfferPaperRipple>
							</div>
						</li>
					)
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
