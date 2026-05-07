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

function isTokenExpired(token) {
	const payload = JSON.parse(atob(token.split(".")[1]));
	return payload.exp * 1000 < Date.now(); // exp is in seconds
}

function Routeur() {
	const [isLoggedIn, setIsLoggedIn] = useState(() => {
		const token = localStorage.getItem("token");
		if (!token) return false;
		if (isTokenExpired(token)) {
			localStorage.removeItem("token");
			return false;
		}
		return true;
	});

	const objetsEtMethodesDuContexte = {
		isLoggedIn,
		setIsLoggedIn,
	};

	useEffect(() => {
		const token = localStorage.getItem("token");
		if (!token || isTokenExpired(token)) {
			localStorage.removeItem("token");
			setIsLoggedIn(false);
		}
	}, []);
	return (
		<LoginContext.Provider value={{ isLoggedIn, setIsLoggedIn }}>
			<BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
				<Routes>
					<Route
						path="/login"
						element={isLoggedIn ? <Navigate to="/dashboard" replace /> : <Login />}
					/>
					<Route
						element={
							isLoggedIn
								? <Sidebar />
								: <Navigate to="/login" replace />
						}
					>
						<Route index element={<Navigate to="/dashboard" replace />} />
						<Route path="/dashboard" element={<App />} />
						<Route path="/clients/nouveau" element={<CreeClient />} />
						<Route path="/creerCompte" element={<CreerCompte />} />
						<Route path="/GestionCompte" element={<GestionCompte />} />
						<Route path="/comptes/:id/:onglet" element={<DetailsCompte />} />
						<Route path="/clients/:id/:onglet" element={<DetailsClient />} />
						<Route path="/CreerEmploye" element={<CreerEmploye />} />
						<Route path="/modifierForfait/:idForfait" element={<ModifierForfait />} />
						<Route path="*" element={<div className="section has-text-centered">Page non trouvée</div>} />
					</Route>
				</Routes>
			</BrowserRouter>
		</LoginContext.Provider>
	);
}

export default Routeur;
