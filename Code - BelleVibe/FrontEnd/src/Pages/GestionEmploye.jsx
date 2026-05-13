import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FormModal, ConfirmModal } from "../components/Modals";

const STATUTS = ["Tous les statuts", "Actif", "Inactif", "Suspendu"];
const ROLES = ["Tous les rôles", "Commis", "Superviseur", "Admin"];

const FIELDS_EMPLOYE = [
	{ key: "role", label: "Role", type: "select", options: ["Commis", "Superviseur", "Admin"] },
	{
		key: "statut",
		label: "Statut",
		type: "select",
		options: ["Actif", "Inactif", "Suspendu"],
	},
];

function formatNumeroEmploye(idEmploye) {
	return `EMP-${String(idEmploye).padStart(4, "0")}`;
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
	if (statutLower === "suspendu") return <span className="tag is-danger">Suspendu</span>;
	return <span className="tag">{statut}</span>;
}

export default function GestionEmploye() {
	const [employes, setEmployes] = useState(null);
	const [user, setUser] = useState(null);
	const [recherche, setRecherche] = useState("");
	const [filtreStatut, setFiltreStatut] = useState("Tous les statuts");
	const [filtreRole, setFiltreRole] = useState("Tous les rôles");
	const [chargement, setChargement] = useState(true);
	const navigate = useNavigate();
	const token = localStorage.getItem("token");

	const [modalModifierEmploye, setModalModifierEmploye] = useState(false);
	const [modalSupprimerEmploye, setModalSupprimerEmploye] = useState(false);
	const [employeSelectionnee, setEmployeSelectionnee] = useState(null);

	const [formEmploye, setFormEmploye] = useState({
		role: "",
		statut: "",
	});

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
		async function fetchEmployes() {
			const data = await fetch(`/api/employes/employes`, {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
			}).then((res) => res.json());
			setEmployes(data);
			setChargement(false);
		}
		fetchEmployes();
	}, []);

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

	function handleChangeEmploye(key, val) {
		setFormEmploye((prev) => ({ ...prev, [key]: val }));
	}

	function ouvrirModifierEmploye(employe) {
		setEmployeSelectionnee(employe);
		setFormEmploye({
			role: employe.roleEmploye,
			statut: employe.statutEmploye,
		});
		setModalModifierEmploye(true);
	}

	async function modifierEmploye({ onSuccess, onError }) {
		await apiCall({
			url: `/api/employes/adminEdit/${employeSelectionnee.idEmploye}`,
			method: "PATCH",
			body: formEmploye,
			onSuccess,
			onError,
			onClose: () => setModalModifierEmploye(false),
		});
	}

	async function supprimerEmploye({ onSuccess, onError }) {
		await apiCall({
			url: `/api/employe/${employeSelectionnee.idEmploye}`,
			method: "DELETE",
			onSuccess,
			onError,
			onClose: () => setModalSupprimerEmploye(false),
		});
	}

	const employesFiltres = employes?.filter((e) => {
		const numero = formatNumeroEmploye(e.idEmploye).toLowerCase();
		const nom = e.nomEmploye.toLowerCase();
		const prenom = e.prenomEmploye.toLowerCase();
		const q = recherche.toLowerCase();
		const matchRecherche = !q || numero.includes(q) || nom.includes(q) || prenom.includes(q);
		const matchStatut =
			filtreStatut === "Tous les statuts" ||
			e.statutEmploye.toLowerCase() === filtreStatut.toLowerCase();
		const matchRole =
			filtreRole === "Tous les rôles" ||
			e.roleEmploye.toLowerCase() === filtreRole.toLowerCase();
		return matchRecherche && matchStatut && matchRole;
	});

	return (
		<div className="section">
			<div className="container">
				<h1 className="title">Gestion des employés</h1>
				<p className="subtitle is-6 has-text-link">Liste de tous les employés</p>

				<div className="box" style={{ border: "1px solid #d6d6d6" }}>
					<div className="level mb-4">
						<div className="level-left">
							<div>
								<p className="title is-5 mb-1">
									Employés ({employesFiltres?.length})
								</p>
								<p className="subtitle is-6 has-text-grey">
									Recherchez et gérez les employés
								</p>
							</div>
						</div>
						<div className="level-right">
							<Link to="/creerEmploye" className="button is-dark">
								+ Créer Employé
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
								placeholder="Rechercher par numéro, nom de l'employé..."
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
								value={filtreRole}
								onChange={(e) => setFiltreRole(e.target.value)}
							>
								{ROLES.map((r) => (
									<option key={r}>{r}</option>
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
								<th style={{ width: "100px" }}># Employé</th>
								<th style={{ width: "150px" }}>Employé</th>
								<th style={{ width: "90px" }}>Role</th>
								<th style={{ width: "90px" }}>Statut</th>
								<th style={{ width: "150px" }}>Ajouté le</th>
								{user?.roleEmploye === "admin" && (
									<th style={{ width: "80px" }}>Actions</th>
								)}
							</tr>
						</thead>
						<tbody>
							{chargement ? (
								<tr>
									<td colSpan="6" className="has-text-centered py-4">
										Chargement...
									</td>
								</tr>
							) : employesFiltres?.length === 0 ? (
								<tr>
									<td colSpan="6" className="has-text-centered py-4">
										Aucun employé trouvé.
									</td>
								</tr>
							) : (
								employesFiltres?.map((employe) => (
									<tr
										key={employe.idEmploye}
										style={{ height: "55px", cursor: "pointer" }}
										onClick={() => navigate(`/employes/${employe.idEmploye}`)}
									>
										<td className="is-vcentered">
											<span className="has-text-weight-semibold">
												{formatNumeroEmploye(employe.idEmploye)}
											</span>
										</td>
										<td className="is-vcentered">
											{employe.prenomEmploye + " " + employe.nomEmploye}
										</td>
										<td className="is-vcentered">
											<span className="tag is-light is-capitalized">
												{employe.roleEmploye}
											</span>
										</td>
										<td className="is-vcentered">
											<BadgeStatut statut={employe.statutEmploye} />
										</td>
										<td className="is-vcentered has-text-grey">
											{formatDate(employe.updated_at || employe.created_at)}
										</td>
										{user?.roleEmploye === "admin" && (
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
														ouvrirModifierEmploye(employe);
													}}
												>
													<i className="fa-solid fa-pen-to-square"></i>
												</button>
												<button
													className="button is-medium is-ghost"
													style={{
														paddingLeft: "0.5rem",
														paddingRight: "0.5rem",
													}}
													title="Supprimer"
													onClick={(ev) => {
														ev.stopPropagation();
														setEmployeSelectionnee(employe);
														setModalSupprimerEmploye(true);
													}}
												>
													<i className="fa-solid fa-trash"></i>
												</button>
											</td>
										)}
									</tr>
								))
							)}
						</tbody>
					</table>
				</div>

				<FormModal
					isOpen={modalModifierEmploye}
					title="Modifier l'employé"
					fields={FIELDS_EMPLOYE}
					values={formEmploye}
					onChange={handleChangeEmploye}
					onConfirm={modifierEmploye}
					onClose={() => setModalModifierEmploye(false)}
				/>

				<ConfirmModal
					isOpen={modalSupprimerEmploye}
					title="Supprimer l'employé"
					description="Voulez-vous vraiment supprimer cet employé ?"
					itemName={
						employeSelectionnee
							? `${employeSelectionnee.prenomEmploye} ${employeSelectionnee.nomEmploye}`
							: ""
					}
					onConfirm={supprimerEmploye}
					onClose={() => setModalSupprimerEmploye(false)}
				/>
			</div>
		</div>
	);
}
