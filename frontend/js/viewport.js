export const getWindowWidth =
	() => window.innerWidth || document.documentElement.clientWidth || document.getElementsByTagName('body')[0].clientWidth;

export const getWindowHeight =
	() => window.innerHeight || document.documentElement.clientHeight || document.getElementsByTagName('body')[0].clientHeight;


export const
	SCREEN_DESKTOP = "SCREEN_DESKTOP",
	SCREEN_MOBILE = "SCREEN_MOBILE",
	addOnScreenTypeChangedListener = (listener) => {
		let currentScreen = getWindowWidth() < 750 ? SCREEN_MOBILE : SCREEN_DESKTOP;
		window.addEventListener(
			"resize",
			() => {
				const newScreen = getWindowWidth() < 750 ? SCREEN_MOBILE : SCREEN_DESKTOP;
				if (newScreen != currentScreen) {
					listener(newScreen);
					currentScreen = newScreen;
				}
			}
		);
		listener(currentScreen);
	};
