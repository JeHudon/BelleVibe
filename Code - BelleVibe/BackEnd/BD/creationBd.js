/* Récupère le package knex */
const knex = require('knex');

/* Créé une instance de la base de données */
const db = knex({
    client: 'better-sqlite3',
    connection: {
        filename: "./BD/BelleVibe.sqlite3"
    },
    useNullAsDefault: true
});

/* Fonction qui créé chaque table */
async function createTables() {

    /*---------- Création de la table clients ----------*/
    const clients = await db.schema.hasTable("clients")
    /* Si la table n'existe pas, on la créé */
    if (!clients) {
        await db.schema.createTable("clients", (table) => {
            table.increments("idClient");
            table.string("nomClient").notNullable();
            table.string("prenomClient").notNullable();
            table.string("courrielClient").notNullable();
            table.integer("telephoneClient");
            table.string("adresseClient").notNullable();
            table.string("codePostalClient").notNullable();
            table.timestamps(true, true);
        });
        console.log("Table 'clients' créée. ")
    }

    /*---------- Création de la table employés ----------*/
    const employes = await db.schema.hasTable("employes")
    /* Si la table n'existe pas, on la créé */
    if (!employes) {
        await db.schema.createTable("employes", (table) => {
            table.increments("idEmploye");
            // utiliser "commis", "superviseur", "admin"
            table.string("roleEmploye").notNullable();    
            // utiliser "actif", "inactif", "suspendu"
            table.string("statutEmploye").notNullable();        
            table.string("nomEmploye").notNullable();
            table.string("prenomEmploye").notNullable();
            table.string("courrielEmploye").notNullable();
            table.integer("telephoneEmploye").notNullable();
            table.string("adresseEmploye").notNullable();
            table.string("codePostalEmploye").notNullable();
            table.string("motDePasse").notNullable();
            table.timestamps(true, true);
        });
        console.log("Table 'employes' créée. ")
    }

    /*---------- Création de la table dossiers ----------*/
    const dossiers = await db.schema.hasTable("dossiers")
    /* Si la table n'existe pas, on la créé */
    if (!dossiers) {
        await db.schema.createTable("dossiers", (table) => {
            table.increments("idDossier");
            table.integer("idClient").references("idClient").inTable("clients");
            table.integer("idEmploye").references("idEmploye").inTable("employes");
            table.string("typeDossier").notNullable(); 
            // utiliser "actif" | "inactif" | "en attente"           
            table.string("statutDossier").notNullable();
            table.float("soldeDossier").notNullable();
            table.timestamps(true, true);
        });
        console.log("Table 'dossiers' créée. ")
    }

    /*---------- Création de la table historiqueDossiers ----------*/
    const historiqueDossiers = await db.schema.hasTable("historiqueDossiers")
    /* Si la table n'existe pas, on la créé */
    if (!historiqueDossiers) {
        await db.schema.createTable("historiqueDossiers", (table) => {
            table.increments("idHistorique");
            table.integer("idDossier").references("idDossier").inTable("dossiers");
            table.integer("idEmploye").references("idEmploye").inTable("employes");
            table.string("actionEntree").notNullable();            
            table.timestamps(true, true);
        });
        console.log("Table 'historiqueDossiers' créée. ")
    }

    /*---------- Création de la table demandes ----------*/
    const demandes = await db.schema.hasTable("demandes")
    /* Si la table n'existe pas, on la créé */
    if (!demandes) {
        await db.schema.createTable("demandes", (table) => {
            table.increments("idDemande");
            table.integer("idDossier").references("idDossier").inTable("dossiers");
            table.string("typeDemande").notNullable();
            table.string("statutDemande").notNullable();
            table.string("noteInterne").notNullable();            
            table.timestamps(true, true);
        });
        console.log("Table 'demandes' créée. ")
    }

    /*---------- Création de la table documents ----------*/
    const documents = await db.schema.hasTable("documents")
    /* Si la table n'existe pas, on la créé */
    if (!documents) {
        await db.schema.createTable("documents", (table) => {
            table.increments("idDocument");
            table.integer("idDossier").references("idDossier").inTable("dossiers");
            table.string("typeDocument").notNullable();
            table.string("tailleDocument").notNullable();
            table.string("cheminDocument").notNullable();          
            table.timestamps(true, true);
        });
        console.log("Table 'documents' créée. ")
    }

    /*---------- Création de la table notes ----------*/
    const notes = await db.schema.hasTable("notes")
    /* Si la table n'existe pas, on la créé */
    if (!notes) {
        await db.schema.createTable("notes", (table) => {
            table.increments("idNote");
            table.integer("idDossier").references("idDossier").inTable("dossiers");
            table.integer("idEmploye").references("idEmploye").inTable("employes");         
            table.string("typeNote").notNullable();
            table.string("titreNote").notNullable();
            table.string("note").notNullable();          
            table.timestamps(true, true);
        });
        console.log("Table 'notes' créée. ")
    }

    /*---------- Création de la table forfaitsDossier ----------*/
    const forfaitsDossier = await db.schema.hasTable("forfaitsDossier")
    /* Si la table n'existe pas, on la créé */
    if (!forfaitsDossier) {
        await db.schema.createTable("forfaitsDossier", (table) => {
            table.increments("idForfaitDossier");
            table.integer("idDossier").references("idDossier").inTable("dossiers");
            table.integer("idForfait").references("idForfait").inTable("forfaits");                  
            table.timestamps(true, true);
        });
        console.log("Table 'forfaitsDossier' créée. ")
    }

    /*---------- Création de la table forfait ----------*/
    const forfaits = await db.schema.hasTable("forfaits")
    /* Si la table n'existe pas, on la créé */
    if (!forfaits) {
        await db.schema.createTable("forfaits", (table) => {
            table.increments("idForfait");
            table.integer("idService").references("idService").inTable("services");
            table.string("nomForfait").notNullable();
            table.float("prixForfait").notNullable();
            table.string("descriptionForfait").notNullable();                 
            table.timestamps(true, true);
        });
        console.log("Table 'forfaits' créée. ")
    }

    /*---------- Création de la table services ----------*/
    const services = await db.schema.hasTable("services")
    /* Si la table n'existe pas, on la créé */
    if (!services) {
        await db.schema.createTable("services", (table) => {
            table.increments("idService");
            table.string("typeService").notNullable();                
            table.timestamps(true, true);
        });
        console.log("Table 'services' créée. ")
    }

}

/* Exporte l'instance db et la fonction createTables */
module.exports = {
    db,
    createTables
};