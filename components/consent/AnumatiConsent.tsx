"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Cookie } from "lucide-react";
import {
  acceptAllConsents,
  captureConsent,
  essentialOnlyConsents,
  fetchConsentConfig,
  selectedConsents,
  type DaConsentConfig,
  type DaConsentSelection,
} from "@/lib/consent/anumati";
import ConsentBanner from "./ConsentBanner";
import ConsentPreferences from "./ConsentPreferences";

const DEFAULT_THEME = "#006aa8";

type View = "hidden" | "banner" | "preferences";

/**
 * Native replacement for the hosted `anumati-dpdp-consent-v1.js` tag. Renders
 * the same banner/preferences UI from the same `consent-config` payload and
 * posts the same capture payload, without loading the third-party script.
 */
export default function AnumatiConsent() {
  const [config, setConfig] = useState<DaConsentConfig | null>(null);
  const [view, setView] = useState<View>("hidden");
  const [lang, setLang] = useState("en");
  const [busy, setBusy] = useState(false);
  const [selection, setSelection] = useState<Record<string, boolean>>({});

  const theme = config?.uiStyle?.theme?.themeColor ?? DEFAULT_THEME;
  const cookieUi = config?.uiStyle?.cookieUiSettings;

  const applyConfig = useCallback((next: DaConsentConfig, openBanner: boolean) => {
    setConfig(next);
    setSelection(
      Object.fromEntries(next.purposes.map((p) => [p.publicId, p.isRequired === true]))
    );
    if (openBanner) setView(next.shouldShowBanner ? "banner" : "hidden");
  }, []);

  useEffect(() => {
    let cancelled = false;
    fetchConsentConfig(lang)
      .then((next) => {
        if (cancelled) return;
        applyConfig(next, config === null);
      })
      .catch((error) => console.error("[anumati-consent] config failed:", error));
    return () => {
      cancelled = true;
    };
    // Refetch on language change; `config` is intentionally not a dependency.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang, applyConfig]);

  const submit = useCallback(
    async (consents: DaConsentSelection[]) => {
      setBusy(true);
      try {
        await captureConsent(consents);
        setView("hidden");
      } catch (error) {
        console.error("[anumati-consent] capture failed:", error);
      } finally {
        setBusy(false);
      }
    },
    []
  );

  const purposes = useMemo(() => config?.purposes ?? [], [config]);

  if (!config) return null;

  const showTrigger = view === "hidden" && cookieUi?.show !== false;

  return (
    <>
      {view === "banner" && (
        <ConsentBanner
          config={config}
          theme={theme}
          lang={lang}
          busy={busy}
          onLangChange={setLang}
          onAcceptAll={() => submit(acceptAllConsents(purposes))}
          onEssentialOnly={() => submit(essentialOnlyConsents(purposes))}
          onCustomise={() => setView("preferences")}
          onClose={() => setView("hidden")}
        />
      )}

      {view === "preferences" && (
        <ConsentPreferences
          config={config}
          theme={theme}
          lang={lang}
          busy={busy}
          selection={selection}
          onLangChange={setLang}
          onToggle={(purposeId, next) =>
            setSelection((prev) => ({ ...prev, [purposeId]: next }))
          }
          onSave={() => submit(selectedConsents(purposes, selection))}
          onEssentialOnly={() => submit(essentialOnlyConsents(purposes))}
          onClose={() => setView("hidden")}
        />
      )}

      {showTrigger && (
        <button
          type="button"
          aria-label="Review & Manage Consent"
          onClick={() => setView("preferences")}
          className="fixed bottom-4 left-4 z-[9997] flex h-10 w-10 cursor-pointer items-center justify-center overflow-hidden rounded-full text-white shadow-lg transition-transform hover:scale-105"
          style={{ backgroundColor: cookieUi?.bgColor ?? theme }}
        >
          {cookieUi?.url ? (
            <img src={cookieUi.url} alt="" className="h-6 w-6 object-contain" />
          ) : (
            <Cookie className="h-5 w-5" />
          )}
        </button>
      )}
    </>
  );
}
