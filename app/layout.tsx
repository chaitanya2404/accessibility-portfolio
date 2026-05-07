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
  title: {
    template: "%s · Chaitanya Reddy Basani",
    default: "Chaitanya Reddy Basani — Full Stack Developer",
  },
  description:
    "Full Stack Developer with 7+ years building accessible, responsive web applications across healthcare, finance, and higher education.",
  metadataBase: new URL("https://accessibility-portfolio.vercel.app"),
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
        <header className="border-b border-slate-200 bg-white print:hidden">
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4">
            <Link
              href="/"
              className="text-lg font-semibold tracking-tight text-slate-900"
            >
              Chaitanya Reddy Basani
            </Link>
            <nav aria-label="Primary">
              <ul className="flex gap-4 text-sm font-medium text-slate-700 sm:gap-6">
                <li>
                  <Link href="/#projects" className="hover:text-slate-900">
                    Projects
                  </Link>
                </li>
                <li>
                  <Link href="/#experience" className="hover:text-slate-900">
                    Experience
                  </Link>
                </li>
                <li>
                  <Link href="/#contact" className="hover:text-slate-900">
                    Contact
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </header>
        <main id="main-content" className="flex-1">
          {children}
        </main>
        <footer className="border-t border-slate-200 bg-slate-50 print:hidden">
          <div className="mx-auto grid max-w-6xl gap-4 px-4 py-8 text-sm text-slate-600 sm:grid-cols-[1fr_auto] sm:items-start">
            <div>
              <p className="font-semibold text-slate-900">Chaitanya Reddy Basani</p>
              <p className="mt-1">
                Built with Next.js, Radix UI, and Tailwind. Every page targets
                WCAG 2.1 AA.
              </p>
              <p className="mt-1">
                © {new Date().getFullYear()} Chaitanya Reddy Basani.
              </p>
            </div>
            <nav aria-label="Footer">
              <ul className="flex flex-wrap gap-x-4 gap-y-2 sm:justify-end">
                <li><Link href="/#about" className="hover:text-slate-900">About</Link></li>
                <li><Link href="/#skills" className="hover:text-slate-900">Skills</Link></li>
                <li><Link href="/#experience" className="hover:text-slate-900">Experience</Link></li>
                <li><Link href="/#projects" className="hover:text-slate-900">Projects</Link></li>
                <li><Link href="/#contact" className="hover:text-slate-900">Contact</Link></li>
                <li>
                  <a
                    href="https://github.com/chaitanya2404"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-slate-900"
                  >
                    GitHub
                  </a>
                </li>
              </ul>
            </nav>
          </div>
        </footer>
        </LiveRegionProvider>
      </body>
    </html>
  );
}
