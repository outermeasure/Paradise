require('./styles/styles.scss');
const webfont = require('webfontloader');

webfont.load({
	custom: {
		families: [
			'icomoon',
		],
		testStrings: {
			'icomoon': '\ueb08',
		},
	},
	classes: true,
});
