import bcrypt from 'bcryptjs';
import crypto from 'crypto';

const AUTH_SECRET = process.env.AUTH_SECRET || 'royal-heights-secret-key-2026-secure-portal';
const SALT_ROUNDS = 10;

// Default initial hashed password for 'RoyalHeights@2026'
// Pre-computed with bcrypt 10 rounds to avoid synchronous CPU blocking on module load:
export const DEFAULT_PASSWORD_HASH =
  '$2b$10$LjLVBbYJPSvdU0DeWLN7P.JxoSvtYmjR4WD6LOKJNettzhD60ApeC';

/**
 * Hash a plain text password with bcrypt
 */
export async function hashPassword(plainText) {
  if (!plainText || typeof plainText !== 'string') {
    throw new Error('Password must be a non-empty string');
  }
  return await bcrypt.hash(plainText, SALT_ROUNDS);
}

/**
 * Compare plain text password against stored bcrypt hash
 */
export async function verifyPassword(plainText, hashedPassword) {
  if (!plainText || !hashedPassword) return false;
  return await bcrypt.compare(plainText, hashedPassword);
}

/**
 * Generate a cryptographically signed session token
 */
export function createSessionToken(user) {
  const payload = {
    userId: user.id,
    identifier: user.identifier,
    role: user.role,
    name: user.name,
    exp: Date.now() + 1000 * 60 * 60 * 24 * 7, // 7 days expiration
  };

  const payloadBase64 = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = crypto
    .createHmac('sha256', AUTH_SECRET)
    .update(payloadBase64)
    .digest('base64url');

  return `${payloadBase64}.${signature}`;
}

/**
 * Verify and decode session token
 */
export function verifySessionToken(token) {
  if (!token || typeof token !== 'string') return null;

  const parts = token.split('.');
  if (parts.length !== 2) return null;

  const [payloadBase64, signature] = parts;
  const expectedSignature = crypto
    .createHmac('sha256', AUTH_SECRET)
    .update(payloadBase64)
    .digest('base64url');

  if (signature !== expectedSignature) return null;

  try {
    const payload = JSON.parse(Buffer.from(payloadBase64, 'base64url').toString());
    if (payload.exp && Date.now() > payload.exp) {
      return null; // Expired
    }
    return payload;
  } catch (err) {
    return null;
  }
}
