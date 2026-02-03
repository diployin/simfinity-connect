// import axios from "axios";

// async function getPaypalAccessToken() {
//   const { data } = await axios.post(
//     "https://api-m.paypal.com/v1/oauth2/token",
//     "grant_type=client_credentials",
//     {
//       auth: {
//         username: process.env.PAYPAL_CLIENT_ID!,
//         password: process.env.PAYPAL_SECRET!,
//       },
//     }
//   );
//   return data.access_token;
// }


// async function verifyPaypal(body: any) {
//   const { paypal } = body;

//   const accessToken = await getPaypalAccessToken();

//   const { data } = await axios.get(
//     `https://api-m.paypal.com/v2/checkout/orders/${paypal.orderId}`,
//     {
//       headers: {
//         Authorization: `Bearer ${accessToken}`,
//       },
//     }
//   );

//   if (data.status !== "COMPLETED") {
//     return { success: false, message: "PayPal payment not completed" };
//   }

//   return {
//     success: true,
//     metadata: {
//       orderId: data.id,
//       payerEmail: data.payer?.email_address,
//     },
//   };
// }



// export async function verifyPaypal(body: any) {
//   const accessToken = await getPaypalAccessToken();

//   const base =
//     process.env.PAYPAL_MODE === "live"
      // ? "https://api-m.paypal.com"
//       : "https://api-m.sandbox.paypal.com";

//   const { data } = await axios.get(
//     `${base}/v2/checkout/orders/${body.paypal.orderId}`,
//     { headers: { Authorization: `Bearer ${accessToken}` } }
//   );

//   if (data.status !== "COMPLETED") {
//     return { success: false, message: "PayPal payment not completed" };
//   }

//   return {
//     success: true,
//     provider: "paypal",
//     referenceId: data.id,
//     metadata: { payerEmail: data.payer?.email_address },
//   };
// }


// export default verifyPaypal;




import axios from "axios";

/* ===============================
   GET PAYPAL ACCESS TOKEN
================================ */


async function getPaypalAccessToken(gateway: any) {
  const basee =
    gateway.mode === "live"
      ? "https://api-m.paypal.com"
      : "https://api-m.sandbox.paypal.com";

      const base = "https://api-m.sandbox.paypal.com"

  const { data } = await axios.post(
    `${base}/v1/oauth2/token`,
    "grant_type=client_credentials",
    {
      auth: {
        username: gateway.publicKey,
        password: gateway.secretKey,
      },
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );

  return data.access_token as string;
}

/* ===============================
   VERIFY PAYPAL PAYMENT
================================ */





export async function verifyPaypal(body: any, gateway: any) {
  const paypalPayload = body?.paypal ?? body;

  const orderId =
    paypalPayload.orderId ||
    paypalPayload.order_id;

  if (!orderId) {
    return {
      success: false,
      message: "PayPal orderId missing",
    };
  }

  const accessToken = await getPaypalAccessToken(gateway);

  const basee =
    gateway.mode === "live"
      ? "https://api-m.paypal.com"
      : "https://api-m.sandbox.paypal.com";

  const base = "https://api-m.sandbox.paypal.com"

  const { data } = await axios.get(
    `${base}/v2/checkout/orders/${orderId}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  if (data.status !== "COMPLETED") {
    return {
      success: false,
      message: `PayPal payment not completed (status: ${data.status})`,
    };
  }

  /* 🔐 METADATA — single source of truth */
  let metadata: any = {};
  try {
    metadata = JSON.parse(
      data.purchase_units?.[0]?.custom_id || "{}"
    );
  } catch {
    metadata = {};
  }

  const amount =
    Number(
      data.purchase_units?.[0]?.amount?.value || 0
    );

  return {
    success: true,
    provider: "paypal",
    referenceId: data.id,
    paymentId: data.id,
    amount, // PayPal already decimal
    currency:
      data.purchase_units?.[0]?.amount?.currency_code,
    metadata,
  };
}

export default verifyPaypal;

