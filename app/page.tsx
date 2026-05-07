import type { Metadata } from "next";
import { About } from "./_components/home/About";
import { Contact } from "./_components/home/Contact";
import { Experience } from "./_components/home/Experience";
import { Hero } from "./_components/home/Hero";
import { HomeFooter } from "./_components/home/HomeFooter";
import { HomeNav } from "./_components/home/HomeNav";
import { Projects } from "./_components/home/Projects";
import { Skills } from "./_components/home/Skills";
import { PAPER_THEME, T } from "./_components/home/theme";

export const metadata: Metadata = {
  title: "Chaitanya Reddy Basani — Full Stack Developer",
  description:
    "Full Stack Developer with 7+ years building accessible, responsive web applications across healthcare, finance, and higher education.",
  openGraph: {
    title: "Chaitanya Reddy Basani — Full Stack Developer",
    description:
      "Editorial portfolio: five live projects, mono typography end-to-end, WCAG 2.1 AA.",
    type: "profile",
    url: "https://accessibility-portfolio.vercel.app/",
    siteName: "Chaitanya Reddy Basani",
  },
  twitter: {
    card: "summary_large_image",
    title: "Chaitanya Reddy Basani — Full Stack Developer",
    description: "Editorial portfolio: five live projects, WCAG 2.1 AA.",
  },
};

export default function Home() {
  return (
    <div
      style={{
        background: PAPER_THEME.bg,
        color: PAPER_THEME.ink,
        fontFamily: T.bodyFont,
        minHeight: "100%",
      }}
    >
      <style>{`
        body { background: ${PAPER_THEME.bg}; }
        .home-root *::selection { background: ${PAPER_THEME.accent}; color: ${PAPER_THEME.accentInk}; }
        @media (max-width: 720px) {
          .home-about-split { grid-template-columns: minmax(0, 1fr) !important; gap: 24px !important; }
          .home-about-facts { grid-template-columns: repeat(2, minmax(0, 1fr)) !important; }
          .home-projects-featured { grid-template-columns: minmax(0, 1fr) !important; }
          .home-contact-grid { grid-template-columns: minmax(0, 1fr) !important; gap: 32px !important; }
        }
      `}</style>
      <div className="home-root">
        <HomeNav />
        <Hero />
        <About />
        <Skills />
        <Experience />
        <Projects />
        <Contact />
        <HomeFooter />
      </div>
    </div>
  );
}
