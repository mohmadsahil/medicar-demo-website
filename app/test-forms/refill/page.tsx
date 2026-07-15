"use client";
import { DA_TRIGGER, PageShell, Input, ConsentCheckbox, SuccessBanner, useFormState } from "@/components/forms/shared";
import { Pill } from "lucide-react";

const ID = "refill";

export default function Page() {
  const f = useFormState();
  return (
    <PageShell title="Prescription Refill" subtitle="Refill an existing prescription. We verify with your treating doctor.">
      <form
        onSubmit={(e) => { e.preventDefault(); f.submit(ID); }}
        className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4"
      >
        <div className="flex items-center gap-3 p-3 bg-sky-50 rounded-lg">
          <Pill size={20} className="text-sky-600" />
          <div className="text-xs text-sky-800">Refills fulfilled within 24 hours during weekdays.</div>
        </div>
        <Input label="Patient ID" name="patientId" values={f.values} set={f.set} required />
        <Input label="Medication Name" name="medication" values={f.values} set={f.set} required />
        <div className="grid sm:grid-cols-2 gap-4">
          <Input label="Dosage" name="dosage" values={f.values} set={f.set} />
          <Input label="Quantity" name="quantity" type="number" values={f.values} set={f.set} />
        </div>
        <Input label="Preferred Pharmacy" name="pharmacy" values={f.values} set={f.set} />
        <ConsentCheckbox agreed={f.agreed} setAgreed={f.setAgreed} />
        {f.done && <SuccessBanner id={ID} onReset={() => f.setDone(false)} />}
        <button
          type="submit"
          da-trigger={DA_TRIGGER}
          data-form-id={ID}
          disabled={f.submitting || !f.agreed}
          className="w-full bg-sky-600 text-white py-2.5 rounded-lg text-sm font-semibold hover:bg-sky-700 disabled:opacity-60"
        >
          {f.submitting ? "Submitting..." : "Request Refill"}
        </button>
      </form>
    </PageShell>
  );
}
