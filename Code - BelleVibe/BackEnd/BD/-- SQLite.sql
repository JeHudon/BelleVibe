-- SQLite
insert into clients ( nomClient, prenomClient, courrielClient, adresseClient, codePostalClient) values ('Doe', 'John', 'john.doe@example.com', '123 Main St', '12345');
insert into employes ( roleEmploye, statutEmploye, nomEmploye, prenomEmploye, courrielEmploye, telephoneEmploye, adresseEmploye, codePostalEmploye) values ('Développeur', 'Actif', 'Smith', 'Jane', 'jane.smith@example.com', '123-456-7890', '456 Oak Ave', '67890');
insert into dossiers ( idClient, idEmploye,typeDossier, statutDossier, soldeDossier) values (1, 1, 'Personnel', 'Actif', 0);

update dossiers set soldeDossier = 299.97 where idDossier = 3
