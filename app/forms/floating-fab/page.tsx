"use client";
import { DA_TRIGGER, PageShell, Input, Textarea, ConsentCheckbox, SuccessBanner, useFormState } from "@/components/forms/shared";
import { Send } from "lucide-react";

const ID = "floating-fab";

export default function Page() {
  const f = useFormState();
  return (
    <PageShell title="Floating Action Button" subtitle="Round FAB in the corner acts as the submit trigger.">
      <form
        onSubmit={(e) => { e.preventDefault(); f.submit(ID); }}
        className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4"
      >
        <Input label="Subject" name="subject" values={f.values} set={f.set} required />
        <Textarea label="Body" name="body" values={f.values} set={f.set} required />
        <ConsentCheckbox agreed={f.agreed} setAgreed={f.setAgreed} />
        {f.done && <SuccessBanner id={ID} onReset={() => f.setDone(false)} />}

        <button
          type="submit"
          da-trigger={DA_TRIGGER}
          data-form-id={ID}
          disabled={f.submitting || !f.agreed}
          aria-label="Submit"
          className="fixed bottom-6 right-6 w-14 h-14 bg-sky-600 text-white rounded-full shadow-lg hover:bg-sky-700 disabled:opacity-60 flex items-center justify-center z-50"
        >
          <Send size={20} />
        </button>
      </form>
    </PageShell>
  );
}
