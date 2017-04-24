import React from 'react';
import PaperRipple from 'react-paper-ripple';
import * as Colors from '../../../../js/colors';

const PAPER_RIPPLE_COLOR = Colors.colorLuminance(Colors.PRIMARY, 0.2);

const NavPaperRipple = (props) => <PaperRipple
	{...props}
	color={PAPER_RIPPLE_COLOR}
	rmConfig={{
		stiffness: 80,
		damping: 10,
	}}
/>;

const NavigationBar = ({
	selected,
}) => {
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
					href="/prices">Prețuri</NavPaperRipple>
			</li>
			<li>
				<NavPaperRipple
					tag="a"
					className={selected === 2 ? "selected" : ""}
					href="/packages">Pachete</NavPaperRipple>
			</li>
			<li>
				<NavPaperRipple
					tag="a"
					className={selected === 4 ? "selected" : ""}
					href="/location">Locație</NavPaperRipple>
			</li>
			<li>
				<NavPaperRipple
					tag="a"
					className={selected === 5 ? "selected" : ""}
					href="/gallery">Galerie Foto</NavPaperRipple>
			</li>
		</ul>
		<div className="sandwich">
			<i className="icon-bars"/>
			<NavPaperRipple
				tag="a"
				href="/"
				onClick={(e) => e.preventDefault()}/>
		</div>
	</nav>;
};

NavigationBar.propTypes = {
	selected: React.PropTypes.number.isRequired,
};

export default NavigationBar;
