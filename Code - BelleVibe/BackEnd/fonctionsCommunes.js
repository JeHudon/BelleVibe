const jwt = require('jsonwebtoken')
// clée ajoutée dans la logique de création des tokens 
const jwt_mdp = "MECHANTE_belle_Vibe_2026"

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
        next()
    }
    catch (error) {
        return res.status(403).json({ message: "Token invalide ou expiré" })
    }
}

// fonction pour logger tous changements
// idDossier représente le dossier du client qui à été modifié
// action = EDIT | WRITE | DELETE
// table = nom de la table où l'info à été modifiée
// idTransaction = id de la ligne dans la table modifiée
async function log(idDossier, idEmploye, action, table, idTransaction){
    const data = {
        idDossier: idDossier,
        idEmploye: idEmploye,
        actionEntree: action,
        table: table,
        idTransaction: idTransaction
    }
    await db("historiqueDossiers").insert(data)
}



module.exports = { validerChamps, authentifier, log };