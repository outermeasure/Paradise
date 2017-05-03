export const
	PERSONAL_INFORMATION = "PERSONAL_INFORMATION",
	OFFER_AND_DATE_SELECTION = "OFFER_AND_DATE_SELECTION",
	BOOKING_MESSAGE = "BOOKING_MESSAGE",
	CONFIRMATION = "CONFIRMATION";

export const
	getStepIndexByLabel = (label) => {

		if (label === OFFER_AND_DATE_SELECTION) {
			return 0;
		}

		if (label === PERSONAL_INFORMATION) {
			return 1;
		}

		if (label === BOOKING_MESSAGE) {
			return 2;
		}

		if (label === CONFIRMATION) {
			return 3;
		}

		return -1;
	},
	getNumberOfSteps = () => 4;
