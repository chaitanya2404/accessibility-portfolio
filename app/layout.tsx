import type { Metadata } from "next";
import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";
import { LiveRegionProvider } from "@/components/LiveRegion";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Accessibility-First Portfolio",
  description:
    "A three-project Next.js portfolio demonstrating accessible UI patterns: a department hub, a component library, and an accessibility audit tool.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-surface text-fg">
        <LiveRegionProvider>
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        <header className="border-b border-slate-200 bg-white">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
            <Link
              href="/"
              className="text-lg font-semibold tracking-tight text-slate-900"
            >
              Accessibility Portfolio
            </Link>
            <nav aria-label="Primary">
              <ul className="flex gap-6 text-sm font-medium text-slate-700">
                <li>
                  <Link href="/projects/division-hub" className="hover:text-slate-900">
                    Division Hub
                  </Link>
                </li>
                <li>
                  <Link href="/projects/components" className="hover:text-slate-900">
                    Components
                  </Link>
                </li>
                <li>
                  <Link href="/projects/a11y-audit" className="hover:text-slate-900">
                    A11y Audit
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </header>
        <main id="main-content" className="flex-1">
          {children}
        </main>
        <footer className="border-t border-slate-200 bg-slate-50">
          <div className="mx-auto max-w-6xl px-4 py-6 text-sm text-slate-600">
            <p>
              Built with Next.js, Radix UI, and Tailwind. Every page targets
              WCAG 2.1 AA.
            </p>
          </div>
        </footer>
        </LiveRegionProvider>
      </body>
    </html>
  );
}
