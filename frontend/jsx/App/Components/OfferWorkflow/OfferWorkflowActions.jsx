export const
	SET_STEP = "OFFER_WORKFLOW.SET_STEP",
	SET_CLIENT_OBJECT = "OFFER_WORKFLOW.SET_CLIENT_OBJECT";

export const
	setStep = (step) => ({
		type: SET_STEP,
		step,
	}),
	setClientObject = (clientObject) => ({
		type: SET_CLIENT_OBJECT,
		clientObject,
	});
