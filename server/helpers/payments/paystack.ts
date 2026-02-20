import axios from "axios";

export async function initPaystackPayment({
  secretKey,
  email,
  amount,
  currency,
  callbackUrl,
  metadata,
}: {
  secretKey: string;
  email: string;
  amount: number;
  currency: string;
  /** Optional server-side callback URL – used by Android WebView flow */
  callbackUrl?: string;
  /** Optional extra metadata stored on the Paystack transaction */
  metadata?: Record<string, unknown>;
}) {
  const body: Record<string, unknown> = {
    email,
    amount: Math.round(amount * 100), // Paystack expects kobo / smallest unit
    currency,
  };

  if (callbackUrl) body.callback_url = callbackUrl;
  if (metadata) body.metadata = metadata;

  const res = await axios.post(
    "https://api.paystack.co/transaction/initialize",
    body,
    {
      headers: {
        Authorization: `Bearer ${secretKey}`,
        "Content-Type": "application/json",
      },
    }
  );

  return {
    provider: "paystack",
    authorizationUrl: res.data.data.authorization_url,
    reference: res.data.data.reference,
  };
}

