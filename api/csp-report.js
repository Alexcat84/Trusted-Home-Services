/**
 * POST /api/csp-report
 * Receives Content-Security-Policy violation reports (browser-initiated).
 * Logs a truncated summary; does not persist full payloads.
 */

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).end();

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    const summary = JSON.stringify(body ?? {}).slice(0, 500);
    console.warn('[csp-report]', summary);
  } catch (e) {
    console.warn('[csp-report] parse error:', e.message);
  }

  return res.status(204).end();
}
