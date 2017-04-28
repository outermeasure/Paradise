import React from 'react';
import PaperRipple from 'react-paper-ripple';
import * as Colors from '../../../../js/colors';
import OfferWorkflow from
	'../../Components/OfferWorkflow/OfferWorkflowContainer';
import Modal from '../../Components/Modal/Modal';
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
	return <div>
		<Modal
			contentLabel={""}
			isOpen={modalOpen !== -1}
			onRequestClose={closeModal}
			shouldCloseOnOverlayClick={true}
			parentSelector={() => document.body}>
			<OfferWorkflow/>
		</Modal>
		<div className="main">
			<ul className="card-collection">
				{
					PaddingTools.addPaddingToCardCollection(3, packages.items).map(
						(pack, index) => {
							if (pack.empty) {
								return <li
									key={index}
									className="card empty">
								</li>;
							}
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
											openModal(1, pack, clientObject);
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
