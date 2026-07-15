"use client";
import { DA_TRIGGER, PageShell, Input, ConsentCheckbox, SuccessBanner, useFormState } from "@/components/forms/shared";
import { Mail } from "lucide-react";

const ID = "newsletter";

export default function Page() {
  const f = useFormState();
  return (
    <PageShell title="Newsletter Subscribe" subtitle="Health tips and hospital updates delivered to your inbox.">
      <form
        onSubmit={(e) => { e.preventDefault(); f.submit(ID); }}
        className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4"
      >
        <div className="w-12 h-12 bg-sky-100 rounded-xl flex items-center justify-center">
          <Mail size={20} className="text-sky-600" />
        </div>
        <Input label="Email" name="email" type="email" values={f.values} set={f.set} required />
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Frequency</label>
          <select
            value={f.values.frequency ?? ""}
            onChange={(e) => f.set("frequency", e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
          >
            <option value="">Choose...</option>
            {["Weekly", "Monthly", "Quarterly"].map((o) => <option key={o}>{o}</option>)}
          </select>
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
          {f.submitting ? "Subscribing..." : "Subscribe"}
        </button>
      </form>
    </PageShell>
  );
}
