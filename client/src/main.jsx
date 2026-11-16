import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { InitialDataProvider } from "./context/InitialDataContext.jsx";
import App from "./App.jsx";

const rootEl = document.getElementById("root");
const initialData = typeof window !== "undefined" && window.__INITIAL_DATA__ ? window.__INITIAL_DATA__ : null;

const appElement = (
  <React.StrictMode>
    <InitialDataProvider data={initialData}>
      <HelmetProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </HelmetProvider>
    </InitialDataProvider>
  </React.StrictMode>
);

if (rootEl && rootEl.hasChildNodes() && rootEl.innerHTML.trim() !== "<!--app-html-->") {
  ReactDOM.hydrateRoot(rootEl, appElement);
} else if (rootEl) {
  ReactDOM.createRoot(rootEl).render(appElement);
}
