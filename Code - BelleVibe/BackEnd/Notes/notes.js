const { validerChamps, authentifier, authentifierAdmin, log } = require("../fonctionsCommunes.js");
const { db } = require("../BD/creationBd");

const express = require("express");
const router = express.Router();

// Routes pour la table Notes

// Get notes d'un dossier
router.get("/:idDossier", authentifier, async (req, res) => {
    const { idDossier } = req.params;
    try {
        const notes = await db("Notes").select("*").where("idDossier", idDossier);
        res.status(200).json(notes);
    } catch (err) {
        console.error("Erreur /getNotes/:idDossier", err);
        res.status(500).json({ error: "Erreur serveur.." });
    }
});

// Ajouter une note à un dossier
router.post("/:idDossier", authentifier, async (req, res) => {
    try {
        const { idEmploye, type, titre, note } = req.body;
        const { idDossier } = req.params;

        // Vérification que tous les champs sont remplis
        const validationResult = validerChamps({ idDossier, idEmploye, type, titre, note });
        if (validationResult.error) {
            return res.status(400).json({ error: validationResult.error });
        }

        const data = {
            idDossier: idDossier,
            idEmploye: idEmploye,
            typeNote: type,
            titreNote: titre,
            note: note,
        };

        const [idNote] = await db("notes").insert(data);
        await log(req.user.id, "WRITE", "NOTES", Number(idNote));
        res.status(201).json({ ...data, idNote: Number(idNote) });
    } catch (err) {
        console.error("Erreur /addNote/:idDossier", err);
        res.status(500).json({ error: "Erreur serveur", err });
    }
});

// Modifier une note d'un dossier
router.put("/:idNote", authentifier, async (req, res) => {
    try {
        const { idNote } = req.params;
        const { idEmploye, type, titre, note, idDossier } = req.body;

        // Vérification que tous les champs sont remplis
        const validationResult = validerChamps({ idDossier, idEmploye, type, titre, note });
        if (validationResult.error) {
            return res.status(400).json({ error: validationResult.error });
        }

        // Vérification que la note existe avant de la modifier
        const verifNote = await db("notes")
            .where("idNote", idNote)
            .update({ idEmploye: idEmploye, typeNote: type, titreNote: titre, note: note });
        if (verifNote === 0) {
            return res.status(404).json({ error: "Note non trouvée" });
        }

        await log(req.user.id, "EDIT", "NOTES", Number(idNote));
        res.status(200).json({
            message: `Note mise à jour avec succès.`,
            idNote,
        });
    } catch (err) {
        console.error("Erreur /updateNote", err);
        res.status(500).json({ error: "Erreur serveur", details: err.message });
    }
});

// Supprimer une note d'un dossier
router.delete("/:idNote", authentifierAdmin, async (req, res) => {
    try {
        const { idNote } = req.params;

        // Vérification que la note existe avant de la supprimer
        const verifNote = await db("notes").where("idNote", idNote).del();
        if (verifNote === 0) {
            return res.status(404).json({ error: "Note non trouvée" });
        }

        await log(req.user.id, "DELETE", "NOTES", Number(idNote));
        res.status(200).json({
            message: `Note supprimée avec succès.`,
            idNote,
        });
    } catch (err) {
        console.error("Erreur /deleteNote", err);
        res.status(500).json({ error: "Erreur serveur", details: err.message });
    }
});

module.exports = router;
