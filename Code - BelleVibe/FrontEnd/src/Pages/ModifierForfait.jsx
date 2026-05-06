import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

export function ModifierForfait() {
    const [afficherSucces, setAfficherSucces] = useState(false);
    const [afficherErreur, setAfficherErreur] = useState(false);
    const [messageErreur, setMessageErreur] = useState("");
    const { id } = useParams()

    useEffect(() => {
        async function recupererForfaitsComptes() {
        }
    })

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
                </div>
            </div>
        </div>
    )
}