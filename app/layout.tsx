import type { Metadata } from "next";
import { Geist, Geist_Mono, JetBrains_Mono } from "next/font/google";
import { LiveRegionProvider } from "@/components/LiveRegion";
import { SiteChrome } from "@/components/SiteChrome";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
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
      className={`${geistSans.variable} ${geistMono.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-surface text-fg">
        <LiveRegionProvider>
          <a href="#main-content" className="skip-link">
            Skip to main content
          </a>
          <SiteChrome>
            <main id="main-content" className="flex-1">
              {children}
            </main>
          </SiteChrome>
        </LiveRegionProvider>
      </body>
    </html>
  );
}
