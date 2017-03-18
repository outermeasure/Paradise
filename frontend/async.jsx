import React from 'react';
import {
	render,
} from 'react-dom';
import Nav from './jsx/Nav';

document.addEventListener("touchstart", () => {}, true);
render(
	<Nav selected={window.NAVBAR_SELECTED}/>,
	document.getElementById("Header")
);
