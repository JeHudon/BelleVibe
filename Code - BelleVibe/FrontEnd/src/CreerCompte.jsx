import { Fragment, useEffect, useState } from "react"

export function CreerCompte() {
    const [etape, setEtape] = useState(1);
    const [clients, setClients] = useState([]);
    const [services, setServices] = useState([]);
    const [forfaits, setForfaits] = useState([]);
    const [clientSelection, setClientSelection] = useState(null);
    const [servicesSelection, setServicesSelection] = useState([]);
    const [typeServicesSelection, setTypeServicesSelection] = useState([]);
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

    function selectionForfaits(idForfait, prixForfait) {

    }

    function affichageForfaits() {
        if (typeServicesSelection.includes("TV")) {
            return (
                <div className="subtitle is-4 mt-2">
                    Forfaits TV
                    {forfaits.filter(forfait => forfait.typeService === "TV").map((forfait) => (
                        <div key={forfait.idForfait}
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
                            <div className="subtitle is-5 mb-0">{client.prenomClient} {client.nomClient}</div>
                            <div className="subtitle is-6 mb-0">{client.telephoneClient} - {client.courrielClient}</div>
                        </div>
                    ))}
                </div>
            )
        }
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
                            <div className="subtitle is-5 mb-0">{client.prenomClient} {client.nomClient}</div>
                            <div className="subtitle is-6 mb-0">{client.telephoneClient} - {client.courrielClient}</div>
                        </div>
                    ))}
                </div>
            )
        } else if (etape == 2) {
            return (
                <div className="mt-2">
                    <h3 className="title is-4">Choisir les services</h3>
                    <div className="subtitle is-5 mt-2">Sélectionner un ou plusieurs services</div>
                    <div className="columns is-multiline">
                        {services.map((service) => (
                            <div key={service.idService} className="column is-narrow">
                                <div
                                    className="box"
                                    onClick={() => selectionService(service.idService, service.typeService)}
                                    style={{
                                        cursor: "pointer",
                                        transition: "all 0.2s ease",
                                        ...(servicesSelection.includes(service.idService) && {
                                            backgroundColor: "#62cf5fff",
                                            boxShadow: "inset 0 2px 4px rgba(0,0,0,0.2)"
                                        })
                                    }}>
                                    <div className="subtitle is-5 mb-0">{service.typeService}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )
        } else if (etape == 3) {
            return (
                <div className="mt-2">
                    <h3 className="title is-4">Sélection des forfaits</h3>
                    <div className="subtitle is-5 mt-2">Sélectionner un ou plusieurs forfaits</div>
                    {affichageForfaits()}
                </div>
            )
        }
    }

    function boutonSuivant() {
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
                <div className="box">
                    {affichageSelonEtape(etape)}
                </div>
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
            <div className="notification is-danger" style={{
                position: "fixed",
                bottom: "1.5rem",
                right: "1.5rem",
                zIndex: 1000,
                minWidth: "20rem",
                boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
                opacity: afficherErreur ? 1 : 0,
                transition: "opacity 0.5s ease",
                pointerEvents: afficherErreur ? "auto" : "none",
            }}>
                <button className="delete" onClick={() => setAfficherErreur(false)}></button>
                <p className="has-text-centered">{messageErreur}</p>
            </div>
        </div>
    )
} 