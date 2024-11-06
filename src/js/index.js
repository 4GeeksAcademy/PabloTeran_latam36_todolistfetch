import React from "react";
import ReactDOM from "react-dom/client";  // Cambiado a 'react-dom/client'
import Home from "./component/home.jsx";
import "../styles/index.css";

const root = ReactDOM.createRoot(document.getElementById("app"));
root.render(<Home />);
