import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { ForfaitCard } from "../components/ForfaitCard";

export function ModifierForfait() {
    const [afficherSucces, setAfficherSucces] = useState(false);
    const [afficherErreur, setAfficherErreur] = useState(false);
    const [messageErreur, setMessageErreur] = useState("");
    const [services, setServices] = useState([]);
    const [forfaits, setForfaits] = useState([]);
    const [forfaitsCompte, setForfaitsCompte] = useState([]);
    const [servicesSelection, setServicesSelection] = useState([]);
    const [typeServicesSelection, setTypeServicesSelection] = useState([]);
    const [forfaitsSelection, setForfaitsSelection] = useState([]);
    const { id } = useParams()


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

    function selectionService(idService, typeService) {
        if (servicesSelection.includes(idService)) {
            setServicesSelection(servicesSelection.filter(id => id !== idService))
            setTypeServicesSelection(typeServicesSelection.filter(type => type !== typeService))
        } else {
            setServicesSelection([...servicesSelection, idService])
            setTypeServicesSelection([...typeServicesSelection, typeService])
        }
    }

    function setInfosCompte() {
        forfaitsCompte.map((forfaitCompte) => {
            selectionService(forfaitCompte.idService, forfaitCompte.typeService)
            selectionForfaits(forfaitCompte.idForfait, forfaitCompte.typeService)
        })
    }

    useEffect(() => {
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
        async function recupererInfosCompte() {
            try {
                const token = localStorage.getItem("token")

                const response = await fetch(`/api/forfaitsDossier/${id}`, {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Accept": "application/json"
                    }
                })

                if (!response.ok) {
                    setAfficherErreur(true)
                    setMessageErreur("Erreur en récupèrant les forfaits dossier")
                }

                const data = await response.json()
                console.log(data)
                setForfaitsCompte(data)

            } catch (err) {
                setAfficherErreur(true)
                setMessageErreur("Erreur serveur", err)
            }
        }
        recupererInfosCompte();
        recupererForfaits();
        recupererService();
    }, [])

    useEffect(() => {
        if (forfaitsCompte.length === 0) return;

        const ids = forfaitsCompte.map(f => f.idService);
        const types = forfaitsCompte.map(f => f.typeService);
        const idsForfaits = forfaitsCompte.map(f => f.idForfait);

        setServicesSelection(ids);
        setTypeServicesSelection(types);
        setForfaitsSelection(idsForfaits);

    }, [forfaitsCompte])

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

    async function requeteModifierForfait() {
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
            setTimeout(() => (setAfficherSucces(false), window.location.replace("/dashboard")), 1500)

        } catch (err) {
            setAfficherErreur(true)
            setMessageErreur("Erreur serveur : " + err.message)
        }
    }

    return (
        <div className="section">
            <div className="container is-centered mt-3">
                <h1 className="title">Modifier un compte</h1>
                <h2 className="subtitle is-5 is-spaced">Assistant de modification d'un compte</h2>
                <div className="box">
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
                    <h3 className="title is-4">Modifier les services</h3>
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
                    <div className="mt-5">
                        <h3 className="title is-4">Sélection des forfaits</h3>
                        <div className="subtitle is-5 mt-2">Sélectionner un forfait pour chaque service</div>
                        {affichageForfaits()}
                    </div>
                </div>
            </div>
        </div>
    )
}