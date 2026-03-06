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

module.exports = { validerChamps };