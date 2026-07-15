"use client";
import { DA_TRIGGER, PageShell, Input, Textarea, ConsentCheckbox, SuccessBanner, useFormState } from "@/components/forms/shared";
import { Ambulance, AlertTriangle } from "lucide-react";

const ID = "ambulance";

export default function Page() {
  const f = useFormState();
  return (
    <PageShell title="Book an Ambulance" subtitle="Non-emergency transport bookings.">
      <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-2 mb-4">
        <AlertTriangle size={18} className="text-red-600 shrink-0 mt-0.5" />
        <div className="text-xs text-red-800">
          For medical emergencies, dial <strong>108</strong> immediately. This form is for scheduled/non-emergency transport only.
        </div>
      </div>
      <form
        onSubmit={(e) => { e.preventDefault(); f.submit(ID); }}
        className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4"
      >
        <Ambulance size={28} className="text-red-600" />
        <div className="grid sm:grid-cols-2 gap-4">
          <Input label="Patient Name" name="name" values={f.values} set={f.set} required />
          <Input label="Contact Phone" name="phone" type="tel" values={f.values} set={f.set} required />
        </div>
        <Textarea label="Pickup Address" name="pickup" values={f.values} set={f.set} required />
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-2">Ambulance Type</label>
          <div className="grid grid-cols-3 gap-2">
            {["Basic", "Advanced LS", "Cardiac"].map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => f.set("type", t)}
                className={`px-3 py-2 text-xs rounded-lg border ${f.values.type === t ? "border-red-500 bg-red-50 text-red-700 font-semibold" : "border-gray-200"}`}
              >
                {t}
              </button>
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
          className="w-full bg-red-600 text-white py-2.5 rounded-lg text-sm font-semibold hover:bg-red-700 disabled:opacity-60"
        >
          {f.submitting ? "Requesting..." : "Request Ambulance"}
        </button>
      </form>
    </PageShell>
  );
}
