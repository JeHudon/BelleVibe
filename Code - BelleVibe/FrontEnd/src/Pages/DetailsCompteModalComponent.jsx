import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import AjouterDocuments from "../components/AjouterDocuments";
import { ForfaitCard } from "../components/ForfaitCard";
import FileViewer from "../components/FileViewer";
import { FormModal, ConfirmModal } from "../components/Modals";

// Field configs defined outside component so they don't re-create on every render
const FIELDS_DEMANDE = [
	{ key: "typeDemande", label: "Type de demande", type: "text" },
	{
		key: "statutDemande",
		label: "Statut",
		type: "select",
		options: ["Ouverte", "En attente", "En retard", "Fermée"],
	},
	{ key: "noteInterne", label: "Note interne", type: "textarea" },
];

const FIELDS_NOTE = [
	{ key: "type", label: "Type", type: "text" },
	{ key: "titre", label: "Titre", type: "text" },
	{ key: "note", label: "Note", type: "textarea" },
];

function DetailsCompteModalComponent() {
	const [client, setClient] = useState(null);
	const [compte, setCompte] = useState(null);
	const [forfaits, setForfaits] = useState(null);
	const [demandes, setDemandes] = useState(null);
	const [documents, setDocuments] = useState(null);
	const [notes, setNotes] = useState(null);
	const [editingDoc, setEditingDoc] = useState(null);
	const [previewDoc, setPreviewDoc] = useState(null);

	const [modalOpen, setModalOpen] = useState(false);
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
	});

	const { onglet, id } = useParams();
	const token = localStorage.getItem("token");
	const navigate = useNavigate();
	const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

	function updateFilters(onglet) {
		navigate(`/comptes/${id}/${onglet}`);
	}

	function formatDate(dateString) {
		return new Date(dateString).toLocaleDateString("fr-FR", {
			year: "numeric",
			month: "long",
			day: "numeric",
			hour: "2-digit",
			minute: "2-digit",
		});
	}

	const formatSize = (bytes) => {
		if (bytes < 1024) return `${bytes} B`;
		if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
		return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
	};

	function getUserId() {
		try {
			const user = JSON.parse(atob(token.split(".")[1]));
			return user.id;
		} catch {
			return null;
		}
	}

	useEffect(() => {
		const headers = { "Content-Type": "application/json", Authorization: `Bearer ${token}` };
		const get = (url) => fetch(url, { method: "GET", headers }).then((r) => r.json());

		get(`/api/comptes/getDossier/${id}`).then(setCompte);
		get(`/api/forfaitsDossier/${id}`).then(setForfaits);
		get(`/api/demandes/getDemande/${id}`).then(setDemandes);
		get(`/api/documents/${id}`).then(setDocuments);
		get(`/api/notes/${id}`).then(setNotes);
	}, [onglet, id]);

	useEffect(() => {
		if (!compte?.idClient) return;
		fetch(`/api/clients/getClient/${compte.idClient}`, {
			method: "GET",
			headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
		})
			.then((r) => r.json())
			.then(setClient);
	}, [compte?.idClient]);

	// Generic onChange handler for both forms
	function handleChangeDemande(key, val) {
		setFormDemande((prev) => ({ ...prev, [key]: val }));
	}
	function handleChangeNote(key, val) {
		setFormNote((prev) => ({ ...prev, [key]: val }));
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

	function ouvrirModifierNote(note) {
		setNoteSelectionnee(note);
		setFormNote({ type: note.typeNote, titre: note.titreNote, note: note.note });
		setModalModifierNote(true);
	}

	async function apiCall({ url, method = "GET", body, onSuccess, onError, onClose }) {
		const res = await fetch(url, {
			method,
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
				...(method === "DELETE" && { "Content-Type": undefined }),
			},
			body: body ? JSON.stringify(body) : undefined,
		});
		const data = await res.json();

		if (res.ok) {
			onSuccess(data.message);
			setTimeout(() => {
				onClose();
				window.location.reload();
			}, 1500);
		} else {
			onError(data.error);
		}
	}

	async function ajouterDemande({ onSuccess, onError }) {
		await apiCall({
			url: `/api/demandes/creerDemande/${id}`,
			method: "POST",
			body: formDemande,
			onSuccess,
			onError,
			onClose: () => setModalDemande(false),
		});
	}

	async function modifierDemande({ onSuccess, onError }) {
		await apiCall({
			url: `/api/demandes/modifierDemande/${demandeSelectionnee.idDemande}`,
			method: "PUT",
			body: formDemande,
			onSuccess,
			onError,
			onClose: () => setModalModifierDemande(false),
		});
	}

	async function ajouterNote({ onSuccess, onError }) {
		await apiCall({
			url: `/api/notes/${id}`,
			method: "POST",
			body: { idDossier: id, idEmploye: getUserId(), ...formNote },
			onSuccess,
			onError,
			onClose: () => setModalNote(false),
		});
	}

	async function modifierNote({ onSuccess, onError }) {
		await apiCall({
			url: `/api/notes/${noteSelectionnee.idNote}`,
			method: "PUT",
			body: { idDossier: id, idEmploye: getUserId(), ...formNote },
			onSuccess,
			onError,
			onClose: () => setModalModifierNote(false),
		});
	}

	async function supprimerNote({ onSuccess, onError }) {
		await apiCall({
			url: `/api/notes/${noteSelectionnee.idNote}`,
			method: "DELETE",
			onSuccess,
			onError,
			onClose: () => setModalSupprimerNote(false),
		});
	}

	async function supprimerDocument({ onSuccess, onError }) {
		await apiCall({
			url: `/api/documents/${documentSelectionne.idDocument}`,
			method: "DELETE",
			onSuccess,
			onError,
			onClose: () => setModalSupprimerDocument(false),
		});
	}

	return (
		<div className="section">
			<div className="container">
				<h1 className="title">Détails du compte</h1>
				<div className="tabs is-toggle is-toggle-rounded is-fullwidth">
					<ul>
						{["resume", "demandes", "documents", "notes", "facturation"].map((tab) => (
							<li key={tab} className={onglet === tab ? "is-active" : ""}>
								<a onClick={() => updateFilters(tab)}>
									{tab.charAt(0).toUpperCase() + tab.slice(1)}
								</a>
							</li>
						))}
					</ul>
				</div>

				{onglet === "resume" && (
					<div className="box" style={{ border: "1px solid #d6d6d6" }}>
						<div className="level">
							<div className="level-left">
								<h2 className="title is-5 is-spaced">Informations du compte</h2>
							</div>
							<div className="level-right">
								<Link to={`/modifierForfait/${compte?.idClient}`}>
									<button className="button is-dark">+ Modifier Forfait</button>
								</Link>
							</div>
						</div>
						<h3 className="title is-4">Forfaits actifs</h3>
						<div style={{ marginBottom: 20 }}>
							{forfaits?.length > 0 ? (
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
								<p className="has-text-weight-bold">{client?.courrielClient}</p>
							</div>
							<div className="column is-6">
								<label>Téléphone :</label>
								<p className="has-text-weight-bold">{client?.telephoneClient}</p>
							</div>
						</div>
						<label>Adresse :</label>
						<p className="has-text-weight-bold">{client?.adresseClient}</p>
					</div>
				)}

				{onglet === "demandes" && (
					<div className="box" style={{ border: "1px solid #d6d6d6" }}>
						<div className="level">
							<div className="level-left">
								<div>
									<h2 className="title is-5">Demandes de service</h2>
									<p className="subtitle is-6">
										Gérer les demandes pour ce compte
									</p>
								</div>
							</div>
							<div className="level-right">
								<button
									className="button is-dark"
									onClick={() => setModalDemande(true)}
								>
									+ Créer demande
								</button>
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
								{demandes?.length > 0 ? (
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
													style={{ fontWeight: "500" }}
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
													onClick={() => ouvrirModifierDemande(demande)}
												>
													<i className="fas fa-pen-to-square"></i>
												</button>
											</td>
										</tr>
									))
								) : (
									<tr>
										<td colSpan="5">
											Aucune demande de service pour ce compte.
										</td>
									</tr>
								)}
							</tbody>
						</table>
					</div>
				)}

				{onglet === "documents" && (
					<div className="box" style={{ border: "1px solid #d6d6d6" }}>
						<div className="level">
							<div className="level-left">
								<div>
									<h2 className="title is-5">Documents</h2>
									<p className="subtitle is-6">Gérer les documents du compte</p>
								</div>
							</div>
							<div className="level-right">
								<button
									className="button is-dark"
									onClick={() => setModalOpen(true)}
								>
									+ Ajouter document
								</button>
							</div>
						</div>
						<AjouterDocuments
							isOpen={!!editingDoc || modalOpen}
							onClose={() => {
								setEditingDoc(null);
								setModalOpen(false);
							}}
							idDossier={id}
							documentToEdit={editingDoc}
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
									<th style={{ width: "250px" }}>Nom du fichier</th>
									<th style={{ width: "100px" }}>Taille</th>
									<th style={{ width: "180px" }}>Ajouté le</th>
									<th style={{ width: "120px" }}>Actions</th>
								</tr>
							</thead>
							<tbody>
								{documents?.length > 0 ? (
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
												<button
													className="button is-medium is-ghost"
													style={{
														paddingLeft: "0.5rem",
														paddingRight: "0.5rem",
													}}
													title="Supprimer"
													onClick={() => {
														setDocumentSelectionne(document);
														setModalSupprimerDocument(true);
													}}
												>
													<i className="fa-solid fa-trash"></i>
												</button>
											</td>
										</tr>
									))
								) : (
									<tr>
										<td colSpan="5">Aucun document pour ce compte.</td>
									</tr>
								)}
							</tbody>
						</table>
					</div>
				)}

				{onglet === "notes" && (
					<div className="box" style={{ border: "1px solid #d6d6d6" }}>
						<div className="level">
							<div className="level-left">
								<div>
									<h2 className="title is-5">Notes</h2>
									<p className="subtitle is-6">
										Historique des notes pour ce compte
									</p>
								</div>
							</div>
							<div className="level-right">
								<button
									className="button is-dark"
									onClick={() => setModalNote(true)}
								>
									+ Ajouter note
								</button>
							</div>
						</div>
						{notes?.length > 0 ? (
							notes.map((note) => (
								<div
									key={note.idNote}
									style={{
										border: "1px solid #d6d6d6",
										borderRadius: "6px",
										padding: "1rem",
										marginBottom: "1rem",
									}}
								>
									<div
										className="is-flex is-justify-content-space-between is-align-items-flex-start"
										style={{ gap: "1rem" }}
									>
										<div>
											<p className="title is-6 mb-2">{note.titreNote}</p>
											<p className="mb-1">{note.note}</p>
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

				{/* --- MODALS --- */}
				<>
					<FormModal
						isOpen={modalDemande}
						title="Créer une demande"
						fields={FIELDS_DEMANDE}
						values={formDemande}
						onChange={handleChangeDemande}
						onConfirm={ajouterDemande}
						onClose={() => setModalDemande(false)}
					/>

					<FormModal
						isOpen={modalModifierDemande}
						title="Modifier la demande"
						fields={FIELDS_DEMANDE}
						values={formDemande}
						onChange={handleChangeDemande}
						onConfirm={modifierDemande}
						onClose={() => setModalModifierDemande(false)}
					/>

					<FormModal
						isOpen={modalNote}
						title="Ajouter une note"
						fields={FIELDS_NOTE}
						values={formNote}
						onChange={handleChangeNote}
						onConfirm={ajouterNote}
						onClose={() => setModalNote(false)}
					/>

					<FormModal
						isOpen={modalModifierNote}
						title="Modifier la note"
						fields={FIELDS_NOTE}
						values={formNote}
						onChange={handleChangeNote}
						onConfirm={modifierNote}
						onClose={() => setModalModifierNote(false)}
					/>

					<ConfirmModal
						isOpen={modalSupprimerNote}
						title="Supprimer la note"
						description="Voulez-vous vraiment supprimer cette note ?"
						itemName={noteSelectionnee?.titreNote}
						onConfirm={supprimerNote}
						onClose={() => setModalSupprimerNote(false)}
					/>

					<ConfirmModal
						isOpen={modalSupprimerDocument}
						title="Supprimer le document"
						description="Voulez-vous vraiment supprimer ce document ?"
						itemName={documentSelectionne?.nomDocument}
						onConfirm={supprimerDocument}
						onClose={() => setModalSupprimerDocument(false)}
					/>
				</>
			</div>
		</div>
	);
}

export default DetailsCompteModalComponent;
