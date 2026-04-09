import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Home";
import Details from "./Details";


function Routeur() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/details/:pokemonId" element={<Details />} />
          <Route path="*" element={<div className="section has-text-centered">Page non trouvée</div>} />
        </Routes>
        <footer className="has-text-centered">e2463986</footer>
      </BrowserRouter>
    </div>
  );
}


export default Routeur
