/**
 * Client for the Digital Anumati public CMP API.
 *
 * This replaces the hosted `anumati-dpdp-consent-v1.js` widget: it talks to the
 * same endpoints with the same payload shape, so consent records land in the
 * Anumati dashboard exactly as they did before.
 *
 * `consent-config` is what issues the `_da_*` session cookies (HttpOnly/Secure)
 * that `consents/capture` authenticates against, so it must be called first and
 * every request must send credentials.
 */

export const DA_PUBLIC_API = "https://uat-apis.digitalanumati.com/api/public";

export interface DaCookie {
  publicId: string;
  name: string;
  description: string | null;
  provider: string;
  category: string;
  duration: string;
  isCrossBorder: boolean;
}

export interface DaLegalBasisRule {
  id: number;
  name: string;
  isConsentBased: boolean;
  description: string;
  legalReference: string;
}

export interface DaPurpose {
  publicId: string;
  name: string;
  description: string;
  tags: string;
  purposeType: string;
  isRequired: boolean;
  legalBasisRule?: DaLegalBasisRule;
  cookies: DaCookie[];
  dataElements: unknown[];
}

export interface DaLanguage {
  code: string;
  name: string;
}

export interface DaTheme {
  themeColor?: string;
  backgroundColor?: string;
  popupPosition?: string;
  styleEffect?: string;
  logoSize?: string;
  displayLogo?: boolean;
}

export interface DaCookieUiSettings {
  url?: string;
  show?: boolean;
  bgColor?: string;
  position?: string;
}

export interface DaConsentConfig {
  version: string;
  isChildrenDataProcess: boolean;
  consentHeading: string;
  consentDescription: string;
  about: string;
  purposes: DaPurpose[];
  languages: DaLanguage[];
  retentionInfo: { retentionType: string; consentValidity: string } | null;
  shouldShowBanner: boolean;
  consentState: unknown | null;
  uiStyle: {
    logoUrl?: string;
    displayLogo?: boolean;
    displayCloseIcon?: boolean;
    buttons?: string;
    consentType?: string;
    bannerLayout?: string;
    theme?: DaTheme;
    cookieUiSettings?: DaCookieUiSettings;
  };
}

export interface DaConsentSelection {
  purposeId: string;
  granted: boolean;
  cookies: { cookieId: string; allowed: boolean }[];
}

export async function fetchConsentConfig(lang = "en"): Promise<DaConsentConfig> {
  const res = await fetch(
    `${DA_PUBLIC_API}/consent-config?lang=${encodeURIComponent(lang)}`,
    { credentials: "include", headers: { Accept: "*/*" } }
  );
  if (!res.ok) throw new Error(`consent-config responded ${res.status}`);
  const json = await res.json();
  if (!json?.success) throw new Error(json?.message ?? "consent-config failed");
  return json.data as DaConsentConfig;
}

export async function captureConsent(consents: DaConsentSelection[]) {
  const res = await fetch(`${DA_PUBLIC_API}/consents/capture`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ consents }),
  });
  if (!res.ok) throw new Error(`consents/capture responded ${res.status}`);
  return res.json().catch(() => null);
}

/**
 * A required purpose is always sent as granted — it has a non-consent legal
 * basis (DPDP s.7) and the widget sends `granted: true` for it even on
 * "Essential Only". Cookie-level flags always follow their purpose.
 */
export function buildConsents(
  purposes: DaPurpose[],
  grantedFor: (purpose: DaPurpose) => boolean
): DaConsentSelection[] {
  return purposes.map((purpose) => {
    const granted = purpose.isRequired || grantedFor(purpose);
    return {
      purposeId: purpose.publicId,
      granted,
      cookies: (purpose.cookies ?? []).map((cookie) => ({
        cookieId: cookie.publicId,
        allowed: granted,
      })),
    };
  });
}

export const acceptAllConsents = (purposes: DaPurpose[]) =>
  buildConsents(purposes, () => true);

export const essentialOnlyConsents = (purposes: DaPurpose[]) =>
  buildConsents(purposes, () => false);

export const selectedConsents = (
  purposes: DaPurpose[],
  selection: Record<string, boolean>
) => buildConsents(purposes, (purpose) => selection[purpose.publicId] === true);

/**
 * Display order used by the widget: essential/strictly-necessary first, then
 * other required purposes, then optional ones. The sort is stable, so purposes
 * of equal rank keep their config order.
 *
 * Display only — the capture payload keeps the server's original purpose order.
 */
export function sortPurposesForDisplay(purposes: DaPurpose[]): DaPurpose[] {
  const rank = (purpose: DaPurpose) => {
    const key = String(purpose.name ?? "").toLowerCase().trim();
    if (key.startsWith("essential") || key.startsWith("strictly necessary")) return 0;
    return purpose.isRequired ? 1 : 2;
  };
  return [...purposes].sort((a, b) => rank(a) - rank(b));
}

/** "1_hour" -> "1 Hour" */
export function formatValidity(validity?: string | null): string | null {
  if (!validity) return null;
  return validity
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

/** #006aa8 -> rgba(0, 106, 168, alpha) */
export function withAlpha(hex: string, alpha: number): string {
  const value = hex.replace("#", "");
  const full =
    value.length === 3
      ? value
          .split("")
          .map((c) => c + c)
          .join("")
      : value;
  const int = parseInt(full, 16);
  const r = (int >> 16) & 255;
  const g = (int >> 8) & 255;
  const b = int & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

/**
 * The config's rich-text fields are rendered as HTML. They come from the Anumati
 * dashboard rather than end users, but strip anything executable regardless —
 * the hosted widget ran them through DOMPurify for the same reason.
 */
export function sanitizeHtml(html: string): string {
  return html
    .replace(/<\s*(script|style|iframe|object|embed)[\s\S]*?<\/\s*\1\s*>/gi, "")
    .replace(/\son\w+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi, "")
    .replace(/(href|src)\s*=\s*(?:"\s*javascript:[^"]*"|'\s*javascript:[^']*')/gi, '$1="#"');
}
