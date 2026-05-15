import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CreeClient() {
	const navigate = useNavigate();
	const [form, setForm] = useState({
		prenomClient: "",
		nomClient: "",
		telephoneClient: "",
		courrielClient: "",
		adresseClient: "",
		codePostalClient: "",
	});
	const [erreur, setErreur] = useState("");
	const [succes, setSucces] = useState(false);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setForm((prev) => ({ ...prev, [name]: value }));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setErreur("");

		try {
			const token = localStorage.getItem("token");
			const res = await fetch("/api/clients/creerClient", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify(form),
			});

			if (!res.ok) {
				const data = await res.json();
				setErreur(data.error || data.message || "Erreur lors de la création du client.");
				return;
			}

			setSucces(true);
			setTimeout(() => navigate("/"), 1500);
		} catch {
			setErreur("Impossible de joindre le serveur.");
		}
	};

	return (
		<div className="section">
			<div className="container" style={{ maxWidth: 1100, margin: "0 auto" }}>
				<h1 className="title is-3 mb-1">Créer nouveau client</h1>
				<p className="subtitle is-6 has-text-grey mb-5">
					Enregistrer un nouveau client dans le système
				</p>

				{succes && (
					<div className="notification is-success is-light mb-4">
						Client créé avec succès ! Redirection…
					</div>
				)}

				{erreur && <div className="notification is-danger is-light mb-4">{erreur}</div>}

				<form onSubmit={handleSubmit}>
					<div className="box " style={{ border: "1px solid #d6d6d6" }}>
						<h3 className="title is-4">Informations du client</h3>
						<div className="subtitle is-6 mt-2">
							Tous les champs marqués * sont obligatoires
						</div>

						{/* Prénom / Nom */}
						<div className="columns">
							<div className="column">
								<div className="field">
									<label className="label">Prénom *</label>
									<div className="control">
										<input
											className="input"
											type="text"
											name="prenomClient"
											placeholder="Sophie"
											value={form.prenomClient}
											onChange={handleChange}
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
											type="text"
											name="nomClient"
											placeholder="Gagnon"
											value={form.nomClient}
											onChange={handleChange}
											required
										/>
									</div>
								</div>
							</div>
						</div>

						{/* Téléphone / Courriel */}
						<div className="columns">
							<div className="column">
								<div className="field">
									<label className="label">Téléphone *</label>
									<div className="control">
										<input
											className="input"
											type="tel"
											name="telephoneClient"
											placeholder="514-555-1234"
											value={form.telephoneClient}
											onChange={handleChange}
											required
										/>
									</div>
								</div>
							</div>
							<div className="column">
								<div className="field">
									<label className="label">Courriel *</label>
									<div className="control">
										<input
											className="input"
											type="email"
											name="courrielClient"
											placeholder="client@example.com"
											value={form.courrielClient}
											onChange={handleChange}
											required
										/>
									</div>
								</div>
							</div>
						</div>

						{/* Adresse / Code postal */}
						<div className="columns">
							<div className="column is-8">
								<div className="field">
									<label className="label">Adresse complète</label>
									<div className="control">
										<input
											className="input"
											type="text"
											name="adresseClient"
											placeholder="123 Rue Saint-Laurent, Montréal, QC"
											value={form.adresseClient}
											onChange={handleChange}
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
											type="text"
											name="codePostalClient"
											placeholder="H2X 2T6"
											value={form.codePostalClient}
											onChange={handleChange}
											required
										/>
									</div>
								</div>
							</div>
						</div>
					</div>

					{/* Boutons */}
					<div className="buttons mt-2">
						<button className="button is-dark" type="submit">
							<span className="icon">
								<i className="fa-solid fa-floppy-disk" />
							</span>
							<span>Enregistrer</span>
						</button>
						<button
							className="button is-light"
							type="button"
							onClick={() => navigate(-1)}
						>
							<span className="icon">
								<i className="fa-solid fa-xmark" />
							</span>
							<span>Annuler</span>
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}
