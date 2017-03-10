import React from 'react';
import {
	render,
} from 'react-dom';
import Nav from './jsx/Nav';

require('./styles/styles.scss');

document.addEventListener("touchstart", () => {}, true);
render(
	<Nav/>,
	document.getElementById("Header")
);
