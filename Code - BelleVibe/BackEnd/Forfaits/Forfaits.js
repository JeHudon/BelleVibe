const { validerChamps, authentifier, authentifierAdmin, log } = require("../fonctionsCommunes");
const { db } = require("../BD/creationBd");

const express = require("express");
const router = express.Router();

// GET tous les forfaits
router.get("/", authentifier, async (req, res) => {
    try {
        const forfaits = await db("forfaits").select("*");
        res.status(200).json(forfaits);
    } catch (err) {
        console.error("Erreur GET /forfaits", err);
        res.status(500).json({ error: "Erreur serveur" });
    }
});

// POST ajouter forfait
router.post("/", authentifierAdmin, async (req, res) => {
    try {
        const { idService, nomForfait, prixForfait, descriptionForfait } = req.body;

        const validation = validerChamps({
            idService,
            nomForfait,
            prixForfait,
            descriptionForfait
        });

        if (validation.error) {
            return res.status(400).json({ error: validation.error });
        }

        const data = {
            idService,
            nomForfait,
            prixForfait,
            descriptionForfait
        };

        const [idForfait] = await db("forfaits").insert(data);
        await log(req.user.id, "WRITE", "forfaits", idForfait);

        res.status(201).json({
            message: "Forfait ajouté avec succès.",
            idForfait,
            ...data
        });
    } catch (err) {
        console.error("Erreur POST /forfaits", err);
        res.status(500).json({ error: "Erreur serveur" });
    }
});

// PUT modifier forfait
router.put("/:idForfait", authentifierAdmin, async (req, res) => {
    try {
        const { idForfait } = req.params;
        const { idService, nomForfait, prixForfait, descriptionForfait } = req.body;

        const validation = validerChamps({
            idService,
            nomForfait,
            prixForfait,
            descriptionForfait
        });

        if (validation.error) {
            return res.status(400).json({ error: validation.error });
        }

        const updated = await db("forfaits")
            .where("idForfait", idForfait)
            .update({
                idService,
                nomForfait,
                prixForfait,
                descriptionForfait
            });

        if (updated === 0) {
            return res.status(404).json({ error: "Forfait non trouvé" });
        }

        await log(req.user.id, "EDIT", "forfaits", idForfait);

        res.status(200).json({
            message: "Forfait modifié avec succès.",
            idForfait
        });
    } catch (err) {
        console.error("Erreur PUT /forfaits/:idForfait", err);
        res.status(500).json({ error: "Erreur serveur" });
    }
});

// DELETE supprimer forfait
router.delete("/:idForfait", authentifierAdmin, async (req, res) => {
    try {
        const { idForfait } = req.params;

        const deleted = await db("forfaits")
            .where("idForfait", idForfait)
            .del();

        if (deleted === 0) {
            return res.status(404).json({ error: "Forfait non trouvé" });
        }

        await log(req.user.id, "DELETE", "forfaits", idForfait);

        res.status(200).json({
            message: "Forfait supprimé avec succès.",
            idForfait
        });
    } catch (err) {
        console.error("Erreur DELETE /forfaits/:idForfait", err);
        res.status(500).json({ error: "Erreur serveur" });
    }
});

module.exports = router;