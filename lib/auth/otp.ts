import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/mongodb";
import OtpRequest from "@/models/OtpRequest";

const STATIC_OTP = process.env.STATIC_PHONE_OTP ?? "123456";
const OTP_EXPIRY_MINUTES = 5;
const MAX_OTP_PER_WINDOW = 3;
const WINDOW_MINUTES = 15;
const MAX_VERIFY_ATTEMPTS = 5;

export async function requestOtp(
  identifier: string,
  identifierType: "email" | "phone"
): Promise<{ success: boolean; message: string }> {
  await connectDB();

  const windowStart = new Date(Date.now() - WINDOW_MINUTES * 60 * 1000);
  const recentCount = await OtpRequest.countDocuments({
    identifier,
    createdAt: { $gte: windowStart },
  });

  if (recentCount >= MAX_OTP_PER_WINDOW) {
    return { success: false, message: "Too many OTP requests. Try again in 15 minutes." };
  }

  let otp: string;
  let provider: "static" | "email" | "sms";

  otp = STATIC_OTP;
  provider = "static";

  const otpHash = await bcrypt.hash(otp, 10);
  const expiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);

  await OtpRequest.create({ identifier, identifierType, otpHash, provider, expiresAt });

  return { success: true, message: identifierType === "email" ? "OTP sent to email." : "OTP ready." };
}

export async function verifyOtp(
  identifier: string,
  otp: string
): Promise<{ valid: boolean; message: string }> {
  await connectDB();

  const record = await OtpRequest.findOne({
    identifier,
    consumedAt: null,
    expiresAt: { $gt: new Date() },
  }).sort({ createdAt: -1 });

  if (!record) {
    return { valid: false, message: "No valid OTP found. Please request a new one." };
  }

  if (record.attempts >= MAX_VERIFY_ATTEMPTS) {
    return { valid: false, message: "Too many failed attempts. Request a new OTP." };
  }

  const match = await bcrypt.compare(otp, record.otpHash);
  if (!match) {
    record.attempts += 1;
    await record.save();
    return { valid: false, message: "Invalid OTP." };
  }

  record.consumedAt = new Date();
  await record.save();
  return { valid: true, message: "OTP verified." };
}
