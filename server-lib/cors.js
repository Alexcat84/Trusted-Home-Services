/**
 * CORS helpers.
 * - `adminCors`: endpoints autenticados/admin (histórico, no romper comportamiento).
 * - `publicCors`: endpoints públicos (evitar `Access-Control-Allow-Origin: *`).
 */
const ADMIN_TRUSTED_ORIGINS = new Set([
  'https://trusted-home-services.vercel.app',
  'http://localhost:5173',
  'http://localhost:3000',
  'http://localhost:8080',
]);

function getAllowedOrigin(req) {
  const allowed = new Set(ADMIN_TRUSTED_ORIGINS);
  if (process.env.VERCEL_URL) allowed.add(`https://${process.env.VERCEL_URL}`);
  const origin = req.headers?.origin;
  if (origin && allowed.has(origin)) return origin;
  return 'https://trusted-home-services.vercel.app';
}

export function adminCors(req, res, methods = 'GET, PATCH, DELETE, OPTIONS', headers = 'Content-Type, Authorization') {
  res.setHeader('Access-Control-Allow-Origin', getAllowedOrigin(req));
  res.setHeader('Access-Control-Allow-Methods', methods);
  res.setHeader('Access-Control-Allow-Headers', headers);
  return res;
}

function getPublicAllowedOrigin(req) {
  const origin = req.headers?.origin;
  if (!origin || typeof origin !== 'string') return null;

  const proto = req.headers?.['x-forwarded-proto'] || 'https';
  const host = req.headers?.host;
  const sameOrigin = String(proto) + '://' + String(host);
  if (origin === sameOrigin) return origin;

  const trustedEnv = process.env.TRUSTED_ORIGINS
    ? process.env.TRUSTED_ORIGINS.split(',').map((s) => s.trim()).filter(Boolean)
    : [];

  const trustedOrigins = new Set([
    ...(process.env.VERCEL_URL ? [`https://${process.env.VERCEL_URL}`] : []),
    ...trustedEnv,
  ]);

  // Allow localhost:* for local development.
  const isLocalhost =
    /^http:\/\/localhost:\d+$/i.test(origin) ||
    /^http:\/\/127\.0\.0\.1:\d+$/i.test(origin);

  if (trustedOrigins.has(origin) || isLocalhost) return origin;
  return null;
}

export function publicCors(req, res, methods = 'GET, POST, OPTIONS', headers = 'Content-Type') {
  const allowedOrigin = getPublicAllowedOrigin(req);
  if (allowedOrigin) {
    res.setHeader('Access-Control-Allow-Origin', allowedOrigin);
    res.setHeader('Vary', 'Origin');
  }

  res.setHeader('Access-Control-Allow-Methods', methods);
  res.setHeader('Access-Control-Allow-Headers', headers);
  return res;
}
