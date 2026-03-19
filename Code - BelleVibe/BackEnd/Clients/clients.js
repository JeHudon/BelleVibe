const { validerChamps } = require("../fonctionsCommunes");
const { db } = require("../BD/creationBd");

const express = require("express");
const router = express.Router();


// --- Routes pour la table clients ---

// Get tous les clients
router.get("/getClients", async (req, res) => {
    try {
        const clients = await db("clients").select("*");
        res.status(200).json(clients);
    } catch (error) {
        console.error("Erreur /getClients", error);
        res.status(500).json({ error: "Erreur serveur.." });
    }
});

// Get client specifique
router.get("/getClient/:idClient", async (req, res) => {
    try {
        const { idClient } = req.params;
        const client = await db("clients").select("*").where("idClient", idClient).first();
        if (!client) {
            return res.status(404).json({ error: "Client non trouvé." });
        }
        res.status(200).json(client);
    } catch (error) {
        console.error("Erreur /getClient/:idClient", error);
        res.status(500).json({ error: "Erreur serveur.." });
    }
});

// Créer un client

router.post("/creerClient", async (req, res) => {
    try {
        const { nomClient, prenomClient, courrielClient, telephoneClient, adresseClient, codePostalClient } = req.body;

        const validationResult = validerChamps({ nomClient, prenomClient, courrielClient, adresseClient, codePostalClient });
        if (validationResult.error) {
            return res.status(400).json({ error: validationResult.error });
        }

        const [idClient] = await db("clients").insert({
            nomClient,
            prenomClient,
            courrielClient,
            telephoneClient,
            adresseClient,
            codePostalClient
        });

        res.status(201).json({ message: "Client créé avec succès.", idClient });
    } catch (error) {
        console.error("Erreur /creerClient", error);
        res.status(500).json({ error: "Erreur serveur.." });
    }
});

router.delete("/supprimerClient/:idClient", async (req, res) => {
    try {
        const { idClient } = req.params;

        const client = await db("clients").where("idClient", idClient).first();
        if (!client) {
            return res.status(404).json({ error: "Client non trouvé." });
        }

        await db("clients").where("idClient", idClient).del();
        res.status(200).json({ message: "Client supprimé avec succès." });
    } catch (error) {
        console.error("Erreur /supprimerClient/:idClient", error);
        res.status(500).json({ error: "Erreur serveur.." });
    }
});

module.exports = router;
