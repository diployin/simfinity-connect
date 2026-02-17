import { useState, useEffect, useRef } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Smartphone, QrCode, Plus, Loader2 } from 'lucide-react';
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

// Initialize Stripe only if key is available
const stripePublicKey = import.meta.env.VITE_STRIPE_PUBLIC_KEY;
const stripePromise = stripePublicKey ? loadStripe(stripePublicKey) : null;

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
          const response = await apiRequest('POST', '/api/confirm-payment', {
            paymentIntentId: paymentIntent.id,
          });

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
        className="w-full bg-[#2c7338] hover:bg-[#1e5427] text-white"
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
  const [selectedOrder, setSelectedOrder] = useState<OrderWithDetails | null>(null);
  const [showInstructions, setShowInstructions] = useState(false);
  const [showTopups, setShowTopups] = useState(false);
  const [selectedTopupPackage, setSelectedTopupPackage] = useState<any>(null);
  const [topupClientSecret, setTopupClientSecret] = useState('');
  const topupRequestIdRef = useRef(0);

  const { data: orders, isLoading } = useQuery<OrderWithDetails[]>({
    queryKey: ['/api/my-orders'],
  });

  // Filter to only completed orders with ICCIDs
  const esimOrders = orders?.filter((order) => order.status === 'completed' && order.iccid);

  // Fetch installation instructions
  const { data: instructionsData } = useQuery<{ instructions: any }>({
    queryKey: ['/api/esims/' + selectedOrder?.iccid + '/instructions'],
    enabled: !!selectedOrder?.iccid && showInstructions,
  });

  // Fetch top-up packages
  const { data: topupPackagesData } = useQuery<{ packages: any[] }>({
    queryKey: ['/api/esims/' + selectedOrder?.iccid + '/topup-packages'],
    enabled: !!selectedOrder?.iccid && showTopups,
  });

  const instructions = instructionsData?.instructions;
  const topupPackages = topupPackagesData?.packages || [];

  // Create top-up payment intent when package is selected
  useEffect(() => {
    if (selectedTopupPackage && selectedOrder) {
      // Increment request ID to track this specific request
      const currentRequestId = ++topupRequestIdRef.current;

      setTopupClientSecret(''); // Clear old secret immediately

      apiRequest('POST', '/api/create-topup-payment-intent', {
        packageId: selectedTopupPackage.id,
        iccid: selectedOrder.iccid,
        orderId: selectedOrder.id,
      })
        .then((data: any) => {
          // Only apply response if this is still the latest request
          if (currentRequestId === topupRequestIdRef.current) {
            setTopupClientSecret(data.clientSecret);
          }
        })
        .catch((error: any) => {
          // Only show error if this is still the latest request
          if (currentRequestId === topupRequestIdRef.current) {
            toast({
              title: t('common.error', 'Error'),
              description:
                error.message ||
                t('myEsims.initializePaymentFailed', 'Failed to initialize payment'),
              variant: 'destructive',
            });
            setTopupClientSecret(''); // Ensure secret is cleared on error
            setSelectedTopupPackage(null);
          }
        });
    }
  }, [selectedTopupPackage, selectedOrder, toast, t]);

  const handleSelectTopupPackage = (pkg: any) => {
    setSelectedTopupPackage(pkg);
    setTopupClientSecret('');
  };

  const handleTopupSuccess = () => {
    setSelectedTopupPackage(null);
    setTopupClientSecret('');
    setShowTopups(false);
  };

  return (
    <div data-testid="page-my-esims">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 text-foreground">
          {t('myEsims.title', 'My eSIMs')}
        </h1>
        <p className="text-muted-foreground">
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
        <Card className="text-center py-16">
          <CardContent className="space-y-4">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 mx-auto">
              <Smartphone className="h-10 w-10 text-slate-400" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                {t('myEsims.noEsims', 'No eSIMs Yet')}
              </h3>
              <p className="text-slate-600 dark:text-slate-400 mb-6">
                {t('myEsims.noEsimsDesc', 'Purchase a package to get started with your first eSIM')}
              </p>
              <Button asChild className="bg-[#2c7338] hover:bg-[#1e5427] text-white">
                <a href="/destinations">{t('myEsims.browsePackages', 'Browse Packages')}</a>
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {esimOrders.map((order) => (
            <ESimCard
              key={order.id}
              order={order}
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

      {/* Installation Instructions Modal */}
      <Dialog open={showInstructions} onOpenChange={setShowInstructions}>
        <DialogContent className="max-w-2xl" data-testid="dialog-installation-instructions">
          <DialogHeader>
            <DialogTitle>
              {t('myEsims.installationInstructions', 'Installation Instructions')}
            </DialogTitle>
            <DialogDescription>
              {t(
                'myEsims.installationInstructionsDesc',
                'Follow these steps to activate your eSIM',
              )}
            </DialogDescription>
          </DialogHeader>

          {instructions ? (
            <div className="space-y-6">
              {instructions.qr_code && (
                <div className="flex flex-col items-center gap-4 p-6 bg-muted rounded-lg">
                  <h3 className="font-semibold">{t('myEsims.scanQRCode', 'Scan QR Code')}</h3>
                  <div className="p-4 bg-white rounded-lg">
                    <img
                      src={instructions.qr_code}
                      alt="eSIM QR Code"
                      className="w-64 h-64"
                      data-testid="img-qr-code"
                    />
                  </div>
                </div>
              )}

              {instructions.steps && instructions.steps.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-4">
                    {t('myEsims.stepByStepGuide', 'Step-by-Step Guide')}
                  </h3>
                  <ol className="space-y-3">
                    {instructions.steps.map((step: string, index: number) => (
                      <li key={index} className="flex gap-3">
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-orange-500 text-white text-sm font-medium">
                          {index + 1}
                        </span>
                        <span className="pt-0.5">{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              )}

              {instructions.manual_code && (
                <div>
                  <h3 className="font-semibold mb-2">
                    {t('myEsims.manualActivationCode', 'Manual Activation Code')}
                  </h3>
                  <code className="block p-3 bg-muted rounded-md text-sm font-mono break-all">
                    {instructions.manual_code}
                  </code>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Top-Up Purchase Modal */}
      <Dialog
        open={showTopups}
        onOpenChange={(open) => {
          setShowTopups(open);
          if (!open) {
            setSelectedTopupPackage(null);
            setTopupClientSecret('');
          }
        }}
      >
        <DialogContent className="sm:max-w-xl w-full max-h-[90vh] flex flex-col p-0 gap-0 border-none bg-background" data-testid="dialog-topup-packages">
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

                {!topupClientSecret ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
                  </div>
                ) : (
                  <Elements
                    key={topupClientSecret}
                    stripe={stripePromise}
                    options={{
                      clientSecret: topupClientSecret,
                      appearance: {
                        theme: 'stripe',
                      },
                    }}
                  >
                    <TopupPaymentForm
                      packageId={selectedTopupPackage.id}
                      iccid={selectedOrder!.iccid!}
                      orderId={selectedOrder!.id}
                      amount={parseFloat(
                        selectedTopupPackage.customer_price || selectedTopupPackage.price,
                      )}
                      onSuccess={handleTopupSuccess}
                    />
                  </Elements>
                )}

                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    setSelectedTopupPackage(null);
                    setTopupClientSecret('');
                  }}
                >
                  {t('myEsims.backToPackages', 'Back to Packages')}
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {topupPackages.length > 0 ? (
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
                          className="bg-[#2c7338] hover:bg-[#1e5427] text-white"
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
  onViewInstructions,
  onViewTopups,
}: {
  order: OrderWithDetails;
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
    usage?.status === 'active'
      ? 'active'
      : usage?.expiresAt && new Date(usage.expiresAt) < new Date()
        ? 'expired'
        : 'inactive';

  return (
    <Card className="hover-elevate" data-testid={`card-esim-${order.id}`}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg font-bold flex flex-col gap-1">
              <span>{order.package?.destination?.name || 'eSIM'}</span>
              <span className="text-sm font-normal text-muted-foreground">
                {order.package?.title || `${order.dataAmount || ''} - ${order.validity || ''} Days`}
              </span>
            </CardTitle>
            {/* <div className="font-semibold text-primary mt-2">{order.dataAmount}</div>
            <CardDescription className="mt-1">
              {order.validity} {t('myEsims.daysValidity', 'days validity')}
            </CardDescription> */}
          </div>

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
      </CardHeader>

      <CardContent className="space-y-4">
        {/* ICCID */}
        <div>
          <p className="text-xs text-muted-foreground">ICCID</p>
          <p className="text-sm font-mono mt-1" data-testid="text-iccid">
            {order.iccid || 'N/A'}
          </p>
        </div>

        {/* Loading Skeleton */}
        {isLoading && (
          <div className="space-y-2">
            <div className="h-4 bg-muted rounded animate-pulse" />
            <div className="h-2 bg-muted rounded animate-pulse" />
          </div>
        )}

        {/* Usage Section */}
        {!isLoading && usage && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">{t('myEsims.dataUsed', 'Data Used')}</span>

              <span className="font-medium" data-testid="text-data-usage">
                {formatData(usage.dataUsed)} / {formatData(usage.dataTotal)}
              </span>
            </div>

            <Progress value={usage.percentageUsed ?? 0} />

            <div className="flex justify-between text-xs text-muted-foreground">
              <span>
                {(usage.percentageUsed ?? 0).toFixed(1)}% {t('myEsims.used', 'used')}
              </span>

              <span>
                {formatData(usage.dataRemaining)} {t('myEsims.remaining', 'remaining')}
              </span>
            </div>

            {usage.expiresAt && (
              <p className="text-xs text-right text-muted-foreground">
                {t('myEsims.validUntil', 'Valid until')}{' '}
                <span className="font-medium">
                  {new Date(usage.expiresAt).toLocaleDateString()}
                </span>
              </p>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={onViewInstructions}
            data-testid="button-view-instructions"
          >
            <QrCode className="mr-2 h-4 w-4" />
            {t('myEsims.setup', 'Setup')}
          </Button>

          <Button
            size="sm"
            className="flex-1"
            onClick={onViewTopups}
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
