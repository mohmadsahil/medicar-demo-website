"use client";
import { useState } from "react";
import { DA_TRIGGER, PageShell, Input, Textarea, ConsentCheckbox, SuccessBanner, useFormState } from "@/components/forms/shared";

const ID = "double-confirm";

export default function Page() {
  const f = useFormState();
  const [confirming, setConfirming] = useState(false);

  return (
    <PageShell title="Double-Confirm Submit" subtitle="Initial submit reveals a confirm bar; second button fires trigger.">
      <form
        onSubmit={(e) => { e.preventDefault(); f.submit(ID); setConfirming(false); }}
        className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4"
      >
        <Input label="Account ID" name="account" values={f.values} set={f.set} required />
        <Textarea label="Reason for deletion" name="reason" values={f.values} set={f.set} required />
        <ConsentCheckbox agreed={f.agreed} setAgreed={f.setAgreed} />
        {f.done && <SuccessBanner id={ID} onReset={() => f.setDone(false)} />}

        {!confirming ? (
          <button
            type="button"
            onClick={() => setConfirming(true)}
            disabled={!f.agreed}
            className="w-full bg-red-600 text-white py-2.5 rounded-lg text-sm font-semibold hover:bg-red-700 disabled:opacity-60"
          >
            Request Deletion
          </button>
        ) : (
          <div className="border border-red-200 bg-red-50 rounded-lg p-3 flex items-center justify-between">
            <span className="text-xs text-red-800">Are you sure? This cannot be undone.</span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setConfirming(false)}
                className="px-3 py-1.5 text-xs text-gray-700 border border-gray-200 rounded-md"
              >
                Cancel
              </button>
              <button
                type="submit"
                da-trigger={DA_TRIGGER}
                data-form-id={ID}
                disabled={f.submitting}
                className="px-3 py-1.5 text-xs bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-60"
              >
                {f.submitting ? "Deleting..." : "Confirm Delete"}
              </button>
            </div>
          </div>
        )}
      </form>
    </PageShell>
  );
}
