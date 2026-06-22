import { Metadata } from "next";

export const metadata: Metadata = { title: "Consents" };

export default function ConsentsPage() {
  return (
    <div>
      <section className="bg-gradient-to-br from-sky-700 to-teal-600 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-3">Consents</h1>
          <div id="consent-detail-root"></div>
        </div>
      </section>
    </div>
  );
}
