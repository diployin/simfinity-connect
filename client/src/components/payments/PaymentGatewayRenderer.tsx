import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import StripeCheckoutForm from './StripeCheckoutForm';
import RazorpayPayment from './RazorpayPayment';
import PaypalPayment from './PaypalPayment';

interface PaymentGatewayRendererProps {
  initData: {
    provider: 'stripe' | 'razorpay' | 'paypal';
    publicKey?: string;
    clientSecret?: string;
    orderId?: string;
    amount?: number;
    currency?: string;
    guestAccessToken?: string;
  };
  email?: string;
  name?: string;
}

export default function PaymentGatewayRenderer({
  initData,
  email,
  name,
}: PaymentGatewayRendererProps) {
  switch (initData.provider) {
    /* ================= STRIPE ================= */
    case 'stripe': {
      if (!initData.clientSecret) {
        console.error('Stripe clientSecret missing', initData);
        return null;
      }

      // ✅ Stripe public key (later DB se bhi la sakte ho)
      const stripePromise = loadStripe(initData?.publicKey);

      return (
        <Elements
          stripe={stripePromise}
          options={{
            clientSecret: initData.clientSecret,
          }}
        >
          <StripeCheckoutForm guestAccessToken={initData?.guestAccessToken} />
        </Elements>
      );
    }

    /* ================= RAZORPAY ================= */
    case 'razorpay': {
      if (!initData.orderId || !initData.amount || !initData.currency || !initData.publicKey) {
        console.error('Razorpay data missing', initData);
        return null;
      }

      return (
        <RazorpayPayment
          orderId={initData.orderId}
          amount={initData.amount}
          currency={initData.currency}
          publicKey={initData.publicKey}
          email={email}
        />
      );
    }

    /* ================= PAYPAL ================= */
    case 'paypal': {
      if (!initData.orderId) {
        console.error('PayPal orderId missing', initData);
        return null;
      }

      return <PaypalPayment orderId={initData.orderId} />;
    }

    default:
      console.error('Unsupported payment provider', initData.provider);
      return null;
  }
}

// export default function PaymentGatewayRenderer({ initData, email }: PaymentGatewayRendererProps) {
//   switch (initData.provider) {
//     /* ================= STRIPE ================= */
//     case 'stripe': {
//       if (!initData.clientSecret) {
//         console.error('Stripe clientSecret missing', initData);
//         return null;
//       }

//       const stripePromise = loadStripe(
//         'pk_test_51BTUDGJAJfZb9HEBwDg86TN1KNprHjkfipXmEDMb0gSCassK5T3ZfxsAbcgKVmAIXF7oZ6ItlZZbXO6idTHE67IM007EwQ4uN3',
//       );

//       return (
//         <Elements stripe={stripePromise} options={{ clientSecret: initData.clientSecret }}>
//           <StripeCheckoutForm guestAccessToken={initData.guestAccessToken} />
//         </Elements>
//       );
//     }

//     /* ================= RAZORPAY ================= */
//     case 'razorpay': {
//       if (!initData.orderId || !initData.amount || !initData.currency || !initData.publicKey) {
//         console.error('Razorpay data missing', initData);
//         return null;
//       }

//       return (
//         <RazorpayPayment
//           orderId={initData.orderId}
//           amount={initData.amount}
//           currency={initData.currency}
//           publicKey={initData.publicKey}
//           email={email}
//           guestAccessToken={initData.guestAccessToken}
//         />
//       );
//     }

//     /* ================= PAYPAL ================= */
//     case 'paypal': {
//       if (!initData.orderId) {
//         console.error('PayPal orderId missing', initData);
//         return null;
//       }

//       return (
//         <PaypalPayment orderId={initData.orderId} guestAccessToken={initData.guestAccessToken} />
//       );
//     }

//     /* ================= POWERTRANZ (SPI 3DS) ================= */
//     case 'powertranz': {
//       if (!initData.redirectData) {
//         console.error('PowerTranz redirectData missing', initData);
//         return null;
//       }

//       return (
//         <div className="w-full border rounded-md overflow-hidden">
//           <iframe
//             title="PowerTranz 3DS Authentication"
//             srcDoc={initData.redirectData}   // 🔥 MUST be srcDoc
//             style={{ width: '100%', height: '520px', border: 'none' }}
//             sandbox="allow-forms allow-scripts allow-same-origin"
//           />
//         </div>
//       );
//     }


//     default:
//       console.error('Unsupported payment provider', initData.provider);
//       return null;
//   }
// }
