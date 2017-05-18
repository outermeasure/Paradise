import React from 'react';
import _ from 'lodash';
import Modal from '../../Components/Modal/Modal';
import * as Colors from '../../../../js/colors';
import PaperRipple from 'react-paper-ripple';
import * as PaddingTools from '../../Components/PaddingTools';
import PropTypes from 'prop-types';

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
	modalOpen,
	closeModal,
	openPhoto,
	selectedPhoto,
	photos,
}) => {

	const {
		pages,
		isFetching,
	} = photos;

	const all = [];
	_.forOwn(
		pages,
		(page) => {
			const {
				items,
			} = page;
			const {
				length,
			} = items;

			for (let i = 0; i < length; i++) {
				all.push(items[i]);
			}
		}
	);

	return <div id="Gallery">
		<Modal
			contentLabel={""}
			isOpen={modalOpen !== -1}
			onRequestClose={closeModal}
			shouldCloseOnOverlayClick={true}
			style={{
				content: {
					width: "80%",
				},
			}}
			parentSelector={() => document.body}>
			{
				modalOpen === 2 ?
					<div className="GALLERY_full-photo">
						<div className="close">
							<button onClick={(e) => {
								e.preventDefault();
								closeModal();
							}}>
								<i className="icon-close2"/>
							</button>
						</div>
						<img src={selectedPhoto.fullPicture}/>
					</div> :
					null
			}
		</Modal>
		<ul className="card-collection">
			{
				all.map(
					(photo, index) => <li key={index} className="card">
							<CardPaperRipple
								className="content"
								onClick={(e) => {
									e.preventDefault();
									openPhoto(photo);
								}}
								tag="div">
								<img src={photo.thumbnail}/>
							</CardPaperRipple>
						</li>
				)
			}
			{
				PaddingTools.addPadding(4, all.length).map(
					(_, i) => <li key={i} className="card empty"/>)
			}
		</ul>
		{ isFetching ? "Loading..." : null }
	</div>;
};

View.propTypes = {
	modalOpen: PropTypes.number,
	closeModal: PropTypes.func,
	selectedPhoto: PropTypes.object,
	openPhoto: PropTypes.func,
	photos: PropTypes.object,
};

export default View;
