"use client";
import { useState, useEffect } from "react";
import { CheckCircle, Clock, Home } from "lucide-react";

interface Package {
  _id: string;
  name: string;
  category: string;
  description: string;
  price: number;
  originalPrice?: number;
  tests: string[];
  reportDelivery: string;
  fasting: boolean;
  homeCollection: boolean;
  isPopular: boolean;
}

export default function HealthPackagesPage() {
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Demo data — in production loaded from /api/health-packages
    setPackages([
      {
        _id: "1", name: "Comprehensive Health Check", category: "Full Body",
        description: "Complete annual health assessment covering 80+ parameters.",
        price: 3499, originalPrice: 4999,
        tests: ["CBC", "Lipid Profile", "Liver Function", "Kidney Function", "Thyroid", "Blood Sugar", "Urine Routine", "ECG", "Chest X-Ray"],
        reportDelivery: "24 Hours", fasting: true, homeCollection: true, isPopular: true,
      },
      {
        _id: "2", name: "Cardiac Risk Package", category: "Cardiac",
        description: "Advanced cardiac screening for early detection of heart disease.",
        price: 2199, originalPrice: 2999,
        tests: ["Lipid Profile", "hs-CRP", "Homocysteine", "ECG", "Echocardiography", "Treadmill Test"],
        reportDelivery: "48 Hours", fasting: true, homeCollection: false, isPopular: true,
      },
      {
        _id: "3", name: "Diabetes Care Package", category: "Diabetes",
        description: "Comprehensive diabetes monitoring and complication screening.",
        price: 1499,
        tests: ["HbA1c", "Fasting Blood Sugar", "PP Sugar", "Kidney Function", "Urine Microalbumin", "Fundus Exam"],
        reportDelivery: "24 Hours", fasting: true, homeCollection: true, isPopular: false,
      },
      {
        _id: "4", name: "Women's Wellness Package", category: "Women",
        description: "Tailored health screening for women aged 25–60.",
        price: 2799, originalPrice: 3999,
        tests: ["CBC", "Thyroid", "Hormones", "Vitamin D", "Pap Smear", "Mammography", "DEXA Scan"],
        reportDelivery: "48 Hours", fasting: false, homeCollection: false, isPopular: true,
      },
    ]);
    setLoading(false);
  }, []);

  return (
    <div>
      <section className="bg-gradient-to-br from-sky-700 to-teal-600 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-3">Health Packages</h1>
          <p className="text-sky-100">Affordable preventive health screenings with same-day reports.</p>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          {loading ? (
            <div className="text-center py-20 text-gray-400">Loading packages...</div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-2 gap-6">
              {packages.map((pkg) => (
                <div key={pkg._id} className={`bg-white rounded-xl border overflow-hidden hover:shadow-md transition-shadow ${pkg.isPopular ? "border-sky-200" : "border-gray-100"}`}>
                  {pkg.isPopular && (
                    <div className="bg-sky-600 text-white text-xs font-semibold text-center py-1.5">⭐ Most Popular</div>
                  )}
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-bold text-gray-900 text-lg">{pkg.name}</h3>
                        <span className="text-xs bg-sky-50 text-sky-700 px-2 py-0.5 rounded-full">{pkg.category}</span>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-sky-600">₹{pkg.price}</div>
                        {pkg.originalPrice && (
                          <div className="text-sm text-gray-400 line-through">₹{pkg.originalPrice}</div>
                        )}
                      </div>
                    </div>
                    <p className="text-sm text-gray-500 mb-4">{pkg.description}</p>
                    <div className="flex gap-4 text-xs text-gray-500 mb-4">
                      <span className="flex items-center gap-1"><Clock size={12} /> {pkg.reportDelivery}</span>
                      {pkg.homeCollection && <span className="flex items-center gap-1"><Home size={12} /> Home Collection</span>}
                      {pkg.fasting && <span className="flex items-center gap-1">⚡ Fasting Required</span>}
                    </div>
                    <div className="grid grid-cols-2 gap-1.5 mb-5">
                      {pkg.tests.slice(0, 6).map((test) => (
                        <div key={test} className="flex items-center gap-1.5 text-xs text-gray-600">
                          <CheckCircle size={12} className="text-green-500 shrink-0" /> {test}
                        </div>
                      ))}
                      {pkg.tests.length > 6 && (
                        <div className="text-xs text-sky-600">+{pkg.tests.length - 6} more tests</div>
                      )}
                    </div>
                    <button className="w-full bg-sky-600 text-white py-2.5 rounded-lg font-semibold hover:bg-sky-700 transition-colors text-sm">
                      Book This Package
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
