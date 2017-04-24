import React from 'react';

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
	markdownHTML: React.PropTypes.string,
	cover: React.PropTypes.string,
};

export default View;
