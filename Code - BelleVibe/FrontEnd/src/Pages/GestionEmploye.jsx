import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const STATUTS = ["Tous les statuts", "Actif", "Inactif", "Suspendu"];
const ROLES = ["Tous les rôles", "Commis", "Superviseur", "Admin"];

function formatNumeroEmploye(idEmploye, created_at) {
	const year = new Date(created_at).getFullYear();
	return `EMP-${year}-${String(idEmploye).padStart(6, "0")}`;
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
	if (statut === "actif") return <span className="tag is-dark">Actif</span>;
	if (statut === "inactif") return <span className="tag is-light">Inactif</span>;
	if (statut === "suspendu") return <span className="tag">Suspendu</span>;
	return <span className="tag">{statut}</span>;
}

export default function GestionEmploye() {
	const [employes, setEmployes] = useState(null);
	const [recherche, setRecherche] = useState("");
	const [filtreStatut, setFiltreStatut] = useState("Tous les statuts");
	const [filtreRole, setFiltreRole] = useState("Tous les rôles"); // FIX: was missing, caused crash
	const [chargement, setChargement] = useState(true);
	const navigate = useNavigate();
	const token = localStorage.getItem("token");

	const [modalModifierEmploye, setModalModifierEmploye] = useState(false);
	const [modalSupprimerEmploye, setModalSupprimerEmploye] = useState(false);
	const [employeSelectionnee, setEmployeSelectionnee] = useState(null);

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

	function ouvrirModifierEmploye(e) {
		setEmployeSelectionnee(e);
		setFormEmploye({
			nom: e.nomEmploye,
			prenom: e.prenomEmploye,
			courriel: e.courrielEmploye,
			telephone: e.telephoneEmploye,
			adresse: e.adresseEmploye,
			codePostal: e.codePostalEmploye,
		});
		setModalModifierEmploye(true);
	}

	async function modifierEmploye() {
		const res = await fetch(`/api/employe/${employeSelectionnee.idEmploye}`, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify({
				nom: formEmploye.nom,
				prenom: formEmploye.prenom,
				courriel: formEmploye.courriel,
				telephone: formEmploye.telephone,
				adresse: formEmploye.adresse,
				codePostal: formEmploye.codePostal,
			}),
		});

		if (res.ok) {
			setModalModifierNote(false);
			window.location.reload();
		}
	}

	const [formEmploye, setFormEmploye] = useState({
		nom: "",
		prenom: "",
		courriel: "",
		telephone: "",
		adresse: "",
		codePostal: "",
	});

	const employesFiltres = employes?.filter((e) => {
		const numero = formatNumeroEmploye(e.idEmploye, e.created_at).toLowerCase();
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
			<h1 className="title">Gestion des employes</h1>
			<p className="subtitle is-6 has-text-link">Liste de tous les employes</p>

			<div className="box" style={{ border: "1px solid #d6d6d6" }}>
				<div className="level mb-4">
					<div className="level-left">
						<div>
							<p className="title is-5 mb-1">Employes ({employesFiltres?.length})</p>
							<p className="subtitle is-6 has-text-grey">
								Recherchez et gérez les employes
							</p>
						</div>
					</div>
					<div className="level-right">
						<Link to="/creerEmploye" className="button is-dark">
							+ Créer Employe
						</Link>
					</div>
				</div>

				<div
					className="is-flex is-align-items-center mb-4"
					style={{ gap: "0.75rem", flexWrap: "wrap" }}
				>
					<div className="control has-icons-left" style={{ flex: 1, minWidth: "250px" }}>
						<input
							className="input"
							type="text"
							placeholder="Rechercher par numéro, nom de l'employe..."
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
						{/* FIX: was calling setFiltreType (undefined), now correctly calls setFiltreRole */}
						<select value={filtreRole} onChange={(e) => setFiltreRole(e.target.value)}>
							{ROLES.map((r) => (
								<option key={r}>{r}</option>
							))}
						</select>
					</div>
				</div>

				<table className="table is-fullwidth is-hoverable" style={{ tableLayout: "fixed" }}>
					<thead>
						<tr>
							<th style={{ width: "120px" }}># Employé</th>
							<th style={{ width: "110px" }}>Employe</th>
							<th style={{ width: "70px" }}>Role</th>
							<th style={{ width: "50px" }}>Statut</th>
							<th style={{ width: "150px" }}>Courriel</th>
							<th style={{ width: "100px" }}>Téléphone</th>
							<th style={{ width: "80px" }}>Adresse</th>
							<th style={{ width: "80px" }}>Code Postal</th>
							<th style={{ width: "120px" }}>Ajouté le</th>
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
						) : employesFiltres?.length === 0 ? (
							<tr>
								<td colSpan="6" className="has-text-centered py-4">
									Aucun employe trouvé.
								</td>
							</tr>
						) : (
							employesFiltres?.map((e) => (
								<tr
									key={e.idEmploye}
									style={{ height: "55px", cursor: "pointer" }}
									// onClick={() => navigate(`/employe/${e.idEmploye}/resume`)}
								>
									<td className="is-vcentered">
										<span className="has-text-weight-semibold">
											{formatNumeroEmploye(e.idEmploye, e.created_at)}
										</span>
									</td>
									<td className="is-vcentered">
										{e.prenomEmploye + " " + e.nomEmploye}
									</td>
									<td className="is-vcentered">
										<span className="tag is-light">{e.roleEmploye}</span>
									</td>
									<td className="is-vcentered">
										<BadgeStatut statut={e.statutEmploye} />
									</td>
									<td className="is-vcentered">{e.courrielEmploye}</td>
									<td className="is-vcentered">{e.telephoneEmploye}</td>
									<td className="is-vcentered">{e.adresseEmploye}</td>
									<td className="is-vcentered">{e.codePostalEmploye}</td>
									<td className="is-vcentered has-text-grey">
										{formatDate(e.updated_at || e.created_at)}
									</td>
									<td className="is-vcentered">
										<button
											className="button is-medium is-ghost"
											style={{
												paddingLeft: "0.5rem",
												paddingRight: "0.5rem",
											}}
											title="Modifier"
											onClick={() => ouvrirModifierEmploye(e)}
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
												setEmployeSelectionnee(e);
												setModalSupprimerEmploye(true);
											}}
										>
											<i className="fa-solid fa-trash"></i>
										</button>
									</td>
								</tr>
							))
						)}
					</tbody>
				</table>
			</div>

			{modalModifierEmploye && (
				<div className="modal is-active">
					<div
						className="modal-background"
						onClick={() => setModalModifierEmploye(false)}
					></div>
					<div className="modal-card">
						<header className="modal-card-head">
							<p className="modal-card-title">Modifier l'employé</p>
							<button
								className="delete"
								onClick={() => setModalModifierEmploye(false)}
							></button>
						</header>

						<section className="modal-card-body">
							<div className="field">
								<label className="label">Prénom</label>
								<input
									className="input"
									value={formEmploye.prenom}
									onChange={(e) =>
										setFormEmploye({ ...formEmploye, prenom: e.target.value })
									}
								/>
							</div>
							<div className="field">
								<label className="label">Nom</label>
								<input
									className="input"
									value={formEmploye.nom}
									onChange={(e) =>
										setFormEmploye({ ...formEmploye, nom: e.target.value })
									}
								/>
							</div>

							{/* <div className="field">
								<label className="label">Role</label>
								<input
									className="input"
									value={formEmploye.role}
									onChange={(e) =>
										setFormEmploye({ ...formEmploye, role: e.target.value })
									}
								/>
							</div>

							<div className="field">
								<label className="label">Statut</label>
								<input
									className="input"
									value={formEmploye.statut}
									onChange={(e) =>
										setFormEmploye({ ...formEmploye, statut: e.target.value })
									}
								/>
							</div> */}

							<div className="field">
								<label className="label">Courriel</label>
								<input
									className="input"
									value={formEmploye.courriel}
									onChange={(e) =>
										setFormEmploye({ ...formEmploye, courriel: e.target.value })
									}
								/>
							</div>

							<div className="field">
								<label className="label">Téléphone</label>
								<input
									className="input"
									value={formEmploye.telephone}
									onChange={(e) =>
										setFormEmploye({
											...formEmploye,
											telephone: e.target.value,
										})
									}
								/>
							</div>

							<div className="field">
								<label className="label">Adresse</label>
								<input
									className="input"
									value={formEmploye.adresse}
									onChange={(e) =>
										setFormEmploye({ ...formEmploye, adresse: e.target.value })
									}
								/>
							</div>

							<div className="field">
								<label className="label">Code Postal</label>
								<input
									className="input"
									value={formEmploye.codePostal}
									onChange={(e) =>
										setFormEmploye({
											...formEmploye,
											codePostal: e.target.value,
										})
									}
								/>
							</div>
						</section>

						<footer className="modal-card-foot">
							<button className="button is-dark" onClick={modifierEmploye}>
								Enregistrer
							</button>
							<button
								className="button"
								onClick={() => setModalModifierEmploye(false)}
							>
								Annuler
							</button>
						</footer>
					</div>
				</div>
			)}

			{modalSupprimerEmploye && (
				<div className="modal is-active">
					<div
						className="modal-background"
						onClick={() => setModalSupprimerEmploye(false)}
					></div>
					<div className="modal-card">
						<header className="modal-card-head">
							<p className="modal-card-title">Supprimer la note</p>
							<button
								className="delete"
								onClick={() => setModalSupprimerEmploye(false)}
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
								onClick={() => setModalSupprimerEmploye(false)}
							>
								Annuler
							</button>
						</footer>
					</div>
				</div>
			)}
		</div>
	);
}
