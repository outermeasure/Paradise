export const
	validateEmail = (email) => {
		const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		return re.test(email);
	},
	validatePhone = (phoneNumber) => {
		const re = /^([\\(\\)\\+0-9\s\-\\#]+)$/;
		return re.test(phoneNumber);
	},
	getErrors = (props) => {
		const {
			clientObject,
		} = props;

		const errors = {
			firstName: null,
			lastName: null,
			phoneNumber: null,
			email: null,
		};

		const {
			email,
			phoneNumber,
			firstName,
			lastName,
		} = clientObject;

		let hadError = false;
		const addError = (where, err) => {
			hadError = true;
			if (errors[where] === null) {
				errors[where] = [
					err,
				];
			} else {
				errors[where].push(err);
			}
		};


		if (!email || email === '') {
			addError("email", "Adresa de email nu poate fi omisa");
		}

		if (!validateEmail(email)) {
			addError("email", "Adresa de email este invalida");
		}

		if (!phoneNumber || phoneNumber === '') {
			addError("phoneNumber", "Numarul de telefon nu poate fi omis");
		}

		if (!validatePhone(phoneNumber)) {
			addError("phoneNumber", "Numarul de telefon este invalid");
		}

		if (firstName === '') {
			addError("firstName", "Prenumele nu poate fi omis");
		}

		if (lastName === '') {
			addError("lastName", "Numele nu poate fi omis");
		}
		return hadError ? errors : null;
	};

