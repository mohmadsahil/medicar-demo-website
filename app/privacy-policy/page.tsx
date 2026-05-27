import { Metadata } from "next";
import { Shield } from "lucide-react";

export const metadata: Metadata = { title: "Privacy Policy" };

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="bg-sky-700 text-white py-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex items-center gap-3 mb-2">
            <Shield size={26} />
            <h1 className="text-3xl font-bold">Privacy Policy</h1>
          </div>
          <p className="text-sky-200 text-sm">Effective Date: 1 January 2024 | Last Updated: 1 January 2025</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-xl border border-gray-100 p-8 prose prose-sm max-w-none text-gray-700 leading-relaxed">
          <div className="bg-sky-50 border border-sky-100 rounded-lg p-4 mb-8 not-prose">
            <div className="font-semibold text-sky-800 mb-1">🏥 Data Fiduciary Statement</div>
            <p className="text-sm text-sky-700">
              MediCare Plus Hospital (MediCare Plus Healthcare Pvt. Ltd.) is a registered Data Fiduciary under the
              Digital Personal Data Protection Act 2023 (DPDP Act 2023), Government of India.
              Our Data Protection Officer (DPO) can be reached at dpo@medicare.example.
            </p>
          </div>

          {[
            {
              title: "1. Information We Collect (Section 5 — Notice)",
              content: `We collect personal data that you provide when you register, book appointments, or interact with our website. This includes:
• Identification data: name, date of birth, gender
• Contact data: email address, mobile number
• Health data: medical history, appointment details, diagnostic reports
• Technical data: IP address, browser type, cookies

We collect this data only for specific, lawful purposes with your consent (DPDP Act 2023, Section 4).`,
            },
            {
              title: "2. How We Use Your Data (Section 5 — Processing Purposes)",
              content: `Your personal data is processed for:
• Providing medical diagnosis, treatment, and care (mandatory)
• Managing appointments and scheduling (mandatory)
• Sending appointment reminders and health communications (optional consent)
• Improving our services through anonymized analytics (optional consent)
• Compliance with legal and regulatory obligations

We do not sell, rent, or trade your personal data to third parties for commercial purposes.`,
            },
            {
              title: "3. Your Rights as a Data Principal (Sections 11–14)",
              content: `Under the DPDP Act 2023, you have the following rights:
• Section 11 — Right to access: Request a summary of personal data we hold about you
• Section 12 — Right to correction: Correct inaccurate or incomplete data
• Section 13 — Right to erasure: Request deletion of data no longer needed
• Section 14 — Right to grievance redressal: File a complaint with our DPO

To exercise these rights, visit your Patient Portal or contact dpo@medicare.example.`,
            },
            {
              title: "4. Consent (Section 6)",
              content: `Your consent is free, specific, informed, and unambiguous. You may:
• Grant or withdraw consent for each purpose individually
• Withdraw consent at any time without affecting prior processing (Section 6(4))
• Request a copy of your consent receipt

Withdrawal of consent may affect certain services. Mandatory consents (e.g., medical treatment) are required to provide care.`,
            },
            {
              title: "5. Data Retention (Section 7)",
              content: `We retain your data only as long as necessary for the purpose it was collected. Health records are retained for 7 years as required by the Clinical Establishments Act. After this period, data is securely deleted.`,
            },
            {
              title: "6. Data Security",
              content: `We implement appropriate technical and organizational measures to protect your data, including encryption, access controls, and regular security audits. In the event of a data breach, we will notify you and the Data Protection Board as required by law.`,
            },
            {
              title: "7. Contact & Grievances (Section 13)",
              content: `For any privacy-related concerns:
• DPO Email: dpo@medicare.example
• Grievance Portal: /grievance
• Data Protection Board of India: dpboard.gov.in (once operational)

We will respond to grievances within 30 days as required under the DPDP Act 2023.`,
            },
          ].map(({ title, content }) => (
            <div key={title} className="mb-8">
              <h2 className="text-lg font-bold text-gray-900 mb-3">{title}</h2>
              <p className="whitespace-pre-line text-gray-600">{content}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
