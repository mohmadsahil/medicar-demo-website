import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { ConsentProvider } from "@/contexts/ConsentContext";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import AnumatiConsent from "@/components/consent/AnumatiConsent";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: {
    default: "MediCare Plus Hospital — Mumbai | Multi-Specialty Healthcare",
    template: "%s | MediCare Plus Hospital",
  },
  description:
    "MediCare Plus is a NABH-accredited multi-specialty hospital in Mumbai offering world-class care in Cardiology, Neurology, Oncology, Orthopedics, and more. DPDP Act 2023 compliant.",
  keywords: [
    "hospital",
    "multi-specialty",
    "Mumbai",
    "healthcare",
    "NABH",
    "doctors",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} scroll-smooth`}>
      <head>
        <link rel="preconnect" href="https://cdn.digitalanumati.com" />
        <link rel="preconnect" href="https://uat-apis.digitalanumati.com" />
        {/* <script
          src="http://localhost:4173/anumati-blocker.js"
          data-site-key={process.env.NEXT_PUBLIC_DA_SITE_KEY ?? "APP_medicare_1781873589878"}
        ></script> */}
      </head>
      <body className="min-h-screen flex flex-col font-sans antialiased bg-gray-50 text-gray-900">
        <AuthProvider>
          <ConsentProvider>
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
            <AnumatiConsent />
          </ConsentProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
