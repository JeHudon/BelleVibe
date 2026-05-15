import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import CardsDashboard from "../components/CardsDashboard";


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
    // demandes en attentes
    async function loadDemandesEnAttente() {
      const rep = await fetch(`/api/demandes/getDemandesOuvertes`, { headers: { Authorization: `Bearer ${token}` } })
      if (rep.ok) {
        if (rep.status == 204) {
          setDemandesOuvertes([])
          return
        }
        const data = await rep.json()
        setDemandesOuvertes(data)
      }
    }
    // infos de l'employé
    async function loadInfosEmploye() {
      const rep = await fetch(`/api/employes/me`, { headers: { Authorization: `Bearer ${token}` } })
      if (rep.ok) {
        const data = await rep.json()
        setInfosEmploye(data)
      }
    }
    // comptes en attente
    async function loadComptesEnAttente() {
      const rep = await fetch(`/api/comptes/dossiersAttente`, { headers: { Authorization: `Bearer ${token}` } })
      if (rep.ok) {
        if (rep.status == 204) {
          setComptesEnAttente([])
          return
        }
        const data = await rep.json()
        setComptesEnAttente(data)
      }
    }
    // Factures à faire
    async function loadFacturesAFaire() {
      const rep = await fetch(`/api/facturation/facturesAFaire`, { headers: { Authorization: `Bearer ${token}` } })
      if (rep.ok) {
        if (rep.status == 204) {
          setFacturesAFaire([])
          return
        }
        const data = await rep.json()
        setFacturesAFaire(data)
      }
    }
    async function loadHistorique() {
      const rep = await fetch("/api/historique/historique", { headers: { Authorization: `Bearer ${token}` } })
      if (rep.ok) {
        const data = await rep.json()
        // donne seulement les 20 dernies évenements dans l'historique, pour pas flood la page 
        setHistorique(data.splice(0, 20))
      }
    }

    loadDemandesEnAttente()
    loadInfosEmploye()
    loadComptesEnAttente()
    loadFacturesAFaire()
    loadHistorique()
  }, [token])

  // bs ai pour remplir les cases
  const tachesEnAttente = [
    { id: 1, titre: "Demande technique", detail: "Compte NW-2024-001234", urgence: "warning" },
    { id: 2, titre: "Document manquant", detail: "Julie Leblanc", urgence: "danger" },
    { id: 3, titre: "Approbation compte", detail: "Kevin Nguyen", urgence: "info" },
  ];

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
              <div className="column is-one-fifth-desktop is-half-mobile">
                <Link to={"/clients/nouveau"} className="is-info button is-fullwidth is-flex is-flex-direction-column">
                  <span className="is-size-9 has-text-weight-semibold">Créer client</span>
                </Link>
              </div>
              <div className="column is-one-fifth-desktop is-half-mobile">
                <Link to={"/creerCompte"} className="is-primary button is-fullwidth is-flex is-flex-direction-column">
                  <span className="is-size-9 has-text-weight-semibold">Créer compte</span>
                </Link>
              </div>
              <div className="column is-one-fifth-desktop is-half-mobile">
                {/* À MODIFIER AVEC LE BON LIEN */}
                <Link to={"/dashboard"} className="is-warning button is-fullwidth is-flex is-flex-direction-column">
                  <span className="is-size-9 has-text-weight-semibold">Ajouter note</span>
                </Link>
              </div>
              <div className="column is-one-fifth-desktop is-half-mobile">
                <Link to={"/GestionCompte"} className=" is-success button is-fullwidth is-flex is-flex-direction-column">
                  <span className="is-size-9 has-text-weight-semibold">Gestion Comptes</span>
                </Link>
              </div>
              <div className="column is-one-fifth-desktop is-half-mobile">
                {/* À MODIFIER AVEC LE BON LIEN */}
                <Link to={"/dashboard"} className="is-link button is-fullwidth is-flex is-flex-direction-column">
                  <span className="is-size-9 has-text-weight-semibold">Rechercher</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Onglets : Demandes / Comptes / Activité */}
          <div className="box">
            <div className="tabs is-boxed mb-4">
              <ul>
                <li className={activeTab === "demandes" ? "is-active" : ""}>
                  <a onClick={() => setActiveTab("demandes")}>
                    <span>Demandes ouvertes</span>
                    <span className="tag is-info is-light ml-2">2</span>
                  </a>
                </li>
                <li className={activeTab === "comptes" ? "is-active" : ""}>
                  <a onClick={() => setActiveTab("comptes")}>
                    <span>Comptes en attente</span>
                    <span className="tag is-warning is-light ml-2">2</span>
                  </a>
                </li>
                <li className={activeTab === "activite" ? "is-active" : ""}>
                  <a onClick={() => setActiveTab("activite")}>
                    <span>Activité récente</span>
                  </a>
                </li>
              </ul>
            </div>

            {activeTab === "demandes" && (
              <table className="table is-fullwidth is-hoverable is-striped">
                <thead>
                  <tr>
                    <th>N° Demande</th>
                    <th>Client</th>
                    <th>Type</th>
                    <th>Date</th>
                    <th>Statut</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {demandesOuvertes.map((d) => (
                    <tr key={d.id}>
                      <td><span className="tag is-light">{d.id}</span></td>
                      <td>{d.client}</td>
                      <td>{d.type}</td>
                      <td className="has-text-grey is-size-7">{d.date}</td>
                      <td>
                        <span className={`tag ${d.statut === "En cours" ? "is-info is-light" : "is-warning is-light"}`}>
                          {d.statut}
                        </span>
                      </td>
                      <td><button className="button is-small is-primary is-outlined">Voir</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {activeTab === "comptes" && comptesEnAttente != null && (
              <table className="table is-fullwidth is-hoverable" style={{ tableLayout: "fixed" }}>
                <thead>
                  <tr>
                    <th style={{ width: "150px" }}>N° du compte</th>
                    <th style={{ width: "180px" }}>Client</th>
                    <th style={{ width: "180px" }}>Durée d'attente</th>
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

            <table className="table is-fullwidth is-hoverable is-striped">
              <thead>
                <tr>
                  <th>N° Compte</th>
                  <th>Client</th>
                  <th>Raison</th>
                  <th>Depuis</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {comptesEnAttente.map((c) => (
                  <tr key={c.id}>
                    <td><span className="tag is-light">{c.id}</span></td>
                    <td>{c.client}</td>
                    <td><span className="tag is-warning is-light">{c.raison}</span></td>
                    <td className="has-text-grey is-size-7">{c.date}</td>
                    <td><button className="button is-small is-warning is-outlined">Traiter</button></td>
                  </tr>
                ))}
              </tbody>
            </table>

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
