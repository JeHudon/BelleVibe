import React, { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AjouterDocuments from "../components/AjouterDocuments";
import { ForfaitCard } from "../components/ForfaitCard";

function DetailsCompte() {
	const [client, setClient] = useState(null);
	const [compte, setCompte] = useState(null);
	const [forfaits, setForfaits] = useState(null);
	const [demandes, setDemandes] = useState(null);
	const [documents, setDocuments] = useState(null);
	const [notes, setNotes] = useState(null);
	const [editingDoc, setEditingDoc] = useState(null);

	const [modalOpen, setModalOpen] = useState(false);

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
		// async function fetchClient() {
		// 	const data = await fetch(
		// 		`/api/clients/getClient
		// 		/${id}`,
		// 		{
		// 			method: "GET",
		// 			headers: {
		// 				"Content-Type": "application/json",
		// 				Authorization: `Bearer ${token}`,
		// 			},
		// 		},
		// 	).then((res) => res.json());
		// 	setClient(data);
		// }
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

	const formatSize = (bytes) => {
		if (bytes < 1024) return `${bytes} B`;
		if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
		return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
	};

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
						<h2 className="title is-5 is-spaced">Informations du compte</h2>
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
						<h3 className="title is-4">Informations clients</h3>
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
									<button className="button is-dark">+ Créer demande</button>
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
							}}
							idDossier={id}
							documentToEdit={editingDoc} // null = add mode, { id, name } = edit mode
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
												<button
													className="button is-medium is-ghost"
													style={{
														paddingLeft: "0.5rem",
														paddingRight: "0.5rem",
													}}
													title="Telecharger"
												>
													<i className="fa-solid fa-download"></i>
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
									<button className="button is-dark">+ Ajouter note</button>
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

										<div>{formatDate(note.created_at)}</div>
									</div>
								</div>
							))
						) : (
							<p>Aucune note pour ce compte.</p>
						)}
					</div>
				)}
			</div>
		</div>
	);
}

export default DetailsCompte;
