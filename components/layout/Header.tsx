"use client";
import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { Menu, X, Phone, ChevronDown, User, LogOut, Calendar, Shield } from "lucide-react";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  {
    label: "Departments",
    href: "/departments",
    children: [
      { label: "Cardiology", href: "/departments/cardiology" },
      { label: "Neurology", href: "/departments/neurology" },
      { label: "Orthopedics", href: "/departments/orthopedics" },
      { label: "Oncology", href: "/departments/oncology" },
      { label: "Pediatrics", href: "/departments/pediatrics" },
      { label: "Obstetrics & Gynecology", href: "/departments/obstetrics-gynecology" },
    ],
  },
  { label: "Doctors", href: "/doctors" },
  { label: "Consents", href: "/consents" },
  { label: "Health Packages", href: "/health-packages" },
  { label: "Contact", href: "/contact" },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdown, setDropdown] = useState<string | null>(null);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm border-b border-gray-100">
      {/* Top bar */}
      <div className="bg-sky-700 text-white text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <span>🏥 MediCare Plus Hospital — 24/7 Emergency: <strong>1800-MED-PLUS-V1</strong></span>
          <span className="hidden sm:flex items-center gap-4">
            <span><Phone size={11} className="inline mr-1" />+91-22-4567-8900</span>
            <Link href="/grievance" className="hover:text-sky-200">Grievance Portal</Link>
          </span>
        </div>
      </div>

      {/* Main nav */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="w-10 h-10 bg-sky-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">M+</div>
          <div>
            <div className="font-bold text-gray-900 leading-tight">MediCare Plus</div>
            <div className="text-xs text-gray-500 leading-tight">Multi-Specialty Hospital</div>
          </div>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-1">
          {NAV_LINKS.map((link) =>
            link.children ? (
              <div
                key={link.href}
                className="relative"
                onMouseEnter={() => setDropdown(link.href)}
                onMouseLeave={() => setDropdown(null)}
              >
                <button className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-700 hover:text-sky-600 rounded-md hover:bg-sky-50 transition-colors">
                  {link.label} <ChevronDown size={14} />
                </button>
                {dropdown === link.href && (
                  <div className="absolute top-full left-0 mt-1 w-56 bg-white rounded-lg shadow-lg border border-gray-100 py-2 z-50">
                    {link.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-sky-50 hover:text-sky-600"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <Link
                key={link.href}
                href={link.href}
                className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-sky-600 rounded-md hover:bg-sky-50 transition-colors"
              >
                {link.label}
              </Link>
            )
          )}
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-3">
          <Link
            href="/appointments/book"
            className="hidden sm:inline-flex items-center gap-1.5 bg-sky-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-sky-700 transition-colors"
          >
            <Calendar size={15} /> Book Appointment
          </Link>

          {user ? (
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 text-sm font-medium"
              >
                <div className="w-7 h-7 bg-sky-100 rounded-full flex items-center justify-center">
                  <User size={14} className="text-sky-600" />
                </div>
                <span className="hidden sm:block max-w-[100px] truncate">{user.name}</span>
                <ChevronDown size={14} className="text-gray-400" />
              </button>
              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-52 bg-white rounded-lg shadow-lg border border-gray-100 py-2 z-50">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <div className="text-sm font-medium text-gray-900">{user.name}</div>
                    <div className="text-xs text-gray-500">{user.email ?? user.phone}</div>
                  </div>
                  <Link href="/portal" className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-sky-50">
                    <User size={14} /> Patient Portal
                  </Link>
                  <Link href="/consent/dashboard" className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-sky-50">
                    <Shield size={14} /> Consent Dashboard
                  </Link>
                  {user.role === "admin" && (
                    <Link href="/admin/webhook-events" className="flex items-center gap-2 px-4 py-2 text-sm text-sky-600 hover:bg-sky-50">
                      <Shield size={14} /> Admin Panel
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    <LogOut size={14} /> Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/auth/login"
              className="flex items-center gap-1.5 px-4 py-2 border border-sky-600 text-sky-600 rounded-lg text-sm font-semibold hover:bg-sky-50 transition-colors"
            >
              <User size={15} /> Sign In
            </Link>
          )}

          {/* Mobile toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2 rounded-md text-gray-600 hover:bg-gray-100"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-gray-100 bg-white px-4 py-4 space-y-1">
          {NAV_LINKS.map((link) => (
            <div key={link.href}>
              <Link
                href={link.href}
                className="block px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-sky-50 hover:text-sky-600"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
              {link.children && (
                <div className="pl-4 space-y-1">
                  {link.children.map((child) => (
                    <Link
                      key={child.href}
                      href={child.href}
                      className="block px-3 py-1.5 text-sm text-gray-600 rounded-md hover:bg-sky-50"
                      onClick={() => setMobileOpen(false)}
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
          <Link
            href="/appointments/book"
            className="block w-full text-center bg-sky-600 text-white px-4 py-2.5 rounded-lg text-sm font-semibold mt-3"
            onClick={() => setMobileOpen(false)}
          >
            Book Appointment
          </Link>
        </div>
      )}
    </header>
  );
}
