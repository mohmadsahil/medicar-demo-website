"use client";
import { DA_TRIGGER, PageShell, Input, Textarea, ConsentCheckbox, SuccessBanner, useFormState } from "@/components/forms/shared";

const ID = "sticky-header";

export default function Page() {
  const f = useFormState();
  return (
    <PageShell title="Sticky Header Submit" subtitle="Submit pinned to top of form while scrolling body.">
      <form
        onSubmit={(e) => { e.preventDefault(); f.submit(ID); }}
        className="bg-white rounded-2xl border border-gray-100 overflow-hidden"
      >
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-3 flex items-center justify-between z-10">
          <div className="font-semibold text-gray-900 text-sm">Long Application Form</div>
          <button
            type="submit"
            da-trigger={DA_TRIGGER}
            data-form-id={ID}
            disabled={f.submitting || !f.agreed}
            className="bg-sky-600 text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-sky-700 disabled:opacity-60"
          >
            {f.submitting ? "Submitting..." : "Submit"}
          </button>
        </div>
        <div className="p-6 space-y-4">
          {Array.from({ length: 10 }).map((_, i) => (
            <Input key={i} label={`Question ${i + 1}`} name={`q${i}`} values={f.values} set={f.set} />
          ))}
          <Textarea label="Comments" name="comments" values={f.values} set={f.set} />
          <ConsentCheckbox agreed={f.agreed} setAgreed={f.setAgreed} />
          {f.done && <SuccessBanner id={ID} onReset={() => f.setDone(false)} />}
        </div>
      </form>
    </PageShell>
  );
}
