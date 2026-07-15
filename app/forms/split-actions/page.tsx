"use client";
import { DA_TRIGGER, PageShell, Input, Textarea, ConsentCheckbox, SuccessBanner, useFormState } from "@/components/forms/shared";

const ID = "split-actions";

export default function Page() {
  const f = useFormState();
  return (
    <PageShell title="Split Actions" subtitle="Draft save + final submit side-by-side.">
      <form
        onSubmit={(e) => { e.preventDefault(); f.submit(ID); }}
        className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4"
      >
        <Input label="Title" name="title" values={f.values} set={f.set} required />
        <Textarea label="Description" name="description" values={f.values} set={f.set} />
        <ConsentCheckbox agreed={f.agreed} setAgreed={f.setAgreed} />
        {f.done && <SuccessBanner id={ID} onReset={() => f.setDone(false)} />}

        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={() => console.log(`[Form:${ID}] draft saved`, f.values)}
            className="flex-1 border border-gray-200 text-gray-700 py-2.5 rounded-lg text-sm font-semibold hover:bg-gray-50"
          >
            Save Draft
          </button>
          <button
            type="submit"
            da-trigger={DA_TRIGGER}
            data-form-id={ID}
            disabled={f.submitting || !f.agreed}
            className="flex-1 bg-sky-600 text-white py-2.5 rounded-lg text-sm font-semibold hover:bg-sky-700 disabled:opacity-60"
          >
            {f.submitting ? "Submitting..." : "Submit Final"}
          </button>
        </div>
      </form>
    </PageShell>
  );
}
