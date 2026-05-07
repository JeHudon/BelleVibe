import { Link } from "react-router-dom";
<<<<<<< Updated upstream:Code - BelleVibe/FrontEnd/src/App.jsx
=======
import DashboardEmploye from "../components/DashboardEmploye";
>>>>>>> Stashed changes:Code - BelleVibe/FrontEnd/src/Pages/App.jsx

function App() {
  return (
    <>
      <div className="container">
        <h1 className="title is-1 has-text-centered">Page d'accueil (Dashboard)</h1>
        <Link to={`/login`} className="button is-light">
          Login
        </Link>
      </div>
<<<<<<< Updated upstream:Code - BelleVibe/FrontEnd/src/App.jsx
=======
      <Link to={`/creerCompte`} >
        <button type="submit" className="button is-primary">
          Créer un compte
        </button>
      </Link>
      <DashboardEmploye />
>>>>>>> Stashed changes:Code - BelleVibe/FrontEnd/src/Pages/App.jsx
    </>
  );
}

export default App;
