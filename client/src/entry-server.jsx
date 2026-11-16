import React from "react";
import ReactDOMServer from "react-dom/server";
import { StaticRouter } from "react-router-dom/server";
import { HelmetProvider } from "react-helmet-async";
import { InitialDataProvider } from "./context/InitialDataContext.jsx";
import App from "./App.jsx";
import {
  SITE_URL,
  SITE_NAME,
  ORGANIZATION_SCHEMA,
  PLANT_LOCATIONS_SCHEMA,
  SEO_PAGES,
  PUBLIC_PRERENDER_ROUTES,
  getCanonicalUrl,
  buildProductSchema,
  buildPageJsonLd,
} from "./config/seoConfig.js";

export {
  SITE_URL,
  SITE_NAME,
  ORGANIZATION_SCHEMA,
  PLANT_LOCATIONS_SCHEMA,
  SEO_PAGES,
  PUBLIC_PRERENDER_ROUTES,
  getCanonicalUrl,
  buildProductSchema,
  buildPageJsonLd,
};

export function render(url, initialData = null) {
  const helmetContext = {};
  const appHtml = ReactDOMServer.renderToString(
    <React.StrictMode>
      <InitialDataProvider data={initialData}>
        <HelmetProvider context={helmetContext}>
          <StaticRouter location={url}>
            <App />
          </StaticRouter>
        </HelmetProvider>
      </InitialDataProvider>
    </React.StrictMode>
  );
  return { appHtml, helmet: helmetContext.helmet };
}
