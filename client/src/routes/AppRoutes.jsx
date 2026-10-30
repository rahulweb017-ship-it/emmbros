import React, { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { SiteLayout } from "../layouts/SiteLayout";
import { LoadingSpinner } from "../admin/components/LoadingSpinner";

// Public standalone pages
import { Home } from "../pages/Home";
import { WhoWeAre } from "../pages/WhoWeAre";
import { WhatWeDo } from "../pages/WhatWeDo";
import { QualityCertifications } from "../pages/QualityCertifications";
import { IndustriesClients } from "../pages/IndustriesClients";
import { Contact } from "../pages/Contact";
import { ProductApplication } from "../pages/ProductApplication";
import { FrontAxleShaft } from "../pages/products/FrontAxleShaft";
import { RearAxleShaft } from "../pages/products/RearAxleShaft";
import { GearBoxParts } from "../pages/products/GearBoxParts";
import { DrivelineParts } from "../pages/products/DrivelineParts";
import { HydraulicParts } from "../pages/products/HydraulicParts";
import { PlanetaryWheelDriveParts } from "../pages/products/PlanetaryWheelDriveParts";
import { Career } from "../pages/Career";
import { NotFound } from "../pages/NotFound";

// Public CMS Views
import { BlogListPage } from "../public/pages/BlogListPage";
import { BlogPostPage } from "../public/pages/BlogPostPage";
import { CareersListPage } from "../public/pages/CareersListPage";
import { JobDetailPage } from "../public/pages/JobDetailPage";

// Lazy load Admin module to keep public bundle lean
const AdminApp = lazy(() => import("../admin/AdminApp"));

export function AppRoutes() {
  return (
    <Routes>
      {/* Standalone Marketing Site Routes wrapped with SiteLayout */}
      <Route element={<SiteLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/who-we-are" element={<WhoWeAre />} />
        <Route path="/who-we-are/" element={<WhoWeAre />} />
        <Route path="/about" element={<Navigate to="/who-we-are" replace />} />
        <Route path="/about/" element={<Navigate to="/who-we-are" replace />} />
        <Route path="/what-we-do" element={<WhatWeDo />} />
        <Route path="/what-we-do/" element={<WhatWeDo />} />
        <Route path="/quality-certifications" element={<QualityCertifications />} />
        <Route path="/quality-certifications/" element={<QualityCertifications />} />
        <Route path="/industries-clients" element={<IndustriesClients />} />
        <Route path="/industries-clients/" element={<IndustriesClients />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/contact/" element={<Contact />} />
        <Route path="/product-application" element={<ProductApplication />} />
        <Route path="/product-application/" element={<ProductApplication />} />
        <Route path="/product-application/front-axle-shaft" element={<FrontAxleShaft />} />
        <Route path="/product-application/front-axle-shaft/" element={<FrontAxleShaft />} />
        <Route path="/product-application/rear-axle-shaft" element={<RearAxleShaft />} />
        <Route path="/product-application/rear-axle-shaft/" element={<RearAxleShaft />} />
        <Route path="/product-application/gear-box-parts" element={<GearBoxParts />} />
        <Route path="/product-application/gear-box-parts/" element={<GearBoxParts />} />
        <Route path="/product-application/driveline-parts" element={<DrivelineParts />} />
        <Route path="/product-application/driveline-parts/" element={<DrivelineParts />} />
        <Route path="/product-application/hydraulic-parts" element={<HydraulicParts />} />
        <Route path="/product-application/hydraulic-parts/" element={<HydraulicParts />} />
        <Route path="/product-application/planetary-wheel-drive-parts" element={<PlanetaryWheelDriveParts />} />
        <Route path="/product-application/planetary-wheel-drive-parts/" element={<PlanetaryWheelDriveParts />} />
        <Route path="/career" element={<Career />} />
        <Route path="/career/" element={<Career />} />

        {/* Short product URLs permanently redirected to canonical nested URLs */}
        <Route path="/front-axle-shaft" element={<Navigate to="/product-application/front-axle-shaft" replace />} />
        <Route path="/front-axle-shaft/" element={<Navigate to="/product-application/front-axle-shaft" replace />} />
        <Route path="/rear-axle-shaft" element={<Navigate to="/product-application/rear-axle-shaft" replace />} />
        <Route path="/rear-axle-shaft/" element={<Navigate to="/product-application/rear-axle-shaft" replace />} />
        <Route path="/gear-box-parts" element={<Navigate to="/product-application/gear-box-parts" replace />} />
        <Route path="/gear-box-parts/" element={<Navigate to="/product-application/gear-box-parts" replace />} />
        <Route path="/driveline-parts" element={<Navigate to="/product-application/driveline-parts" replace />} />
        <Route path="/driveline-parts/" element={<Navigate to="/product-application/driveline-parts" replace />} />
        <Route path="/hydraulic-parts" element={<Navigate to="/product-application/hydraulic-parts" replace />} />
        <Route path="/hydraulic-parts/" element={<Navigate to="/product-application/hydraulic-parts" replace />} />
        <Route path="/planetary-wheel-drive-parts" element={<Navigate to="/product-application/planetary-wheel-drive-parts" replace />} />
        <Route path="/planetary-wheel-drive-parts/" element={<Navigate to="/product-application/planetary-wheel-drive-parts" replace />} />

        {/* CMS Public Views */}
        <Route path="/blog" element={<BlogListPage />} />
        <Route path="/blog/:slug" element={<BlogPostPage />} />
        <Route path="/careers" element={<CareersListPage />} />
        <Route path="/careers/:slug" element={<JobDetailPage />} />

        {/* 404 Catch-All */}
        <Route path="*" element={<NotFound />} />
      </Route>

      {/* Admin Panel (Without SiteLayout header/footer) */}
      <Route
        path="/admin/*"
        element={
          <Suspense
            fallback={
              <div className="admin-page-loading">
                <LoadingSpinner message="Loading Admin Panel..." size="large" />
              </div>
            }
          >
            <AdminApp />
          </Suspense>
        }
      />
    </Routes>
  );
}
