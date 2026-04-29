import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import App from "./App";
import Sidebar from "./sidebar";
import CreeClient from "./CreeClient";
import Login from "./Login";

function Routeur() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const token = localStorage.getItem("token");

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="*"
          element={
            !token ? (
              <Navigate to="/login" replace />
            ) : (
              <div className="columns is-gapless" style={{ minHeight: "100vh" }}>
                <div className={`column is-narrow px-0 ${sidebarOpen ? "" : "is-hidden-touch"}`}>
                  <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
                </div>

                <div className="column" style={{ background: "#f8fbff", padding: "2rem" }}>
                  <div className="is-hidden-tablet mb-4">
                    <button className="button is-white" onClick={() => setSidebarOpen((open) => !open)}>
                      <span className="icon">
                        <i className="fa-solid fa-bars" />
                      </span>
                      <span>Menu</span>
                    </button>
                  </div>

                  <Routes>
                    <Route path="/" element={<App />} />
                    <Route path="/clients/nouveau" element={<CreeClient />} />
                    <Route
                      path="*"
                      element={
                        <div className="section has-text-centered">Page non trouvée</div>
                      }
                    />
                  </Routes>
                </div>
              </div>
            )
          }
        />
      </Routes>

      {token && (
        <footer className="has-text-centered" style={{ padding: "1rem 0", background: "#ffffff" }}>
          e2463986
        </footer>
      )}
    </BrowserRouter>
  );
}

export default Routeur;
