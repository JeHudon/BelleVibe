const { validerChamps, authentifier, authentifierSupp, log } = require("../fonctionsCommunes");
const { db } = require("../BD/creationBd");

const express = require("express");
const router = express.Router();

// GET forfaits d’un dossier
router.get("/:idDossier", authentifier, async (req, res) => {
    try {
        const { idDossier } = req.params;

        const data = await db("forfaitsDossier")
            .where("idDossier", idDossier);

        res.status(200).json(data);
    } catch (err) {
        console.error("Erreur GET /forfaitsDossier/:idDossier", err);
        res.status(500).json({ error: "Erreur serveur" });
    }
});

// POST ajouter un forfait à un dossier
router.post("/", authentifierSupp, async (req, res) => {
    try {
        const { idDossier, idForfait } = req.body;

        const validation = validerChamps({ idDossier, idForfait });
        if (validation.error) {
            return res.status(400).json({ error: validation.error });
        }

        const data = { idDossier, idForfait };

        const [idForfaitDossier] = await db("forfaitsDossier").insert(data);
        await log(req.user.id, "WRITE", "forfaitsDossier", idForfaitDossier);

        res.status(201).json({
            message: "Forfait ajouté au dossier avec succès.",
            idForfaitDossier,
            ...data
        });
    } catch (err) {
        console.error("Erreur POST /forfaitsDossier", err);
        res.status(500).json({ error: "Erreur serveur" });
    }
});

// DELETE supprimer un forfait d’un dossier
router.delete("/:idForfaitDossier", authentifierSupp, async (req, res) => {
    try {
        const { idForfaitDossier } = req.params;

        const deleted = await db("forfaitsDossier")
            .where("idForfaitDossier", idForfaitDossier)
            .del();

        if (deleted === 0) {
            return res.status(404).json({ error: "Association non trouvée" });
        }

        await log(req.user.id, "DELETE", "forfaitsDossier", idForfaitDossier);

        res.status(200).json({
            message: "Forfait retiré du dossier avec succès.",
            idForfaitDossier
        });
    } catch (err) {
        console.error("Erreur DELETE /forfaitsDossier/:idForfaitDossier", err);
        res.status(500).json({ error: "Erreur serveur" });
    }
});

module.exports = router;