import React, { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";

function DetailsCompte() {
	const [compte, setCompte] = useState(null);
	const [forfaits, setForfaits] = useState(null);

	const { onglet } = useParams();
	const { id } = useParams();

	const navigate = useNavigate();

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
			setCompte(data);
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
		fetchClient();
		fetchForfaits();
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
									<div className="notification is-info is-light">
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
													Mobile - {forfait.nomForfait}
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
									<div className="notification is-primary is-light">
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
													Internet - {forfait.nomForfait}
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
					</div>
				)}
			</div>
		</div>
	);
}

export default DetailsCompte;
