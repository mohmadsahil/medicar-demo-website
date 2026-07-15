"use client";
import { DA_TRIGGER, PageShell, Input, ConsentCheckbox, SuccessBanner, useFormState } from "@/components/forms/shared";

const ID = "lab-test";
const TESTS = ["CBC", "Lipid Profile", "Thyroid Panel", "HbA1c", "Vitamin D", "Liver Function"];

export default function Page() {
  const f = useFormState();
  const selected = (f.values.tests ?? "").split(",").filter(Boolean);
  const toggle = (t: string) => {
    const next = selected.includes(t) ? selected.filter((x) => x !== t) : [...selected, t];
    f.set("tests", next.join(","));
  };
  return (
    <PageShell title="Book a Lab Test" subtitle="Choose one or more tests, then pick a slot.">
      <form
        onSubmit={(e) => { e.preventDefault(); f.submit(ID); }}
        className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4"
      >
        <div className="grid sm:grid-cols-2 gap-4">
          <Input label="Full Name" name="name" values={f.values} set={f.set} required />
          <Input label="Phone" name="phone" type="tel" values={f.values} set={f.set} required />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-2">Tests</label>
          <div className="flex flex-wrap gap-2">
            {TESTS.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => toggle(t)}
                className={`px-3 py-1.5 text-xs rounded-full border ${selected.includes(t) ? "bg-sky-600 text-white border-sky-600" : "border-gray-200 text-gray-700"}`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <Input label="Preferred Date" name="date" type="date" values={f.values} set={f.set} required />
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Collection</label>
            <select
              value={f.values.collection ?? ""}
              onChange={(e) => f.set("collection", e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
            >
              <option value="">Choose...</option>
              <option>At Lab</option>
              <option>Home Collection</option>
            </select>
          </div>
        </div>
        <ConsentCheckbox agreed={f.agreed} setAgreed={f.setAgreed} />
        {f.done && <SuccessBanner id={ID} onReset={() => f.setDone(false)} />}
        <button
          type="submit"
          da-trigger={DA_TRIGGER}
          data-form-id={ID}
          disabled={f.submitting || !f.agreed}
          className="w-full bg-sky-600 text-white py-2.5 rounded-lg text-sm font-semibold hover:bg-sky-700 disabled:opacity-60"
        >
          {f.submitting ? "Booking..." : "Book Test"}
        </button>
      </form>
    </PageShell>
  );
}
