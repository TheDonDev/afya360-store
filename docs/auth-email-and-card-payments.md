# Authentication, email, and card payments

## Email delivery

Fortify sends email verification notices after registration. The development environment uses Laravel's `log` mailer so no email leaves the machine; inspect `storage/logs/laravel.log` for the verification URL during local testing. Successful password and Google sign-ins also queue a security alert email. Keep a queue worker running for those alerts.

For real delivery, configure a transactional mail service (for example Postmark, Resend, SES, or SMTP) in `.env`:

```dotenv
MAIL_MAILER=smtp
MAIL_HOST=your-provider-smtp-host
MAIL_PORT=587
MAIL_USERNAME=your-provider-username
MAIL_PASSWORD=your-provider-secret
MAIL_SCHEME=tls
MAIL_FROM_ADDRESS=verified-sender@your-domain
MAIL_FROM_NAME="Afya360"
```

Use the provider's documented host, scheme, and port. Verify the sender domain and keep credentials out of source control. Run a queue worker in production because new-sign-in security alerts are queued. The local `composer run dev` process already runs a queue worker.

Registration requires email verification. A verified password sign-in queues a security email containing the sign-in time and IP address. The email is sent to the account address.

## Google sign-in

The Google button is rendered only when all three values are set:

```dotenv
GOOGLE_CLIENT_ID=your-google-oauth-client-id
GOOGLE_CLIENT_SECRET=your-google-oauth-client-secret
GOOGLE_REDIRECT_URI=https://your-domain/auth/google/callback
```

In Google Cloud Console, create an OAuth 2.0 Web application client, add the exact callback URL to Authorized redirect URIs, and configure the OAuth consent screen. For local development, register `http://localhost:8000/auth/google/callback` as a separate development redirect URI. Restrict consent-screen test users until the app is ready for public use. Clear cached Laravel config after changing environment values.

Only Google identities that assert a verified email are accepted. If that email already belongs to a password account, the Google identity is linked to that account.

## Visa card payments

Visa is displayed as coming soon and cannot be submitted as a payment method. The checkout endpoint currently accepts WhatsApp only. No card details are collected or stored.

Before enabling card payments, choose an acquiring gateway that supports Visa and KES settlement for the merchant's country and business (compare Pesapal, Flutterwave, DPO, or another provider against merchant onboarding and settlement requirements). Obtain sandbox credentials first, then implement this hosted-checkout flow:

1. Validate delivery details and current product prices and inventory on the server.
2. Create a pending order and short-lived stock reservation, storing the selected gateway and a unique merchant order reference.
3. Request a hosted payment session server-to-server using the order amount in KES and the unique reference. Redirect the shopper to the gateway's hosted page. Never request or store PAN, expiry, CVV, or PIN on Afya360 pages or servers.
4. Return the browser to a pending-result page. Treat the browser return as informational only; it is not proof of payment.
5. Verify the gateway's signed webhook or perform a server-to-server transaction verification. Check signature, merchant reference, amount, currency, and final success status; handle retries idempotently.
6. Only after verification mark the order paid, finalize inventory, and queue customer/store notifications. On decline or timeout leave it unpaid and release its stock reservation when the hold expires.
7. Test success, decline, cancel, timeout, duplicate webhook, amount mismatch, and refund cases in sandbox before enabling production.

The Visa option should only become selectable once the hosted-payment session, verified webhook, and reconciliation paths are implemented and configured. Provider credentials belong in environment variables or a secrets manager, never in the browser bundle.
