import { Link } from "react-router-dom";

function App() {
  return (
    <>
      <div className="container">
        <h1 className="title is-1 has-text-centered">Page d'accueil (Dashboard)</h1>
        <Link to={`/login`} className="button is-light">
          Login
        </Link>
      </div>
    </>
  );
}

export default App;
