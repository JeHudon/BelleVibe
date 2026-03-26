const jwt = require('jsonwebtoken')
// clée ajoutée dans la logique de création des tokens 
const jwt_mdp = "MECHANTE_belle_Vibe_2026"
const { db } = require("./BD/creationBd.js")
const express = require("express");

// Fonction de validation générique pour les champs d'une note
// Exemple d'utilisation : 
// validerChamps({ idDossier, idEmploye, type, titre, note })
function validerChamps(champs) {
    for (const [nom, valeur] of Object.entries(champs)) {
        if (!valeur) {
            return { error: `Champ '${nom}' obligatoire.` };
        }
    }
    return true;
}


// fonction pour valider l'utilisateur qui est logged in
// devrait être utilisé dans chaque action sauf pour log in, 
// vérifier ensuite que l'utilisateur a les permissions de faire l'action demandée
// exemple d'utilisation:
// app.get('/taRoute', authentifier, (req, res) => {stuff})
// pour récupérer l'id ou le role => req.user.id / req.user.role
const authentifier = (req, res, next) => {
    // récupère le header 'authorization'
    const authHeader = req.headers['authorization']
    // sépare le "Bearer {token}" en 2 (séparés par l'espace) 
    // et garde seulement le token 
    const token = authHeader && authHeader.split(' ')[1]
    // erreur si pas de token
    if (!token) {
        return res.status(401).json({ message: "Accès refusé. Token manquant." })
    }
    try {
        // décode le token et le renvoye dans la requête dans user
        const userDecoded = jwt.verify(token, jwt_mdp)
        req.user = userDecoded
        if (req.user.statut != "actif") {
            return res.status(401).json({ message: "Accès refusé. Compte employé inactif"})
        }
        next()
    }
    catch (error) {
        return res.status(403).json({ message: "Token invalide ou expiré" })
    }
}

// fonction pour authentifier les superviseurs ou les admins pour certaines routes nécéssitant plus de sécurité
const authentifierSupp = (req, res, next) => {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if (!token) {
        return res.status(401).json({ message: "Accès refusé. Token manquant." })
    }
    try {
        const userDecoded = jwt.verify(token, jwt_mdp)
        req.user = userDecoded
        if (req.user.statut != "actif") {
            return res.status(401).json({ message: "Accès refusé. Compte employé inactif"})
        }
        // si superviseur ou admin, refuse les employés standards ("commis")
        if (req.user.role == "superviseur" || req.user.role == "admin") {
            next()
        }
        else {
            return res.status(401).json({ message: "Accès refusé. Permissions manquantes." })
        }
    }
    catch (error) {
        return res.status(403).json({ message: "Token invalide ou expiré" })
    }
}

// fonction pour authentifier les admins, pour routes nécéssitant le plus haut niveau de sécurité
const authentifierAdmin = (req, res, next) => {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if (!token) {
        return res.status(401).json({ message: "Accès refusé. Token manquant." })
    }
    try {
        const userDecoded = jwt.verify(token, jwt_mdp)
        req.user = userDecoded
        if (req.user.statut != "actif") {
            return res.status(401).json({ message: "Accès refusé. Compte employé inactif"})
        }
        // si admin, refuse les employés standards ("commis") ou superviseurs 
        if (req.user.role == "admin") {
            next()
        }
        else {
            return res.status(401).json({ message: "Accès refusé. Permissions manquantes." })
        }
    }
    catch (error) {
        return res.status(403).json({ message: "Token invalide ou expiré" })
    }
}

// fonction pour logger tous changements
// action = EDIT | WRITE | DELETE
// table = nom de la table où l'info à été modifiée
// PK = primary key de la table / id de la ligne dans la table modifiée
async function log(idEmploye, action, table, PK) {
    const data = {
        idEmploye: idEmploye,
        actionEntree: action,
        table: table,
        idTransaction: PK
    }
    await db("historiqueDossiers").insert(data)
}



module.exports = { validerChamps, authentifier, authentifierSupp, authentifierAdmin, log };