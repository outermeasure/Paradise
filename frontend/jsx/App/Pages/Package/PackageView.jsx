import React from 'react';
import PropTypes from 'prop-types';

const View = ({
	markdownHTML,
	cover,
}) => {
	return <div className="card card-big">
		<div className="cover" style={{
			backgroundImage: `url(${cover})`,
		}}></div>
		<div
			className="markdown markdown-light"
			dangerouslySetInnerHTML={{
				__html: markdownHTML,
			}}>
		</div>
	</div>;
};

View.propTypes = {
	markdownHTML: PropTypes.string,
	cover: PropTypes.string,
};

export default View;
