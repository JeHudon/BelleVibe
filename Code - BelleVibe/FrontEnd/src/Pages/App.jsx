import { Link } from "react-router-dom";
import DashboardEmploye from "../components/DashboardEmploye";


function App() {
  return (
    <>
      <div className="container">
        <h1 className="title is-1 has-text-centered">Page d'accueil (Dashboard)</h1>
      </div>
      <DashboardEmploye />
    </>
  );
}

export default App;
