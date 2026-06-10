import Link from "next/link";
import { Phone, Mail, MapPin, Clock, Shield } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 py-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
        {/* Brand */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-9 h-9 bg-sky-500 rounded-lg flex items-center justify-center text-white font-bold">M+</div>
            <div>
              <div className="text-white font-bold leading-tight">MediCare Plus</div>
              <div className="text-xs text-gray-400">Multi-Specialty Hospital</div>
            </div>
          </div>
          <p className="text-sm text-gray-400 leading-relaxed mb-4">
            Delivering world-class healthcare with compassion since 2008. NABH Accredited. JCI Certified.
          </p>
          <div className="flex items-center gap-2 text-xs bg-sky-900/40 border border-sky-800 rounded-lg px-3 py-2">
            <Shield size={13} className="text-sky-400 shrink-0" />
            <span className="text-sky-300">DPDP Act 2023 Compliant Data Fiduciary</span>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wide">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            {[
              ["About Us", "/about"],
              ["Departments", "/departments"],
              ["Our Doctors", "/doctors"],
              ["Health Packages", "/health-packages"],
              ["Services", "/services"],
              ["Patient Portal", "/portal"],
              ["Book Appointment", "/appointments/book"],
              ["Grievance Portal", "/grievance"],
            ].map(([label, href]) => (
              <li key={href}>
                <Link href={href} className="hover:text-sky-400 transition-colors">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Data Rights */}
        <div>
          <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wide">Your Data Rights</h3>
          <ul className="space-y-2 text-sm">
            {[
              ["Consent Dashboard", "/consent/dashboard"],
              ["Consent History", "/consent/history"],
              ["Consent Preferences", "/consent/preferences"],
              ["Privacy Policy", "/privacy-policy"],
              ["File Grievance", "/grievance"],
            ].map(([label, href]) => (
              <li key={href}>
                <Link href={href} className="hover:text-sky-400 transition-colors">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-4 text-xs text-gray-500 leading-relaxed">
            Under the Digital Personal Data Protection Act 2023, you have the right to access, correct, and erase your personal data.
          </div>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wide">Contact Us</h3>
          <ul className="space-y-3 text-sm">
            <li className="flex gap-2">
              <MapPin size={15} className="text-sky-400 shrink-0 mt-0.5" />
              <span>123 Healthcare Avenue, Bandra West, Mumbai 400050, Maharashtra</span>
            </li>
            <li className="flex gap-2">
              <Phone size={15} className="text-sky-400 shrink-0" />
              <div>
                <div>+91-22-4567-8900</div>
                <div className="text-xs text-gray-500">Emergency: 1800-MED-PLUS (24/7)</div>
              </div>
            </li>
            <li className="flex gap-2">
              <Mail size={15} className="text-sky-400 shrink-0" />
              <div>
                <div>support@medicare.example</div>
                <div className="text-xs text-gray-500">DPO: dpo@medicare.example</div>
              </div>
            </li>
            <li className="flex gap-2">
              <Clock size={15} className="text-sky-400 shrink-0" />
              <div>
                <div>OPD: 8am – 8pm</div>
                <div className="text-xs text-gray-500">Emergency: 24/7</div>
              </div>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-gray-800 py-5 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-gray-500">
          <span>© {new Date().getFullYear()} MediCare Plus Hospital. All rights reserved.</span>
          <div className="flex gap-4">
            <Link href="/privacy-policy" className="hover:text-gray-300">Privacy Policy</Link>
            <Link href="/consent/preferences" className="hover:text-gray-300">Cookie Settings</Link>
            <Link href="/grievance" className="hover:text-gray-300">Grievance</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
