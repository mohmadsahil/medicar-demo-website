"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "da-consent-choice";
type Choice = "all" | "essential" | "custom" | "dismissed";

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(STORAGE_KEY)) setVisible(true);
    } catch {
      setVisible(true);
    }
  }, []);

  const decide = (c: Choice) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ choice: c, at: new Date().toISOString() }));
    } catch {}
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      className="itc-bar-enter"
      style={{
        backgroundColor: "rgb(255, 255, 255)",
        // @ts-expect-error CSS vars
        "--primary": "202 100.0% 32.9%",
        "--ring": "202 100.0% 32.9%",
        "--primary-foreground": "0 0% 100%",
        "--itc-theme": "#006aa8",
        position: "fixed",
        zIndex: 9999,
        width: 440,
        maxWidth: "calc(-2rem + 100vw)",
        bottom: 16,
        right: 16,
        borderRadius: 16,
        boxShadow: "rgba(0, 0, 0, 0.22) 0px 12px 28px -12px",
        overflow: "visible",
      }}
    >
      <button
        type="button"
        className="itc-details-close-btn"
        aria-label="Close banner"
        style={{ backgroundColor: "rgb(0, 106, 168)" }}
        onClick={() => decide("dismissed")}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-x h-3.5 w-3.5 sm:h-4 sm:w-4 text-white">
          <path d="M18 6 6 18" />
          <path d="m6 6 12 12" />
        </svg>
      </button>

      <div className="itc-bar-content relative p-2.5 space-y-2.5 sm:p-4 sm:space-y-3">
        <div className="relative p-1.5 sm:p-2" style={{ height: 54 }}>
          <div className="absolute" style={{ right: 0, top: 6, height: 38, maxHeight: 38, maxWidth: 106 }}>
            <img
              src="https://uat-leadmanagement-ap-south-1.s3.ap-south-1.amazonaws.com/consents/ccb858d3-993d-4b8a-8adf-b60621aa6ae3.webp"
              alt="Logo"
              className="h-full w-auto object-contain"
            />
          </div>
          <div className="absolute" style={{ left: 0, top: 8 }}>
            <button
              type="button"
              className="flex items-center justify-between border py-2 ring-offset-background transition-colors focus:outline-none focus:ring-2 hover:border-primary/50 h-7 sm:h-8 w-[118px] sm:w-[140px] rounded-lg bg-white px-2 text-[11px] sm:text-xs shadow-sm"
              style={{ borderColor: "rgba(0,0,0,0.12)" }}
            >
              <div className="flex items-center gap-1.5">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-globe h-3 w-3" style={{ color: "var(--secondary)" }}>
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
                  <path d="M2 12h20" />
                </svg>
                <span style={{ pointerEvents: "none" }}>English</span>
              </div>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-down h-4 w-4 opacity-60" aria-hidden="true">
                <path d="m6 9 6 6 6-6" />
              </svg>
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <div className="space-y-1.5">
            <p className="font-semibold itc-bar-heading leading-snug flex items-center gap-2 flex-wrap">
              <span>We value your privacy</span>
              <span
                className="itc-version-badge"
                style={{ borderColor: "rgba(0, 106, 168, 0.35)", backgroundColor: "rgba(0, 106, 168, 0.08)", color: "rgb(0, 106, 168)" }}
              >
                v.0.3
              </span>
            </p>
            <div className="itc-bar-description leading-relaxed" style={{ color: "var(--secondary)" }}>
              <p>
                We use cookies and similar technologies to enhance your browsing experience, serve
                personalised content, and analyse our traffic. By continuing to use our site, you
                consent to our use of cookies.
              </p>
            </div>
            <div className="itc-duration-fixed">
              <span className="itc-duration-fixed-label">Retention Period</span>
              <span
                className="itc-duration-fixed-badge"
                style={{ borderColor: "rgba(0, 106, 168, 0.35)", backgroundColor: "rgba(0, 106, 168, 0.08)", color: "rgb(0, 106, 168)" }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-clock h-3 w-3">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
                1 Hour
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-2.5 w-full">
            <button
              className="itc-view-details-btn text-xs font-medium text-left inline-flex items-center justify-start gap-1.5 group transition-all w-fit"
              type="button"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-eye w-3.5 h-3.5 transition-transform group-hover:scale-110">
                <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0" />
                <circle cx="12" cy="12" r="3" />
              </svg>
              <span className="underline">View Details</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-right w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5">
                <path d="m9 18 6-6-6-6" />
              </svg>
            </button>

            <div className="itc-popup-actions w-full">
              <div
                className="itc-age-gate-badge"
                role="note"
                aria-label="Age confirmation notice"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  width: "100%",
                  boxSizing: "border-box",
                  borderRadius: "0.5rem",
                  border: "1px solid rgb(240, 195, 109)",
                  padding: "0.5rem 0.625rem",
                  marginBottom: "0.5rem",
                  background: "rgb(254, 249, 231)",
                  color: "rgb(180, 83, 9)",
                }}
              >
                <span
                  aria-hidden="true"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    alignSelf: "center",
                    flexShrink: 0,
                    width: 22,
                    height: 22,
                    borderRadius: 6,
                    background: "rgb(180, 83, 9)",
                    color: "rgb(255, 255, 255)",
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-badge-check">
                    <path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z" />
                    <path d="m9 12 2 2 4-4" />
                  </svg>
                </span>
                <p className="itc-age-gate-text" style={{ margin: 0, flex: "1 1 0%", minWidth: 0, fontSize: "0.7rem", fontWeight: 500, lineHeight: 1.35 }}>
                  By selecting <span style={{ fontWeight: 600 }}>Accept All</span>, you confirm you&apos;re{" "}
                  <span style={{ fontWeight: 600 }}>18 years or older</span> (DPDP Act, Sec. 9){" "}
                  <span aria-hidden="true" style={{ opacity: 0.5 }}>|</span>{" "}
                  <button
                    type="button"
                    style={{ background: "transparent", border: 0, padding: 0, margin: 0, fontWeight: 600, textDecoration: "underline", cursor: "pointer", color: "rgb(180, 83, 9)", whiteSpace: "nowrap" }}
                  >
                    I&apos;m Under 18
                  </button>
                </p>
              </div>

              <div className="flex flex-col sm:grid sm:grid-cols-3 gap-2 w-full sm:w-auto">
                <button
                  onClick={() => decide("custom")}
                  className="itc-btn itc-btn--outline inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md min-h-9 py-2 h-7 sm:h-8 px-2.5 sm:px-3 text-[11px] sm:text-xs font-medium leading-none w-full cursor-pointer"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-settings2 w-4 h-4">
                    <path d="M20 7h-9" />
                    <path d="M14 17H5" />
                    <circle cx="17" cy="17" r="3" />
                    <circle cx="7" cy="7" r="3" />
                  </svg>
                  Customise
                </button>
                <button
                  onClick={() => decide("essential")}
                  className="itc-btn itc-btn--outline inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md min-h-9 py-2 h-7 sm:h-8 px-2.5 sm:px-3 text-[11px] sm:text-xs font-medium leading-none w-full cursor-pointer"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-shield-check w-4 h-4">
                    <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
                    <path d="m9 12 2 2 4-4" />
                  </svg>
                  Essential Only
                </button>
                <button
                  onClick={() => decide("all")}
                  className="itc-btn itc-btn--primary inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md min-h-9 py-2 h-7 sm:h-8 px-2.5 sm:px-3 text-[11px] sm:text-xs font-medium leading-none w-full cursor-pointer"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-check w-4 h-4">
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                  Accept All
                </button>
              </div>
              <span className="sm:hidden block text-center leading-none mt-1">
                <a
                  href="https://digitalanumati.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="itc-poweredby-link itc-poweredby-link-mobile"
                >
                  Secured By Digital Anumati
                </a>
              </span>
            </div>
          </div>
        </div>

        <p
          className="text-center text-xs mt-2 pt-3 border-t hidden sm:block"
          style={{ color: "var(--secondary)", borderColor: "rgba(0, 106, 168, 0.12)" }}
        >
          <a
            href="https://digitalanumati.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="itc-poweredby-link-popup"
          >
            Secured By Digital Anumati
          </a>
        </p>
      </div>
    </div>
  );
}
