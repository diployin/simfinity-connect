// import checkoutSdk from "@paypal/checkout-server-sdk";

// export async function initPaypalPayment({
//   clientId,
//   secretKey,
//   amount,
//   currency,
// }: {
//   clientId: string;
//   secretKey: string;
//   amount: number;
//   currency: string;
// }) {
//   const environment = new checkoutSdk.core.SandboxEnvironment(
//     clientId,
//     secretKey
//   );
//   const client = new checkoutSdk.core.PayPalHttpClient(environment);

//   const request = new checkoutSdk.orders.OrdersCreateRequest();
//   request.prefer("return=representation");
//   request.requestBody({
//     intent: "CAPTURE",
//     purchase_units: [
//       {
//         amount: {
//           currency_code: currency,
//           value: amount.toString(),
//         },
//       },
//     ],
//   });

//   const order = await client.execute(request);

//   return {
//     provider: "paypal",
//     orderId: order.result.id,
//   };
// }



import checkoutSdk from "@paypal/checkout-server-sdk";

export async function initPaypalPayment({
  clientId,
  secretKey,
  amount,
  currency,
  packageId,
  quantity,
  email,
  phone,
  guestAccessToken,
  userId,
}: {
  clientId: string;
  secretKey: string;
  amount: number;
  currency: string;
  packageId: string;
  quantity: number;
  email?: string;
  phone?: string;
  guestAccessToken?: string;
  userId?: string;
}) {
  const environment = new checkoutSdk.core.SandboxEnvironment(
    clientId,
    secretKey
  );

  const client = new checkoutSdk.core.PayPalHttpClient(environment);

  /* 🔥 SINGLE SOURCE OF TRUTH — METADATA YAHI BAN RAHA HAI */
  const metadata = {
    type: userId ? "package_purchase" : "guest_purchase",
    packageId,
    quantity: quantity.toString(),
    guestEmail: email || "",
    guestPhone: phone || "",
    guestAccessToken: guestAccessToken || "",
    userId: userId || "",
  };

  const request = new checkoutSdk.orders.OrdersCreateRequest();
  request.prefer("return=representation");

  request.requestBody({
    intent: "CAPTURE",
    purchase_units: [
      {
        amount: {
          currency_code: currency,
          value: amount.toString(),
        },

        // 🔐 PayPal-safe metadata storage
        custom_id: JSON.stringify(metadata),
      },
    ],
  });

  const order = await client.execute(request);

  return {
    provider: "paypal",
    orderId: order.result.id,
  };
}

