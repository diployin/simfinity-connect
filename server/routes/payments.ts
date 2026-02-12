import { Router } from 'express';
import { eq, asc, and } from 'drizzle-orm';
import { db } from 'server/db';
import { paymentGateways, supportedCurrency, currencyRates, orders } from '@shared/schema';
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
import { confirmPowertranzPayment, initPowertranzSpiSale } from 'server/services/powertranz.service';
import { initPowertranzHpp } from 'server/services/powertranz-hpp.service';
// import { confirmPowertranzPayment } from 'server/helpers/payments/verify/confirmPowertranzPayment';
// import { initPowertranzSpiSale } from 'server/helpers/payments/powertranz';

const router = Router();

router.get('/gateways', async (req, res) => {
  const currencyCode = req.query.currency as string | undefined;

  const inAppPurchaseSetting = await storage.getSettingByKey('in_app_purchase') || false;
  const inAppPurchase = inAppPurchaseSetting?.value === 'true';

  // gateways is an array
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
      inAppPurchase,
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
    inAppPurchase,
    currency: currencyCode.toUpperCase(),
  });
});


// router.post('/init', optionalAuth, async (req, res) => {
//   try {
//     const {
//       gatewayId,
//       packageId,
//       quantity = 1,
//       currency,
//       orderId,
//       promoCode,
//       promoType,
//       voucherId,
//       giftCardId,
//       referralCredits,
//       email,
//       name,
//       phone,
//     } = req.body;

//     const guestAccessToken = req.userId ? null : crypto.randomUUID();

//     /* ---------------- Validation ---------------- */
//     if (!packageId || !orderId || !currency) {
//       return res.status(400).json({
//         success: false,
//         message: 'Missing required fields',
//       });
//     }

//     if (!req.userId && !email) {
//       return res.status(400).json({
//         success: false,
//         message: 'Email is required for guest checkout',
//       });
//     }

//     /* ---------------- Pricing ---------------- */
//     const pricing = await calculateFinalPrice({
//       packageId,
//       quantity,
//       requestedCurrency: currency,
//       promoCode,
//       promoType,
//       voucherId,
//       giftCardId,
//       referralCredits,
//       userId: req.userId,
//     });

//     /* ---------------- Gateway ---------------- */
//     const [gateway] = await db
//       .select()
//       .from(paymentGateways)
//       .where(eq(paymentGateways.id, gatewayId));

//     if (!gateway || !gateway.isEnabled) {
//       return res.status(400).json({
//         success: false,
//         message: 'Selected payment gateway is disabled',
//       });
//     }

//     let result: any;

//     const payment = {
//       provider: gateway.provider,
//       clientSecret: null as string | null,
//       paymentIntentId: null as string | null,
//       orderId: null as string | null,
//       redirectUrl: null as string | null,
//       publicKey: null as string | null,
//       guestAccessToken: guestAccessToken,
//       amount: null as number | null,
//       currency: currency,
//     };

//     /* ---------------- Init Payment ---------------- */
//     switch (gateway.provider) {

//       case 'stripe':
//         result = await initStripePayment({
//           secretKey: gateway.secretKey!,
//           amount: pricing.total,
//           currency,
//           packageId,
//           quantity,
//           orderId,
//           userId: req.userId,
//           email,
//           name,
//           phone,
//           metadata: {
//             promoCode,
//             promoType,
//             voucherId,
//             giftCardId,
//             referralCredits,
//             promoDiscount: pricing?.discount,
//           },
//         });

//         payment.clientSecret = result.clientSecret;
//         payment.paymentIntentId = result.paymentIntentId;
//         payment.guestAccessToken = result.guestAccessToken ?? null;
//         payment.amount = pricing.total;
//         payment.currency = currency;
//         break;
//       case 'razorpay':
//         result = await initRazorpayPayment({
//           keyId: gateway.publicKey!,
//           secretKey: gateway.secretKey!,
//           amount: pricing.total,
//           currency,
//           orderId,
//           packageId,
//           quantity,
//           email: email || undefined,
//           phone,
//           guestAccessToken: payment.guestAccessToken,
//           userId: req.userId,
//           promoCode,
//           promoType,
//           voucherId,
//           giftCardId,
//           referralCredits,
//           promoDiscount: pricing?.discount,
//         });

//         payment.orderId = result.orderId;
//         payment.publicKey = result.keyId;
//         payment.amount = Math.round(pricing.total * 100);
//         payment.currency = currency;
//         break;

//       case 'paypal':
//         result = await initPaypalPayment({
//           clientId: gateway.publicKey!,
//           secretKey: gateway.secretKey!,
//           amount: pricing.total,
//           currency,
//           packageId,
//           quantity,
//           email: email || undefined,
//           phone: phone,
//           guestAccessToken: payment.guestAccessToken,
//           userId: req.userId,
//           promoCode,
//           promoType,
//           voucherId,
//           giftCardId,
//           referralCredits,
//           promoDiscount: pricing?.discount,
//         });

//         payment.orderId = result.orderId;
//         payment.amount = pricing.total;
//         payment.currency = currency;
//         break;

//       case 'paystack':
//         if (!email) {
//           return res.status(400).json({
//             success: false,
//             message: 'Email is required for Paystack payment',
//           });
//         }

//         result = await initPaystackPayment({
//           secretKey: gateway.secretKey!,
//           email,
//           amount: pricing.total,
//           currency,
//           promoCode,
//           promoType,
//           voucherId,
//           giftCardId,
//           referralCredits,
//         });

//         payment.orderId = result.reference;
//         payment.redirectUrl = result.authorizationUrl;
//         payment.amount = Math.round(pricing.total * 100);
//         payment.currency = currency;
//         break;


//       case "powertranz":
//         result = await initPowertranzSpiSale({
//           merchantId: gateway.publicKey!,
//           merchantPassword: gateway.secretKey!,
//           amount: pricing.total,
//           orderId,
//           currency,
//           email,
//           name,
//           // card: req.body.card, // 🔥 REQUIRED
//           card: {
//             pan: "4012000000020006",
//             cvv: "323",
//             expiry: "2310",
//           },
//         });

//         payment.provider = "powertranz";
//         payment.amount = pricing.total;
//         payment.currency = currency;

//         return res.json({
//           success: true,
//           message: "3DS authentication required",
//           pricing,
//           powertranz: {
//             orderId,
//             redirectData: result.redirectData, // 🔥 frontend iframe
//             spiToken: result.spiToken,         // store client-side for confirm
//           },
//         });
//       default:
//         return res.status(400).json({
//           success: false,
//           message: 'Unsupported payment provider',
//         });
//     }
//     /* ---------------- Final Response ---------------- */
//     return res.json({
//       success: true,
//       message: 'Payment initialized successfully',
//       pricing,
//       payment,
//     });
//   } catch (error: any) {
//     console.error('Payment init error:', error);

//     return res.status(500).json({
//       success: false,
//       message: error?.message || error?.error || 'Payment initialization failed',
//     });
//   }
// });


/**
 * Initialize Payment
 * Supports: Stripe, Razorpay, PayPal, Paystack, PowerTranz (SPI), PowerTranz (HPP)
 */
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
      card, // 🔥 Card data from frontend (only for PowerTranz SPI)
      paymentMethod = 'spi', // 'spi' or 'hpp' for PowerTranz
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

    /* ---------------- Gateway Validation ---------------- */
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
      paymentMethod: null as string | null, // 'spi' or 'hpp'
    };

    /* ========================
       PAYMENT GATEWAY ROUTING
       ======================== */

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

      /* ========================
         POWERTRANZ INTEGRATION
         ======================== */

      case 'powertranz':
        // 🔥 NEW: Support both SPI and HPP methods
        if (paymentMethod === 'hpp') {
          // ========================
          // HPP METHOD (HOSTED PAGE)
          // ========================
          console.log('🎯 Initializing PowerTranz HPP (Hosted Payment Page)');

          result = await initPowertranzHpp({
            merchantId: gateway.publicKey!,
            merchantPassword: gateway.secretKey!,
            amount: pricing.total,
            orderId,
            currency,
            email,
            name,
            phone,
          });

          console.log('✅ PowerTranz HPP initialized:', {
            hasRedirectUrl: !!result.redirectUrl,
            hppToken: result.hppToken?.substring(0, 20) + '...',
          });

          // Return HPP redirect response
          return res.json({
            success: true,
            message: 'HPP payment page initialized',
            pricing,
            powertranz: {
              method: 'hpp',
              redirectUrl: result.redirectUrl, // Frontend redirects user to this URL
              hppToken: result.hppToken,
            },
            payment: {
              provider: 'powertranz',
              paymentMethod: 'hpp',
              guestAccessToken,
              amount: pricing.total,
              currency,
              orderId,
            },
          });

        } else {
          // ========================
          // SPI METHOD (3DS IFRAME)
          // ========================
          // 🔥 Validate card data is provided for SPI
          if (!card || !card.pan || !card.cvv || !card.expiry) {
            return res.status(400).json({
              success: false,
              message: 'Card details are required for PowerTranz SPI payment',
            });
          }

          console.log('🔥 Initializing PowerTranz SPI (3DS Challenge)');

          result = await initPowertranzSpiSale({
            merchantId: gateway.publicKey!,
            merchantPassword: gateway.secretKey!,
            amount: pricing.total,
            orderId,
            currency,
            email,
            name,
            card,
          });

          console.log('✅ PowerTranz SPI response:', {
            IsoResponseCode: result.IsoResponseCode,
            hasSpiToken: !!result.spiToken,
            hasRedirectData: !!result.redirectData,
          });

          // Return 3DS data for frontend iframe
          return res.json({
            success: true,
            message: '3DS authentication required',
            pricing,
            powertranz: {
              method: 'spi',
              orderId,
              redirectData: result.redirectData, // HTML for iframe
              spiToken: result.spiToken, // Store for confirmation
            },
            payment: {
              provider: 'powertranz',
              paymentMethod: 'spi',
              guestAccessToken,
              amount: pricing.total,
              currency,
            },
          });
        }

      default:
        return res.status(400).json({
          success: false,
          message: 'Unsupported payment provider',
        });
    }

    /* ========================
       FINAL RESPONSE (non-PowerTranz)
       ======================== */
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

/**
 * PowerTranz HPP Callback Handler
 * Called by PowerTranz (via frontend redirect) after user completes payment
 */
router.post('/powertranz/hpp-callback', async (req, res) => {
  try {
    console.log('🔐 [HPP CALLBACK RECEIVED]', {
      timestamp: new Date().toISOString(),
      method: req.method,
      hasApproved: !!req.body.Approved,
    });

    // Parse callback response
    const callbackData = req.body;

    // Process the HPP callback
    const result = processHppCallbackResponse(callbackData);

    if (result.success && result.approved) {
      console.log('✅ HPP payment APPROVED - updating order status');

      // Update order status in database
      try {
        await db
          .update(orders)
          .set({
            status: 'completed',
            paymentMethod: 'powertranz-hpp',
            transactionId: result.transactionId,
            updatedAt: new Date(),
          })
          .where(eq(orders.id, result.orderId!));

        console.log('✅ Order updated in database');
      } catch (dbError: any) {
        console.error('❌ Database update error:', dbError);
        // Even if DB update fails, payment was approved
      }

      // ✅ Return success response
      return res.status(200).json({
        success: true,
        message: 'Payment confirmed successfully',
        transactionId: result.transactionId,
        orderId: result.orderId,
      });

    } else if (result.success && !result.approved) {
      // Payment was declined
      console.warn('⚠️ HPP payment DECLINED');

      return res.status(200).json({
        success: false,
        message: result.message || 'Payment was declined',
        error: result.error,
        orderId: result.orderId,
      });

    } else {
      // Error processing callback
      return res.status(400).json({
        success: false,
        message: 'Error processing payment callback',
        error: result.error,
      });
    }

  } catch (error: any) {
    console.error('❌ HPP callback error:', error);

    return res.status(500).json({
      success: false,
      message: error?.message || 'HPP callback processing failed',
    });
  }
});

/**
 * PowerTranz HPP Cancel Handler
 * Called when user cancels payment on HPP page
 */
router.get('/powertranz/hpp-cancel', (req, res) => {
  console.log('⚠️ HPP payment CANCELLED by user');

  // Redirect to checkout with error
  res.redirect(
    `/checkout?error=${encodeURIComponent('Payment was cancelled. Please try again.')}`
  );
});

/**
 * PowerTranz HPP Server Notification
 * Optional: Server-to-server notification (more reliable than callback)
 */
router.post('/powertranz/hpp-notify', async (req, res) => {
  try {
    console.log('📬 [HPP SERVER NOTIFICATION RECEIVED]', {
      timestamp: new Date().toISOString(),
      hasApproved: !!req.body.Approved,
    });

    const notificationData = req.body;

    // Process notification (similar to callback)
    const result = processHppCallbackResponse(notificationData);

    if (result.success && result.approved) {
      console.log('✅ HPP notification: Payment APPROVED');

      // Update order status
      await db
        .update(orders)
        .set({
          status: 'completed',
          paymentMethod: 'powertranz-hpp',
          transactionId: result.transactionId,
          updatedAt: new Date(),
        })
        .where(eq(orders.id, result.orderId!));

      // Return 200 OK to acknowledge notification
      return res.status(200).json({ success: true });

    } else {
      console.warn('⚠️ HPP notification: Payment DECLINED');
      return res.status(200).json({ success: true });
    }

  } catch (error: any) {
    console.error('❌ HPP notification error:', error);
    // Still return 200 to avoid retries
    return res.status(200).json({ success: true, warning: error.message });
  }
});

/**
 * PowerTranz SPI: 3DS Response Handler (existing)
 */
router.post('/powertranz/3ds-response', (req, res) => {
  console.log('🔐 [3DS CALLBACK RECEIVED]', {
    timestamp: new Date().toISOString(),
    method: req.method,
    contentType: req.headers['content-type'],
  });

  let responseData = req.body;
  if (req.body.Response && typeof req.body.Response === 'string') {
    try {
      responseData = JSON.parse(req.body.Response);
    } catch (e) {
      console.error('❌ Failed to parse Response:', e.message);
    }
  }

  const {
    TransactionType,
    Approved,
    TransactionIdentifier,
    TotalAmount,
    CurrencyCode,
    CardBrand,
    IsoResponseCode,
    ResponseMessage,
    RiskManagement,
    PanToken,
    OrderIdentifier,
    Errors,
    SpiToken,
  } = responseData;

  console.log('🔐 Parsed Response:', {
    IsoResponseCode,
    ResponseMessage,
    Approved,
    hasSpiToken: !!SpiToken,
  });

  res.setHeader('Content-Type', 'text/html');

  let isSuccess = false;
  let failureReason = '';

  if (RiskManagement?.ThreeDSecure) {
    const threeDSData = RiskManagement.ThreeDSecure;
    if (threeDSData.ResponseCode === '3D0' || IsoResponseCode === '3D0') {
      isSuccess = true;
    } else {
      failureReason = threeDSData.CardholderInfo || ResponseMessage || 'Authentication failed';
    }
  } else if (IsoResponseCode === 'SP4') {
    isSuccess = true;
  } else if (Errors && Errors.length > 0) {
    failureReason = Errors.map((e: any) => e.Message).join(', ');
  }

  const finalSpiToken = SpiToken || req.body.SpiToken;

  console.log('🔐 3DS Result:', {
    isSuccess,
    IsoResponseCode,
    spiToken: finalSpiToken?.substring(0, 20) + '...',
  });

  const htmlResponse = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <title>3DS Result</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
          }
          .container {
            text-align: center;
            padding: 2rem;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 10px;
            backdrop-filter: blur(10px);
          }
          .spinner {
            border: 4px solid rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            border-top: 4px solid white;
            width: 40px;
            height: 40px;
            animation: spin 1s linear infinite;
            margin: 0 auto 1rem;
          }
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="spinner"></div>
          <h2>${isSuccess ? '✅ Authentication Successful' : '❌ Authentication Failed'}</h2>
          <p>${isSuccess ? 'Processing your payment...' : failureReason}</p>
        </div>
        
        <script>
          console.log('[3DS IFRAME] Page loaded, about to send postMessage...');
          
          const messageData = {
            type: 'POWERTRANZ_3DS_RESULT',
            success: ${isSuccess ? 'true' : 'false'},
            spiToken: '${finalSpiToken || ''}',
            isoResponseCode: '${IsoResponseCode}',
            responseMessage: '${ResponseMessage}',
            transactionIdentifier: '${TransactionIdentifier}',
            orderIdentifier: '${OrderIdentifier}',
            failureReason: '${failureReason.replace(/'/g, "\\'")}',
            timestamp: new Date().toISOString(),
          };
          
          try {
            window.parent.postMessage(messageData, '*');
            setTimeout(() => {
              window.parent.postMessage(messageData, '*');
            }, 100);
          } catch (error) {
            console.error('[3DS IFRAME] ❌ postMessage failed:', error);
          }
        </script>
      </body>
    </html>
  `;

  console.log('📤 Sending 3DS response HTML to client');
  res.send(htmlResponse);
});

/**
 * PowerTranz SPI: Confirm Payment (existing)
 */
router.post('/powertranz/confirm', optionalAuth, async (req, res) => {
  try {
    const { spiToken, orderId, guestAccessToken } = req.body;

    console.log('🔥 Confirming PowerTranz SPI payment:', {
      hasSpiToken: !!spiToken,
      orderId,
      hasGuestToken: !!guestAccessToken,
    });

    if (!spiToken || !orderId) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: spiToken and orderId are required',
      });
    }

    const merchantId = process.env.POWERTRANZ_MERCHANT_ID;
    const merchantPassword = process.env.POWERTRANZ_MERCHANT_PASSWORD;

    if (!merchantId || !merchantPassword) {
      return res.status(500).json({
        success: false,
        message: 'Payment gateway not configured properly',
      });
    }

    let confirmResult;
    try {
      confirmResult = await confirmPowertranzPayment({
        spiToken,
        merchantId,
        merchantPassword,
      });
    } catch (serviceError: any) {
      console.error('❌ PowerTranz service error:', serviceError.message);
      return res.status(500).json({
        success: false,
        message: serviceError.message || 'Failed to confirm payment with PowerTranz',
      });
    }

    console.log('✅ PowerTranz confirmation result:', {
      Approved: confirmResult.Approved,
      IsoResponseCode: confirmResult.IsoResponseCode,
    });

    if (confirmResult.Approved) {
      console.log('✅ Payment APPROVED - updating order status');

      try {
        await db
          .update(orders)
          .set({
            status: 'completed',
            paymentMethod: 'powertranz-spi',
            transactionId: confirmResult.TransactionIdentifier,
            updatedAt: new Date(),
          })
          .where(eq(orders.id, orderId));

        console.log('✅ Order updated in database');
      } catch (dbError: any) {
        console.error('❌ Database update error:', dbError);
        return res.status(200).json({
          success: true,
          message: 'Payment confirmed but order update pending',
          transactionId: confirmResult.TransactionIdentifier,
          orderId,
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Payment confirmed successfully',
        transactionId: confirmResult.TransactionIdentifier,
        orderId,
      });
    } else {
      console.warn('⚠️ Payment NOT APPROVED');

      return res.status(200).json({
        success: false,
        message: confirmResult.ResponseMessage || 'Payment was declined',
        isoResponseCode: confirmResult.IsoResponseCode,
        transactionId: confirmResult.TransactionIdentifier,
      });
    }

  } catch (error: any) {
    console.error('❌ PowerTranz confirmation error:', error);

    return res.status(500).json({
      success: false,
      message: error?.message || 'Payment confirmation failed',
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





export default router;
