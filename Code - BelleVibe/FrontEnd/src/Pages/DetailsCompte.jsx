import React, { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AjouterDocuments from "../components/AjouterDocuments";
import { ForfaitCard } from "../components/ForfaitCard";
import { Link } from "react-router-dom";
import FileViewer from "../components/FileViewer";

function DetailsCompte() {
	const [client, setClient] = useState(null);
	const [compte, setCompte] = useState(null);
	const [forfaits, setForfaits] = useState(null);
	const [demandes, setDemandes] = useState(null);
	const [documents, setDocuments] = useState(null);
	const [notes, setNotes] = useState(null);
	const [editingDoc, setEditingDoc] = useState(null);
	const [previewDoc, setPreviewDoc] = useState(null);

	const [modalOpen, setModalOpen] = useState(false);
	//Ajout Karel
	//Ajout Karel
	const [modalDemande, setModalDemande] = useState(false);
	const [modalModifierDemande, setModalModifierDemande] = useState(false);
	const [modalNote, setModalNote] = useState(false);
	const [modalModifierNote, setModalModifierNote] = useState(false);
	const [modalSupprimerNote, setModalSupprimerNote] = useState(false);
	const [modalSupprimerDocument, setModalSupprimerDocument] = useState(false);

	const [demandeSelectionnee, setDemandeSelectionnee] = useState(null);
	const [noteSelectionnee, setNoteSelectionnee] = useState(null);
	const [documentSelectionne, setDocumentSelectionne] = useState(null);

	const [formDemande, setFormDemande] = useState({
		typeDemande: "",
		statutDemande: "Ouverte",
		noteInterne: "",
	});

	const [formNote, setFormNote] = useState({
		type: "",
		titre: "",
		note: "",
	}); //Ajout Karel

	const { onglet } = useParams();
	const { id } = useParams();

	const token = localStorage.getItem("token");

	const navigate = useNavigate();

	const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

	function updateFilters(onglet) {
		navigate(`/comptes/${id}/${onglet}`);
	}

	function formatDate(dateString) {
		const options = {
			year: "numeric",
			month: "long",
			day: "numeric",
			hour: "2-digit",
			minute: "2-digit",
		};
		return new Date(dateString).toLocaleDateString("fr-FR", options);
	}

	useEffect(() => {
		async function fetchCompte() {
			const data = await fetch(`/api/comptes/getDossier/${id}`, {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
			}).then((res) => res.json());
			setCompte(data);
		}
		async function fetchForfaits() {
			const data = await fetch(`/api/forfaitsDossier/${id}`, {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
			}).then((res) => res.json());
			setForfaits(data);
		}
		async function fetchDemandes() {
			const data = await fetch(`/api/demandes/getDemande/${id}`, {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
			}).then((res) => res.json());
			setDemandes(data);
		}
		async function fetchDocuments() {
			const data = await fetch(`/api/documents/${id}`, {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
			}).then((res) => res.json());
			setDocuments(data);
		}
		async function fetchNotes() {
			const data = await fetch(`/api/notes/${id}`, {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
			}).then((res) => res.json());
			setNotes(data);
		}

		// fetchClient();
		fetchCompte();
		fetchForfaits();
		fetchDemandes();
		fetchDocuments();
		fetchNotes();
	}, [onglet, id]);

	useEffect(() => {
		async function fetchClient() {
			const data = await fetch(
				`/api/clients/getClient
				/${compte?.idClient}`,
				{
					method: "GET",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`,
					},
				},
			).then((res) => res.json());
			setClient(data);
		}
		if (compte?.idClient) {
			fetchClient(compte.idClient);
		}
	}, [compte?.idClient]);

	const formatSize = (bytes) => {
		if (bytes < 1024) return `${bytes} B`;
		if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
		return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
	};
	//Ajout Karel
	//Ajout Karel
	function getUserId() {
		try {
			const user = JSON.parse(atob(token.split(".")[1]));
			return user.id;
		} catch {
			return null;
		}
	}

	async function ajouterDemande() {
		const res = await fetch(`/api/demandes/creerDemande/${id}`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify(formDemande),
		});
		async function ajouterDemande() {
			const res = await fetch(`/api/demandes/creerDemande/${id}`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify(formDemande),
			});

			if (res.ok) {
				setModalDemande(false);
				window.location.reload();
			}
		}
		if (res.ok) {
			setModalDemande(false);
			window.location.reload();
		}
	}

	function ouvrirModifierDemande(demande) {
		setDemandeSelectionnee(demande);
		setFormDemande({
			typeDemande: demande.typeDemande,
			statutDemande: demande.statutDemande,
			noteInterne: demande.noteInterne,
		});
		setModalModifierDemande(true);
	}

	async function modifierDemande() {
		const res = await fetch(`/api/demandes/modifierDemande/${demandeSelectionnee.idDemande}`, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify(formDemande),
		});

		if (res.ok) {
			setModalModifierDemande(false);
			window.location.reload();
		}
	}

	async function ajouterNote() {
		const res = await fetch(`/api/notes/${id}`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify({
				idDossier: id,
				idEmploye: getUserId(),
				type: formNote.type,
				titre: formNote.titre,
				note: formNote.note,
			}),
		});
	}

	function ouvrirModifierNote(note) {
		setNoteSelectionnee(note);
		setFormNote({
			type: note.typeNote,
			titre: note.titreNote,
			note: note.note,
		});
		setModalModifierNote(true);
	}

	async function modifierNote() {
		const res = await fetch(`/api/notes/${noteSelectionnee.idNote}`, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify({
				idDossier: id,
				idEmploye: getUserId(),
				type: formNote.type,
				titre: formNote.titre,
				note: formNote.note,
			}),
		});

		if (res.ok) {
			setModalModifierNote(false);
			window.location.reload();
		}
	}

	async function supprimerNote() {
		const res = await fetch(`/api/notes/${noteSelectionnee.idNote}`, {
			method: "DELETE",
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});

		if (res.ok) {
			setModalSupprimerNote(false);
			window.location.reload();
		}
	}

	async function supprimerDocument() {
		const res = await fetch(`/api/documents/${documentSelectionne.idDocument}`, {
			method: "DELETE",
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});

		if (res.ok) {
			setModalSupprimerDocument(false);
			window.location.reload();
		}
	} //Ajout Karel

	return (
		<div className="section">
			<div className="container">
				<h1 className="title">Détails du compte</h1>
				<div className="tabs is-toggle is-toggle-rounded is-fullwidth">
					<ul>
						<li className={onglet === "resume" ? "is-active" : ""}>
							<a onClick={() => updateFilters("resume")}>Résumé</a>
						</li>
						<li className={onglet === "demandes" ? "is-active" : ""}>
							<a onClick={() => updateFilters("demandes")}>Demandes</a>
						</li>
						<li className={onglet === "documents" ? "is-active" : ""}>
							<a onClick={() => updateFilters("documents")}>Documents</a>
						</li>
						<li className={onglet === "notes" ? "is-active" : ""}>
							<a onClick={() => updateFilters("notes")}>Notes</a>
						</li>
						<li className={onglet === "facturation" ? "is-active" : ""}>
							<a onClick={() => updateFilters("facturation")}>Facturation</a>
						</li>
					</ul>
				</div>
				{onglet === "resume" && (
					<div className="box" style={{ border: "1px solid #d6d6d6" }}>
						<div className="level">
							<div className="level-left">
								<div className="level-item">
									<div>
										<h2 className="title is-5 is-spaced">
											Informations du compte -{" "}
											{client?.prenomClient + " " + client?.nomClient}
										</h2>
									</div>
								</div>
							</div>
							<div className="level-right">
								<div className="level-item">
									<Link to={`/modifierForfait/${compte?.idClient}`}>
										<button
											className="button is-dark"
											onClick={() => setModalDemande(true)}
										>
											+ Modifier Forfait
										</button>
									</Link>
								</div>
							</div>
						</div>
						<h3 className="title is-4">Forfaits actifs</h3>
						<div style={{ marginBottom: 20 }}>
							{forfaits && forfaits.length > 0 ? (
								forfaits.map((forfait) => (
									<ForfaitCard
										key={forfait.idForfait}
										forfait={forfait}
										isDark={isDark}
									/>
								))
							) : (
								<p>Aucun forfait trouvé pour ce compte</p>
							)}
							<p>
								<span className="has-text-weight-bold">Solde dû par mois : </span>
								{compte?.soldeDossier} $
							</p>
						</div>
						<h3 className="title is-4">
							Informations clients - {client?.prenomClient + " " + client?.nomClient}
						</h3>
						<div className="columns">
							<div className="column is-6">
								<label>Email :</label>
								<div className="control">
									<p className="has-text-weight-bold">{client?.courrielClient}</p>
								</div>
							</div>
							<div className="column is-6">
								<label>Téléphone :</label>
								<div className="control">
									<p className="has-text-weight-bold">
										{client?.telephoneClient}
									</p>
								</div>
							</div>
						</div>
						<div className="">
							<label>Adresse :</label>
							<div className="control">
								<p className="has-text-weight-bold">{client?.adresseClient}</p>
							</div>
						</div>
					</div>
				)}
				{onglet === "demandes" && (
					<div className="box " style={{ border: "1px solid #d6d6d6" }}>
						<div className="level">
							<div className="level-left">
								<div className="level-item">
									<div>
										<h2 className="title is-5">Demandes de service</h2>
										<p className="subtitle is-6">
											Gérer les demandes pour ce compte
										</p>
									</div>
								</div>
							</div>
							<div className="level-right">
								<div className="level-item">
									<button
										className="button is-dark"
										onClick={() => setModalDemande(true)}
									>
										+ Créer demande
									</button>
								</div>
							</div>
						</div>

						<table
							className="table is-fullwidth is-striped is-hoverable"
							style={{ tableLayout: "fixed" }}
						>
							<thead>
								<tr>
									<th style={{ width: "100px" }}>Catégorie</th>
									<th style={{ width: "400px" }}>Description</th>
									<th style={{ width: "80px" }}>Statut</th>
									<th style={{ width: "150px" }}>Créée le</th>
									<th style={{ width: "60px" }}>Actions</th>
								</tr>
							</thead>
							<tbody>
								{demandes && demandes.length > 0 ? (
									demandes.map((demande) => (
										<tr style={{ height: "55px" }} key={demande.idDemande}>
											<td className="is-vcentered">
												<strong>{demande.typeDemande}</strong>
											</td>
											<td className="is-vcentered">{demande.noteInterne}</td>
											<td className="is-vcentered">
												<span
													className={
														demande.statutDemande === "Ouverte"
															? "tag is-success"
															: demande.statutDemande === "En attente"
																? "tag is-warning"
																: demande.statutDemande === "Fermée"
																	? "tag is-dark"
																	: "tag is-danger"
													}
													style={{
														fontWeight: "500",
													}}
												>
													{demande.statutDemande}
												</span>
											</td>
											<td className="is-vcentered">
												{formatDate(demande.created_at)}
											</td>
											<td className="is-vcentered">
												<button
													className="button is-medium is-ghost"
													style={{
														paddingLeft: "0.5rem",
														paddingRight: "0.5rem",
													}}
													title="Modifier"
													onClick={() => ouvrirModifierDemande(demande)}
												>
													<i className="fas fa-pen-to-square"></i>
												</button>
											</td>
										</tr>
									))
								) : (
									<tr>
										<td colSpan="6">
											Aucune demande de service pour ce compte.
										</td>
									</tr>
								)}
							</tbody>
						</table>
					</div>
				)}
				{onglet === "documents" && (
					<div className="box " style={{ border: "1px solid #d6d6d6" }}>
						<div className="level">
							<div className="level-left">
								<div className="level-item">
									<div>
										<h2 className="title is-5">Documents</h2>
										<p className="subtitle is-6">
											Gérer les documents du compte
										</p>
									</div>
								</div>
							</div>
							<div className="level-right">
								<div className="level-item">
									<button
										className="button is-dark"
										onClick={() => setModalOpen(true)}
									>
										+ Ajouter document
									</button>
								</div>
							</div>
						</div>

						<AjouterDocuments
							isOpen={!!editingDoc || modalOpen}
							onClose={() => {
								setEditingDoc(null);
								setModalOpen(false);
								setMessage([]);
							}}
							idDossier={id}
							documentToEdit={editingDoc} // null = add mode, { id, name } = edit mode
						/>

						<FileViewer
							id={previewDoc?.idDocument}
							ext={previewDoc?.typeDocument}
							fileName={previewDoc?.nomDocument}
							isOpen={!!previewDoc}
							onClose={() => setPreviewDoc(null)}
						/>

						<table
							className="table is-fullwidth is-striped is-hoverable"
							style={{ tableLayout: "fixed" }}
						>
							<thead>
								<tr>
									<th style={{ width: "100px" }}>Type</th>
									<th style={{ width: "350px" }}>Nom du fichier</th>
									<th style={{ width: "100px" }}>Taille</th>
									<th style={{ width: "180px" }}>Ajouté le</th>
									<th style={{ width: "100px" }}>Actions</th>
								</tr>
							</thead>
							<tbody>
								{documents && documents.length > 0 ? (
									documents.map((document) => (
										<tr style={{ height: "55px" }} key={document.idDocument}>
											<td className="is-vcentered">
												<strong>{document.typeDocument}</strong>
											</td>
											<td className="is-vcentered">{document.nomDocument}</td>
											<td className="is-vcentered">
												{formatSize(document.tailleDocument)}
											</td>
											<td className="is-vcentered">
												{formatDate(document.created_at)}
											</td>
											<td className="is-vcentered">
												<button
													className="button is-medium is-ghost"
													style={{
														paddingLeft: "0.5rem",
														paddingRight: "0.5rem",
													}}
													title="Modifier"
													onClick={() =>
														setEditingDoc({
															id: document.idDocument,
															name: document.nomDocument,
														})
													}
												>
													<i className="fa-solid fa-pen-to-square"></i>
												</button>
												<a
													className="button is-medium is-ghost"
													style={{
														paddingLeft: "0.5rem",
														paddingRight: "0.5rem",
													}}
													href={`http://localhost:3000/download/${document.idDocument}`}
													download={document.nomDocument}
													title="Télécharger"
												>
													<i className="fa-solid fa-download"></i>
												</a>
												<button
													className="button is-medium is-ghost"
													style={{
														paddingLeft: "0.5rem",
														paddingRight: "0.5rem",
													}}
													title="Aperçu"
													onClick={() => setPreviewDoc(document)}
												>
													<i className="fa-solid fa-eye"></i>
												</button>
											</td>
										</tr>
									))
								) : (
									<tr>
										<td colSpan="6">
											Aucune demande de service pour ce compte.
										</td>
									</tr>
								)}
							</tbody>
						</table>
					</div>
				)}
				{onglet === "notes" && (
					<div className="box " style={{ border: "1px solid #d6d6d6" }}>
						<div className="level">
							<div className="level-left">
								<div className="level-item">
									<div>
										<h2 className="title is-5">Notes</h2>
										<p className="subtitle is-6">
											Historique des notes pour ce compte
										</p>
									</div>
								</div>
							</div>
							<div className="level-right">
								<div className="level-item">
									<button
										className="button is-dark"
										onClick={() => setModalNote(true)}
									>
										+ Ajouter note
									</button>
								</div>
							</div>
						</div>
						{notes && notes.length > 0 ? (
							notes.map((note) => (
								<div
									style={{
										border: "1px solid #d6d6d6",
										borderRadius: "6px",
										padding: "1rem",
										marginBottom: "1rem",
									}}
									key={note.idNote}
								>
									<div
										className="is-flex is-justify-content-space-between is-align-items-flex-start"
										style={{ gap: "1rem" }}
									>
										<div>
											<p className="title is-6 mb-2">{note.titreNote}</p>
											<p className="mb-1">{note.note}</p>{" "}
											<p style={{ fontSize: "0.875em" }}>
												Par {note.prenomEmploye} {note.nomEmploye}
											</p>
										</div>

										<div className="has-text-right">
											<div>{formatDate(note.created_at)}</div>

											<div
												className="buttons are-medium mt-2"
												style={{ gap: "0px", justifyContent: "flex-end" }}
											>
												<button
													className="button is-ghost"
													onClick={() => ouvrirModifierNote(note)}
												>
													<i className="fa-solid fa-pen-to-square"></i>
												</button>

												<button
													className="button is-ghost"
													style={{
														paddingLeft: "0.5rem",
														paddingRight: "0.5rem",
													}}
													onClick={() => {
														setNoteSelectionnee(note);
														setModalSupprimerNote(true);
													}}
												>
													<i className="fa-solid fa-trash"></i>
												</button>
											</div>
										</div>
									</div>
								</div>
							))
						) : (
							<p>Aucune note pour ce compte.</p>
						)}
					</div>
				)}

				{modalDemande && (
					<div className="modal is-active">
						<div
							className="modal-background"
							onClick={() => setModalDemande(false)}
						></div>
						<div className="modal-card">
							<header className="modal-card-head">
								<p className="modal-card-title">Créer une demande</p>
								<button
									className="delete"
									onClick={() => setModalDemande(false)}
								></button>
							</header>

							<section className="modal-card-body">
								<div className="field">
									<label className="label">Type de demande</label>
									<input
										className="input"
										value={formDemande.typeDemande}
										onChange={(e) =>
											setFormDemande({
												...formDemande,
												typeDemande: e.target.value,
											})
										}
									/>
								</div>

								<div className="field">
									<label className="label">Statut</label>
									<div className="select is-fullwidth">
										<select
											value={formDemande.statutDemande}
											onChange={(e) =>
												setFormDemande({
													...formDemande,
													statutDemande: e.target.value,
												})
											}
										>
											<option>Ouverte</option>
											<option>En attente</option>
											<option>En retard</option>
											<option>Fermée</option>
										</select>
									</div>
								</div>

								<div className="field">
									<label className="label">Note interne</label>
									<textarea
										className="textarea"
										value={formDemande.noteInterne}
										onChange={(e) =>
											setFormDemande({
												...formDemande,
												noteInterne: e.target.value,
											})
										}
									/>
								</div>
							</section>

							<footer className="modal-card-foot">
								<button className="button is-dark" onClick={ajouterDemande}>
									Enregistrer
								</button>
								<button className="button" onClick={() => setModalDemande(false)}>
									Annuler
								</button>
							</footer>
						</div>
					</div>
				)}

				{modalModifierDemande && (
					<div className="modal is-active">
						<div
							className="modal-background"
							onClick={() => setModalModifierDemande(false)}
						></div>
						<div className="modal-card">
							<header className="modal-card-head">
								<p className="modal-card-title">Modifier la demande</p>
								<button
									className="delete"
									onClick={() => setModalModifierDemande(false)}
								></button>
							</header>

							<section className="modal-card-body">
								<div className="field">
									<label className="label">Type de demande</label>
									<input
										className="input"
										value={formDemande.typeDemande}
										onChange={(e) =>
											setFormDemande({
												...formDemande,
												typeDemande: e.target.value,
											})
										}
									/>
								</div>

								<div className="field">
									<label className="label">Statut</label>
									<div className="select is-fullwidth">
										<select
											value={formDemande.statutDemande}
											onChange={(e) =>
												setFormDemande({
													...formDemande,
													statutDemande: e.target.value,
												})
											}
										>
											<option>Ouverte</option>
											<option>En attente</option>
											<option>En retard</option>
											<option>Fermée</option>
										</select>
									</div>
								</div>

								<div className="field">
									<label className="label">Note interne</label>
									<textarea
										className="textarea"
										value={formDemande.noteInterne}
										onChange={(e) =>
											setFormDemande({
												...formDemande,
												noteInterne: e.target.value,
											})
										}
									/>
								</div>
							</section>

							<footer className="modal-card-foot">
								<button className="button is-dark" onClick={modifierDemande}>
									Enregistrer
								</button>
								<button
									className="button"
									onClick={() => setModalModifierDemande(false)}
								>
									Annuler
								</button>
							</footer>
						</div>
					</div>
				)}

				{modalNote && (
					<div className="modal is-active">
						<div className="modal-background" onClick={() => setModalNote(false)}></div>
						<div className="modal-card">
							<header className="modal-card-head">
								<p className="modal-card-title">Ajouter une note</p>
								<button
									className="delete"
									onClick={() => setModalNote(false)}
								></button>
							</header>

							<section className="modal-card-body">
								<div className="field">
									<label className="label">Type</label>
									<input
										className="input"
										value={formNote.type}
										onChange={(e) =>
											setFormNote({ ...formNote, type: e.target.value })
										}
									/>
								</div>

								<div className="field">
									<label className="label">Titre</label>
									<input
										className="input"
										value={formNote.titre}
										onChange={(e) =>
											setFormNote({ ...formNote, titre: e.target.value })
										}
									/>
								</div>

								<div className="field">
									<label className="label">Note</label>
									<textarea
										className="textarea"
										value={formNote.note}
										onChange={(e) =>
											setFormNote({ ...formNote, note: e.target.value })
										}
									/>
								</div>
							</section>

							<footer className="modal-card-foot">
								<button className="button is-dark" onClick={ajouterNote}>
									Enregistrer
								</button>
								<button className="button" onClick={() => setModalNote(false)}>
									Annuler
								</button>
							</footer>
						</div>
					</div>
				)}

				{modalModifierNote && (
					<div className="modal is-active">
						<div
							className="modal-background"
							onClick={() => setModalModifierNote(false)}
						></div>
						<div className="modal-card">
							<header className="modal-card-head">
								<p className="modal-card-title">Modifier la note</p>
								<button
									className="delete"
									onClick={() => setModalModifierNote(false)}
								></button>
							</header>

							<section className="modal-card-body">
								<div className="field">
									<label className="label">Type</label>
									<input
										className="input"
										value={formNote.type}
										onChange={(e) =>
											setFormNote({ ...formNote, type: e.target.value })
										}
									/>
								</div>

								<div className="field">
									<label className="label">Titre</label>
									<input
										className="input"
										value={formNote.titre}
										onChange={(e) =>
											setFormNote({ ...formNote, titre: e.target.value })
										}
									/>
								</div>

								<div className="field">
									<label className="label">Note</label>
									<textarea
										className="textarea"
										value={formNote.note}
										onChange={(e) =>
											setFormNote({ ...formNote, note: e.target.value })
										}
									/>
								</div>
							</section>

							<footer className="modal-card-foot">
								<button className="button is-dark" onClick={modifierNote}>
									Enregistrer
								</button>
								<button
									className="button"
									onClick={() => setModalModifierNote(false)}
								>
									Annuler
								</button>
							</footer>
						</div>
					</div>
				)}

				{modalSupprimerNote && (
					<div className="modal is-active">
						<div
							className="modal-background"
							onClick={() => setModalSupprimerNote(false)}
						></div>
						<div className="modal-card">
							<header className="modal-card-head">
								<p className="modal-card-title">Supprimer la note</p>
								<button
									className="delete"
									onClick={() => setModalSupprimerNote(false)}
								></button>
							</header>

							<section className="modal-card-body">
								<p>Voulez-vous vraiment supprimer cette note ?</p>
								<p className="has-text-weight-bold mt-2">
									{noteSelectionnee?.titreNote}
								</p>
							</section>

							<footer className="modal-card-foot">
								<button className="button is-danger" onClick={supprimerNote}>
									Supprimer
								</button>
								<button
									className="button"
									onClick={() => setModalSupprimerNote(false)}
								>
									Annuler
								</button>
							</footer>
						</div>
					</div>
				)}

				{modalSupprimerDocument && (
					<div className="modal is-active">
						<div
							className="modal-background"
							onClick={() => setModalSupprimerDocument(false)}
						></div>
						<div className="modal-card">
							<header className="modal-card-head">
								<p className="modal-card-title">Supprimer le document</p>
								<button
									className="delete"
									onClick={() => setModalSupprimerDocument(false)}
								></button>
							</header>

							<section className="modal-card-body">
								<p>Voulez-vous vraiment supprimer ce document ?</p>
								<p className="has-text-weight-bold mt-2">
									{documentSelectionne?.nomDocument}
								</p>
							</section>

							<footer className="modal-card-foot">
								<button className="button is-danger" onClick={supprimerDocument}>
									Supprimer
								</button>
								<button
									className="button"
									onClick={() => setModalSupprimerDocument(false)}
								>
									Annuler
								</button>
							</footer>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}

export default DetailsCompte;
