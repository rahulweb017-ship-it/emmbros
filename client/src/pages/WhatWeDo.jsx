import { TechnicalSeoSection } from "../components/seo/TechnicalSeoSection";
import React, { useState, useEffect } from "react";
import { PageMeta } from "../components/common/PageMeta";
import "../styles/pages/what-we-do.css";

export function WhatWeDo() {
  const [rdSlide, setRdSlide] = useState(0);
  const totalRdSlides = 3;

  useEffect(() => {
    const timer = setInterval(() => {
      setRdSlide((prev) => (prev + 1) % totalRdSlides);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const prevRdSlide = () => setRdSlide((prev) => (prev - 1 + totalRdSlides) % totalRdSlides);
  const nextRdSlide = () => setRdSlide((prev) => (prev + 1) % totalRdSlides);

  return (
    <div className="page-what-we-do-container">
      <PageMeta
        title="Forging Capabilities: Press & Upsetter Forged Parts | Emmbros"
        description="Explore our press forging, upsetter forging, heat treatment, and precision machining capabilities."
        canonicalUrl="/what-we-do"
      />
      <a className="skip-link screen-reader-text" href="#content">
			Skip to content		</a>
	
	
	

			<div className="eal-page eal-15533">
				<div className="eal-element eal-element-63dd90f eal-flex eal-con-boxed eal-con eal-parent">
					<div className="eal-con-inner">
		<div className="eal-element eal-element-aa03d58 eal-con-full eal-flex eal-con eal-child">
				<div className="eal-element eal-element-c649914 eal-widget eal-widget-heading">
					<h1 className="eal-heading-title eal-size-default">Advanced Facilities for Precision Forging &amp; Manufacturing</h1>				</div>
				</div>
		<div className="eal-element eal-element-bd3d370 eal-con-full eal-flex eal-con eal-child">
				<div className="eal-element eal-element-434b70c eal-widget eal-widget-text-editor">
									<p>Over the past 29 years, EAL has invested more than USD 9 million in advanced machining and infrastructure, building strong capabilities in innovative machining and forging while serving diverse industrial sectors.</p>								</div>
				</div>
					</div>
				</div>
		<div className="eal-element eal-element-f3ed725 eal-flex eal-con-boxed eal-con eal-parent" id="forging">
					<div className="eal-con-inner">
				<div className="eal-element eal-element-f825150 eal-widget eal-widget-heading">
					<h2 className="eal-heading-title eal-size-default"><span className="lblue">Forging</span>  Excellence</h2>				</div>
		<div className="eal-element eal-element-193458f e-grid eal-con-full eal-con eal-child">
		<div className="eal-element eal-element-e8596c2 eal-con-full eal-flex eal-con eal-child">
				<div className="eal-element eal-element-2233496 eal-widget eal-widget-image">
															<img fetchpriority="high" width="421" height="321" src="/assets/images/new-project-28.webp" className="attachment-full size-full " alt="Press Forging Line at Emmbros Autocomp Baddi"  loading="lazy" />															</div>
				<div className="eal-element eal-element-0143427 eal-widget eal-widget-heading">
					<h2 className="eal-heading-title eal-size-default">1600-2500 TON PRESS</h2>				</div>
				</div>
		<div className="eal-element eal-element-b2aebd1 eal-con-full eal-flex eal-con eal-child">
				<div className="eal-element eal-element-e67dc6a eal-widget eal-widget-image">
															<img width="421" height="321" src="/assets/images/new-project-27.webp" className="attachment-full size-full " alt="Heavy Duty Upsetter Forging Machinery"  loading="lazy" />															</div>
				<div className="eal-element eal-element-dedb31a eal-widget eal-widget-heading">
					<h2 className="eal-heading-title eal-size-default">UPSETTER FORGING</h2>				</div>
				</div>
		<div className="eal-element eal-element-158af82 eal-con-full eal-flex eal-con eal-child">
				<div className="eal-element eal-element-c6b124f eal-widget eal-widget-image">
															<img width="421" height="321" src="/assets/images/new-project-29.webp" className="attachment-full size-full " alt="Precision CNC Turning and Milling Center"  loading="lazy" />															</div>
				<div className="eal-element eal-element-cfa8b24 eal-widget eal-widget-heading">
					<h2 className="eal-heading-title eal-size-default">1000-1200 TON PRESS</h2>				</div>
				</div>
				</div>
					</div>
				</div>
		<div className="eal-element eal-element-31fd0c9 eal-con-full eal-flex eal-con eal-parent" id="heattreatment">
		<div className="eal-element eal-element-488d4a7 eal-con-full eal-flex eal-con eal-child">
		<div className="eal-element eal-element-a860aaf eal-con-full eal-flex eal-con eal-child">
		<div className="eal-element eal-element-d2f9849 eal-con-full eal-flex eal-con eal-child">
				<div className="eal-element eal-element-bd594d1 eal-widget eal-widget-heading">
					<h2 className="eal-heading-title eal-size-default">Continuous Heat Treatment –   Normalizing &amp; Iso-Annealing</h2>				</div>
				<div className="eal-element eal-element-30a7aa2 eal-widget eal-widget-image">
															<img width="299" height="14" src="/assets/images/new-project-96.webp" className="attachment-full size-full " alt="Emmbros Precision Component - What We Do"  loading="lazy" />															</div>
				</div>
				</div>
		<div className="eal-element eal-element-cc0f486 eal-con-full eal-flex eal-con eal-child">
				<div className="eal-element eal-element-5e832f2 eal-widget eal-widget-image">
															<img width="581" height="353" src="/assets/images/new-project-30.webp" className="attachment-full size-full " alt="Emmbros Precision Component - What We Do"  loading="lazy" />															</div>
				<div className="eal-element eal-element-0b58818 eal-widget eal-widget-image">
															<img width="581" height="353" src="/assets/images/new-project-31-1.webp" className="attachment-full size-full " alt="Emmbros Precision Component - What We Do"  loading="lazy" />															</div>
				</div>
				</div>
				</div>
		<div className="eal-element eal-element-ab7829f eal-flex eal-con-boxed eal-con eal-parent" id="manufacturing">
					<div className="eal-con-inner">
				<div className="eal-element eal-element-54cb560 eal-widget eal-widget-heading">
					<h2 className="eal-heading-title eal-size-default"><span className="lblue">Manufacturing</span> Capabilities </h2>				</div>
				<div className="eal-element eal-element-e1b5865 gallery-spacing-custom eal-widget eal-widget-image-gallery">
							<div className="eal-image-gallery">
			<div id="gallery-1" className="gallery galleryid-15533 gallery-columns-4 gallery-size-full"><figure className="gallery-item">
			<div className="gallery-icon landscape">
				<a href="/assets/images/new-project-97.webp"><img width="314" height="237" src="/assets/images/new-project-97.webp" className="attachment-full size-full" alt="Heavy Vehicle Forged Components" aria-describedby="gallery-1-15554"  loading="lazy" /></a>
			</div>
				<figcaption className="wp-caption-text gallery-caption" id="gallery-1-15554">
				CNC TURNING
				</figcaption></figure><figure className="gallery-item">
			<div className="gallery-icon landscape">
				<a href="/assets/images/new-project-98.webp"><img width="314" height="237" src="/assets/images/new-project-98.webp" className="attachment-full size-full" alt="Commercial Vehicle Precision Parts" aria-describedby="gallery-1-15553"  loading="lazy" /></a>
			</div>
				<figcaption className="wp-caption-text gallery-caption" id="gallery-1-15553">
				CNC GRINDING MACHINE
				</figcaption></figure><figure className="gallery-item">
			<div className="gallery-icon landscape">
				<a href="/assets/images/new-project-99.webp"><img width="314" height="237" src="/assets/images/new-project-99.webp" className="attachment-full size-full" alt="Tractor Transmission Components" aria-describedby="gallery-1-15552"  loading="lazy" /></a>
			</div>
				<figcaption className="wp-caption-text gallery-caption" id="gallery-1-15552">
				VMC MILLING
				</figcaption></figure><figure className="gallery-item">
			<div className="gallery-icon landscape">
				<a href="/assets/images/new-project-100.webp"><img width="314" height="237" src="/assets/images/new-project-100.webp" className="attachment-full size-full" alt="Off-Highway Drivetrain Forgings" aria-describedby="gallery-1-15551"  loading="lazy" /></a>
			</div>
				<figcaption className="wp-caption-text gallery-caption" id="gallery-1-15551">
				GUNDRILL MACHINE
				</figcaption></figure><figure className="gallery-item">
			<div className="gallery-icon landscape">
				<a href="/assets/images/new-project-2026-03-13t171015.962.webp"><img width="314" height="237" src="/assets/images/new-project-2026-03-13t171015.962.webp" className="attachment-full size-full" alt="2026 03 13T171015.962 | Emmbros Autocomp" aria-describedby="gallery-1-15558"  loading="lazy" /></a>
			</div>
				<figcaption className="wp-caption-text gallery-caption" id="gallery-1-15558">
				AUTOMATIC Straightening PRess
				</figcaption></figure><figure className="gallery-item">
			<div className="gallery-icon landscape">
				<a href="/assets/images/new-project-2026-03-13t171027.121.webp"><img width="314" height="237" src="/assets/images/new-project-2026-03-13t171027.121.webp" className="attachment-full size-full" alt="2026 03 13T171027.121 | Emmbros Autocomp" aria-describedby="gallery-1-15557"  loading="lazy" /></a>
			</div>
				<figcaption className="wp-caption-text gallery-caption" id="gallery-1-15557">
				GEAR HOBBING 
				</figcaption></figure><figure className="gallery-item">
			<div className="gallery-icon landscape">
				<a href="/assets/images/new-project-2026-03-13t171036.679.webp"><img width="314" height="237" src="/assets/images/new-project-2026-03-13t171036.679.webp" className="attachment-full size-full" alt="2026 03 13T171036.679 | Emmbros Autocomp" aria-describedby="gallery-1-15556"  loading="lazy" /></a>
			</div>
				<figcaption className="wp-caption-text gallery-caption" id="gallery-1-15556">
				Induction Hardening machine
				</figcaption></figure><figure className="gallery-item">
			<div className="gallery-icon landscape">
				<a href="/assets/images/new-project-2026-03-13t171049.248.webp"><img width="314" height="237" src="/assets/images/new-project-2026-03-13t171049.248.webp" className="attachment-full size-full" alt="2026 03 13T171049.248 | Emmbros Autocomp" aria-describedby="gallery-1-15555"  loading="lazy" /></a>
			</div>
				<figcaption className="wp-caption-text gallery-caption" id="gallery-1-15555">
				Broaching Machine
				</figcaption></figure>
		</div>
		</div>
						</div>
					</div>
				</div>
		<div className="eal-element eal-element-aa9645b eal-flex eal-con-boxed eal-con eal-parent" id="qualitylab">
					<div className="eal-con-inner">
				<div className="eal-element eal-element-224b117 eal-widget eal-widget-heading">
					<h2 className="eal-heading-title eal-size-default">Quality Lab Processes &amp; Facilities</h2>				</div>
				<div className="eal-element eal-element-93f76de gallery-spacing-custom eal-widget eal-widget-image-gallery">
							<div className="eal-image-gallery">
			<div id="gallery-2" className="gallery galleryid-15533 gallery-columns-5 gallery-size-full"><figure className="gallery-item">
			<div className="gallery-icon portrait">
				<a href="/assets/images/new-project-2026-03-13t173043.862.webp"><img width="300" height="385" src="/assets/images/new-project-2026-03-13t173043.862.webp" className="attachment-full size-full" alt="2026 03 13T173043.862 | Emmbros Autocomp" aria-describedby="gallery-2-15568"  loading="lazy" /></a>
			</div>
				<figcaption className="wp-caption-text gallery-caption" id="gallery-2-15568">
				Microscope
				</figcaption></figure><figure className="gallery-item">
			<div className="gallery-icon portrait">
				<a href="/assets/images/new-project-2026-03-13t173126.625.webp"><img width="300" height="385" src="/assets/images/new-project-2026-03-13t173126.625.webp" className="attachment-full size-full" alt="2026 03 13T173126.625 | Emmbros Autocomp" aria-describedby="gallery-2-15567"  loading="lazy" /></a>
			</div>
				<figcaption className="wp-caption-text gallery-caption" id="gallery-2-15567">
				SHAFT SCOPE
				</figcaption></figure><figure className="gallery-item">
			<div className="gallery-icon portrait">
				<a href="/assets/images/new-project-2026-03-13t174148.884.webp"><img width="300" height="385" src="/assets/images/new-project-2026-03-13t174148.884.webp" className="attachment-full size-full" alt="2026 03 13T174148.884 | Emmbros Autocomp" aria-describedby="gallery-2-15566"  loading="lazy" /></a>
			</div>
				<figcaption className="wp-caption-text gallery-caption" id="gallery-2-15566">
				kLINGELNBERG GEAR  TESTER P40-1500mm
				</figcaption></figure><figure className="gallery-item">
			<div className="gallery-icon portrait">
				<a href="/assets/images/new-project-2026-03-13t174211.260.webp"><img width="300" height="385" src="/assets/images/new-project-2026-03-13t174211.260.webp" className="attachment-full size-full" alt="2026 03 13T174211.260 | Emmbros Autocomp" aria-describedby="gallery-2-15565"  loading="lazy" /></a>
			</div>
				<figcaption className="wp-caption-text gallery-caption" id="gallery-2-15565">
				utm
				</figcaption></figure><figure className="gallery-item">
			<div className="gallery-icon portrait">
				<a href="/assets/images/new-project-2026-03-13t174231.734.webp"><img width="300" height="385" src="/assets/images/new-project-2026-03-13t174231.734.webp" className="attachment-full size-full" alt="2026 03 13T174231.734 | Emmbros Autocomp" aria-describedby="gallery-2-15564"  loading="lazy" /></a>
			</div>
				<figcaption className="wp-caption-text gallery-caption" id="gallery-2-15564">
				Hardness Tester
				</figcaption></figure><figure className="gallery-item">
			<div className="gallery-icon portrait">
				<a href="/assets/images/new-project-2026-03-13t174253.161.webp"><img width="300" height="385" src="/assets/images/new-project-2026-03-13t174253.161.webp" className="attachment-full size-full" alt="2026 03 13T174253.161 | Emmbros Autocomp" aria-describedby="gallery-2-15563"  loading="lazy" /></a>
			</div>
				<figcaption className="wp-caption-text gallery-caption" id="gallery-2-15563">
				CMM
				</figcaption></figure><figure className="gallery-item">
			<div className="gallery-icon portrait">
				<a href="/assets/images/new-project-2026-03-13t174308.361.webp"><img width="300" height="385" src="/assets/images/new-project-2026-03-13t174308.361.webp" className="attachment-full size-full" alt="2026 03 13T174308.361 | Emmbros Autocomp" aria-describedby="gallery-2-15562"  loading="lazy" /></a>
			</div>
				<figcaption className="wp-caption-text gallery-caption" id="gallery-2-15562">
				2-D HEIGHT MASTER
				</figcaption></figure><figure className="gallery-item">
			<div className="gallery-icon portrait">
				<a href="/assets/images/new-project-2026-03-13t174321.900.webp"><img width="300" height="385" src="/assets/images/new-project-2026-03-13t174321.900.webp" className="attachment-full size-full" alt="2026 03 13T174321.900 | Emmbros Autocomp" aria-describedby="gallery-2-15561"  loading="lazy" /></a>
			</div>
				<figcaption className="wp-caption-text gallery-caption" id="gallery-2-15561">
				Spectro meter
				</figcaption></figure><figure className="gallery-item">
			<div className="gallery-icon portrait">
				<a href="/assets/images/new-project-2026-03-13t174339.702.webp"><img width="300" height="385" src="/assets/images/new-project-2026-03-13t174339.702.webp" className="attachment-full size-full" alt="2026 03 13T174339.702 | Emmbros Autocomp" aria-describedby="gallery-2-15560"  loading="lazy" /></a>
			</div>
				<figcaption className="wp-caption-text gallery-caption" id="gallery-2-15560">
				CONTRACER
				</figcaption></figure><figure className="gallery-item">
			<div className="gallery-icon portrait">
				<a href="/assets/images/new-project-2026-03-13t174353.032.webp"><img width="300" height="385" src="/assets/images/new-project-2026-03-13t174353.032.webp" className="attachment-full size-full" alt="2026 03 13T174353.032 | Emmbros Autocomp" aria-describedby="gallery-2-15559"  loading="lazy" /></a>
			</div>
				<figcaption className="wp-caption-text gallery-caption" id="gallery-2-15559">
				Micro Vicker
				</figcaption></figure>
		</div>
		</div>
						</div>
					</div>
				</div>
		<div className="eal-element eal-element-db5c83d eal-flex eal-con-boxed eal-con eal-parent" id="packaging">
					<div className="eal-con-inner">
				<div className="eal-element eal-element-be26634 eal-widget eal-widget-heading">
					<h2 className="eal-heading-title eal-size-default">Packaging</h2>				</div>
				<div className="eal-element eal-element-e56b29f gallery-spacing-custom eal-widget eal-widget-image-gallery">
							<div className="eal-image-gallery">
			<div id="gallery-3" className="gallery galleryid-15533 gallery-columns-3 gallery-size-full"><figure className="gallery-item">
			<div className="gallery-icon landscape">
				<a href="/assets/images/manu-packing3.webp"><img width="350" height="250" src="/assets/images/manu-packing3.webp" className="attachment-full size-full" alt="Export Packaging and Despatch Facility"  loading="lazy" /></a>
			</div></figure><figure className="gallery-item">
			<div className="gallery-icon landscape">
				<a href="/assets/images/manu-packing2.webp"><img width="350" height="250" src="/assets/images/manu-packing2.webp" className="attachment-full size-full" alt="Coordinate Measuring Machine CMM Quality Inspection"  loading="lazy" /></a>
			</div></figure><figure className="gallery-item">
			<div className="gallery-icon landscape">
				<a href="/assets/images/manu-packing1.webp"><img width="350" height="250" src="/assets/images/manu-packing1.webp" className="attachment-full size-full" alt="Automated Cleaning and Surface Finishing Unit"  loading="lazy" /></a>
			</div></figure>
		</div>
		</div>
						</div>
					</div>
				</div>
		<div className="eal-element eal-element-5dce8f8 eal-flex eal-con-boxed eal-con eal-parent" id="research">
					<div className="eal-con-inner">
		<div className="eal-element eal-element-bba3e59 eal-con-full eal-flex eal-con eal-child">
		<div className="eal-element eal-element-5ed695d eal-con-full eal-flex eal-con eal-child">
				<div className="eal-element eal-element-e10fa7d eal-arrows-position-inside eal-widget eal-widget-image-carousel">
							<div className="eal-image-carousel-wrapper swiper swiper-initialized swiper-horizontal" role="region" aria-roledescription="carousel" aria-label="Image Carousel" dir="ltr" style={{ position: "relative", overflow: "hidden" }}>
			<div className="eal-image-carousel swiper-wrapper" aria-live="off" style={{ display: "flex", transform: `translate3d(-${rdSlide * 100}%, 0, 0)`, transition: "transform 500ms ease" }}>
								<div className="swiper-slide" role="group" aria-roledescription="slide" aria-label="1 of 3" style={{ width: "100%", flexShrink: 0 }}><figure className="swiper-slide-inner"><img className="swiper-slide-image" src="/assets/images/image-1-r-d.jpg.webp" alt="Emmbros Autocomp Research and Development CAD/CAM Engineering Lab" width="600" height="400" loading="lazy" /></figure></div><div className="swiper-slide" role="group" aria-roledescription="slide" aria-label="2 of 3" style={{ width: "100%", flexShrink: 0 }}><figure className="swiper-slide-inner"><img className="swiper-slide-image" src="/assets/images/image-3-r-d.jpg.webp" alt="Metallurgical Testing and Product Simulation at Emmbros R&D Center" width="600" height="400" loading="lazy" /></figure></div><div className="swiper-slide" role="group" aria-roledescription="slide" aria-label="3 of 3" style={{ width: "100%", flexShrink: 0 }}><figure className="swiper-slide-inner"><img className="swiper-slide-image" src="/assets/images/gemini_generated_image_lqorgilqorgilqor.jpg.webp" alt="3D Forging Die Design and Finite Element Analysis at Emmbros Autocomp" width="600" height="400" loading="lazy" /></figure></div>			</div>
												<div className="eal-swiper-button eal-swiper-button-prev" role="button" tabIndex="0" onClick={prevRdSlide}>
						<i aria-hidden="true" className="eicon-chevron-left"></i>					</div>
					<div className="eal-swiper-button eal-swiper-button-next" role="button" tabIndex="0" onClick={nextRdSlide}>
						<i aria-hidden="true" className="eicon-chevron-right"></i>					</div>
				
									</div>
						</div>
				</div>
		<div className="eal-element eal-element-1aeed8e eal-con-full eal-flex eal-con eal-child">
				<div className="eal-element eal-element-e94f37c eal-widget eal-widget-heading">
					<h2 className="eal-heading-title eal-size-default"><span className="lblue">Research</span> &amp; Development </h2>				</div>
				<div className="eal-element eal-element-362d674 eal-widget eal-widget-text-editor">
									<p>At Emmbros Autocomp Ltd., innovation is at the core of everything we do. Our world-class Research &amp; Development center combines advanced engineering expertise with cutting-edge technologies to deliver high-performance automotive components.</p><p>Powered by leading CAD/CAM platforms like SolidWorks and Siemens simulation, we accelerate product development while maintaining exceptional precision. Our 3D simulation capabilities enable virtual validation and optimization of forging processes, ensuring maximum efficiency and minimal material wastage.</p><p>From concept to completion, our integrated infrastructure—including a modern design center, advanced testing laboratory, in-house tool room, and CNC &amp; VMC machining facilities—ensures complete control over quality, speed, and innovation.</p>								</div>
				</div>
				</div>
		<div className="eal-element eal-element-6c0b8c9 eal-con-full eal-flex eal-con eal-child">
				<div className="eal-element eal-element-90df6ec eal-widget eal-widget-text-editor">
									<p>Our dedicated R&amp;D team continuously pushes boundaries to develop complex, high-quality components within the shortest turnaround time, making us a trusted partner in automotive manufacturing.</p>								</div>
				</div>
					</div>
				</div>
		<div className="eal-element eal-element-b5893da eal-flex eal-con-boxed eal-con eal-parent" id="csr-activity">
					<div className="eal-con-inner">
		<div className="eal-element eal-element-ec8e5e5 eal-con-full eal-flex eal-con eal-child">
				<div className="eal-element eal-element-fb4af5a eal-widget eal-widget-heading">
					<h2 className="eal-heading-title eal-size-default">CSR ACTIVITIES</h2>				</div>
				</div>
		<div className="eal-element eal-element-b4f3d3c eal-con-full eal-flex eal-con eal-child">
				<div className="eal-element eal-element-de4e40b gallery-spacing-custom eal-widget eal-widget-image-gallery">
							<div className="eal-image-gallery">
			<div id="gallery-4" className="gallery galleryid-15533 gallery-columns-4 gallery-size-full"><figure className="gallery-item">
			<div className="gallery-icon portrait">
				<a href="/assets/images/whatsapp-image-2026-03-11-at-2.11.29-pm-copy-copy.webp"><img width="960" height="1280" src="/assets/images/whatsapp-image-2026-03-11-at-2.11.29-pm-copy-copy.webp" className="attachment-full size-full" alt="Induction Hardening and Heat Treatment Facility"  loading="lazy" /></a>
			</div></figure><figure className="gallery-item">
			<div className="gallery-icon portrait">
				<a href="/assets/images/new-project-34-1.webp"><img width="960" height="1280" src="/assets/images/new-project-34-1.webp" className="attachment-full size-full" alt="Hot Forging Press Line"  loading="lazy" /></a>
			</div></figure><figure className="gallery-item">
			<div className="gallery-icon portrait">
				<a href="/assets/images/new-project-33-1.webp"><img width="960" height="1280" src="/assets/images/new-project-33-1.webp" className="attachment-full size-full" alt="Billet Induction Heating Furnace"  loading="lazy" /></a>
			</div></figure><figure className="gallery-item">
			<div className="gallery-icon portrait">
				<a href="/assets/images/new-project-32.webp"><img width="960" height="1280" src="/assets/images/new-project-32.webp" className="attachment-full size-full" alt="Closed Die Forging Hammer Facility"  loading="lazy" /></a>
			</div></figure>
		</div>
		</div>
						</div>
				</div>
		<div className="eal-element eal-element-f5730eb eal-con-full eal-flex eal-con eal-child">
				<div className="eal-element eal-element-151fed2 gallery-spacing-custom eal-widget eal-widget-image-gallery">
							<div className="eal-image-gallery">
			<div id="gallery-5" className="gallery galleryid-15533 gallery-columns-4 gallery-size-full"><figure className="gallery-item">
			<div className="gallery-icon landscape">
				<a href="/assets/images/new-project-35.webp"><img width="600" height="400" src="/assets/images/new-project-35.webp" className="attachment-full size-full" alt="Vertical Machining Center VMC Facility"  loading="lazy" /></a>
			</div></figure><figure className="gallery-item">
			<div className="gallery-icon landscape">
				<a href="/assets/images/new-project-36-1.webp"><img width="600" height="400" src="/assets/images/new-project-36-1.webp" className="attachment-full size-full" alt="CNC Spline Hobbing Facility"  loading="lazy" /></a>
			</div></figure><figure className="gallery-item">
			<div className="gallery-icon landscape">
				<a href="/assets/images/new-project-37.webp"><img width="600" height="400" src="/assets/images/new-project-37.webp" className="attachment-full size-full" alt="Optical Emission Spectrometer Testing"  loading="lazy" /></a>
			</div></figure><figure className="gallery-item">
			<div className="gallery-icon landscape">
				<a href="/assets/images/new-project-38-1.webp"><img width="600" height="400" src="/assets/images/new-project-38-1.webp" className="attachment-full size-full" alt="Magnetic Particle Crack Testing"  loading="lazy" /></a>
			</div></figure>
		</div>
		</div>
						</div>
				</div>
		<div className="eal-element eal-element-dd96a8e eal-con-full eal-flex eal-con eal-child">
				<div className="eal-element eal-element-25a3b83 gallery-spacing-custom eal-widget eal-widget-image-gallery">
							<div className="eal-image-gallery">
			<div id="gallery-6" className="gallery galleryid-15533 gallery-columns-4 gallery-size-full"><figure className="gallery-item">
			<div className="gallery-icon landscape">
				<a href="/assets/images/new-project-41-1.webp"><img width="1080" height="1080" src="/assets/images/new-project-41-1.webp" className="attachment-full size-full" alt="Metallurgical Microstructure Laboratory"  loading="lazy" /></a>
			</div></figure><figure className="gallery-item">
			<div className="gallery-icon landscape">
				<a href="/assets/images/new-project-40-1.webp"><img width="1080" height="1080" src="/assets/images/new-project-40-1.webp" className="attachment-full size-full" alt="Precision Gear Inspection System"  loading="lazy" /></a>
			</div></figure><figure className="gallery-item">
			<div className="gallery-icon landscape">
				<a href="/assets/images/img-20240610-wa0001.webp"><img width="1080" height="1080" src="/assets/images/img-20240610-wa0001.webp" className="attachment-full size-full" alt="Img 20240610 Wa0001 | Emmbros Autocomp"  loading="lazy" /></a>
			</div></figure><figure className="gallery-item">
			<div className="gallery-icon landscape">
				<a href="/assets/images/new-project-42-1.webp"><img width="1080" height="1080" src="/assets/images/new-project-42-1.webp" className="attachment-full size-full" alt="Ultrasonic Testing Testing Facility"  loading="lazy" /></a>
			</div></figure>
		</div>
		</div>
						</div>
				</div>
		<div className="eal-element eal-element-d71629d eal-con-full eal-flex eal-con eal-child">
				<div className="eal-element eal-element-102255f eal-widget eal-widget-video">
							<div className="e-hosted-video eal-wrapper eal-open-inline">
					<video className="eal-video" src="/assets/videos/whatsapp-video-2026-03-11-at-4.28.01-pm-1.mp4" controls="" preload="metadata" controlslist="nodownload"></video>
				</div>
						</div>
				<div className="eal-element eal-element-8127aee eal-widget eal-widget-video">
							<div className="e-hosted-video eal-wrapper eal-open-inline">
					<video className="eal-video" src="/assets/videos/whatsapp-video-2026-03-11-at-4.28.07-pm.mp4" controls="" preload="metadata" controlslist="nodownload"></video>
				</div>
						</div>
				</div>
					</div>
				</div>
				</div>
		
     



			
					
									
							<span className="ht_ctc_chat_data" data-rest="58773fc987"></span>
							
			


      <TechnicalSeoSection sectionKey="what-we-do" />
    </div>
  );
}
