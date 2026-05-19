const { authentifier, authentifierSupp } = require("../fonctionsCommunes");
const { db } = require("../BD/creationBd");
const express = require("express");
const router = express.Router();

// route pour obtenir tous l'historique, utilisable seulement par superviseur ++
router.get("/allHistorique", authentifierSupp, async (req, res) => {
    try {
        const reponse = await db("historiqueDossiers").select("*").orderBy("created_at", 'desc')
        res.status(200).json(reponse)
    }
    catch (error) {
        console.error("Erreur dans /allHistorique", error)
        res.status(500).json({ message: "Erreur serveur", error })
    }
})

// get pour obtenir l'historique de l'employé qui est logged in
router.get("/historique", authentifier, async (req, res) => {
    try {
        const reponse = await db("historiqueDossiers").where("idEmploye", req.user.id).orderBy("created_at", 'desc')
        res.status(200).json(reponse)
    }
    catch (error) {
        console.error("Erreur dans /historique", error)
        res.status(500).json({ message: "Erreur serveur", error })
    }
})



module.exports = router;