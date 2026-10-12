#!/usr/bin/env node
// Kullanım: npm run admin:hash -- "guclu-sifre"
// Çıktıyı .env.local dosyasına (veya barındırma ortam değişkenlerine) ekleyin.
import { randomBytes, scryptSync } from "node:crypto";

const password = process.argv[2];
if (!password || password.length < 10) {
  console.error('En az 10 karakterlik bir şifre verin: npm run admin:hash -- "guclu-sifre"');
  process.exit(1);
}

const salt = randomBytes(16);
const hash = scryptSync(password, salt, 64);

console.log(`ADMIN_PASSWORD_HASH=scrypt.${salt.toString("hex")}.${hash.toString("hex")}`);
console.log(`ADMIN_SESSION_SECRET=${randomBytes(32).toString("base64url")}`);
