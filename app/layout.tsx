import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans, Geist_Mono } from "next/font/google";
import "./globals.css";

const portfolioSans = Plus_Jakarta_Sans({
  variable: "--font-site-sans",
  subsets: ["latin"],
  display: "swap",
});

const resumeSans = Inter({
  variable: "--font-resume-sans",
  subsets: ["latin"],
  display: "swap",
});

const mono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Marcin Piniarski – Senior Frontend Engineer",
  description:
    "Senior frontend engineer focused on data-heavy UIs, design systems, and performance in modern React/TypeScript ecosystems.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${portfolioSans.variable} ${resumeSans.variable} ${mono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
