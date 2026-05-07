const { validerChamps, authentifier, log, authentifierSupp } = require("../fonctionsCommunes");
const { db } = require("../BD/creationBd");

const express = require("express");
const router = express.Router();

// Routes pour la table demande

// Get demande d'un dossier
router.get("/getDemande/:idDossier", authentifier, async (req, res) => {
    const { idDossier } = req.params;
    try {
        const demande = await db("demandes").select("*").where("idDossier", idDossier)
        if (demande == 0) {
            return res.status(404).json({ error: "Dossier non trouvé." });
        }
        res.status(200).json(demande)
    } catch (error) {
        console.error("Erreur /getDemande/:idDossier")
        res.status(500).json({ error: "Erreur serveur.." })
    }
})

// Get tout les demandes
router.get("/getDemandes", authentifier, async (req, res) => {
    try {
        const demandes = await db("demandes").select("*")
        res.status(200).json(demandes)
    } catch (error) {
        console.error("Erreur /getDemandes")
        res.status(500).json({ error: "Erreur serveur.." })
    }
})

// Get les demandes ouvertes (pour dashboard)
router.get("/getDemandesOuvertes", authentifier, async (req, res) => {
    try {
        const demandesOuvertes = await db("demandes").select("*").where("statutDemande", "Ouverte")
        res.status(200).json(demandesOuvertes)
    } catch (error) {
        console.error("Erreur /getDemandesOuvertes")
        res.status(500).json({ error: "Erreur serveur.." })
    }
})

// Get les demandes en retard (pour dashboard superviseur)
router.get("/getDemandesEnRetard", authentifier, async (req, res) => {
    try {
        const demandesEnRetard = await db("demandes").select("*").where("statutDemande", "En retard")
        res.status(200).json(demandesEnRetard)
    } catch (error) {
        console.error("Erreur /getDemandesEnRetard")
        res.status(500).json({ error: "Erreur serveur.." })
    }
})

// Get les demandes en attente (pour dashboard)
router.get("/getDemandesEnAttente", authentifier, async (req, res) => {
    try {
        const demandesEnAttente = await db("demandes").select("*").where("statutDemande", "En attente")
        res.status(200).json(demandesEnAttente)
    } catch (error) {
        console.error("Erreur /getDemandesEnAttente")
        res.status(500).json({ error: "Erreur serveur.." })
    }
})

// Créé une demande
router.post("/creerDemande/:idDossier", authentifier, async (req, res) => {
    try {

        // Récupération des paramètres/body
        console.log(req.body)
        const { typeDemande, statutDemande, noteInterne } = req.body
        const { idDossier } = req.params

        // Vérification que tous les champs sont remplis
        const validationResult = validerChamps({ idDossier, typeDemande, statutDemande, noteInterne });
        if (validationResult.error) {
            return res.status(400).json({ error: validationResult.error });
        }

        // On met les infos dans une variable
        const demande = {
            idDossier: idDossier,
            typeDemande: typeDemande,
            statutDemande: statutDemande,
            noteInterne: noteInterne
        }

        // On l'ajoute à la base de données et on le retourne
        const [idDemande] = await db("demandes").insert(demande);
        await log(req.user.id, "WRITE", "DEMANDES", Number(idDemande))
        return res.status(201).json({ ...demande, idDemande: Number(idDemande) })

    } catch (error) {
        console.error("Erreur /creerDemande/:idDossier")
        res.status(500).json({ error: "Erreur serveur.." })
    }
})

// Modifier une demande
router.put("/modifierDemande/:idDemande", authentifierSupp, async (req, res) => {
    try {

        // Récupération des paramètres/body
        console.log(req.body)
        const { typeDemande, statutDemande, noteInterne } = req.body
        const { idDemande } = req.params

        // Vérification que tous les champs sont remplis
        const validationResult = validerChamps({ idDemande, typeDemande, statutDemande, noteInterne });
        if (validationResult.error) {
            return res.status(400).json({ error: validationResult.error });
        }

        // Vérifie que la demande existe
        const verifDemande = await db("demandes").where("idDemande", idDemande).first()
        if (!verifDemande) {
            // Indique à l'utilisateur si la demande n'existe pas
            return res.status(404).json({ error: "Demande inexistante" })
        }

        // On met les infos dans une variable
        const demande = {
            idDemande: idDemande,
            typeDemande: typeDemande,
            statutDemande: statutDemande,
            noteInterne: noteInterne
        }

        // On update la demande correspondante dans la base de données
        await db("demandes").where("idDemande", idDemande).update(demande)
        await log(req.user.id, "UPDATE", "DEMANDES", Number(idDemande))
        return res.status(201).json({ ...demande, idDemande: Number(idDemande) })

    } catch (error) {
        console.error("Erreur /editDemandee/:idDossier")
        res.status(500).json({ error: "Erreur serveur.." })
    }
})

module.exports = router;