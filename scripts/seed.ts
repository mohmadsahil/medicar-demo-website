import { config } from "dotenv";
config({ path: ".env.local" });
import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI!;

async function seed() {
  await mongoose.connect(MONGODB_URI);
  console.log("Connected to MongoDB");

  const Department = mongoose.models.Department ?? (await import("../models/Department")).default;
  const Doctor = mongoose.models.Doctor ?? (await import("../models/Doctor")).default;
  const ConsentPurpose = mongoose.models.ConsentPurpose ?? (await import("../models/ConsentPurpose")).default;
  const User = mongoose.models.User ?? (await import("../models/User")).default;

  // Clear existing
  await Promise.all([
    Department.deleteMany({}),
    Doctor.deleteMany({}),
    ConsentPurpose.deleteMany({}),
  ]);

  // Departments
  const departments = await Department.insertMany([
    { name: "Cardiology", slug: "cardiology", shortDescription: "Advanced cardiac care", description: "Comprehensive cardiac care including interventional procedures and cardiac surgery.", icon: "Heart", services: ["Angiography", "Angioplasty", "Bypass Surgery", "Pacemaker Implantation"], isActive: true },
    { name: "Neurology", slug: "neurology", shortDescription: "Brain & spine care", description: "Expert neurological care covering stroke, epilepsy, and movement disorders.", icon: "Brain", services: ["Stroke Management", "Epilepsy Clinic", "EEG", "Spine Surgery"], isActive: true },
    { name: "Orthopedics", slug: "orthopedics", shortDescription: "Joint replacement & sports medicine", description: "Advanced orthopedic care with robotic joint replacement technology.", icon: "Bone", services: ["Knee Replacement", "Hip Replacement", "Sports Injury", "Arthroscopy"], isActive: true },
    { name: "Pediatrics", slug: "pediatrics", shortDescription: "Expert care for children", description: "Comprehensive pediatric and neonatal care services.", icon: "Baby", services: ["Well-baby Care", "Vaccination", "NICU", "Developmental Pediatrics"], isActive: true },
    { name: "Oncology", slug: "oncology", shortDescription: "Cancer care center", description: "Multidisciplinary cancer care with advanced chemotherapy and BMT.", icon: "FlaskConical", services: ["Medical Oncology", "BMT", "Immunotherapy", "Palliative Care"], isActive: true },
    { name: "Obstetrics & Gynecology", slug: "obstetrics-gynecology", shortDescription: "Women's health", description: "Complete women's healthcare from adolescence through menopause.", icon: "Heart", services: ["Antenatal Care", "High-risk Pregnancy", "Laparoscopy", "Infertility"], isActive: true },
  ]);

  const deptMap = Object.fromEntries(departments.map((d) => [d.slug, d._id]));

  // Doctors
  await Doctor.insertMany([
    { name: "Rajesh Mehta", slug: "dr-rajesh-mehta", department: deptMap["cardiology"], departmentSlug: "cardiology", qualification: "MD, DM (Cardiology)", specialization: "Interventional Cardiology", experience: 18, bio: "Dr. Mehta is a pioneer in interventional cardiology with over 5000 successful procedures.", availableDays: ["Monday", "Wednesday", "Friday"], consultationFee: 1200, rating: 4.9, totalReviews: 312, isActive: true },
    { name: "Priya Sharma", slug: "dr-priya-sharma", department: deptMap["cardiology"], departmentSlug: "cardiology", qualification: "MBBS, MD, DM", specialization: "Electrophysiology", experience: 12, bio: "Dr. Sharma specializes in cardiac electrophysiology and ablation procedures.", availableDays: ["Tuesday", "Thursday", "Saturday"], consultationFee: 1000, rating: 4.8, totalReviews: 198, isActive: true },
    { name: "Anil Kumar", slug: "dr-anil-kumar", department: deptMap["neurology"], departmentSlug: "neurology", qualification: "MD, DM (Neurology)", specialization: "Stroke & Vascular Neurology", experience: 20, bio: "Dr. Kumar has been instrumental in establishing the stroke unit at MediCare Plus.", availableDays: ["Monday", "Tuesday", "Thursday", "Friday"], consultationFee: 1100, rating: 4.9, totalReviews: 445, isActive: true },
    { name: "Sunita Patel", slug: "dr-sunita-patel", department: deptMap["orthopedics"], departmentSlug: "orthopedics", qualification: "MS (Orthopedics)", specialization: "Joint Replacement & Robotic Surgery", experience: 15, bio: "Dr. Patel performs over 300 joint replacements annually using robotic-assisted technology.", availableDays: ["Monday", "Wednesday", "Friday", "Saturday"], consultationFee: 900, rating: 4.8, totalReviews: 267, isActive: true },
    { name: "Deepak Joshi", slug: "dr-deepak-joshi", department: deptMap["pediatrics"], departmentSlug: "pediatrics", qualification: "MD (Pediatrics), DNB", specialization: "Neonatology & Pediatric Critical Care", experience: 14, bio: "Dr. Joshi leads our NICU with expertise in premature infant care.", availableDays: ["Tuesday", "Thursday", "Saturday"], consultationFee: 700, rating: 4.7, totalReviews: 189, isActive: true },
    { name: "Kavita Rao", slug: "dr-kavita-rao", department: deptMap["oncology"], departmentSlug: "oncology", qualification: "MD, DM (Oncology)", specialization: "Medical Oncology & BMT", experience: 16, bio: "Dr. Rao has performed over 200 bone marrow transplants and is a leading oncologist.", availableDays: ["Monday", "Wednesday", "Thursday"], consultationFee: 1500, rating: 4.9, totalReviews: 356, isActive: true },
  ]);

  // Consent Purposes — DPDP Act 2023 compliant
  await ConsentPurpose.insertMany([
    {
      purposeId: "core-treatment",
      name: "Medical Treatment & Care",
      nameHi: "चिकित्सा उपचार एवं देखभाल",
      description: "Processing your personal health data including medical history, diagnostics, and prescriptions to provide medical treatment, diagnosis, and ongoing healthcare.",
      descriptionHi: "आपके स्वास्थ्य डेटा को चिकित्सा उपचार और देखभाल के लिए संसाधित करना।",
      legalBasis: "Consent + Legitimate medical purpose (DPDP Act Section 4)",
      dataCategories: ["Health data", "Medical history", "Diagnostic reports", "Prescriptions"],
      retentionPeriod: "7 years (Clinical Establishments Act mandate)",
      isMandatory: true,
      isActive: true,
      version: 1,
      processingDetails: "Your health data is shared with treating doctors and nurses within MediCare Plus on a need-to-know basis for care delivery.",
      thirdPartySharing: false,
    },
    {
      purposeId: "appointment-mgmt",
      name: "Appointment Management",
      nameHi: "अपॉइंटमेंट प्रबंधन",
      description: "Managing your appointments, sending reminders, scheduling follow-ups, and coordinating between departments.",
      descriptionHi: "आपकी अपॉइंटमेंट का प्रबंधन और रिमाइंडर भेजना।",
      legalBasis: "Consent (DPDP Act Section 6)",
      dataCategories: ["Name", "Contact information", "Appointment details"],
      retentionPeriod: "2 years",
      isMandatory: true,
      isActive: true,
      version: 1,
      processingDetails: "Appointment data is used to schedule and confirm visits, send reminders via email/SMS.",
      thirdPartySharing: false,
    },
    {
      purposeId: "health-comm",
      name: "Health Communications & Updates",
      nameHi: "स्वास्थ्य संचार एवं अपडेट",
      description: "Sending you personalized health tips, test reports, medication reminders, and care plan updates relevant to your health conditions.",
      descriptionHi: "व्यक्तिगत स्वास्थ्य सुझाव और रिपोर्ट भेजना।",
      legalBasis: "Consent (DPDP Act Section 6)",
      dataCategories: ["Email", "Phone", "Health interests"],
      retentionPeriod: "Until consent withdrawn",
      isMandatory: false,
      isActive: true,
      version: 1,
      processingDetails: "We send monthly health newsletters and personalized care reminders.",
      thirdPartySharing: false,
    },
    {
      purposeId: "research",
      name: "Medical Research (Anonymized)",
      nameHi: "चिकित्सा अनुसंधान (अनामीकृत)",
      description: "Contributing your anonymized, de-identified health data to improve treatment protocols, medical research, and public health outcomes. Your identity is never disclosed.",
      descriptionHi: "अनामीकृत डेटा से चिकित्सा अनुसंधान में योगदान।",
      legalBasis: "Consent (DPDP Act Section 6)",
      dataCategories: ["Anonymized health data", "Age group", "Condition category"],
      retentionPeriod: "5 years (anonymized)",
      isMandatory: false,
      isActive: true,
      version: 1,
      processingDetails: "Data is fully anonymized before research use. Results are published in aggregate form only.",
      thirdPartySharing: true,
      thirdParties: ["AIIMS Research Consortium", "Indian Medical Council (anonymized reports)"],
    },
    {
      purposeId: "marketing",
      name: "Health Package Promotions",
      nameHi: "स्वास्थ्य पैकेज प्रचार",
      description: "Informing you about relevant health packages, seasonal offers, and preventive health camps that may benefit you.",
      descriptionHi: "प्रासंगिक स्वास्थ्य पैकेज और ऑफर की जानकारी देना।",
      legalBasis: "Consent (DPDP Act Section 6)",
      dataCategories: ["Name", "Email", "Phone", "Age group"],
      retentionPeriod: "Until consent withdrawn",
      isMandatory: false,
      isActive: true,
      version: 1,
      processingDetails: "Promotional emails and SMS about health packages relevant to your age and conditions.",
      thirdPartySharing: false,
    },
  ]);

  // Demo user with known referenceId (for webhook curl testing)
  await User.findOneAndUpdate(
    { email: "demo@medicare.example" },
    {
      name: "Demo Patient",
      email: "demo@medicare.example",
      isVerified: true,
      role: "patient",
      referenceId: "demo@medicare.example", // referenceId = email in consent manager
    },
    { upsert: true }
  );

  // Admin user
  await User.findOneAndUpdate(
    { email: "admin@medicare.example" },
    {
      name: "Admin User",
      email: "admin@medicare.example",
      isVerified: true,
      role: "admin",
    },
    { upsert: true }
  );

  console.log("✅ Seed complete:");
  console.log("  Departments:", departments.length);
  console.log("  Doctors: 6");
  console.log("  Consent Purposes: 5");
  console.log("  Demo User: demo@medicare.example (referenceId: DEMO-REF-001)");
  console.log("  Admin User: admin@medicare.example");

  await mongoose.disconnect();
}

seed().catch((e) => { console.error(e); process.exit(1); });
