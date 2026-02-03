import {storage} from "../storage"


type PricingInput = {
  packageId: string;
  quantity: number;
  requestedCurrency: string;

  promoCode?: string;
  promoType?: "voucher" | "giftcard" | "referral";
  promoDiscount?: number;
  voucherId?: string;
  giftCardId?: string;
  referrerId?: string;
  referralCredits?: number;

  userId?: string;
};

export async function calculateFinalPrice(input: PricingInput) {
  const {
    packageId,
    quantity,
    requestedCurrency,
    promoCode,
    promoType,
    voucherId,
    giftCardId,
    referralCredits = 0,
    userId,
  } = input;

  const pkg = await storage.getUnifiedPackageById(packageId);
  if (!pkg) throw new Error("Package not found");

  /* ---------------- Currency + Base Price ---------------- */
  const currencies = await storage.getCurrencies();
  const fromCurrency = currencies.find(c => c.code === "USD");
  const toCurrency = currencies.find(c => c.code === requestedCurrency);
  if (!fromCurrency || !toCurrency) throw new Error("Currency not found");

  const provider = await storage.getProviderById(pkg.providerId);
  const baseRetailUSD =
    parseFloat(pkg.wholesalePrice) *
    (1 + parseFloat(provider.pricingMargin) / 100);

  let unitPrice =
    (baseRetailUSD / parseFloat(fromCurrency.conversionRate)) *
    parseFloat(toCurrency.conversionRate);

  unitPrice = Number(unitPrice.toFixed(2));

  /* ---------------- Quantity ---------------- */
  const validQty = Math.max(1, Math.min(10, quantity));
  const subtotal = unitPrice * validQty;

  let discount = 0;
  let appliedReferralCredits = 0;

  /* ---------------- Voucher ---------------- */
  if (promoType === "voucher" && promoCode && voucherId) {
    const voucher = await storage.getVoucherByCode(promoCode);
    if (voucher?.status === "active") {
      const now = new Date();
      if (now >= new Date(voucher.validFrom) && now <= new Date(voucher.validUntil)) {
        let voucherDiscount = 0;

        if (voucher.type === "percentage") {
          voucherDiscount = (subtotal * parseFloat(voucher.value)) / 100;
          if (voucher.maxDiscountAmount) {
            voucherDiscount = Math.min(
              voucherDiscount,
              parseFloat(voucher.maxDiscountAmount)
            );
          }
        } else {
          voucherDiscount = Math.min(parseFloat(voucher.value), subtotal);
        }

        discount += voucherDiscount;
      }
    }
  }

  /* ---------------- Gift Card ---------------- */
  if (promoType === "giftcard" && promoCode && giftCardId) {
    const giftCard = await storage.getGiftCardByCode(promoCode);
    if (giftCard?.status === "active") {
      const giftDiscount = Math.min(
        parseFloat(giftCard.balance),
        subtotal - discount
      );
      discount += giftDiscount;
    }
  }


  /* ---------------- Referral Code Discount ---------------- */
if (promoType === "referral" && promoCode && !referralCredits) {
  const settings = await storage.getReferralSettings();

  if (settings?.enabled) {
    // Optional: minimum order check
    if (subtotal >= Number(settings.minOrderAmount)) {
      let referralDiscount = 0;

      if (settings.rewardType === "percentage") {
        referralDiscount =
          (subtotal * Number(settings.referredUserDiscount)) / 100;
      } else {
        referralDiscount = Number(settings.referredUserDiscount);
      }

      referralDiscount = Math.min(referralDiscount, subtotal - discount);

      discount += referralDiscount;
    }
  }
}


  /* ---------------- Referral Credits ---------------- */
  if (promoType === "referral" && referralCredits > 0 && userId) {
    const user = await storage.getUserById(userId);
    if (user?.referralBalance) {
      appliedReferralCredits = Math.min(
        referralCredits,
        parseFloat(user.referralBalance),
        subtotal - discount
      );
      discount += appliedReferralCredits;
    }
  }

  /* ---------------- Final ---------------- */
  // const total = Math.max(subtotal - discount, 0.5);

  // return {
  //   unitPrice,
  //   quantity: validQty,
  //   subtotal,
  //   discount,
  //   total,
  //   appliedReferralCredits,
  // };


  /* ---------------- Final ---------------- */
const totalRaw = Math.max(subtotal - discount, 0);

const total = Number(totalRaw.toFixed(2));

return {
  unitPrice,
  quantity: validQty,
  subtotal,
  discount,
  total,
  appliedReferralCredits,
};

}
