const { validerChamps, authentifier, authentifierSupp, log } = require("../fonctionsCommunes");
const { db } = require("../BD/creationBd");

const express = require("express");
const router = express.Router();

// --- Routes pour la table dossiers ---

// Get tous les dossiers
router.get("/getDossiers", authentifier, async (req, res) => {
    try {
        const dossiers = await db("dossiers").select("*");
        res.status(200).json(dossiers);
    } catch (error) {
        console.error("Erreur /getDossiers", error);
        res.status(500).json({ error: "Erreur serveur.." });
    }
});

// Get dossier spécifique
router.get("/getDossier/:idDossier", authentifier, async (req, res) => {
    try {
        const { idDossier } = req.params;

        const validationResult = validerChamps({ idDossier });
        if (validationResult.error) {
            return res.status(400).json({ error: validationResult.error });
        }

        const dossier = await db("dossiers")
            .where("idDossier", idDossier)
            .first();

        if (!dossier) {
            return res.status(404).json({ error: "Dossier non trouvé." });
        }

        res.status(200).json(dossier);
    } catch (error) {
        console.error("Erreur /getDossier/:idDossier", error);
        res.status(500).json({ error: "Erreur serveur." });
    }
});

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
// Créer un dossier associé à un employé
router.post("/creerDossier",authentifier, async (req, res) => {
    try {
        const { idClient, idEmploye, typeDossier, statutDossier, soldeDossier } = req.body;

        // Validation
        // validerChamps est utilisé ici pour vérifier que les champs ne sont pas vides.
        // On traite soldeDossier séparément pour permettre une valeur 0.
        const validationResult = validerChamps({ idClient, idEmploye, typeDossier, statutDossier });
        if (validationResult.error) {
            return res.status(400).json({ error: validationResult.error });
        }
        if (soldeDossier === undefined || soldeDossier === null) {
            return res.status(400).json({ error: "Champ 'soldeDossier' obligatoire." });
        }

        // Vérification que le client et l'employé existent
        const client = await db("clients").select("idClient").where("idClient", idClient).first();
        if (!client) {
            return res.status(404).json({ error: "Client non trouvé." });
        }

        const employe = await db("employes").select("idEmploye").where("idEmploye", idEmploye).first();
        if (!employe) {
            return res.status(404).json({ error: "Employé non trouvé." });
        }

        const dossier = {
            idClient,
            idEmploye,
            typeDossier,
            statutDossier,
            soldeDossier,
        };

        await db("dossiers").insert(dossier);
        const id = await db("dossiers").where({ idClient: idClient, idEmploye: idEmploye, typeDossier: typeDossier, statutDossier: statutDossier, soldeDossier: soldeDossier}).select("idDossier")
        await log(req.user.id, "WRITE", "DOSSIERS", Number(id[0].idDossier))
        return res.status(201).json(dossier);
    } catch (error) {
        console.error("Erreur /creerDossier", error);
        res.status(500).json({ error: "Erreur serveur.." });
    }
});

// Modifier le statut d'un dossier
router.put("/modifierStatut/:idDossier",authentifier, async (req, res) => {
    try {
        const { idDossier } = req.params;
        const { statutDossier } = req.body;

        const validationResult = validerChamps({ idDossier, statutDossier });
        if (validationResult.error) {
            return res.status(400).json({ error: validationResult.error });
        }

        const updated = await db("dossiers")
            .where("idDossier", idDossier)
            .update({ statutDossier: statutDossier });

        if (updated === 0) {
            return res.status(404).json({ error: "Dossier non trouvé." });
        }

        res.status(200).json({ message: "Statut du dossier modifié avec succès.", idDossier });
        await log(req.user.id, "EDIT", "DOSSIERS", Number(idDossier))
    } catch (error) {
        console.error("Erreur /modifierStatut/:idDossier", error);
        res.status(500).json({ error: "Erreur serveur.." });
    }
});

// Supprimer un dossier
router.delete("/:idDossier", authentifierSupp, async (req, res) => {
    try {
        const { idDossier } = req.params;

        const deleted = await db("dossiers").where("idDossier", idDossier).del();
        if (deleted === 0) {
            return res.status(404).json({ error: "Dossier non trouvé." });
        }

        res.status(200).json({ message: "Dossier supprimé avec succès.", idDossier });
        await log(req.user.id, "DELETE", "DOSSIERS", Number(idDossier))
    } catch (error) {
        console.error("Erreur /deleteDossier", error);
        res.status(500).json({ error: "Erreur serveur.." });
    }
});


module.exports = router;


