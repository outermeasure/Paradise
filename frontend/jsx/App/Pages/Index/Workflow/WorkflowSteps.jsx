export const
	PERSONAL_INFORMATION = "PERSONAL_INFORMATION",
	BOOKING_DETAILS = "BOOKING_DETAILS",
	BOOKING_MESSAGE = "BOOKING_MESSAGE",
	CONFIRMATION = "CONFIRMATION";

export const
	getStepIndexByLabel = (label) => {

		if (label === BOOKING_DETAILS) {
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
