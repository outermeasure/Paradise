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
	PageDetailsCoverPhoto: "",
	PageDetailsMarkdown: "",
	Url: "",
	Price: 1000,
	CardPhoto: "",
	CardTitle: "",
	CardDescription: "",
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
							<td>{pack.CardTitle}</td>
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
					{fp ? <h3>
						{fp.Id || fp.Id === 0 ?
							"Modificare Pachet" : "Adaugare Pachet"}
					</h3> : null}
					{fp ? <form>
						<ul>
							{fp.Id || fp.Id === 0 ? <li>
								<label>Id</label>
								<input
									type="text"
									defaultValue={fp.Id}
									disabled={true}/>
							</li> : null}
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
									defaultValue={fp.PageDetailsCoverPhoto}
									onBlur={
										(e) => {
											that.setState({
												...that.state,
												focusedPackage: {
													...that.state.focusedPackage,
													PageDetailsCoverPhoto: e.target.value,
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
									defaultValue={fp.PageDetailsMarkdown}
									onBlur={
										(e) => {
											that.setState({
												...that.state,
												focusedPackage: {
													...that.state.focusedPackage,
													PageDetailsMarkdown: e.target.value,
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
								<label>Pret</label>
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
								<label>Moneda</label>
								<input
									type="text"
									defaultValue={fp.Currency}
									onBlur={
										(e) => {
											that.setState({
												...that.state,
												focusedPackage: {
													...that.state.focusedPackage,
													Currency: e.target.value,
												},
											});
										}
									}
								/>
							</li>
							<li>
								<label>Fotografie card (URL)</label>
								<input
									defaultValue={fp.CardPhoto}
									onBlur={
										(e) => {
											that.setState({
												...that.state,
												focusedPackage: {
													...that.state.focusedPackage,
													CardPhoto: e.target.value,
												},
											});
										}
									}
									type="text"/>
							</li>
							<li>
								<label>Titlu Card</label>
								<input
									defaultValue={fp.CardTitle}
									onBlur={
										(e) => {
											that.setState({
												...that.state,
												focusedPackage: {
													...that.state.focusedPackage,
													CardTitle: e.target.value,
												},
											});
										}
									}
									type="text"/>
							</li>
							<li>
								<label>Descriere Card</label>
								<input
									defaultValue={fp.CardDescription}
									onBlur={
										(e) => {
											that.setState({
												...that.state,
												focusedPackage: {
													...that.state.focusedPackage,
													CardDescription: e.target.value,
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
								<label>Rang pagina principala</label>
								<input
									defaultValue={fp.RankOnIndexPage}
									onBlur={
										(e) => {
											that.setState({
												...that.state,
												focusedPackage: {
													...that.state.focusedPackage,
													RankOnIndexPage: parseInt(e.target.value),
												},
											});
										}
									}
									type="text"/>
							</li>
                            <li>
								<label>Rang pagina oferte</label>
								<input
									defaultValue={fp.RankOnPackagePage}
									onBlur={
										(e) => {
											that.setState({
												...that.state,
												focusedPackage: {
													...that.state.focusedPackage,
													RankOnPackagePage: parseInt(e.target.value),
												},
											});
										}
									}
									type="text"/>
							</li>
                            <li>
								<label>Titlu SEO</label>
								<input
									defaultValue={fp.SEOTitle}
									onBlur={
										(e) => {
											that.setState({
												...that.state,
												focusedPackage: {
													...that.state.focusedPackage,
													SEOTitle: e.target.value,
												},
											});
										}
									}
									type="text"/>
							</li>
                            <li>
								<label>Descriere SEO</label>
								<input
									defaultValue={fp.SEODescription}
									onBlur={
										(e) => {
											that.setState({
												...that.state,
												focusedPackage: {
													...that.state.focusedPackage,
													SEODescription: e.target.value,
												},
											});
										}
									}
									type="text"/>
							</li>
                            <li>
								<label>Cuvinte cheie SEO</label>
								<input
									defaultValue={fp.SEOKeywords}
									onBlur={
										(e) => {
											that.setState({
												...that.state,
												focusedPackage: {
													...that.state.focusedPackage,
													SEOKeywords: e.target.value,
												},
											});
										}
									}
									type="text"/>
							</li>
                            <li>
								<label>Limba SEO</label>
								<input
									defaultValue={fp.SEOContentLanguage}
									onBlur={
										(e) => {
											that.setState({
												...that.state,
												focusedPackage: {
													...that.state.focusedPackage,
													SEOContentLanguage: e.target.value,
												},
											});
										}
									}
									type="text"/>
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
