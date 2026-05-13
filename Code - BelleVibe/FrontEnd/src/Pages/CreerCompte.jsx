import { Fragment, useEffect, useState } from "react"
import { ForfaitCard } from "../components/ForfaitCard";

export function CreerCompte() {
    const [etape, setEtape] = useState(1);
    const [clients, setClients] = useState([]);
    const [typeCompte, setTypeCompte] = useState("");
    const [services, setServices] = useState([]);
    const [forfaits, setForfaits] = useState([]);
    const [clientSelection, setClientSelection] = useState(null);
    const [servicesSelection, setServicesSelection] = useState([]);
    const [typeServicesSelection, setTypeServicesSelection] = useState([]);
    const [forfaitsSelection, setForfaitsSelection] = useState([]);
    const [afficherSucces, setAfficherSucces] = useState(false);
    const [afficherErreur, setAfficherErreur] = useState(false);
    const [messageErreur, setMessageErreur] = useState("");
    const labels = ["Client", "Services", "Forfaits", "Confirmer"];

    useEffect(() => {
        async function recupererClients() {
            try {
                const token = localStorage.getItem("token")

                const response = await fetch("/api/clients/getClients", {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Accept": "application/json"
                    }
                })

                if (!response.ok) {
                    setAfficherErreur(true)
                    setMessageErreur("Erreur en récupèrant les clients");
                    return;
                }

                const clients = await response.json();
                setClients(clients)

            } catch (err) {
                setAfficherErreur(true)
                setMessageErreur("Erreur serveur", err)
            }
        }
        async function recupererService() {
            try {
                const token = localStorage.getItem("token")

                const response = await fetch("/api/services/", {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Accept": "application/json"
                    }
                })

                if (!response.ok) {
                    setAfficherErreur(true)
                    setMessageErreur("Erreur en récupèrant les services")
                }

                const services = await response.json()
                setServices(services)

            } catch (err) {
                setAfficherErreur(true)
                setMessageErreur("Erreur serveur", err)
            }
        }
        async function recupererForfaits() {
            try {
                const token = localStorage.getItem("token")

                const response = await fetch("/api/forfaits/", {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Accept": "application/json"
                    }
                })

                if (!response.ok) {
                    setAfficherErreur(true)
                    setMessageErreur("Erreur en récupèrant les forfaits")
                }

                const forfaits = await response.json()
                setForfaits(forfaits)

            } catch (err) {
                setAfficherErreur(true)
                setMessageErreur("Erreur serveur", err)
            }
        }
        recupererClients();
        recupererService();
        recupererForfaits();
    }, [])

    function selectionClient(idClient) {
        setClientSelection(idClient)
    }

    function selectionService(idService, typeService) {
        if (servicesSelection.includes(idService)) {
            setServicesSelection(servicesSelection.filter(id => id !== idService))
            setTypeServicesSelection(typeServicesSelection.filter(type => type !== typeService))
        } else {
            setServicesSelection([...servicesSelection, idService])
            setTypeServicesSelection([...typeServicesSelection, typeService])
        }
    }

    function selectionForfaits(idForfait, typeService) {

        const service = services.find(s => s.typeService === typeService);

        const forfaitMemeCat = forfaits.find(f =>
            forfaitsSelection.includes(f.idForfait) && f.idService === service.idService
        );

        if (forfaitsSelection.includes(idForfait)) {
            setForfaitsSelection(forfaitsSelection.filter(id => id !== idForfait))
        } else if (forfaitMemeCat) {
            setForfaitsSelection(forfaitsSelection.filter(id => id !== forfaitMemeCat.idForfait).concat(idForfait))
        } else {
            setForfaitsSelection([...forfaitsSelection, idForfait])
        }
    }

    function affichageForfaits() {
        const sections = [
            { type: "TV", label: "Forfaits TV" },
            { type: "Wi-fi", label: "Forfaits Wi-Fi" },
            { type: "Cellulaire", label: "Forfaits Cellulaire" },
        ];

        return (
            <div>
                {sections.map(({ type, label }) =>
                    typeServicesSelection.includes(type) && (
                        <div key={type}>
                            <div className="title is-5 mt-4 mb-4">{label}</div>
                            {forfaits.filter(f => f.typeService === type).map((forfait) => (
                                <ForfaitCard
                                    key={forfait.idForfait}
                                    forfait={forfait}
                                    isSelected={forfaitsSelection.includes(forfait.idForfait)}
                                    onClick={() => selectionForfaits(forfait.idForfait, type)}
                                />
                            ))}
                        </div>
                    )
                )}
            </div>
        );
    }


    function affichageSelonEtape(etape) {
        if (etape == 1) {
            return (
                <div className="mt-2">
                    <h3 className="title is-4">Sélectionner un client</h3>
                    <div className="subtitle is-5 mt-2">Choisissez le client pour ce nouveau compte</div>
                    {clients.map((client) => (
                        <div key={client.idClient}
                            className="button is-light"
                            onClick={() => selectionClient(client.idClient)}
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                width: "100%",
                                height: "auto",
                                marginBottom: "0.5rem",
                                alignItems: "flex-start",
                                textAlign: "left",
                                transition: "all 0.2s ease",
                                ...(clientSelection === client.idClient && {
                                    backgroundColor: "#62cf5fff",
                                    boxShadow: "inset 0 2px 4px rgba(0,0,0,0.2)"
                                })
                            }}>
                            <div className="subtitle is-5 mb-0 has-text-weight-bold">{client.prenomClient} {client.nomClient}</div>
                            <div className="subtitle is-6 mb-0">{client.telephoneClient} - {client.courrielClient}</div>
                        </div>
                    ))}
                </div>
            )
        } else if (etape == 2) {
            return (
                <div className="mt-2">
                    <h3 className="title is-4">Choisir le type de compte</h3>
                    <div className="subtitle is-5 mt-2">Sélectionner de quel genre de compte il s'agit</div>
                    <div className="is-flex" style={{ gap: "1rem", marginBottom: "2rem" }}>
                        {["Personnel", "Entreprise", "Familial"].map((type) => (
                            <label
                                key={type}
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "0.5rem",
                                    padding: "0.75rem 1.25rem",
                                    borderRadius: "8px",
                                    border: `2px solid ${typeCompte === type ? "#62cf5fff" : "#dbdbdb"}`,
                                    backgroundColor: typeCompte === type ? "#62cf5fff" : "white",
                                    boxShadow: typeCompte === type ? "inset 0 2px 4px rgba(0,0,0,0.2)" : "none",
                                    cursor: "pointer",
                                    transition: "all 0.2s ease",
                                    fontWeight: "bold",
                                }}
                            >
                                <input
                                    type="radio"
                                    name="choix"
                                    value={type}
                                    checked={typeCompte === type}
                                    onChange={(e) => setTypeCompte(e.target.value)}
                                    style={{ display: "none" }}
                                />
                                {type}
                            </label>
                        ))}
                    </div>

                    <h3 className="title is-4">Choisir les services</h3>
                    <div className="subtitle is-5 mt-2">Sélectionner un ou plusieurs services</div>
                    <div className="is-flex" style={{ gap: "1rem", flexWrap: "wrap" }}>
                        {services.map((service) => (
                            <div
                                key={service.idService}
                                onClick={() => selectionService(service.idService, service.typeService)}
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    padding: "0.75rem 1.25rem",
                                    borderRadius: "8px",
                                    border: `2px solid ${servicesSelection.includes(service.idService) ? "#62cf5fff" : "#dbdbdb"}`,
                                    backgroundColor: servicesSelection.includes(service.idService) ? "#62cf5fff" : "white",
                                    boxShadow: servicesSelection.includes(service.idService) ? "inset 0 2px 4px rgba(0,0,0,0.2)" : "none",
                                    cursor: "pointer",
                                    transition: "all 0.2s ease",
                                    fontWeight: "bold",
                                }}
                            >
                                {service.typeService}
                            </div>
                        ))}
                    </div>
                </div>
            )
        } else if (etape == 3) {
            return (
                <div className="mt-2">
                    <h3 className="title is-4">Sélection des forfaits</h3>
                    <div className="subtitle is-5 mt-2">Sélectionner un forfait pour chaque service</div>
                    {affichageForfaits()}
                </div>
            )
        } else if (etape == 4) {
            const client = clients.find(c => c.idClient === clientSelection);
            return (
                <div className="mt-2">
                    <h3 className="title is-4">Résumé et confirmation</h3>
                    <div className="subtitle is-5 mt-2">Confirmer les informations sélectionnées</div>
                    <div className="box">
                        <div className="title is-4 mb-2">Client sélectionné</div>
                        <div className="subtitle is-5">{client.prenomClient} {client.nomClient} - {client.telephoneClient}</div>
                    </div>
                    <div className="box">
                        <div className="title is-4 mb-2">Type de compte sélectionné</div>
                        <div className="subtitle is-5">{typeCompte}</div>
                    </div>
                    <div className="box">
                        <div className="title is-4 mb-3">Services et forfaits sélectionnés</div>
                        {services
                            .filter(s => servicesSelection.includes(s.idService))
                            .map(service => {
                                const forfait = forfaits.find(f =>
                                    forfaitsSelection.includes(f.idForfait) && f.idService === service.idService
                                );
                                return (
                                    <div key={service.idService} className="mb-4">
                                        {forfait ? (
                                            <ForfaitCard
                                                key={forfait.idForfait}
                                                forfait={forfait}
                                            />
                                        ) : (
                                            <div className="has-text-danger">Aucun forfait sélectionné</div>
                                        )}
                                    </div>
                                );
                            })
                        }
                        <div className="is-flex is-justify-content-flex-end">
                            <div className="has-text-weight-bold is-size-5">
                                Total : {forfaits
                                    .filter(f => forfaitsSelection.includes(f.idForfait))
                                    .reduce((acc, f) => acc + f.prixForfait, 0)
                                    .toFixed(2)
                                }$/mois
                            </div>
                        </div>
                    </div>
                </div>
            )
        }
    }

    function boutonSuivant() {
        setAfficherErreur(false)
        if (etape == 1) {
            if (!clientSelection) {
                setAfficherErreur(true)
                setTimeout(() => setAfficherErreur(false), 6000);
                setMessageErreur("Veuillez sélectionner un client")
            } else {
                setEtape(etape + 1)
                return
            }
        } else if (etape == 2) {
            if (servicesSelection.length === 0) {
                setAfficherErreur(true)
                setTimeout(() => setAfficherErreur(false), 6000);
                setMessageErreur("Veuillez sélectionner un service")
            } else {
                setEtape(etape + 1)
                return
            }
        } else if (etape == 3) {
            const tousLesForfaitsChoisis = typeServicesSelection.every(type => {
                const service = services.find(s => s.typeService === type);
                return forfaits.some(f =>
                    f.idService === service.idService && forfaitsSelection.includes(f.idForfait)
                );
            });

            if (!tousLesForfaitsChoisis) {
                setAfficherErreur(true)
                setTimeout(() => setAfficherErreur(false), 6000);
                setMessageErreur("Veuillez sélectionner un forfait par service")
            } else {
                setEtape(etape + 1)
                return
            }
        }

    }

    async function requeteCreerCompte() {
        const token = localStorage.getItem("token")
        const total = forfaits
            .filter(f => forfaitsSelection.includes(f.idForfait))
            .reduce((acc, f) => acc + f.prixForfait, 0)

        setAfficherErreur(false)

        try {
            const response = await fetch(`/api/comptes/creerDossier`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    idClient: clientSelection,
                    typeDossier: typeCompte,
                    statutDossier: "actif",
                    soldeDossier: total
                })
            })

            if (!response.ok) {
                setAfficherErreur(true)
                setMessageErreur("Erreur en créant le nouveau compte")
                return
            }

            const data = await response.json()

            const forfaitResults = await Promise.all(forfaitsSelection.map(async (forfait) => {
                const r = await fetch(`/api/forfaitsDossier/`, {
                    method: "POST",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Accept": "application/json",
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        idDossier: data.idDossier,
                        idForfait: forfait
                    })
                })
                return r.ok
            }))

            if (forfaitResults.some(ok => !ok)) {
                setAfficherErreur(true)
                setMessageErreur("Erreur en associant les forfaits au dossier")
                return
            }

            setAfficherSucces(true)
            setTimeout(() => (setAfficherSucces(false), window.location.replace("/dashboard")), 2200)

        } catch (err) {
            setAfficherErreur(true)
            setMessageErreur("Erreur serveur : " + err.message)
        }
    }





    return (
        <div className="section">
            <div className="container is-centered mt-3">
                <h1 className="title">Créer un nouveau compte</h1>
                <h2 className="subtitle is-5 is-spaced">Assistant de création du compte</h2>
                <div className="columns is-centered">
                    <div className="columns is-centered mt-2 mb-2">
                        {[1, 2, 3, 4].map((n) => (
                            <Fragment key={n}>
                                <div key={n} className="column is-narrow is-flex is-flex-direction-column is-align-items-center">
                                    <div className={`is-flex is-justify-content-center is-align-items-center has-text-weight-bold mx-4 ${n === etape ? "has-background-link has-text-white" : "has-background-grey-light"}`} style={{
                                        width: "4.5rem",
                                        height: "4.5rem",
                                        borderRadius: "50%",
                                    }}>
                                        {n}
                                    </div>
                                    <span className={`mt-2 is-size-6 has-text-weight-bold ${n === etape ? "has-text-link" : "has-text-grey"}`}>
                                        {labels[n - 1]}
                                    </span>
                                </div>
                                {n < 4 && (
                                    <div className="is-flex is-align-items-center" style={{ marginBottom: "1.5rem" }}>
                                        <div className="has-background-grey-light" style={{ width: "5rem", height: "2px" }}></div>
                                    </div>
                                )}
                            </Fragment>
                        ))}
                    </div>
                </div>
                <div className="box" style={{ border: "1px solid #d6d6d6" }}>
                    {afficherErreur && (
                        <div className="notification is-danger">
                            {messageErreur}
                        </div>
                    )}
                    {afficherSucces && (
                        <div className="notification is-success">
                            Compte créé avec succès
                        </div>
                    )}
                    {affichageSelonEtape(etape)}
                </div>
                <div className="is-flex is-justify-content-space-between mt-4">
                    <div>
                        <button
                            className="button is-light mr-4"
                            disabled={etape === 1}
                            onClick={() => setEtape(etape - 1)}
                        >Précédent</button>
                        <button
                            className="button is-dark"
                            disabled={etape === 4}
                            onClick={() => boutonSuivant()}
                        >Suivant</button>
                    </div>
                    {etape === 4 && (
                        <button className="button is-dark" onClick={() => requeteCreerCompte()}>Confirmer</button>
                    )}
                </div>
            </div>
        </div>
    )
}