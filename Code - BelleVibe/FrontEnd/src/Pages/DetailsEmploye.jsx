import React, { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ForfaitCard } from "../components/ForfaitCard";
import { Link } from "react-router-dom";
import { FormModal, ConfirmModal } from "../components/Modals";

const FIELDS_EMPLOYE = [
	{ key: "prenom", label: "Prénom", type: "text" },
	{ key: "nom", label: "Nom", type: "text" },
	{ key: "courriel", label: "Courriel", type: "text" },
	{ key: "telephone", label: "Téléphone", type: "text" },
	{ key: "adresse", label: "Adresse", type: "text" },
	{ key: "codePostal", label: "Code Postal", type: "text" },
];

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

function DetailsEmploye() {
	const [employe, setEmploye] = useState(null);

	const { id } = useParams();

	const token = localStorage.getItem("token");

	const navigate = useNavigate();

	const [modalModifierEmploye, setModalModifierEmploye] = useState(false);
	const [employeSelectionnee, setEmployeSelectionnee] = useState(null);

	const [formEmploye, setFormEmploye] = useState({
		nom: "",
		prenom: "",
		courriel: "",
		telephone: "",
		adresse: "",
		codePostal: "",
	});

	useEffect(() => {
		async function fetchEmploye() {
			const data = await fetch(`/api/employes/employes/${id}`, {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
			}).then((res) => res.json());
			setEmploye(data);
		}
		fetchEmploye();
	}, [id]);

	function handleChangeEmploye(key, val) {
		setFormEmploye((prev) => ({ ...prev, [key]: val }));
	}

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

	async function modifierEmploye({ onSuccess, onError }) {
		const res = await fetch(`/api/employes/${employeSelectionnee.idEmploye}`, {
			method: "PUT",
			headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
			body: JSON.stringify(formEmploye),
		});
		const data = await res.json();

		if (res.ok) {
			onSuccess(data.message);
			setTimeout(() => {
				setModalModifierEmploye(false);
				window.location.reload();
			}, 1500);
		} else {
			onError(data.error);
		}
	}

	return (
		<div className="section">
			<div className="container">
				<div className="mb-4">
					<button
						className="button is-white px-2"
						onClick={() => navigate("/GestionEmploye")}
						type="button"
					>
						<span className="icon">
							<i className="fa-solid fa-arrow-left" />
						</span>
					</button>
				</div>

				<h1 className="title">Détails de l'employé</h1>
				<div className="box" style={{ border: "1px solid #d6d6d6" }}>
					<div className="level mb-4">
						<div className="level-left">
							<h2 className="title is-5 is-spaced">Informations de l'employé</h2>
						</div>
						<div className="level-right">
							<button
								className="button is-dark"
								onClick={() => ouvrirModifierEmploye(employe)}
							>
								Modifier Employé
							</button>
						</div>
					</div>{" "}
					<div className="columns">
						<div className="column is-6">
							<label>Nom :</label>
							<div className="control">
								<p className="has-text-weight-bold">{employe?.nomEmploye}</p>
							</div>
						</div>
						<div className="column is-6">
							<label>Prénom :</label>
							<div className="control">
								<p className="has-text-weight-bold">{employe?.prenomEmploye}</p>
							</div>
						</div>
					</div>
					<div className="columns">
						<div className="column is-6">
							<label>Courriel :</label>
							<div className="control">
								<p className="has-text-weight-bold">{employe?.courrielEmploye}</p>
							</div>
						</div>
						<div className="column is-6">
							<label>Téléphone :</label>
							<div className="control">
								<p className="has-text-weight-bold">{employe?.telephoneEmploye}</p>
							</div>
						</div>
					</div>
					<div className="columns">
						<div className="column is-6">
							<label>Adresse :</label>
							<div className="control">
								<p className="has-text-weight-bold">{employe?.adresseEmploye}</p>
							</div>
						</div>
						<div className="column is-6">
							<label>Code Postal :</label>
							<div className="control">
								<p className="has-text-weight-bold">{employe?.codePostalEmploye}</p>
							</div>
						</div>
					</div>
				</div>
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
		</div>
	);
}

export default DetailsEmploye;
