import { BrowserRouter, Route, Routes } from "react-router-dom";
import App from "./App.jsx";
import { Login } from "./Login.jsx";

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