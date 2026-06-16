import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import ReactCountryFlag from 'react-country-flag';
import {
  Search,
  Eye,
  Mail,
  Download,
  Filter,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  ShoppingCart,
  Smartphone,
  RefreshCw,
  AlertTriangle,
  ArrowRight,
  CheckCircle,
  XCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { apiRequest, queryClient } from '@/lib/queryClient';
import type { Order, UnifiedPackage, User, Destination } from '@shared/schema';
import { formatDisplayOrderId, formatDisplayUserId } from '@shared/utils';
import { ESimDetailsModal } from '@/components/admin/ESimDetailsModal';
import { useTranslation } from '@/contexts/TranslationContext';
import { useAdmin } from '@/hooks/use-admin';

type FailoverAttempt = {
  providerId: string;
  providerName?: string;
  timestamp: string;
  success: boolean;
  error?: string;
  margin?: number;
};

type OrderWithDetails = Order & {
  user: User | null;
  package: UnifiedPackage & { destination?: Destination };
  originalProviderName?: string;
  finalProviderName?: string;
};

const statusStyles: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
  processing: 'bg-primary/10 text-[var(--primary-dark)] dark:bg-[var(--primary-dark)]/30 dark:text-[var(--primary-light)]',
  completed: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  failed: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
  cancelled: 'bg-gray-100 text-gray-800 dark:bg-gray-950/30 dark:text-gray-400',
};

export default function OrderManagement() {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState<OrderWithDetails | null>(null);
  const [esimDetailsOrderId, setEsimDetailsOrderId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const { toast } = useToast();
  const { user } = useAdmin();


  // console.log('orders', selectedOrder);
  // console.log('esimDetailsOrderId', esimDetailsOrderId);

  const { data: orders, isLoading } = useQuery<OrderWithDetails[]>({
    queryKey: ['/api/admin/orders'],
  });

  const sendInstructionsMutation = useMutation({
    mutationFn: async (orderId: string) => {
      return await apiRequest('POST', `/api/admin/orders/${orderId}/send-instructions`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/orders'] });
      toast({
        title: t('common.success', 'Success'),
        description: t(
          'admin.orders.instructionsSent',
          'Installation instructions sent successfully',
        ),
      });
    },
    onError: (error: any) => {
      toast({
        title: t('common.error', 'Error'),
        description:
          error.message ||
          t('admin.orders.failedToSendInstructions', 'Failed to send instructions'),
        variant: 'destructive',
      });
    },
  });

  const updateOrderStatusMutation = useMutation({
    mutationFn: async ({ orderId, status }: { orderId: string; status: string }) => {
      return await apiRequest('PUT', `/api/admin/orders/${orderId}/status`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/orders'] });
      toast({
        title: t('common.success', 'Success'),
        description: t('admin.orders.statusUpdated', 'Order status updated successfully'),
      });
    },
    onError: (error: any) => {
      toast({
        title: t('common.error', 'Error'),
        description:
          error.message || t('admin.orders.failedToUpdateStatus', 'Failed to update order status'),
        variant: 'destructive',
      });
    },
  });

  const deleteOrderMutation = useMutation({
    mutationFn: async (orderId: string) => {
      return await apiRequest('DELETE', `/api/admin/orders/${orderId}`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/orders'] });
      toast({
        title: t('common.success', 'Success'),
        description: t('admin.orders.deleteSuccess', 'Order deleted successfully'),
      });
    },
    onError: (error: any) => {
      toast({
        title: t('common.error', 'Error'),
        description: error.message || t('admin.orders.failedToDelete', 'Failed to delete order'),
        variant: 'destructive',
      });
    },
  });

  const fetchPendingOrdersMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest('POST', '/api/admin/orders/fetch-pending', {});
    },
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/orders'] });
      toast({
        title: t('admin.orders.fetchComplete', 'Fetch Complete'),
        description:
          data.message ||
          t('admin.orders.pendingOrdersChecked', 'Pending orders checked successfully'),
      });
    },
    onError: (error: any) => {
      toast({
        title: t('common.error', 'Error'),
        description:
          error.message || t('admin.orders.failedToFetchPending', 'Failed to fetch pending orders'),
        variant: 'destructive',
      });
    },
  });

  // CSV Export Function
  const exportToCSV = () => {

    // console.log(user?.email, user?.email === "de****@di***")
    // return
    if (user?.email === "de****@di***") {
      return toast({
        title: t("comman.error", "Error"),
        description: "Demo users are not allowed to perform this action",
        variant: 'destructive',
      })
    }

    if (!orders || orders.length === 0) {
      toast({
        title: t('common.noData', 'No Data'),
        description: t('admin.orders.noOrdersToExport', 'There are no orders to export.'),
        variant: 'destructive',
      });
      return;
    }

    const headers = [
      t('admin.orders.orderId', 'Order ID'),
      t('admin.orders.customerName', 'Customer Name'),
      t('admin.orders.customerEmail', 'Customer Email'),
      t('admin.orders.customerId', 'Customer ID'),
      t('admin.orders.destination', 'Destination'),
      t('admin.orders.package', 'Package'),
      t('admin.orders.dataAmount', 'Data Amount'),
      t('admin.orders.validityDays', 'Validity (Days)'),
      t('admin.orders.quantity', 'Quantity'),
      t('admin.orders.customerPrice', 'Customer Price'),
      t('admin.orders.airaloCost', 'Airalo Cost'),
      t('admin.orders.profit', 'Profit'),
      t('admin.orders.currency', 'Currency'),
      t('admin.orders.status', 'Status'),
      t('admin.orders.iccid', 'ICCID'),
      t('admin.orders.qrCode', 'QR Code'),
      t('admin.orders.orderDate', 'Order Date'),
      t('admin.orders.webhookReceived', 'Webhook Received'),
    ];

    const rows = orders.map((order) => {
      const customerPrice = parseFloat(order.price as string);
      const airaloPrice = order.airaloPrice ? parseFloat(order.airaloPrice as string) : 0;
      const profit = (customerPrice - airaloPrice) * order.quantity;
      return [
        formatDisplayOrderId(order.displayOrderId),
        order.user?.name || t('common.unassigned', 'Unassigned'),
        order.user?.email || t('admin.orders.notAssigned', 'Not assigned'),
        order.user ? formatDisplayUserId(order.user.displayUserId) : t('common.na', 'N/A'),
        order.package.destination?.name || t('common.global', 'Global'),
        order.package.title,
        order.dataAmount,
        order.validity,
        order.quantity,
        customerPrice.toFixed(2),
        airaloPrice.toFixed(2),
        profit.toFixed(2),
        order.currency,
        order.status,
        order.iccid || t('common.pending', 'Pending'),
        order.qrCodeUrl ? t('common.available', 'Available') : t('common.pending', 'Pending'),
        new Date(order.createdAt).toLocaleString(),
        order.webhookReceivedAt
          ? new Date(order.webhookReceivedAt).toLocaleString()
          : t('common.na', 'N/A'),
      ];
    });

    const csvContent = [
      headers.join(','),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(',')),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `esim-orders-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: t('admin.orders.exportSuccess', 'Export Successful'),
      description: t('admin.orders.exportedOrders', `Exported ${orders.length} orders to CSV.`),
    });
  };

  const filteredOrders = orders?.filter((order) => {
    const matchesSearch =
      order.user?.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      false ||
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.package.destination?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      false;

    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil((filteredOrders?.length || 0) / itemsPerPage);
  const paginatedOrders = filteredOrders?.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  // Manual status refresh mutation
  const refreshStatusMutation = useMutation({
    mutationFn: async ({ orderId }: { orderId: string }) => {
      return apiRequest('POST', `/api/admin/orders/${orderId}/refresh-status`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/orders'] });
      toast({
        title: 'Status Refreshed',
        description: 'Order status has been updated successfully',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Refresh Failed',
        description: error.message || 'Failed to refresh order status',
        variant: 'destructive',
      });
    },
  });

  const refundOrderMutation = useMutation({
    mutationFn: async ({ orderId }: { orderId: string }) => {
      return apiRequest('POST', `/api/admin/orders/${orderId}/refund`, {});
    },
    onSuccess: async (data) => {
      const res = await data.json();
      console.log('Refund response data:', res);
      queryClient.invalidateQueries({ queryKey: ['/api/admin/orders'] });
      const providerResult = res.data?.providerResult;
      const isSuccess = res.success && providerResult?.success !== false;
      toast({
        title: isSuccess ? 'Refund Processed' : 'Refund Failed',
        description:
          providerResult?.errorMessage ||
          providerResult?.message ||
          res.message ||
          'Order has been refunded successfully',
        variant: isSuccess ? 'default' : 'destructive',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Refund Failed',
        description: error.message || 'Failed to process refund',
        variant: 'destructive',
      });
    },
  });


  const formatPrice = (amount: string | number, currency = "USD") => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      minimumFractionDigits: 2,
    }).format(Number(amount));
  };

  return (
    <div className="space-y-6 p-4 md:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
            {t('admin.orders.title', 'Order Management')}
          </h1>
          <p className="text-sm md:text-base text-slate-500 dark:text-slate-400 mt-1">
            {t('admin.orders.description', 'Manage and track all eSIM orders')}
          </p>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <Button
            variant="outline"
            className="w-full sm:w-auto gap-2 bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 h-10"
            onClick={() => fetchPendingOrdersMutation.mutate()}
            disabled={fetchPendingOrdersMutation.isPending}
            data-testid="button-fetch-pending"
          >
            <RefreshCw
              className={`h-4 w-4 ${fetchPendingOrdersMutation.isPending ? 'animate-spin' : ''}`}
            />
            <span className="whitespace-nowrap">{t('admin.orders.fetchPending', 'Fetch Pending')}</span>
          </Button>
          <Link href="/admin/orders/purchase" className="w-full sm:w-auto">
            <Button className="w-full h-10" data-testid="button-order-esim">
              <ShoppingCart className="h-4 w-4 mr-2" />
              <span className="whitespace-nowrap">{t('admin.orders.orderEsims', 'Order eSIMs')}</span>
            </Button>
          </Link>
          <Button
            variant="outline"
            className="w-full sm:w-auto gap-2 bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 h-10"
            onClick={exportToCSV}
            data-testid="button-export-orders"
          >
            <Download className="h-4 w-4" />
            <span className="whitespace-nowrap">{t('admin.orders.exportOrders', 'Export Orders')}</span>
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="border-slate-200 dark:border-slate-800 shadow-sm dark:bg-slate-950">
        <div className="p-4 md:p-6">
          <div className="grid gap-4 md:grid-cols-4 lg:grid-cols-5 items-end">
            <div className="md:col-span-2 lg:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder={t(
                    'admin.orders.searchPlaceholder',
                    'Search by email, order ID, or destination...',
                  )}
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="pl-9 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800"
                  data-testid="input-search-orders"
                />
              </div>
            </div>
            <div className="md:col-span-1">
              <Select
                value={statusFilter}
                onValueChange={(value) => {
                  setStatusFilter(value);
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger
                  className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800"
                  data-testid="select-status-filter"
                >
                  <SelectValue placeholder={t('admin.orders.filterByStatus', 'Filter by status')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">
                    {t('admin.orders.allStatuses', 'All Statuses')}
                  </SelectItem>
                  <SelectItem value="pending">
                    {t('common.pending', 'Pending')}
                  </SelectItem>
                  <SelectItem value="processing">
                    {t('admin.orders.processing', 'Processing')}
                  </SelectItem>
                  <SelectItem value="completed">
                    {t('admin.orders.completed', 'Completed')}
                  </SelectItem>
                  <SelectItem value="failed">{t('admin.orders.failed', 'Failed')}</SelectItem>
                  <SelectItem value="cancelled">
                    {t('admin.orders.cancelled', 'Cancelled')}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2 md:col-span-1 lg:col-span-2">
              <Badge variant="secondary" className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-none px-3 py-1">
                {filteredOrders?.length || 0} {t('admin.orders.orders', 'orders')}
              </Badge>
            </div>
          </div>
        </div>
      </Card>

      {/* Orders Table */}
      <Card className="border-slate-200 dark:border-slate-800 shadow-sm dark:bg-slate-950">
        <CardContent className="p-0">
          {isLoading ? (
            <div className="h-64 flex flex-col items-center justify-center gap-3">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-second"></div>
              <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">{t('admin.orders.loadingOrders', 'Loading orders...')}</p>
            </div>
          ) : !paginatedOrders || paginatedOrders.length === 0 ? (
            <div className="py-12 flex flex-col items-center justify-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-50 dark:bg-slate-900">
                <Search className="h-8 w-8 text-slate-300 dark:text-slate-700" />
              </div>
              <div className="space-y-1 text-center">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50">{t('admin.orders.noOrdersFound', 'No orders found')}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 px-4 max-w-sm">
                  {searchQuery || statusFilter !== 'all'
                    ? t('common.tryAdjustingFilters', 'Try adjusting your filters')
                    : t(
                      'admin.orders.ordersWillAppear',
                      'Orders will appear here once customers start purchasing',
                    )}
                </p>
              </div>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-slate-200 dark:border-slate-800 hover:bg-transparent">
                      <TableHead className="font-semibold text-slate-900 dark:text-slate-50">{t('admin.orders.orderId', 'Order ID')}</TableHead>
                      <TableHead className="font-semibold text-slate-900 dark:text-slate-50">{t('admin.orders.customer', 'Customer')}</TableHead>
                      <TableHead className="font-semibold text-slate-900 dark:text-slate-50">{t('admin.orders.destination', 'Destination')}</TableHead>
                      <TableHead className="font-semibold text-slate-900 dark:text-slate-50">{t('admin.orders.package', 'Package')}</TableHead>
                      <TableHead className="font-semibold text-slate-900 dark:text-slate-50">{t('admin.orders.amount', 'Amount')}</TableHead>
                      <TableHead className="font-semibold text-slate-900 dark:text-slate-50">{t('admin.orders.status', 'Status')}</TableHead>
                      <TableHead className="font-semibold text-slate-900 dark:text-slate-50">{t('common.date', 'Date')}</TableHead>
                      <TableHead className="font-semibold text-slate-900 dark:text-slate-50 text-right">{t('common.actions', 'Actions')}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedOrders.map((order) => (
                      <TableRow
                        key={order.id}
                        className="border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors"
                        data-testid={`row-order-${order.id}`}
                      >
                        <TableCell className="font-mono text-[10px] md:text-xs text-slate-500 dark:text-slate-400">
                          {formatDisplayOrderId(order.displayOrderId)}
                        </TableCell>
                        <TableCell>
                          <div className="min-w-[150px]">
                            <p className="text-sm font-semibold text-slate-900 dark:text-slate-50">
                              {order.user?.name || t('common.unassigned', 'Unassigned')}
                            </p>
                            <p className="text-[10px] md:text-xs text-slate-500 dark:text-slate-400 truncate max-w-[180px]">
                              {order.user?.email ||
                                t('admin.orders.notAssignedToCustomer', 'Not assigned to customer')}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2 min-w-[130px]">
                            {order.package?.destination?.image ? (
                              <img
                                src={order.package.destination.image}
                                alt={order.package.destination.name}
                                className="w-5 h-5 rounded-full object-cover border border-slate-200 dark:border-slate-700 shadow-sm"
                              />
                            ) : order.package?.destination?.countryCode ? (
                              <ReactCountryFlag
                                countryCode={order.package.destination.countryCode}
                                svg
                                style={{ width: '20px', height: '15px' }}
                                title={order.package.destination.name}
                                className="shadow-sm rounded-[2px]"
                              />
                            ) : (
                              <span className="text-lg">
                                {order.package?.destination?.flagEmoji ?? '🌍'}
                              </span>
                            )}
                            <span className="text-sm font-medium text-slate-900 dark:text-slate-50">
                              {order.package?.destination?.name ?? t('common.global', 'Global')}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col gap-0.5 min-w-[100px]">
                            <span className="text-sm font-semibold text-slate-900 dark:text-slate-50">{order.dataAmount}</span>
                            <span className="text-[10px] md:text-xs text-slate-500 dark:text-slate-400 uppercase tracking-tight">{order.validity} {t('common.days', 'days')}</span>
                          </div>
                        </TableCell>
                        <TableCell className="font-semibold min-w-[90px]">
                          {(order.giftCardTransactions?.length > 0 || order.voucherUsage?.length > 0 || order.referralTransactions?.length > 0) ? (
                            <div className="flex flex-col">
                              <span className="line-through text-slate-400 dark:text-slate-500 text-[10px] font-normal">
                                {formatPrice(order.price, order.currency || order.orderCurrency)}
                              </span>
                              <span className="text-emerald-600 dark:text-emerald-400 text-sm">
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
                            <span className="text-emerald-600 dark:text-emerald-400 text-sm">
                              {formatPrice(order.price, order.currency || order.orderCurrency)}
                            </span>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={`${statusStyles[order.status]} border-none text-[10px] md:text-xs px-2 py-0.5 capitalize`}>
                            {order.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-[10px] md:text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap font-medium">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-50"
                                data-testid={`button-actions-${order.id}`}
                              >
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48 dark:bg-slate-950 border-slate-200 dark:border-slate-800">
                              {/* View Details - Always available */}
                              <DropdownMenuItem className="cursor-pointer" onClick={() => setSelectedOrder(order)}>
                                <Eye className="mr-2 h-4 w-4" />
                                {t('common.viewDetails', 'View Details')}
                              </DropdownMenuItem>

                              {/* Refresh Status - Always available */}
                              <DropdownMenuItem
                                className="cursor-pointer"
                                onClick={() => refreshStatusMutation.mutate({ orderId: order.id })}
                                disabled={
                                  refreshStatusMutation.isPending || order.status === 'refunded'
                                }
                                data-testid="button-refresh-status"
                              >
                                <RefreshCw
                                  className={`h-4 w-4 mr-2 ${refreshStatusMutation.isPending ? 'animate-spin' : ''}`}
                                />
                                Refresh Status
                              </DropdownMenuItem>

                              {/* Refund - Only for completed orders */}
                              {order.status === 'completed' && (
                                <DropdownMenuItem
                                  className="cursor-pointer"
                                  onClick={() => refundOrderMutation.mutate({ orderId: order.id })}
                                  disabled={refundOrderMutation.isPending}
                                  data-testid={`button-refund-${order.id}`}
                                >
                                  <RefreshCw
                                    className={`h-4 w-4 mr-2 ${refundOrderMutation.isPending ? 'animate-spin' : ''}`}
                                  />
                                  Refund
                                </DropdownMenuItem>
                              )}

                              {/* View eSIM - Only for completed orders with ICCID */}
                              {order.iccid && order.status === 'completed' && (
                                <DropdownMenuItem
                                  className="cursor-pointer"
                                  onClick={() => setEsimDetailsOrderId(order.id)}
                                  data-testid={`button-view-esim-${order.id}`}
                                >
                                  <Smartphone className="mr-2 h-4 w-4" />
                                  {t('admin.orders.viewEsim', 'View eSIM')}
                                </DropdownMenuItem>
                              )}

                              {/* Send Instructions - Only for completed orders with ICCID */}
                              {order.iccid && order.status === 'completed' && (
                                <>
                                  <DropdownMenuSeparator className="dark:bg-slate-800" />
                                  <DropdownMenuItem
                                    className="cursor-pointer"
                                    onClick={() => sendInstructionsMutation.mutate(order.id)}
                                    disabled={sendInstructionsMutation.isPending}
                                  >
                                    <Mail className="mr-2 h-4 w-4" />
                                    {t('admin.orders.sendInstructions', 'Send Instructions')}
                                  </DropdownMenuItem>
                                </>
                              )}

                              {/* Mark as Completed - Only for pending, processing, or failed orders */}
                              {['pending', 'processing', 'failed'].includes(order.status) && (
                                <DropdownMenuItem
                                  className="cursor-pointer"
                                  onClick={() =>
                                    updateOrderStatusMutation.mutate({
                                      orderId: order.id,
                                      status: 'completed',
                                    })
                                  }
                                  disabled={updateOrderStatusMutation.isPending}
                                  data-testid={`button-mark-complete-${order.id}`}
                                >
                                  {t('admin.orders.markAsCompleted', 'Mark as Completed')}
                                </DropdownMenuItem>
                              )}

                              {/* Delete Order - Only for non-terminal states */}
                              {['pending', 'processing', 'failed'].includes(order.status) && (
                                <DropdownMenuItem
                                  className="text-red-600 cursor-pointer hover:text-red-700 dark:hover:text-red-400 focus:text-red-700 dark:focus:text-red-400"
                                  onClick={() => {
                                    if (
                                      confirm(
                                        t(
                                          'admin.orders.deleteConfirm',
                                          'Are you sure you want to delete this order?',
                                        ),
                                      )
                                    ) {
                                      deleteOrderMutation.mutate(order.id);
                                    }
                                  }}
                                  disabled={deleteOrderMutation.isPending}
                                  data-testid={`button-delete-order-${order.id}`}
                                >
                                  {t('admin.orders.deleteOrder', 'Delete Order')}
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              {filteredOrders && filteredOrders.length > itemsPerPage && (
                <div className="flex flex-col sm:flex-row items-center justify-between border-t border-slate-100 dark:border-slate-800 px-6 py-4 gap-4">
                  <div className="text-xs md:text-sm text-slate-500 dark:text-slate-400 font-medium order-2 sm:order-1">
                    {t('common.showing', 'Showing')} {(currentPage - 1) * itemsPerPage + 1}{' '}
                    {t('common.to', 'to')} {Math.min(currentPage * itemsPerPage, filteredOrders.length)}{' '}
                    {t('common.of', 'of')} {filteredOrders.length} {t('admin.orders.orders', 'orders')}
                  </div>
                  <div className="flex items-center gap-2 order-1 sm:order-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 w-8 p-0 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800"
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      data-testid="button-prev-page"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        const pageNum = i + 1;
                        return (
                          <Button
                            key={pageNum}
                            variant={currentPage === pageNum ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setCurrentPage(pageNum)}
                            className={`h-8 w-8 p-0 ${currentPage === pageNum ? '' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'}`}
                          >
                            {pageNum}
                          </Button>
                        );
                      })}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 w-8 p-0 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800"
                      onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      data-testid="button-next-page"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Order Details Dialog */}
      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent className="max-w-2xl p-0 overflow-hidden border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
          <DialogHeader className="p-6 pb-0">
            <DialogTitle className="text-xl font-bold text-slate-900 dark:text-slate-50">{t('admin.orders.orderDetails', 'Order Details')}</DialogTitle>
            <DialogDescription className="text-slate-500 dark:text-slate-400">
              {t('admin.orders.completeInformation', 'Complete information about this order')}
            </DialogDescription>
          </DialogHeader>

          {selectedOrder && (
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                <div className="space-y-1">
                  <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                    {t('admin.orders.orderId', 'Order ID')}
                  </p>
                  <p className="text-sm font-mono text-slate-700 dark:text-slate-300">
                    {formatDisplayOrderId(selectedOrder.displayOrderId)}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                    {t('admin.orders.status', 'Status')}
                  </p>
                  <Badge className={`${statusStyles[selectedOrder.status]} border-none px-2 py-0.5`} variant="outline">
                    {selectedOrder.status}
                  </Badge>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                    {t('admin.orders.customer', 'Customer')}
                  </p>
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-300 truncate">
                    {selectedOrder.user?.email || t('common.unassigned', 'Unassigned')}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                    {t('admin.orders.amount', 'Amount')}
                  </p>
                  <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                    {formatPrice(selectedOrder.price, selectedOrder.currency || selectedOrder.orderCurrency)}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                    {t('admin.orders.package', 'Package')}
                  </p>
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    {selectedOrder.dataAmount} • {selectedOrder.validity} {t('common.days', 'days')}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                    {t('common.date', 'Date')}
                  </p>
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    {new Date(selectedOrder.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>

              {selectedOrder.iccid && (
                <div className="space-y-2">
                  <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider ml-1">
                    {t('admin.orders.iccid', 'ICCID')}
                  </p>
                  <div className="p-3 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-lg">
                    <p className="text-sm font-mono text-slate-700 dark:text-slate-300 break-all">{selectedOrder.iccid}</p>
                  </div>
                </div>
              )}

              {selectedOrder.qrCodeUrl && (
                <div className="space-y-3">
                  <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider ml-1">
                    QR Code
                  </p>
                  <div className="flex justify-center p-6 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl shadow-sm">
                    <img
                      src={selectedOrder.qrCodeUrl}
                      alt="QR Code"
                      className="w-48 h-48 sm:w-64 sm:h-64 rounded-lg"
                    />
                  </div>
                </div>
              )}

              {/* Failover History Section */}
              {(() => {
                const failoverAttempts = Array.isArray(selectedOrder.failoverAttempts)
                  ? (selectedOrder.failoverAttempts as FailoverAttempt[])
                  : [];
                const showFailoverSection =
                  selectedOrder.originalProviderId ||
                  selectedOrder.finalProviderId ||
                  failoverAttempts.length > 0;

                if (!showFailoverSection) return null;

                return (
                  <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-2 mb-1">
                      <AlertTriangle className="h-4 w-4 text-amber-500" />
                      <p className="text-sm font-bold text-slate-900 dark:text-slate-50">
                        {t('admin.orders.providerInfo', 'Provider Information')}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {selectedOrder.originalProviderId && (
                        <div className="p-3 bg-slate-50 dark:bg-slate-900/30 rounded-lg">
                          <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">
                            {t('admin.orders.originalProvider', 'Original Provider')}
                          </p>
                          <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                            {selectedOrder.originalProviderName || selectedOrder.originalProviderId}
                          </p>
                        </div>
                      )}
                      {selectedOrder.finalProviderId && (
                        <div className="p-3 bg-slate-50 dark:bg-slate-900/30 rounded-lg">
                          <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">
                            {t('admin.orders.finalProvider', 'Final Provider')}
                          </p>
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                              {selectedOrder.finalProviderName || selectedOrder.finalProviderId}
                            </p>
                            {selectedOrder.originalProviderId &&
                              selectedOrder.originalProviderId !==
                              selectedOrder.finalProviderId && (
                                <Badge
                                  variant="outline"
                                  className="bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 border-none text-[10px] px-1.5 py-0"
                                >
                                  {t('admin.orders.failover', 'Failover')}
                                </Badge>
                              )}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Failover Attempts History */}
                    {failoverAttempts.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider ml-1">
                          {t('admin.orders.failoverHistory', 'Failover History')}
                        </p>
                        <div className="space-y-2">
                          {failoverAttempts.map((attempt, index) => (
                            <div
                              key={index}
                              className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-lg text-sm transition-colors hover:bg-slate-100 dark:hover:bg-slate-800/50"
                            >
                              {attempt.success ? (
                                <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                              ) : (
                                <XCircle className="h-4 w-4 text-red-500 flex-shrink-0" />
                              )}
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="font-bold text-slate-900 dark:text-slate-50">
                                    {attempt.providerName || attempt.providerId}
                                  </span>
                                  {attempt.margin !== undefined && (
                                    <Badge variant="secondary" className="text-[10px] bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-1.5 py-0">
                                      {attempt.margin.toFixed(1)}% margin
                                    </Badge>
                                  )}
                                </div>
                                {attempt.error && (
                                  <p className="text-red-500 text-[10px] mt-0.5 truncate italic">
                                    {attempt.error}
                                  </p>
                                )}
                              </div>
                              <span className="text-slate-400 dark:text-slate-500 text-[10px] font-mono shrink-0">
                                {new Date(attempt.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>
          )}
          <div className="p-6 bg-slate-50/50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-800">
            <Button
              className="w-full sm:w-auto"
              variant="outline"
              onClick={() => setSelectedOrder(null)}
            >
              {t('common.close', 'Close')}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* eSIM Details Modal */}
      <ESimDetailsModal
        orderId={esimDetailsOrderId}
        isOpen={!!esimDetailsOrderId}
        onClose={() => setEsimDetailsOrderId(null)}
      />
    </div>
  );
}
