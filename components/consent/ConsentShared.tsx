"use client";

import { Globe, ChevronDown, Clock, ShieldAlert } from "lucide-react";
import { withAlpha, type DaLanguage } from "@/lib/consent/anumati";

export function VersionBadge({ version, theme }: { version: string; theme: string }) {
  return (
    <span
      className="rounded-full border px-2 py-[1px] text-[10px] font-semibold leading-none"
      style={{
        borderColor: withAlpha(theme, 0.35),
        backgroundColor: withAlpha(theme, 0.08),
        color: theme,
      }}
    >
      {version}
    </span>
  );
}

export function RetentionBadge({ label, theme }: { label: string; theme: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs font-medium text-gray-700">Retention Period</span>
      <span
        className="inline-flex items-center gap-1 rounded-full border px-2 py-[2px] text-[11px] font-semibold leading-none"
        style={{
          borderColor: withAlpha(theme, 0.35),
          backgroundColor: withAlpha(theme, 0.08),
          color: theme,
        }}
      >
        <Clock className="h-3 w-3" />
        {label}
      </span>
    </div>
  );
}

export function LanguageSelect({
  languages,
  value,
  onChange,
}: {
  languages: DaLanguage[];
  value: string;
  onChange: (code: string) => void;
}) {
  const current = languages.find((l) => l.code === value);
  return (
    <div className="relative w-[140px]">
      <Globe className="pointer-events-none absolute left-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-600" />
      <select
        aria-label="Select language"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-8 w-full cursor-pointer appearance-none rounded-lg border border-gray-200 bg-white pl-7 pr-7 text-xs text-gray-900 shadow-sm transition-colors hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-200"
      >
        {languages.map((language) => (
          <option key={language.code} value={language.code}>
            {language.name}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-500" />
      <span className="sr-only">{current?.name}</span>
    </div>
  );
}

export function BrandLogo({ src, size }: { src?: string; size?: string }) {
  if (!src) return null;
  return (
    <img
      src={src}
      alt="Logo"
      className="w-auto max-w-[106px] object-contain"
      style={{ height: size ?? "38px" }}
    />
  );
}

export function ConsentToggle({
  checked,
  disabled,
  onChange,
  label,
  theme,
}: {
  checked: boolean;
  disabled?: boolean;
  onChange: (next: boolean) => void;
  label: string;
  theme: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
        disabled ? "cursor-not-allowed opacity-70" : "cursor-pointer"
      }`}
      style={{ backgroundColor: checked ? withAlpha(theme, 0.55) : "#cbd5e1" }}
    >
      <span
        className={`absolute top-1/2 h-5 w-5 -translate-y-1/2 rounded-full bg-white shadow transition-all ${
          checked ? "left-[22px]" : "left-[2px]"
        }`}
      />
    </button>
  );
}

/**
 * DPDP Act s.9 age gate. Shown whenever the notice is configured to process
 * children's data (`isChildrenDataProcess`).
 */
export function AgeGate({ onUnderage }: { onUnderage: () => void }) {
  return (
    <div
      role="note"
      aria-label="Age confirmation notice"
      className="mb-2 flex w-full items-center gap-2 rounded-lg border px-2.5 py-2"
      style={{
        borderColor: "rgb(240, 195, 109)",
        background: "rgb(254, 249, 231)",
        color: "rgb(180, 83, 9)",
      }}
    >
      <span
        aria-hidden="true"
        className="inline-flex h-[22px] w-[22px] shrink-0 items-center justify-center self-center rounded-md text-white"
        style={{ background: "rgb(180, 83, 9)" }}
      >
        <ShieldAlert className="h-3.5 w-3.5" />
      </span>
      <p className="m-0 min-w-0 flex-1 text-[0.7rem] font-medium leading-[1.35]">
        By selecting <span className="font-semibold">Accept All</span>, you confirm you&apos;re{" "}
        <span className="font-semibold">18 years or older</span> (DPDP Act, Sec. 9){" "}
        <span aria-hidden="true" className="opacity-50">
          |
        </span>{" "}
        <button
          type="button"
          onClick={onUnderage}
          className="cursor-pointer font-semibold underline underline-offset-2"
        >
          I&apos;m Under 18
        </button>
      </p>
    </div>
  );
}

export function PoweredBy({ className = "" }: { className?: string }) {
  return (
    <a
      href="https://digitalanumati.com/"
      target="_blank"
      rel="noopener noreferrer"
      className={`text-[11px] text-gray-400 transition-colors hover:text-gray-600 ${className}`}
    >
      Secured By Digital Anumati
    </a>
  );
}
