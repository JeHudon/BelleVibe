import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FormModal, ConfirmModal } from "../components/Modals";

const STATUTS = ["Tous les statuts", "Actif", "Inactif", "En attente", "Suspendu"];
const TYPES = ["Tous les services", "Personnel", "Entreprise", "Familial"];

const FIELDS_DOSSIER = [
	{
		key: "statutDossier",
		label: "Statut",
		type: "select",
		options: ["Actif", "Inactif", "En attente", "Suspendu"],
	},
	{
		key: "typeDossier",
		label: "Type",
		type: "select",
		options: ["Personnel", "Entreprise", "Familial"],
	},
];

function formatNumeroCompte(idDossier, created_at) {
	const year = new Date(created_at).getFullYear();
	return `CMPT-${year}-${String(idDossier).padStart(4, "0")}`;
}

function formatDate(dateString) {
	return new Date(dateString).toLocaleDateString("fr-CA", {
		day: "numeric",
		month: "short",
		year: "numeric",
		hour: "2-digit",
		minute: "2-digit",
	});
}

function BadgeStatut({ statut }) {
	const statutLower = statut.toLowerCase();
	if (statutLower === "actif") return <span className="tag is-dark">Actif</span>;
	if (statutLower === "inactif") return <span className="tag is-light">Inactif</span>;
	if (statutLower === "en attente") return <span className="tag is-warning">En attente</span>;
	if (statutLower === "suspendu") return <span className="tag is-danger">Suspendu</span>;
	return <span className="tag">{statut}</span>;
}

export default function GestionCompte() {
	const [dossiers, setDossiers] = useState([]);
	const [user, setUser] = useState(null);
	const [clients, setClients] = useState([]);
	const [recherche, setRecherche] = useState("");
	const [filtreStatut, setFiltreStatut] = useState("Tous les statuts");
	const [filtreType, setFiltreType] = useState("Tous les services");
	const [chargement, setChargement] = useState(true);
	const navigate = useNavigate();
	const token = localStorage.getItem("token");

	const [modalModifierDossier, setModalModifierDossier] = useState(false);
	const [modalSupprimerDossier, setModalSupprimerDossier] = useState(false);
	const [dossierSelectionnee, setDossierSelectionnee] = useState(null);

	const [formDossier, setFormDossier] = useState({
		statutDossier: "",
		typeDossier: "",
	});

	function handleChangeDossier(key, val) {
		setFormDossier((prev) => ({ ...prev, [key]: val }));
	}

	function ouvrirModifierDossier(d) {
		setDossierSelectionnee(d);
		setFormDossier({
			statutDossier: d.statutDossier,
			typeDossier: d.typeDossier,
		});
		setModalModifierDossier(true);
	}

	async function apiCall({ url, method = "GET", body, onSuccess, onError, onClose }) {
		const res = await fetch(url, {
			method,
			headers: {
				...(method !== "DELETE" && { "Content-Type": "application/json" }),
				Authorization: `Bearer ${token}`,
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

	async function modifierDossier({ onSuccess, onError }) {
		await apiCall({
			url: `/api/comptes/modifierTypeStatut/${dossierSelectionnee.idDossier}`,
			method: "PUT",
			body: formDossier,
			onSuccess,
			onError,
			onClose: () => setModalModifierDossier(false),
		});
	}

	async function supprimerDossier({ onSuccess, onError }) {
		await apiCall({
			url: `/api/comptes/${dossierSelectionnee.idDossier}`,
			method: "DELETE",
			onSuccess,
			onError,
			onClose: () => setModalSupprimerDossier(false),
		});
	}

	useEffect(() => {
		if (!token) return;
		fetch("/api/employes/me", {
			headers: { Authorization: `Bearer ${token}` },
		})
			.then((r) => r.json())
			.then((data) => setUser(data))
			.catch(() => {});
	}, [token]);

	useEffect(() => {
		async function fetchData() {
			setChargement(true);
			const [dossiersRes, clientsRes] = await Promise.all([
				fetch("/api/comptes/getDossiers", {
					headers: { Authorization: `Bearer ${token}` },
				}),
				fetch("/api/clients/getClients", {
					headers: { Authorization: `Bearer ${token}` },
				}),
			]);
			const [dossiersData, clientsData] = await Promise.all([
				dossiersRes.json(),
				clientsRes.json(),
			]);
			setDossiers(Array.isArray(dossiersData) ? dossiersData : []);
			setClients(Array.isArray(clientsData) ? clientsData : []);
			setChargement(false);
		}
		fetchData();
	}, []);

	function nomClient(idClient) {
		const c = clients.find((cl) => cl.idClient === idClient);
		return c ? `${c.prenomClient} ${c.nomClient}` : `Client #${idClient}`;
	}

	const dossiersFiltres = dossiers.filter((d) => {
		const numero = formatNumeroCompte(d.idDossier, d.created_at).toLowerCase();
		const nom = nomClient(d.idClient).toLowerCase();
		const q = recherche.toLowerCase();
		const matchRecherche = !q || numero.includes(q) || nom.includes(q);
		const matchStatut = filtreStatut === "Tous les statuts" || d.statutDossier.toLowerCase() === filtreStatut.toLowerCase();
		const matchType = filtreType === "Tous les services" || d.typeDossier.toLowerCase() === filtreType.toLowerCase();
		return matchRecherche && matchStatut && matchType;
	});

	return (
		<div className="section">
			<div className="container">
				<h1 className="title">Gestion du compte</h1>
				<p className="subtitle is-6 has-text-link">Liste de tous les comptes clients</p>

				<div className="box " style={{ border: "1px solid #d6d6d6" }}>
					<div className="level mb-4">
						<div className="level-left">
							<div>
								<p className="title is-5 mb-1">
									Comptes ({dossiersFiltres.length})
								</p>
								<p className="subtitle is-6 has-text-grey">
									Recherchez et gérez les comptes
								</p>
							</div>
						</div>
						<div className="level-right">
							<Link to="/creerCompte" className="button is-dark">
								+ Créer compte
							</Link>
						</div>
					</div>

					<div
						className="is-flex is-align-items-center mb-4"
						style={{ gap: "0.75rem", flexWrap: "wrap" }}
					>
						<div
							className="control has-icons-left"
							style={{ flex: 1, minWidth: "250px" }}
						>
							<input
								className="input"
								type="text"
								placeholder="Rechercher par numéro, nom du client..."
								value={recherche}
								onChange={(e) => setRecherche(e.target.value)}
							/>
							<span className="icon is-left">
								<i className="fas fa-search" />
							</span>
						</div>

						<div className="select">
							<select
								value={filtreStatut}
								onChange={(e) => setFiltreStatut(e.target.value)}
							>
								{STATUTS.map((s) => (
									<option key={s}>{s}</option>
								))}
							</select>
						</div>

						<div className="select">
							<select
								value={filtreType}
								onChange={(e) => setFiltreType(e.target.value)}
							>
								{TYPES.map((t) => (
									<option key={t}>{t}</option>
								))}
							</select>
						</div>
					</div>

					<table
						className="table is-fullwidth is-hoverable"
						style={{ tableLayout: "fixed" }}
					>
						<thead>
							<tr>
								<th style={{ width: "160px" }}>#Compte</th>
								<th style={{ width: "180px" }}>Client</th>
								<th style={{ width: "120px" }}>Services</th>
								<th style={{ width: "120px" }}>Statut</th>
								<th style={{ width: "100px" }}>Solde</th>
								<th style={{ width: "180px" }}>Dernière activité</th>
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
							) : dossiersFiltres.length === 0 ? (
								<tr>
									<td colSpan="6" className="has-text-centered py-4">
										Aucun compte trouvé.
									</td>
								</tr>
							) : (
								dossiersFiltres.map((d) => (
									<tr
										key={d.idDossier}
										style={{ height: "55px", cursor: "pointer" }}
										onClick={() => navigate(`/comptes/${d.idDossier}/resume`)}
									>
										<td className="is-vcentered">
											<span className="has-text-weight-semibold">
												{formatNumeroCompte(d.idDossier, d.created_at)}
											</span>
										</td>
										<td className="is-vcentered">
											<span
												className="has-text-link"
												style={{ cursor: "pointer" }}
												onClick={(e) => {
													e.stopPropagation();
													navigate(`/clients/${d.idClient}/resume`);
												}}
											>
												{nomClient(d.idClient)}
											</span>
										</td>
										<td className="is-vcentered">
											<span className="tag is-light">{d.typeDossier}</span>
										</td>
										<td className="is-vcentered">
											<BadgeStatut statut={d.statutDossier} />
										</td>
										<td className="is-vcentered">
											<span
												className={
													d.soldeDossier < 0
														? "has-text-danger"
														: "has-text-success"
												}
											>
												{Number(d.soldeDossier).toFixed(2)} $
											</span>
										</td>
										<td className="is-vcentered has-text-grey">
											{formatDate(d.updated_at || d.created_at)}
										</td>
										<td className="is-vcentered">
											<button
												className="button is-medium is-ghost"
												style={{
													paddingLeft: "0.5rem",
													paddingRight: "0.5rem",
												}}
												title="Modifier"
												onClick={(ev) => {
													ev.stopPropagation();
													ouvrirModifierDossier(d);
												}}
											>
												<i className="fa-solid fa-pen-to-square"></i>
											</button>
											{user?.roleEmploye.toLowerCase() === "superviseur" ||
												(user?.roleEmploye.toLowerCase() === "admin" && (
													<button
														className="button is-medium is-ghost"
														style={{
															paddingLeft: "0.5rem",
															paddingRight: "0.5rem",
														}}
														title="Supprimer"
														onClick={(ev) => {
															ev.stopPropagation();
															setDossierSelectionnee(d);
															setModalSupprimerDossier(true);
														}}
													>
														<i className="fa-solid fa-trash"></i>
													</button>
												))}
										</td>
									</tr>
								))
							)}
						</tbody>
					</table>
				</div>

				<FormModal
					isOpen={modalModifierDossier}
					title="Modifier le dossier"
					fields={FIELDS_DOSSIER}
					values={formDossier}
					onChange={handleChangeDossier}
					onConfirm={modifierDossier}
					onClose={() => setModalModifierDossier(false)}
				/>

				<ConfirmModal
					isOpen={modalSupprimerDossier}
					title="Supprimer le dossier"
					description="Voulez-vous vraiment supprimer ce dossier ?"
					itemName={
						dossierSelectionnee
							? `${formatNumeroCompte(dossierSelectionnee.idDossier, dossierSelectionnee.created_at)}`
							: ""
					}
					onConfirm={supprimerDossier}
					onClose={() => setModalSupprimerDossier(false)}
				/>
			</div>
		</div>
	);
}
