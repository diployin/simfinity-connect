import React, { useState, useRef, useEffect } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import StripeCheckoutForm from './StripeCheckoutForm';
import RazorpayPayment from './RazorpayPayment';
import PaypalPayment from './PaypalPayment';
import { useToast } from '@/hooks/use-toast';
import { Loader2, AlertCircle, CheckCircle, CreditCard } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import PowerTranzCardForm from './Powertranzcardform';

interface PaymentGatewayRendererProps {
  initData: {
    provider: 'stripe' | 'razorpay' | 'paypal' | 'powertranz';
    publicKey?: string;
    clientSecret?: string;
    orderId?: string;
    amount?: number;
    currency?: string;
    guestAccessToken?: string;
    redirectData?: string;
    spiToken?: string;
    paymentMethod?: 'spi' | 'hpp'; // 🔥 NEW: Method selector
    redirectUrl?: string; // 🔥 NEW: HPP redirect URL
  };
  email?: string;
  name?: string;
  phone?: string;
  packageData?: any;
  onPaymentSuccess?: (transactionId: string) => void;
  onPaymentError?: (error: string) => void;
}

export default function PaymentGatewayRenderer({
  initData,
  email,
  name,
  phone,
  packageData,
  onPaymentSuccess,
  onPaymentError,
}: PaymentGatewayRendererProps) {
  const { toast } = useToast();
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [powertranzState, setPowertranzState] = useState<
    'method_select' | 'card_form' | 'processing' | '3ds_challenge' | 'confirming' | 'success' | 'error' | 'hpp_redirect'
  >('method_select');
  const [powertranzError, setPowertranzError] = useState<string | null>(null);
  const [powertranzSuccess, setPowertranzSuccess] = useState<any>(null);
  const [debugLogs, setDebugLogs] = useState<string[]>([]);
  const spiTokenRef = useRef<string | undefined>(initData.spiToken);

  const addDebugLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    const log = `[${timestamp}] ${message}`;
    console.log(log);
    setDebugLogs((prev) => [...prev, log].slice(-20));
  };

  useEffect(() => {
    addDebugLog(`🎯 PaymentGatewayRenderer initialized: ${initData.provider}`);

    // 🔥 NEW: If payment method is already selected from backend, skip selection
    if (initData.paymentMethod) {
      addDebugLog(`✅ Payment method pre-selected: ${initData.paymentMethod}`);
      if (initData.paymentMethod === 'hpp' && initData.redirectUrl) {
        setPowertranzState('hpp_redirect');
      } else if (initData.paymentMethod === 'spi') {
        setPowertranzState('card_form');
      }
    }
  }, [initData]);

  /* ===============================
     HPP REDIRECT HANDLER
     =============================== */
  const handleHppMethodSelect = async () => {
    try {
      addDebugLog('🔥 User selected HPP method');
      setPowertranzState('processing');
      setPowertranzError(null);

      console.log('🔥 User selected HPP method', initData, packageData);

      // Call backend to initialize HPP
      const response = await fetch('/api/payments/init', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          gatewayId: initData.publicKey, // Should be passed via initData
          packageId: initData.packageData?.id,
          quantity: 1,
          currency: initData.packageData?.currency,
          gatewayId: initData?.gatewayId,
          orderId: initData.orderId,
          email,
          name,
          phone,
          paymentMethod: 'hpp', // 🔥 Tell backend to use HPP method
        }),
      });

      const data = await response.json();

      if (data.success && data.powertranz?.redirectUrl) {
        addDebugLog(`✅ HPP initialized, redirecting to: ${data.powertranz.redirectUrl.substring(0, 50)}...`);
        setPowertranzState('hpp_redirect');

        // 🔥 Redirect user to PowerTranz hosted payment page
        setTimeout(() => {
          window.location.href = data.powertranz.redirectUrl;
        }, 1000);
      } else {
        throw new Error(data.message || 'HPP initialization failed');
      }
    } catch (error: any) {
      addDebugLog(`❌ HPP initialization error: ${error.message}`);
      setPowertranzState('error');
      setPowertranzError(error.message || 'HPP initialization failed');
      onPaymentError?.(error.message);
    }
  };

  const handleSpiMethodSelect = () => {
    addDebugLog('🔥 User selected SPI (Card Form) method');
    setPowertranzState('card_form');
    setPowertranzError(null);
  };

  /* ===============================
     3DS LISTENER (existing logic)
     =============================== */
  useEffect(() => {
    if (powertranzState !== '3ds_challenge') return;

    addDebugLog('🔄 Setting up postMessage listener...');

    const handlePostMessage = (event: MessageEvent) => {
      addDebugLog(`📨 postMessage received! Type: ${event.data?.type}`);

      if (event.data?.type === 'POWERTRANZ_3DS_RESULT') {
        const { success, failureReason, isoResponseCode, spiToken } = event.data;

        addDebugLog(`✅ 3DS Result received: success=${success}, code=${isoResponseCode}`);

        if (!success) {
          addDebugLog(`❌ 3DS authentication failed: ${failureReason}`);
          setPowertranzState('error');
          setPowertranzError(failureReason || '3D Secure authentication failed');
          onPaymentError?.(failureReason);
          return;
        }

        addDebugLog('✅ 3DS authentication successful! Moving to confirmation...');
        setPowertranzState('confirming');

        const spiTokenToUse = spiTokenRef.current;
        addDebugLog(`🔑 Using SpiToken: ${spiTokenToUse?.substring(0, 20)}...`);

        try {
          if (!spiTokenToUse) {
            throw new Error('SpiToken is missing');
          }

          addDebugLog('🔥 Calling /api/payments/powertranz/confirm...');

          fetch('/api/payments/powertranz/confirm', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              spiToken: spiTokenToUse,
              orderId: initData.orderId,
              guestAccessToken: initData.guestAccessToken,
            }),
          })
            .then((response) => {
              addDebugLog(`📥 Confirmation response received: ${response.status}`);
              return response.json();
            })
            .then((data) => {
              addDebugLog(`✅ Confirmation response parsed: success=${data.success}`);

              if (data.success) {
                addDebugLog('🎉 Payment confirmed successfully!');
                setPowertranzSuccess(data);
                setPowertranzState('success');
                onPaymentSuccess?.(data.transactionId);

                toast({
                  title: 'Payment Successful ✅',
                  description: `Transaction ID: ${data.transactionId}`,
                });
              } else {
                addDebugLog(`⚠️ Payment not approved: ${data.message}`);
                setPowertranzState('error');
                setPowertranzError(data.message || 'Payment was declined');
                onPaymentError?.(data.message);

                toast({
                  title: 'Payment Declined',
                  description: data.message,
                  variant: 'destructive',
                });
              }
            })
            .catch((error) => {
              addDebugLog(`❌ Confirmation error: ${error.message}`);
              setPowertranzState('error');
              setPowertranzError(error.message || 'Payment confirmation failed');
              onPaymentError?.(error.message);

              toast({
                title: 'Payment Error',
                description: error.message,
                variant: 'destructive',
              });
            });
        } catch (error: any) {
          addDebugLog(`❌ Error in message handler: ${error.message}`);
          setPowertranzState('error');
          setPowertranzError(error.message);
        }
      }
    };

    addDebugLog('✅ Adding window message event listener');
    window.addEventListener('message', handlePostMessage);

    return () => {
      addDebugLog('🗑️ Removing window message event listener');
      window.removeEventListener('message', handlePostMessage);
    };
  }, [powertranzState, initData.orderId, initData.guestAccessToken, onPaymentSuccess, onPaymentError, toast]);

  /* ===============================
     POWERTRANZ RENDERING
     =============================== */
  if (initData.provider === 'powertranz') {

    // State: Method Selection 🔥 NEW
    if (powertranzState === 'method_select') {
      return (
        <Card className="border-2 border-blue-200 dark:border-blue-800">
          <CardContent className="p-8">
            <div className="text-center mb-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                Choose Payment Method
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                Select how you'd like to complete your payment
              </p>
            </div>

            <div className="space-y-3">
              {/* HPP METHOD */}
              <button
                onClick={handleHppMethodSelect}
                className="w-full p-4 border-2 border-gray-200 dark:border-gray-700 rounded-lg hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950/20 transition-all text-left"
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
                    <CreditCard className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 dark:text-white">
                      🌐 Hosted Payment Page (Recommended)
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      Secure hosted page - your card details stay safe
                    </p>
                    <ul className="text-xs text-gray-500 dark:text-gray-500 mt-2 space-y-1">
                      <li>✓ 3D Secure included</li>
                      <li>✓ Fast & easy checkout</li>
                      <li>✓ PCI compliant</li>
                    </ul>
                  </div>
                </div>
              </button>

              {/* SPI METHOD */}
              <button
                onClick={handleSpiMethodSelect}
                className="w-full p-4 border-2 border-gray-200 dark:border-gray-700 rounded-lg hover:border-amber-500 hover:bg-amber-50 dark:hover:bg-amber-950/20 transition-all text-left"
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-amber-100 dark:bg-amber-900/50 rounded-lg">
                    <CreditCard className="w-5 h-5 text-amber-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 dark:text-white">
                      💳 Card Form with 3D Secure
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      Enter card details directly in iframe
                    </p>
                    <ul className="text-xs text-gray-500 dark:text-gray-500 mt-2 space-y-1">
                      <li>✓ Direct card entry</li>
                      <li>✓ 3DS challenge</li>
                      <li>✓ Advanced validation</li>
                    </ul>
                  </div>
                </div>
              </button>
            </div>

            <div className="mt-6 p-3 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-blue-700 dark:text-blue-300">
                Both methods are secure. HPP is recommended for faster checkout.
              </p>
            </div>
          </CardContent>
        </Card>
      );
    }

    // State: HPP Redirect 🔥 NEW
    if (powertranzState === 'hpp_redirect') {
      return (
        <Card className="border-blue-200">
          <CardContent className="p-8 flex flex-col items-center gap-4">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
            <div className="text-center">
              <p className="font-medium">Redirecting to payment page...</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                You'll be taken to our secure payment processor
              </p>
            </div>
          </CardContent>
        </Card>
      );
    }

    // State: Card Form (SPI)
    if (powertranzState === 'card_form') {
      return (
        <PowerTranzCardForm
          onCardSubmit={(cardData) => {
            addDebugLog('✅ Card form submitted');
            setPowertranzState('processing');
            setPowertranzError(null);
            setTimeout(() => {
              addDebugLog('📊 Moving to 3DS challenge state');
              setPowertranzState('3ds_challenge');
            }, 500);
          }}
          isLoading={powertranzState === 'processing'}
          error={powertranzError || undefined}
        />
      );
    }

    // State: Processing
    if (powertranzState === 'processing') {
      return (
        <Card className="border-blue-200">
          <CardContent className="p-8 flex flex-col items-center gap-4">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
            <p className="text-center">Processing your payment...</p>
          </CardContent>
        </Card>
      );
    }

    // State: 3DS Challenge (SPI)
    if (powertranzState === '3ds_challenge') {
      if (!initData.redirectData) {
        return (
          <Card className="border-red-200">
            <CardContent className="p-4">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <p className="text-red-900">3D Secure Error</p>
              <Button
                onClick={() => setPowertranzState('card_form')}
                className="mt-3"
                size="sm"
              >
                Try Again
              </Button>
            </CardContent>
          </Card>
        );
      }

      return (
        <div className="w-full space-y-4">
          <div className="w-full border rounded-md overflow-hidden shadow-lg">
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 p-3 border-b">
              <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                🔒 3D Secure Authentication
              </p>
              <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                Complete verification to confirm your payment
              </p>
            </div>

            <iframe
              ref={iframeRef}
              title="PowerTranz 3DS"
              srcDoc={initData.redirectData}
              style={{
                width: '100%',
                height: '600px',
                border: 'none',
                backgroundColor: '#fff',
              }}
              sandbox="allow-forms allow-scripts allow-same-origin"
              onLoad={() => {
                addDebugLog('✅ 3DS iframe loaded successfully');
              }}
            />

            <div className="bg-gray-50 dark:bg-gray-900/50 p-3 border-t text-xs text-muted-foreground">
              <p>🔐 Do not refresh or close this page while authenticating.</p>
            </div>
          </div>

          {/* DEBUG LOGS */}
          <Card className="bg-gray-900 border-gray-700 text-xs max-h-40 overflow-y-auto">
            <CardContent className="p-2">
              <p className="text-gray-300 mb-2 font-bold">Debug Logs:</p>
              {debugLogs.map((log, idx) => (
                <div key={idx} className="text-gray-400 font-mono mb-1">
                  {log}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      );
    }

    // State: Confirming
    if (powertranzState === 'confirming') {
      return (
        <Card className="border-blue-200">
          <CardContent className="p-8 flex flex-col items-center gap-4">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
            <p className="text-center font-medium">Confirming your payment...</p>
          </CardContent>
        </Card>
      );
    }

    // State: Success
    if (powertranzState === 'success') {
      return (
        <Card className="border-green-200 bg-green-50 dark:bg-green-950/20">
          <CardContent className="p-8 flex flex-col items-center gap-4">
            <CheckCircle className="w-12 h-12 text-green-600" />
            <div className="text-center">
              <p className="font-bold text-lg text-green-900">Payment Successful! ✅</p>
              <p className="text-sm text-green-700 mt-2">Your payment has been processed.</p>
              {powertranzSuccess?.transactionId && (
                <p className="text-xs text-green-600 mt-3 font-mono bg-white px-3 py-2 rounded">
                  ID: {powertranzSuccess.transactionId}
                </p>
              )}
            </div>
            <Button onClick={() => (window.location.href = '/orders')} className="mt-4">
              View Order
            </Button>
          </CardContent>
        </Card>
      );
    }

    // State: Error
    if (powertranzState === 'error') {
      return (
        <Card className="border-red-200 bg-red-50 dark:bg-red-950/20">
          <CardContent className="p-4">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="font-medium text-red-900">Payment Error</p>
                <p className="text-sm text-red-700 mt-1">{powertranzError}</p>
                <div className="flex gap-2 mt-4">
                  <Button
                    onClick={() => {
                      addDebugLog('🔄 User clicked Try Again');
                      setPowertranzState('method_select');
                      setPowertranzError(null);
                      setDebugLogs([]);
                    }}
                    size="sm"
                    className="bg-red-600 hover:bg-red-700"
                  >
                    Try Another Method
                  </Button>
                  <Button onClick={() => (window.location.href = '/')} size="sm" variant="outline">
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      );
    }
  }

  // Other providers (Stripe, Razorpay, etc.)
  return (
    <Card className="border-red-200">
      <CardContent className="p-4">
        <AlertCircle className="w-5 h-5 text-red-600" />
        <p className="text-red-900">Unsupported Payment Provider</p>
      </CardContent>
    </Card>
  );
}