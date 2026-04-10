import { Link } from "react-router-dom";
import { useState } from "react";

export function Login() {
    const [email, setEmail] = useState("");
    const [mdp, setMdp] = useState("");
    const [error, setError] = useState("");

    async function loginOnClick(e) {
        e.preventDefault();

        setError("");

        try {
            const response = await fetch("/login", {
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

        } catch (err) {
            setError("Erreur réseau");
        }
    }

    return (
        <div
            className="is-flex is-justify-content-center is-align-items-center"
            style={{ minHeight: "100vh" }}>   
            <span class="icon">
                <i class="fas fa-home"></i>
            </span>
            <form className="box" style={{ width: "400px" }} onSubmit={loginOnClick}>

                <h1 className="title has-text-centered">Login</h1>

                {error && (
                    <div className="notification is-danger">
                        {error}
                    </div>
                )}

                <div className="field">
                    <label className="label">Email</label>
                    <div className="control">
                        <input
                            onChange={(e) => setEmail(e.target.value)}
                            className="input"
                            type="email"
                            placeholder="e.g. alex@example.com"
                        />
                    </div>
                </div>

                <div className="field">
                    <label className="label">Password</label>
                    <div className="control">
                        <input
                            onChange={(e) => setMdp(e.target.value)}
                            className="input"
                            type="password"
                            placeholder="********"
                        />
                    </div>
                </div>

                <div className="field is-grouped is-justify-content-space-between mt-4">
                    <div className="control">
                        <button type="submit" className="button is-primary">
                            Login
                        </button>
                    </div>

                    <div className="control">
                        <Link to={`/`} className="button is-light">
                            Cancel
                        </Link>
                    </div>
                </div>

            </form>
        </div>
    );
}