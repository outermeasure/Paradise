export const
	PERSONAL_INFORMATION = "PERSONAL_INFORMATION",
	OFFER_AND_DATE_SELECTION = "OFFER_AND_DATE_SELECTION",
	CONFIRMATION = "CONFIRMATION";

export const
	getStepIndexByLabel = (label) => {

		if (label === OFFER_AND_DATE_SELECTION) {
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