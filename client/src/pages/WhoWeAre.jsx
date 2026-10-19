import React, { useState } from "react";
import { PageMeta } from "../components/common/PageMeta";
import "../styles/pages/who-we-are.css";

export function WhoWeAre() {
  const [activeLeader, setActiveLeader] = useState(0);

  const prevLeader = () => setActiveLeader((prev) => (prev === 0 ? 1 : 0));
  const nextLeader = () => setActiveLeader((prev) => (prev === 1 ? 0 : 1));
  return (
    <div className="page-who-we-are-container">
      <PageMeta
        title="About Emmbros Autocomp Ltd | Precision Engineering Baddi"
        description="Learn about Emmbros Autocomp Ltd, our history since 1991, leadership, and manufacturing excellence in automotive forgings."
        canonicalUrl="/who-we-are"
      />
      <a className="skip-link screen-reader-text" href="#content">
			Skip to content		</a>
	
	
	

			<div className="eal-page eal-15384">
				<div className="eal-element eal-element-c95fbce eal-flex eal-con-boxed eal-con eal-parent" id="about">
					<div className="eal-con-inner">
		<div className="eal-element eal-element-c1c1871 eal-con-full eal-flex eal-con eal-child">
		<div className="eal-element eal-element-914343b eal-con-full eal-flex eal-con eal-child">
				<div className="eal-element eal-element-0c934ad eal-widget eal-widget-image">
															<img fetchpriority="high" decoding="async" width="615" height="542" src="/assets/images/new-project-25.webp" className="attachment-full size-full " alt="Emmbros Autocomp Modern Manufacturing Plant at Baddi" />															</div>
				<div className="eal-element eal-element-8ded83f eal-absolute eal-widget eal-widget-image">
															<img decoding="async" width="544" height="410" src="/assets/images/new-project-26.webp" className="attachment-full size-full " alt="Precision Engineering Workshop and Testing Lab" />															</div>
				</div>
		<div className="eal-element eal-element-3de028b eal-con-full eal-flex eal-con eal-child">
				<div className="eal-element eal-element-f77a0c3 eal-widget eal-widget-heading">
					<h1 className="eal-heading-title eal-size-default">About Emmbros Autocomp Ltd – <span className="lblue">IATF 16949-2016</span> Certified</h1>				</div>
				<div className="eal-element eal-element-85b6eb1 eal-widget-divider--view-line eal-widget eal-widget-divider">
							<div className="eal-divider">
			<span className="eal-divider-separator">
						</span>
		</div>
						</div>
				<div className="eal-element eal-element-0a1d468 eal-widget eal-widget-text-editor">
									<p>Established in 1991, Emmbros Autocomp Ltd (EAL) was founded with a clear vision to achieve global presence and develop strong product expertise in the automotive components industry. Under the dynamic leadership of Mr. Harish Mehta, Executive Chairman of the company has consistently scaled new heights, emerging as a preferred OEM supplier in the manufacturing sector.</p><p>EAL is committed to delivering superior quality products with on-time delivery, ensuring complete customer satisfaction. Today, Emmbros Autocomp Ltd is globally recognized as a reliable engineering solutions provider, known for delivering products that offer optimum performance and durability. This success is driven by the company’s strong capabilities, dedicated workforce, and a culture rooted in integrity, discipline, and excellence.</p>								</div>
				</div>
				</div>
		<div className="eal-element eal-element-b4b0f9f eal-con-full eal-flex eal-con eal-child">
		<div className="eal-element eal-element-7aa9100 eal-con-full eal-flex eal-con eal-child">
				<div className="eal-element eal-element-2609a26 eal-widget eal-widget-text-editor">
									<p>Leveraging its deep metallurgical expertise, advanced design and engineering capabilities, and robust manufacturing processes, EAL has established a strong and credible position in the automotive industry. By consistently exceeding customer expectations, the company has become a trusted supplier of high-quality automotive components across India and global markets.</p><p>Over the years, EAL has built a formidable international reputation for product quality, precision, and adherence to specifications. The company remains fully committed to delivering highly engineered, technologically advanced, and flawlessly manufactured products that meet the highest standards of quality while maintaining competitive pricing.</p>								</div>
				</div>
				</div>
					</div>
				</div>
		<div className="eal-element eal-element-5e2917b team-slider eal-flex eal-con-boxed eal-con eal-parent" id="leadership">
			<div className="eal-con-inner" style={{"flexDirection":"column","alignItems":"center","width":"100%","maxWidth":"1200px","margin":"0 auto"}}>
				<h2 className="leadership-title-main">Leadership That Drives Progress</h2>

				<div className="leadership-card-wrapper" id="leadership-slider-container">
					
					<div className={`leadership-card ${activeLeader === 0 ? "active" : ""}`} data-slide-index="0">
						<a href="https://www.linkedin.com/company/emmbros-autocomp-limited" target="_blank" className="leadership-linkedin-btn" aria-label="LinkedIn Profile">
							<svg width="34" height="34" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
								<rect width="32" height="32" rx="6" fill="#0077B5"></rect>
								<path d="M9.2 11.5H12.4V22H9.2V11.5ZM10.8 7.25C9.75 7.25 8.9 8.1 8.9 9.15C8.9 10.2 9.75 11.05 10.8 11.05C11.85 11.05 12.7 10.2 12.7 9.15C12.7 8.1 11.85 7.25 10.8 7.25ZM14.4 11.5H17.4V12.95H17.45C17.9 12.1 19 11.2 20.65 11.2C24.05 11.2 24.7 13.45 24.7 16.35V22H21.5V17C21.5 15.8 21.48 13.9 19.8 13.9C18.1 13.9 17.85 15.25 17.85 16.9V22H14.4V11.5Z" fill="white"></path>
							</svg>
						</a>
						<div className="leadership-slide-content">
							
							<div className="leadership-text-col">
								<h3 className="leadership-member-name">Mr. Harish Mehta</h3>
								<span className="leadership-member-role">( Executive Chairman and Managing Director )</span>
								<p className="leadership-member-desc">A visionary first-generation entrepreneur, Mr. Harish Mehta founded Emmbros Autocomp Group in 1991 with a singular ambition — to build an institution defined by precision, integrity, and engineering excellence. With over four decades of distinguished experience in the automotive industry and a strong technical foundation, he has shaped the Group into a globally respected manufacturing enterprise. Guided by discipline, innovation, and uncompromising values, he continues to lead Emmbros toward sustained growth, global partnerships, and long-term industry leadership.</p>
								<p className="leadership-member-desc">Mr Harish Mehta also holds directorship in other companies namely Avlon Overseas Private Limited and P.A. Promoters and Developers Private Limited.</p>
							</div>
							
							<div className="leadership-img-col">
								<img src="/assets/images/harish-mehta.png" alt="Mr. Harish Mehta" loading="lazy" />
							</div>
						</div>
					</div>

					
					<div className={`leadership-card ${activeLeader === 1 ? "active" : ""}`} data-slide-index="1">
						<a href="https://www.linkedin.com/company/emmbros-autocomp-limited" target="_blank" className="leadership-linkedin-btn" aria-label="LinkedIn Profile">
							<svg width="34" height="34" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
								<rect width="32" height="32" rx="6" fill="#0077B5"></rect>
								<path d="M9.2 11.5H12.4V22H9.2V11.5ZM10.8 7.25C9.75 7.25 8.9 8.1 8.9 9.15C8.9 10.2 9.75 11.05 10.8 11.05C11.85 11.05 12.7 10.2 12.7 9.15C12.7 8.1 11.85 7.25 10.8 7.25ZM14.4 11.5H17.4V12.95H17.45C17.9 12.1 19 11.2 20.65 11.2C24.05 11.2 24.7 13.45 24.7 16.35V22H21.5V17C21.5 15.8 21.48 13.9 19.8 13.9C18.1 13.9 17.85 15.25 17.85 16.9V22H14.4V11.5Z" fill="white"></path>
							</svg>
						</a>
						<div className="leadership-slide-content reverse-mobile">
							
							<div className="leadership-img-col">
								<img src="/assets/images/pulkit-mehta.png" alt="Mr. Pulkit Mehta" loading="lazy" />
							</div>
							
							<div className="leadership-text-col">
								<h3 className="leadership-member-name">Mr. Pulkit Mehta</h3>
								<span className="leadership-member-role">( Whole Time Director )</span>
								<p className="leadership-desc">Mr. Pulkit Mehta is a young dynamic and energetic director and has done Master’s in International Business Marketing from university of Birmingham and has rich experience which spans over a period of 10 long years and has built global businesses in US , Asia and Europe.</p>
								<p className="leadership-desc">He looks after the finance, marketing and administration of the Company, which is the backbone of the EAL autocomp industry.</p>
								<p className="leadership-desc">He is responsible for global business growth, leading sales, marketing, strategy and the corporate development function of the company.</p>
							</div>
						</div>
					</div>
				</div>

				
				<div className="leadership-arrow-nav">
					<button type="button" onClick={prevLeader} className="leadership-arrow-btn" id="leadership-prev-btn" aria-label="Previous Leader">
						<svg width="44" height="44" viewBox="0 0 24 24" fill="white">
							<path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"></path>
						</svg>
					</button>
					<button type="button" onClick={nextLeader} className="leadership-arrow-btn" id="leadership-next-btn" aria-label="Next Leader">
						<svg width="44" height="44" viewBox="0 0 24 24" fill="white">
							<path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8-8-8z"></path>
						</svg>
					</button>
				</div>
			</div>
		</div>

		
		<div className="eal-element eal-element-fe7abbc eal-con-full eal-flex eal-con eal-parent" id="ourjourney">
		<div className="eal-element eal-element-9470eaa eal-flex eal-con-boxed eal-con eal-child">
					<div className="eal-con-inner">
				<div className="eal-element eal-element-86b2632 eal-widget eal-widget-heading">
					<h2 className="eal-heading-title eal-size-default">Our Journey of <br />
<span className="lblue">Engineering Excellence</span></h2>				</div>
					</div>
				</div>
				<div className="eal-element eal-element-b301024 eal-widget eal-widget-image">
															<img loading="lazy" decoding="async" width="1920" height="872" src="/assets/images/emm-mileston.jpg-1.webp" className="attachment-full size-full " alt="Emmbros Autocomp Historical Milestones and Expansion" />															</div>
				</div>
		<div className="eal-element eal-element-77d57ba eal-con-full eal-flex eal-con eal-parent" id="futureplan">
				<div className="eal-element eal-element-a125a6d eal-widget eal-widget-heading">
					<h2 className="eal-heading-title eal-size-default">Shaping the Next 5 Years of Innovation</h2>				</div>
				<div className="eal-element eal-element-5f72dfc eal-widget eal-widget-image">
															<img loading="lazy" decoding="async" width="8" height="109" src="/assets/images/new-project-93.webp" className="attachment-full size-full " alt="Global Supplier Excellence Award" />															</div>
		<div className="eal-element eal-element-0d37a8c eal-con-full diamond-wrap eal-flex eal-con eal-child">
				<div className="eal-element eal-element-25bd792 diamond-shape eal-position-top eal-widget eal-widget-image-box">
					<div className="eal-image-box-wrapper"><figure className="eal-image-box-img"><img loading="lazy" decoding="async" width="59" height="59" src="/assets/images/new-project-90.webp" className="attachment-full size-full " alt="Strategic Investment in Gear Commodity Infrastructure | Emmbros Autocomp" /></figure><div className="eal-image-box-content"><h3 className="eal-image-box-title">Strategic Investment in Gear Commodity Infrastructure</h3></div></div>				</div>
				<div className="eal-element eal-element-ecf6c9f diamond-shape eal-position-top eal-widget eal-widget-image-box">
					<div className="eal-image-box-wrapper"><figure className="eal-image-box-img"><img loading="lazy" decoding="async" width="59" height="59" src="/assets/images/new-project-89.webp" className="attachment-full size-full " alt="Focus on Driveline Product Category | Emmbros Autocomp" /></figure><div className="eal-image-box-content"><h3 className="eal-image-box-title">Focus on Driveline Product Category</h3></div></div>				</div>
				<div className="eal-element eal-element-c39b71b diamond-shape eal-position-top eal-widget eal-widget-image-box">
					<div className="eal-image-box-wrapper"><figure className="eal-image-box-img"><img loading="lazy" decoding="async" width="59" height="59" src="/assets/images/new-project-88.webp" className="attachment-full size-full " alt="Strategic Investment in Cardan Shaft Category | Emmbros Autocomp" /></figure><div className="eal-image-box-content"><h3 className="eal-image-box-title">Strategic Investment in Cardan Shaft Category</h3></div></div>				</div>
				<div className="eal-element eal-element-5eab52b diamond-shape eal-position-top eal-widget eal-widget-image-box">
					<div className="eal-image-box-wrapper"><figure className="eal-image-box-img"><img loading="lazy" decoding="async" width="59" height="59" src="/assets/images/icon3.webp" className="attachment-full size-full " alt="Investment in Forging &amp; Heat Treatment  Capability | Emmbros Autocomp" /></figure><div className="eal-image-box-content"><h3 className="eal-image-box-title">Investment in Forging &amp; Heat Treatment  Capability</h3></div></div>				</div>
				<div className="eal-element eal-element-466735a diamond-shape eal-position-top eal-widget eal-widget-image-box">
					<div className="eal-image-box-wrapper"><figure className="eal-image-box-img"><img loading="lazy" decoding="async" width="59" height="59" src="/assets/images/icon2.webp" className="attachment-full size-full " alt="Capex Commitment – $10 Million (INR 86 Cr) over 5 Years | Emmbros Autocomp" /></figure><div className="eal-image-box-content"><h3 className="eal-image-box-title">Capex Commitment – $10 Million (INR 86 Cr) over 5 Years</h3></div></div>				</div>
				</div>
				</div>
		<div className="eal-element eal-element-31ed04a eal-flex eal-con-boxed eal-con eal-parent" id="certification">
					<div className="eal-con-inner">
		<div className="eal-element eal-element-e9a6fd9 eal-con-full eal-flex eal-con eal-child">
				<div className="eal-element eal-element-feae8d5 eal-widget eal-widget-heading">
					<h2 className="eal-heading-title eal-size-default">Zero-Defect Manufacturing,  <span className="lblue">Globally Certified</span></h2>				</div>
				<div className="eal-element eal-element-20f95ca eal-widget eal-widget-text-editor">
									<p>Quality is embedded into every stage of Emmbros’ manufacturing process. From raw material inspection to final dispatch, our systems are designed to meet the most stringent global automotive standards.</p><p>We operate under internationally recognized certifications and follow robust quality assurance protocols to ensure <strong>dimensional accuracy, metallurgical integrity, and consistent performance</strong> across high-volume production.</p>								</div>
		<div className="eal-element eal-element-ae192e5 eal-con-full eal-flex eal-con eal-child">
				<div className="eal-element eal-element-b297ee6 eal-widget eal-widget-elementskit-team">
				<div className="eal-widget-container">
					<div className="eal-kit-wid-con">
																								<div className="profile-image-card eal-animation- eal-kit-team-img eal-kit-team-style-overlay text-center">

													<img loading="lazy" decoding="async" width="378" height="532" src="/assets/images/certificate-one.webp" className="attachment-full size-full " alt="Certificate One | Emmbros Autocomp" />												<div className="hover-area">
							<div className="profile-body">
								<h2 className="profile-title">
																	IATF 16949:2016																</h2>
								<p className="profile-designation"></p>
																<p className="profile-content">Certificate No: 50253831 IATF25
Validity:09-Oct-25 to 08-Oct-28</p>
															</div>
													</div>
					</div>
					
				
				</div>				</div>
				</div>
				<div className="eal-element eal-element-f22ff7d eal-widget eal-widget-elementskit-team">
				<div className="eal-widget-container">
					<div className="eal-kit-wid-con">
																								<div className="profile-image-card eal-animation- eal-kit-team-img eal-kit-team-style-overlay text-center">

													<img loading="lazy" decoding="async" width="378" height="532" src="/assets/images/certificate-two.webp" className="attachment-full size-full " alt="Certificate Two | Emmbros Autocomp" />												<div className="hover-area">
							<div className="profile-body">
								<h2 className="profile-title">
																	ISO 45001 : 2018																</h2>
								<p className="profile-designation"></p>
																<p className="profile-content">Certificate No.:- 50253460 OHS18
Validity : 29-Aug-2025 to 28-Aug-2028</p>
															</div>
													</div>
					</div>
					
				
				</div>				</div>
				</div>
				<div className="eal-element eal-element-7d013b5 eal-widget eal-widget-elementskit-team">
				<div className="eal-widget-container">
					<div className="eal-kit-wid-con">
																								<div className="profile-image-card eal-animation- eal-kit-team-img eal-kit-team-style-overlay text-center">

													<img loading="lazy" decoding="async" width="378" height="532" src="/assets/images/certificate-three.webp" className="attachment-full size-full " alt="Certificate Three | Emmbros Autocomp" />												<div className="hover-area">
							<div className="profile-body">
								<h2 className="profile-title">
																	ISO 14001 : 2015																</h2>
								<p className="profile-designation"></p>
																<p className="profile-content">Certificate No.:- 50253460 UM15
Validity : 29-Aug-2025 to 28- Aug-2028</p>
															</div>
													</div>
					</div>
					
				
				</div>				</div>
				</div>
				<div className="eal-element eal-element-6456d23 eal-widget eal-widget-elementskit-team">
				<div className="eal-widget-container">
					<div className="eal-kit-wid-con">
																								<div className="profile-image-card eal-animation- eal-kit-team-img eal-kit-team-style-overlay text-center">

													<img loading="lazy" decoding="async" width="378" height="532" src="/assets/images/certificate-four.webp" className="attachment-full size-full " alt="Certificate Four | Emmbros Autocomp" />												<div className="hover-area">
							<div className="profile-body">
								<h2 className="profile-title">
																	ISO 9001 : 2015																</h2>
								<p className="profile-designation"></p>
																<p className="profile-content">Certificate No.:- 50253831 QM15
Validity : 9-Oct-2025 to 8- Oct-2028</p>
															</div>
													</div>
					</div>
					
				
				</div>				</div>
				</div>
				</div>
				</div>
					</div>
				</div>
				</div>
		
     



			
					
									
							<span className="ht_ctc_chat_data" data-rest="58773fc987"></span>
							
			


    </div>
  );
}
