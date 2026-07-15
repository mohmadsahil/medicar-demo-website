"use client";
import { DA_TRIGGER, PageShell, Input, ConsentCheckbox, SuccessBanner, useFormState } from "@/components/forms/shared";
import { Gift, Heart } from "lucide-react";

const ID = "donation";
const AMOUNTS = ["500", "1000", "2500", "5000"];

export default function Page() {
  const f = useFormState();
  return (
    <PageShell title="Donate or Register as Donor" subtitle="Support the hospital foundation, or register as a blood/organ donor.">
      <form
        onSubmit={(e) => { e.preventDefault(); f.submit(ID); }}
        className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4"
      >
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-rose-100 rounded-xl flex items-center justify-center">
            <Heart size={22} className="text-rose-600" />
          </div>
          <div className="text-xs text-gray-500">80G tax-exempt receipts emailed within 24 hours.</div>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <Input label="Full Name" name="name" values={f.values} set={f.set} required />
          <Input label="Email" name="email" type="email" values={f.values} set={f.set} required />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-2">Type</label>
          <div className="grid grid-cols-3 gap-2">
            {["Monetary", "Blood Donor", "Organ Donor"].map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => f.set("type", t)}
                className={`px-3 py-2 text-xs rounded-lg border ${f.values.type === t ? "border-rose-500 bg-rose-50 text-rose-700 font-semibold" : "border-gray-200"}`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
        {f.values.type === "Monetary" && (
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-2">Amount (₹)</label>
            <div className="grid grid-cols-4 gap-2">
              {AMOUNTS.map((a) => (
                <button
                  key={a}
                  type="button"
                  onClick={() => f.set("amount", a)}
                  className={`px-3 py-2 text-sm rounded-lg border ${f.values.amount === a ? "border-rose-500 bg-rose-50 text-rose-700 font-semibold" : "border-gray-200"}`}
                >
                  ₹{a}
                </button>
              ))}
            </div>
          </div>
        )}
        {f.values.type === "Blood Donor" && (
          <Input label="Blood Group" name="bloodGroup" values={f.values} set={f.set} />
        )}
        <ConsentCheckbox agreed={f.agreed} setAgreed={f.setAgreed} />
        {f.done && <SuccessBanner id={ID} onReset={() => f.setDone(false)} />}
        <button
          type="submit"
          da-trigger={DA_TRIGGER}
          data-form-id={ID}
          disabled={f.submitting || !f.agreed}
          className="w-full bg-rose-600 text-white py-2.5 rounded-lg text-sm font-semibold hover:bg-rose-700 disabled:opacity-60 flex items-center justify-center gap-2"
        >
          <Gift size={16} /> {f.submitting ? "Submitting..." : "Submit"}
        </button>
      </form>
    </PageShell>
  );
}
