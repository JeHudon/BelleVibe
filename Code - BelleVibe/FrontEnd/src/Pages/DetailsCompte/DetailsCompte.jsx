import React, { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";

function DetailsCompte() {
	const [client, setClient] = useState(null);
	const [forfaits, setForfaits] = useState(null);
	const [demandes, setDemandes] = useState(null);

	const { onglet } = useParams();
	const { id } = useParams();

	const navigate = useNavigate();

	const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

	function updateFilters(onglet) {
		navigate(`/comptes/${id}/${onglet}`);
	}

	useEffect(() => {
		async function fetchClient() {
			const data = await fetch(
				`/api/clients/getClient
				/${id}`,
				{
					method: "GET",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${localStorage.getItem("token")}`,
					},
				},
			).then((res) => res.json());
			setClient(data);
			console.log(data);
		}
		async function fetchForfaits() {
			const data = await fetch(`/api/forfaitsDossier/${id}`, {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${localStorage.getItem("token")}`,
				},
			}).then((res) => res.json());
			setForfaits(data);
		}
		async function fetchDemandes() {
			const data = await fetch(`/api/demandes/getDemande/${id}`, {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${localStorage.getItem("token")}`,
				},
			}).then((res) => res.json());
			setDemandes(data);
		}

		fetchClient();
		fetchForfaits();
		fetchDemandes();
	}, []);

	return (
		<div className="section">
			<div className="container">
				<h1 className="title">Détails du compte</h1>
				<div className="tabs is-toggle is-toggle-rounded is-fullwidth">
					<ul>
						<li className={onglet === "resume" ? "is-active" : ""}>
							<a onClick={() => updateFilters("resume")}>
								Résumé
							</a>
						</li>
						<li
							className={onglet === "demandes" ? "is-active" : ""}
						>
							<a onClick={() => updateFilters("demandes")}>
								Demandes
							</a>
						</li>
						<li
							className={
								onglet === "documents" ? "is-active" : ""
							}
						>
							<a onClick={() => updateFilters("documents")}>
								Documents
							</a>
						</li>
						<li className={onglet === "notes" ? "is-active" : ""}>
							<a onClick={() => updateFilters("notes")}>Notes</a>
						</li>
						<li
							className={
								onglet === "facturation" ? "is-active" : ""
							}
						>
							<a onClick={() => updateFilters("facturation")}>
								Facturation
							</a>
						</li>
					</ul>
				</div>
				{onglet === "resume" && (
					<div
						className="box is-shadowless"
						style={{ border: "1px solid #d6d6d6" }}
					>
						<h2 className="title is-5 is-spaced">
							Informations du compte
						</h2>
						<h3 className="title is-4">Forfaits actifs</h3>
						{forfaits && forfaits.length > 0 ? (
							forfaits.map((forfait) =>
								forfait.typeService === "Mobile" ? (
									<div
										className={
											isDark
												? "notification is-info"
												: "notification is-info is-light"
										}
									>
										<div
											className="is-flex is-align-items-center"
											style={{ gap: "14px" }}
										>
											<span className="icon is-medium">
												<i className="fa-solid fa-signal"></i>
											</span>
											<div>
												<p
													className="has-text-weight-semibold"
													style={{ margin: "0" }}
												>
													Mobile -{" "}
													{forfait.nomForfait}
												</p>
												<p
													className="has-text-grey is-size-7"
													style={{ margin: "0" }}
												>
													{forfait.descriptionForfait}
												</p>
											</div>
										</div>
									</div>
								) : forfait.typeService === "Wifi" ? (
									<div
										className={
											isDark
												? "notification is-primary"
												: "notification is-primary is-light"
										}
									>
										<div
											className="is-flex is-align-items-center"
											style={{ gap: "14px" }}
										>
											<span className="icon is-medium">
												<i className="fa-solid fa-wifi"></i>
											</span>
											<div>
												<p
													className="has-text-weight-semibold"
													style={{ margin: "0" }}
												>
													Internet -{" "}
													{forfait.nomForfait}
												</p>
												<p
													className="has-text-grey is-size-7"
													style={{ margin: "0" }}
												>
													{forfait.descriptionForfait}
												</p>
											</div>
										</div>
									</div>
								) : forfait.typeService === "TV" ? (
									<div className="notification is-link is-light">
										<div
											className="is-flex is-align-items-center"
											style={{ gap: "14px" }}
										>
											<span className="icon is-medium">
												<i className="fa-solid fa-tv"></i>
											</span>
											<div>
												<p
													className="has-text-weight-semibold"
													style={{ margin: "0" }}
												>
													TV - {forfait.nomForfait}
												</p>
												<p
													className="has-text-grey is-size-7"
													style={{ margin: "0" }}
												>
													{forfait.descriptionForfait}
												</p>
											</div>
										</div>
									</div>
								) : (
									""
								),
							)
						) : (
							<h1>Aucun forfait actif</h1>
						)}
						<h3 className="title is-4">Informations clients</h3>
						<div className="columns">
							<div className="column is-6">
								<label>Email :</label>
								<div className="control">
									<p className="has-text-weight-bold">
										{client?.courrielClient}
									</p>
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
								<p className="has-text-weight-bold">
									{client?.adresseClient}
								</p>
							</div>
						</div>
					</div>
				)}
				{onglet === "demandes" && (
					<div
						className="box is-shadowless"
						style={{ border: "1px solid #d6d6d6" }}
					>
						<div class="level">
							<div class="level-left">
								<div class="level-item">
									<div>
										<h2 className="title is-5">
											Demandes de service
										</h2>
										<p class="subtitle is-6">
											Gérer les demandes pour ce compte
										</p>
									</div>
								</div>
							</div>
							<div class="level-right">
								<div class="level-item">
									<button class="button is-dark">
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
									<th style={{ width: "100px" }}>
										Catégorie
									</th>
									<th style={{ width: "400px" }}>
										Description
									</th>
									<th style={{ width: "80px" }}>Statut</th>
									<th style={{ width: "150px" }}>Créée le</th>
									<th style={{ width: "60px" }}>Actions</th>
								</tr>
							</thead>
							<tbody>
								{demandes && demandes.length > 0 ? (
									demandes.map((demande) => (
										<tr>
											<td>
												<strong>
													{demande.typeDemande}
												</strong>
											</td>
											<td>{demande.noteInterne}</td>
											<td>
												<span
													className={
														demande.statutDemande ===
														"Ouverte"
															? "tag is-success"
															: demande.statutDemande ===
																  "En attente"
																? "tag is-warning"
																: demande.statutDemande ===
																	  "Fermée"
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
											<td>{demande.created_at}</td>
											<td>
												<button
													className="button is-small is-ghost"
													title="Modifier"
												>
													<i className="fa-regular fa-pen-to-square"></i>
												</button>
											</td>
										</tr>
									))
								) : (
									<tr>
										<td colSpan="6">
											Aucune demande de service pour ce
											compte.
										</td>
									</tr>
								)}
							</tbody>
						</table>
					</div>
				)}
			</div>
		</div>
	);
}

export default DetailsCompte;
