export const
	PERSONAL_INFORMATION = "PERSONAL_INFORMATION",
	CONFIRMATION = "CONFIRMATION";

export const
	getStepIndexByLabel = (label) => {

		if (label === PERSONAL_INFORMATION) {
			return 0;
		}

		if (label === CONFIRMATION) {
			return 1;
		}

		return -1;
	},
	getNumberOfSteps = () => 2;