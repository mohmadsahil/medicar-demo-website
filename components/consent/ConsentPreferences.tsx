"use client";

import { useMemo, useState } from "react";
import { X, ChevronDown, Save, ShieldCheck, BarChart3, Lock } from "lucide-react";
import {
  sanitizeHtml,
  sortPurposesForDisplay,
  withAlpha,
  type DaConsentConfig,
  type DaPurpose,
} from "@/lib/consent/anumati";
import {
  AgeGate,
  BrandLogo,
  ConsentToggle,
  LanguageSelect,
  PoweredBy,
  VersionBadge,
} from "./ConsentShared";

interface Props {
  config: DaConsentConfig;
  theme: string;
  lang: string;
  busy: boolean;
  selection: Record<string, boolean>;
  onLangChange: (code: string) => void;
  onToggle: (purposeId: string, next: boolean) => void;
  onSave: () => void;
  onEssentialOnly: () => void;
  onClose: () => void;
}

function PurposeIcon({ purpose, theme }: { purpose: DaPurpose; theme: string }) {
  const Icon = /analytic|statistic/i.test(purpose.name) ? BarChart3 : ShieldCheck;
  return (
    <span
      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
      style={{ backgroundColor: withAlpha(theme, 0.08), color: theme }}
    >
      <Icon className="h-4 w-4" />
    </span>
  );
}

export default function ConsentPreferences({
  config,
  theme,
  lang,
  busy,
  selection,
  onLangChange,
  onToggle,
  onSave,
  onEssentialOnly,
  onClose,
}: Props) {
  const [expanded, setExpanded] = useState<string | null>(null);
  const { uiStyle } = config;
  const purposes = useMemo(() => sortPurposesForDisplay(config.purposes), [config.purposes]);

  return (
    <>
      <div
        className="fixed inset-0 z-[9998]"
        aria-hidden="true"
        style={{ backdropFilter: "blur(6px)", backgroundColor: "rgba(0, 0, 0, 0.08)" }}
      />

      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
        <div
          role="dialog"
          aria-modal="true"
          aria-label={config.consentHeading}
          className="relative flex max-h-[85vh] w-full max-w-[745px] flex-col overflow-hidden rounded-2xl"
          style={{
            backgroundColor: uiStyle.theme?.backgroundColor ?? "#ffffff",
            boxShadow: "rgba(0, 0, 0, 0.22) 0px 12px 28px -12px",
          }}
        >
          {uiStyle.displayCloseIcon !== false && (
            <button
              type="button"
              aria-label="Close preferences"
              onClick={onClose}
              className="absolute right-3 top-3 z-10 flex h-6 w-6 cursor-pointer items-center justify-center rounded-full text-white shadow-md transition-transform hover:scale-105"
              style={{ backgroundColor: theme }}
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}

          <div className="flex shrink-0 items-center justify-between gap-3 border-b border-gray-100 px-6 py-4">
            <LanguageSelect languages={config.languages} value={lang} onChange={onLangChange} />
            <div className="flex items-center gap-3 pr-8">
              <PoweredBy />
              {uiStyle.displayLogo !== false && (
                <BrandLogo src={uiStyle.logoUrl} size={uiStyle.theme?.logoSize} />
              )}
            </div>
          </div>

          <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-6 py-4">
            <div className="space-y-1.5">
              <p className="flex flex-wrap items-center justify-between gap-2 text-base font-semibold text-gray-900">
                <span>{config.consentHeading}</span>
                <VersionBadge version={config.version} theme={theme} />
              </p>
              <div
                className="text-xs leading-relaxed text-gray-500 [&_p]:m-0"
                dangerouslySetInnerHTML={{ __html: sanitizeHtml(config.consentDescription) }}
              />
            </div>

            <div className="space-y-3">
              {purposes.map((purpose) => {
                const isOpen = expanded === purpose.publicId;
                const checked = purpose.isRequired || selection[purpose.publicId] === true;
                return (
                  <div
                    key={purpose.publicId}
                    className="rounded-xl border border-gray-200 bg-white"
                  >
                    <div className="flex items-center gap-3 p-3.5">
                      <PurposeIcon purpose={purpose} theme={theme} />

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="truncate text-sm font-semibold text-gray-900">
                            {purpose.name}
                          </span>
                          <span
                            className="rounded-full px-1.5 py-[1px] text-[10px] font-semibold leading-none"
                            style={{ backgroundColor: withAlpha(theme, 0.1), color: theme }}
                          >
                            {purpose.cookies?.length ?? 0}
                          </span>
                          {purpose.isRequired && (
                            <Lock className="h-3 w-3 text-gray-400" aria-label="Always active" />
                          )}
                        </div>
                        {purpose.tags && (
                          <p className="mt-0.5 truncate text-[11px] text-gray-500">{purpose.tags}</p>
                        )}
                      </div>

                      <ConsentToggle
                        checked={checked}
                        disabled={purpose.isRequired}
                        label={`${purpose.name} consent`}
                        theme={theme}
                        onChange={(next) => onToggle(purpose.publicId, next)}
                      />

                      <button
                        type="button"
                        aria-label={isOpen ? "Collapse details" : "Expand details"}
                        aria-expanded={isOpen}
                        onClick={() => setExpanded(isOpen ? null : purpose.publicId)}
                        className="cursor-pointer p-1 text-gray-500 transition-colors hover:text-gray-800"
                      >
                        <ChevronDown
                          className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
                        />
                      </button>
                    </div>

                    {isOpen && (
                      <div className="space-y-3 border-t border-gray-100 px-3.5 py-3">
                        {purpose.description && (
                          <p className="text-[11px] leading-relaxed text-gray-600">
                            {purpose.description}
                          </p>
                        )}

                        {purpose.legalBasisRule && (
                          <p className="text-[11px] text-gray-500">
                            <span className="font-semibold text-gray-700">Legal basis: </span>
                            {purpose.legalBasisRule.name} ({purpose.legalBasisRule.legalReference})
                          </p>
                        )}

                        {purpose.cookies?.length > 0 && (
                          <div className="overflow-x-auto">
                            <table className="w-full min-w-[460px] border-collapse text-left text-[11px]">
                              <thead>
                                <tr className="text-gray-500">
                                  <th className="border-b border-gray-100 py-1.5 pr-3 font-semibold">Cookie</th>
                                  <th className="border-b border-gray-100 py-1.5 pr-3 font-semibold">Provider</th>
                                  <th className="border-b border-gray-100 py-1.5 pr-3 font-semibold">Category</th>
                                  <th className="border-b border-gray-100 py-1.5 font-semibold">Duration</th>
                                </tr>
                              </thead>
                              <tbody>
                                {purpose.cookies.map((cookie) => (
                                  <tr key={cookie.publicId} className="align-top text-gray-600">
                                    <td className="border-b border-gray-50 py-1.5 pr-3 font-medium text-gray-800">
                                      {cookie.name}
                                    </td>
                                    <td className="border-b border-gray-50 py-1.5 pr-3">{cookie.provider}</td>
                                    <td className="border-b border-gray-50 py-1.5 pr-3 capitalize">{cookie.category}</td>
                                    <td className="border-b border-gray-50 py-1.5">{cookie.duration}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="shrink-0 border-t border-gray-100 px-6 py-4">
            {config.isChildrenDataProcess && <AgeGate onUnderage={onEssentialOnly} />}
            <button
              type="button"
              disabled={busy}
              onClick={onSave}
              className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-95 disabled:opacity-60"
              style={{ backgroundColor: theme }}
            >
              <Save className="h-4 w-4" />
              Save Preferences
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
