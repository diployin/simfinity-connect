import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Globe, Package, Download, RefreshCw, QrCode, Copy, Check, AlertCircle, Smartphone, Signal, Database, Calendar, Phone, MessageSquare, Plus, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/ThemeToggle";
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import type { Order, UnifiedPackage, Destination } from "@shared/schema";
import { useTranslation } from "@/contexts/TranslationContext";
import { ESimDetailsModal } from "@/components/admin/ESimDetailsModal";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";


type OrderWithDetails = Order & {
  package: UnifiedPackage & { destination?: Destination };
  giftCardTransactions?: any[];
  voucherUsage?: any[];
  referralTransactions?: any[];
};

export default function MyOrders() {
  const [selectedOrder, setSelectedOrder] = useState<OrderWithDetails | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const { toast } = useToast();
  const { t } = useTranslation();
  const [selectedLanguage, setSelectedLanguage] = useState("en");

  const { data: orders, isLoading } = useQuery<OrderWithDetails[]>({
    queryKey: ["/api/my-orders"],
  });

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
      processing: "bg-primary/10 text-[var(--primary-dark)] dark:bg-[var(--primary-dark)] dark:text-primary/10",
      completed: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
      failed: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
    };
    return colors[status] || colors.pending;
  };

  const copyToClipboard = async (text: string, field: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedField(field);
    toast({
      title: t('common.copied', 'Copied!'),
      description: t('myOrders.copiedToClipboard', '{{field}} copied to clipboard', { field }),
    });
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleViewDetails = (order: OrderWithDetails) => {
    setSelectedOrder(order);
    setDialogOpen(true);
  };



  // Fetch eSIM details
  const { data: esimData, isLoading: esimLoading } = useQuery<{ esim: any }>({
    queryKey: [`/api/orders/${selectedOrder?.id}/esim`],
    enabled: !!selectedOrder?.id && dialogOpen && !!selectedOrder?.iccid,
  });

  // Fetch installation instructions
  const { data: instructionsData } = useQuery<{ instructions: any }>({
    queryKey: [`/api/esims/${selectedOrder?.iccid}/instructions`],
    enabled: !!selectedOrder?.iccid && dialogOpen,
  });

  // Fetch data usage
  const { data: usageData } = useQuery<{ usage: any }>({
    queryKey: [`/api/esims/${selectedOrder?.iccid}/usage`],
    enabled: !!selectedOrder?.iccid && dialogOpen,
    refetchInterval: 60000, // Refresh every minute
  });

  // Fetch available top-up packages
  const { data: topupPackagesData } = useQuery<{ packages: any[]; topupMargin: number }>({
    queryKey: [`/api/esims/${selectedOrder?.iccid}/topup-packages`],
    enabled: !!selectedOrder?.iccid && dialogOpen,
  });

  // Fetch comprehensive eSIM info with multi-language support
  const { data: esimInfoData } = useQuery<{ info: any }>({
    queryKey: [`/api/esims/${selectedOrder?.iccid}/info/${selectedLanguage}`],
    enabled: !!selectedOrder?.iccid && dialogOpen,
  });

  // Fetch branded QR code
  const { data: brandedQrData } = useQuery<{ qrCode: any }>({
    queryKey: [`/api/esims/${selectedOrder?.iccid}/branded-qr`],
    enabled: !!selectedOrder?.iccid && dialogOpen,
  });


  // console.log("esimData", esimData);
  const esim = esimData?.esim;
  // console.log("esim", esim);

  const instructions = instructionsData?.instructions;
  // console.log("instructions", instructions);
  const usage = usageData?.usage;
  // console.log("usage", usage);
  const topupPackages = topupPackagesData?.packages || [];
  // console.log("topupPackages", topupPackages);
  const esimInfo = esimInfoData?.info;
  // console.log("esimInfo", esimInfo);
  const brandedQr = brandedQrData?.qrCode;
  // console.log("brandedQr", brandedQr);
  const topupMargin = topupPackagesData?.topupMargin || 40;
  // console.log("topupMargin", topupMargin);

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


  // Manual status refresh mutation
  const refreshStatusMutation = useMutation({
    mutationFn: async () => {
      return apiRequest("POST", `/api/admin/orders/${selectedOrder?.id}/refresh-status`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/orders", selectedOrder?.id] });
      queryClient.invalidateQueries({ queryKey: ["/api/orders", selectedOrder?.id, "esim"] });
      toast({
        title: "Status Refreshed",
        description: "Order status has been updated successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Refresh Failed",
        description: error.message || "Failed to refresh order status",
        variant: "destructive",
      });
    },
  });

  // Apply top-up mutation
  const applyTopupMutation = useMutation({
    mutationFn: async (packageId: string) => {
      return apiRequest("POST", "/api/topups", {
        orderId: selectedOrder?.id,
        packageId: selectedOrder?.packageId,
        iccid: selectedOrder?.iccid,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/esims", selectedOrder?.iccid, "usage"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/orders", selectedOrder?.id] });
      toast({
        title: "Top-Up Applied",
        description: "Top-up has been successfully applied to the eSIM",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Top-Up Failed",
        description: error.message || "Failed to apply top-up",
        variant: "destructive",
      });
    },
  });

  // const copyToClipboard = (text: string) => {
  //   navigator.clipboard.writeText(text);
  //   setCopiedCode(true);
  //   toast({
  //     title: "Copied!",
  //     description: "Activation code copied to clipboard",
  //   });
  //   setTimeout(() => setCopiedCode(false), 2000);
  // };


  const formatPrice = (amount: string | number, currency = "USD") => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      minimumFractionDigits: 2,
    }).format(Number(amount));
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2 text-foreground dark:text-white">{t('myOrders.title', 'My Orders')}</h1>
        <p className="text-sm sm:text-base text-muted-foreground dark:text-gray-400">
          {t('myOrders.description', 'View and manage your eSIM purchases')}
        </p>
      </div>

      {isLoading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
        </div>
      ) : orders && orders.length > 0 ? (
        <div className="space-y-6">
          {orders.map((order) => (
            <Card key={order.id} className="hover-elevate dark:bg-gray-900 dark:border-gray-800" data-testid={`card-order-${order.id}`}>
              <CardHeader>
                <div className="flex items-start justify-between gap-3 flex-wrap sm:flex-nowrap">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{order.package.destination?.flagEmoji || "🌍"}</span>
                    <div>
                      <CardTitle className="text-lg dark:text-white">
                        {order.package.destination?.name}
                        <span className="block text-sm font-normal text-muted-foreground dark:text-gray-400 mt-1">
                          {order.package?.title || `${order.dataAmount} - ${order.validity} Days`}
                        </span>
                      </CardTitle>
                      <p className="text-sm text-muted-foreground dark:text-gray-400">
                        {order.dataAmount} • {order.validity} {t('common.days', 'days')}
                      </p>
                    </div>
                  </div>
                  <Badge className={getStatusColor(order.status)} variant="secondary">
                    {t(`myOrders.status.${order.status}`, order.status)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <div className="text-sm text-muted-foreground dark:text-gray-400 mb-1">{t('myOrders.orderId', 'Order ID')}</div>
                    <div className="font-mono text-sm dark:text-gray-200">{order.displayOrderId}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground dark:text-gray-400 mb-1">{t('myOrders.amountPaid', 'Amount Paid')}</div>
                    {/* <div className="font-medium">${order.price}</div> */}
                    <div className="font-medium dark:text-gray-200">
                      {(order.giftCardTransactions?.length > 0 || order.voucherUsage?.length > 0 || order.referralTransactions?.length > 0) ? (
                        <div className="flex flex-col">
                          <span className="line-through text-muted-foreground text-xs font-normal">
                            {formatPrice(order.price, order.currency || order.orderCurrency)}
                          </span>
                          <span className="text-green-600 dark:text-green-400">
                            {formatPrice(
                              Math.max(0,
                                Number(order.price) -
                                (order.giftCardTransactions?.reduce((acc: number, t: any) => acc + Number(t.amountUsed), 0) || 0) -
                                (order.voucherUsage?.reduce((acc: number, v: any) => acc + Number(v.discountAmount), 0) || 0) -
                                (order.referralTransactions?.reduce((acc: number, r: any) => acc + Number(r.amount), 0) || 0)
                              ),
                              order.currency || order.orderCurrency
                            )}
                          </span>
                        </div>
                      ) : (
                        formatPrice(order.price, order.currency || order.orderCurrency)
                      )}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground dark:text-gray-400 mb-1">{t('myOrders.purchaseDate', 'Purchase Date')}</div>
                    <div className="text-sm dark:text-gray-200">{new Date(order.createdAt).toLocaleDateString()}</div>
                  </div>
                </div>

                {/* Status-based content */}
                {order.status === "completed" && order.iccid && (
                  <div className="space-y-4">
                    <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <Check className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5" />
                        <div className="flex-1">
                          <p className="font-medium text-green-900 dark:text-green-100 mb-1">
                            {t('myOrders.esimReady', 'eSIM Ready for Installation')}
                          </p>
                          <p className="text-sm text-green-700 dark:text-green-300">
                            {t('myOrders.esimReadyDesc', 'Your eSIM is ready! Installation instructions have been sent to your email.')}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <Button
                        onClick={() => handleViewDetails(order)}
                        size="sm"
                        className="w-full sm:w-auto"
                        data-testid={`button-view-details-${order.id}`}
                      >
                        <Smartphone className="h-4 w-4 mr-2" />
                        {t('myOrders.viewInstallationDetails', 'View Installation Details')}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full sm:w-auto dark:border-gray-700 dark:hover:bg-gray-800 dark:text-gray-300"
                        onClick={() => order.qrCode && window.open(order.qrCode, '_blank')}
                        disabled={!order.qrCode}
                        data-testid={`button-qr-${order.id}`}
                      >
                        <QrCode className="h-4 w-4 mr-2" />
                        {t('myOrders.qrCode', 'QR Code')}
                      </Button>
                      {(order.shortUrl || esim?.shortUrl) && (
                        <Button
                          className="bg-orange-500 hover:bg-orange-600 text-white w-full sm:w-auto"
                          size="sm"
                          onClick={() => window.open(order.shortUrl || esim?.shortUrl, '_blank')}
                          data-testid={`button-quick-setup-${order.id}`}
                        >
                          <Zap className="h-4 w-4 mr-2" />
                          {t('myOrders.quickSetup', 'Quick Setup')}
                        </Button>
                      )}
                    </div>
                  </div>
                )}

                {order.status === "processing" && (
                  <div className="bg-primary/5 dark:bg-[#0a2e14]/20 border border-primary/10 dark:border-[var(--primary-dark)] rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary-second mt-0.5"></div>
                      <div className="flex-1">
                        <p className="font-medium text-[var(--primary-dark)] dark:text-primary/10 mb-1">
                          {t('myOrders.processingOrder', 'Processing Your Order')}
                        </p>
                        <p className="text-sm text-primary-second dark:text-[var(--primary-light)]">
                          {order.orderType === "batch"
                            ? t('myOrders.processingBatch', "Your eSIM is being provisioned. You'll receive installation instructions via email within a few minutes.")
                            : t('myOrders.processingRegular', 'Your eSIM is being processed. This usually takes a few moments.')}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {order.status === "failed" && (
                  <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5" />
                      <div className="flex-1">
                        <p className="font-medium text-red-900 dark:text-red-100 mb-1">
                          {t('myOrders.orderFailed', 'Order Failed')}
                        </p>
                        <p className="text-sm text-red-700 dark:text-red-300 mb-2">
                          {t('myOrders.orderFailedDesc', 'Something went wrong with your order. Please contact support for assistance.')}
                        </p>
                        <Link href="/support">
                          <Button variant="outline" size="sm">
                            {t('myOrders.contactSupport', 'Contact Support')}
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="dark:bg-gray-900 dark:border-gray-800">
          <CardContent className="text-center py-12">
            <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2 dark:text-white">{t('myOrders.noOrders', 'No orders yet')}</h3>
            <p className="text-muted-foreground dark:text-gray-400 mb-6">{t('myOrders.noOrdersDesc', 'Start exploring our destinations and get your first eSIM')}</p>
            <Link href="/destinations">
              <Button className="bg-[var(--primary)] hover:bg-primary-second text-white" data-testid="button-browse-destinations">{t('myOrders.browseDestinations', 'Browse Destinations')}</Button>
            </Link>
          </CardContent>
        </Card>
      )}

      {/* Installation Details Dialog */}
      {/* <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-lg" data-testid="dialog-installation-details">
          <DialogHeader>
            <DialogTitle>{t('myOrders.installationDetails', 'eSIM Installation Details')}</DialogTitle>
            <DialogDescription>
              {t('myOrders.installationDetailsDesc', 'Use this information to install your eSIM on your device')}
            </DialogDescription>
          </DialogHeader>

          {selectedOrder && (
            <div className="space-y-4">
              
              <div className="rounded-lg bg-slate-50 dark:bg-slate-900 p-4">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-3xl">{selectedOrder.package.destination?.flagEmoji || "🌍"}</span>
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-white">
                      {selectedOrder.package.destination?.name}
                    </p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      {selectedOrder.dataAmount} • {selectedOrder.validity} {t('common.days', 'days')}
                    </p>
                  </div>
                </div>
              </div>

              
              {selectedOrder.qrCodeUrl && (
                <div className="space-y-2">
                  <h4 className="font-medium text-slate-900 dark:text-white">{t('myOrders.qrCode', 'QR Code')}</h4>
                  <div className="flex justify-center p-4 bg-white rounded-lg border border-slate-200 dark:border-slate-800">
                    <img 
                      src={selectedOrder.qrCodeUrl} 
                      alt="eSIM QR Code" 
                      className="w-48 h-48"
                      data-testid="img-qr-code"
                    />
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 text-center">
                    {t('myOrders.scanQRCode', 'Scan this QR code with your device camera to install the eSIM')}
                  </p>
                </div>
              )}

              
              <div className="space-y-3">
                <h4 className="font-medium text-slate-900 dark:text-white">{t('myOrders.manualInstallation', 'Manual Installation')}</h4>
                
                {selectedOrder.iccid && (
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-slate-600 dark:text-slate-400">ICCID</label>
                    <div className="flex items-center gap-2">
                      <code className="flex-1 bg-slate-100 dark:bg-slate-800 px-3 py-2 rounded text-xs font-mono text-slate-900 dark:text-white">
                        {selectedOrder.iccid}
                      </code>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => copyToClipboard(selectedOrder.iccid!, "ICCID")}
                        data-testid="button-copy-iccid"
                      >
                        {copiedField === "ICCID" ? (
                          <Check className="h-4 w-4" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                )}

                {selectedOrder.activationCode && (
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-slate-600 dark:text-slate-400">{t('myOrders.activationCode', 'Activation Code')}</label>
                    <div className="flex items-center gap-2">
                      <code className="flex-1 bg-slate-100 dark:bg-slate-800 px-3 py-2 rounded text-xs font-mono text-slate-900 dark:text-white">
                        {selectedOrder.activationCode}
                      </code>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => copyToClipboard(selectedOrder.activationCode!, "Activation Code")}
                        data-testid="button-copy-activation"
                      >
                        {copiedField === "Activation Code" ? (
                          <Check className="h-4 w-4" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                )}

                {selectedOrder.smdpAddress && (
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-slate-600 dark:text-slate-400">{t('myOrders.smdpAddress', 'SM-DP+ Address')}</label>
                    <div className="flex items-center gap-2">
                      <code className="flex-1 bg-slate-100 dark:bg-slate-800 px-3 py-2 rounded text-xs font-mono text-slate-900 dark:text-white break-all">
                        {selectedOrder.smdpAddress}
                      </code>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => copyToClipboard(selectedOrder.smdpAddress!, "SM-DP+ Address")}
                        data-testid="button-copy-smdp"
                      >
                        {copiedField === "SM-DP+ Address" ? (
                          <Check className="h-4 w-4" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              <div className="bg-primary/5 dark:bg-[#0a2e14]/20 border border-primary/10 dark:border-[var(--primary-dark)] rounded-lg p-4">
                <h4 className="font-medium text-[var(--primary-dark)] dark:text-primary/10 mb-2">{t('myOrders.installationSteps', 'Installation Steps')}</h4>
                <ol className="list-decimal list-inside space-y-1 text-sm text-primary-second dark:text-[var(--primary-light)]">
                  <li>{t('myOrders.step1', 'Go to Settings on your device')}</li>
                  <li>{t('myOrders.step2', 'Select Cellular/Mobile Data')}</li>
                  <li>{t('myOrders.step3', 'Tap "Add eSIM" or "Add Cellular Plan"')}</li>
                  <li>{t('myOrders.step4', 'Scan the QR code or enter details manually')}</li>
                  <li>{t('myOrders.step5', 'Follow the on-screen instructions')}</li>
                </ol>
              </div>

              {selectedOrder.directAppleUrl && (
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => window.open(selectedOrder.directAppleUrl!, '_blank')}
                  data-testid="button-apple-install"
                >
                  <Smartphone className="h-4 w-4 mr-2" />
                  {t('myOrders.installOnIphone', 'Install on iPhone (Direct Link)')}
                </Button>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>  */}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto" data-testid="dialog-esim-details">
          <DialogHeader>
            <div className="flex items-center justify-between gap-2">
              <div>
                <DialogTitle>{t('myOrders.management', 'eSIM Management')}</DialogTitle>
                <DialogDescription>
                  Order {selectedOrder?.displayOrderId} • ICCID: {selectedOrder?.iccid}
                </DialogDescription>
              </div>
              {/* <Button
                variant="outline"
                size="sm"
                onClick={() => refreshStatusMutation.mutate()}
                disabled={refreshStatusMutation.isPending}
                data-testid="button-refresh-status"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${refreshStatusMutation.isPending ? 'animate-spin' : ''}`} />
                Refresh Status
              </Button> */}
            </div>
          </DialogHeader>

          <Tabs defaultValue="details" className="mt-4">
            <TabsList className="flex sm:grid w-full sm:grid-cols-3 overflow-x-auto scrollbar-none justify-start whitespace-nowrap">
              <TabsTrigger value="details" data-testid="tab-details" className="flex-1 sm:flex-none">{t('myOrders.tabs.details', 'Details')}</TabsTrigger>
              <TabsTrigger value="installation" data-testid="tab-installation" className="flex-1 sm:flex-none">{t('myOrders.tabs.installation', 'Installation')}</TabsTrigger>
              <TabsTrigger value="usage" data-testid="tab-usage" className="flex-1 sm:flex-none">{t('myOrders.tabs.usage', 'Usage')}</TabsTrigger>
              {/* <TabsTrigger value="topups" data-testid="tab-topups">{t('myOrders.tabs.topups', 'Top-Ups')}</TabsTrigger> */}
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
                            <Button variant="ghost" size="icon" className="h-6 w-6 flex-shrink-0" onClick={() => copyToClipboard(esim.iccid || selectedOrder?.iccid, "ICCID")}>
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
                            <p className="text-sm font-medium">{new Date(selectedOrder.createdAt).toLocaleDateString()}</p>
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
                                  onClick={() => window.open(esim.shortUrl || selectedOrder?.shortUrl, '_blank')}
                                >
                                  <Zap className="h-4 w-4 mr-2" />
                                  Install Now
                                </Button>
                                <Button
                                  variant="outline"
                                  size="icon"
                                  onClick={() => copyToClipboard(esim.shortUrl || selectedOrder?.shortUrl || "", "Link")}
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
                        <CardTitle className="flex items-center gap-2">
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
                        <CardTitle className="flex items-center gap-2">
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

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
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
                        {/* <div>
                          <p className="text-sm text-muted-foreground">Airalo Cost</p>
                          <p className="font-medium">${selectedOrder.airaloPrice}</p>
                        </div> */}
                      </div>
                    </CardContent>
                  </Card>
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
                      <CardTitle className="flex items-center gap-2">
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
                            onClick={() => window.open(esim?.shortUrl || selectedOrder?.shortUrl, '_blank')}
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
                              onClick={() => copyToClipboard(instructions.manual_code, "manual_code")}
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
                        <CardTitle>Installation Steps</CardTitle>
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
                        <CardTitle>{t('myOrders.deviceCompatibility', 'Device Compatibility')}</CardTitle>
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
              {usage ? (
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Database className="h-5 w-5" />{t('myOrders.dataUsage', 'Data Usage')}</CardTitle>
                      <CardDescription>{t('myOrders.usageTracking', 'Real-time consumption tracking and validity details')}</CardDescription>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`
                                   px-3 py-1 text-xs rounded-full font-medium
                                   ${usage.status === "active" ? "bg-green-100 text-green-700 border border-green-300"
                            : "bg-red-100 text-red-700 border border-red-300"}
                                 `}
                      >
                        {usage.status === "active" ? "Active" : "Inactive"}
                      </span>

                      {usage.isUnlimited && (
                        <span className="px-3 py-1 text-xs rounded-full font-medium bg-blue-100 text-blue-700 border border-blue-300">{t('myOrders.unlimitedPlan', 'Unlimited Plan')}</span>
                      )}
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-6">
                    {/* MAIN DATA USAGE */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">{t('myOrders.dataUsed', 'Data Used')}</span>
                        <span className="font-semibold">
                          {usage.dataUsed || "N/A"} MB / {usage.dataTotal || "N/A"} MB
                        </span>
                      </div>

                      <Progress
                        value={usage.percentageUsed || 0}
                        className="h-2"
                      />

                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>{usage.dataRemaining} MB remaining</span>
                        <span>{usage.percentageUsed?.toFixed(1)}% used</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t">
                      <div className="p-4 rounded-lg border bg-muted/30 min-w-0">
                        <p className="text-xs text-muted-foreground">ICCID</p>
                        <p className="text-sm font-semibold break-all">{usage.iccid || "N/A"}</p>
                      </div>

                      <div className="p-4 rounded-lg border bg-muted/30 min-w-0">
                        <p className="text-xs text-muted-foreground">{t('myOrders.validity', 'Validity')}</p>
                        <p className="text-sm font-semibold">
                          {usage.expiresAt ? new Date(usage.expiresAt).toLocaleDateString() : "N/A"}
                        </p>
                      </div>
                    </div>

                    {/* VOICE + SMS SECTION */}
                    {(usage.voiceTotal > 0 || usage.textTotal > 0) && (
                      <div className="pt-4 border-t space-y-4">
                        <h3 className="text-sm font-semibold text-muted-foreground flex items-center gap-2">
                          <Phone className="h-4 w-4" />{t('myOrders.callsAndMessages', 'Calls & Messages')}</h3>

                        <div className="grid grid-cols-2 gap-4">
                          {/* Voice */}
                          {usage.voiceTotal > 0 && (
                            <div className="space-y-2 p-4 rounded-lg border bg-muted/40">
                              <div className="flex justify-between text-sm">
                                <span>{t('myOrders.voice', 'Voice')}</span>
                                <span className="font-medium">
                                  {usage.voiceUsed}/{usage.voiceTotal} mins
                                </span>
                              </div>
                              <Progress value={(usage.voicePercentageUsed || 0) * 100} />
                              <p className="text-xs text-right text-muted-foreground">
                                {Math.round((usage.voicePercentageUsed || 0) * 100)}% Used
                              </p>
                            </div>
                          )}

                          {/* SMS */}
                          {usage.textTotal > 0 && (
                            <div className="space-y-2 p-4 rounded-lg border bg-muted/40">
                              <div className="flex justify-between text-sm">
                                <span>SMS</span>
                                <span className="font-medium">
                                  {usage.textUsed}/{usage.textTotal}
                                </span>
                              </div>
                              <Progress value={(usage.textPercentageUsed || 0) * 100} />
                              <p className="text-xs text-right text-muted-foreground">
                                {Math.round((usage.textPercentageUsed || 0) * 100)}% Used
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* FOOTER */}
                    {usage.expiresAt && (
                      <div className="pt-4 border-t">
                        <p className="text-sm text-muted-foreground">{t('myOrders.validUntil', 'Valid Until')}</p>
                        <p className="font-medium">
                          {new Date(usage.expiresAt).toLocaleString()}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ) : (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              )}
            </TabsContent>

            {/* Top-Ups Tab */}
            <TabsContent value="topups" className="space-y-4 mt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Plus className="h-5 w-5" />{t('myOrders.availableTopUps', 'Available Top-Up Packages')}</CardTitle>
                  {/* <CardDescription>
                    eSIM-specific top-up packages with {topupMargin}% margin pricing
                  </CardDescription> */}
                </CardHeader>
                <CardContent>
                  {topupPackages.length > 0 ? (
                    <div className="grid gap-4">
                      {topupPackages.map((pkg, index) => (
                        <div
                          key={pkg.id}
                          className="flex items-center justify-between gap-4 p-4 border rounded-lg"
                          data-testid={`card-topup-${index}`}
                        >
                          <div className="flex-1 space-y-1">
                            <h4 className="font-medium">{pkg.title}</h4>

                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Zap className="h-4 w-4" />
                                {pkg.dataAmount}
                              </span>
                              <span className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                {pkg.validity} days
                              </span>
                            </div>

                            <div className="flex items-center gap-3 text-xs text-muted-foreground pt-1">
                              {/* <span>Cost: ${pkg.wholesalePrice}</span> */}
                              <span>•</span>
                              <span>Customer: ${pkg.price}</span>
                            </div>
                          </div>

                          <div className="flex flex-col items-end gap-2">
                            <div className="text-right">
                              <p className="text-2xl font-bold">
                                ${pkg.price}
                              </p>
                              {/* <p className="text-xs text-muted-foreground">
                                +{topupMargin}% margin
                              </p> */}
                            </div>

                            <Button
                              size="sm"
                              onClick={() => applyTopupMutation.mutate(pkg.id)}
                              disabled={usage?.status !== "active" || applyTopupMutation.isPending}
                            >
                              {applyTopupMutation.isPending ? (
                                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                              ) : (
                                <Plus className="h-4 w-4 mr-2" />
                              )}
                              Apply Top-Up
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <Plus className="mx-auto h-12 w-12 mb-4 opacity-50" />
                      <p>No top-up packages available for this eSIM</p>
                    </div>
                  )}

                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

    </div>
  );
}
