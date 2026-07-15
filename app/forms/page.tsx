"use client";
import Link from "next/link";
import {
  FileText,
  ArrowRight,
  Send,
  Check,
  Save,
  MapPin,
  Layers,
  Sparkles,
  Columns,
  StickyNote,
  MousePointerClick,
  PanelRight,
  Rocket,
} from "lucide-react";

const FORM_PAGES = [
  {
    slug: "top-button",
    title: "Top Submit Button",
    description: "Primary submit sits above all inputs — used in fast entry / kiosk flows.",
    icon: ArrowRight,
  },
  {
    slug: "bottom-button",
    title: "Bottom Submit Button",
    description: "Classic form — submit at end after all fields.",
    icon: Send,
  },
  {
    slug: "sticky-footer",
    title: "Sticky Footer Submit",
    description: "Submit anchored to bottom of viewport while user scrolls a long form.",
    icon: Layers,
  },
  {
    slug: "floating-fab",
    title: "Floating Action Button",
    description: "Round FAB in bottom-right acts as the submit trigger.",
    icon: Rocket,
  },
  {
    slug: "split-actions",
    title: "Split Actions (Save + Submit)",
    description: "Two side-by-side buttons — draft vs final submit.",
    icon: Columns,
  },
  {
    slug: "inline-row",
    title: "Inline Row Submit",
    description: "Input and submit share the same row — newsletter style.",
    icon: MousePointerClick,
  },
  {
    slug: "side-panel",
    title: "Side Panel Submit",
    description: "Form on the left, submit + summary card on the right.",
    icon: PanelRight,
  },
  {
    slug: "wizard-steps",
    title: "Multi-step Wizard",
    description: "Submit appears only on the final step of a wizard.",
    icon: Sparkles,
  },
  {
    slug: "sticky-header",
    title: "Sticky Header Submit",
    description: "Submit pinned at top of the form container while scrolling.",
    icon: StickyNote,
  },
  {
    slug: "corner-badge",
    title: "Corner Badge Submit",
    description: "Submit as a corner badge / tag on the form card.",
    icon: MapPin,
  },
  {
    slug: "double-confirm",
    title: "Double-Confirm Submit",
    description: "Submit shows a confirm bar with a second button before firing.",
    icon: Check,
  },
  {
    slug: "auto-save",
    title: "Auto-Save + Explicit Submit",
    description: "Field changes auto-save; final submit finalises the record.",
    icon: Save,
  },
];

export default function FormsIndexPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 text-sky-600 text-xs font-semibold bg-sky-50 px-3 py-1 rounded-full mb-3">
            <FileText size={12} /> Trigger Test Suite
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-1">Form Layout Gallery</h1>
          <p className="text-gray-500 text-sm">
            Each page below places the DA-trigger submit button in a different position.
            Use them to validate trigger firing across layouts.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {FORM_PAGES.map((p) => {
            const Icon = p.icon;
            return (
              <Link
                key={p.slug}
                href={`/forms/${p.slug}`}
                className="group bg-white rounded-2xl border border-gray-100 p-5 hover:border-sky-400 hover:shadow-md transition-all"
              >
                <div className="w-10 h-10 bg-sky-100 rounded-lg flex items-center justify-center mb-3 group-hover:bg-sky-600 transition-colors">
                  <Icon size={18} />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">{p.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{p.description}</p>
                <div className="mt-3 text-xs font-semibold text-sky-600 flex items-center gap-1">
                  Open form <ArrowRight size={12} />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
