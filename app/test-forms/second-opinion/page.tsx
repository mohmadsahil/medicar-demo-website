"use client";
import { DA_TRIGGER, PageShell, Input, Textarea, ConsentCheckbox, SuccessBanner, useFormState } from "@/components/forms/shared";
import { Stethoscope, Upload } from "lucide-react";

const ID = "second-opinion";

export default function Page() {
  const f = useFormState();
  return (
    <PageShell title="Get a Second Opinion" subtitle="Senior specialists review your case and diagnosis.">
      <form
        onSubmit={(e) => { e.preventDefault(); f.submit(ID); }}
        className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4"
      >
        <Stethoscope size={28} className="text-sky-600" />
        <div className="grid sm:grid-cols-2 gap-4">
          <Input label="Full Name" name="name" values={f.values} set={f.set} required />
          <Input label="Email" name="email" type="email" values={f.values} set={f.set} required />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Specialty</label>
          <select
            value={f.values.specialty ?? ""}
            onChange={(e) => f.set("specialty", e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
          >
            <option value="">Choose...</option>
            {["Oncology", "Cardiology", "Neurology", "Orthopedics", "Other"].map((o) => <option key={o}>{o}</option>)}
          </select>
        </div>
        <Textarea label="Case Summary" name="summary" values={f.values} set={f.set} required />
        <div className="border-2 border-dashed border-gray-200 rounded-lg p-4 text-center text-xs text-gray-500">
          <Upload size={20} className="mx-auto mb-1 text-gray-400" />
          Drop reports / imaging here (mock)
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
          {f.submitting ? "Sending..." : "Request Opinion"}
        </button>
      </form>
    </PageShell>
  );
}
