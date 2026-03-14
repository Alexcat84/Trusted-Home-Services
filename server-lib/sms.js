/**
 * Send SMS to admin phone via Twilio when a form is submitted.
 */
export async function sendAdminSms(type, payload) {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const fromNumber = process.env.TWILIO_PHONE_NUMBER;
  const toNumber = process.env.ADMIN_PHONE;
  if (!accountSid || !authToken || !fromNumber || !toNumber) return;

  const typeLabel = type === 'realtor' ? 'Realtor' : type === 'franchise' ? 'Franchise' : type === 'partner' ? 'Partner' : 'Quote';
  const name = payload.name || 'No name';
  const body = `[THS] New ${typeLabel}: ${name}. ${payload.email || ''} ${payload.phone || ''}`.slice(0, 160);

  try {
    const r = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: 'Basic ' + Buffer.from(`${accountSid}:${authToken}`).toString('base64'),
        },
        body: new URLSearchParams({ To: toNumber, From: fromNumber, Body: body }).toString(),
      }
    );
    if (!r.ok) console.error('[submit] Twilio SMS error type=', type, await r.text());
    else console.log('[submit] Twilio OK type=', type);
  } catch (e) {
    console.error('[submit] Twilio exception type=', type, e.message);
  }
}
