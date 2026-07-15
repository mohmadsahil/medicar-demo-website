"use client";
import { DA_TRIGGER, PageShell, Input, ConsentCheckbox, SuccessBanner, useFormState } from "@/components/forms/shared";
import { Syringe } from "lucide-react";

const ID = "vaccination";

export default function Page() {
  const f = useFormState();
  return (
    <PageShell title="Vaccination Booking" subtitle="Reserve a slot for you or family members.">
      <form
        onSubmit={(e) => { e.preventDefault(); f.submit(ID); }}
        className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4"
      >
        <div className="flex items-center gap-3 p-3 bg-sky-50 rounded-lg">
          <Syringe size={20} className="text-sky-600" />
          <div className="text-xs text-sky-800">Government + private vaccines available.</div>
        </div>
        <Input label="Full Name" name="name" values={f.values} set={f.set} required />
        <div className="grid sm:grid-cols-2 gap-4">
          <Input label="Date of Birth" name="dob" type="date" values={f.values} set={f.set} required />
          <Input label="Preferred Date" name="date" type="date" values={f.values} set={f.set} required />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-2">Vaccine</label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {["Influenza", "HPV", "Hepatitis B", "Tdap", "COVID-19", "MMR"].map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => f.set("vaccine", v)}
                className={`px-3 py-2 text-xs rounded-lg border ${f.values.vaccine === v ? "border-sky-600 bg-sky-50 text-sky-700 font-semibold" : "border-gray-200"}`}
              >
                {v}
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
          className="w-full bg-sky-600 text-white py-2.5 rounded-lg text-sm font-semibold hover:bg-sky-700 disabled:opacity-60"
        >
          {f.submitting ? "Booking..." : "Book Slot"}
        </button>
      </form>
    </PageShell>
  );
}
