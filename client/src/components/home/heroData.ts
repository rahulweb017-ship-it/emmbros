export interface SlideData {
  id: number;
  image: string;
  heading: string;
  subHeading: string;
  buttonText: string;
  buttonLink: string;
}

export const HERO_SLIDES: SlideData[] = [
  {
    id: 1,
    image: "/assets/images/slide-1.webp",
    heading: "Precision Engineered\nShafts & Components",
    subHeading: "High performance solution for demanding applications.\nDurable, Relaible, built exact specification.",
    buttonText: "Contact us",
    buttonLink: "tel:+919816931822",
  },
  {
    id: 2,
    image: "/assets/images/slide-2.webp",
    heading: "Established Since 1991",
    subHeading: "Delivering precision-engineered components with over three decades of manufacturing excellence, trusted by OEMs worldwide.",
    buttonText: "Contact us",
    buttonLink: "tel:+919816931822",
  },
  {
    id: 3,
    image: "/assets/images/slide-3.webp",
    heading: "Forging Our Way to On-Time Delivery",
    subHeading: "Every component forged with precision. Every deadline met with confidence.",
    buttonText: "Contact us",
    buttonLink: "tel:+919816931822",
  },
  {
    id: 4,
    image: "/assets/images/slide-4.webp",
    heading: "State-of-the-Art Machining for Consistent Quality",
    subHeading: "Advanced machining technology delivering exceptional accuracy, repeatability, and quality in every component.",
    buttonText: "Contact us",
    buttonLink: "tel:+919816931822",
  },
];
