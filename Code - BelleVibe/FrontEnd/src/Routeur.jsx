import { BrowserRouter, Route, Routes } from "react-router-dom";
import App from "./Pages/App/App.jsx";
import DetailsCompte from "./Pages/DetailsCompte/DetailsCompte.jsx";
import { Login } from "./Pages/Login/Login.jsx";
import { CreerCompte } from "./CreerCompte.jsx"

export function Routeur() {
    return (
        <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/dashboard" element={<App />} />
                <Route path="/creerCompte" element={<CreerCompte />}></Route>
				<Route path="/comptes/:id/:onglet" element={<DetailsCompte />} />
            </Routes>
        </BrowserRouter>
    )
}
