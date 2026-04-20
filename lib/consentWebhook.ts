import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import Contact from "@/models/Contact";
import Application from "@/models/Application";

type ConsentFlag = {
  consentGranted?: boolean;
  consentRevoked?: boolean;
  consentErased?: boolean;
  consentAutoExpired?: boolean;
  consentExtended?: boolean;
  consentUpdated?: boolean;
};

export async function applyConsentFlag(referenceId: string, flag: ConsentFlag): Promise<boolean> {
  await connectDB();

  const [u, c, a] = await Promise.all([
    User.findOneAndUpdate({ referenceId }, { $set: flag }, { new: true }),
    Contact.findOneAndUpdate({ referenceId }, { $set: flag }, { new: true }),
    Application.findOneAndUpdate({ referenceId }, { $set: flag }, { new: true }),
  ]);

  return !!(u || c || a);
}
