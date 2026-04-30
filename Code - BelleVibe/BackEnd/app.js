/////////////////////////////////////// Création du serveur ////////////////////////////////////////////

// Importation des modules nécessaires
const express = require("express");
const app = express();
const crypto = require("crypto");

// pour la route /api qui va générer un swagger avec la documentation des routes
const swaggerUi = require("swagger-ui-express")
const YAML = require("js-yaml")
const fs = require("fs")
const swaggerDocument = YAML.load(fs.readFileSync("./bellevibe-api.yaml"))

/* Path permet de gérer les chemins de fichiers */
const path = require("path");

/* Importe la base de données de creationBd.js */
const { db, createTables } = require("./BD/creationBd");
const { default: knex } = require("knex");

// Augmenter la limite pour les requêtes JSON (par défaut 100kb)
app.use(express.json({ limit: "10mb" })); // accepte jusqu'à 10MB
app.use(express.urlencoded({ limit: "10mb", extended: true }));

// Ajout des en-têtes CORS pour permettre les requêtes depuis le frontend (car sinon faisait des erreurs de politique de même origine et envoyait des requêtes bloquées)
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    if (req.method === "OPTIONS") return res.sendStatus(204);
    next();
});

// Servir les fichiers statiques
app.use(express.static(path.join(__dirname, "../../"))); // client global
app.use(express.static(path.join(__dirname, "../client"))); // client connexion-inscription
app.use("/uploads", express.static(path.join(__dirname, "uploads"))); // dossier pour les images uploadées

// route /api qui montre le swagger
app.use('/api', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get("/", (req, res) => {
    res.send("Serveur fonctionne");
});



// Importation des routes
app.use("/notes", require("./Notes/notes.js"));
app.use("/documents", require("./Documents/documents.js"))
app.use("/employes", require("./Employes/employes.js"))
app.use("/historique", require("./Historique/historique.js"))
app.use("/comptes", require("./Comptes/comptes.js"))
app.use("/demandes", require("./Demandes/demandes.js"))
app.use("/clients", require("./Clients/clients.js"))
app.use("/services", require("./Services/services.js"))
app.use("/forfaits", require("./Forfaits/forfaits.js"))
app.use("/forfaitsDossier", require("./ForfaitsDossier/forfaitsDossier.js"))
// Initialisation de la base de données et démarrage du serveur
createTables()
    .then(() => {
        const PORT = 3000;
        app.listen(PORT, () => {
            console.log(`Serveur démarré sur le port ${PORT}`);
        });
    })
    .catch((err) => {
        console.error("Erreur lors de l'initialisation de la base de données:", err);
    });
