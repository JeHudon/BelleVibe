const { validerChamps, authentifier, authentifierAdmin, log } = require("../fonctionsCommunes");
const { db } = require("../BD/creationBd");

const express = require("express");
const router = express.Router();

// GET tous les services
router.get("/", authentifier, async (req, res) => {
    try {
        const services = await db("services").select("*");
        res.status(200).json(services);
    } catch (err) {
        console.error("Erreur GET /services", err);
        res.status(500).json({ error: "Erreur serveur" });
    }
});

// POST ajouter service
router.post("/", authentifierAdmin, async (req, res) => {
    try {
        const { typeService } = req.body;

        const validation = validerChamps({ typeService });
        if (validation.error) {
            return res.status(400).json({ error: validation.error });
        }

        const data = { typeService };

        const [idService] = await db("services").insert(data);
        await log(req.user.id, "WRITE", "services", idService);

        res.status(201).json({
            message: "Service ajouté avec succès.",
            idService,
            ...data
        });
    } catch (err) {
        console.error("Erreur POST /services", err);
        res.status(500).json({ error: "Erreur serveur" });
    }
});

// PUT modifier service
router.put("/:idService", authentifierAdmin, async (req, res) => {
    try {
        const { idService } = req.params;
        const { typeService } = req.body;

        const validation = validerChamps({ typeService });
        if (validation.error) {
            return res.status(400).json({ error: validation.error });
        }

        const updated = await db("services")
            .where("idService", idService)
            .update({ typeService });

        if (updated === 0) {
            return res.status(404).json({ error: "Service non trouvé" });
        }

        await log(req.user.id, "EDIT", "services", idService);

        res.status(200).json({
            message: "Service modifié avec succès.",
            idService
        });
    } catch (err) {
        console.error("Erreur PUT /services/:idService", err);
        res.status(500).json({ error: "Erreur serveur" });
    }
});

// DELETE supprimer service
router.delete("/:idService", authentifierAdmin, async (req, res) => {
    try {
        const { idService } = req.params;

        const deleted = await db("services")
            .where("idService", idService)
            .del();

        if (deleted === 0) {
            return res.status(404).json({ error: "Service non trouvé" });
        }

        await log(req.user.id, "DELETE", "services", idService);

        res.status(200).json({
            message: "Service supprimé avec succès.",
            idService
        });
    } catch (err) {
        console.error("Erreur DELETE /services/:idService", err);
        res.status(500).json({ error: "Erreur serveur" });
    }
});

module.exports = router;