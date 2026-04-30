import { useState } from "react";
import { useNavigate } from "react-router-dom";

const TYPE_PIECE = ["Permis de conduire", "Passeport", "Carte d'identité"];

export default function CreeClient() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    prenomClient: "",
    nomClient: "",
    dateNaissance: "",
    telephoneClient: "",
    courrielClient: "",
    adresseClient: "",
    codePostalClient: "",
    typePiece: TYPE_PIECE[0],
    numeroPiece: "",
    consentement: false,
  });
  const [erreur, setErreur] = useState("");
  const [succes, setSucces] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErreur("");

    if (!form.consentement) {
      setErreur("Le consentement du client est obligatoire.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:3000/clients/creerClient", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json();
        setErreur(data.message || "Erreur lors de la création du client.");
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

      <h1 className="title is-3 mb-1">Créer nouveau client</h1>
      <p className="subtitle is-6 has-text-grey mb-5">
        Enregistrer un nouveau client dans le système
      </p>

      {succes && (
        <div className="notification is-success is-light mb-4">
          Client créé avec succès ! Redirection…
        </div>
      )}

      {erreur && (
        <div className="notification is-danger is-light mb-4">
          {erreur}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="box">
          <p className="label mb-1">Informations du client</p>
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
                    name="prenomClient"
                    placeholder="Sophie"
                    value={form.prenomClient}
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
                    name="nomClient"
                    placeholder="Gagnon"
                    value={form.nomClient}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Date de naissance */}
          <div className="field">
            <label className="label">Date de naissance</label>
            <div className="control">
              <input
                className="input"
                type="date"
                name="dateNaissance"
                value={form.dateNaissance}
                onChange={handleChange}
              />
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
                    name="telephoneClient"
                    placeholder="514-555-1234"
                    value={form.telephoneClient}
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
                    name="courrielClient"
                    placeholder="client@example.com"
                    value={form.courrielClient}
                    onChange={handleChange}
                    required
                  />
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
                    name="adresseClient"
                    placeholder="123 Rue Saint-Laurent, Montréal, QC"
                    value={form.adresseClient}
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
                    name="codePostalClient"
                    placeholder="H2X 2T6"
                    value={form.codePostalClient}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Pièce d'identité */}
          <p className="label mt-5 mb-3">Pièce d'identité</p>
          <div className="columns">
            <div className="column">
              <div className="field">
                <label className="label">Type de pièce</label>
                <div className="control">
                  <div className="select is-fullwidth">
                    <select
                      name="typePiece"
                      value={form.typePiece}
                      onChange={handleChange}
                    >
                      {TYPE_PIECE.map((t) => (
                        <option key={t}>{t}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>
            <div className="column">
              <div className="field">
                <label className="label">Numéro de pièce</label>
                <div className="control">
                  <input
                    className="input"
                    type="text"
                    name="numeroPiece"
                    placeholder="G1234-567890-12"
                    value={form.numeroPiece}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Consentement */}
          <div className="notification is-light mt-4">
            <label className="checkbox">
              <input
                type="checkbox"
                name="consentement"
                checked={form.consentement}
                onChange={handleChange}
                className="mr-2"
              />
              <strong>Consentement du client *</strong>
            </label>
            <p className="help mt-1">
              Le client consent à ce que ses informations personnelles soient
              collectées et utilisées conformément à notre politique de
              confidentialité.
            </p>
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
