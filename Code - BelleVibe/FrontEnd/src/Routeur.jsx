<<<<<<< Updated upstream
import { BrowserRouter, Route, Routes } from "react-router-dom";
import App from "./App.jsx";
import { Login } from "./Login.jsx";
=======
import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import App from "./Pages/App.jsx";
import DetailsCompte from "./Pages/DetailsCompte.jsx";
import DetailsClient from "./Pages/DetailsClient.jsx";
import { Login }  from "./Pages/Login.jsx";
import { CreerCompte } from "./Pages/CreerCompte.jsx";
import Sidebar from "./components/Sidebar";
import CreeClient from "./Pages/CreerClient";
import { LoginContext } from "./context/LoginContext.js";
import GestionCompte from "./Pages/GestionCompte.jsx";
import CreerEmploye from "./Pages/CreerEmploye.jsx";
import { ModifierForfait } from "./Pages/ModifierForfait.jsx";
import DashboardEmploye from "./components/DashboardEmploye.jsx";
import DashboardSuperviseur from "./components/DashboardSuperviseur.jsx";
import DashboardAdmin from "./components/DashboardAdmin.jsx";
>>>>>>> Stashed changes

export function Routeur() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<App />} />
                <Route path="/login" element={<Login />} />
            </Routes>
        </BrowserRouter>
    )
}