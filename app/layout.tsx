import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { ConsentProvider } from "@/contexts/ConsentContext";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

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
        <script src="https://demo.digitalanumati.com/anumati-dpdp-consent-v1.js"></script>
        <script
          src="https://demo.digitalanumati.com/anumati-blocker.js"
          data-site-key="APP_medicare-plus-website_1784093284509"
        ></script>
      </head>
      <body className="min-h-screen flex flex-col font-sans antialiased bg-gray-50 text-gray-900">
        <AuthProvider>
          <ConsentProvider>
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </ConsentProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
