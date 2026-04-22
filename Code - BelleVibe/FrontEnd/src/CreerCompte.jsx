import { useEffect, useState } from "react"

export function CreerCompte() {
    const [etape, setEtape] = useState(1);
    const [clients, setClients] = useState([])
    const [error, setError] = useState("");
    const [clientSelection, setClientSelection] = useState(null);

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
                    setError("Erreur en récupèrant les clients");
                    return;
                }

                const clients = await response.json();
                console.log(clients)
                setClients(clients)

            } catch (err) {
                setError("Erreur réseau", err)
            }
        }
        recupererClients();
    }, [])

    function selectionClient(idClient) {
        setClientSelection(idClient)
    }


    function affichageSelonEtape(etape) {
        if (etape == 1) {
            return (
                <div className="mt-2">
                    <div className="title is-4">Sélectionner un client</div>
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
                                    backgroundColor: "#e2e2e2ff",
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
        if (etape == 2) {
            return (
                <div className="mt-2">
                    <div className="title is-4">Choisir les services</div>
                    <div className="subtitle is-5 mt-2">Choisissez le client pour ce nouveau compte</div>
                    {clients.map((client) => (
                        <div key={client.idClient} className="button is-light" style={{ display: "flex", flexDirection: "column", width: "100%", height: "auto", marginBottom: "0.5rem", alignItems: "flex-start", textAlign: "left" }}>
                            <div className="subtitle is-5 mb-0">{client.prenomClient} {client.nomClient}</div>
                            <div className="subtitle is-6 mb-0">{client.telephoneClient} - {client.courrielClient}</div>
                        </div>
                    ))}
                </div>
            )
        }
    }

    return (
        <div className="container is-centered mt-3">
            <div className="title">Créer un nouveau compte</div>
            <div className="subtitle">Assistant de création du compte</div>
            <div className="box">
                {affichageSelonEtape(etape)}
            </div>
            <button className="button is-dark" onClick={() => { setEtape(etape + 1) }}>Suivant</button>
        </div>
    )
} 