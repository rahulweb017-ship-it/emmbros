import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import App from "./App.jsx";

const rootEl = document.getElementById("root");
const appElement = (
  <React.StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </HelmetProvider>
  </React.StrictMode>
);

if (rootEl && rootEl.hasChildNodes() && rootEl.innerHTML.trim() !== "<!--app-html-->") {
  ReactDOM.hydrateRoot(rootEl, appElement);
} else if (rootEl) {
  ReactDOM.createRoot(rootEl).render(appElement);
}
