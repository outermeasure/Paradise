import React from 'react';
import Modal from '../../Components/Modal/Modal';
import * as Utils from '../../../../js/utils';
import Checkbox from 'material-ui/Checkbox';
import Ripple from 'react-paper-ripple';
import * as Colors from '../../../../js/colors';

const PaperRipple = (props) => <Ripple
	{...props}
	color={Colors.colorLuminance(Colors.PRIMARY, 0.5)}
	opacity={0.4}
	rmConfig={{
		stiffness: 50,
		damping: 20,
	}}
/>;

const BASE_FOCUSED_PACKAGE = {
	Id: null,
	ShowOnIndexPage: false,
	ShowOnPackagePage: false,
	PageDetailsCover: "",
	PageDetailsMarkdown: "",
	PageDetailsMarkdownString: "",
	Url: "",
	Price: 1000,
	Photo: "",
	Title: "",
	Description: "",
	Nights: 1,
	Empty: false,
};

class Edit extends React.Component {

	constructor() {
		super();
		this.state = {
			packages: [],
			focusedPackage: null,
		};

		this.refresh = this.refresh.bind(this);
	}

	refresh() {
		const that = this;
		Utils.getJSON('/api/package', (data) => {
			that.setState({
				...that.state,
				packages: data,
			});
		});
	}

	componentDidMount() {
		this.refresh();
	}

	render() {
		const that = this;
		const closeModal = () => {
			that.setState({
				...that.state,
				focusedPackage: null,
			});
		};

		const openModal = (pack) => {
			that.setState({
				...that.state,
				focusedPackage: pack,
			});
		};

		const fp = that.state.focusedPackage;

		return <div className="PackageEdit main">
			<h3>
				Administrare pachete
			</h3>

			<PaperRipple
				tag="button"
				type="submit"
				onClick={() => {
					openModal({
						...BASE_FOCUSED_PACKAGE,
					});
				}}
				className="primary medium-big"><i className="icon-plus"/> Adauga pachet
			</PaperRipple>
			<table>
				<thead>
				<tr>
					<th>Nume</th>
					<th>Actiuni</th>
				</tr>
				</thead>
				<tbody>
				{
					this.state.packages.map(
						(pack, index) => <tr key={index}>
							<td>{pack.Title}</td>
							<td>
								<ul>
									<li>
										<a
											href="javascript:void(0)"
											onClick={() => openModal(pack)}>
											Modifica</a></li>
									<li>
										<a
											href="javascript:void(0)"
											onClick={() => Utils.deleteJSON(
												`/api/package/${pack.Id}`,
												(success, errors) => {
													if (success) {
														this.refresh();
													} else {
														if (errors) {
															window.alert(errors.join("\n"));
														} else {
															window.alert("Operatia nu a fost efectuata deoarece s-au inregistrat erori. Va rugam incercati mai tarziu.");
														}
													}
												})}>
											Sterge</a></li>
								</ul>
							</td>
						</tr>
					)
				}
				</tbody>
			</table>
			<Modal
				contentLabel={""}
				isOpen={this.state.focusedPackage !== null}
				onRequestClose={closeModal}
				shouldCloseOnOverlayClick={true}
				parentSelector={() => document.body}>
				<div className="PackageEditPopup">
					<div className="close">
						<button onClick={(e) => {
							e.preventDefault();
							closeModal();
						}}>
							<i className="icon-close2"/>
						</button>
					</div>
					<h3>
						Modifica Oferta
					</h3>

					{fp ? <form>
						<ul>
							<li>
								<label>Id</label>
								<input type="text"
											 defaultValue={fp.Id}
											 disabled={true}/>
							</li>
							<li>
								<Checkbox
									label="Arata pe pagina principala"
									onCheck={(e, v) => {
										that.setState({
											...that.state,
											focusedPackage: {
												...that.state.focusedPackage,
												ShowOnIndexPage: v,
											},
										});
									}}
									checked={fp.ShowOnIndexPage}
								/>
							</li>
							<li>
								<Checkbox
									label="Arata pe pagina de oferte"
									onCheck={(e, v) => {
										that.setState({
											...that.state,
											focusedPackage: {
												...that.state.focusedPackage,
												ShowOnPackagePage: v,
											},
										});
									}}
									checked={fp.ShowOnPackagePage}
								/>
							</li>
							<li>
								<label>Imaginea de cover (URL)</label>
								<input
									type="text"
									defaultValue={fp.PageDetailsCover}
									onBlur={
										(e) => {
											that.setState({
												...that.state,
												focusedPackage: {
													...that.state.focusedPackage,
													PageDetailsCover: e.target.value,
												},
											});
										}
									}
								/>
							</li>
							<li>
								<label>Descrierea ofertei</label>
								<textarea
									rows="9"
									defaultValue={fp.PageDetailsMarkdownString}
									onBlur={
										(e) => {
											that.setState({
												...that.state,
												focusedPackage: {
													...that.state.focusedPackage,
													PageDetailsMarkdownString: e.target.value,
												},
											});
										}
									}/>
							</li>
							<li>
								<label>Url (SEO)</label>
								<input
									type="text"
									defaultValue={fp.Url}
									onBlur={
										(e) => {
											that.setState({
												...that.state,
												focusedPackage: {
													...that.state.focusedPackage,
													Url: e.target.value,
												},
											});
										}
									}
								/>
							</li>
							<li>
								<label>Pret (Lei)</label>
								<input
									type="text"
									defaultValue={fp.Price}
									onBlur={
										(e) => {
											that.setState({
												...that.state,
												focusedPackage: {
													...that.state.focusedPackage,
													Price: e.target.value,
												},
											});
										}
									}
								/>
							</li>
							<li>
								<label>Fotografie card (URL)</label>
								<input
									defaultValue={fp.Photo}
									onBlur={
										(e) => {
											that.setState({
												...that.state,
												focusedPackage: {
													...that.state.focusedPackage,
													Photo: e.target.value,
												},
											});
										}
									}
									type="text"/>
							</li>
							<li>
								<label>Titlu</label>
								<input
									defaultValue={fp.Title}
									onBlur={
										(e) => {
											that.setState({
												...that.state,
												focusedPackage: {
													...that.state.focusedPackage,
													Title: e.target.value,
												},
											});
										}
									}
									type="text"/>
							</li>
							<li>
								<label>Descriere Card</label>
								<input
									defaultValue={fp.Description}
									onBlur={
										(e) => {
											that.setState({
												...that.state,
												focusedPackage: {
													...that.state.focusedPackage,
													Description: e.target.value,
												},
											});
										}
									}
									type="text"/>
							</li>
							<li>
								<label>Numar nopti</label>
								<input
									defaultValue={fp.Nights}
									onBlur={
										(e) => {
											that.setState({
												...that.state,
												focusedPackage: {
													...that.state.focusedPackage,
													Nights: e.target.value,
												},
											});
										}
									}
									type="text"/>
							</li>
							<li>
								<label>Extra</label>
								<Checkbox
									label="Oferta goala"
									onCheck={(e, v) => {
										that.setState({
											...that.state,
											focusedPackage: {
												...that.state.focusedPackage,
												Empty: v,
											},
										});
									}}
									checked={fp.Empty}
								/>
							</li>
						</ul>
					</form> : null }
					<div className="actions">
						<PaperRipple
							tag="button"
							type="submit"
							onClick={() => {
								fp.Price = parseFloat(fp.Price);
								fp.Nights = parseInt(fp.Nights);
								Utils.putJSON('/api/package', fp,
									(success, errors) => {
										if (success) {
											closeModal();
											this.refresh();
										} else {

											if (errors) {
												window.alert(errors.join("\n"));
											} else {
												window.alert("Datele sunt invalide. " +
													"Cel mai probabil aceasta eroare apare din cauza ca " +
													"valoarea pretului sau numarul noptilor nu este un numar.");
											}
										}
									}
								);
							}}
							className="primary workflow right">
							Salveaza
						</PaperRipple>
					</div>
				</div>
			</Modal>
		</div>;
	}
}
export default Edit;
