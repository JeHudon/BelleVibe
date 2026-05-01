import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import App from "./Pages/App/App.jsx";
import DetailsCompte from "./Pages/DetailsCompte/DetailsCompte.jsx";
import { Login } from "./Pages/Login/Login.jsx";
import { CreerCompte } from "./CreerCompte.jsx";
import Sidebar from "./sidebar";
import CreeClient from "./CreeClient";
import { LoginContext } from "./LoginContext.js";

function isTokenExpired(token) {
	const payload = JSON.parse(atob(token.split(".")[1]));
	return payload.exp * 1000 < Date.now(); // exp is in seconds
}

function Routeur() {
	const [sidebarOpen, setSidebarOpen] = useState(false);
	const [isLoggedIn, setIsLoggedIn] = useState(() => {
		return localStorage.getItem("token") !== null;
	});
	const objetsEtMethodesDuContexte = { isLoggedIn, setIsLoggedIn };

	useEffect(() => {
		const token = localStorage.getItem("token");
		if (!token || isTokenExpired(token)) {
			localStorage.removeItem("token");
			setIsLoggedIn(false);
		}
	}, []);

	return (
		<LoginContext.Provider value={objetsEtMethodesDuContexte}>
			<BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
				<Routes>
					<Route path="/login" element={<Login />} />
					<Route
						path="*"
						element={
							!isLoggedIn ? (
								<Navigate to="/login" replace />
							) : (
								<div className="columns is-gapless" style={{ minHeight: "100vh" }}>
									<div
										className={`column is-narrow px-0 ${sidebarOpen ? "" : "is-hidden-touch"}`}
									>
										<Sidebar
											isOpen={sidebarOpen}
											onClose={() => setSidebarOpen(false)}
										/>
									</div>
									<div
										className="column"
										style={{ background: "#f8fbff", padding: "2rem" }}
									>
										<div className="is-hidden-tablet mb-4">
											<button
												className="button is-white"
												onClick={() => setSidebarOpen((open) => !open)}
											>
												<span className="icon">
													<i className="fa-solid fa-bars" />
												</span>
												<span>Menu</span>
											</button>
										</div>
										<Routes>
											<Route
												path="/"
												element={<Navigate to="/login" replace />}
											/>
											<Route path="/dashboard" element={<App />} />
											<Route
												path="/clients/nouveau"
												element={<CreeClient />}
											/>
											<Route path="/creerCompte" element={<CreerCompte />} />
											<Route
												path="/comptes/:id/:onglet"
												element={<DetailsCompte />}
											/>
											<Route
												path="*"
												element={
													<div className="section has-text-centered">
														Page non trouvée
													</div>
												}
											/>
										</Routes>
									</div>
								</div>
							)
						}
					/>
				</Routes>
			</BrowserRouter>
		</LoginContext.Provider>
	);
}

export default Routeur;
