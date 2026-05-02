import React from 'react';
import { Link } from 'react-router-dom';

function Navbar({ onToggle }) {
  return (
    <nav className="navbar is-white" role="navigation" aria-label="main navigation">
      <div className="navbar-brand">
        <button className="button is-white is-hidden-tablet" onClick={onToggle}>
          <span className="icon">
            <i className="fa-solid fa-bars" />
          </span>
        </button>
        <Link className="navbar-item" to="/">
          <strong>BelleVibe</strong>
        </Link>
      </div>

      <div className="navbar-menu is-active">
        <div className="navbar-start">
          <Link className="navbar-item" to="/">
            Accueil
          </Link>
        </div>

        <div className="navbar-end">
          <div className="navbar-item">
            <div className="buttons">
              <button className="button is-primary">
                <strong>Connexion</strong>
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;