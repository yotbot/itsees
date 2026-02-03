import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ClientLayout from "./components/ClientLayout";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Itsees | Web Development Partner",
  description:
    "Independent web developer creating engaging digital experiences. Custom websites, hosting, and strategic guidance to help your business thrive online.",
  keywords: [
    "web development",
    "web design",
    "Next.js",
    "React",
    "frontend development",
    "custom websites",
  ],
  authors: [{ name: "Itsees" }],
  openGraph: {
    title: "Itsees | Web Development Partner",
    description:
      "Independent web developer creating engaging digital experiences.",
    type: "website",
    locale: "en_US",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
