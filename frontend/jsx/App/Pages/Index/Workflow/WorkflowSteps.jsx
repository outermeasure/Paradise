export const
	PERSONAL_INFORMATION = "PERSONAL_INFORMATION",
	BOOKING_DETAILS = "BOOKING_DETAILS",
	CONFIRMATION = "CONFIRMATION";

export const
	getStepIndexByLabel = (label) => {

		if (label === BOOKING_DETAILS) {
			return 0;
		}

		if (label === PERSONAL_INFORMATION) {
			return 1;
		}

		if (label === CONFIRMATION) {
			return 2;
		}

		return -1;
	},
	getNumberOfSteps = () => 3;