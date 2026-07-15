"use client";
import { DA_TRIGGER, PageShell, Input, Textarea, ConsentCheckbox, SuccessBanner, useFormState } from "@/components/forms/shared";

const ID = "top-button";

export default function Page() {
  const f = useFormState();
  return (
    <PageShell title="Top Submit Button" subtitle="Primary action sits above the fields.">
      <form
        onSubmit={(e) => { e.preventDefault(); f.submit(ID); }}
        className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4"
      >
        <div className="flex items-center justify-between border-b border-gray-100 pb-4">
          <div>
            <div className="font-semibold text-gray-900">Quick Intake</div>
            <div className="text-xs text-gray-500">Kiosk-style entry — submit is up front.</div>
          </div>
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

        <Input label="Full Name" name="name" values={f.values} set={f.set} required />
        <Input label="Email" name="email" type="email" values={f.values} set={f.set} required />
        <Textarea label="Reason" name="reason" values={f.values} set={f.set} />
        <ConsentCheckbox agreed={f.agreed} setAgreed={f.setAgreed} />

        {f.done && <SuccessBanner id={ID} onReset={() => f.setDone(false)} />}
      </form>
    </PageShell>
  );
}
