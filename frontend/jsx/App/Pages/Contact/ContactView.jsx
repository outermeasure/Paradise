import React from 'react';
import PropTypes from 'prop-types';
import Ripple from 'react-paper-ripple';
import InputMask from "react-input-mask";
import * as Colors from '../../../../js/colors';
import * as Validations from '../../../../js/validations';
import * as Viewport from '../../../../js/viewport';
import TextField from 'material-ui/TextField';

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

	return <div className="card card-big" id="Contact">
		<div
			className="markdown markdown-light"
			dangerouslySetInnerHTML={{
				__html: markdownHTML,
			}}>
		</div>
		<div className="contact-form"> 
			<ul className="contact-form-controls">
				<li>
					<TextField
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
								message: contactObject.message ? (contactObject.message).trim() : ''
							}
						});
						if (!errors) {
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
	busy: PropTypes.bool
};

export default View;
