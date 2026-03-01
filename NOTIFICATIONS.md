# Notifications: Email, SMS, Push and Notify.Events

When a form is submitted (Quote, Realtor partner, Partner, Franchise), the app can notify you by **email**, **SMS**, **push** (to the admin PWA), and/or **Notify.Events** (one service for email, SMS, push, Telegram, etc.).

## 0. Notify.Events (optional – one place for many channels)

[Notify.Events](https://notify.events) lets you receive the same alert by **email, SMS, push, Telegram, Slack, etc.** from a single HTTP request. Free tier has a limited number of messages per month.

1. Sign up at [notify.events](https://notify.events/en/user/sign-in).
2. Create a **channel** and add a source:
   - **Incoming Webhook v2** – you get a webhook URL or token.
   - **Node.js** – you get a source token.
3. In the channel, add the **recipients** you want (e.g. your email, Telegram, SMS number) so every message to that source is delivered to all of them.
4. In Vercel (or `.env`), set:
   - `NOTIFY_EVENTS_SOURCE_TOKEN` – the **source token** from your channel (or the full webhook URL if provided).

If this is set, every form submission will send one notification to Notify.Events, which then forwards it to all recipients you configured (email, SMS, push, Telegram, etc.). You can use **only** Notify.Events and leave Resend/Twilio/VAPID unset, or use both.

## 1. Email (Resend)

Already supported. In Vercel (or `.env`):

- `RESEND_API_KEY` – from [resend.com/api-keys](https://resend.com/api-keys)
- `ADMIN_EMAIL` – where to receive alerts
- `NOTIFY_FROM_EMAIL` – optional, e.g. `Trusted Home <noreply@yourdomain.com>` (requires a verified domain in Resend)

## 2. SMS (Twilio)

1. Create an account at [twilio.com](https://www.twilio.com).
2. Buy a phone number with SMS capability (Console → Phone Numbers).
3. In Vercel (or `.env`), set:
   - `TWILIO_ACCOUNT_SID` – from Twilio Console
   - `TWILIO_AUTH_TOKEN` – from Twilio Console
   - `TWILIO_PHONE_NUMBER` – the Twilio number (e.g. `+16135551234`)
   - `ADMIN_PHONE` – your mobile number (e.g. `+16135559999`)

SMS is sent only if all four variables are set.

## 3. Push (admin PWA)

You can use **OneSignal** (recommended, free plan) or **VAPID** (self-hosted web-push). If both are configured, the admin UI uses OneSignal when `VITE_ONE_SIGNAL_APP_ID` is set.

### 3.0 OneSignal (recommended)

[OneSignal](https://onesignal.com) offers a generous free tier for push (and optionally email/SMS). No need to store subscriptions in your DB—OneSignal manages them.

1. Create an app at [dashboard.onesignal.com/apps](https://dashboard.onesignal.com/apps).
2. In the app: **Settings → Platforms → Web Push**. Configure your **Site URL** (e.g. `https://yoursite.com`) and upload the **OneSignalSDKWorker.js** file (already in `public/` in this project).
3. In **Settings → Keys & IDs**, copy the **OneSignal App ID** and **REST API Key**.
4. In Vercel (or `.env`), set:
   - `ONE_SIGNAL_APP_ID` – App ID (backend sends notifications with this).
   - `ONE_SIGNAL_REST_API_KEY` – REST API Key (backend).
   - `VITE_ONE_SIGNAL_APP_ID` – same App ID (frontend admin; so the admin can subscribe via OneSignal).
5. Deploy and open the admin panel (`/#admin`). Click **Enable push (OneSignal)** and allow notifications. New form submissions will trigger a push to all subscribed devices.

Optional: set `SITE_URL` (e.g. `https://yoursite.com`) or rely on `VERCEL_URL` so notification clicks open the correct admin URL.

### 3.1 VAPID (alternative)

Push without OneSignal: the app stores push subscriptions in your DB or KV and uses the `web-push` library.

#### Generate VAPID keys (once)

```bash
npx web-push generate-vapid-keys
```

Add to Vercel (or `.env`): `VAPID_PUBLIC_KEY`, `VAPID_PRIVATE_KEY`, and optionally `VAPID_MAILTO`.

#### Database

If you use Postgres, run `npx prisma db push`. Subscriptions are stored in `PushSubscription` or in Vercel KV under `push_subscriptions`.

#### Enable push in the admin

When **not** using OneSignal (`VITE_ONE_SIGNAL_APP_ID` unset), open `/#admin`, click **Enable push notifications (VAPID)**, and allow notifications.

## Troubleshooting

- **OneSignal: no push received** – In OneSignal dashboard, **Settings → Web Push**: ensure **Site URL** matches your site exactly (e.g. `https://yoursite.com`). Ensure `OneSignalSDKWorker.js` is served from your site root. In **Audience → Subscriptions** you should see the subscription after clicking “Enable push (OneSignal)”.
- **OneSignal: “Permission denied”** – The browser prompt must be triggered by a user click (e.g. the “Enable push (OneSignal)” button). Don’t use incognito.
- **Notify.Events: no notification** – Check that `NOTIFY_EVENTS_SOURCE_TOKEN` is the **source token** (or full webhook URL). Ensure the channel has at least one recipient (email, Telegram, etc.).
- **Push (VAPID): “VAPID not configured”** – Set `VAPID_PUBLIC_KEY` and `VAPID_PRIVATE_KEY` in the environment and redeploy.
- **Push not received** – Use HTTPS. Check DevTools → Application → Service Workers. Try enabling push again.
- **SMS not received** – Check Twilio Console. Ensure `ADMIN_PHONE` is in E.164 format (e.g. `+16135551234`).
- **Email not received** – Check Resend dashboard. If using a custom domain, verify it in Resend.
