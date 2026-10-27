import React, { useState, useEffect } from "react";
import { VideoModal } from "../components/common/VideoModal";
import { PageMeta } from "../components/common/PageMeta";
import "../styles/pages/home.css";

export function Home() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [videoOpen, setVideoOpen] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % 4);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setActiveSlide((prev) => (prev + 1) % 4);
  const prevSlide = () => setActiveSlide((prev) => (prev - 1 + 4) % 4);
  return (
    <div className="page-home-container">
      <PageMeta
        title="Emmbros Autocomp Ltd | Auto Parts Mfr in Baddi, HP"
        description="IATF 16949 certified rear axle shaft & driveline parts manufacturer in Baddi, HP since 1991. Trusted OEM supplier to Tata, Leyland & global clients worldwide"
        canonicalUrl="/"
      />
      <a className="skip-link screen-reader-text" href="#content">
			Skip to content		</a>
	
	
	

			<div className="eal-page eal-14418">
				
				<div id="emmbros-hero-slider" className="emmbros-hero-slider">
					
					<div className={`hero-slide ${activeSlide === 0 ? "active" : ""}`}>
						<img src="/assets/images/slide-1.webp" alt="Precision Engineered Shafts &amp; Components" className="hero-slide-bg" width="1920" height="857" fetchpriority="high" />
						<div className="hero-overlay"></div>
						<div className="hero-content-wrapper">
							<h1 className="hero-title">Precision Engineered
Shafts &amp; Components</h1>
							<p className="hero-subtitle">High performance solution for demanding applications.
Durable, Relaible, built exact specification.</p>
						</div>
					</div>

					
					<div className={`hero-slide ${activeSlide === 1 ? "active" : ""}`}>
						<img src="/assets/images/slide-2.webp" alt="Established Since 1991" className="hero-slide-bg" width="1920" height="857" />
						<div className="hero-overlay"></div>
						<div className="hero-content-wrapper">
							<div className="hero-title" role="heading" aria-level="2">Established Since 1991</div>
							<p className="hero-subtitle">Delivering precision-engineered components with over three decades of manufacturing excellence, trusted by OEMs worldwide.</p>
						</div>
					</div>

					
					<div className={`hero-slide ${activeSlide === 2 ? "active" : ""}`}>
						<img src="/assets/images/slide-3.webp" alt="Forging Our Way to On-Time Delivery" className="hero-slide-bg" width="1920" height="864" />
						<div className="hero-overlay"></div>
						<div className="hero-content-wrapper">
							<div className="hero-title" role="heading" aria-level="2">Forging Our Way to<br />On-Time Delivery</div>
							<p className="hero-subtitle">Every component forged with precision. Every deadline met with confidence.</p>
						</div>
					</div>

					
					<div className={`hero-slide ${activeSlide === 3 ? "active" : ""}`}>
						<img src="/assets/images/slide-4.webp" alt="State-of-the-Art Machining for Consistent Quality" className="hero-slide-bg" width="1920" height="857" />
						<div className="hero-overlay"></div>
						<div className="hero-content-wrapper">
							<div className="hero-title" role="heading" aria-level="2">State-of-the-Art Machining for Consistent Quality</div>
							<p className="hero-subtitle">Advanced machining technology delivering exceptional accuracy, repeatability, and quality in every component.</p>
						</div>
					</div>

					
					<button type="button" onClick={prevSlide} className="hero-arrow hero-arrow-prev" aria-label="Previous Slide">
						<svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M15 19l-7-7 7-7"></path></svg>
					</button>
					<button type="button" onClick={nextSlide} className="hero-arrow hero-arrow-next" aria-label="Next Slide">
						<svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M9 5l7 7-7 7"></path></svg>
					</button>

					
					<div className="hero-dots-container" role="tablist" aria-label="Slide navigation">
    {[0, 1, 2, 3].map((idx) => (
      <button
        key={idx}
        type="button"
        className={`hero-dot ${activeSlide === idx ? "active" : ""}`}
        onClick={() => setActiveSlide(idx)}
        aria-label={`Go to slide ${idx + 1}`}
      />
    ))}
  </div>
				</div>

				

				<div className="eal-element eal-element-d101812 eal-hidden-desktop eal-hidden-tablet eal-flex eal-con-boxed eal-con eal-parent">
					<div className="eal-con-inner">
					</div>
				</div>
		<div className="eal-element eal-element-9b3e949 eal-con-full eal-hidden-mobile eal-flex eal-con eal-parent">
				</div>
		<div className="eal-element eal-element-a6238ff eal-flex eal-con-boxed eal-con eal-parent">
					<div className="eal-con-inner">
		<div className="eal-element eal-element-95796ff eal-con-full eal-flex eal-con eal-child">
		<div className="eal-element eal-element-272099e eal-con-full eal-flex eal-con eal-child">
				<div className="eal-element eal-element-f417dc9 eal-absolute e-transform eal-widget eal-widget-heading">
					<h2 className="eal-heading-title eal-size-default">Emmbros <span className="lblue">Autocomp</span></h2>				</div>
				<div className="eal-element eal-element-d66a6a4 eal-widget eal-widget-image">
															<img fetchpriority="high" width="1920" height="870" src="/assets/images/hero-img-1.webp" className="attachment-full size-full " alt="Emmbros Autocomp Ltd" />															</div>
				</div>
		<div className="eal-element eal-element-ce3074a eal-con-full e-grid eal-con eal-child">
				<div className="eal-element eal-element-e6a1fc6 eal-widget eal-widget-image">
															<img width="737" height="469" src="/assets/images/katha-plant-image.jpg-e1770114833911.webp" className="attachment-full size-full " alt="Emmbros Autocomp Ltd Katha Plant" />															</div>
				<div className="eal-element eal-element-ab7a5aa eal-widget eal-widget-image">
															<img width="1038" height="557" src="/assets/images/new-emm-image.jpg.webp" className="attachment-full size-full " alt="Emmbros Autocomp Ltd" />															</div>
				</div>
				</div>
		<div className="eal-element eal-element-f737db8 eal-con-full eal-flex eal-con eal-child">
				<div className="eal-element eal-element-7c5cf92 eal-widget eal-widget-heading">
					<h2 className="eal-heading-title eal-size-default">Established Since 1991</h2>				</div>
				<div className="eal-element eal-element-bc08e03 eal-widget eal-widget-text-editor">
									<p>Since 1991, Emmbros Autocomp Ltd has built a strong reputation as a reliable manufacturer of high-quality automotive components, delivering advanced engineered solutions to leading global OEMs. Moreover, backed by deep metallurgical expertise and integrated design and manufacturing capabilities, we consistently produce components that meet the highest standards of performance, reliability, and durability.</p><p><strong>Our Credentials &amp; Reach</strong></p><p>We are committed to maintaining the highest standards of quality, environmental responsibility, and workplace safety across all our operations. As a result, our certifications reflect our dedication to excellence and continuous improvement.</p>								</div>
				<div className="eal-element eal-element-ebeb47f eal-icon-list--layout-traditional eal-list-item-link-full_width eal-widget eal-widget-icon-list">
							<ul className="eal-icon-list-items">
							<li className="eal-icon-list-item">
											<span className="eal-icon-list-icon">
							<i aria-hidden="true" className="fas fa-check"></i>						</span>
										<span className="eal-icon-list-text">Certified ISO 9001&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: 2015  Quality Management System</span>
									</li>
								<li className="eal-icon-list-item">
											<span className="eal-icon-list-icon">
							<i aria-hidden="true" className="fas fa-check"></i>						</span>
										<span className="eal-icon-list-text">Certified ISO 14001 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: 2015 Environmental Management System</span>
									</li>
								<li className="eal-icon-list-item">
											<span className="eal-icon-list-icon">
							<i aria-hidden="true" className="fas fa-check"></i>						</span>
										<span className="eal-icon-list-text">Certified IATF 16949&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: 2016 Automotive Quality Management System</span>
									</li>
								<li className="eal-icon-list-item">
											<span className="eal-icon-list-icon">
							<i aria-hidden="true" className="fas fa-check"></i>						</span>
										<span className="eal-icon-list-text">Certified IATF ISO 45001 : 2018 Occupational Health &amp; Safety Management System</span>
									</li>
						</ul>
						</div>
				<div className="eal-element eal-element-2f126e3 custom-btn eal-widget eal-widget-button">
										<a className="eal-button eal-button-link eal-size-sm eal-animation-wobble-to-bottom-right" href="/who-we-are/">
						<span className="eal-button-content-wrapper">
						<span className="eal-button-icon">
				<i aria-hidden="true" className=" arrow_right-up"></i>			</span>
									<span className="eal-button-text">Read More</span>
					</span>
					</a>
								</div>
				</div>
					</div>
				</div>
		<div className="eal-element eal-element-82e786f eal-flex eal-con-boxed eal-con eal-parent">
					<div className="eal-con-inner">
				<div className="eal-element eal-element-fd683d4 eal-widget eal-widget-heading">
					<h2 className="eal-heading-title eal-size-default">Emmbros Autocomp Ltd</h2>				</div>
				<div className="eal-element eal-element-5a5b7a3 eal-widget eal-widget-heading">
					<h2 className="eal-heading-title eal-size-default"><span className="lblue">Driving the</span> Future with Purpose &amp; Precision</h2>				</div>
				<div className="eal-element eal-element-2094b03 eal-widget__width-initial eal-widget-divider--view-line eal-widget eal-widget-divider">
							<div className="eal-divider">
			<span className="eal-divider-separator">
						</span>
		</div>
						</div>
		<div className="eal-element eal-element-cd62c4c eal-con-full eal-flex eal-con eal-child">
		<div className="eal-element eal-element-10ca68d eal-con-full eal-flex eal-con eal-child">
		<div className="eal-element eal-element-56b3fbc eal-con-full eal-flex eal-con eal-child">
		<div className="eal-element eal-element-9d96a4d eal-con-full eal-flex eal-con eal-child">
				<div className="eal-element eal-element-b5725e3 eal-widget eal-widget-heading">
					<h2 className="eal-heading-title eal-size-default">Our Vision</h2>				</div>
				<div className="eal-element eal-element-bebf0ef eal-widget eal-widget-text-editor">
									<p>To be a sustainable, quality-driven, profitable, and employee-centric organization.</p>								</div>
				</div>
				</div>
		<div className="eal-element eal-element-46627ea eal-con-full eal-flex eal-con eal-child">
		<div className="eal-element eal-element-ab30bc6 eal-con-full eal-flex eal-con eal-child">
				<div className="eal-element eal-element-7e5f4a4 eal-widget__width-auto eal-widget eal-widget-image">
															<img width="95" height="83" src="/assets/images/new-project-48.webp" className="attachment-full size-full " alt="Emmbros Certified Quality and Engineering Excellence" />															</div>
				</div>
				</div>
				</div>
		<div className="eal-element eal-element-a6ac7db eal-con-full eal-flex eal-con eal-child">
		<div className="eal-element eal-element-e7239a8 eal-con-full eal-flex eal-con eal-child">
		<div className="eal-element eal-element-7c161b8 eal-con-full eal-flex eal-con eal-child">
				<div className="eal-element eal-element-419b58b eal-widget eal-widget-heading">
					<h2 className="eal-heading-title eal-size-default">Our Mission</h2>				</div>
				<div className="eal-element eal-element-6c1959a eal-widget eal-widget-text-editor">
									<p>To have a sales portfolio of 15% in futuristic markets such as Wind Power &amp; EV Components.</p>								</div>
				</div>
				</div>
		<div className="eal-element eal-element-e417c2e eal-con-full eal-flex eal-con eal-child">
		<div className="eal-element eal-element-7b26640 eal-con-full eal-flex eal-con eal-child">
				<div className="eal-element eal-element-c19d425 eal-widget__width-auto eal-widget eal-widget-image">
															<img width="85" height="85" src="/assets/images/new-project-49.webp" className="attachment-full size-full " alt="Global Supply Capabilities and On-Time Delivery" />															</div>
				</div>
				</div>
				</div>
				</div>
				<div className="eal-element eal-element-1ac83ea eal-widget-divider--view-line eal-widget eal-widget-divider">
							<div className="eal-divider">
			<span className="eal-divider-separator">
						</span>
		</div>
						</div>
					</div>
				</div>
		<div className="eal-element eal-element-89db8ac eal-con-full eal-flex eal-con eal-parent">
		<div className="eal-element eal-element-16dbb98 eal-flex eal-con-boxed eal-con eal-child">
					<div className="eal-con-inner">
		<div className="eal-element eal-element-8909240 eal-con-full eal-flex eal-con eal-child">
				<div className="eal-element eal-element-4cd4661 eal-widget eal-widget-heading">
					<h2 className="eal-heading-title eal-size-default">Our Product Application</h2>				</div>
				</div>
		<div className="eal-element eal-element-ecc2fd8 eal-con-full eal-flex eal-con eal-child">
				<div className="eal-element eal-element-bd6dd27 eal-widget eal-widget-text-editor">
									<p>We specialize in precision-engineered drivetrain and transmission components used across a wide range of commercial, agricultural, and off-highway vehicles. Specifically, our portfolio spans the following categories:</p>								</div>
				</div>
					</div>
				</div>
				<div className="eal-element eal-element-6182752 eal-widget eal-widget-spacer">
							<div className="eal-spacer">
			<div className="eal-spacer-inner"></div>
		</div>
						</div>
		<div className="eal-element eal-element-29ea24b e-grid eal-con-full bg-blur eal-con eal-child">
				<div className="eal-element eal-element-00cee11 eal-position-top eal-widget eal-widget-image-box">
					<div className="eal-image-box-wrapper"><figure className="eal-image-box-img"><a href="/product-application/front-axle-shaft/" tabIndex="-1"><img width="540" height="297" src="/assets/images/front-axle.webp" className="attachment-full size-full " alt="Front Axle Parts" /></a></figure><div className="eal-image-box-content"><h4 className="eal-image-box-title"><a href="/product-application/front-axle-shaft/">Front Axle Parts</a></h4></div></div>				</div>
				<div className="eal-element eal-element-a969ac3 eal-position-top eal-widget eal-widget-image-box">
					<div className="eal-image-box-wrapper"><figure className="eal-image-box-img"><a href="/product-application/rear-axle-shaft/" tabIndex="-1"><img width="540" height="297" src="/assets/images/rear-axle.webp" className="attachment-full size-full " alt="Rear Axle Parts" /></a></figure><div className="eal-image-box-content"><h4 className="eal-image-box-title"><a href="/product-application/rear-axle-shaft/">Rear Axle Parts</a></h4></div></div>				</div>
				<div className="eal-element eal-element-e84fbd2 eal-position-top eal-widget eal-widget-image-box">
					<div className="eal-image-box-wrapper"><figure className="eal-image-box-img"><a href="/product-application/gear-box-parts/" tabIndex="-1"><img width="540" height="297" src="/assets/images/gear-box.webp" className="attachment-full size-full " alt="Gear Box Parts" /></a></figure><div className="eal-image-box-content"><h4 className="eal-image-box-title"><a href="/product-application/gear-box-parts/">Gear Box Parts</a></h4></div></div>				</div>
				<div className="eal-element eal-element-144c414 eal-position-top eal-widget eal-widget-image-box">
					<div className="eal-image-box-wrapper"><figure className="eal-image-box-img"><a href="/product-application/driveline-parts/" tabIndex="-1"><img width="540" height="297" src="/assets/images/driveline.webp" className="attachment-full size-full " alt="Driveline Parts" /></a></figure><div className="eal-image-box-content"><h3 className="eal-image-box-title"><a href="/product-application/driveline-parts/">Driveline Parts</a></h3></div></div>				</div>
				<div className="eal-element eal-element-8d0a95c eal-position-top eal-widget eal-widget-image-box">
					<div className="eal-image-box-wrapper"><figure className="eal-image-box-img"><a href="/product-application/hydraulic-parts/" tabIndex="-1"><img width="540" height="297" src="/assets/images/hydraulics.webp" className="attachment-full size-full " alt="Hydraulics Parts" /></a></figure><div className="eal-image-box-content"><h3 className="eal-image-box-title"><a href="/product-application/hydraulic-parts/">Hydraulic Parts</a></h3></div></div>				</div>
				<div className="eal-element eal-element-b887957 eal-position-top eal-widget eal-widget-image-box">
					<div className="eal-image-box-wrapper"><figure className="eal-image-box-img"><a href="/product-application/planetary-wheel-drive-parts/" tabIndex="-1"><img width="540" height="297" src="/assets/images/planetary-wheel-drive.webp" className="attachment-full size-full " alt="Planetary Wheel Drive Parts" /></a></figure><div className="eal-image-box-content"><h3 className="eal-image-box-title"><a href="/product-application/planetary-wheel-drive-parts/">Planetary Wheel Drive Parts</a></h3></div></div>				</div>
				</div>
				</div>
		<div className="eal-element eal-element-4b05a61 eal-flex eal-con-boxed eal-con eal-parent">
					<div className="eal-con-inner">
				<div className="eal-element eal-element-cced60c eal-widget eal-widget-heading">
					<h2 className="eal-heading-title eal-size-default"><span className="lblue">Inside Emmbros :</span> Engineering Excellence in Motion</h2>				</div>
		<div className="eal-element eal-element-878c2d1 eal-con-full eal-flex eal-con eal-child">
				<div className="eal-element eal-element-d58f45c eal-widget eal-widget-video">
							<div className="eal-wrapper eal-open-inline">
			<div className="eal-custom-embed-image-overlay" onClick={() => setVideoOpen(true)} style={{ cursor: "pointer" }}>
				<img
					src="/assets/images/image-7.webp"
					alt="Inside Emmbros - Engineering Excellence in Motion"
					className="eal-custom-embed-image"
					width="1280"
					height="720"
				/>
				<div className="eal-custom-embed-play" role="button" aria-label="Play Video" tabIndex="0">
					<i aria-hidden="true" className="eicon-play"></i>
				</div>
			</div>
					</div>
						</div>
				</div>
					</div>
				</div>
		<div className="eal-element eal-element-7c20077 eal-flex eal-con-boxed eal-con eal-parent">
					<div className="eal-con-inner">
		<div className="eal-element eal-element-f9feb4a eal-con-full eal-flex eal-con eal-child">
		<div className="eal-element eal-element-c30b2f8 eal-con-full eal-flex eal-con eal-child">
				<div className="eal-element eal-element-2c8e3bf eal-widget eal-widget-heading">
					<h2 className="eal-heading-title eal-size-default">Built for Every 
<br />Demanding Sector</h2>				</div>
				</div>
		<div className="eal-element eal-element-6ee8184 eal-con-full eal-flex eal-con eal-child">
				<div className="eal-element eal-element-1629c7e eal-widget eal-widget-text-editor">
									<p>Emmbros Autocomp Ltd specializes in manufacturing precision-engineered components designed to deliver reliable performance under extreme loads, harsh operating conditions, and continuous duty cycles. As a result, our products are widely used across heavy vehicles and industrial machinery, where strength, durability, and precision are critical to operational success. In particular, we serve the following sectors:</p>								</div>
				</div>
				</div>
				<div className="eal-element eal-element-94be42b eal-widget eal-widget-spacer">
							<div className="eal-spacer">
			<div className="eal-spacer-inner"></div>
		</div>
						</div>
		<div className="eal-element eal-element-8aea452 e-grid eal-con-full eal-con eal-child">
		<div className="eal-element eal-element-cb0ce20 eal-con-full eal-flex eal-con eal-child">
				<div className="eal-element eal-element-46c4e80 eal-position-top eal-widget eal-widget-image-box">
					<div className="eal-image-box-wrapper"><figure className="eal-image-box-img"><img width="128" height="128" src="/assets/images/new-project-40.webp" className="attachment-full size-full " alt="Aggriculture parts" /></figure><div className="eal-image-box-content"><h3 className="eal-image-box-title">Agriculture</h3></div></div>				</div>
				</div>
		<div className="eal-element eal-element-f45720f eal-con-full eal-flex eal-con eal-child">
				<div className="eal-element eal-element-e5520f7 eal-position-top eal-widget eal-widget-image-box">
					<div className="eal-image-box-wrapper"><figure className="eal-image-box-img"><img width="128" height="128" src="/assets/images/new-project-2026-03-28t161357.419.webp" className="attachment-full size-full " alt="Commercial Vehicle parts" /></figure><div className="eal-image-box-content"><h3 className="eal-image-box-title">Commercial Vehicles</h3><p className="eal-image-box-description">
</p></div></div>				</div>
				</div>
		<div className="eal-element eal-element-0122f15 eal-con-full eal-flex eal-con eal-child">
				<div className="eal-element eal-element-6f115e6 eal-position-top eal-widget eal-widget-image-box">
					<div className="eal-image-box-wrapper"><figure className="eal-image-box-img"><img width="128" height="128" src="/assets/images/new-project-43.webp" className="attachment-full size-full " alt="Construction Equpiment" /></figure><div className="eal-image-box-content"><h3 className="eal-image-box-title">Construction Equipment</h3><p className="eal-image-box-description">
</p></div></div>				</div>
				</div>
		<div className="eal-element eal-element-90de240 eal-con-full eal-flex eal-con eal-child">
				<div className="eal-element eal-element-dfe81bb eal-position-top eal-widget eal-widget-image-box">
					<div className="eal-image-box-wrapper"><figure className="eal-image-box-img"><img width="128" height="128" src="/assets/images/new-project-41.webp" className="attachment-full size-full " alt="Warehousing &amp; Material Handling Parts" /></figure><div className="eal-image-box-content"><h3 className="eal-image-box-title">Warehousing &amp; Material Handling</h3></div></div>				</div>
				</div>
		<div className="eal-element eal-element-42c20d9 eal-con-full eal-flex eal-con eal-child">
				<div className="eal-element eal-element-d2f2671 eal-position-top eal-widget eal-widget-image-box">
					<div className="eal-image-box-wrapper"><figure className="eal-image-box-img"><img width="128" height="128" src="/assets/images/new-project-42.webp" className="attachment-full size-full " alt="Wind Energy parts" /></figure><div className="eal-image-box-content"><h3 className="eal-image-box-title">Wind Energy</h3></div></div>				</div>
				</div>
				</div>
					</div>
				</div>
				<section className="eal-section eal-top-section eal-element eal-element-26baab eal-section-boxed eal-section-height-default eal-section-height-default">
						<div className="eal-container eal-column-gap-default">
					<div className="eal-column eal-col-100 eal-top-column eal-element eal-element-2b072d71">
			<div className="eal-widget-wrap eal-element-populated">
						<section className="eal-section eal-inner-section eal-element eal-element-6b4a8759 eal-section-boxed eal-section-height-default eal-section-height-default">
						<div className="eal-container eal-column-gap-default">
					<div className="eal-column eal-col-100 eal-inner-column eal-element eal-element-3eb7c794">
			<div className="eal-widget-wrap eal-element-populated">
						<div className="eal-element eal-element-a9ef764 eal-widget eal-widget-heading">
					<h2 className="eal-heading-title eal-size-default">Emmbros Autocomp Ltd</h2>				</div>
				<div className="eal-element eal-element-77b77211 eal-widget eal-widget-heading">
					<h2 className="eal-heading-title eal-size-default"><span className="lblue">Trusted By</span> Leading Brands Worldwide</h2>				</div>
					</div>
		</div>
					</div>
		</section>
		<div className="eal-element eal-element-44f9d05 eal-flex eal-con-boxed eal-con eal-parent">
					<div className="eal-con-inner">
				<div className="eal-element eal-element-88ddc31 eal-widget eal-widget-image">
															<img width="248" height="100" src="/assets/images/new-project-30-1.webp" className="attachment-full size-full " alt="Emmbros Autocomp Precision Manufacturing Plant" />															</div>
				<div className="eal-element eal-element-1babde9 eal-widget eal-widget-image">
															<img width="400" height="100" src="/assets/images/new-project-31.webp" className="attachment-full size-full " alt="Engineering Products to Perfection" />															</div>
				<div className="eal-element eal-element-465b47e eal-widget eal-widget-image">
															<img width="243" height="100" src="/assets/images/new-project-37-1.webp" className="attachment-full size-full " alt="37 1 | Emmbros Autocomp" />															</div>
				<div className="eal-element eal-element-61286c2 eal-widget eal-widget-image">
															<img width="193" height="100" src="/assets/images/new-project-2026-04-27t154744.797.webp" className="attachment-full size-full " alt="2026 04 27T154744.797 | Emmbros Autocomp" />															</div>
				<div className="eal-element eal-element-9fe4351 eal-widget eal-widget-image">
															<img width="400" height="100" src="/assets/images/new-project-33.webp" className="attachment-full size-full " alt="Emmbros Precision Component - Home" />															</div>
					</div>
				</div>
		<div className="eal-element eal-element-463ace5 eal-flex eal-con-boxed eal-con eal-parent">
					<div className="eal-con-inner">
				<div className="eal-element eal-element-751be3a eal-widget eal-widget-image">
															<img width="400" height="100" src="/assets/images/new-project-34.webp" className="attachment-full size-full " alt="Emmbros Precision Component - Home" />															</div>
				<div className="eal-element eal-element-1ed1645 eal-widget eal-widget-image">
															<img width="400" height="100" src="/assets/images/new-project-39.webp" className="attachment-full size-full " alt="Precision Automotive Shaft Forgings" />															</div>
				<div className="eal-element eal-element-b8b3755 eal-widget eal-widget-image">
															<img width="400" height="100" src="/assets/images/new-project-36.webp" className="attachment-full size-full " alt="Emmbros Precision Component - Home" />															</div>
				<div className="eal-element eal-element-f18e3c5 eal-widget eal-widget-image">
															<img width="352" height="100" src="/assets/images/kubota.webp" className="attachment-full size-full " alt="Kubota | Emmbros Autocomp" />															</div>
				<div className="eal-element eal-element-fe5ba27 eal-widget eal-widget-image">
															<img width="193" height="100" src="/assets/images/new-project-2026-04-27t154818.164.webp" className="attachment-full size-full " alt="2026 04 27T154818.164 | Emmbros Autocomp" />															</div>
					</div>
				</div>
					</div>
		</div>
					</div>
		</section>
		<div className="eal-element eal-element-3d1d7bc eal-flex eal-con-boxed eal-con eal-parent">
					<div className="eal-con-inner">
				<div className="eal-element eal-element-be50ad4 eal-widget eal-widget-heading">
					<h3 className="eal-heading-title eal-size-default">Emmbros Autocomp Ltd</h3>				</div>
				<div className="eal-element eal-element-a909677 eal-widget eal-widget-heading">
					<h2 className="eal-heading-title eal-size-default"><span className="lblue">Serving</span> OEMs Across Continents</h2>				</div>
				<div className="eal-element eal-element-fa2ee92 eal-widget eal-widget-text-editor">
									<p>Emmbros Autocomp Ltd is a globally trusted supplier, serving customers across <strong>India, USA, Europe, and Asia.</strong> Furthermore, with a balanced export and domestic portfolio, we support leading OEMs in agriculture, construction, wind energy, and automotive sectors. Ultimately, our global footprint is backed by strong logistics, consistent quality, and long-term partnerships built on trust and performance.</p>								</div>
				<div className="eal-element eal-element-d555c14 eal-widget eal-widget-image">
															<img width="1064" height="515" src="/assets/images/new-project-53.webp" className="attachment-full size-full " alt="Emmbros Autocomp Ltd" />															</div>
					</div>
				</div>
				</div>
		
     



			
					
									
							<span className="ht_ctc_chat_data" data-rest="58773fc987"></span>
							
			


    </div>
  );
}
