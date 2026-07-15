"use client";
import { DA_TRIGGER, PageShell, Input, Textarea, ConsentCheckbox, SuccessBanner, useFormState } from "@/components/forms/shared";
import { useState } from "react";
import { Star } from "lucide-react";

const ID = "feedback";

export default function Page() {
  const f = useFormState();
  const [rating, setRating] = useState(0);
  return (
    <PageShell title="Patient Feedback" subtitle="Tell us how your recent visit went.">
      <form
        onSubmit={(e) => { e.preventDefault(); f.set("rating", String(rating)); f.submit(ID); }}
        className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4"
      >
        <Input label="Full Name" name="name" values={f.values} set={f.set} required />
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Rating</label>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setRating(n)}
                className={n <= rating ? "text-yellow-400" : "text-gray-300"}
              >
                <Star size={28} fill={n <= rating ? "currentColor" : "none"} />
              </button>
            ))}
          </div>
        </div>
        <Textarea label="Comments" name="comments" values={f.values} set={f.set} required />
        <ConsentCheckbox agreed={f.agreed} setAgreed={f.setAgreed} />
        {f.done && <SuccessBanner id={ID} onReset={() => { f.setDone(false); setRating(0); }} />}
        <button
          type="submit"
          da-trigger={DA_TRIGGER}
          data-form-id={ID}
          disabled={f.submitting || !f.agreed}
          className="w-full bg-sky-600 text-white py-2.5 rounded-lg text-sm font-semibold hover:bg-sky-700 disabled:opacity-60"
        >
          {f.submitting ? "Sending..." : "Send Feedback"}
        </button>
      </form>
    </PageShell>
  );
}
