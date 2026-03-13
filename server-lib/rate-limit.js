/**
 * Simple rate limit using Vercel KV. If KV is not configured, allows all requests.
 */
export async function checkRateLimit(req, prefix, limit = 10, windowSeconds = 60) {
  const kvUrl = process.env.KV_REST_API_URL;
  const kvToken = process.env.KV_REST_API_TOKEN;
  if (!kvUrl || !kvToken) return { allowed: true };

  const ip = (req.headers['x-forwarded-for'] || req.headers['x-real-ip'] || 'unknown').split(',')[0].trim() || 'unknown';
  const key = `rl:${prefix}:${ip}`;

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
    return { allowed: true };
  }
}
