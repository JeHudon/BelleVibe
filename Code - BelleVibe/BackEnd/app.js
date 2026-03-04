/////////////////////////////////////// Création du serveur ////////////////////////////////////////////


const express = require('express');
const app = express();
const crypto = require('crypto');

/* Permet au serveur de traiter des données au format Json */
app.use(express.json());

/* Path permet de gérer les chemins de fichiers */
const path = require('path');

/* Importe la base de données de creationBd.js */
// const { db, createTable } = require('./creationBd');
const { default: knex } = require('knex');

// Augmenter la limite pour les requêtes JSON (par défaut 100kb)
app.use(express.json({ limit: '10mb' })); // accepte jusqu'à 10MB
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Ajout des en-têtes CORS pour permettre les requêtes depuis le frontend (car sinon faisait des erreurs de politique de même origine et envoyait des requêtes bloquées)
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

// Servir les fichiers statiques
app.use(express.static(path.join(__dirname, "../../"))); // client global
app.use(express.static(path.join(__dirname, "../client"))); // client connexion-inscription
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // dossier pour les images uploadées


