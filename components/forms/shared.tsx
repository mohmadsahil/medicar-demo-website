"use client";
import { useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const DA_TRIGGER = "456534a9-6ad2-4243-ab8c-18d12435bad5";

export function useFormState(initial: Record<string, string> = {}) {
  const [values, setValues] = useState<Record<string, string>>(initial);
  const [agreed, setAgreed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const set = (k: string, v: string) => setValues((p) => ({ ...p, [k]: v }));

  const submit = async (id: string) => {
    setSubmitting(true);
    console.log(`[Form:${id}] submit`, values);
    await new Promise((r) => setTimeout(r, 500));
    setSubmitting(false);
    setDone(true);
  };

  return { values, set, agreed, setAgreed, submitting, done, submit, setDone };
}

export function PageShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-3xl mx-auto">
        <Link
          href="/forms"
          className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-sky-600 mb-4"
        >
          <ArrowLeft size={14} /> Back to Forms
        </Link>
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">{title}</h1>
          <p className="text-sm text-gray-500">{subtitle}</p>
        </div>
        {children}
      </div>
    </div>
  );
}

export function Input({
  label,
  name,
  values,
  set,
  type = "text",
  required,
}: {
  label: string;
  name: string;
  values: Record<string, string>;
  set: (k: string, v: string) => void;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type}
        required={required}
        value={values[name] ?? ""}
        onChange={(e) => set(name, e.target.value)}
        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
      />
    </div>
  );
}

export function Textarea({
  label,
  name,
  values,
  set,
  required,
}: {
  label: string;
  name: string;
  values: Record<string, string>;
  set: (k: string, v: string) => void;
  required?: boolean;
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <textarea
        required={required}
        rows={3}
        value={values[name] ?? ""}
        onChange={(e) => set(name, e.target.value)}
        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
      />
    </div>
  );
}

export function ConsentCheckbox({
  agreed,
  setAgreed,
}: {
  agreed: boolean;
  setAgreed: (v: boolean) => void;
}) {
  return (
    <label className="flex items-start gap-2">
      <input
        type="checkbox"
        checked={agreed}
        onChange={(e) => setAgreed(e.target.checked)}
        className="mt-1 h-4 w-4 rounded border-gray-300 text-sky-600 focus:ring-sky-500"
      />
      <span className="text-xs text-gray-600 leading-relaxed">
        I consent under the DPDP Act, 2023 to Anumati Health processing my data
        for this request. I may withdraw anytime via the Consent Dashboard.
      </span>
    </label>
  );
}

export function SuccessBanner({ id, onReset }: { id: string; onReset: () => void }) {
  return (
    <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-4 flex items-center justify-between">
      <div>
        <div className="font-semibold text-green-900 text-sm">Submitted</div>
        <div className="text-xs text-green-700">Trigger fired for form: <code>{id}</code></div>
      </div>
      <button
        onClick={onReset}
        className="text-xs font-semibold text-green-800 underline"
      >
        Reset
      </button>
    </div>
  );
}
