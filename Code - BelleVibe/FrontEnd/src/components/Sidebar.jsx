import React from "react";
import { Link, useLocation, Outlet } from "react-router-dom";

const menuItems = [
	{ to: "/dashboard", label: "Tableau de bord", icon: "fa-chart-line" },
	{ to: "/clients/nouveau", label: "Créer client", icon: "fa-user-plus" },
	{ to: "/creerCompte", label: "Créer compte", icon: "fa-wallet" },
	{ to: "/notes/nouvelle", label: "Ajouter note", icon: "fa-file-lines" },
	{ to: "/GestionCompte", label: "Gestion du compte", icon: "fa-folder" },
];

const serviceIcons = [
	{ icon: "fa-chart-bar", label: "Analytics" },
	{ icon: "fa-wifi", label: "Wi-Fi" },
	{ icon: "fa-tv", label: "TV" },
];

// Fonction pour décoder le token JWT
function parseJwt(token) {
	try {
		const base64Url = token.split(".")[1];
		const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
		const jsonPayload = decodeURIComponent(
			atob(base64)
				.split("")
				.map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
				.join(""),
		);
		return JSON.parse(jsonPayload);
	} catch {
		return null;
	}
}

export default function Sidebar() {
	const location = useLocation();

	// Extraire les infos de l'employé depuis le token
	const token = localStorage.getItem("token");
	const userInfo = token ? parseJwt(token) : null;

	const employeNom = userInfo ? `Employé #${userInfo.id}` : "Invité";
	const employeRole = userInfo ? userInfo.role : "";

	const activeItem = menuItems.reduce((best, item) => {
		const matches =
			location.pathname === item.to ||
			location.pathname.startsWith(item.to + "/");
		if (matches && item.to.length > (best?.to.length ?? -1)) return item;
		return best;
	}, null);

	return (
		<div className="columns is-gapless" style={{ minHeight: "100vh" }}>
			<div className="column is-narrow px-0">
				<aside className="menu is-fullheight p-4 ">
					<div className="mb-5">
						<div className="media">
							<div className="media-left">
								<span className="icon is-large">
									<img
										src="../images/logo.png"
										alt="Logo"
									/>
								</span>
							</div>
							<div className="media-content">
								<p className="title is-5 mb-1">BelleVibe</p>
								<p className="subtitle is-7 has-text-link">Telecom</p>
							</div>
						</div>

						<div className="media">
							<div className="media-left">
								<span className="icon is-large has-background-link has-text-white is-rounded">
									<i className="fa-solid fa-user-tie" />
								</span>
							</div>

							<div className="media-content">
								<p className="title is-6 mb-1">{employeNom}</p>

								<p className="subtitle is-7 has-text-grey">{employeRole}</p>
							</div>
						</div>

						<nav className="menu">
							<ul className="menu-list">
								{menuItems.map((item) => {
									const isActive = activeItem !== null && item.to === activeItem.to;
									return (
										<li key={item.to}>
											<Link
												to={item.to}
												className={`button is-fullwidth has-text-left mb-2 ${isActive ? "has-background-link has-text-white" : "is-white has-text-dark"}`}
											>
												<span className="icon is-small">
													<i className={`fa-solid ${item.icon}`} />
												</span>
												<span>{item.label}</span>
											</Link>
										</li>
									);
								})}
							</ul>
						</nav>
					</div>
					<button
						className="button is-danger is-light is-fullwidth mb-4"
						onClick={() => {
							localStorage.removeItem("token");
							window.location.replace("/login");
						}}
					>
						<span className="icon">
							<i className="fa-solid fa-right-from-bracket" />
						</span>
						<span>Déconnexion</span>
					</button>

					<p className="subtitle is-7 has-text-weight-semibold">Nos services</p>
					<div className="columns is-mobile is-multiline is-variable is-1">
						{serviceIcons.map((service) => (
							<div key={service.label} className="column is-4">
								<div className="box has-text-centered">
									<span className="icon is-large has-text-link">
										<i className={`fa-solid ${service.icon} fa-lg`} />
									</span>
								</div>
							</div>
						))}
					</div>
				</aside>
			</div>
			<div className="column" style={{ background: "#f8fbff", padding: "2rem" }}>
				<Outlet /> {/* render le reste du site ici dans le code */}
			</div>
		</div>
	);
}
