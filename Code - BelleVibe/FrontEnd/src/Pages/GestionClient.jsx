import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

function parseJwt(token) {
	try {
		const base64Url = token.split(".")[1];
		const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
		const jsonPayload = decodeURIComponent(
			atob(base64)
				.split("")
				.map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
				.join(""),
		);
		return JSON.parse(jsonPayload);
	} catch {
		return null;
	}
}

export default function GestionClient() {
	const [clients, setClients] = useState([]);
	const [dossiers, setDossiers] = useState([]);
	const [recherche, setRecherche] = useState("");
	const [chargement, setChargement] = useState(true);
	const [clientAModifier, setClientAModifier] = useState(null);
	const [clientASupprimer, setClientASupprimer] = useState(null);
	const [formModif, setFormModif] = useState({});
	const [erreur, setErreur] = useState("");
	const navigate = useNavigate();

	const token = localStorage.getItem("token");
	const userInfo = token ? parseJwt(token) : null;
	const role = userInfo?.role ?? "";
	const peutSupprimer = role === "admin" || role === "superviseur";

	useEffect(() => {
		async function fetchData() {
			setChargement(true);
			const [clientsRes, dossiersRes] = await Promise.all([
				fetch("/api/clients/getClients", {
					headers: { Authorization: `Bearer ${token}` },
				}),
				fetch("/api/comptes/getDossiers", {
					headers: { Authorization: `Bearer ${token}` },
				}),
			]);
			const [clientsData, dossiersData] = await Promise.all([
				clientsRes.json(),
				dossiersRes.json(),
			]);
			setClients(Array.isArray(clientsData) ? clientsData : []);
			setDossiers(Array.isArray(dossiersData) ? dossiersData : []);
			setChargement(false);
		}
		fetchData();
	}, []);

	function comptesParClient(idClient) {
		return dossiers.filter((d) => d.idClient === idClient);
	}

	const clientsFiltres = clients.filter((c) => {
		const q = recherche.toLowerCase();
		return (
			!q ||
			c.nomClient?.toLowerCase().includes(q) ||
			c.prenomClient?.toLowerCase().includes(q) ||
			c.courrielClient?.toLowerCase().includes(q) ||
			c.telephoneClient?.toLowerCase().includes(q)
		);
	});

	function ouvrirModification(client) {
		setClientAModifier(client);
		setFormModif({
			nomClient: client.nomClient,
			prenomClient: client.prenomClient,
			courrielClient: client.courrielClient,
			telephoneClient: client.telephoneClient,
			adresseClient: client.adresseClient,
			codePostalClient: client.codePostalClient,
		});
		setErreur("");
	}

	async function sauvegarderModification(e) {
		e.preventDefault();
		setErreur("");
		try {
			const res = await fetch(`/api/clients/modifierClient/${clientAModifier.idClient}`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify(formModif),
			});
			const data = await res.json();
			if (!res.ok) {
				setErreur(data.error || "Erreur lors de la modification.");
				return;
			}
			setClients((prev) =>
				prev.map((c) =>
					c.idClient === clientAModifier.idClient ? { ...c, ...formModif } : c,
				),
			);
			setClientAModifier(null);
		} catch {
			setErreur("Impossible de joindre le serveur.");
		}
	}

	async function supprimerClient() {
		try {
			const res = await fetch(`/api/clients/supprimerClient/${clientASupprimer.idClient}`, {
				method: "DELETE",
				headers: { Authorization: `Bearer ${token}` },
			});
			if (!res.ok) {
				const data = await res.json();
				alert(data.error || "Erreur lors de la suppression.");
				return;
			}
			setClients((prev) => prev.filter((c) => c.idClient !== clientASupprimer.idClient));
			setClientASupprimer(null);
		} catch {
			alert("Impossible de joindre le serveur.");
		}
	}

	return (
		<div className="section">
			<div className="container">
				<h1 className="title">Gestion des clients</h1>
				<p className="subtitle is-6 has-text-link">Liste de tous les clients</p>

				<div className="box" style={{ border: "1px solid #d6d6d6" }}>
					<div className="level mb-4">
						<div className="level-left">
							<div>
								<p className="title is-5 mb-1">Clients ({clientsFiltres.length})</p>
								<p className="subtitle is-6 has-text-grey">
									Recherchez et gérez les clients
								</p>
							</div>
						</div>
						<div className="level-right">
							<Link to="/clients/nouveau" className="button is-dark">
								+ Nouveau client
							</Link>
						</div>
					</div>

					<div className="control has-icons-left mb-4">
						<input
							className="input"
							type="text"
							placeholder="Rechercher par nom, courriel, téléphone..."
							value={recherche}
							onChange={(e) => setRecherche(e.target.value)}
						/>
						<span className="icon is-left">
							<i className="fas fa-search" />
						</span>
					</div>

					<table
						className="table is-fullwidth is-hoverable"
						style={{ tableLayout: "fixed" }}
					>
						<thead>
							<tr>
								<th style={{ width: "150px" }}>Nom</th>
								<th style={{ width: "180px" }}>Courriel</th>
								<th style={{ width: "150px" }}>Téléphone</th>
								<th style={{ width: "180px" }}>Adresse</th>
								<th style={{ width: "90px" }} className="has-text-centered">
									Comptes
								</th>
								<th style={{ width: "80px" }}>Actions</th>
							</tr>
						</thead>
						<tbody>
							{chargement ? (
								<tr>
									<td colSpan="6" className="has-text-centered py-4">
										Chargement...
									</td>
								</tr>
							) : clientsFiltres.length === 0 ? (
								<tr>
									<td colSpan="6" className="has-text-centered py-4">
										Aucun client trouvé.
									</td>
								</tr>
							) : (
								clientsFiltres.map((c) => {
									const comptes = comptesParClient(c.idClient);
									return (
										<tr
											key={c.idClient}
											style={{ height: "55px" }}
											onClick={() =>
												navigate(`/clients/${c.idClient}/resume`)
											}
										>
											<td className="is-vcentered">
													{c.prenomClient} {c.nomClient}
											</td>
											<td className="is-vcentered">{c.courrielClient}</td>
											<td className="is-vcentered">{c.telephoneClient}</td>
											<td className="is-vcentered">{c.adresseClient}</td>
											<td className="is-vcentered has-text-centered">
												<span
													className="tag is-link is-light"
													style={{ cursor: "pointer" }}
													onClick={() =>
														navigate(`/clients/${c.idClient}/comptes`)
													}
													title="Voir les comptes"
												>
													{comptes.length}
												</span>
											</td>
											<td className="is-vcentered">
												<button
													className="button is-medium is-ghost"
													style={{
														paddingLeft: "0.5rem",
														paddingRight: "0.5rem",
													}}
													onClick={(ev) => {
														(ev.stopPropagation(),
															ouvrirModification(c));
													}}
													title="Modifier"
												>
													<i className="fas fa-edit" />
												</button>
												{peutSupprimer && (
													<button
														className="button is-medium is-ghost"
														style={{
															paddingLeft: "0.5rem",
															paddingRight: "0.5rem",
														}}
														onClick={(ev) => {
															(ev.stopPropagation(),
																setClientASupprimer(c));
														}}
														title="Supprimer"
													>
														<i className="fas fa-trash" />
													</button>
												)}
											</td>
										</tr>
									);
								})
							)}
						</tbody>
					</table>
				</div>

				{clientAModifier && (
					<div className="modal is-active">
						<div
							className="modal-background"
							onClick={() => setClientAModifier(null)}
						/>
						<div className="modal-card">
							<header className="modal-card-head">
								<p className="modal-card-title">Modifier le client</p>
								<button
									className="delete"
									onClick={() => setClientAModifier(null)}
								/>
							</header>
							<form onSubmit={sauvegarderModification}>
								<section className="modal-card-body">
									{erreur && (
										<div className="notification is-danger is-light mb-4">
											{erreur}
										</div>
									)}
									<div className="columns">
										<div className="column">
											<div className="field">
												<label className="label">Prénom *</label>
												<div className="control">
													<input
														className="input"
														value={formModif.prenomClient}
														onChange={(e) =>
															setFormModif((p) => ({
																...p,
																prenomClient: e.target.value,
															}))
														}
														required
													/>
												</div>
											</div>
										</div>
										<div className="column">
											<div className="field">
												<label className="label">Nom *</label>
												<div className="control">
													<input
														className="input"
														value={formModif.nomClient}
														onChange={(e) =>
															setFormModif((p) => ({
																...p,
																nomClient: e.target.value,
															}))
														}
														required
													/>
												</div>
											</div>
										</div>
									</div>
									<div className="columns">
										<div className="column">
											<div className="field">
												<label className="label">Courriel *</label>
												<div className="control">
													<input
														className="input"
														type="email"
														value={formModif.courrielClient}
														onChange={(e) =>
															setFormModif((p) => ({
																...p,
																courrielClient: e.target.value,
															}))
														}
														required
													/>
												</div>
											</div>
										</div>
										<div className="column">
											<div className="field">
												<label className="label">Téléphone *</label>
												<div className="control">
													<input
														className="input"
														type="tel"
														value={formModif.telephoneClient}
														onChange={(e) =>
															setFormModif((p) => ({
																...p,
																telephoneClient: e.target.value,
															}))
														}
														required
													/>
												</div>
											</div>
										</div>
									</div>
									<div className="columns">
										<div className="column is-8">
											<div className="field">
												<label className="label">Adresse</label>
												<div className="control">
													<input
														className="input"
														value={formModif.adresseClient}
														onChange={(e) =>
															setFormModif((p) => ({
																...p,
																adresseClient: e.target.value,
															}))
														}
													/>
												</div>
											</div>
										</div>
										<div className="column">
											<div className="field">
												<label className="label">Code postal *</label>
												<div className="control">
													<input
														className="input"
														value={formModif.codePostalClient}
														onChange={(e) =>
															setFormModif((p) => ({
																...p,
																codePostalClient: e.target.value,
															}))
														}
														required
													/>
												</div>
											</div>
										</div>
									</div>
								</section>
								<footer className="modal-card-foot">
									<button className="button is-dark mr-2" type="submit">
										Sauvegarder
									</button>
									<button
										className="button"
										type="button"
										onClick={() => setClientAModifier(null)}
									>
										Annuler
									</button>
								</footer>
							</form>
						</div>
					</div>
				)}

				{clientASupprimer && (
					<div className="modal is-active">
						<div
							className="modal-background"
							onClick={() => setClientASupprimer(null)}
						/>
						<div className="modal-card">
							<header className="modal-card-head">
								<p className="modal-card-title">Confirmer la suppression</p>
								<button
									className="delete"
									onClick={() => setClientASupprimer(null)}
								/>
							</header>
							<section className="modal-card-body">
								<p>
									Voulez-vous vraiment supprimer le client{" "}
									<strong>
										{clientASupprimer.prenomClient} {clientASupprimer.nomClient}
									</strong>{" "}
									?
								</p>
								<p className="has-text-danger mt-2">
									Cette action est irréversible.
								</p>
							</section>
							<footer className="modal-card-foot">
								<button className="button is-danger mr-2" onClick={supprimerClient}>
									Supprimer
								</button>
								<button
									className="button"
									onClick={() => setClientASupprimer(null)}
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
