import React, { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ForfaitCard } from "../components/ForfaitCard";

function DetailsClient() {
	const [client, setClient] = useState(null);
	const [comptes, setComptes] = useState(null);
	const [forfaitsParCompte, setForfaitsParCompte] = useState({});

	const [modalOpen, setModalOpen] = useState(false);

	const { onglet } = useParams();
	const { id } = useParams();

	const token = localStorage.getItem("token");

	const navigate = useNavigate();

	const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

	function updateFilters(onglet) {
		navigate(`/clients/${id}/${onglet}`);
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

	async function fetchForfaits(idCompte) {
		const data = await fetch(`/api/forfaitsDossier/${idCompte}`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
		}).then((res) => res.json());
		return data;
	}

	useEffect(() => {
		async function fetchClient() {
			const data = await fetch(`/api/clients/getClient/${id}`, {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
			}).then((res) => res.json());
			setClient(data);
		}

		async function fetchComptes() {
			const data = await fetch(`/api/comptes/getDossiers/${id}`, {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
			}).then((res) => res.json());
			setComptes(data);
		}

		fetchClient();
		fetchComptes();
	}, [onglet, id]);

	useEffect(() => {
		if (!comptes || comptes.length === 0) return;

		async function chargerForfaits() {
			const results = {};
			await Promise.all(
				comptes.map(async (c) => {
					const forfaits = await fetchForfaits(c.idDossier);
					results[c.idDossier] = forfaits;
				}),
			);
			setForfaitsParCompte(results);
		}

		chargerForfaits();
	}, [comptes]);

	const formatSize = (bytes) => {
		if (bytes < 1024) return `${bytes} B`;
		if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
		return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
	};

	return (
		<div className="section">
			<div className="container">
				<h1 className="title">Détails du client</h1>
				<div className="tabs is-toggle is-toggle-rounded is-fullwidth">
					<ul>
						<li className={onglet === "resume" ? "is-active" : ""}>
							<a onClick={() => updateFilters("resume")}>Résumé</a>
						</li>
						<li className={onglet === "comptes" ? "is-active" : ""}>
							<a onClick={() => updateFilters("comptes")}>Comptes</a>
						</li>
					</ul>
				</div>
				{onglet === "resume" && (
					<div className="box" style={{ border: "1px solid #d6d6d6" }}>
						<h2 className="title is-5 is-spaced">Informations du client</h2>
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
				{onglet === "comptes" && (
					<div className="box" style={{ border: "1px solid #d6d6d6" }}>
						<div className="level">
							<div className="level-left">
								<div className="level-item">
									<div>
										<h2 className="title is-5">
											Comptes appartenant au client
										</h2>
										{/* <p className="subtitle is-6">
											Gérer les demandes pour ce compte
										</p> */}
									</div>
								</div>
							</div>
							<div className="level-right">
								<div className="level-item">
									<button className="button is-dark">+ Créer compte</button>
									{/* Ajouter link vers la page de création de compte */}
								</div>
							</div>
						</div>

						{comptes && comptes.length > 0 ? (
							comptes.map((c) => {
								const forfaits = forfaitsParCompte[c.idDossier];

								return (
									<div key={c.idDossier} style={{ marginBottom: 20 }}>
										<p className="subtitle is-5 mb-2">
											Forfait du compte {c.typeDossier}
										</p>
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
											{" "}
											<span className="has-text-weight-bold">
												Solde dû par mois :{" "}
											</span>
											{c.soldeDossier} $
										</p>
									</div>
								);
							})
						) : (
							<h1>Aucun compte trouvé pour ce client</h1>
						)}
					</div>
				)}
			</div>
		</div>
	);
}

export default DetailsClient;
