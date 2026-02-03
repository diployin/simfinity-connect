import { Router } from 'express';
import { eq, asc, and } from 'drizzle-orm';
import { db } from 'server/db';
import { paymentGateways, supportedCurrency, currencyRates } from '@shared/schema';
import { initStripePayment } from '../helpers/payments/stripe';
import { initRazorpayPayment } from '../helpers/payments/razorpay';
import { initPaypalPayment } from '../helpers/payments/paypal';
import { initPaystackPayment } from '../helpers/payments/paystack';
import { requireAuth, optionalAuth } from 'server/lib/middleware';
import { calculateFinalPrice } from 'server/helpers/calculatePricing';
import verifyPaypal from 'server/helpers/payments/verify/paypal';
import verifyPaystack from 'server/helpers/payments/verify/paystack';
import verifyRazorpay from 'server/helpers/payments/verify/razorpay';
import verifyStripe from 'server/helpers/payments/verify/stripe';
import crypto from 'crypto';
import { storage } from 'server/storage';
import { confirmPowertranzPayment } from 'server/helpers/payments/verify/confirmPowertranzPayment';
import { initPowertranzSpiSale } from 'server/helpers/payments/powertranz';

const router = Router();

router.get('/gateways', async (req, res) => {
  const currencyCode = req.query.currency as string | undefined;

  let gateways;

  // 👉 CASE 1: currency NOT provided → show all enabled gateways
  if (!currencyCode) {
    gateways = await db
      .select({
        id: paymentGateways.id,
        provider: paymentGateways.provider,
        displayName: paymentGateways.displayName,
        publicKey: paymentGateways.publicKey,
      })
      .from(paymentGateways)
      .where(eq(paymentGateways.isEnabled, true))
      .orderBy(
        asc(paymentGateways.provider),
        asc(paymentGateways.displayName)
      );

    return res.json({
      success: true,
      data: gateways,
      note: 'All enabled gateways (no currency filter)',
    });
  }

  // 👉 CASE 2: currency provided → validate
  const [currency] = await db
    .select({ id: currencyRates.id })
    .from(currencyRates)
    .where(eq(currencyRates.code, currencyCode.toUpperCase()));

  if (!currency) {
    return res.status(400).json({
      success: false,
      message: `Unsupported currency: ${currencyCode}`,
    });
  }

  // 👉 CASE 3: currency based filtering
  gateways = await db
    .select({
      id: paymentGateways.id,
      provider: paymentGateways.provider,
      displayName: paymentGateways.displayName,
      publicKey: paymentGateways.publicKey,
    })
    .from(paymentGateways)
    .innerJoin(
      supportedCurrency,
      eq(paymentGateways.id, supportedCurrency.paymentGatewayId)
    )
    .where(
      and(
        eq(paymentGateways.isEnabled, true),
        eq(supportedCurrency.currencyId, currency.id)
      )
    )
    .orderBy(
      asc(paymentGateways.provider),
      asc(paymentGateways.displayName)
    );

  res.json({
    success: true,
    data: gateways,
    currency: currencyCode.toUpperCase(),
  });
});


router.post('/init', optionalAuth, async (req, res) => {
  try {
    const {
      gatewayId,
      packageId,
      quantity = 1,
      currency,
      orderId,
      promoCode,
      promoType,
      voucherId,
      giftCardId,
      referralCredits,
      email,
      name,
      phone,
    } = req.body;

    const guestAccessToken = req.userId ? null : crypto.randomUUID();

    /* ---------------- Validation ---------------- */
    if (!packageId || !orderId || !currency) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields',
      });
    }

    if (!req.userId && !email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required for guest checkout',
      });
    }

    /* ---------------- Pricing ---------------- */
    const pricing = await calculateFinalPrice({
      packageId,
      quantity,
      requestedCurrency: currency,
      promoCode,
      promoType,
      voucherId,
      giftCardId,
      referralCredits,
      userId: req.userId,
    });

    /* ---------------- Gateway ---------------- */
    const [gateway] = await db
      .select()
      .from(paymentGateways)
      .where(eq(paymentGateways.id, gatewayId));

    if (!gateway || !gateway.isEnabled) {
      return res.status(400).json({
        success: false,
        message: 'Selected payment gateway is disabled',
      });
    }

    let result: any;

    const payment = {
      provider: gateway.provider,
      clientSecret: null as string | null,
      paymentIntentId: null as string | null,
      orderId: null as string | null,
      redirectUrl: null as string | null,
      publicKey: null as string | null,
      guestAccessToken: guestAccessToken,
      amount: null as number | null,
      currency: currency,
    };

    /* ---------------- Init Payment ---------------- */
    switch (gateway.provider) {

      case 'stripe':
        result = await initStripePayment({
          secretKey: gateway.secretKey!,
          amount: pricing.total,
          currency,
          packageId,
          quantity,
          orderId,
          userId: req.userId,
          email,
          name,
          phone,
          metadata: {
            promoCode,
            promoType,
            voucherId,
            giftCardId,
            referralCredits,
            promoDiscount: pricing?.discount,
          },
        });

        payment.clientSecret = result.clientSecret;
        payment.paymentIntentId = result.paymentIntentId;
        payment.guestAccessToken = result.guestAccessToken ?? null;
        payment.amount = pricing.total;
        payment.currency = currency;
        break;
      case 'razorpay':
        result = await initRazorpayPayment({
          keyId: gateway.publicKey!,
          secretKey: gateway.secretKey!,
          amount: pricing.total,
          currency,
          orderId,
          packageId,
          quantity,
          email: email || undefined,
          phone,
          guestAccessToken: payment.guestAccessToken,
          userId: req.userId,
          promoCode,
          promoType,
          voucherId,
          giftCardId,
          referralCredits,
          promoDiscount: pricing?.discount,
        });

        payment.orderId = result.orderId;
        payment.publicKey = result.keyId;
        payment.amount = Math.round(pricing.total * 100);
        payment.currency = currency;
        break;

      case 'paypal':
        result = await initPaypalPayment({
          clientId: gateway.publicKey!,
          secretKey: gateway.secretKey!,
          amount: pricing.total,
          currency,
          packageId,
          quantity,
          email: email || undefined,
          phone: phone,
          guestAccessToken: payment.guestAccessToken,
          userId: req.userId,
          promoCode,
          promoType,
          voucherId,
          giftCardId,
          referralCredits,
          promoDiscount: pricing?.discount,
        });

        payment.orderId = result.orderId;
        payment.amount = pricing.total;
        payment.currency = currency;
        break;

      case 'paystack':
        if (!email) {
          return res.status(400).json({
            success: false,
            message: 'Email is required for Paystack payment',
          });
        }

        result = await initPaystackPayment({
          secretKey: gateway.secretKey!,
          email,
          amount: pricing.total,
          currency,
          promoCode,
          promoType,
          voucherId,
          giftCardId,
          referralCredits,
        });

        payment.orderId = result.reference;
        payment.redirectUrl = result.authorizationUrl;
        payment.amount = Math.round(pricing.total * 100);
        payment.currency = currency;
        break;


      case "powertranz":
        result = await initPowertranzSpiSale({
          merchantId: gateway.publicKey!,
          merchantPassword: gateway.secretKey!,
          amount: pricing.total,
          orderId,
          currency,
          email,
          name,
          // card: req.body.card, // 🔥 REQUIRED
          card: {
            pan: "4012000000020006",
            cvv: "323",
            expiry: "2310",
          },
        });

        payment.provider = "powertranz";
        payment.amount = pricing.total;
        payment.currency = currency;

        return res.json({
          success: true,
          message: "3DS authentication required",
          pricing,
          powertranz: {
            orderId,
            redirectData: result.redirectData, // 🔥 frontend iframe
            spiToken: result.spiToken,         // store client-side for confirm
          },
        });
      default:
        return res.status(400).json({
          success: false,
          message: 'Unsupported payment provider',
        });
    }
    /* ---------------- Final Response ---------------- */
    return res.json({
      success: true,
      message: 'Payment initialized successfully',
      pricing,
      payment,
    });
  } catch (error: any) {
    console.error('Payment init error:', error);

    return res.status(500).json({
      success: false,
      message: error?.message || error?.error || 'Payment initialization failed',
    });
  }
});

router.post('/topup/init', optionalAuth, async (req, res) => {
  try {
    const { gatewayId, packageId, iccid, orderId, currency = 'USD', email, name, phone } = req.body;

    /* ---------------- Validation ---------------- */
    if (!gatewayId || !packageId || !iccid || !orderId) {
      return res.status(400).json({
        success: false,
        message: 'gatewayId, packageId, iccid and orderId are required',
      });
    }

    if (!req.userId && !email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required for guest checkout',
      });
    }

    /* ---------------- Verify Order ---------------- */
    const order = await storage.getOrderById(orderId);
    // if (!order || (order.userId !== req.userId && !req.adminId)) {
    //   return res.status(403).json({
    //     success: false,
    //     message: "Access denied",
    //   });
    // }

    /* ---------------- Package ---------------- */
    const pkg = await storage.getUnifiedPackageById(packageId);
    if (!pkg) {
      return res.status(404).json({
        success: false,
        message: 'Package not found',
      });
    }

    /* ---------------- Top-up Pricing ---------------- */
    const topupMarginSetting = await storage.getSettingByKey('topup_margin');
    const topupMargin = parseFloat(topupMarginSetting?.value || '40');

    const basePrice = pkg.retailPrice ? parseFloat(pkg.retailPrice.toString()) : 0;

    const totalAmount = parseFloat((basePrice * (1 + topupMargin / 100)).toFixed(2));

    /* ---------------- Gateway ---------------- */
    const [gateway] = await db
      .select()
      .from(paymentGateways)
      .where(eq(paymentGateways.id, gatewayId));

    if (!gateway || !gateway.isEnabled) {
      return res.status(400).json({
        success: false,
        message: 'Selected payment gateway is disabled',
      });
    }

    let result: any;

    const payment = {
      provider: gateway.provider,
      clientSecret: null as string | null,
      paymentIntentId: null as string | null,
      orderId: null as string | null,
      redirectUrl: null as string | null,
      publicKey: null as string | null,
      guestAccessToken: null as string | null,
      amount: totalAmount,
      currency,
    };

    /* ---------------- Init Payment ---------------- */
    switch (gateway.provider) {
      /* -------- Stripe -------- */
      case 'stripe':
        result = await initStripePayment({
          secretKey: gateway.secretKey!,
          amount: totalAmount,
          currency,
          orderId,
          userId: req.userId,
          email,
          name,
          phone,
          metadata: {
            type: 'topup',
            packageId,
            iccid,
          },
        });

        payment.clientSecret = result.clientSecret;
        payment.paymentIntentId = result.paymentIntentId;
        payment.guestAccessToken = result.guestAccessToken ?? null;
        break;

      /* -------- Razorpay -------- */
      case 'razorpay':
        result = await initRazorpayPayment({
          keyId: gateway.publicKey!,
          secretKey: gateway.secretKey!,
          amount: totalAmount,
          currency,
          orderId,
          email,
          phone,
          userId: req.userId,
          notes: {
            type: 'topup',
            packageId,
            iccid,
          },
        });

        payment.orderId = result.orderId;
        payment.publicKey = result.keyId;
        payment.amount = Math.round(totalAmount * 100);
        break;

      /* -------- PayPal -------- */
      case 'paypal':
        result = await initPaypalPayment({
          clientId: gateway.publicKey!,
          secretKey: gateway.secretKey!,
          amount: totalAmount,
          currency,
          email,
          phone,
          userId: req.userId,
          metadata: {
            type: 'topup',
            packageId,
            iccid,
          },
        });

        payment.orderId = result.orderId;
        break;

      /* -------- Paystack -------- */
      case 'paystack':
        if (!email) {
          return res.status(400).json({
            success: false,
            message: 'Email is required for Paystack payment',
          });
        }

        result = await initPaystackPayment({
          secretKey: gateway.secretKey!,
          email,
          amount: totalAmount,
          currency,
          metadata: {
            type: 'topup',
            packageId,
            iccid,
          },
        });

        payment.orderId = result.reference;
        payment.redirectUrl = result.authorizationUrl;
        payment.amount = Math.round(totalAmount * 100);
        break;


      case "powertranz":
        result = await initPowertranzSpiSale({
          merchantId: gateway.publicKey!,
          merchantPassword: gateway.secretKey!,
          amount: pricing.total,
          orderId,
          currency,
          email,
          name,
          // card: req.body.card, // 🔥 REQUIRED
          card: {
            pan: "4012000000020006",
            cvv: "323",
            expiry: "2310",
          },
        });

        payment.provider = "powertranz";
        payment.amount = pricing.total;
        payment.currency = currency;

        return res.json({
          success: true,
          message: "3DS authentication required",
          pricing,
          powertranz: {
            orderId,
            redirectData: result.redirectData, // 🔥 frontend iframe
            spiToken: result.spiToken,         // store client-side for confirm
          },
        });

      default:
        return res.status(400).json({
          success: false,
          message: 'Unsupported payment provider',
        });
    }

    /* ---------------- Final Response ---------------- */
    return res.json({
      success: true,
      message: 'Top-up payment initialized successfully',
      pricing: {
        basePrice,
        margin: topupMargin,
        total: totalAmount,
        currency,
      },
      payment,
    });
  } catch (error: any) {
    console.error('Top-up payment init error:', error);
    return res.status(500).json({
      success: false,
      message: error?.message || 'Top-up payment initialization failed',
    });
  }
});



router.post('/confirm-payments', async (req, res) => {
  try {
    const { provider } = req.body;

    if (!provider) {
      return res.status(400).json({
        success: false,
        message: 'provider is required',
      });
    }

    /* 🔐 Fetch ACTIVE gateway by provider name */
    const [gateway] = await db
      .select()
      .from(paymentGateways)
      .where(eq(paymentGateways.provider, provider));

    if (!gateway || !gateway.isEnabled) {
      return res.status(400).json({
        success: false,
        message: `${provider} payment gateway is disabled`,
      });
    }

    let verificationResult;

    switch (provider) {
      case 'razorpay':
        verificationResult = await verifyRazorpay(req.body, gateway);
        break;

      case 'stripe':
        verificationResult = await verifyStripe(req.body, gateway);
        break;

      case 'paypal':
        verificationResult = await verifyPaypal(req.body, gateway);
        break;

      case 'paystack':
        verificationResult = await verifyPaystack(req.body, gateway);
        break;

      case "powertranz":
        verificationResult = await confirmPowertranzPayment(req.body);
        break;

      default:
        return res.status(400).json({
          success: false,
          message: 'Unsupported payment provider',
        });
    }

    if (!verificationResult?.success) {
      return res.status(400).json(verificationResult);
    }

    return res.json({
      success: true,
      provider,
      ...verificationResult,
    });
  } catch (err: any) {
    console.error('Confirm payment error:', err);
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});



router.post('/powertranz/3ds-response', (req, res) => {
  const { IsoResponseCode, SpiToken, RiskManagement } = req.body;

  // 🔥 IMPORTANT: Always respond with HTML
  res.setHeader('Content-Type', 'text/html');

  // Decide success/failure
  const isSuccess =
    IsoResponseCode === '3D0' &&
    RiskManagement?.ThreeDSecure?.AuthenticationStatus === 'Y';

  // Redirect parent window (exit iframe)
  res.send(`
    <!DOCTYPE html>
    <html>
      <body>
        <script>
          window.parent.postMessage(
            {
              type: 'POWERTRANZ_3DS_RESULT',
              success: ${isSuccess},
              spiToken: '${SpiToken}'
            },
            '*'
          );
        </script>
      </body>
    </html>
  `);
});


export default router;
