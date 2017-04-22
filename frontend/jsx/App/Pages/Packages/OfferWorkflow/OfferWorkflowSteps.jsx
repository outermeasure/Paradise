export const
	PERSONAL_INFORMATION = "PERSONAL_INFORMATION",
	CALENDAR_OPTIONS = "CALENDAR_OPTIONS",
	CONFIRMATION = "CONFIRMATION";

export const
	getStepIndexByLabel = (label) => {

		if (label === CALENDAR_OPTIONS) {
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