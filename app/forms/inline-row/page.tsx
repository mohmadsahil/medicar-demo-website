"use client";
import { DA_TRIGGER, PageShell, ConsentCheckbox, SuccessBanner, useFormState } from "@/components/forms/shared";

const ID = "inline-row";

export default function Page() {
  const f = useFormState();
  return (
    <PageShell title="Inline Row Submit" subtitle="Input and submit share a single row.">
      <form
        onSubmit={(e) => { e.preventDefault(); f.submit(ID); }}
        className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4"
      >
        <div className="flex gap-2">
          <input
            type="email"
            required
            placeholder="you@example.com"
            value={f.values.email ?? ""}
            onChange={(e) => f.set("email", e.target.value)}
            className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
          />
          <button
            type="submit"
            da-trigger={DA_TRIGGER}
            data-form-id={ID}
            disabled={f.submitting || !f.agreed}
            className="bg-sky-600 text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-sky-700 disabled:opacity-60 whitespace-nowrap"
          >
            {f.submitting ? "..." : "Subscribe"}
          </button>
        </div>
        <ConsentCheckbox agreed={f.agreed} setAgreed={f.setAgreed} />
        {f.done && <SuccessBanner id={ID} onReset={() => f.setDone(false)} />}
      </form>
    </PageShell>
  );
}
