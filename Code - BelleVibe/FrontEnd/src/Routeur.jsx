import { BrowserRouter, Route, Routes } from "react-router-dom";
import App from "./Pages/App/App.jsx";
import DetailsCompte from "./Pages/DetailsCompte/DetailsCompte.jsx";
import { Login } from "./Pages/Login/Login.jsx";

export function Routeur() {
    return (
        <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <Routes>
                <Route path="/" element={<App />} />
                <Route path="/login" element={<Login />} />
				<Route path="/comptes/:id/:onglet" element={<DetailsCompte />} />
            </Routes>
        </BrowserRouter>
    )
}
