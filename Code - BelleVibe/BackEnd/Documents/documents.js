const { validerChamps, authentifier, authentifierAdmin, log } = require("../fonctionsCommunes.js");
const { db } = require("../BD/creationBd");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const express = require("express");
const router = express.Router();

// Routes pour la table Notes

// Get documents d'un dossier
router.get("/:idDossier", authentifier, async (req, res) => {
    const { idDossier } = req.params;
    try {
        const documents = await db("documents").select("*").where("idDossier", idDossier);
        res.status(200).json(documents);
    } catch (err) {
        console.error("Erreur /getDocuments/:idDossier", err);
        res.status(500).json({ error: "Erreur serveur.." });
    }
});

const storage = multer.diskStorage({
    // Destionation dynamique basée sur l'idDossier
    destination: async (req, file, cb) => {
        let idDossier = req.params.idDossier;

        if (!idDossier) {
            const { idDocument } = req.params;
            const doc = await db("documents").where({ idDocument }).select("idDossier").first();
            idDossier = doc?.idDossier;
        }
        // Créer le dossier de destination s'il n'existe pas
        const dir = `BD/uploads/${idDossier}`;
        fs.mkdirSync(dir, { recursive: true });
        cb(null, dir);
    },
    // Nom de fichier unique basé sur timestamp + extension originale
    filename: (req, file, cb) => {
        const timestamp = new Date()
            .toISOString()
            .replace(/[T:.Z]/g, "-")
            .replace(/-+$/, "");
        cb(null, `${timestamp}${path.extname(file.originalname)}`);
        // → "2026-03-28-14-23-45-123.pdf"
    },
});

const upload = multer({ storage });

// Ajouter un document à un dossier
router.post("/:idDossier/file", authentifier, upload.single("fichier"), async (req, res) => {
    try {
        const { idDossier } = req.params;

        // Vérification qu'il y a bien un fichier dans la requête
        if (!req.file) {
            return res.status(400).json({ error: "Aucun fichier fourni" });
        }

        const data = {
            idDossier,
            typeDocument: path.extname(req.file.originalname),
            tailleDocument: req.file.size,
            nomDocument: req.file.originalname,
            cheminDocument: req.file.path,
        };

        const [idDocument] = await db("documents").insert(data);

        await log(req.user.id, "WRITE", "DOCUMENTS", Number(idDocument));
        res.status(201).json({
            message: `Document ajouté avec succès.`,
            idDocument: Number(idDocument),
        });
    } catch (err) {
        console.error("Erreur POST /:idDossier/file", err);
        res.status(500).json({ error: "Erreur serveur", err });
    }
});

// Modifier un document d'un dossier
router.put("/:idDocument/file", authentifier, upload.single("fichier"), async (req, res) => {
    try {
        const { idDocument } = req.params;
        const { idDossier } = req.body;

        // Vérification qu'il y a bien un fichier dans la requête
        if (!req.file) {
            return res.status(400).json({ error: "Aucun nouveau fichier fourni" });
        }

        // Vérification que tous les champs sont remplis
        const validationResult = validerChamps({ idDossier });
        if (validationResult.error) return res.status(400).json({ error: validationResult.error });

        // Récupérer le chemin de l'ancien fichier pour pouvoir le supprimer plus tard
        const existing = await db("documents")
            .where({ idDocument })
            .select("cheminDocument")
            .first();

        const data = {
            idDossier,
            typeDocument: path.extname(req.file.originalname).slice(1).toUpperCase(),
            tailleDocument: req.file.size,
            nomDocument: req.file.originalname,
            cheminDocument: req.file.path,
        };

        // Vérification que le document existe avant de le modifier
        const verifDocument = await db("documents").where("idDocument", idDocument).update(data);
        if (verifDocument === 0) {
            // Si l'update a échoué, supprimer le nouveau fichier uploadé
            fs.unlinkSync(req.file.path);
            return res.status(404).json({ error: "Document non trouvé" });
        }

        // Supprimer l'ancien fichier du serveur seulement après avoir mis à jour la base de données avec le nouveau fichier
        if (existing?.cheminDocument) {
            fs.unlink(existing.cheminDocument, (err) => {
                if (err) console.warn("Ancien fichier introuvable:", err.message);
            });
        }

        await log(req.user.id, "UPDATE", "DOCUMENTS", Number(idDocument));
        res.status(200).json({
            message: "Document mis à jour avec succès.",
            idDocument: Number(idDocument),
        });
    } catch (err) {
        console.error("Erreur PUT /:idDocument/file", err);
        res.status(500).json({ error: "Erreur serveur", err });
    }
});

// Supprimer un document
router.delete("/:idDocument", authentifierAdmin, async (req, res) => {
    try {
        const { idDocument } = req.params;

        // Get old file path to delete it
        const existing = await db("documents")
            .where({ idDocument })
            .select("cheminDocument")
            .first();

        // Vérification que le document existe avant de le supprimer
        const verifDocument = await db("documents").where("idDocument", idDocument).delete();
        if (verifDocument === 0) {
            return res.status(404).json({ error: "Document non trouvé" });
        }

        // Supprimer le fichier du serveur seulement après avoir supprimé la ligne de la base de données
        if (existing?.cheminDocument) {
            fs.unlink(existing.cheminDocument, (err) => {
                if (err) console.warn("Ancien fichier introuvable:", err.message);
            });
        }

        await log(req.user.id, "DELETE", "DOCUMENTS", Number(idDocument));
        res.status(200).json({
            message: "Document supprimé avec succès.",
            idDocument: Number(idDocument),
        });
    } catch (err) {
        console.error("Erreur DELETE /:idDocument", err);
        res.status(500).json({ error: "Erreur serveur", err });
    }
});

module.exports = router;
