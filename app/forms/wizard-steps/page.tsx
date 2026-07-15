"use client";
import { useState } from "react";
import { DA_TRIGGER, PageShell, Input, Textarea, ConsentCheckbox, SuccessBanner, useFormState } from "@/components/forms/shared";

const ID = "wizard-steps";
const STEPS = ["Personal", "Details", "Review"];

export default function Page() {
  const f = useFormState();
  const [step, setStep] = useState(0);

  return (
    <PageShell title="Multi-step Wizard" subtitle="Submit only exists on the final step.">
      <form
        onSubmit={(e) => { e.preventDefault(); f.submit(ID); }}
        className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4"
      >
        <div className="flex items-center gap-2 mb-4">
          {STEPS.map((s, i) => (
            <div key={s} className="flex-1 flex items-center gap-2">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold ${i <= step ? "bg-sky-600 text-white" : "bg-gray-100 text-gray-500"}`}>
                {i + 1}
              </div>
              <span className={`text-xs ${i === step ? "font-semibold text-gray-900" : "text-gray-500"}`}>{s}</span>
              {i < STEPS.length - 1 && <div className="flex-1 h-px bg-gray-200" />}
            </div>
          ))}
        </div>

        {step === 0 && (
          <>
            <Input label="Full Name" name="name" values={f.values} set={f.set} required />
            <Input label="Email" name="email" type="email" values={f.values} set={f.set} required />
          </>
        )}
        {step === 1 && (
          <>
            <Input label="Phone" name="phone" type="tel" values={f.values} set={f.set} />
            <Textarea label="Notes" name="notes" values={f.values} set={f.set} />
          </>
        )}
        {step === 2 && (
          <>
            <div className="bg-gray-50 rounded-lg p-4 text-xs text-gray-600 space-y-1">
              <div>Name: {f.values.name}</div>
              <div>Email: {f.values.email}</div>
              <div>Phone: {f.values.phone || "—"}</div>
              <div>Notes: {f.values.notes || "—"}</div>
            </div>
            <ConsentCheckbox agreed={f.agreed} setAgreed={f.setAgreed} />
          </>
        )}

        {f.done && <SuccessBanner id={ID} onReset={() => { f.setDone(false); setStep(0); }} />}

        <div className="flex justify-between pt-2">
          <button
            type="button"
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            disabled={step === 0}
            className="px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 disabled:opacity-40"
          >
            Back
          </button>
          {step < STEPS.length - 1 ? (
            <button
              type="button"
              onClick={() => setStep((s) => s + 1)}
              className="px-5 py-2 bg-sky-600 text-white rounded-lg text-sm font-semibold hover:bg-sky-700"
            >
              Next
            </button>
          ) : (
            <button
              type="submit"
              da-trigger={DA_TRIGGER}
              data-form-id={ID}
              disabled={f.submitting || !f.agreed}
              className="px-5 py-2 bg-sky-600 text-white rounded-lg text-sm font-semibold hover:bg-sky-700 disabled:opacity-60"
            >
              {f.submitting ? "Submitting..." : "Finish & Submit"}
            </button>
          )}
        </div>
      </form>
    </PageShell>
  );
}
