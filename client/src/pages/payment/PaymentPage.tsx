// import { useLocation } from "wouter";
// import PaymentGatewayRenderer from "@/components/payments/PaymentGatewayRenderer";

// export default function PaymentPage() {
//   const [location] = useLocation();

//   // ✅ SAFEST WAY
//   const search = window.location.search;
//   const params = new URLSearchParams(search);

//   const provider = params.get("provider") as
//     | "stripe"
//     | "razorpay"
//     | "paypal"
//     | null;

//   if (!provider) {
//     return <div>Invalid payment link</div>;
//   }

//   const initData = {
//     provider,
//     clientSecret: params.get("clientSecret") || undefined,
//     orderId: params.get("orderId") || undefined,
//     keyId: params.get("keyId") || undefined,
//     amount: params.get("amount")
//       ? Number(params.get("amount"))
//       : undefined,
//     currency: params.get("currency") || undefined,
//   };


import { useLocation } from 'wouter';
import PaymentGatewayRenderer from '@/components/payments/PaymentGatewayRenderer';

export default function PaymentPage() {
  const [location] = useLocation();

  const params = new URLSearchParams(window.location.search);
  const guestAccessToken = params.get('guestAccessToken') || undefined;

  const provider = params.get('providerType') as 'stripe' | 'razorpay' | 'paypal' | null;

  if (!provider) {
    return <div>Invalid payment link</div>;
  }

  const initData = {
    provider,

    // 🔹 Stripe only
    clientSecret: provider === 'stripe' ? params.get('clientSecret') || undefined : undefined,

    // 🔹 Razorpay / PayPal
    orderId: params.get('orderId') || undefined,
    amount: params.get('amount') ? Number(params.get('amount')) : undefined,
    currency: params.get('currency') || undefined,

    // 🔑 Public key (Stripe uses 'publicKey', Razorpay uses 'keyId')
    publicKey: params.get('publicKey') || params.get('keyId') || 'pk_live_51Qk1HYD0jLE6pUP5iWbWTm0fFsQdVe1Rs7HLhMMbkum5ua7UgkghcSGiQ0OGOa4XAE90wZSSOfAFPX9obxF5gc6n00abbZX2r2',

    guestAccessToken,
  };

  console.log('CHEKCKK init data in payment page', initData);

  const email = params.get('email') || undefined;
  const name = params.get('name') || undefined;

  return (
    <div style={{ maxWidth: 480, margin: '40px auto' }}>
      <PaymentGatewayRenderer initData={initData} email={email} name={name} />
    </div>
  );
}
