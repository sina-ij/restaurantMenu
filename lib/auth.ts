import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";

const secretKey = process.env.JWT_SECRET || "dev-secret-change-me";
const key = new TextEncoder().encode(secretKey);

export const COOKIE_NAME = "session_token";

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

export async function signSession(payload: { userId: string; restaurantId?: string }) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(key);
}

export async function verifySession(token: string) {
  try {
    const { payload } = await jwtVerify(token, key);
    return payload as { userId: string; restaurantId?: string };
  } catch {
    return null;
  }
}
