"use client";
import { DA_TRIGGER, PageShell, Input, Textarea, ConsentCheckbox, SuccessBanner, useFormState } from "@/components/forms/shared";

const ID = "corner-badge";

export default function Page() {
  const f = useFormState();
  return (
    <PageShell title="Corner Badge Submit" subtitle="Submit rendered as a corner ribbon on the card.">
      <form
        onSubmit={(e) => { e.preventDefault(); f.submit(ID); }}
        className="relative bg-white rounded-2xl border border-gray-100 p-6 space-y-4 pt-10"
      >
        <button
          type="submit"
          da-trigger={DA_TRIGGER}
          data-form-id={ID}
          disabled={f.submitting || !f.agreed}
          className="absolute -top-3 -right-3 bg-sky-600 text-white px-4 py-2 rounded-full text-xs font-semibold shadow-md hover:bg-sky-700 disabled:opacity-60"
        >
          {f.submitting ? "Sending..." : "Send →"}
        </button>

        <Input label="Full Name" name="name" values={f.values} set={f.set} required />
        <Input label="Email" name="email" type="email" values={f.values} set={f.set} required />
        <Textarea label="Query" name="query" values={f.values} set={f.set} required />
        <ConsentCheckbox agreed={f.agreed} setAgreed={f.setAgreed} />
        {f.done && <SuccessBanner id={ID} onReset={() => f.setDone(false)} />}
      </form>
    </PageShell>
  );
}
