import { Link } from "react-router-dom";
import { useState } from "react";

export function Login() {
    const [email, setEmail] = useState("employe@bellevibe.com");
    const [mdp, setMdp] = useState("123456");
    const [role, setRole] = useState("Employé")
    const [error, setError] = useState("");

    async function loginOnClick(e) {
        e.preventDefault();

        setError("");

        try {
            const response = await fetch("/api/employes/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify({
                    email: email,
                    mdp: mdp
                })
            });

            if (!response.ok) {
                setError("Email ou mot de passe invalide");
                return;
            }

            const data = await response.json();
            console.log(data)
            localStorage.setItem("token", data.token)

        } catch (err) {
            setError("Erreur réseau", err);
        }
    }

    function remplirChamp(role) {
        setRole(role)
        if (role === "Employé") {
            setEmail("employe@bellevibe.com")
            setMdp("123456")
        } else if (role === "Superviseur") {
            setEmail("superviseur@bellevibe.com")
            setMdp("123456789")
        } else if (role === "Admin") {
            setEmail("admin@bellevibe.com")
            setMdp("123456789")
        }
    }

    return (
        <div
            style={{
                minHeight: "100vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                position: "relative",
                padding: "1rem",
                backgroundColor: "#dbeafe",
            }}
        >
            <img
                src="../images/logo.png"
                alt="BelleVibe Logo"
                style={{
                    position: "absolute",
                    top: "-5rem",
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: "min(600px, 70vw)",
                    height: "auto",
                }}
            />

            <form
                className="box"
                style={{
                    width: "min(550px, 90vw)",
                    padding: "2.5rem",
                }}
                onSubmit={loginOnClick}
            >
                <h1 className="title has-text-centered is-size-3">
                    Connexion
                </h1>

                {error && (
                    <div className="notification is-danger">
                        {error}
                    </div>
                )}

                <div className="field">
                    <label className="label">Courriel</label>
                    <div className="control">
                        <input
                            onChange={(e) => setEmail(e.target.value)}
                            className="input"
                            type="email"
                            value={email}
                            placeholder="e.g. alex@example.com"
                        />
                    </div>
                </div>

                <div className="field">
                    <label className="label">Mot de passe</label>
                    <div className="control">
                        <input
                            onChange={(e) => setMdp(e.target.value)}
                            className="input"
                            type="password"
                            value={mdp}
                            placeholder="********"
                        />
                    </div>
                </div>

                <label className="label">Rôle</label>

                <div className="field">
                    <label className="radio">
                        <input
                            type="radio"
                            name="rôle"
                            value="Employé"
                            checked={role === "Employé"}
                            onChange={() => remplirChamp("Employé")}
                        />
                        <span className="ml-2">Employé</span>
                    </label>
                </div>

                <div className="field">
                    <label className="radio">
                        <input
                            type="radio"
                            name="rôle"
                            value="Superviseur"
                            checked={role === "Superviseur"}
                            onChange={() => remplirChamp("Superviseur")}
                        />
                        <span className="ml-2">Superviseur</span>
                    </label>
                </div>

                <div className="field">
                    <label className="radio">
                        <input
                            type="radio"
                            name="rôle"
                            value="Admin"
                            checked={role === "Admin"}
                            onChange={() => remplirChamp("Admin")}
                        />
                        <span className="ml-2">Admin</span>
                    </label>
                </div>

                <div className="field is-grouped is-justify-content-space-between mt-5">
                    <div className="control">
                        <Link to={`/dashboard`} >
                            <button type="submit" className="button is-primary">
                                Se connecter
                            </button>
                        </Link>
                    </div>
                </div>
            </form>
        </div>
    );
}