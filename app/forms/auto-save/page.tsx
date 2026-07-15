"use client";
import { useEffect, useState } from "react";
import { DA_TRIGGER, PageShell, Input, Textarea, ConsentCheckbox, SuccessBanner, useFormState } from "@/components/forms/shared";

const ID = "auto-save";

export default function Page() {
  const f = useFormState();
  const [savedAt, setSavedAt] = useState<string | null>(null);

  useEffect(() => {
    if (Object.keys(f.values).length === 0) return;
    const t = setTimeout(() => {
      console.log(`[Form:${ID}] auto-save`, f.values);
      setSavedAt(new Date().toLocaleTimeString());
    }, 800);
    return () => clearTimeout(t);
  }, [f.values]);

  return (
    <PageShell title="Auto-Save + Explicit Submit" subtitle="Fields auto-save as you type; explicit submit finalises.">
      <form
        onSubmit={(e) => { e.preventDefault(); f.submit(ID); }}
        className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4"
      >
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>Draft saves automatically</span>
          {savedAt && <span className="text-green-600">✓ Saved at {savedAt}</span>}
        </div>
        <Input label="Title" name="title" values={f.values} set={f.set} required />
        <Textarea label="Body" name="body" values={f.values} set={f.set} required />
        <ConsentCheckbox agreed={f.agreed} setAgreed={f.setAgreed} />
        {f.done && <SuccessBanner id={ID} onReset={() => f.setDone(false)} />}

        <button
          type="submit"
          da-trigger={DA_TRIGGER}
          data-form-id={ID}
          disabled={f.submitting || !f.agreed}
          className="w-full bg-sky-600 text-white py-2.5 rounded-lg text-sm font-semibold hover:bg-sky-700 disabled:opacity-60"
        >
          {f.submitting ? "Finalising..." : "Finalise & Submit"}
        </button>
      </form>
    </PageShell>
  );
}
