import { useState, useEffect, useRef } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Smartphone, QrCode, Plus, Loader2, Globe, Zap, Package, Calendar, Signal, Database, Phone, MessageSquare, Copy, Check } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { queryClient, apiRequest } from '@/lib/queryClient';
import type { Order, UnifiedPackage, Destination } from '@shared/schema';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useTranslation } from '@/contexts/TranslationContext';
import { useUser } from '@/hooks/use-user';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';



// Razorpay Top-up Component
function RazorpayTopup({
  orderId,
  amount,
  currency,
  publicKey,
  email,
  onSuccess,
  onError,
}: {
  orderId: string;
  amount: number;
  currency: string;
  publicKey: string;
  email?: string;
  onSuccess: () => void;
  onError: (msg: string) => void;
}) {
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayment = () => {
    setIsProcessing(true);
    const options = {
      key: publicKey,
      amount: amount, // Amount is already in smallest unit from backend init
      currency: currency,
      name: 'esim-master',
      description: 'Top-up Payment',
      order_id: orderId,
      prefill: { email },
      handler: async (response: any) => {
        try {
          const res = await apiRequest('POST', '/api/confirm-payment', {
            providerType: 'razorpay',
            orderId: response.razorpay_order_id,
            paymentId: response.razorpay_payment_id,
            signature: response.razorpay_signature,
          });

          const data = await res.json();
          if (data.success) {
            onSuccess();
          } else {
            throw new Error(data.message || 'Payment verification failed');
          }
        } catch (err: any) {
          onError(err.message);
          setIsProcessing(false);
        }
      },
      modal: {
        ondismiss: () => {
          setIsProcessing(false);
        },
      },
    };

    const rzp = new (window as any).Razorpay(options);
    rzp.open();
  };

  return (
    <Button
      onClick={handlePayment}
      className="w-full h-11"
      disabled={isProcessing}
    >
      {isProcessing ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Processing...
        </>
      ) : (
        'Pay with Razorpay'
      )}
    </Button>
  );
}

// PayPal Top-up Component
function PaypalTopup({
  orderId,
  amount,
  currency,
  publicKey,
  onSuccess,
  onError,
}: {
  orderId: string;
  amount: number;
  currency: string;
  publicKey: string;
  onSuccess: () => void;
  onError: (msg: string) => void;
}) {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (!publicKey) return;

    // Ensure PayPal SDK is injected
    if (!(window as any).paypal) {
      const scriptId = 'paypal-js-sdk-topup';
      if (!document.getElementById(scriptId)) {
        const s = document.createElement('script');
        s.id = scriptId;
        s.src = `https://www.paypal.com/sdk/js?client-id=${publicKey}&currency=USD`;
        s.async = true;
        document.head.appendChild(s);
      }
    }

    const interval = setInterval(() => {
      if ((window as any).paypal) {
        setIsLoaded(true);
        renderPaypalButtons();
        clearInterval(interval);
      }
    }, 500);
    return () => clearInterval(interval);
  }, [orderId, publicKey]);

  const renderPaypalButtons = () => {
    const container = document.getElementById('paypal-button-container-topup');
    if (container) container.innerHTML = '';

    (window as any).paypal
      .Buttons({
        createOrder: () => orderId,
        onApprove: async (data: any) => {
          try {
            const res = await apiRequest('POST', '/api/confirm-payment', {
              providerType: 'paypal',
              orderId: data.orderID,
            });

            const result = await res.json();
            if (result.success) {
              onSuccess();
            } else {
              throw new Error(result.message || 'Payment verification failed');
            }
          } catch (err: any) {
            onError(err.message);
          }
        },
        onError: (err: any) => {
          onError(err.message || 'PayPal error');
        },
      })
      .render('#paypal-button-container-topup');
  };

  return (
    <div className="w-full min-h-[150px] flex items-center justify-center">
      <div id="paypal-button-container-topup" className="w-full"></div>
      {!isLoaded && <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />}
    </div>
  );
}

// Paystack Top-up Component
function PaystackTopup({
  redirectUrl,
}: {
  redirectUrl: string;
}) {
  // For Paystack, we typically redirect the user
  // In a modal context, this interrupts the flow, but it's the standard Paystack flow
  return (
    <div className="text-center space-y-4">
      <Button
        onClick={() => window.location.href = redirectUrl}
        className="w-full"
      >
        Proceed to Paystack
      </Button>
      <p className="text-xs text-muted-foreground">
        You will be redirected to complete payment.
      </p>
    </div>
  );
}


// Top-up payment form component
function TopupPaymentForm({
  packageId,
  iccid,
  orderId,
  amount,
  onSuccess,
}: {
  packageId: string;
  iccid: string;
  orderId: string;
  amount: number;
  onSuccess: () => void;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const { t } = useTranslation();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        redirect: 'if_required',
      });

      if (error) {
        toast({
          title: t('myEsims.paymentFailed', 'Payment Failed'),
          description: error.message,
          variant: 'destructive',
        });
        setIsProcessing(false);
        return;
      }

      if (paymentIntent && paymentIntent.status === 'succeeded') {
        try {
          // Confirm payment on backend
          const res = await apiRequest('POST', '/api/confirm-payment', {
            providerType: 'stripe',
            paymentIntentId: paymentIntent.id,
          });

          const response = await res.json();

          // Verify backend actually created the top-up
          if (!response || !(response as any).topup) {
            throw new Error('Top-up creation failed on backend');
          }

          queryClient.invalidateQueries({ queryKey: ['/api/my-orders'] });
          queryClient.invalidateQueries({ queryKey: ['/api/user/topups'] });
          queryClient.invalidateQueries({ queryKey: ['/api/esims/' + iccid + '/usage'] });

          toast({
            title: t('myEsims.topupSuccessful', 'Top-Up Successful!'),
            description: t(
              'myEsims.topupSuccessfulDesc',
              'Your additional data has been added to your eSIM',
            ),
          });

          onSuccess();
        } catch (confirmError: any) {
          toast({
            title: t('myEsims.topupFailed', 'Top-Up Failed'),
            description:
              confirmError.message ||
              t(
                'myEsims.topupFailedDesc',
                'Payment succeeded but top-up creation failed. Please contact support.',
              ),
            variant: 'destructive',
          });
          setIsProcessing(false);
          return;
        }
      }
    } catch (err: any) {
      toast({
        title: t('myEsims.purchaseFailed', 'Purchase Failed'),
        description: err.message || t('myEsims.purchaseFailedDesc', 'Failed to purchase top-up'),
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <PaymentElement />
      <Button
        type="submit"
        className="w-full"
        disabled={!stripe || isProcessing}
      >
        {isProcessing ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {t('myEsims.processingPayment', 'Processing Payment...')}
          </>
        ) : (
          t('myEsims.payAmount', 'Pay ${{amount}}', { amount: amount.toFixed(2) })
        )}
      </Button>
    </form>
  );
}


type OrderWithDetails = Order & {
  package: UnifiedPackage & { destination?: Destination };
};

export default function MyESIMsPage() {
  const { toast } = useToast();
  const { t } = useTranslation();
  const { user } = useUser();
  const [selectedOrder, setSelectedOrder] = useState<OrderWithDetails | null>(null);
  const [showInstructions, setShowInstructions] = useState(false);
  const [showTopups, setShowTopups] = useState(false);
  const [selectedTopupPackage, setSelectedTopupPackage] = useState<any>(null);
  const [paymentConfig, setPaymentConfig] = useState<any>(null);
  const [selectedGateway, setSelectedGateway] = useState<any>(null); // New state for manual gateway selection
  const topupRequestIdRef = useRef(0);
  const [stripePromise, setStripePromise] = useState<Promise<any> | null>(null);

  const [showDetails, setShowDetails] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const copyToClipboard = async (text: string, field: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedField(field);
    toast({
      title: t('common.copied', 'Copied!'),
      description: t('myOrders.copiedToClipboard', '{{field}} copied to clipboard', { field }),
    });
    setTimeout(() => setCopiedField(null), 2000);
  };

  const formatPrice = (amount: string | number, currency = "USD") => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      minimumFractionDigits: 2,
    }).format(Number(amount));
  };

  const languages = [
    { code: "en", name: "English" },
    { code: "es", name: "Español" },
    { code: "fr", name: "Français" },
    { code: "de", name: "Deutsch" },
    { code: "it", name: "Italiano" },
    { code: "pt", name: "Português" },
    { code: "ru", name: "Русский" },
    { code: "zh", name: "中文" },
    { code: "ja", name: "日本語" },
    { code: "ko", name: "한국어" },
  ];

  const { data: orders, isLoading } = useQuery<OrderWithDetails[]>({
    queryKey: ['/api/my-orders'],
  });

  // Filter to only completed orders with ICCIDs
  const esimOrders = orders?.filter((order) => order.status === 'completed' && order.iccid);

  // Fetch eSIM details
  const { data: esimData, isLoading: esimLoading } = useQuery<{ esim: any }>({
    queryKey: [`/api/orders/${selectedOrder?.id}/esim`],
    enabled: !!selectedOrder?.id && showDetails && !!selectedOrder?.iccid,
  });

  // Fetch comprehensive eSIM info with multi-language support
  const { data: esimInfoData } = useQuery<{ info: any }>({
    queryKey: [`/api/esims/${selectedOrder?.iccid}/info/${selectedLanguage}`],
    enabled: !!selectedOrder?.iccid && showDetails,
  });

  // Fetch branded QR code
  const { data: brandedQrData } = useQuery<{ qrCode: any }>({
    queryKey: [`/api/esims/${selectedOrder?.iccid}/branded-qr`],
    enabled: !!selectedOrder?.iccid && showDetails,
  });

  // Fetch data usage for details modal
  const { data: detailsUsageData } = useQuery<{ usage: any }>({
    queryKey: ['/api/esims/' + selectedOrder?.iccid + '/usage'],
    enabled: !!selectedOrder?.iccid && showDetails,
    refetchInterval: 60000,
  });

  const esim = esimData?.esim;
  const esimInfo = esimInfoData?.info;
  const brandedQr = brandedQrData?.qrCode;
  const detailsUsage = detailsUsageData?.usage;

  // Fetch installation instructions
  const { data: instructionsData } = useQuery<{ instructions: any }>({
    queryKey: ['/api/esims/' + selectedOrder?.iccid + '/instructions'],
    enabled: !!selectedOrder?.iccid && (showInstructions || showDetails),
  });

  // Fetch top-up packages
  const { data: topupPackagesData, isLoading: isLoadingPackages } = useQuery<{ packages: any[] }>({
    queryKey: ['/api/esims/' + selectedOrder?.iccid + '/topup-packages'],
    enabled: !!selectedOrder?.iccid && showTopups,
  });

  const { data: gatewaysData } = useQuery<{ success: boolean; data: any[] }>({
    queryKey: ['/api/payments/gateways'],
    enabled: showTopups,
  });

  const instructions = instructionsData?.instructions;
  const topupPackages = topupPackagesData?.packages || [];
  // Robust gateway finding
  const gatewaysList = gatewaysData?.data || (Array.isArray(gatewaysData) ? gatewaysData : []);
  const stripeGateway = gatewaysList.find((g: any) => g.provider?.toLowerCase() === 'stripe');

  console.log('[Topup] Gateways Debug:', {
    raw: gatewaysData,
    list: gatewaysList,
    foundStripe: stripeGateway
  });

  // Create top-up payment intent when package AND gateway are selected
  useEffect(() => {
    // Wait for manual gateway selection
    if (selectedTopupPackage && selectedOrder && selectedGateway) {
      const topupId = selectedTopupPackage.id || selectedTopupPackage.package_id || selectedTopupPackage.providerPackageId;

      console.log('[Topup] Initiating for:', {
        iccid: selectedOrder.iccid,
        topupId,
        gatewayId: selectedGateway.id
      });

      // Increment request ID to track this specific request
      const currentRequestId = ++topupRequestIdRef.current;

      apiRequest('POST', '/api/payments/topup/init', {
        gatewayId: selectedGateway.id,
        packageId: selectedOrder.packageId,
        topupId,
        iccid: selectedOrder.iccid,
        orderId: selectedOrder.id,
      })
        .then((res) => res.json())
        .then((data: any) => {
          console.log('[Topup] Response:', data);

          // Only apply response if this is still the latest request
          if (currentRequestId === topupRequestIdRef.current) {

            // Handle success response (check for payment object)
            if (data?.payment) {

              // Stripe specific setup
              if (data.payment.provider === 'stripe' && data.payment.publicKey) {
                setStripePromise(loadStripe(data.payment.publicKey));
              }

              // Store config
              setPaymentConfig(data.payment);

            } else {
              console.error('[Topup] No payment config in response', data);
              toast({
                title: t('common.error', 'Error'),
                description: data?.message || t('myEsims.initializePaymentFailed', 'Failed to initialize payment'),
                variant: 'destructive',
              });
            }
          }
        })
        .catch((error: any) => {
          console.error('[Topup] Error:', error);
          if (currentRequestId === topupRequestIdRef.current) {
            toast({
              title: t('common.error', 'Error'),
              description:
                error.message ||
                t('myEsims.initializePaymentFailed', 'Failed to initialize payment'),
              variant: 'destructive',
            });
            setPaymentConfig(null);
          }
        });
    }
  }, [selectedTopupPackage, selectedOrder, selectedGateway, toast, t]);

  const handleSelectTopupPackage = (pkg: any) => {
    setSelectedTopupPackage(pkg);
    setPaymentConfig(null);
  };

  const handleTopupSuccess = () => {
    setSelectedTopupPackage(null);
    setPaymentConfig(null);
    setShowTopups(false);
  };

  return (
    <div data-testid="page-my-esims">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2 text-foreground dark:text-white">
          {t('myEsims.title', 'My eSIMs')}
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground dark:text-gray-400">
          {t('myEsims.description', 'Manage your active eSIM packages and data usage')}
        </p>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="flex items-center justify-center py-24">
          <div className="flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
            <p className="text-slate-600 dark:text-slate-400">
              {t('myEsims.loading', 'Loading your eSIMs...')}
            </p>
          </div>
        </div>
      ) : !esimOrders || esimOrders.length === 0 ? (
        <Card className="text-center py-16 dark:bg-gray-900 dark:border-gray-800">
          <CardContent className="space-y-4">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 mx-auto">
              <Smartphone className="h-10 w-10 text-slate-400 dark:text-slate-500" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                {t('myEsims.noEsims', 'No eSIMs Yet')}
              </h3>
              <p className="text-slate-600 dark:text-slate-400 mb-6">
                {t('myEsims.noEsimsDesc', 'Purchase a package to get started with your first eSIM')}
              </p>
              <Button asChild>
                <a href="/destinations">{t('myEsims.browsePackages', 'Browse Packages')}</a>
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {esimOrders.map((order) => (
            <ESimCard
              key={order.id}
              order={order}
              onViewDetails={() => {
                setSelectedOrder(order);
                setShowDetails(true);
              }}
              onViewInstructions={() => {
                setSelectedOrder(order);
                setShowInstructions(true);
              }}
              onViewTopups={() => {
                setSelectedOrder(order);
                setShowTopups(true);
              }}
            />
          ))}
        </div>
      )}

      {/* eSIM Details Modal */}
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto" data-testid="dialog-esim-details">
          <DialogHeader>
            <div className="flex items-center justify-between gap-2">
              <div>
                <DialogTitle>{t('myOrders.management', 'eSIM Management')}</DialogTitle>
                <DialogDescription>
                  Order {selectedOrder?.displayOrderId} • ICCID: {selectedOrder?.iccid}
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <Tabs defaultValue="details" className="mt-4">
            <TabsList className="flex sm:grid w-full sm:grid-cols-3 overflow-x-auto scrollbar-none justify-start whitespace-nowrap">
              <TabsTrigger value="details" data-testid="tab-details" className="flex-1 sm:flex-none">{t('myOrders.tabs.details', 'Details')}</TabsTrigger>
              <TabsTrigger value="installation" data-testid="tab-installation" className="flex-1 sm:flex-none">{t('myOrders.tabs.installation', 'Installation')}</TabsTrigger>
              <TabsTrigger value="usage" data-testid="tab-usage" className="flex-1 sm:flex-none">{t('myOrders.tabs.usage', 'Usage')}</TabsTrigger>
            </TabsList>

            {/* Details Tab */}
            <TabsContent value="details" className="space-y-4 mt-4">
              <div className="flex items-center gap-2 mb-4">
                <Globe className="h-4 w-4" />
                <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                  <SelectTrigger className="w-48" data-testid="select-language">
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    {languages.map(lang => (
                      <SelectItem key={lang.code} value={lang.code}>
                        {lang.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {esimLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
                </div>
              ) : esim ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-semibold flex items-center gap-2">
                          <Signal className="h-4 w-4 text-orange-500" />
                          Connection Status
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 border-b pb-2">
                          <span className="text-sm text-muted-foreground">ICCID</span>
                          <div className="flex items-center gap-2 max-w-full min-w-0">
                            <span className="font-mono text-xs font-semibold break-all">{esim.iccid || selectedOrder?.iccid}</span>
                            <Button variant="ghost" size="icon" className="h-6 w-6 flex-shrink-0" onClick={() => copyToClipboard(esim.iccid || selectedOrder?.iccid || "", "ICCID")}>
                              <Copy className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                        <div className="flex justify-between items-center border-b pb-2">
                          <span className="text-sm text-muted-foreground">{t('myOrders.statusLabel', 'Status')}</span>
                          <Badge variant={esim.status === 'activated' ? 'default' : 'secondary'} className="capitalize">
                            {esim.status || 'Active'}
                          </Badge>
                        </div>
                        {esim.imsis && (
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">IMSI</span>
                            <span className="text-xs font-mono">{Array.isArray(esim.imsis) ? esim.imsis[0] : esim.imsis}</span>
                          </div>
                        )}
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-semibold flex items-center gap-2">
                          <Plus className="h-4 w-4 text-orange-500" />
                          Configuration
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex justify-between items-center border-b pb-2">
                          <span className="text-sm text-muted-foreground">APN Type</span>
                          <Badge variant="outline" className="text-[10px]">{esim.apn_type || 'Default'}</Badge>
                        </div>
                        <div className="flex justify-between items-center border-b pb-2">
                          <span className="text-sm text-muted-foreground">APN Value</span>
                          <span className="text-xs font-medium">{esim.apn_value || 'internet'}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">Data Roaming</span>
                          <Badge variant={esim.is_roaming !== false ? "default" : "secondary"} className="text-[10px]">
                            {esim.is_roaming !== false ? "Required" : "Not Required"}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="md:col-span-2">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-semibold flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-orange-500" />
                          Lifecycle Information
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="space-y-1">
                            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Purchased</p>
                            <p className="text-sm font-medium">{selectedOrder ? new Date(selectedOrder.createdAt).toLocaleDateString() : ''}</p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Activated</p>
                            <p className="text-sm font-medium">
                              {esim.activation_date ? new Date(esim.activation_date).toLocaleDateString() : 'Pending first use'}
                            </p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Expires</p>
                            <p className="text-sm font-medium">
                              {esim.expired_at ? new Date(esim.expired_at).toLocaleDateString() : 'N/A'}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {(esim.shortUrl || selectedOrder?.shortUrl) && (
                      <Card className="md:col-span-2 bg-orange-50 dark:bg-orange-950/20 border-orange-200 dark:border-orange-800">
                        <CardContent className="pt-6">
                           <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                              <div className="flex items-center gap-3">
                                <Zap className="h-8 w-8 text-orange-500" />
                                <div>
                                  <h4 className="font-bold text-orange-900 dark:text-orange-100">Quick Installation Tool</h4>
                                  <p className="text-xs text-orange-700 dark:text-orange-300">Click to automatically start setup on your device</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2 w-full md:w-auto">
                                <Button 
                                  className="flex-1 md:flex-none bg-orange-500 hover:bg-orange-600 text-white shadow-md"
                                  onClick={(e) => { e.stopPropagation(); window.open(esim.shortUrl || selectedOrder?.shortUrl, '_blank'); }}
                                >
                                  <Zap className="h-4 w-4 mr-2" />
                                  Install Now
                                </Button>
                                <Button
                                  variant="outline"
                                  size="icon"
                                  onClick={(e) => { e.stopPropagation(); copyToClipboard(esim.shortUrl || selectedOrder?.shortUrl || "", "Link"); }}
                                >
                                   {copiedField === "Link" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                                </Button>
                              </div>
                           </div>
                        </CardContent>
                      </Card>
                    )}
                  </div>

                  {esim.package && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-sm font-bold">
                          <Package className="h-5 w-5" />
                          Package Details
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="grid gap-3">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="col-span-2">
                            <p className="text-sm text-muted-foreground">{t('myOrders.packageName', 'Package Name')}</p>
                            <p className="font-medium" data-testid="text-package">
                              {esim.package.title || `${esim.package.data || ''} - ${esim.package.validity || ''} Days`}
                            </p>
                          </div>
                          {esim.package.id && (
                            <div className="col-span-2">
                              <p className="text-sm text-muted-foreground">{t('myOrders.packageId', 'Package ID')}</p>
                              <p className="text-xs font-mono break-all">{esim.package.id}</p>
                            </div>
                          )}
                          {esim.package.data && (
                            <div>
                              <p className="text-sm text-muted-foreground">Data</p>
                              <p className="font-medium">{esim.package.data}</p>
                            </div>
                          )}
                          {esim.package.validity && (
                            <div>
                              <p className="text-sm text-muted-foreground">{t('myOrders.validity', 'Validity')}</p>
                              <p className="font-medium">{esim.package.validity} days</p>
                            </div>
                          )}
                          {esim.package.price && (
                            <div>
                              <p className="text-sm text-muted-foreground">Price</p>
                              <p className="font-medium">${esim.package.price}</p>
                            </div>
                          )}
                          {esim.package.operator && (
                            <div>
                              <p className="text-sm text-muted-foreground">Operator</p>
                              <p className="font-medium">{typeof esim.package.operator === 'string' ? esim.package.operator : esim.package.operator?.name || 'N/A'}</p>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {esimInfo && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-sm font-bold">
                          <Globe className="h-5 w-5" />
                          Comprehensive Info ({languages.find(l => l.code === selectedLanguage)?.name})
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3 text-sm">
                          {esimInfo.description && (
                            <div>
                              <p className="font-medium text-muted-foreground">Description</p>
                              <p>{esimInfo.description}</p>
                            </div>
                          )}
                          {esimInfo.operator && (
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <p className="font-medium text-muted-foreground">Operator</p>
                                <p>{esimInfo.operator.name || 'N/A'}</p>
                              </div>
                              {esimInfo.operator.country && (
                                <div>
                                  <p className="font-medium text-muted-foreground">Country</p>
                                  <p>{esimInfo.operator.country}</p>
                                </div>
                              )}
                            </div>
                          )}
                          {esimInfo.coverage && (
                            <div>
                              <p className="font-medium text-muted-foreground">Coverage</p>
                              <p>{esimInfo.coverage}</p>
                            </div>
                          )}
                          {esimInfo.fair_usage_policy && (
                            <div>
                              <p className="font-medium text-muted-foreground">Fair Usage Policy</p>
                              <p>{esimInfo.fair_usage_policy}</p>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {selectedOrder && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-sm font-bold">
                          <Signal className="h-5 w-5" />
                          Order Details
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="grid gap-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-muted-foreground">Order Status</p>
                            <Badge variant={selectedOrder.status === 'completed' ? 'default' : 'secondary'}>
                              {selectedOrder.status}
                            </Badge>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Price Paid</p>
                            <p className="font-medium">
                              {(selectedOrder.giftCardTransactions?.length > 0 || selectedOrder.voucherUsage?.length > 0 || selectedOrder.referralTransactions?.length > 0) ? (
                                <span className="text-green-600 dark:text-green-400">
                                  {formatPrice(
                                    Math.max(0,
                                      Number(selectedOrder.price) -
                                      (selectedOrder.giftCardTransactions?.reduce((acc: number, t: any) => acc + Number(t.amountUsed), 0) || 0) -
                                      (selectedOrder.voucherUsage?.reduce((acc: number, v: any) => acc + Number(v.discountAmount), 0) || 0) -
                                      (selectedOrder.referralTransactions?.reduce((acc: number, r: any) => acc + Number(r.amount), 0) || 0)
                                    ),
                                    selectedOrder.currency || selectedOrder.orderCurrency
                                  )}
                                </span>
                              ) : (
                                formatPrice(selectedOrder.price, selectedOrder.currency || selectedOrder.orderCurrency)
                              )}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <p>Failed to load eSIM details</p>
                </div>
              )}
            </TabsContent>

            {/* Installation Tab */}
            <TabsContent value="installation" className="space-y-4 mt-4">
              {instructions ? (
                <>
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-sm font-bold">
                        <QrCode className="h-5 w-5" />
                        QR Code Installation
                      </CardTitle>
                      <CardDescription>
                        Scan this QR code with your device to install the eSIM
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center gap-4">
                      {(brandedQr?.qr_code || instructions.qr_code) && (
                        <div className="p-4 bg-white rounded-lg">
                          <img
                            src={brandedQr?.qr_code || instructions.qr_code}
                            alt="eSIM QR Code"
                            className="w-64 h-64"
                            data-testid="img-qr-code"
                          />
                          {brandedQr?.qr_code && (
                            <p className="text-xs text-center text-muted-foreground mt-2">{t('myOrders.brandedQRCode', 'Branded QR Code')}</p>
                          )}
                        </div>
                      )}

                      {(esim?.shortUrl || selectedOrder?.shortUrl) && (
                        <div className="w-full p-4 bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-900 rounded-lg">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="bg-orange-500 p-2 rounded-full">
                              <Zap className="h-5 w-5 text-white" />
                            </div>
                            <div>
                              <h4 className="font-semibold text-orange-900 dark:text-orange-100">Quick Installation</h4>
                              <p className="text-sm text-orange-700 dark:text-orange-300">Fastest way to set up your eSIM</p>
                            </div>
                          </div>
                          <Button 
                            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-6 text-lg shadow-lg shadow-orange-500/20"
                            onClick={(e) => { e.stopPropagation(); window.open(esim?.shortUrl || selectedOrder?.shortUrl, '_blank'); }}
                          >
                            <Zap className="h-6 w-6 mr-2 fill-white" />
                            Install eSIM Now
                          </Button>
                          <p className="text-xs text-center text-orange-600 dark:text-orange-400 mt-3">
                            * Recommended for iOS and compatible Android devices
                          </p>
                        </div>
                      )}

                      {instructions.manual_code && (
                        <div className="w-full space-y-2">
                          <p className="text-sm font-medium">{t('myOrders.manualActivationCode', 'Manual Activation Code:')}</p>
                          <div className="flex items-center gap-2">
                            <code className="flex-1 p-3 bg-muted rounded-md text-sm font-mono break-all" data-testid="text-manual-code">
                              {instructions.manual_code}
                            </code>
                            <Button
                              variant="outline"
                              size="icon"
                              className="flex-shrink-0"
                              onClick={(e) => { e.stopPropagation(); copyToClipboard(instructions.manual_code, "manual_code"); }}
                              data-testid="button-copy-code"
                            >
                              {copiedField === "manual_code" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                            </Button>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {instructions.steps && instructions.steps.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm font-bold">Installation Steps</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ol className="space-y-3">
                          {instructions.steps.map((step: string, index: number) => (
                            <li key={index} className="flex gap-3" data-testid={`text-step-${index}`}>
                              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-orange-500 text-white text-sm font-medium">
                                {index + 1}
                              </span>
                              <span className="pt-0.5">{step}</span>
                            </li>
                          ))}
                        </ol>
                      </CardContent>
                    </Card>
                  )}

                  {instructions.device_compatibility && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm font-bold">{t('myOrders.deviceCompatibility', 'Device Compatibility')}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center gap-2">
                          <Badge variant={instructions.device_compatibility.compatible ? 'default' : 'destructive'}>
                            {instructions.device_compatibility.compatible ? 'Compatible' : 'Not Compatible'}
                          </Badge>
                          {instructions.device_compatibility.requirements && (
                            <p className="text-sm text-muted-foreground">
                              {instructions.device_compatibility.requirements}
                            </p>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </>
              ) : (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
                </div>
              )}
            </TabsContent>

            {/* Usage Tab */}
            <TabsContent value="usage" className="space-y-4 mt-4">
              {detailsUsage ? (
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2 text-sm font-bold">
                        <Database className="h-5 w-5" />{t('myOrders.dataUsage', 'Data Usage')}</CardTitle>
                      <CardDescription>{t('myOrders.usageTracking', 'Real-time consumption tracking and validity details')}</CardDescription>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`
                                   px-3 py-1 text-xs rounded-full font-medium
                                   ${detailsUsage.status === "active" ? "bg-green-100 text-green-700 border border-green-300"
                            : "bg-red-100 text-red-700 border border-red-300"}
                                 `}
                      >
                        {detailsUsage.status === "active" ? "Active" : "Inactive"}
                      </span>

                      {detailsUsage.isUnlimited && (
                        <span className="px-3 py-1 text-xs rounded-full font-medium bg-blue-100 text-blue-700 border border-blue-300">{t('myOrders.unlimitedPlan', 'Unlimited Plan')}</span>
                      )}
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">{t('myOrders.dataUsed', 'Data Used')}</span>
                        <span className="font-semibold">
                          {detailsUsage.dataUsed || "N/A"} MB / {detailsUsage.dataTotal || "N/A"} MB
                        </span>
                      </div>

                      <Progress
                        value={detailsUsage.percentageUsed || 0}
                        className="h-2"
                      />

                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>{detailsUsage.dataRemaining} MB remaining</span>
                        <span>{detailsUsage.percentageUsed?.toFixed(1)}% used</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t">
                      <div className="p-4 rounded-lg border bg-muted/30 min-w-0">
                        <p className="text-xs text-muted-foreground">ICCID</p>
                        <p className="text-sm font-semibold break-all">{detailsUsage.iccid || "N/A"}</p>
                      </div>

                      <div className="p-4 rounded-lg border bg-muted/30 min-w-0">
                        <p className="text-xs text-muted-foreground">{t('myOrders.validity', 'Validity')}</p>
                        <p className="text-sm font-semibold">
                          {detailsUsage.expiresAt ? new Date(detailsUsage.expiresAt).toLocaleDateString() : "N/A"}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

      {/* Installation Instructions Modal */}
      <Dialog open={showInstructions} onOpenChange={setShowInstructions}>
        <DialogContent
          className="sm:max-w-2xl w-full max-h-[90vh] flex flex-col p-0 gap-0 border-none bg-background top-[25%] right-0 rounded-b-2xl rounded-t-none data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top"
          data-testid="dialog-installation-instructions"
        >
          <div className="p-4 sm:p-6 pb-2 sm:pb-4 border-b">
            <DialogHeader className="p-0">
              <DialogTitle className="text-lg sm:text-xl">
                {t('myEsims.installationInstructions', 'Installation Instructions')}
              </DialogTitle>
              <DialogDescription className="text-sm sm:text-base">
                {t(
                  'myEsims.installationInstructionsDesc',
                  'Follow these steps to activate your eSIM',
                )}
              </DialogDescription>
            </DialogHeader>
          </div>

          <div className="flex-1 overflow-y-auto p-4 sm:p-6 pt-2 sm:pt-4">
            {instructions ? (
              <div className="space-y-4 sm:space-y-6">
                {instructions.qr_code && (
                  <div className="flex flex-col items-center gap-3 sm:gap-4 p-4 sm:p-6 bg-muted rounded-lg">
                    <h3 className="font-semibold text-sm sm:text-base">
                      {t('myEsims.scanQRCode', 'Scan QR Code')}
                    </h3>
                    <div className="p-3 sm:p-4 bg-white rounded-lg w-full max-w-[200px] sm:max-w-xs">
                      <img
                        src={instructions.qr_code}
                        alt="eSIM QR Code"
                        className="w-full h-auto aspect-square"
                        data-testid="img-qr-code"
                      />
                    </div>
                  </div>
                )}

                {instructions.steps && instructions.steps.length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-3 sm:mb-4 text-sm sm:text-base">
                      {t('myEsims.stepByStepGuide', 'Step-by-Step Guide')}
                    </h3>
                    <ol className="space-y-2 sm:space-y-3">
                      {instructions.steps.map((step: string, index: number) => (
                        <li key={index} className="flex gap-2 sm:gap-3 items-start">
                          <span className="flex h-5 w-5 sm:h-6 sm:w-6 shrink-0 items-center justify-center rounded-full bg-orange-500 text-white text-xs sm:text-sm font-medium">
                            {index + 1}
                          </span>
                          <span className="pt-0.5 text-sm sm:text-base leading-relaxed">
                            {step}
                          </span>
                        </li>
                      ))}
                    </ol>
                  </div>
                )}

                {instructions.manual_code && (
                  <div>
                    <h3 className="font-semibold mb-2 text-sm sm:text-base">
                      {t('myEsims.manualActivationCode', 'Manual Activation Code')}
                    </h3>
                    <code className="block p-3 sm:p-4 bg-muted rounded-md text-xs sm:text-sm font-mono break-all">
                      {instructions.manual_code}
                    </code>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="mt-2 text-orange-500 hover:text-orange-600"
                      onClick={() => {
                        navigator.clipboard?.writeText(instructions.manual_code);
                      }}
                    >
                      {t('common.copy', 'Copy code')}
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center justify-center py-8 sm:py-12">
                <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-orange-500"></div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Top-Up Purchase Modal */}
      <Dialog
        open={showTopups}
        onOpenChange={(open) => {
          setShowTopups(open);
          if (!open) {
            setSelectedTopupPackage(null);
            setSelectedGateway(null);
            setPaymentConfig(null);
          }
        }}
      >
        <DialogContent className="sm:max-w-xl w-full max-h-[90vh] flex flex-col p-0 gap-0 top-[25%] border-none bg-background" data-testid="dialog-topup-packages">
          <div className="p-6 pb-4">
            <DialogHeader>
              <DialogTitle>
                {selectedTopupPackage
                  ? t('myEsims.completePayment', 'Complete Payment')
                  : t('myEsims.purchaseTopup', 'Purchase Top-Up')}
              </DialogTitle>
              <DialogDescription>
                {selectedTopupPackage
                  ? t('myEsims.securelyPay', 'Securely pay for your top-up')
                  : t('myEsims.addMoreData', 'Add more data to your eSIM')}
              </DialogDescription>
            </DialogHeader>
          </div>

          <div className="flex-1 overflow-y-auto p-6 pt-0">
            {selectedTopupPackage ? (
              <div className="space-y-4">
                <div className="p-4 bg-muted rounded-lg">
                  <h3 className="font-medium mb-2">
                    {selectedTopupPackage.title ||
                      `${selectedTopupPackage.data} - ${selectedTopupPackage.validity} Days`}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {selectedTopupPackage.data} • {selectedTopupPackage.validity} days validity
                  </p>
                  <p className="text-2xl font-bold mt-2">
                    ${selectedTopupPackage.customer_price || selectedTopupPackage.price}
                  </p>
                </div>

                {!selectedGateway ? (
                  /* Step 2: Gateway Selection */
                  <div className="space-y-3">
                    <h4 className="font-medium">Select Payment Method</h4>
                    {gatewaysList && gatewaysList.length > 0 ? (
                      gatewaysList.map((gateway: any) => (
                        <div
                          key={gateway.id}
                          onClick={() => setSelectedGateway(gateway)}
                          className="flex items-center justify-between p-4 border rounded-lg cursor-pointer hover:bg-muted transition-colors"
                        >
                          <span className="font-medium">{gateway.displayName || gateway.provider}</span>
                          <Button variant="ghost" size="sm">Select</Button>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground">No payment methods available.</p>
                    )}
                    <Button
                      variant="outline"
                      className="w-full mt-4"
                      onClick={() => {
                        setSelectedTopupPackage(null); // Go back to Step 1
                      }}
                    >
                      {t('myEsims.backToPackages', 'Back to Packages')}
                    </Button>
                  </div>
                ) : (
                  /* Step 3: Payment Form */
                  <>
                    {!paymentConfig ? (
                      <div className="flex items-center justify-center py-12">
                        <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
                        <p className="ml-2 text-sm text-muted-foreground">Initializing payment...</p>
                      </div>
                    ) : selectedGateway.provider === 'stripe' ? (
                      <Elements
                        key={paymentConfig.clientSecret}
                        stripe={stripePromise}
                        options={{
                          clientSecret: paymentConfig.clientSecret,
                          appearance: {
                            theme: 'stripe',
                          },
                        }}
                      >
                        <TopupPaymentForm
                          packageId={selectedTopupPackage.id || selectedTopupPackage.package_id}
                          iccid={selectedOrder!.iccid!}
                          orderId={selectedOrder!.id}
                          amount={parseFloat(
                            selectedTopupPackage.customer_price || selectedTopupPackage.price,
                          )}
                          onSuccess={handleTopupSuccess}
                        />
                      </Elements>
                    ) : selectedGateway.provider === 'razorpay' ? (
                      <RazorpayTopup
                        orderId={paymentConfig.orderId}
                        amount={paymentConfig.amount}
                        currency={paymentConfig.currency}
                        publicKey={paymentConfig.publicKey}
                        email={user?.email}
                        onSuccess={handleTopupSuccess}
                        onError={(msg) => toast({ title: "Payment Error", description: msg, variant: "destructive" })}
                      />
                    ) : selectedGateway.provider === 'paypal' ? (
                      <PaypalTopup
                        orderId={paymentConfig.orderId}
                        amount={paymentConfig.amount}
                        currency={paymentConfig.currency}
                        publicKey={paymentConfig.publicKey}
                        onSuccess={handleTopupSuccess}
                        onError={(msg) => toast({ title: "Payment Error", description: msg, variant: "destructive" })}
                      />
                    ) : selectedGateway.provider === 'paystack' ? (
                      <PaystackTopup
                        redirectUrl={paymentConfig.redirectUrl}
                      />
                    ) : (
                      <div className="text-center py-8">
                        <p>Selected Gateway: {selectedGateway.displayName}</p>
                        <p className="text-sm text-muted-foreground">Provider not supported yet.</p>
                      </div>
                    )}

                    <Button
                      variant="outline"
                      className="w-full mt-4"
                      onClick={() => {
                        setSelectedGateway(null); // Go back to Step 2
                        setPaymentConfig(null);
                      }}
                    >
                      Back to Payment Methods
                    </Button>
                  </>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {isLoadingPackages ? (
                  <div className="flex flex-col items-center justify-center py-12 space-y-4">
                    <Loader2 className="h-10 w-10 animate-spin text-primary" />
                    <p className="text-sm text-muted-foreground">
                      {t('myEsims.loadingPackages', 'Loading available top-up packages...')}
                    </p>
                  </div>
                ) : topupPackages.length > 0 ? (
                  topupPackages.map((pkg: any, index: number) => (
                    <div
                      key={index}
                      className="flex flex-col sm:flex-row justify-between sm:items-center p-4 rounded-xl border border-border bg-card hover:border-primary/50 transition-all cursor-pointer shadow-sm hover:shadow-md"
                      onClick={() => handleSelectTopupPackage(pkg)}
                      data-testid={`card-topup-${index}`}
                    >
                      <div className="mb-3 sm:mb-0">
                        <h3 className="font-medium text-foreground">
                          {pkg.title ||
                            `${pkg.data} - ${pkg.validity} ${t('common.days', 'Days')}`}
                        </h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          {pkg.data} • {pkg.validity} {t('myEsims.daysValidity', 'days validity')}
                        </p>
                      </div>
                      <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto">
                        <p className="text-lg font-bold text-foreground">${pkg.customer_price || pkg.price}</p>
                        <Button
                          size="sm"
                          data-testid={`button-select-topup-${index}`}
                        >
                          {t('myEsims.select', 'Select')}
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12 text-muted-foreground col-span-1">
                    <Plus className="mx-auto h-12 w-12 mb-4 opacity-50" />
                    <p>{t('myEsims.noTopupPackages', 'No top-up packages available')}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function ESimCard({
  order,
  onViewDetails,
  onViewInstructions,
  onViewTopups,
}: {
  order: OrderWithDetails;
  onViewDetails: () => void;
  onViewInstructions: () => void;
  onViewTopups: () => void;
}) {
  const { t } = useTranslation();

  const { data: usageData, isLoading } = useQuery<{ usage: any }>({
    queryKey: ['/api/esims/' + order.iccid + '/usage'],
    enabled: !!order.iccid,
    refetchInterval: 60000,
  });

  const usage = usageData?.usage;

  const formatData = (mb?: number) => {
    if (mb === undefined || mb === null) return 'N/A';
    if (mb >= 1024) return `${(mb / 1024).toFixed(2)} GB`;
    return `${mb} MB`;
  };


  const status =
    usage?.status === 'active' || (order as any).esimStatus === 'active'
      ? 'active'
      : usage?.status === 'expired' || (usage?.expiresAt && new Date(usage.expiresAt) < new Date()) || (order as any).esimStatus === 'expired'
        ? 'expired'
        : 'inactive';


  return (
    <Card className="hover-elevate h-full dark:bg-gray-900 dark:border-gray-800 cursor-pointer" onClick={onViewDetails} data-testid={`card-esim-${order.id}`}>
      <CardHeader>
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden bg-muted dark:bg-gray-800 flex items-center justify-center flex-shrink-0 border-2 border-gray-100 dark:border-gray-700">
            {order.package?.destination?.countryCode ? (
              <img
                src={`https://flagcdn.com/${order.package.destination.countryCode.toLowerCase()}.svg`}
                alt={order.package.destination.name || 'Flag'}
                className="w-full h-full object-cover"
              />
            ) : (
              <Globe className="w-5 h-5 sm:w-6 sm:h-6 text-muted-foreground" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg font-bold flex flex-col gap-1 dark:text-white">
              <span className="truncate">{order.package?.destination?.name || 'eSIM'}</span>
              <span className="text-sm font-normal text-muted-foreground dark:text-gray-400 truncate">
                {order.package?.title || `${order.dataAmount || ''} - ${order.validity || ''} Days`}
              </span>
            </CardTitle>
          </div>
          <div className="flex-shrink-0 self-start">
            <Badge
              variant={
                status === 'active' ? 'default' : status === 'expired' ? 'destructive' : 'secondary'
              }
            >
              {status === 'active'
                ? t('myEsims.active', 'Active')
                : status === 'expired'
                  ? t('myEsims.expired', 'Expired')
                  : t('myEsims.inactive', 'Inactive')}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* ICCID */}
        <div>
          <p className="text-xs text-muted-foreground dark:text-gray-400">ICCID</p>
          <p className="text-sm font-mono mt-1 break-all dark:text-gray-200" data-testid="text-iccid">
            {order.iccid || 'N/A'}
          </p>
        </div>

        {/* Loading Skeleton */}
        {isLoading && (
          <div className="space-y-2">
            <div className="h-4 bg-muted dark:bg-gray-800 rounded animate-pulse" />
            <div className="h-2 bg-muted dark:bg-gray-800 rounded animate-pulse" />
          </div>
        )}

        {/* Usage Section */}
        {!isLoading && usage && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground dark:text-gray-400">{t('myEsims.dataUsed', 'Data Used')}</span>

              <span className="font-medium dark:text-gray-200" data-testid="text-data-usage">
                {formatData(usage.dataUsed)} / {formatData(usage.dataTotal)}
              </span>
            </div>

            <Progress value={usage.percentageUsed ?? 0} />

            <div className="flex justify-between text-xs text-muted-foreground dark:text-gray-400">
              <span>
                {(usage.percentageUsed ?? 0).toFixed(1)}% {t('myEsims.used', 'used')}
              </span>

              <span>
                {formatData(usage.dataRemaining)} {t('myEsims.remaining', 'remaining')}
              </span>
            </div>

            {usage.expiresAt && (
              <p className="text-xs text-right text-muted-foreground dark:text-gray-400">
                {t('myEsims.validUntil', 'Valid until')}{' '}
                <span className="font-medium dark:text-gray-200">
                  {new Date(usage.expiresAt).toLocaleDateString()}
                </span>
              </p>
            )}
          </div>
        )}

        {/* Quick Setup Button */}
        {order.shortUrl && (
          <Button
            className="bg-orange-500 hover:bg-orange-600 text-white w-full"
            size="sm"
            onClick={(e) => { e.stopPropagation(); window.open(order.shortUrl, '_blank'); }}
            data-testid={`button-quick-setup-${order.id}`}
          >
            <Zap className="h-4 w-4 mr-2" />
            {t('myEsims.quickSetup', 'Quick Setup')}
          </Button>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1 dark:border-gray-700 dark:hover:bg-gray-800 dark:text-gray-300"
            onClick={(e) => { e.stopPropagation(); onViewInstructions(); }}
            data-testid="button-view-instructions"
          >
            <QrCode className="mr-2 h-4 w-4" />
            {t('myEsims.setup', 'Setup')}
          </Button>

          <Button
            size="sm"
            className="flex-1"
            onClick={(e) => { e.stopPropagation(); onViewTopups(); }}
            disabled={isLoading || status === 'inactive' || status === 'expired'}
            data-testid="button-purchase-topup"
          >
            <Plus className="mr-2 h-4 w-4" />
            {t('myEsims.topUp', 'Top Up')}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}