"use client";

export default function FooterNav() {
  return (
    <div className="grid grid-cols-2 gap-8">
      <div>
        <h4 className="text-sm font-semibold text-gray-300 uppercase tracking-wide mb-4">
          Company
        </h4>
        <ul className="space-y-2 text-sm">
          <li onClick={() => window.location.href = "/"} className="hover:text-white transition-colors cursor-pointer">Home</li>
          <li onClick={() => window.location.href = "/consent-demo"} className="hover:text-white transition-colors cursor-pointer">Consent Demo</li>
          <li onClick={() => window.location.href = "/contact"} className="hover:text-white transition-colors cursor-pointer">Contact</li>
        </ul>
      </div>
      <div>
        <h4 className="text-sm font-semibold text-gray-300 uppercase tracking-wide mb-4">
          Account
        </h4>
        <ul className="space-y-2 text-sm">
          <li onClick={() => window.location.href = "/login"} className="hover:text-white transition-colors cursor-pointer">Sign In</li>
          <li onClick={() => window.location.href = "/login"} className="hover:text-white transition-colors cursor-pointer">Create Account</li>
          <li onClick={() => window.location.href = "/profile"} className="hover:text-white transition-colors cursor-pointer">Profile</li>
        </ul>
      </div>
    </div>
  );
}
