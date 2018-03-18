import React from 'react';
import _ from 'lodash';
import Lightbox from 'react-images';
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
	isModalOpen,
	closeModal,
	openPhoto,
	selectedPhoto,
	nextPhoto,
	previousPhoto,
	photos,
}) => {

	const {
		pages,
		isFetching,
	} = photos;

	const all = [];
	_.forOwn(pages, (page) => {
		const { items, } = page;
		const { length, } = items;

		for (let i = 0; i < length; i++) {
			all.push(items[i]);
		}
	});

	let lightboxPhotos= [];
	lightboxPhotos = _.map(all, (photo) => {
		return  { src: photo.fullPicture }
	});

	const handleImageClick = () => {
		if (selectedPhoto === lightboxPhotos.length - 1) {
			return;
		} else {
			nextPhoto() 
		}
	};

	return <div id="Gallery">
		<Lightbox
			images={lightboxPhotos}
			isOpen={isModalOpen}
			onClickImage={handleImageClick}
			onClickPrev={previousPhoto}
			onClickNext={nextPhoto}
			onClose={closeModal}
			currentImage={selectedPhoto}
			imageCountSeparator=" din "
			leftArrowTitle="înapoi"
			rightArrowTitle="înainte"
			closeButtonTitle="închide"
			spinner={() => {return null;}}
		/>
		<ul className="card-collection">
			{ all.map((photo, index) => 
				<li key={index} className="card">
					<CardPaperRipple
						className="content"
						onClick={(e) => { e.preventDefault(); openPhoto(index); }}
						tag="div"
					>
						<img src={photo.thumbnail} />
					</CardPaperRipple>
				</li>
			)}
			{
				PaddingTools.addPadding(4, all.length).map(
					(_, i) => <li key={i} className="card empty"/>)
			}
		</ul>
		{ isFetching ? "Loading..." : null }
	</div>;
};

View.propTypes = {
	isModalOpen: PropTypes.bool,
	closeModal: PropTypes.func,
	selectedPhoto: PropTypes.number,
	openPhoto: PropTypes.func,
	previousPhoto: PropTypes.func,
	nextPhoto: PropTypes.func,
	photos: PropTypes.object,
};

export default View;
