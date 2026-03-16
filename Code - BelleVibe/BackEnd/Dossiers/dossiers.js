const { validerChamps, authentifier } = require("../fonctionsCommunes");
const { db } = require("../BD/creationBd");
const express = require("express");
const router = express.Router();

// début des routes pour la table des dossiers

// get tous les dossiers
router.get('/dossiers', authentifier, async (req, res) => {
    try {
        const reponse = await db("dossiers").select("*")
        res.status(200).json(reponse)
    }
    catch (error) {
        console.error("Erreur dans /dossiers")
        res.status(500).json({ error: "Erreur serveur" })
    }
})

// get les dossiers en attente
router.get('/dossiersAttente', authentifier, async (req, res) => {
    try {
        const reponse = await db("dossiers").select("*").where("en attente")
        res.status(200).json(reponse)
    }
    catch (error) {
        console.error("Erreur dans /dossiersAttente")
        res.status(500).json({ error: "Erreur serveur" })
    }
})

router.get('/addDossier', authentifier, async (req, res) => {

})