const {
	validerChamps,
	authentifier,
	authentifierSupp,
	authentifierAdmin,
	log,
} = require("../fonctionsCommunes");
const { db } = require("../BD/creationBd");
const express = require("express");
const router = express.Router();
// pour hash les mdps
const bcrypt = require("bcryptjs");
// pour les tokens
const jwt = require("jsonwebtoken");
// clée ajoutée dans la logique de création des tokens
const jwt_mdp = "MECHANTE_belle_Vibe_2026";

/* 
3 types d'employés pour faire les tests (log in creds):
normal:
    email: employe@bellevibe.com
    password: 123456
superviseur:
    email: superviseur@bellevibe.com
    password: 123456789
admin:
    email: admin@bellevibe.com
    password: 123456789

bien sur ces comptes sont très peu sécures mais ils sont utilisés seulement
dans le but de faire des tests et démonstrations
*/

// Routes pour la table des employés
// get employé connecté (via token)
router.get("/me", authentifier, async (req, res) => {
	try {
		const employe = await db("employes").where("idEmploye", req.user.id).first();

		if (!employe) {
			return res.status(404).json({ error: "Employé non trouvé" });
		}

		res.json(employe);
	} catch (error) {
		console.error("Erreur dans /me", error);
		res.status(500).json({ error: "Erreur serveur" });
	}
});

// get tous les employés
router.get("/employes", authentifierSupp, async (req, res) => {
	try {
		const reponse = await db("employes").select("*");
		res.status(200).json(reponse);
	} catch (error) {
		console.error("Erreur dans /employes", error);
		res.status(500).json({ message: "Erreur serveur", error });
	}
});

// get un seul employé
router.get("/employes/:idEmploye", authentifierSupp, async (req, res) => {
	try {
		const { idEmploye } = req.params;
		const reponse = await db("employes").where("idEmploye", idEmploye).first();
		res.status(200).json(reponse);
	} catch (error) {
		console.error("Erreur dans /employes/:idEmploye", error);
		res.status(500).json({ message: "Erreur serveur", error });
	}
});

// ajouter un nouvel employé
router.post("/addEmploye", authentifierSupp, async (req, res) => {
	try {
		const { role, nom, prenom, courriel, telephone, adresse, codePostal, mdp } = req.body;
		const validation = validerChamps({
			role,
			nom,
			prenom,
			courriel,
			telephone,
			adresse,
			codePostal,
			mdp,
		});
		if (validation.error) {
			return res.status(400).json({ error: validation.error });
		}

		// sécurisation du mdp, on le fait après la vérification des champs
		// pour ne pas enregistrer un employé avec infos manquantes
		// génère un salt de 10 charactères (randoms, pour éviter les atks par dict)
		const salt = await bcrypt.genSalt(10);
		// hash le password et le store dans une autre variable
		const password = await bcrypt.hash(mdp, salt);

		const data = {
			roleEmploye: role,
			statutEmploye: "Actif",
			nomEmploye: nom,
			prenomEmploye: prenom,
			courrielEmploye: courriel,
			telephoneEmploye: telephone,
			adresseEmploye: adresse,
			codePostalEmploye: codePostal,
			motDePasse: password,
		};
		const [idEmploye] = await db("employes").insert(data);
		await log(req.user.id, "WRITE", "EMPLOYES", Number(idEmploye));
		return res.status(201).json({ ...data, idEmploye: Number(idEmploye) });
	} catch (error) {
		console.error("Erreur dans /addEmploye", error);
		res.status(500).json({ error: "Erreur serveur", error });
	}
});

// route pour log in, renvoye le token d'authentification
router.post("/login", async (req, res) => {
	const { email, mdp } = req.body;
	const validation = validerChamps({ email, mdp });
	if (validation.error) {
		return res.status(400).json({ error: validation.error });
	}
	try {
		// récupère l'employé avec le meme courriel, récupère tjrs le 1er
		const [utilisateurs] = await db("employes").select("*").where("courrielEmploye", email);
		const employe = utilisateurs;
		// compare le mdp à la valeur hashé dans la table
		const pwValidation = await bcrypt.compare(mdp, employe.motDePasse);
		if (!pwValidation) {
			return res.status(401).send("Mot de passe invalide");
		}
		// infos a mettre dans le token
		const payload = {
			id: employe.idEmploye,
			role: employe.roleEmploye,
			statut: employe.statutEmploye,
		};
		// création du token, peut modifier/enlever l'expiration si on veut
		const token = jwt.sign(payload, jwt_mdp, { expiresIn: "2h" });

		res.json({
			message: "connexion réussie & sécurisée",
			token: token,
		});
	} catch (error) {
		console.error("Erreur dans /login", error);
		res.status(500).json({ error: "Erreur serveur" });
	}
});

// Route pour delete des employés
router.delete("/:idEmploye", authentifierAdmin, async (req, res) => {
	try {
		const { idEmploye } = req.params;
		// vérification que l'employé existe avant la suppression
		const verifierEmp = await db("employes").where("idEmploye", idEmploye).del();
		if (verifierEmp == 0) {
			return res.status(404).json({ error: "Employé non trouvé dans la bd" });
		}

		res.status(200).json({
			message: "Employé supprimé avec succès",
			idEmploye,
		});
		await log(req.user.id, "DELETE", "EMPLOYES", Number(idEmploye));
	} catch (error) {
		console.error("Erreur dans /deleteEmployé", error);
		res.status(500).json({ error: "Erreur serveur", details: error });
	}
});

// Route pour modifier les infos de base d'un employé
// peut etre callé par un superviseur ou admin
// modifie nom, prenom, courriel, téléphone, adresse, code postal
router.put("/:idEmploye", authentifierSupp, async (req, res) => {
	try {
		const { idEmploye } = req.params;
		const { nom, prenom, courriel, telephone, adresse, codePostal } = req.body;
		const validation = validerChamps({ nom, prenom, courriel, telephone, adresse, codePostal });
		if (validation.error) {
			return res.status(400).json({ message: validation.error });
		}
		const verifierEmp = await db("employes").where("idEmploye", idEmploye).update({
			nomEmploye: nom,
			prenomEmploye: prenom,
			courrielEmploye: courriel,
			telephoneEmploye: telephone,
			adresseEmploye: adresse,
			codePostalEmploye: codePostal,
		});
		if (verifierEmp == 0) {
			return res.status(404).json({ error: "Employé non trouvé dans la bd" });
		}
		res.status(200).json({
			message: "Infos de l'employé(e) mis à jour avec succès",
			idEmploye,
		});
		await log(req.user.id, "EDIT", "EMPLOYES", Number(idEmploye));
	} catch (error) {
		console.error("Erreur dans /updateEmployé", error);
		res.status(500).json({ error: "Erreur serveur" });
	}
});

// Route pour modifier infos critiques d'un employé (mdp, statut, role)
// seulement utilisable par un admin
router.patch("/adminEdit/:idEmploye", authentifierAdmin, async (req, res) => {
	try {
		const { idEmploye } = req.params;
		const { role, statut, mdp } = req.body;

		const champs = {};

		if (role !== undefined) champs.roleEmploye = role;
		if (statut !== undefined) champs.statutEmploye = statut;

		if (mdp !== undefined) {
			if (!mdp || mdp.trim() === "") {
				return res.status(400).json({ message: "Le mot de passe ne peut pas être vide" });
			}
			const salt = await bcrypt.genSalt(10);
			champs.motDePasse = await bcrypt.hash(mdp, salt);
		}

		if (Object.keys(champs).length === 0) {
			return res.status(400).json({ message: "Aucun champ à mettre à jour" });
		}

		const validation = validerChamps({ role, statut });
		if (validation.error) {
			return res.status(400).json({ message: validation.error });
		}

		const updated = await db("employes").where("idEmploye", idEmploye).update(champs);

		if (updated === 0) {
			return res.status(404).json({ error: "Employé non trouvé dans la bd" });
		}

		// Log before responding so errors are caught by the catch block
		await log(req.user.id, "UPDATE", "EMPLOYES", Number(req.user.id));

		res.status(200).json({
			message: "Infos de l'employé(e) mis à jour avec succès",
			idEmploye,
		});
	} catch (error) {
		console.error("Erreur dans PATCH /adminEdit/:idEmploye", error);
		res.status(500).json({ error: "Erreur serveur" });
	}
});

module.exports = router;
