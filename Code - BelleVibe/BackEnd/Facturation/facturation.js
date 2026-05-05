const { validerChamps, authentifier, authentifierAdmin, log } = require("../fonctionsCommunes.js");
const { db } = require("../BD/creationBd");

const express = require("express");
const router = express.Router();

// routes pour la table facturation

// get toutes les factures pour un dossier, accessible à tous les employés
router.get("/getFactures/:idDossier", authentifier, async (req, res) => {
    try {
        const idDossier = req.params.idDossier
        const valider = validerChamps({ idDossier })
        if (valider.error) {
            return res.status(400).json({ error: valider.error })
        }
        const rep = await db("facturation").where("idDossier", idDossier)
        if (!rep.ok) {
            return res.status(404).json({ error: "Dossier non trouvé" })
        }
        res.status(200).json(rep)
    }
    catch (error) {
        console.error("Erreur dans GET /facturation/getFactures", error)
        res.status(500).json({ message: "Erreur serveur", error })
    }
})

// get une facture précise, accessible à tous les employés
router.get("/getFacture/:idFacture", authentifier, async (req, res) => {
    try {
        const idFacture = req.params.idFacture
        const valider = validerChamps({ idFacture })
        if (valider.error) {
            return res.status(400).json({ error: valider.error })
        }
        const rep = await db("facturation").where("idFacturation", idFacture)
        if (!rep.ok) {
            return res.status(404).json({ error: "Facture non trouvé" })
        }
        res.status(200).json(rep)
    }
    catch (error) {
        console.error("Erreur dans GET /facturation/getFacture", error)
        res.status(500).json({ message: "Erreur serveur", error })
    }
})

// POST une nouvelle facture, accessible à tous les employés
router.post("/nouvelleFacture", authentifier, async (req, res) => {
    try {
        // prends juste ces 3 valeurs au départ puisqu'on assume que
        // la facture ne sera jamais payée instantanéement
        const { idDossier, montant_total, dateEmission } = req.body()
        // id de l'employé récuppéré avec le token
        const idEmploye = req.user.id
        const valider = validerChamps({ idDossier, montant_total, dateEmission })
        if (valider.error) {
            return res.status(400).json({ error: valider.error })
        }
        // mise en forme de date
        const date_emission = new Date(dateEmission)
        // vérification que la facture n'est pas émise dans le passé
        const diffMs = Date.now() - date_emission.getTime()
        const diffJours = diffMs / (1000 * 60 * 60 * 24)
        if (diffJours < 0){
            return res.status(400).json({error: "La date de l'émission de la facture ne peux pas être dans le passé"})
        }
        // vérification de l'authenticité du dossier donné
        const dossier = await db("dossiers").where("idDossier", idDossier)
        if (!dossier) {
            return res.status(404).json({ error: "Numéro de dossier non trouvé" })
        }
        const data = {
            idDossier,
            idEmploye,
            statut_facture: "Emise",
            montant_total,
            montant_paye: 0,
            date_emission
        }
        const [idFacturation] = await db("facturation").insert(data)
        await log(req.user.id, "WRITE", "FACTURATION", Number(idFacturation))
        return res.status(201).json({...data, idFacturation: Number(idFacturation)})
    }
    catch (error) {
        console.error("Erreur dans POST /facturation/nouvelleFacture", error)
        res.status(500).json({ message: "Erreur serveur", error })
    }
})


module.exports = router