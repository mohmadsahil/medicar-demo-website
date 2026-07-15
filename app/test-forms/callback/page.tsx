"use client";
import { DA_TRIGGER, PageShell, Input, ConsentCheckbox, SuccessBanner, useFormState } from "@/components/forms/shared";

const ID = "callback";

export default function Page() {
  const f = useFormState();
  return (
    <PageShell title="Request a Callback" subtitle="Our care team will call you back at your preferred time.">
      <form
        onSubmit={(e) => { e.preventDefault(); f.submit(ID); }}
        className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4"
      >
        <div className="grid sm:grid-cols-2 gap-4">
          <Input label="Full Name" name="name" values={f.values} set={f.set} required />
          <Input label="Phone" name="phone" type="tel" values={f.values} set={f.set} required />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-2">Preferred Time</label>
          <div className="grid grid-cols-3 gap-2">
            {["Morning", "Afternoon", "Evening"].map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => f.set("preferredTime", t)}
                className={`px-3 py-2 text-sm rounded-lg border ${f.values.preferredTime === t ? "border-sky-600 bg-sky-50 text-sky-700 font-semibold" : "border-gray-200 text-gray-700"}`}
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
          className="w-full bg-sky-600 text-white py-2.5 rounded-lg text-sm font-semibold hover:bg-sky-700 disabled:opacity-60"
        >
          {f.submitting ? "Requesting..." : "Request Callback"}
        </button>
      </form>
    </PageShell>
  );
}
