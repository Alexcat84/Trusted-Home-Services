/**
 * CORS for admin APIs: allow only trusted origins in production.
 */
const TRUSTED_ORIGINS = new Set([
  'https://trusted-home-services.vercel.app',
  'http://localhost:5173',
  'http://localhost:3000',
  'http://localhost:8080',
]);

function getAllowedOrigin(req) {
  const allowed = new Set(TRUSTED_ORIGINS);
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
