import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { AuthProvider } from "@/context/AuthContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Demo — Build What Matters",
  description: "Enterprise-grade platform for modern teams.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <script src="https://demo.digitalanumati.com/widget.iife.js" data-token="U2FsdGVkX1_4h-289MpF1fZmfABHyTJRNHyPyc3mKjkwk8WUI9CYRA6tT2N_0Ky0"></script>
      </head>
      <body className={`${inter.className} bg-gray-50 text-gray-900 min-h-screen`}>
        <AuthProvider>
          <Navbar />
          <main>{children}</main>
          <footer className="bg-gray-900 text-gray-400 mt-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
                <div className="md:col-span-2">
                  <span className="text-xl font-bold text-white">Demo</span>
                  <p className="mt-3 text-sm leading-relaxed max-w-xs">
                    Building enterprise-grade software solutions for teams that demand reliability,
                    security, and performance.
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-300 uppercase tracking-wide mb-4">Company</h4>
                  <ul className="space-y-2 text-sm">
                    <li><a href="/" className="hover:text-white transition-colors">Home</a></li>
                    <li><a href="/careers" className="hover:text-white transition-colors">Careers</a></li>
                    <li><a href="/contact" className="hover:text-white transition-colors">Contact</a></li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-300 uppercase tracking-wide mb-4">Account</h4>
                  <ul className="space-y-2 text-sm">
                    <li><a href="/login" className="hover:text-white transition-colors">Sign In</a></li>
                    <li><a href="/login" className="hover:text-white transition-colors">Create Account</a></li>
                    <li><a href="/profile" className="hover:text-white transition-colors">Profile</a></li>
                  </ul>
                </div>
              </div>
              <div className="border-t border-gray-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                <p>© {new Date().getFullYear()} Demo Technologies. All rights reserved.</p>
                <div className="flex gap-4">
                  <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                  <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
                </div>
              </div>
            </div>
          </footer>
        </AuthProvider>
      </body>
    </html>
  );
}
