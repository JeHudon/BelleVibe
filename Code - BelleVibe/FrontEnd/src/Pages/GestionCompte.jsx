import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const STATUTS = ["Tous les statuts", "actif", "inactif", "en attente"];
const TYPES = ["Tous les services", "Personnel", "Entreprise", "Familial"];

function formatNumeroCompte(idDossier, created_at) {
  const year = new Date(created_at).getFullYear();
  return `NW-${year}-${String(idDossier).padStart(6, "0")}`;
}

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString("fr-CA", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function BadgeStatut({ statut }) {
  const statutLower = statut.toLowerCase()
  if (statutLower === "actif")  return <span className="tag is-dark">Actif</span>;
  if (statutLower === "inactif")
    return <span className="tag is-light">Inactif</span>;
  if (statutLower === "en attente") return <span className="tag">En attente</span>;
  return <span className="tag">{statut}</span>;
}

export default function GestionCompte() {
  const [dossiers, setDossiers] = useState([]);
  const [clients, setClients] = useState([]);
  const [recherche, setRecherche] = useState("");
  const [filtreStatut, setFiltreStatut] = useState("Tous les statuts");
  const [filtreType, setFiltreType] = useState("Tous les services");
  const [chargement, setChargement] = useState(true);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    async function fetchData() {
      setChargement(true);
      const [dossiersRes, clientsRes] = await Promise.all([
        fetch("/api/comptes/getDossiers", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch("/api/clients/getClients", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);
      const [dossiersData, clientsData] = await Promise.all([
        dossiersRes.json(),
        clientsRes.json(),
      ]);
      setDossiers(Array.isArray(dossiersData) ? dossiersData : []);
      setClients(Array.isArray(clientsData) ? clientsData : []);
      setChargement(false);
    }
    fetchData();
  }, []);

  function nomClient(idClient) {
    const c = clients.find((cl) => cl.idClient === idClient);
    return c ? `${c.prenomClient} ${c.nomClient}` : `Client #${idClient}`;
  }

  const dossiersFiltres = dossiers.filter((d) => {
    const numero = formatNumeroCompte(d.idDossier, d.created_at).toLowerCase();
    const nom = nomClient(d.idClient).toLowerCase();
    const q = recherche.toLowerCase();
    const matchRecherche = !q || numero.includes(q) || nom.includes(q);
    const matchStatut =
      filtreStatut === "Tous les statuts" || d.statutDossier === filtreStatut;
    const matchType =
      filtreType === "Tous les services" || d.typeDossier === filtreType;
    return matchRecherche && matchStatut && matchType;
  });

  return (
    <div className="section">
      <div className="container">
        <h1 className="title">Gestion du compte</h1>
        <p className="subtitle is-6 has-text-link">
          Liste de tous les comptes clients
        </p>

        <div className="box " style={{ border: "1px solid #d6d6d6" }}>
          <div className="level mb-4">
            <div className="level-left">
              <div>
                <p className="title is-5 mb-1">
                  Comptes ({dossiersFiltres.length})
                </p>
                <p className="subtitle is-6 has-text-grey">
                  Recherchez et gérez les comptes
                </p>
              </div>
            </div>
            <div className="level-right">
              <Link to="/creerCompte" className="button is-dark">
                + Créer compte
              </Link>
            </div>
          </div>

          <div
            className="is-flex is-align-items-center mb-4"
            style={{ gap: "0.75rem", flexWrap: "wrap" }}
          >
            <div
              className="control has-icons-left"
              style={{ flex: 1, minWidth: "250px" }}
            >
              <input
                className="input"
                type="text"
                placeholder="Rechercher par numéro, nom du client..."
                value={recherche}
                onChange={(e) => setRecherche(e.target.value)}
              />
              <span className="icon is-left">
                <i className="fas fa-search" />
              </span>
            </div>

            <div className="select">
              <select
                value={filtreStatut}
                onChange={(e) => setFiltreStatut(e.target.value)}
              >
                {STATUTS.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </div>

            <div className="select">
              <select
                value={filtreType}
                onChange={(e) => setFiltreType(e.target.value)}
              >
                {TYPES.map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </div>
          </div>

          <table
            className="table is-fullwidth is-hoverable"
            style={{ tableLayout: "fixed" }}
          >
            <thead>
              <tr>
                <th style={{ width: "160px" }}>#Compte</th>
                <th style={{ width: "180px" }}>Client</th>
                <th style={{ width: "120px" }}>Services</th>
                <th style={{ width: "120px" }}>Statut</th>
                <th style={{ width: "100px" }}>Solde</th>
                <th style={{ width: "180px" }}>Dernière activité</th>
              </tr>
            </thead>
            <tbody>
              {chargement ? (
                <tr>
                  <td colSpan="6" className="has-text-centered py-4">
                    Chargement...
                  </td>
                </tr>
              ) : dossiersFiltres.length === 0 ? (
                <tr>
                  <td colSpan="6" className="has-text-centered py-4">
                    Aucun compte trouvé.
                  </td>
                </tr>
              ) : (
                dossiersFiltres.map((d) => (
                  <tr key={d.idDossier} style={{ height: "55px", cursor: "pointer" }} onClick={() => navigate(`/comptes/${d.idDossier}/resume`)}>
                    <td className="is-vcentered">
                      <span className="has-text-weight-semibold">
                        {formatNumeroCompte(d.idDossier, d.created_at)}
                      </span>
                    </td>
                    <td className="is-vcentered">
                      <span
                        className="has-text-link"
                        style={{ cursor: "pointer" }}
                        onClick={(e) => { e.stopPropagation(); navigate(`/clients/${d.idClient}/resume`); }}
                      >
                        {nomClient(d.idClient)}
                      </span>
                    </td>
                    <td className="is-vcentered">
                      <span className="tag is-light">{d.typeDossier}</span>
                    </td>
                    <td className="is-vcentered">
                      <BadgeStatut statut={d.statutDossier} />
                    </td>
                    <td className="is-vcentered">
                      <span
                        className={
                          d.soldeDossier < 0
                            ? "has-text-danger"
                            : "has-text-success"
                        }
                      >
                        {Number(d.soldeDossier).toFixed(2)} $
                      </span>
                    </td>
                    <td className="is-vcentered has-text-grey">
                      {formatDate(d.updated_at || d.created_at)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
