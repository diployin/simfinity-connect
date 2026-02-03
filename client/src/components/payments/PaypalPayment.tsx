import { useEffect } from "react";

interface Props {
  orderId: string;
  guestAccessToken?: string; // ✅ ADD THIS
}

export default function PaypalPayment({
  orderId,
  guestAccessToken,
}: Props) {
  useEffect(() => {
    const paypal = (window as any).paypal;
    if (!paypal) return;

    paypal
      .Buttons({
        // 👇 VERY IMPORTANT
        createOrder: () => orderId,

        onApprove: async (data: any, actions: any) => {
          const details = await actions.order.capture();

          console.log("✅ PayPal payment success", {
            details,
            paypalOrderId: data.orderID,
          });

          const params = new URLSearchParams({
            providerType: "paypal",
            orderId: data.orderID,
            redirect_status: "succeeded",
          });

          // ✅ APPEND ONLY FOR GUEST
          if (guestAccessToken) {
            params.append("guestAccessToken", guestAccessToken);
          }

          window.location.href =
            `${window.location.origin}/order/processing?${params.toString()}`;
        },

        onError: (err: any) => {
          console.error("❌ PayPal error", err);
        },
      })
      .render("#paypal-button-container");
  }, [orderId, guestAccessToken]);

  return <div id="paypal-button-container" />;
}

