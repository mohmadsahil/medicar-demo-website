"use client";
import { DA_TRIGGER, PageShell, Input, Textarea, ConsentCheckbox, SuccessBanner, useFormState } from "@/components/forms/shared";

const ID = "side-panel";

export default function Page() {
  const f = useFormState();
  return (
    <PageShell title="Side Panel Submit" subtitle="Form on left, summary + submit on right.">
      <form
        onSubmit={(e) => { e.preventDefault(); f.submit(ID); }}
        className="grid md:grid-cols-3 gap-4"
      >
        <div className="md:col-span-2 bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
          <Input label="Full Name" name="name" values={f.values} set={f.set} required />
          <Input label="Email" name="email" type="email" values={f.values} set={f.set} required />
          <Input label="Company" name="company" values={f.values} set={f.set} />
          <Textarea label="Details" name="details" values={f.values} set={f.set} />
          <ConsentCheckbox agreed={f.agreed} setAgreed={f.setAgreed} />
        </div>
        <aside className="bg-white rounded-2xl border border-gray-100 p-6 space-y-3 h-fit md:sticky md:top-6">
          <div className="font-semibold text-gray-900 text-sm">Summary</div>
          <div className="text-xs text-gray-500 space-y-1">
            <div>Name: {f.values.name || "—"}</div>
            <div>Email: {f.values.email || "—"}</div>
            <div>Company: {f.values.company || "—"}</div>
          </div>
          <button
            type="submit"
            da-trigger={DA_TRIGGER}
            data-form-id={ID}
            disabled={f.submitting || !f.agreed}
            className="w-full bg-sky-600 text-white py-2.5 rounded-lg text-sm font-semibold hover:bg-sky-700 disabled:opacity-60"
          >
            {f.submitting ? "Submitting..." : "Send Request"}
          </button>
          {f.done && <SuccessBanner id={ID} onReset={() => f.setDone(false)} />}
        </aside>
      </form>
    </PageShell>
  );
}
