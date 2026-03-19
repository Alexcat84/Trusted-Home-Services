/**
 * Simple rate limit using Vercel KV.
 * If KV is not configured (or KV fails), we fail-closed using an in-memory fallback.
 */

const memoryRateLimit = globalThis.__THS_MEMORY_RATE_LIMIT__ ?? new Map();
globalThis.__THS_MEMORY_RATE_LIMIT__ = memoryRateLimit;

function getClientIp(req) {
  return (req.headers['x-forwarded-for'] || req.headers['x-real-ip'] || 'unknown')
    .split(',')[0].trim() || 'unknown';
}

function memoryCheckRateLimit(key, limit, windowSeconds) {
  const now = Date.now();
  const windowMs = windowSeconds * 1000;

  const existing = memoryRateLimit.get(key);
  const resetAt = existing && typeof existing.resetAt === 'number' && existing.resetAt > now
    ? existing.resetAt
    : now + windowMs;

  const count = existing && typeof existing.count === 'number' && existing.resetAt > now
    ? existing.count
    : 0;

  const next = count + 1;
  memoryRateLimit.set(key, { count: next, resetAt });

  if (next > limit) {
    const retryAfter = resetAt > now ? Math.ceil((resetAt - now) / 1000) : windowSeconds;
    return { allowed: false, retryAfter };
  }

  return { allowed: true };
}

export async function checkRateLimit(req, prefix, limit = 10, windowSeconds = 60) {
  const kvUrl = process.env.KV_REST_API_URL;
  const kvToken = process.env.KV_REST_API_TOKEN;

  const ip = getClientIp(req);
  const key = `rl:${prefix}:${ip}`;

  if (!kvUrl || !kvToken) {
    try {
      return memoryCheckRateLimit(key, limit, windowSeconds);
    } catch {
      return { allowed: false, retryAfter: windowSeconds };
    }
  }

  try {
    const { kv } = await import('@vercel/kv');
    const count = await kv.incr(key);
    if (count === 1) await kv.expire(key, windowSeconds);
    if (count > limit) {
      const ttl = await kv.ttl(key);
      return { allowed: false, retryAfter: ttl > 0 ? ttl : windowSeconds };
    }
    return { allowed: true };
  } catch (e) {
    console.error('Rate limit KV error:', e.message);
    try {
      return memoryCheckRateLimit(key, limit, windowSeconds);
    } catch {
      return { allowed: false, retryAfter: windowSeconds };
    }
  }
}
