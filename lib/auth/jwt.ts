import jwt from "jsonwebtoken";
import crypto from "crypto";
import RefreshToken from "@/models/RefreshToken";

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET!;
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET!;
const ACCESS_EXPIRY = "15m";
const REFRESH_EXPIRY_DAYS = 7;

export interface AccessTokenPayload {
  userId: string;
  role: string;
  identifierType: "email" | "phone";
  iat?: number;
  exp?: number;
}

export function signAccessToken(payload: Omit<AccessTokenPayload, "iat" | "exp">): string {
  return jwt.sign(payload, ACCESS_SECRET, { expiresIn: ACCESS_EXPIRY, algorithm: "HS256" });
}

export function verifyAccessToken(token: string): AccessTokenPayload {
  return jwt.verify(token, ACCESS_SECRET) as AccessTokenPayload;
}

export async function issueRefreshToken(userId: string): Promise<string> {
  const token = crypto.randomBytes(40).toString("hex");
  const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
  const expiresAt = new Date(Date.now() + REFRESH_EXPIRY_DAYS * 86400 * 1000);
  await RefreshToken.create({ userId, tokenHash, expiresAt });
  return token;
}

export async function rotateRefreshToken(
  oldToken: string,
  userId: string
): Promise<{ accessToken: string; refreshToken: string } | null> {
  const oldHash = crypto.createHash("sha256").update(oldToken).digest("hex");
  const existing = await RefreshToken.findOne({ tokenHash: oldHash, userId });
  if (!existing || existing.expiresAt < new Date()) return null;
  await existing.deleteOne();
  const newRefresh = await issueRefreshToken(userId);
  return { accessToken: "", refreshToken: newRefresh };
}

export async function revokeRefreshToken(token: string): Promise<void> {
  const hash = crypto.createHash("sha256").update(token).digest("hex");
  await RefreshToken.deleteOne({ tokenHash: hash });
}
