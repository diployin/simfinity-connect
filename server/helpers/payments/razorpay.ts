import Razorpay from "razorpay";

export async function initRazorpayPayment({
  keyId,
  secretKey,
  amount,
  currency,
  orderId,
  packageId,
  quantity,
  email,
  phone,
  guestAccessToken,
  userId,
  promoCode,
  promoType,
  voucherId,
  giftCardId,
  referralCredits,
  promoDiscount
}: {
  keyId: string;
  secretKey: string;
  amount: number;
  currency: string;
  orderId: string;
  packageId: string;
  quantity: number;
  email?: string;
  phone?: string;
  guestAccessToken?: string;
  userId?: string;
  promoCode?:string;
  promoType?:string;
  voucherId?:string;
  giftCardId?:string;
  referralCredits?:string;
  promoDiscount?: string;
}) {
  const razorpay = new Razorpay({
    key_id: keyId,
    key_secret: secretKey,
  });

  const order = await razorpay.orders.create({
    amount: Math.round(amount * 100),
    currency: currency || "INR",
    receipt: orderId,

    // 🔥 VERY IMPORTANT
    notes: {
      type: userId ? "package_purchase" : "guest_purchase",
      packageId,
      quantity: quantity.toString(),
      guestEmail: email || "",
      guestPhone: phone || "",
      guestAccessToken: guestAccessToken || "",
      userId: userId || "",
      promoCode: promoCode || "",
      promoType: promoType || "",
      voucherId: voucherId || "",
      giftCardId: giftCardId || "",
      referralCredits:referralCredits || "",
      promoDiscount: promoDiscount || ""
    },
  });

  return {
    provider: "razorpay",
    orderId: order.id,
    amount: order.amount,
    currency: order.currency,
    keyId,
  };
}

