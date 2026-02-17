/**
 * Minimal JWT sign/verify with Node crypto (no extra deps).
 * Used for admin login: username/password → JWT, then JWT for API calls.
 */

import crypto from 'crypto';

function base64UrlEncode(buf) {
  return buf.toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

export function signJWT(payload, secret, expiresInSeconds = 60 * 60 * 24 * 7) {
  const header = { alg: 'HS256', typ: 'JWT' };
  const now = Math.floor(Date.now() / 1000);
  const body = { ...payload, iat: now, exp: now + expiresInSeconds };
  const headerB64 = base64UrlEncode(Buffer.from(JSON.stringify(header), 'utf8'));
  const payloadB64 = base64UrlEncode(Buffer.from(JSON.stringify(body), 'utf8'));
  const message = `${headerB64}.${payloadB64}`;
  const sig = crypto.createHmac('sha256', secret).update(message).digest('base64');
  const sigB64 = base64UrlEncode(Buffer.from(sig, 'base64'));
  return `${message}.${sigB64}`;
}

export function verifyJWT(token, secret) {
  if (!token || typeof token !== 'string') return null;
  const parts = token.split('.');
  if (parts.length !== 3) return null;
  const [headerB64, payloadB64, sigB64] = parts;
  const message = `${headerB64}.${payloadB64}`;
  const sig = Buffer.from(
    (sigB64 + '==='.slice(0, (4 - (sigB64.length % 4)) % 4)).replace(/-/g, '+').replace(/_/g, '/'),
    'base64'
  );
  const expected = crypto.createHmac('sha256', secret).update(message).digest();
  if (!crypto.timingSafeEqual(sig, expected)) return null;
  try {
    const payloadB64Padded = (payloadB64.replace(/-/g, '+').replace(/_/g, '/') + '==='.slice(0, (4 - (payloadB64.length % 4)) % 4));
    const payload = JSON.parse(Buffer.from(payloadB64Padded, 'base64').toString('utf8'));
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) return null;
    return payload;
  } catch {
    return null;
  }
}
