import React from 'react';

const View = ({
	markdownHTML,
}) => {
	return <div className="main"
							dangerouslySetInnerHTML={{
								__html: markdownHTML,
							}}>
	</div>;
};

View.propTypes = {
	markdownHTML: React.PropTypes.string,
};

export default View;
