import axios from "axios";

export async function initPaystackPayment({
  secretKey,
  email,
  amount,
  currency,
}: {
  secretKey: string;
  email: string;
  amount: number;
  currency: string;
}) {
  const res = await axios.post(
    "https://api.paystack.co/transaction/initialize",
    {
      email,
      amount: amount * 100,
      currency,
    },
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
