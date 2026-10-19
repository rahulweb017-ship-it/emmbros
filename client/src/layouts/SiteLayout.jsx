import React from "react";
import { Outlet } from "react-router-dom";
import { Header } from "../components/layout/Header";
import { Footer } from "../components/layout/Footer";
import { WhatsAppButton } from "../components/common/WhatsAppButton";
import { ScrollToTop } from "../components/common/ScrollToTop";

export function SiteLayout() {
  return (
    <div className="site-layout-wrapper" style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Header />
      <main id="main-content" style={{ flex: 1 }}>
        <Outlet />
      </main>
      <Footer />
      <WhatsAppButton />
      <ScrollToTop />
    </div>
  );
}
