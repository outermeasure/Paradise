import React from 'react';
import PropTypes from 'prop-types';
import Ripple from 'react-paper-ripple';
import InputMask from "react-input-mask";
import * as Colors from '../../../../js/colors';
import * as Validations from '../../../../js/validations';
import * as Viewport from '../../../../js/viewport';
import TextField from 'material-ui/TextField';
import Checkbox from 'material-ui/Checkbox';
import Card from 'material-ui/Card';

const PaperRipple = (props) => <Ripple
	{...props}
	color={Colors.colorLuminance(Colors.PRIMARY, 0.5)}
	opacity={0.4}
	rmConfig={{
		stiffness: 50,
		damping: 20,
	}}
/>;

const View = ({
	markdownHTML,
	errors,
	contactObject,
	setErrors,
	onChange,
	onSendMessage,
	busy,
	notificationType,
}) => {
	const validation = {};

	if (errors) {
		for (const field in errors) {
			if (errors.hasOwnProperty(field)) {
				validation[field] = errors[field] ? {
					errorText: errors[field][0],
					errorStyle: {
						position: "absolute",
						top: "72px",
					},
				} : {};
			}
		}
	}

	const resetValue = (input, hasMask) => {
		if (input !== null && input.state.hasValue && input.props.defaultValue === "") {
			var defaultValue = input.props.defaultValue;
			hasMask ? input.input.setInputValue(defaultValue) : input.getInputNode().value = defaultValue;
		}
	};

	const displayNotification = () => {
		var notificationText = null;

		if (notificationType === 'success') {
			notificationText = [ <i key={1} className="contact-form-notification-success-icon icon-done"/>, " Va multumim ! Formularul de contact a fost trimis." ];
		} else if (notificationType === 'failed') {
			notificationText = [ <i key={1} className="contact-form-notification-error-icon icon-error"/>, " A avut loc o eroare ! Formularul de contact nu a fost trimis."  ];
		}

		return notificationText === null ? null : <div className="contact-form-notification">{ notificationText }</div>;
	}

	return <div className="card card-big" id="Contact">
		<div
			className="markdown markdown-light"
			dangerouslySetInnerHTML={{
				__html: markdownHTML,
			}}>
		</div>
		<div className="contact-form">
			{displayNotification()}
			<ul className="contact-form-controls">
				<li>
					<TextField
						ref={input => resetValue(input)}
						defaultValue={contactObject.lastName}
						disabled={busy}
						className="contact-form-controls-lastName"
						id="LastName"
						{...validation.lastName}
						floatingLabelText={"Nume *"}
						onBlur={(e) => {
							e.preventDefault();
							onChange("lastName", e.target.value, contactObject);
						}}
						type="text"
						hintText="Ex: Pop"
					/>
					<TextField
						ref={input => resetValue(input)}
						defaultValue={contactObject.firstName}
						disabled={busy}
						className="contact-form-controls-firstName"
						{...validation.firstName}
						floatingLabelText={"Prenume *"}
						onBlur={(e) => {
							e.preventDefault();
							onChange("firstName", e.target.value, contactObject);
						}}
						type="text"
						hintText="Ex: Ioan"
					/>
				</li>
				<li>
					<TextField
						ref={input => resetValue(input, true)}
						defaultValue={contactObject.phoneNumber}
						disabled={busy}
						className="contact-form-controls-phoneNumber"
						fullWidth={true}
						floatingLabelText={"Telefon"}
						onBlur={(e) => {
							e.preventDefault();
							onChange("phoneNumber", e.target.value, contactObject);
						}}
						type="text"
					>
						<InputMask 
							mask="(0999) 999 999" 
							maskChar="X" 
						/>
					</TextField>
				</li>
				<li>
					<TextField
						ref={input => resetValue(input)}
						defaultValue={contactObject.email}
						disabled={busy}
						className="contact-form-controls-email"
						{...validation.email}
						fullWidth={true}
						floatingLabelText={"Email *"}
						onBlur={(e) => {
							e.preventDefault();
							onChange("email", e.target.value, contactObject);
						}}
						type="text"
						hintText="Ex: pop.ioan@gmail.com"
					/>
				</li>
				<li>
					<TextField
						ref={input => resetValue(input)}
						defaultValue={contactObject.message}
						disabled={busy}
						className="contact-form-controls-message"
						{...validation.message}
						multiLine={true}
						rows={2}
						fullWidth={true}
						floatingLabelText={"Comentarii *"}
						onBlur={(e) => {
							e.preventDefault();
							onChange("message", e.target.value, contactObject);
						}}
						type="text"
						hintText="Va rugam adaugati intrebari sau sugestii legate de oferte"
					/>
				</li>
				<li>
					<p className="contact-form-controls-privacyAgreement-header">CONFIDENTIALITATE DATE CLIENT</p>
					<Checkbox
						defaultChecked={contactObject.privacyAgreement}
						className="contact-form-controls-privacyAgreement"
						label="Datele personale oferite de dumneavoastra sunt folosite pentru a va procesa rezervarile si pentru a va raspunde la intrebari. Datele personale NU vor fi folosite in scopuri de marketing. *"
						onCheck={(e) => {
							onChange("privacyAgreement", e.target.checked, contactObject);
						}}
						iconStyle={validation && validation.privacyAgreement && validation.privacyAgreement.errorText != null ? {fill:'rgb(244, 67, 54)'} : {}}
					/>
				</li>
			</ul>
			<div className="contact-form-actions">
				<span className="contact-form-actions-mandatoryText">Campurile marcate cu * sunt obligatorii</span>
				<PaperRipple
					className="contact-form-actions-submitBtn primary workflow"
					tag="button"
					type="submit"
					onClick={(e) => {
						e.preventDefault();
						const errors = Validations.getErrors({
							clientObject: {
								firstName: contactObject.firstName,
								lastName: contactObject.lastName,
								phoneNumber: '0111111111',
								email: contactObject.email,
								message: contactObject.message ? (contactObject.message).trim() : '',
								privacyAgreement: contactObject.privacyAgreement
							}
						});
						if (!errors) {
							setErrors(null);
							onSendMessage(contactObject);
						} else {
							setErrors(errors);
						}
					}}
				>
					{ !busy ? "Trimite" : [ "Se proceseaza ", <i key={1} className="icon-donut_large spin"/>, ] }
				</PaperRipple>
			</div>
		</div>
	</div>;
};

View.propTypes = {
	markdownHTML: PropTypes.string,
	errors: PropTypes.object,
	contactObject: PropTypes.object,
	setErrors: PropTypes.func,
	onChange: PropTypes.func,
	onSendMessage: PropTypes.func,
	busy: PropTypes.bool,
	notificationType: PropTypes.string,
};

export default View;
