# Notifications: Email, SMS, Push (optional), Notify.Events

When a form is submitted (Quote, Realtor partner, Partner, Franchise), the app notifies you by **email** and **SMS**. Optionally: **push** (VAPID) and **Notify.Events**.

## 1. Email (Resend)

- `RESEND_API_KEY` – from [resend.com/api-keys](https://resend.com/api-keys)
- `ADMIN_EMAIL` – where to receive alerts
- `NOTIFY_FROM_EMAIL` – optional, e.g. `Trusted Home <noreply@yourdomain.com>` (requires a verified domain in Resend)

## 2. SMS (Twilio)

1. Create an account at [twilio.com](https://www.twilio.com) and buy a phone number with SMS capability.
2. In Vercel (or `.env`), set:
   - `TWILIO_ACCOUNT_SID` – from Twilio Console
   - `TWILIO_AUTH_TOKEN` – from Twilio Console
   - `TWILIO_PHONE_NUMBER` – the Twilio number (e.g. `+16135551234`)
   - `ADMIN_PHONE` – your mobile number (e.g. `+16135559999`)

SMS is sent only if all four variables are set.

## 3. Push (optional – VAPID)

Push is optional. The app uses **VAPID** (web-push): subscriptions are stored in your DB or KV.

1. Generate keys once: `npx web-push generate-vapid-keys`
2. Add to Vercel (or `.env`): `VAPID_PUBLIC_KEY`, `VAPID_PRIVATE_KEY`, and optionally `VAPID_MAILTO`.
3. If you use Postgres, run `npx prisma db push` (PushSubscription table).
4. In admin (`/#admin`), click **Enable push notifications** and allow when prompted.

If VAPID keys are not set, the push option simply won’t work; email and SMS are unaffected.

## 4. Notify.Events (optional)

[Notify.Events](https://notify.events) can forward one webhook to email, SMS, push, Telegram, etc. Set `NOTIFY_EVENTS_SOURCE_TOKEN` (source token from your channel). Optional; email + SMS via Resend/Twilio are the main path.

## Troubleshooting

- **Email not received** – Check Resend dashboard. If using a custom domain, verify it in Resend.
- **SMS not received** – Check Twilio Console. Ensure `ADMIN_PHONE` is in E.164 format (e.g. `+16135551234`).
- **Push (VAPID): “VAPID not configured”** – Set `VAPID_PUBLIC_KEY` and `VAPID_PRIVATE_KEY` and redeploy.
- **Notify.Events: no notification** – Check `NOTIFY_EVENTS_SOURCE_TOKEN` and that the channel has at least one recipient.
