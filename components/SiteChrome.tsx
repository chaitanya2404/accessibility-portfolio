"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

/**
 * Renders the site-wide header + footer on every route except the home page,
 * which provides its own poster-mode chrome.
 */
export function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isHome = pathname === "/";

  if (isHome) return <>{children}</>;

  return (
    <>
      <header className="border-b border-slate-200 bg-white print:hidden">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4">
          <Link href="/" className="text-lg font-semibold tracking-tight text-slate-900">
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
      {children}
      <footer className="border-t border-slate-200 bg-slate-50 print:hidden">
        <div className="mx-auto grid max-w-6xl gap-4 px-4 py-8 text-sm text-slate-600 sm:grid-cols-[1fr_auto] sm:items-start">
          <div>
            <p className="font-semibold text-slate-900">Chaitanya Reddy Basani</p>
            <p className="mt-1">
              Built with Next.js, Radix UI, and Tailwind. Every page targets WCAG 2.1 AA.
            </p>
            <p className="mt-1">© {new Date().getFullYear()} Chaitanya Reddy Basani.</p>
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
    </>
  );
}
