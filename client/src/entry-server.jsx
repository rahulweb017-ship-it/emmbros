import React from "react";
import ReactDOMServer from "react-dom/server";
import { StaticRouter } from "react-router-dom/server";
import { HelmetProvider } from "react-helmet-async";
import App from "./App.jsx";
import {
  SITE_URL,
  SITE_NAME,
  SEO_PAGES,
  PUBLIC_PRERENDER_ROUTES,
  getCanonicalUrl,
  buildPageJsonLd,
} from "./config/seoConfig.js";

export {
  SITE_URL,
  SITE_NAME,
  SEO_PAGES,
  PUBLIC_PRERENDER_ROUTES,
  getCanonicalUrl,
  buildPageJsonLd,
};

export function render(url) {
  const helmetContext = {};
  const appHtml = ReactDOMServer.renderToString(
    <React.StrictMode>
      <HelmetProvider context={helmetContext}>
        <StaticRouter location={url}>
          <App />
        </StaticRouter>
      </HelmetProvider>
    </React.StrictMode>
  );
  return { appHtml, helmet: helmetContext.helmet };
}
