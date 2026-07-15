"use client";
import { DA_TRIGGER, PageShell, Input, Textarea, ConsentCheckbox, SuccessBanner, useFormState } from "@/components/forms/shared";
import { ShieldCheck } from "lucide-react";

const ID = "insurance";

export default function Page() {
  const f = useFormState();
  return (
    <PageShell title="Insurance / Cashless Query" subtitle="Check network eligibility and pre-authorisation status.">
      <form
        onSubmit={(e) => { e.preventDefault(); f.submit(ID); }}
        className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4"
      >
        <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
          <ShieldCheck size={20} className="text-green-600" />
          <div className="text-xs text-green-800">Empanelled with 30+ insurers including Star, HDFC Ergo, ICICI Lombard.</div>
        </div>
        <Input label="Policy Holder Name" name="name" values={f.values} set={f.set} required />
        <div className="grid sm:grid-cols-2 gap-4">
          <Input label="Insurance Provider" name="insurer" values={f.values} set={f.set} required />
          <Input label="Policy Number" name="policyNumber" values={f.values} set={f.set} required />
        </div>
        <Input label="Sum Insured (₹)" name="sumInsured" type="number" values={f.values} set={f.set} />
        <Textarea label="Planned Treatment" name="treatment" values={f.values} set={f.set} />
        <ConsentCheckbox agreed={f.agreed} setAgreed={f.setAgreed} />
        {f.done && <SuccessBanner id={ID} onReset={() => f.setDone(false)} />}
        <button
          type="submit"
          da-trigger={DA_TRIGGER}
          data-form-id={ID}
          disabled={f.submitting || !f.agreed}
          className="w-full bg-sky-600 text-white py-2.5 rounded-lg text-sm font-semibold hover:bg-sky-700 disabled:opacity-60"
        >
          {f.submitting ? "Checking..." : "Check Coverage"}
        </button>
      </form>
    </PageShell>
  );
}
