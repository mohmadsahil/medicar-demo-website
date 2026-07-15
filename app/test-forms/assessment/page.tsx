"use client";
import { DA_TRIGGER, PageShell, Input, Textarea, ConsentCheckbox, SuccessBanner, useFormState } from "@/components/forms/shared";

const ID = "assessment";

export default function Page() {
  const f = useFormState();
  return (
    <PageShell title="Free Health Assessment" subtitle="Quick self-assessment. A doctor reviews and reaches back.">
      <form
        onSubmit={(e) => { e.preventDefault(); f.submit(ID); }}
        className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4"
      >
        <div className="grid sm:grid-cols-2 gap-4">
          <Input label="Age" name="age" type="number" values={f.values} set={f.set} required />
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Gender</label>
            <select
              value={f.values.gender ?? ""}
              onChange={(e) => f.set("gender", e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
            >
              <option value="">Choose...</option>
              <option>Male</option><option>Female</option><option>Other</option>
            </select>
          </div>
        </div>
        <Textarea label="Existing Conditions" name="conditions" values={f.values} set={f.set} />
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-2">Smoking</label>
          <div className="flex gap-2">
            {["No", "Occasional", "Regular"].map((v) => (
              <label key={v} className={`flex-1 px-3 py-2 text-center text-sm rounded-lg border cursor-pointer ${f.values.smoker === v ? "border-sky-600 bg-sky-50 text-sky-700" : "border-gray-200"}`}>
                <input type="radio" name="smoker" className="sr-only" checked={f.values.smoker === v} onChange={() => f.set("smoker", v)} />
                {v}
              </label>
            ))}
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
          {f.submitting ? "Submitting..." : "Submit Assessment"}
        </button>
      </form>
    </PageShell>
  );
}
