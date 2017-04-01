require('./styles/styles.scss');

const webfont = require('webfontloader');

webfont.load({
	custom: {
		families: [
			'icomoon',
		],
		testStrings: {
			'icomoon': '\ue901',
		},
	},
	timeout: 5000,
	classes: true,
});
