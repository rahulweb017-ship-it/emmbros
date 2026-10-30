import React from "react";
import { Outlet } from "react-router-dom";
import { Header } from "../components/layout/Header";
import { Footer } from "../components/layout/Footer";
import { Breadcrumbs } from "../components/common/Breadcrumbs";
import { WhatsAppButton } from "../components/common/WhatsAppButton";
import { ScrollToTop } from "../components/common/ScrollToTop";

export function SiteLayout() {
  return (
    <div
      className="site-layout-wrapper eal-kit-14308 eal-default eal-template-full-width eal-page"
      style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}
    >
      <Header />
      <Breadcrumbs />
      <main id="main-content" style={{ flex: 1 }}>
        <Outlet />
      </main>
      <Footer />
      <WhatsAppButton />
      <ScrollToTop />
    </div>
  );
}
