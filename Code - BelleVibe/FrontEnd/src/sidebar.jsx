import React from "react";
import { Link, useLocation } from "react-router-dom";

const menuItems = [
  { to: "/", label: "Tableau de bord", icon: "fa-chart-line" },
  { to: "/clients/nouveau", label: "Créer client", icon: "fa-user-plus" },
  { to: "/comptes/nouveau", label: "Créer compte", icon: "fa-wallet" },
  { to: "/notes/nouvelle", label: "Ajouter note", icon: "fa-file-lines" },
  { to: "/comptes", label: "Gestion du compte", icon: "fa-folder" },
];

const serviceIcons = [
  { icon: "fa-chart-bar", label: "Analytics" },
  { icon: "fa-wifi", label: "Wi-Fi" },
  { icon: "fa-tv", label: "TV" },
];

export default function Sidebar() {
  const location = useLocation();

  return (
    <aside className="menu is-fullheight p-4 ">
      <div className="mb-5">
        <div className="media">
          <div className="media-left">
            <span className="icon is-large">
              {/* <i className="fa-solid fa-wave-square" /> */}
              <img src="https://arbrescanada.ca/wp-content/uploads/2023/08/Bell_Blue_large_transparent-1.png" alt="Logo" />
            </span>
          </div>
          <div className="media-content">
            <p className="title is-5 mb-1">BelleVide</p>
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
            <p className="title is-6 mb-1">Marie Lavoie</p>
            <p className="subtitle is-7 has-text-grey">Employé</p>
          </div>
        </div>

        <nav className="menu">
          <ul className="menu-list">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.to;
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
  );
}
