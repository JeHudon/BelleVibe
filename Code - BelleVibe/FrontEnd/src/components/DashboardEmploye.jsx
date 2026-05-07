import { useState } from "react";


export default function DashboardEmploye() {
    const [activeTab, setActiveTab] = useState("demandes");
    
    const demandesOuvertes = [
        { id: "NW-2024-0045", client: "Sophie Gagnon", type: "Technique", date: "Aujourd'hui, 09h14", statut: "En cours" },
        { id: "NW-2024-0044", client: "Martin Tremblay", type: "Facturation", date: "Hier, 14h30", statut: "En attente" },
    ];

    const comptesEnAttente = [
        { id: "NW-2024-001234", client: "Julie Leblanc", raison: "Document manquant", date: "Il y a 2 jours" },
        { id: "NW-2024-001235", client: "Kevin Nguyen", raison: "Vérification identité", date: "Il y a 3 jours" },
    ];

    const tachesEnAttente = [
        { id: 1, titre: "Demande technique", detail: "Compte NW-2024-001234", urgence: "warning" },
        { id: 2, titre: "Document manquant", detail: "Julie Leblanc", urgence: "danger" },
        { id: 3, titre: "Approbation compte", detail: "Kevin Nguyen", urgence: "info" },
    ];

    const activitesRecentes = [
        { id: 1, action: "Client créé", detail: "Sophie Gagnon", temps: "Il y a 2 heures", couleur: "is-success" },
        { id: 2, action: "Demande mise à jour", detail: "NW-2024-001234", temps: "Il y a 3 heures", couleur: "is-info" },
        { id: 3, action: "Note ajoutée", detail: "Martin Tremblay", temps: "Il y a 5 heures", couleur: "is-warning" },
        { id: 4, action: "Compte approuvé", detail: "NW-2024-001198", temps: "Hier, 16h45", couleur: "is-primary" },
        { id: 5, action: "Document reçu", detail: "Aline Fortin", temps: "Hier, 11h00", couleur: "is-link" },
    ];

    const accesRapides = [
        { label: "Créer client", desc: "Nouveau client", icone: "", color: "is-info is-light", href: "#" },
        { label: "Créer compte", desc: "Nouveau compte", icone: "", color: "is-primary is-light", href: "#" },
        { label: "Ajouter note", desc: "Note au dossier", icone: "", color: "is-warning is-light", href: "#" },
        { label: "Gestion comptes", desc: "Voir les comptes", icone: "", color: "is-success is-light", href: "#" },
        { label: "Rechercher", desc: "Client / dossier", icone: "", color: "is-link is-light", href: "#" },
    ];

    function StatCard({ label, value, color, icone }) {
        return (
            <div className="column">
                <div className={`notification ${color} is-light`}>
                    <div className="level is-mobile">
                        <div className="level-left">
                            <div>
                                <p className="heading">{label}</p>
                                <p className="title">{value}</p>
                            </div>
                        </div>
                        <div className="level-right">
                            <span style={{ fontSize: "2rem" }}>{icone}</span>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (<>
        <section className="section">
            <div className="container is-fluid">

                {/* En-tête */}
                <div className="level mb-5">
                    <div className="level-left">
                        <div>
                            <h1 className="title is-4 mb-1">Bonjour ${ }</h1>
                        </div>
                    </div>
                </div>

                {/* KPI Cards */}
                <div className="columns mb-5">
                    <StatCard label="Demandes ouvertes" value="2" color="is-info" icone="" />
                    <StatCard label="Comptes en attente" value="1" color="is-warning" icone="" />
                    <StatCard label="Tâches en attente" value="3" color="is-danger" icone="" />
                    <StatCard label="Documents à valider" value="3" color="is-success" icone="" />
                </div>

                {/* Accès rapides */}
                <div className="box mb-5">
                    <p className="title is-6 mb-1">Accès rapides</p>
                    <p className="subtitle is-7 has-text-grey mb-4">Accédez rapidement aux tâches courantes</p>
                    <div className="columns is-mobile is-multiline">
                        {accesRapides.map((btn) => (
                            <div key={btn.label} className="column is-one-fifth-desktop is-half-mobile">
                                <a href={btn.href} className={`button is-fullwidth ${btn.color} is-flex is-flex-direction-column`} style={{ height: "80px", gap: "4px" }}>
                                    <span style={{ fontSize: "1.4rem" }}>{btn.icone}</span>
                                    <span className="is-size-7 has-text-weight-semibold">{btn.label}</span>
                                    <span className="is-size-7 has-text-grey">{btn.desc}</span>
                                </a>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Tâches en attente (highlight) */}
                <div className="box mb-5">
                    <p className="title is-6 mb-1">Tâches en attente</p>
                    <p className="subtitle is-7 has-text-grey mb-4">Éléments nécessitant votre attention</p>
                    <div className="columns is-multiline">
                        {tachesEnAttente.map((t) => (
                            <div key={t.id} className="column is-one-third">
                                <div className={`message is-${t.urgence}`}>
                                    <div className="message-body">
                                        <div className="level is-mobile">
                                            <div className="level-left">
                                                <div>
                                                    <p className="has-text-weight-semibold is-size-7">{t.icone} {t.titre}</p>
                                                    <p className="is-size-7 has-text-grey">{t.detail}</p>
                                                </div>
                                            </div>
                                            <div className="level-right">
                                                <button className={`button is-${t.urgence} is-small is-outlined`}>Voir</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
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

                    {activeTab === "comptes" && (
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
                    )}

                    {activeTab === "activite" && (
                        <div>
                            {activitesRecentes.map((a) => (
                                <div key={a.id} className="is-flex is-align-items-center mb-3 pb-3" style={{ borderBottom: "1px solid #f0f0f0" }}>
                                    <span className={`tag ${a.couleur} is-light mr-3`} style={{ minWidth: "8px", minHeight: "8px", borderRadius: "50%", padding: 0, width: "10px", height: "10px" }}></span>
                                    <div className="is-flex-grow-1">
                                        <p className="is-size-7 has-text-weight-semibold mb-0">{a.action}</p>
                                        <p className="is-size-7 has-text-grey">{a.detail}</p>
                                    </div>
                                    <span className="is-size-7 has-text-grey-light">{a.temps}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

            </div>
        </section>
    </>
    );
}
