import React from 'react';
import PropTypes from 'prop-types';

const View = ({
	markdownHTML,
}) => {
	return <div className="card card-big">
		<div
			className="markdown markdown-light"
			dangerouslySetInnerHTML={{
				__html: markdownHTML,
			}}>
		</div>
		<br/>
	</div>;
};

View.propTypes = {
	markdownHTML: PropTypes.string,
	cover: PropTypes.string,
};

export default View;
