import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./app";
//import "./styles/main.css"; // Relative path to styles/main.css

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  //<React.StrictMode>
  <BrowserRouter>
    <App />
  </BrowserRouter>
  //</React.StrictMode>,
);
