import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CreerEmploye() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    prenomEmploye: "",
    nomEmploye: "",
    telephoneEmploye: "",
    courrielEmploye: "",
    adresseEmploye: "",
    codePostalEmploye: "",
    mdp: "",
    role: "commis",
  });
  const [erreur, setErreur] = useState("");
  const [succes, setSucces] = useState(false);
  const [showMdp, setShowMdp] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErreur("");

    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/employes/addEmploye", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json();
        setErreur(data.error || data.message || "Erreur lors de la création de l'employé.");
        return;
      }

      setSucces(true);
      setTimeout(() => navigate("/"), 1500);
    } catch {
      setErreur("Impossible de joindre le serveur.");
    }
  };

  return (
    <div style={{ maxWidth: 780, margin: "0 auto" }}>
      <div className="mb-4">
        <button
          className="button is-white px-2"
          onClick={() => navigate(-1)}
          type="button"
        >
          <span className="icon">
            <i className="fa-solid fa-arrow-left" />
          </span>
        </button>
      </div>

      <h1 className="title is-3 mb-1">Créer nouveau employé</h1>
      <p className="subtitle is-6 has-text-grey mb-5">
        Enregistrer un nouveau employé dans le système
      </p>

      {succes && (
        <div className="notification is-success is-light mb-4">
          Employé créé avec succès ! Redirection…
        </div>
      )}

      {erreur && (
        <div className="notification is-danger is-light mb-4">
          {erreur}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="box">
          <p className="label mb-1">Informations de l'employé</p>
          <p className="help has-text-grey mb-4">
            Tous les champs marqués * sont obligatoires
          </p>

          {/* Prénom / Nom */}
          <div className="columns">
            <div className="column">
              <div className="field">
                <label className="label">Prénom *</label>
                <div className="control">
                  <input
                    className="input"
                    type="text"
                    name="prenomEmploye"
                    placeholder="Sophie"
                    value={form.prenomEmploye}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>
            <div className="column">
              <div className="field">
                <label className="label">Nom *</label>
                <div className="control">
                  <input
                    className="input"
                    type="text"
                    name="nomEmploye"
                    placeholder="Gagnon"
                    value={form.nomEmploye}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Téléphone / Courriel */}
          <div className="columns">
            <div className="column">
              <div className="field">
                <label className="label">Téléphone *</label>
                <div className="control">
                  <input
                    className="input"
                    type="tel"
                    name="telephoneEmploye"
                    placeholder="514-555-1234"
                    value={form.telephoneEmploye}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>
            <div className="column">
              <div className="field">
                <label className="label">Courriel *</label>
                <div className="control">
                  <input
                    className="input"
                    type="email"
                    name="courrielEmploye"
                    placeholder="employe@example.com"
                    value={form.courrielEmploye}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Titre / Rôle */}
          <div className="columns">
            <div className="column is-4">
              <div className="field">
                <label className="label">Titre *</label>
                <div className="control">
                  <div className="select is-fullwidth">
                    <select name="role" value={form.role} onChange={handleChange} required>
                      <option value="commis">Commis</option>
                      <option value="superviseur">Superviseur</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Mot de passe */}
          <div className="columns">
            <div className="column is-6">
              <div className="field">
                <label className="label">Mot de passe *</label>
                <div className="control has-icons-right">
                  <input
                    className="input"
                    type={showMdp ? "text" : "password"}
                    name="mdp"
                    placeholder="••••••••"
                    value={form.mdp}
                    onChange={handleChange}
                    required
                  />
                  <span
                    className="icon is-right"
                    style={{ cursor: "pointer", pointerEvents: "all" }}
                    onClick={() => setShowMdp((v) => !v)}
                  >
                    <i className={`fa-solid ${showMdp ? "fa-eye-slash" : "fa-eye"}`} />
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Adresse / Code postal */}
          <div className="columns">
            <div className="column is-8">
              <div className="field">
                <label className="label">Adresse complète</label>
                <div className="control">
                  <input
                    className="input"
                    type="text"
                    name="adresseEmploye"
                    placeholder="123 Rue Saint-Laurent, Montréal, QC"
                    value={form.adresseEmploye}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>
            <div className="column">
              <div className="field">
                <label className="label">Code postal *</label>
                <div className="control">
                  <input
                    className="input"
                    type="text"
                    name="codePostalEmploye"
                    placeholder="H2X 2T6"
                    value={form.codePostalEmploye}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Boutons */}
        <div className="buttons mt-2">
          <button className="button is-dark" type="submit">
            <span className="icon">
              <i className="fa-solid fa-floppy-disk" />
            </span>
            <span>Enregistrer</span>
          </button>
          <button
            className="button is-light"
            type="button"
            onClick={() => navigate(-1)}
          >
            <span className="icon">
              <i className="fa-solid fa-xmark" />
            </span>
            <span>Annuler</span>
          </button>
        </div>
      </form>
    </div>
  );
}
