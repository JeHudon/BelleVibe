import { BrowserRouter, Route, Routes } from "react-router-dom";
import App from "./App.jsx";
import { Login } from "./Login.jsx";
import { CreerCompte } from "./CreerCompte.jsx"

export function Routeur() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/dashboard" element={<App />} />
                <Route path="/creerCompte" element={<CreerCompte />}></Route>
            </Routes>
        </BrowserRouter>
    )
}