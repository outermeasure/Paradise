import React from 'react';
import PaperRipple from 'react-paper-ripple';
import * as Colors from '../js/colors';

const PAPER_RIPPLE_COLOR = Colors.colorLuminance(Colors.PRIMARY, 0.2);

const NavPaperRipple = (props) => <PaperRipple
	{...props}
	color={PAPER_RIPPLE_COLOR}
	rmConfig={{
		stiffness: 70,
		damping: 10,
	}}
/>;

const Nav = ({selected}) => {
	return <nav
		className="no-selection">
		<NavPaperRipple
			tag="div"
			className="brand">
			<i className="icon-pelican2"/>
			<div className="text"><span>PARADISE</span><br/>Delta House</div>
			<a href="/"/>
		</NavPaperRipple>
		<ul className="navbar">
			<li>
				<NavPaperRipple
					tag="a"
					className={selected === 1 ? "selected" : ""}
					href="/prices">Prices</NavPaperRipple>
			</li>
			<li>
				<NavPaperRipple
					tag="a"
					className={selected === 2 ? "selected" : ""}
					href="/offers">Offers</NavPaperRipple>
			</li>
			<li>
				<NavPaperRipple
					tag="a"
					className={selected === 3 ? "selected" : ""}
					href="/restaurant">Restaurant</NavPaperRipple>
			</li>
			<li>
				<NavPaperRipple
					tag="a"
					className={selected === 4 ? "selected" : ""}
					href="/experience">Experience</NavPaperRipple>
			</li>
		</ul>
		<div className="sandwich">
			<i className="icon-navicon"/>
			<NavPaperRipple
				tag="a"
				href="/"
				onClick={(e) => e.preventDefault()}/>
		</div>
	</nav>;
};
export default Nav;
