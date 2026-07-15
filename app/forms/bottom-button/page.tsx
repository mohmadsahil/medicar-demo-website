"use client";
import { DA_TRIGGER, PageShell, Input, Textarea, ConsentCheckbox, SuccessBanner, useFormState } from "@/components/forms/shared";

const ID = "bottom-button";

export default function Page() {
  const f = useFormState();
  return (
    <PageShell title="Bottom Submit Button" subtitle="Classic layout — submit at end of form.">
      <form
        onSubmit={(e) => { e.preventDefault(); f.submit(ID); }}
        className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4"
      >
        <Input label="Full Name" name="name" values={f.values} set={f.set} required />
        <Input label="Email" name="email" type="email" values={f.values} set={f.set} required />
        <Input label="Phone" name="phone" type="tel" values={f.values} set={f.set} />
        <Textarea label="Message" name="message" values={f.values} set={f.set} required />
        <ConsentCheckbox agreed={f.agreed} setAgreed={f.setAgreed} />

        <button
          type="submit"
          da-trigger={DA_TRIGGER}
          data-form-id={ID}
          disabled={f.submitting || !f.agreed}
          className="w-full bg-sky-600 text-white py-3 rounded-lg text-sm font-semibold hover:bg-sky-700 disabled:opacity-60"
        >
          {f.submitting ? "Submitting..." : "Submit Form"}
        </button>

        {f.done && <SuccessBanner id={ID} onReset={() => f.setDone(false)} />}
      </form>
    </PageShell>
  );
}
