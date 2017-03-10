import React from 'react';
import {
	render,
} from 'react-dom';
import Nav from './jsx/Nav';

require('./styles/styles.scss');

render(
	<Nav/>,
	document.getElementById("Header")
);
