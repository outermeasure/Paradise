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
	timeout: 5000,
});
