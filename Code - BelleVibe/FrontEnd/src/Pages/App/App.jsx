import { Link } from "react-router-dom";


function App() {
  return (
    <>
      <div className="container">
        <h1 className="title is-1 has-text-centered">Page d'accueil (Dashboard)</h1>
      </div>
      <Link to={`/creerCompte`} >
        <button type="submit" className="button is-primary">
          Créer un compte
        </button>
      </Link>
    </>
  );
}

export default App;
