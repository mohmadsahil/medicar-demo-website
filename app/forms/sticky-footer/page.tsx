"use client";
import { DA_TRIGGER, PageShell, Input, Textarea, ConsentCheckbox, SuccessBanner, useFormState } from "@/components/forms/shared";

const ID = "sticky-footer";

export default function Page() {
  const f = useFormState();
  return (
    <PageShell title="Sticky Footer Submit" subtitle="Submit stays pinned to viewport bottom on long forms.">
      <form
        onSubmit={(e) => { e.preventDefault(); f.submit(ID); }}
        className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4 pb-24"
      >
        {Array.from({ length: 8 }).map((_, i) => (
          <Input key={i} label={`Field ${i + 1}`} name={`f${i}`} values={f.values} set={f.set} />
        ))}
        <Textarea label="Notes" name="notes" values={f.values} set={f.set} />
        <ConsentCheckbox agreed={f.agreed} setAgreed={f.setAgreed} />
        {f.done && <SuccessBanner id={ID} onReset={() => f.setDone(false)} />}

        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-3 z-40">
          <div className="max-w-3xl mx-auto flex items-center justify-between">
            <span className="text-xs text-gray-500">Sticky footer — always visible.</span>
            <button
              type="submit"
              da-trigger={DA_TRIGGER}
              data-form-id={ID}
              disabled={f.submitting || !f.agreed}
              className="bg-sky-600 text-white px-6 py-2 rounded-lg text-sm font-semibold hover:bg-sky-700 disabled:opacity-60"
            >
              {f.submitting ? "Submitting..." : "Submit"}
            </button>
          </div>
        </div>
      </form>
    </PageShell>
  );
}
