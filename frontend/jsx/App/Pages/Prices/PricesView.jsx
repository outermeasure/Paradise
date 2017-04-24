import React from 'react';

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
	</div>;
};

View.propTypes = {
	markdownHTML: React.PropTypes.string,
	cover: React.PropTypes.string,
};

export default View;
