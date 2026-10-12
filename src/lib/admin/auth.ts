import "server-only";

import { createHash, createHmac, scryptSync, timingSafeEqual } from "node:crypto";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";

export const ADMIN_LOGIN_PATH = "/admin/giris";
export const ADMIN_HOME_PATH = "/admin";

const SESSION_COOKIE = "simsek_admin";
const SESSION_TTL_SECONDS = 60 * 60 * 8;
const MIN_SECRET_LENGTH = 32;
const MAX_ATTEMPTS = 5;
const ATTEMPT_WINDOW_MS = 15 * 60 * 1000;

interface AdminConfig {
  username: string;
  passwordHash: string;
  secret: string;
}

/** `ADMIN_USERNAME`, `ADMIN_PASSWORD_HASH` (`npm run admin:hash`) ve `ADMIN_SESSION_SECRET` tanımlı değilse giriş kapalıdır. */
function readConfig(): AdminConfig | null {
  const username = process.env.ADMIN_USERNAME?.trim();
  const passwordHash = process.env.ADMIN_PASSWORD_HASH?.trim();
  const secret = process.env.ADMIN_SESSION_SECRET?.trim();
  if (!username || !passwordHash?.startsWith("scrypt.") || !secret || secret.length < MIN_SECRET_LENGTH) return null;
  return { username, passwordHash, secret };
}

export function isAdminConfigured(): boolean {
  return readConfig() !== null;
}

function safeEqual(a: string, b: string): boolean {
  const left = createHash("sha256").update(a).digest();
  const right = createHash("sha256").update(b).digest();
  return timingSafeEqual(left, right);
}

/** Biçim: `scrypt.<salt-hex>.<hash-hex>` */
function verifyPassword(password: string, stored: string): boolean {
  const [, salt, hash] = stored.split(".");
  if (!salt || !hash) return false;
  const expected = Buffer.from(hash, "hex");
  const actual = scryptSync(password, Buffer.from(salt, "hex"), expected.length);
  return expected.length > 0 && timingSafeEqual(actual, expected);
}

function sign(value: string, secret: string): string {
  return createHmac("sha256", secret).update(value).digest("base64url");
}

function encodeSession(username: string, secret: string): string {
  const payload = Buffer.from(
    JSON.stringify({ u: username, exp: Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS }),
  ).toString("base64url");
  return `${payload}.${sign(payload, secret)}`;
}

function decodeSession(token: string, config: AdminConfig): string | null {
  const [payload, signature] = token.split(".");
  if (!payload || !signature || !safeEqual(signature, sign(payload, config.secret))) return null;
  try {
    const data = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as { u?: unknown; exp?: unknown };
    if (typeof data.u !== "string" || typeof data.exp !== "number") return null;
    if (data.exp < Date.now() / 1000 || !safeEqual(data.u, config.username)) return null;
    return data.u;
  } catch {
    return null;
  }
}

const attempts = new Map<string, { count: number; first: number }>();

async function clientKey(): Promise<string> {
  const list = await headers();
  return list.get("x-forwarded-for")?.split(",")[0]?.trim() || list.get("x-real-ip") || "local";
}

export type LoginResult = "ok" | "invalid" | "locked" | "unconfigured";

export async function login(username: string, password: string): Promise<LoginResult> {
  const config = readConfig();
  if (!config) return "unconfigured";

  const key = await clientKey();
  const now = Date.now();
  const record = attempts.get(key);
  if (record && now - record.first < ATTEMPT_WINDOW_MS && record.count >= MAX_ATTEMPTS) return "locked";

  const valid = safeEqual(username, config.username) && verifyPassword(password, config.passwordHash);
  if (!valid) {
    const fresh = !record || now - record.first >= ATTEMPT_WINDOW_MS;
    attempts.set(key, fresh ? { count: 1, first: now } : { ...record, count: record.count + 1 });
    return "invalid";
  }

  attempts.delete(key);
  (await cookies()).set(SESSION_COOKIE, encodeSession(config.username, config.secret), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_TTL_SECONDS,
  });
  return "ok";
}

export async function logout(): Promise<void> {
  (await cookies()).delete(SESSION_COOKIE);
}

export async function getAdminUser(): Promise<string | null> {
  const config = readConfig();
  if (!config) return null;
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  return token ? decodeSession(token, config) : null;
}

/** Her admin sayfasında ve server action'da ilk satır olarak çağrılır. */
export async function requireAdmin(): Promise<string> {
  const user = await getAdminUser();
  if (!user) redirect(ADMIN_LOGIN_PATH);
  return user;
}
