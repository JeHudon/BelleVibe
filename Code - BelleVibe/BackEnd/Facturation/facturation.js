const { validerChamps, authentifier, authentifierAdmin, log, authentifierSupp } = require("../fonctionsCommunes.js");
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
        const { idDossier, montant_total, dateEmission } = req.body
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
        if (diffJours < 0) {
            return res.status(400).json({ error: "La date de l'émission de la facture ne peux pas être dans le passé" })
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
        return res.status(201).json({ ...data, idFacturation: Number(idFacturation) })
    }
    catch (error) {
        console.error("Erreur dans POST /facturation/nouvelleFacture", error)
        res.status(500).json({ message: "Erreur serveur", error })
    }
})

// PATCH pour updater les infos de la facture, bcp utilisé pour updater le montant payé
// utilisable seulement par des employés, infos plus critiques modifiables dans une autre route
router.patch("/updateFacture/:idFacture", authentifier, async (req, res) => {
    try {
        // récupération des infos avec le params et le body
        const idFacture = req.params.idFacture
        const statut = req.body.statutFacture
        const montantPaye = req.body.montantPaye
        const datePaiement = req.body.datePaiement

        const valider = validerChamps({ idFacture })
        if (valider.error) {
            return res.status(400).json({ error: valider.error })
        }
        // si rien, retourne une erreur
        if (!statut && !montantPaye && !datePaiement) {
            return res.status(400).json({ error: "Aucun champ n'a été entré pour modifier la facture" })
        }
        // si les champs existent, les ajoute au data qui va etre envoyé au backend après
        let data = {}
        if (statut) { data.statut = statut }
        if (montantPaye) { data.montantPaye = montantPaye }
        if (datePaiement) { data.datePaiement = datePaiement }

        const verifierID = await db("facturation").where("idFacturation", idFacture).update()
        if (verifierID == 0) {
            return res.status(404).json({ error: "Facture non trouvée dans la base de données" })
        }
        res.status(200).json({ message: "Infos de la facture mises à jour avec succès", idFacture })
        await log(req.user.id, "EDIT", "FACTURATION", Number(idFacture))
    }
    catch (error) {
        console.error("Erreur dans PATCH /facturation/updateFacture", error)
        res.status(500).json({ message: "Erreur serveur", error })
    }
})

// PATCH pour updater les infos plus critiques de la facture
router.patch("/updateFactureSupp/:idFacture", authentifierSupp, async (req, res) => {
    try {
        // récupération des infos avec le params et le body
        const idFacture = req.params.idFacture
        const dateEmission = req.body.dateEmission
        const montantTotal = req.body.montantTotal

        const valider = validerChamps({ idFacture })
        if (valider.error) {
            return res.status(400).json({ error: valider.error })
        }
        // si rien, retourne une erreur
        if (!dateEmission && !montantTotal) {
            return res.status(400).json({ error: "Aucun champ n'a été entré pour modifier la facture" })
        }
        // si les champs existent, les ajoute au data qui va etre envoyé au backend après
        let data = {}
        if (dateEmission) { data.dateEmission = dateEmission }
        if (montantTotal) { data.montantTotal = montantTotal }

        const verifierID = await db("facturation").where("idFacturation", idFacture).update()
        if (verifierID == 0) {
            return res.status(404).json({ error: "Facture non trouvée dans la base de données" })
        }
        res.status(200).json({ message: "Infos de la facture mises à jour avec succès", idFacture })
        await log(req.user.id, "EDIT", "FACTURATION", Number(idFacture))
    }
    catch (error) {
        console.error("Erreur dans PATCH /facturation/updateFactureSupp", error)
        res.status(500).json({ message: "Erreur serveur", error })
    }
})

// DELETE une facture, seulement accessible par les admins
router.delete("/deleteFacture/:idFacture", authentifierAdmin, async (req, res) => {
    try {
        const id = req.params.idFacture
        const valider = validerChamps({ id })
        if (valider.error) {
            return res.status(400).json({ error: valider.error })
        }
        const verifierID = await db("facturation").where("idFacturation", id).del()
        if (verifierID == 0) {
            return res.status(404).json({ error: "Facture non trouvée dans la base de données" })
        }
        res.status(200).json({ message: "Facture supprimée avec succès", id })
        await log(req.user.id, "DELETE", "FACTURATION", Number(id))

    }
    catch (error) {
        console.error("Erreur dans DELETE /facturation/deleteFacture", error)
        res.status(500).json({ message: "Erreur serveur", error })
    }
})

// GET les factures en retard (>31 jours depuis la date d'émission de la facture)
router.get("/facturesRetards", authentifier, async (req, res)=>{
    try{
        // check dans la table facturation les factures qui n'ont pas étés payés (null ou 0), & ou la difference de jours est plus grande que 31 jours.
        const factures = await db("facturation").where(function(){this.whereNull("montant_paye").orWhere("montant_paye",0)})
        .whereRaw("date_emission <= date('now', '-31 days')").select("*")
        if(factures.length == 0){
            return res.status(204).json({message: "Aucune facture en retard"})
        }
        res.status(200).json(factures)
    }
    catch (error) {
        console.error("Erreur dans GET /facturation/facturesRetards", error)
        res.status(500).json({ message: "Erreur serveur", error })
    }
})

module.exports = router