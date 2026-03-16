const { validerChamps, authentifier } = require("../fonctionsCommunes");
const { db } = require("../BD/creationBd");
const express = require("express");
const router = express.Router();
// pour hash les mdps
const bcrypt = require('bcryptjs')
// pour les tokens
const jwt = require('jsonwebtoken')
// clée ajoutée dans la logique de création des tokens 
const jwt_mdp = "MECHANTE_belle_Vibe_2026"

/* 
3 types d'employés pour faire les tests (log in creds):
normal:
    email: employe@bellevibe.com
    password: 123456789
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

// get tous les employés
router.get("/employes", async (req, res) => {
    try {
        const reponse = await db("employes").select("*")
        res.status(200).json(reponse)
    }
    catch (error) {
        console.error("Erreur dans /employes", error)
        res.status(500).json({ message: "Erreur serveur", error })
    }
})

// ajouter un nouvel employé
router.post("/addEmploye", async (req, res) => {
    try {
        const { role, nom, prenom, courriel, telephone, adresse, codePostal, mdp } = req.body
        const validation = validerChamps({ role, nom, prenom, courriel, telephone, adresse, codePostal, mdp })
        if (validation.error) {
            return res.status(400).json({ error: validation.error })
        }

        // sécurisation du mdp, on le fait après la vérification des champs 
        // pour ne pas enregistrer un employé avec infos manquantes
        // génère un salt de 10 charactères (randoms, pour éviter les atks par dict)
        const salt = await bcrypt.genSalt(10)
        // hash le password et le store dans une autre variable
        const password = await bcrypt.hash(mdp, salt)

        const data = {
            roleEmploye: role,
            statutEmploye: "actif",
            nomEmploye: nom,
            prenomEmploye: prenom,
            courrielEmploye: courriel,
            telephoneEmploye: telephone,
            adresseEmploye: adresse,
            codePostalEmploye: codePostal,
            motDePasse: password
        }
        await db("employes").insert(data)
    }
    catch (error) {
        console.error("Erreur dans /addEmploye", error)
        res.status(500).json({ error: "Erreur serveur", error })
    }
})

// route pour log in, renvoye le token d'authentification
router.post("/login", async (req, res) => {
    const { email, mdp } = req.body
    const validation = validerChamps({ email, mdp })
    if (validation.error) {
        return res.status(400).json({ error: validation.error })
    }
    try {
        // récupère l'employé avec le meme courriel, récupère tjrs le 1er
        const [utilisateurs] = await db("employes").select("*").where("courrielEmploye", email)
        const employe = utilisateurs[0]
        // compare le mdp à la valeur hashé dans la table
        const pwValidation = await bcrypt.compare(mdp, employe.motDePasse)
        if (!pwValidation) {
            return res.status(401).send("Mot de passe invalide")
        }
        // infos a mettre dans le token
        const payload = {
            id: employe.idEmploye,
            role: employe.roleEmploye
        }
        // création du token, peut modifier/enlever l'expiration si on veut
        const token = jwt.sign(payload, jwt_mdp, {expiresIn: '2h'})

        res.json({
            message: "connexion réussie & sécurisée",
            token: token
        })
    }
    catch (error) {
        console.error("Erreur dans /login", error)
        res.status(500).json({ error: "Erreur serveur"})
    }
})


module.exports = router;