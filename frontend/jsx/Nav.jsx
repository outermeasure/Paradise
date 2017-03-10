import React from 'react';
import PaperRipple from 'react-paper-ripple';
import * as Colors from '../js/colors';

const Nav = () => {
	return <PaperRipple color={Colors.colorLuminance(Colors.PRIMARY, 0.2)}
											tag="nav"
											className="no-selection">
		<div className="sandwich">
			<i className="icon-navicon"/>
			<a href="/" onClick={(e) => e.preventDefault()}/>
		</div>
	</PaperRipple>;
};
export default Nav;
