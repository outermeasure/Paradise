import React from 'react';

const View = ({
	id,
	url,
}) => {
	return <div>
		{id} - {url}
	</div>;
};

View.propTypes = {};

export default View;
