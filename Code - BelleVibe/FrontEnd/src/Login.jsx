import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", mdp: "" });
  const [erreur, setErreur] = useState("");
  const [chargement, setChargement] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErreur("");
    setChargement(true);

    try {
      const res = await fetch("http://localhost:3000/employes/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setErreur(data.error || "Identifiants invalides.");
        return;
      }

      localStorage.setItem("token", data.token);
      window.location.replace("/");
    } catch {
      setErreur("Impossible de joindre le serveur.");
    } finally {
      setChargement(false);
    }
  };

  return (
    <div
      className="is-flex is-justify-content-center is-align-items-center"
      style={{ minHeight: "100vh", background: "#f8fbff" }}
    >
      <div style={{ width: 400 }}>
        <div className="has-text-centered mb-5">
          <p className="title is-4">BelleVibe</p>
          <p className="subtitle is-6 has-text-grey">Connexion employé</p>
        </div>

        <div className="box">
          {erreur && (
            <div className="notification is-danger is-light mb-4">{erreur}</div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="field">
              <label className="label">Courriel</label>
              <div className="control has-icons-left">
                <input
                  className="input"
                  type="email"
                  name="email"
                  placeholder="employe@bellevibe.com"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
                <span className="icon is-left">
                  <i className="fa-solid fa-envelope" />
                </span>
              </div>
            </div>

            <div className="field">
              <label className="label">Mot de passe</label>
              <div className="control has-icons-left">
                <input
                  className="input"
                  type="password"
                  name="mdp"
                  placeholder="••••••••"
                  value={form.mdp}
                  onChange={handleChange}
                  required
                />
                <span className="icon is-left">
                  <i className="fa-solid fa-lock" />
                </span>
              </div>
            </div>

            <button
              className={`button is-link is-fullwidth mt-4 ${chargement ? "is-loading" : ""}`}
              type="submit"
            >
              Se connecter
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
