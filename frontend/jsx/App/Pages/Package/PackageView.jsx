import React from "react";
import PropTypes from "prop-types";
import PaperRipple from "react-paper-ripple";
import * as Colors from "../../../../js/colors";
import OfferWorkflow from "../../Components/OfferWorkflow/OfferWorkflowContainer";
import Modal from "../../Components/Modal/Modal";

const BookOfferPaperRipple = (props) => (
	<PaperRipple
		{...props}
		color={Colors.colorLuminance(Colors.ACCENT, 0.9)}
		opacity={0.45}
		rmConfig={{
			stiffness: 50,
			damping: 20,
		}}
	/>
);

const View = ({
	markdownHTML,
	cover,
	openModal,
	closeModal,
	modalOpen,
	offerClientObject,
	pack,
}) => {
	return (
		<div id="Package">
			<div className="card card-big">
				<Modal
					contentLabel={""}
					isOpen={modalOpen !== -1}
					onRequestClose={closeModal}
					shouldCloseOnOverlayClick={true}
					parentSelector={() => document.body}
				>
					<OfferWorkflow />
				</Modal>
				<div
					className="cover"
					style={{
						backgroundImage: `url(${cover})`,
					}}
				/>
				<div className="top-button">
					<h1>{pack.Title}</h1>
					<BookOfferPaperRipple
						onClick={(e) => {
							e.preventDefault();
							openModal(pack, offerClientObject);
						}}
						tag="button"
						className="accent big"
					>
						Rezervă
					</BookOfferPaperRipple>
				</div>
				<div
					className="markdown markdown-light"
					dangerouslySetInnerHTML={{
						__html: markdownHTML,
					}}
				/>
				<div className="bottom-button">
					<BookOfferPaperRipple
						onClick={(e) => {
							e.preventDefault();
							openModal(pack, offerClientObject);
						}}
						tag="button"
						className="accent big"
					>
						Rezervă
					</BookOfferPaperRipple>
				</div>
			</div>
		</div>
	);
};

View.propTypes = {
	markdownHTML: PropTypes.string,
	cover: PropTypes.string,
};

export default View;
