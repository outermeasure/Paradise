import {
	blue500, blue700,
	deepOrange500,
	grey100, grey300, grey400, grey500,
	white, darkBlack, fullBlack,
} from 'material-ui/styles/colors';
import {fade} from 'material-ui/utils/colorManipulator';

const spacing = {
	iconSize: 24,
	desktopGutter: 24,
	desktopGutterMore: 32,
	desktopGutterLess: 16,
	desktopGutterMini: 8,
	desktopKeylineIncrement: 64,
	desktopDropDownMenuItemHeight: 32,
	desktopDropDownMenuFontSize: 15,
	desktopDrawerMenuItemHeight: 48,
	desktopSubheaderHeight: 48,
	desktopToolbarHeight: 56
};

export default {
	spacing: spacing,
	fontFamily: "inherit",
	palette: {
		primary1Color: blue500,
		primary2Color: blue700,
		primary3Color: grey400,
		accent1Color: deepOrange500,
		accent2Color: grey100,
		accent3Color: grey500,
		textColor: darkBlack,
		alternateTextColor: white,
		canvasColor: white,
		borderColor: grey300,
		disabledColor: fade(darkBlack, 0.3),
		pickerHeaderColor: blue500,
		clockCircleColor: fade(darkBlack, 0.07),
		shadowColor: fullBlack,
	},
};
