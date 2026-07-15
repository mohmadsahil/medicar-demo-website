"use client";

import { X, Eye, ChevronRight, SlidersHorizontal, ShieldCheck, Check } from "lucide-react";
import {
  formatValidity,
  sanitizeHtml,
  type DaConsentConfig,
} from "@/lib/consent/anumati";
import {
  AgeGate,
  BrandLogo,
  LanguageSelect,
  PoweredBy,
  RetentionBadge,
  VersionBadge,
} from "./ConsentShared";

interface Props {
  config: DaConsentConfig;
  theme: string;
  lang: string;
  busy: boolean;
  onLangChange: (code: string) => void;
  onAcceptAll: () => void;
  onEssentialOnly: () => void;
  onCustomise: () => void;
  onClose: () => void;
}

export default function ConsentBanner({
  config,
  theme,
  lang,
  busy,
  onLangChange,
  onAcceptAll,
  onEssentialOnly,
  onCustomise,
  onClose,
}: Props) {
  const { uiStyle } = config;
  const retention = formatValidity(config.retentionInfo?.consentValidity);
  const position = uiStyle.theme?.popupPosition ?? "bottom-right";
  const anchor = position.includes("left") ? { left: 16 } : { right: 16 };

  return (
    <>
      <div
        className="fixed inset-0 z-[9998]"
        aria-hidden="true"
        style={{ backdropFilter: "blur(6px)", backgroundColor: "rgba(0, 0, 0, 0.08)" }}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-label={config.consentHeading}
        className="fixed z-[9999] w-[440px] max-w-[calc(100vw-2rem)] rounded-2xl"
        style={{
          backgroundColor: uiStyle.theme?.backgroundColor ?? "#ffffff",
          bottom: 16,
          ...anchor,
          boxShadow: "rgba(0, 0, 0, 0.22) 0px 12px 28px -12px",
        }}
      >
        {uiStyle.displayCloseIcon !== false && (
          <button
            type="button"
            aria-label="Close banner"
            onClick={onClose}
            className="absolute -right-2 -top-2 z-10 flex h-6 w-6 cursor-pointer items-center justify-center rounded-full text-white shadow-md transition-transform hover:scale-105"
            style={{ backgroundColor: theme }}
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}

        <div className="space-y-3 p-4">
          <div className="relative flex h-[54px] items-start justify-between p-2">
            <LanguageSelect languages={config.languages} value={lang} onChange={onLangChange} />
            {uiStyle.displayLogo !== false && (
              <BrandLogo src={uiStyle.logoUrl} size={uiStyle.theme?.logoSize} />
            )}
          </div>

          <div className="flex flex-col gap-2">
            <div className="space-y-1.5">
              <p className="flex flex-wrap items-center gap-2 text-base font-semibold leading-snug text-gray-900">
                <span>{config.consentHeading}</span>
                <VersionBadge version={config.version} theme={theme} />
              </p>

              <div
                className="text-xs leading-relaxed text-gray-500 [&_p]:m-0"
                dangerouslySetInnerHTML={{ __html: sanitizeHtml(config.consentDescription) }}
              />

              {retention && <RetentionBadge label={retention} theme={theme} />}
            </div>

            <div className="flex w-full flex-col gap-2.5">
              <button
                type="button"
                onClick={onCustomise}
                className="group inline-flex w-fit cursor-pointer items-center justify-start gap-1.5 text-left text-xs font-medium transition-all"
                style={{ color: theme }}
              >
                <Eye className="h-3.5 w-3.5 transition-transform group-hover:scale-110" />
                <span className="underline decoration-1 underline-offset-2">View Details</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </button>

              <div className="w-full">
                {config.isChildrenDataProcess && <AgeGate onUnderage={onEssentialOnly} />}

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    disabled={busy}
                    onClick={onCustomise}
                    className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg border bg-white px-3 py-2 text-xs font-semibold transition-colors hover:bg-gray-50 disabled:opacity-60"
                    style={{ borderColor: theme, color: theme }}
                  >
                    <SlidersHorizontal className="h-3.5 w-3.5" />
                    Customise
                  </button>
                  <button
                    type="button"
                    disabled={busy}
                    onClick={onEssentialOnly}
                    className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg border bg-white px-3 py-2 text-xs font-semibold transition-colors hover:bg-gray-50 disabled:opacity-60"
                    style={{ borderColor: theme, color: theme }}
                  >
                    <ShieldCheck className="h-3.5 w-3.5" />
                    Essential Only
                  </button>
                </div>

                <button
                  type="button"
                  disabled={busy}
                  onClick={onAcceptAll}
                  className="mt-2 inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-95 disabled:opacity-60"
                  style={{ backgroundColor: theme }}
                >
                  <Check className="h-4 w-4" />
                  Accept All
                </button>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-100 pt-2 text-center">
            <PoweredBy />
          </div>
        </div>
      </div>
    </>
  );
}
