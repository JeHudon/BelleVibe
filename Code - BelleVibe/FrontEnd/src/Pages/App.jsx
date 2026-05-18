import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import CardsDashboard from "../components/CardsDashboard";
import BouttonDashboard from "../components/BouttonsDashboard";

export default function App() {
  const [activeTab, setActiveTab] = useState("demandes")
  const [demandesOuvertes, setDemandesOuvertes] = useState(null)
  const [comptesEnAttente, setComptesEnAttente] = useState(null)
  const [facturesAFaire, setFacturesAFaire] = useState(null)
  const [infosEmploye, setInfosEmploye] = useState(null)
  const [historique, setHistorique] = useState(null)

  // retourne un nbre random entre 100 & 900
  const pauseCloppes = Math.floor(Math.random() * 100)
  // récupérer le token pour les tt les requêtes au serveur
  const token = localStorage.getItem("token");

  // loading de toutes les infos
  useEffect(() => {
    // fonction qui sert de "join" dans les requetes pour obtenir les noms des clients à partir des ids
    async function getNomClientLocal(idClient) {
      const rep = await fetch(`/api/clients/getClient/${idClient}`, {
        headers: { Authorization: `Bearer ${token} ` }
      })
      if (!rep.ok) { return "" }
      const data = await rep.json()
      return `${data.prenomClient} ${data.nomClient} `
    }
    // fonction pour obtenir l'id du client à partir de l'id du dossier, pour utiliser dans la fonction en haut et obtenir le nom
    async function getNomClientDepuisDossier(idDossier) {
      const rep = await fetch(`/api/comptes/getDossier/${idDossier}`, {
        headers: { Authorization: `Bearer ${token} ` }
      })
      if (!rep.ok) { return "" }
      const data = await rep.json()
      return await getNomClientLocal(data.idClient)
    }

    async function loadDemandesEnAttente() {
      const rep = await fetch(`/api/demandes/getDemandesOuvertes`, {
        headers: { Authorization: `Bearer ${token} ` }
      })
      if (!rep.ok) return
      // si retourne rien, set comme une liste vide, pas une erreur
      if (rep.status === 204) {
        setDemandesOuvertes([])
        return
      }
      const data = await rep.json()
      // fait un await pour ajouter les noms à chaque objet json dans demandesOuvertes
      const demandesAvecNom = await Promise.all(
        data.map(async (d) => ({
          ...d,
          nomClient: await getNomClientDepuisDossier(d.idDossier)
        }))
      )
      setDemandesOuvertes(demandesAvecNom)
    }

    async function loadInfosEmploye() {
      const rep = await fetch(`/api/employes/me`, {
        headers: { Authorization: `Bearer ${token} ` }
      })
      if (rep.ok) {
        const data = await rep.json()
        setInfosEmploye(data)
      }
    }

    async function loadComptesEnAttente() {
      const rep = await fetch(`/api/comptes/dossiersAttente`, {
        headers: { Authorization: `Bearer ${token} ` }
      })
      if (!rep.ok) return
      // si retourne rien, set comme une liste vide, pas une erreur
      if (rep.status === 204) {
        setComptesEnAttente([])
        return
      }
      const data = await rep.json()
      // await pour ajouter les nom des clients à chaque objet json dans comptesEnAttente
      const comptesAvecNom = await Promise.all(
        data.map(async (a) => ({
          ...a,
          nomClient: await getNomClientLocal(a.idClient)
        }))
      )
      setComptesEnAttente(comptesAvecNom)
    }

    async function loadFacturesAFaire() {
      const rep = await fetch(`/api/facturation/facturesAFaire`, {
        headers: { Authorization: `Bearer ${token} ` }
      })
      if (rep.ok) {
        // si retourne rien, set comme une liste vide, pas une erreur
        if (rep.status === 204) {
          setFacturesAFaire([])
          return
        }
        const data = await rep.json()
        setFacturesAFaire(data)
      }
    }

    async function loadHistorique() {
      const rep = await fetch(`/api/historique/historique`, {
        headers: { Authorization: `Bearer ${token} ` }
      })
      if (rep.ok) {
        const data = await rep.json()
        // prends seulement les 20 dernières actions de l'historique, pour pas overfill le tab historique
        setHistorique(data.slice(0, 20))
      }
    }

    loadDemandesEnAttente()
    loadInfosEmploye()
    loadComptesEnAttente()
    loadFacturesAFaire()
    loadHistorique()
  }, [token])

  return (<>
    {infosEmploye != null &&
      <section className="section">
        <div className="container is-fluid">
          <div className="level mb-5">
            <div className="level-left">
              <div>
                <h1 className="title is-4 mb-1">Bonjour, {infosEmploye.prenomEmploye + " " + infosEmploye.nomEmploye}</h1>
              </div>
            </div>
          </div>

          {/* Cartes/bouttons du dashboard, peut etre changer pour juste avoir html direct?*/}
          {/* check si les 3 données sont vides, si non, return un icone pour chaque. PauseCloppes sera jamais vide puisque pas un fetch */}
          {demandesOuvertes != null && comptesEnAttente != null && facturesAFaire != null &&
            <div className="columns mb-5">
              <CardsDashboard label="Demandes ouvertes" value={demandesOuvertes.length} color="is-info" />
              <CardsDashboard label="Comptes en attente" value={comptesEnAttente.length} color="is-warning" />
              <CardsDashboard label="Factures à venir" value={facturesAFaire.length} color="is-danger" />
              <CardsDashboard label="Pauses cloppes cette semaine" value={pauseCloppes} color="is-success" />
            </div>
          }

          {/* Accès rapides */}
          <div className="box mb-5">
            <p className="title is-6 mb-1">Accès rapides</p>
            <div className="columns is-mobile is-multiline">
              {/* si employé logged in est un emp regulier */}
              {infosEmploye.roleEmploye === "commis" ? (
                <>
                  <BouttonDashboard link="/clients/nouveau" couleur="is-info" texte="Créer client" />
                  <BouttonDashboard link="/creerCompte" couleur="is-primary" texte="Créer compte" />
                  <BouttonDashboard link="/GestionCompte" couleur="is-link" texte="Gestion des Comptes" />
                </>
              ) : (
                <>
                  {/* BOUTTONS POUR ADMIN + SUPPERVISEUR */}
                </>
              )}
            </div>
          </div>

          {/* Onglets : Demandes / Comptes / Activité */}
          <div className="box">
            <div className="tabs is-boxed mb-4">
              <ul>
                <li className={activeTab === "demandes" ? "is-active" : ""}>
                  <a onClick={() => setActiveTab("demandes")}>Demandes ouvertes</a>
                </li>
                <li className={activeTab === "comptes" ? "is-active" : ""}>
                  <a onClick={() => setActiveTab("comptes")}>Comptes en attente</a>
                </li>
                <li className={activeTab === "activite" ? "is-active" : ""}>
                  <a onClick={() => setActiveTab("activite")}>Activité récente</a>
                </li>
              </ul>
            </div>

            {/* Tab Demandes ouvertes */}
            {activeTab === "demandes" && demandesOuvertes !== null && (
              // Conditionnal rendering: check si le length des demandes ouvertes est 0à
              // si oui, msg qu'il y en a 0
              // sinon, render le tableau 
              demandesOuvertes.length !== 0 ? (
                <table className="table is-fullwidth is-hoverable is-striped">
                  <thead>
                    <tr>
                      <th>N° Demande</th>
                      <th>Client</th>
                      <th>Type</th>
                      <th>Date</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {demandesOuvertes.map((d) => (
                      <tr key={d.id}>
                        <td><span className="tag is-light">{d.idDemande}</span></td>
                        <td>{d.nomClient}</td>
                        <td>{d.typeDemande}</td>
                        <td className="has-text-grey is-size-7">{d.created_at}</td>
                        <td><Link to={`/comptes/${d.idDossier}/demandes`}><button className="button is-small is-primary is-outlined">Voir</button></Link></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                // si aucune demandes ouvertes, pour pas avoir un tableau vide
              ) : (
                <h1 className="title is-4">Aucune demandes ouvertes</h1>
              )
            )}

            {/* check pour s'assurer que les trucs sont loadés pour pas crash */}
            {activeTab === "comptes" && comptesEnAttente != null && (
              // check IF pour s'assurer qu'il y a des comptes en attente
              comptesEnAttente.length !== 0 ? (
                <table className="table is-fullwidth is-hoverable" style={{ tableLayout: "fixed" }}>
                  <thead>
                    <tr>
                      <th style={{ width: "150px" }}>N° du compte</th>
                      <th style={{ width: "180px" }}>Client</th>
                      <th style={{ width: "180px" }}>Type du compte</th>
                      <th style={{ width: "180px" }}>En attente depuis</th>
                    </tr>
                  </thead>
                  <tbody>
                    {comptesEnAttente.map((a) => {
                      return (
                        <tr key={a.idDossier} style={{ height: "55px" }}>
                          <td className="is-vcentered">CMPT-{String(a.idDossier).padStart(4, '0')}</td>
                          <td className="is-vcentered">{a.nomClient}</td>
                          <td className="is-vcentered">{a.typeDossier}</td>
                          <td className="is-vcentered">{a.updated_at}</td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
                // sinon affiche qu'il n'y en a pas
              ) : (
                <h1 className="title is-4">Aucun comptes en attente</h1>
              )
            )}

            {activeTab === "activite" && historique != null && (
              <table className="table is-fullwidth is-hoverable" style={{ tableLayout: "fixed" }}>
                <thead>
                  <tr>
                    <th style={{ width: "150px" }}>#Transaction</th>
                    <th style={{ width: "180px" }}>Action</th>
                    <th style={{ width: "150px" }}>Table</th>
                    <th style={{ width: "180px" }}>Id du dossier</th>
                    <th style={{ width: "180px" }}>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {historique.map((a) => {
                    return (
                      <tr key={a.idHistorique} style={{ height: "55px" }}>
                        <td className="is-vcentered">HIST-{String(a.idHistorique).padStart(5, '0')}</td>
                        <td className="is-vcentered">{a.actionEntree}</td>
                        <td className="is-vcentered">{a.table}</td>
                        <td className="is-vcentered">{a.idTransaction}</td>
                        <td className="is-vcentered">{a.created_at}</td>
                      </tr>
                    )
                  }
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </section >
    }
  </>
  );
}
