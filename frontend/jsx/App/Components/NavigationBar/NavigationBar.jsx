import React from 'react';
import PaperRipple from 'react-paper-ripple';
import * as Colors from '../../../../js/colors';
import PropTypes from 'prop-types';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';

const PAPER_RIPPLE_COLOR = Colors.colorLuminance(Colors.PRIMARY, 0.2);

const NavPaperRipple = (props) => <PaperRipple
	{...props}
	color={PAPER_RIPPLE_COLOR}
	rmConfig={{
		stiffness: 80,
		damping: 10,
	}}
/>;

const DESKTOP_MENU_ITEMS = [
	{
		label: "Oferte",
		url: "/oferta",
		index: 1,
	},
	{
		label: "Locație",
		url: "/locatie",
		index: 2,
	},
	{
		label: "Recenzii",
		url: "/recenzii",
		index: 3,
	},
	{
		label: "Tarife",
		url: "/tarife",
		index: 4,
	},
	{
		label: "Contact",
		url: "/contact",
		index: 5,
	},
];

const MOBILE_MENU_ITEMS = [{
		label: "Acasa",
		url: "/",
		index: 0,
	}].concat(DESKTOP_MENU_ITEMS)

class NavigationBar extends React.Component {

	constructor() {
		super();
		this.state = {
			open: false,
		};
	}

	render() {
		const {
			selected,
		} = this.props;

		return <div>
			<nav className="no-selection">
				<div className="infobar">
					<span className="infobar-phone">
						<a href="tel:0755248260"><i className="icon-stay_primary_portrait"></i>(0755) 248 260</a>
						<span> - </span>
						<a href="tel:0741991297">(0741) 991 297</a>
					</span>
					<span> | </span>
					<span className="infobar-mail">
						<a href="mailto:paradisedeltahouse@yahoo.com"><i className="icon-mail_outline"></i>paradisedeltahouse@yahoo.com</a>
					</span>
					<span className="infobar-time">
						<i className="icon-clock"></i>Luni – Duminica 00.00 – 24.00
					</span>
				</div>
				<NavPaperRipple
					tag="div"
					className="brand">
					<i className="icon-pelican2" />
					<div className="text"><span>PARADISE</span><br />Delta House</div>
					<a href="/" />
				</NavPaperRipple>
				<ul className="navbar">
					{
						DESKTOP_MENU_ITEMS.map(
							(item, i) => <li key={i}>
								<NavPaperRipple
									tag="a"
									className={selected === item.index ? "selected" : ""}
									href={item.url}>{item.label}</NavPaperRipple>
							</li>
						)
					}
				</ul>
				<div className="sandwich">
					<i className="icon-bars" />
					<NavPaperRipple
						tag="a"
						href="/"
						onClick={(e) => {
							e.preventDefault();
							this.setState({ open: true });
						}} />
				</div>
		</nav>
			<Drawer
				className="material-ui-drawer"
				docked={false}
				zDepth={5}
				width={150}
				openSecondary={true}
				open={this.state.open}
				onRequestChange={(open) => this.setState({ open })}
			>
				<div className="material-ui-menu">
					{MOBILE_MENU_ITEMS.map((item, i) => 
						<MenuItem 
							key={i} 
							className={selected === item.index ? "material-ui-menu-item material-ui-menu-item-selected" : "material-ui-menu-item" }
							onTouchTap={() => {this.setState({ open: false });
								window.location = item.url;
							}}
						>
							{item.label}
						</MenuItem>
					)}
				</div>
			</Drawer>
		</div>;
	}
};

NavigationBar.propTypes = {
	selected: PropTypes.number.isRequired,
};

export default NavigationBar;
