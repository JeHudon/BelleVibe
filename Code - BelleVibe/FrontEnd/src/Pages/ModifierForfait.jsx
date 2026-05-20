import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ForfaitCard } from "../components/ForfaitCard";

export function ModifierForfait() {
	const [confirme, setConfirme] = useState(false);
	const [afficherSucces, setAfficherSucces] = useState(false);
	const [afficherErreur, setAfficherErreur] = useState(false);
	const [messageErreur, setMessageErreur] = useState("");
	const [services, setServices] = useState([]);
	const [forfaits, setForfaits] = useState([]);
	const [forfaitsCompte, setForfaitsCompte] = useState([]);
	const [servicesSelection, setServicesSelection] = useState([]);
	const [typeServicesSelection, setTypeServicesSelection] = useState([]);
	const [forfaitsSelection, setForfaitsSelection] = useState([]);
	const { id } = useParams();
    const navigate = useNavigate();

	function selectionForfaits(idForfait, typeService) {
		const service = services.find((s) => s.typeService === typeService);

		const forfaitMemeCat = forfaits.find(
			(f) => forfaitsSelection.includes(f.idForfait) && f.idService === service.idService,
		);

		if (forfaitsSelection.includes(idForfait)) {
			setForfaitsSelection(forfaitsSelection.filter((id) => id !== idForfait));
		} else if (forfaitMemeCat) {
			setForfaitsSelection(
				forfaitsSelection.filter((id) => id !== forfaitMemeCat.idForfait).concat(idForfait),
			);
		} else {
			setForfaitsSelection([...forfaitsSelection, idForfait]);
		}
	}

	function selectionService(idService, typeService) {
		if (servicesSelection.includes(idService)) {
			setServicesSelection(servicesSelection.filter((id) => id !== idService));
			setTypeServicesSelection(typeServicesSelection.filter((type) => type !== typeService));
		} else {
			setServicesSelection([...servicesSelection, idService]);
			setTypeServicesSelection([...typeServicesSelection, typeService]);
		}
	}

	useEffect(() => {
		async function recupererService() {
			try {
				const token = localStorage.getItem("token");

				const response = await fetch("/api/services/", {
					method: "GET",
					headers: {
						Authorization: `Bearer ${token}`,
						Accept: "application/json",
					},
				});

				if (!response.ok) {
					setAfficherErreur(true);
					setMessageErreur("Erreur en récupèrant les services");
				}

				const services = await response.json();
				setServices(services);
			} catch (err) {
				setAfficherErreur(true);
				setMessageErreur("Erreur serveur", err);
			}
		}
		async function recupererForfaits() {
			try {
				const token = localStorage.getItem("token");

				const response = await fetch("/api/forfaits/", {
					method: "GET",
					headers: {
						Authorization: `Bearer ${token}`,
						Accept: "application/json",
					},
				});

				if (!response.ok) {
					setAfficherErreur(true);
					setMessageErreur("Erreur en récupèrant les forfaits");
				}

				const forfaits = await response.json();
				setForfaits(forfaits);
			} catch (err) {
				setAfficherErreur(true);
				setMessageErreur("Erreur serveur", err);
			}
		}
		async function recupererInfosCompte() {
			try {
				const token = localStorage.getItem("token");

				const response = await fetch(`/api/forfaitsDossier/${id}`, {
					method: "GET",
					headers: {
						Authorization: `Bearer ${token}`,
						Accept: "application/json",
					},
				});

				if (!response.ok) {
					setAfficherErreur(true);
					setMessageErreur("Erreur en récupèrant les forfaits dossier");
				}

				const data = await response.json();
				console.log(data);
				setForfaitsCompte(data);
			} catch (err) {
				setAfficherErreur(true);
				setMessageErreur("Erreur serveur", err);
			}
		}
		recupererInfosCompte();
		recupererForfaits();
		recupererService();
	}, []);

	useEffect(() => {
		if (forfaitsCompte.length === 0) return;

		const ids = forfaitsCompte.map((f) => f.idService);
		const types = forfaitsCompte.map((f) => f.typeService);
		const idsForfaits = forfaitsCompte.map((f) => f.idForfait);

		setServicesSelection(ids);
		setTypeServicesSelection(types);
		setForfaitsSelection(idsForfaits);
	}, [forfaitsCompte]);

	function affichageForfaits() {
		const sections = [
			{ type: "TV", label: "Forfaits TV" },
			{ type: "Wi-fi", label: "Forfaits Wi-Fi" },
			{ type: "Cellulaire", label: "Forfaits Cellulaire" },
		];

		return (
			<div>
				{sections.map(
					({ type, label }) =>
						typeServicesSelection.includes(type) && (
							<div key={type}>
								<div className="title is-5 mt-4 mb-4">{label}</div>
								{forfaits
									.filter((f) => f.typeService === type)
									.filter((f) =>
										confirme ? forfaitsSelection.includes(f.idForfait) : true,
									)
									.map((forfait) => (
										<ForfaitCard
											key={forfait.idForfait}
											forfait={forfait}
											isSelected={forfaitsSelection.includes(
												forfait.idForfait,
											)}
											onClick={() =>
												selectionForfaits(forfait.idForfait, type)
											}
										/>
									))}
							</div>
						),
				)}
			</div>
		);
	}

	async function requeteModifierForfait() {
		const token = localStorage.getItem("token");
		setAfficherErreur(false);

		try {
			const response = await fetch(`/api/forfaitsDossier/${id}`, {
				method: "PATCH",
				headers: {
					Authorization: `Bearer ${token}`,
					Accept: "application/json",
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					forfaits: forfaitsSelection,
				}),
			});

			if (!response.ok) {
				setAfficherErreur(true);
				setMessageErreur("Erreur en modifiant les forfaits");
				return;
			}

			setAfficherSucces(true);
			setConfirme(true);
			setTimeout(() => {
				setAfficherSucces(false);
				window.location.replace("/dashboard");
			}, 2200);
		} catch (err) {
			setAfficherErreur(true);
			setMessageErreur("Erreur serveur : " + err.message);
		}
	}

	return (
		<div className="section">
			<div
				className="container is-centered"
				style={{ maxWidth: 1100}}
			>
				<div>
					<button
						className="button is-white px-2"
						onClick={() => navigate(-1)}
						type="button"
					>
						<span className="icon">
							<i className="fa-solid fa-arrow-left" />
						</span>
					</button>
				</div>

				<h1 className="title">Modifier un compte</h1>
				<h2 className="subtitle is-5 is-spaced">Assistant de modification d'un compte</h2>
				<div className="box">
					{afficherErreur && (
						<div className="notification is-danger">{messageErreur}</div>
					)}
					{afficherSucces && (
						<div className="notification is-success">Compte modifié avec succès</div>
					)}
					{!confirme && (
						<>
							<h3 className="title is-4">Modifier les services</h3>
							<div className="subtitle is-5 mt-2">
								Sélectionner un ou plusieurs services
							</div>
							<div className="is-flex" style={{ gap: "1rem", flexWrap: "wrap" }}>
								{services.map((service) => (
									<div
										key={service.idService}
										onClick={() =>
											selectionService(service.idService, service.typeService)
										}
										style={{
											display: "flex",
											alignItems: "center",
											padding: "0.75rem 1.25rem",
											borderRadius: "8px",
											border: `2px solid ${servicesSelection.includes(service.idService) ? "var(--bulma-link)" : "#dbdbdb"}`,
											backgroundColor: servicesSelection.includes(
												service.idService,
											)
												? "var(--bulma-link)"
												: "white",
											boxShadow: servicesSelection.includes(service.idService)
												? "inset 0 2px 4px rgba(0,0,0,0.2)"
												: "none",
											color: servicesSelection.includes(service.idService) ? "white" : "inherit",
											cursor: "pointer",
											transition: "all 0.2s ease",
											fontWeight: "bold",
										}}
									>
										{service.typeService}
									</div>
								))}
							</div>
						</>
					)}
					<div className="mt-5" style={{ pointerEvents: confirme ? "none" : "auto" }}>
						<h3 className="title is-4">
							{confirme ? "Forfaits confirmés" : "Sélection des forfaits"}
						</h3>
						<div className="subtitle is-5 mt-2">
							{confirme
								? "Voici les forfaits de ce compte"
								: "Sélectionner un forfait pour chaque service"}
						</div>
						{affichageForfaits()}
					</div>
				</div>
				<div className="is-flex is-justify-content-flex-end mt-4">
					<button className="button is-dark" onClick={() => requeteModifierForfait()}>
						Confirmer les modifications
					</button>
				</div>
			</div>
		</div>
	);
}
