import type { Metadata } from "next";
import { About } from "./_components/home/About";
import { A11yStatement } from "./_components/home/A11yStatement";
import { Contact } from "./_components/home/Contact";
import { Experience } from "./_components/home/Experience";
import { Hero } from "./_components/home/Hero";
import { Projects } from "./_components/home/Projects";
import { Skills } from "./_components/home/Skills";

export const metadata: Metadata = {
  title: "Chaitanya Reddy Basani — Full Stack Developer",
  description:
    "Full Stack Developer with 7+ years building accessible, responsive web applications across healthcare, finance, and higher education.",
  openGraph: {
    title: "Chaitanya Reddy Basani — Full Stack Developer",
    description:
      "Accessibility-first portfolio: five live projects, WCAG 2.1 AA, and a 63-test Playwright + axe-core suite.",
    type: "profile",
    url: "https://accessibility-portfolio.vercel.app/",
    siteName: "Chaitanya Reddy Basani",
  },
  twitter: {
    card: "summary_large_image",
    title: "Chaitanya Reddy Basani — Full Stack Developer",
    description:
      "Accessibility-first portfolio: five live projects, WCAG 2.1 AA.",
  },
};

export default function Home() {
  return (
    <>
      <Hero />
      <div className="mx-auto max-w-5xl space-y-16 px-4 py-16">
        <About />
        <Skills />
        <Experience />
        <Projects />
        <A11yStatement />
        <Contact />
      </div>
    </>
  );
}
