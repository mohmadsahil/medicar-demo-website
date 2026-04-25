
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Script from "next/script";
import ClientLayout from "@/components/ClientLayout";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Hospital Portal - Consent Management Demo",
  description:
    "Hospital-style demo platform for appointment and healthcare consent workflows.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* Google Tag Manager */}
        <Script id="gtm-script" strategy="afterInteractive">
          {`
        (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
        new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
        j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
        'https://www.googletagmanager.com/gtm.js?id=GTM-TPDNB3HH'+dl;f.parentNode.insertBefore(j,f);
        })(window,document,'script','dataLayer','GTM-TPDNB3HH');
      `}
        </Script>
      </head>
      <body
        className={`${inter.className} bg-gray-50 text-gray-900 min-h-screen`}
      >
        <script
          src="https://consent-management-uat.abym.us/widget.iife.js"
          data-view="consent-detail"
          data-target-id="consent-detail-root"
          data-consent-id="U2FsdGVkX19-PIZWz_0nW4qr8-CQP81Y-rDD6Q59VSAFrZijLLWhuvKoVbZChfjavcSJSiC8tvEOvk_7ZoKTVNvpsunk8Gt1ASTIkCsF5ZyPfERriB2xRuZKTLjtxqlqTn42uEetJgHy5fhSNNq1_UDZpgkHYZIdkUpg8ylzGnEpV4-eC922t34DgbXJPPNZv66D1PPlkvdPKUVJYM8Hsy_lJYNU90UmppQ-gJYVCNhJNFYh5Scsp0dCMuIViF6Whv8zL4s73enzO5fsT7MHjw"
          data-token="U2FsdGVkX1_lcP5OgT-_9AAsaoTkQrgi9dirQwWFLCTSJp1DLucg5YUThAS-I9qv"
        ></script>
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-TPDNB3HH"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        <ClientLayout>
          <main>{children}</main>
          <footer className="bg-gray-900 text-gray-400 mt-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
                <div className="md:col-span-2">
                  <span className="text-xl font-bold text-white">
                    Hospital Portal
                  </span>
                  <p className="mt-3 text-sm leading-relaxed max-w-xs">
                    A demo platform for patient appointment workflows,
                    multilingual consent capture, and transparent
                    data-processing disclosures.
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-300 uppercase tracking-wide mb-4">
                    Company
                  </h4>
                  <ul className="space-y-2 text-sm">
                    <li>
                      <a
                        href="/"
                        className="hover:text-white transition-colors"
                      >
                        Home
                      </a>
                    </li>
                    <li>
                      <a
                        href="/consent-demo"
                        className="hover:text-white transition-colors"
                      >
                        Consent Demo
                      </a>
                    </li>
                    <li>
                      <a
                        href="/contact"
                        className="hover:text-white transition-colors"
                      >
                        Contact
                      </a>
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-300 uppercase tracking-wide mb-4">
                    Account
                  </h4>
                  <ul className="space-y-2 text-sm">
                    <li>
                      <a
                        href="/login"
                        className="hover:text-white transition-colors"
                      >
                        Sign In
                      </a>
                    </li>
                    <li>
                      <a
                        href="/login"
                        className="hover:text-white transition-colors"
                      >
                        Create Account
                      </a>
                    </li>
                    <li>
                      <a
                        href="/profile"
                        className="hover:text-white transition-colors"
                      >
                        Profile
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="border-t border-gray-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                <p>
                  © {new Date().getFullYear()} Digital Anumati Hospital Portal
                  Demo. All rights reserved.
                </p>
                <div className="flex gap-4">
                  <a href="#" className="hover:text-white transition-colors">
                    Privacy Policy
                  </a>
                  <a href="#" className="hover:text-white transition-colors">
                    Terms of Service
                  </a>
                </div>
              </div>
            </div>
          </footer>
        </ClientLayout>
      </body>
    </html>
  );
}
