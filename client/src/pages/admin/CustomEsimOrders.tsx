import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Search, UserPlus, Package as PackageIcon, Globe, ArrowLeft, Check, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { Order, UnifiedPackage, Destination, Region, User } from "@shared/schema";
import { Link } from "wouter";
import { formatDisplayOrderId, formatDisplayUserId } from "@shared/utils";
import { useTranslation } from "@/contexts/TranslationContext";

type OrderWithDetails = Order & {
  package: UnifiedPackage & { destination?: Destination; region?: Region };
};

const statusStyles: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  processing: "bg-primary/10 text-[var(--primary-dark)] dark:bg-[var(--primary-dark)]/30 dark:text-[var(--primary-light)]",
  completed: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  failed: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
};

export default function CustomEsimOrders() {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState<OrderWithDetails | null>(null);
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [customerSearchQuery, setCustomerSearchQuery] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<User | null>(null);
  const { toast } = useToast();

  // const { data: customOrders, isLoading } = useQuery<OrderWithDetails[]>({
  //   queryKey: ["/api/admin/orders/custom"],
  // });

  const { data: customOrders = [], isLoading } = useQuery<OrderWithDetails[]>({
    queryKey: ["/api/admin/orders/custom"],
    queryFn: async () => {
      const res = await fetch("/api/admin/orders/custom");
      const json = await res.json();

      // 🔥 IMPORTANT: extract actual array
      return Array.isArray(json)
        ? json
        : Array.isArray(json.data)
          ? json.data
          : Array.isArray(json.data?.data)
            ? json.data.data
            : [];
    },
  });


  const [search, setSearch] = useState("");

  const { data: customersRes } = useQuery<User[]>({
    queryKey: ["/api/admin/customers", search],
    queryFn: () => fetch(`/api/admin/customers?search=${search}`).then(res => res.json())
  });

  console.log(customersRes);

  const customers = customersRes?.data?.data;

  const assignOrderMutation = useMutation({
    mutationFn: async ({ orderId, userId }: { orderId: string; userId: string }) => {
      return await apiRequest("POST", `/api/admin/orders/${orderId}/assign`, { userId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/orders/custom"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/orders"] });
      setAssignDialogOpen(false);
      setSelectedOrder(null);
      setSelectedCustomer(null);
      setCustomerSearchQuery("");
      toast({
        title: t('admin.customOrders.success.title', 'Success'),
        description: t('admin.customOrders.success.assigned', 'eSIM assigned to customer successfully'),
      });
    },
    onError: (error: any) => {
      toast({
        title: t('admin.customOrders.error.title', 'Error'),
        description: error.message || t('admin.customOrders.error.assignFailed', 'Failed to assign eSIM'),
        variant: "destructive",
      });
    },
  });

  const filteredOrders = customOrders?.filter(order => {
    if (statusFilter !== "all" && order.status !== statusFilter) return false;
    if (!searchQuery) return true;
    const search = searchQuery.toLowerCase();
    return (
      order.id.toLowerCase().includes(search) ||
      order.requestId?.toLowerCase().includes(search) ||
      order.package.destination?.name.toLowerCase().includes(search) ||
      order.package.region?.name.toLowerCase().includes(search)
    );
  });

  const filteredCustomers = customers?.filter(customer => {
    if (!customerSearchQuery) return true;
    const search = customerSearchQuery.toLowerCase();
    const displayId = formatDisplayUserId(customer.displayUserId).toLowerCase();
    return (
      customer.name?.toLowerCase().includes(search) ||
      customer.email.toLowerCase().includes(search) ||
      displayId.includes(search)
    );
  });

  const handleAssignClick = (order: OrderWithDetails) => {
    setSelectedOrder(order);
    setAssignDialogOpen(true);
    setSelectedCustomer(null);
    setCustomerSearchQuery("");
  };

  const handleAssign = () => {
    if (!selectedOrder || !selectedCustomer) return;
    assignOrderMutation.mutate({ orderId: selectedOrder.id, userId: selectedCustomer.id });
  };

  // Group orders by requestId for batch orders (only show batches with 2+ eSIMs)
  const ordersGroupedByRequest: Record<string, OrderWithDetails[]> = {};
  const requestIdCounts: Record<string, number> = {};

  // First pass: count orders per requestId
  filteredOrders?.forEach(order => {
    if (order.requestId) {
      requestIdCounts[order.requestId] = (requestIdCounts[order.requestId] || 0) + 1;
    }
  });

  // Second pass: only include batches with 2+ orders
  filteredOrders?.forEach(order => {
    if (order.requestId && requestIdCounts[order.requestId] >= 2) {
      if (!ordersGroupedByRequest[order.requestId]) {
        ordersGroupedByRequest[order.requestId] = [];
      }
      ordersGroupedByRequest[order.requestId].push(order);
    }
  });

  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link href="/admin/orders/purchase">
            <Button variant="ghost" size="icon" data-testid="button-back">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
              {t('admin.customOrders.title', 'Custom eSIM Orders')}
            </h1>
            <p className="text-sm md:text-base text-slate-500 dark:text-slate-400 mt-1">
              {t('admin.customOrders.description', 'View and assign pre-purchased eSIMs to customers')}
            </p>
          </div>
        </div>
        <Link href="/admin/purchase-orders">
          <Button className="w-full md:w-auto" data-testid="button-order-more">
            <PackageIcon className="h-4 w-4 mr-2" />
            {t('admin.customOrders.button.orderMore', 'Order More eSIMs')}
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <Card className="border-slate-200 dark:border-slate-800 shadow-sm dark:bg-slate-950">
        <CardContent className="pt-6">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder={t('admin.customOrders.search.placeholder', 'Search by order ID, request ID, or destination...')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800"
                  data-testid="input-search-orders"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800" data-testid="select-status-filter">
                <SelectValue placeholder={t('admin.customOrders.filter.status', 'Filter by status')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('admin.customOrders.filter.allStatuses', 'All Statuses')}</SelectItem>
                <SelectItem value="pending">{t('admin.customOrders.filter.pending', 'Pending')}</SelectItem>
                <SelectItem value="processing">{t('admin.customOrders.filter.processing', 'Processing')}</SelectItem>
                <SelectItem value="completed">{t('admin.customOrders.filter.completed', 'Completed')}</SelectItem>
                <SelectItem value="failed">{t('admin.customOrders.filter.failed', 'Failed')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Batch Orders Summary */}
      {Object.keys(ordersGroupedByRequest).length > 0 && (
        <Card className="border-slate-200 dark:border-slate-800 shadow-sm dark:bg-slate-950">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-slate-900 dark:text-slate-50">
              {t('admin.customOrders.batch.title', 'Batch Orders')}
            </CardTitle>
            <CardDescription className="text-slate-500 dark:text-slate-400">
              {t('admin.customOrders.batch.description', 'Orders grouped by request ID (asynchronous batch orders)')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {Object.entries(ordersGroupedByRequest).map(([requestId, orders]) => (
                <div
                  key={requestId}
                  className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 p-4 md:p-5"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4 pb-4 border-b border-slate-100 dark:border-slate-800">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-slate-900 dark:text-slate-50">
                          {t('admin.customOrders.batch.requestId', 'Request ID')}:
                        </span>
                        <code className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-xs font-mono text-slate-600 dark:text-slate-400">
                          {requestId}
                        </code>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        {t('admin.customOrders.batch.count', '{{count}} eSIM{{plural}} in batch', { count: orders.length, plural: orders.length > 1 ? 's' : '' })}
                      </p>
                    </div>
                    <Badge variant="outline" className={`${statusStyles[orders[0].status]} border-none px-3 py-1 capitalize`}>
                      {orders[0].status}
                    </Badge>
                  </div>
                  <div className="grid gap-3">
                    {orders.map((order, idx) => (
                      <div
                        key={order.id}
                        className="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 gap-4"
                        data-testid={`batch-order-${order.id}`}
                      >
                        <div className="flex items-center gap-4">
                          <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider min-w-[65px]">
                            {t('admin.customOrders.batch.esimNumber', 'eSIM #{{number}}', { number: idx + 1 })}
                          </span>
                          <div className="flex flex-wrap items-center gap-3">
                            {order.package.destination && (
                              <div className="flex items-center gap-2">
                                <span className="text-xl">{order.package.destination.flagEmoji}</span>
                                <span className="text-sm font-medium text-slate-900 dark:text-slate-50">
                                  {order.package.destination.name}
                                </span>
                              </div>
                            )}
                            {order.package.region && (
                              <div className="flex items-center gap-2">
                                <Globe className="h-4 w-4 text-slate-400" />
                                <span className="text-sm font-medium text-slate-900 dark:text-slate-50">
                                  {order.package.region.name}
                                </span>
                              </div>
                            )}
                            <div className="h-4 w-px bg-slate-200 dark:bg-slate-800 hidden sm:block" />
                            <span className="text-sm text-slate-600 dark:text-slate-400">
                              {order.dataAmount} • {order.validity} days
                            </span>
                          </div>
                        </div>
                        {order.status === "completed" && (
                          <Button
                            size="sm"
                            variant="secondary"
                            className="w-full sm:w-auto dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700"
                            onClick={() => handleAssignClick(order)}
                            data-testid={`button-assign-${order.id}`}
                          >
                            <UserPlus className="h-4 w-4 mr-2" />
                            {t('admin.customOrders.button.assign', 'Assign')}
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* All Custom Orders Table */}
      <Card className="border-slate-200 dark:border-slate-800 shadow-sm dark:bg-slate-950">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div>
            <CardTitle className="text-xl font-bold text-slate-900 dark:text-slate-50">
              {t('admin.customOrders.table.title', 'All Custom Orders')}
            </CardTitle>
            <CardDescription className="text-slate-500 dark:text-slate-400">
              {t('admin.customOrders.table.description', 'Complete list of unassigned eSIMs')}
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="h-64 flex flex-col items-center justify-center gap-3">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-second"></div>
              <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">{t('admin.customOrders.loading', 'Loading orders...')}</p>
            </div>
          ) : !filteredOrders || filteredOrders.length === 0 ? (
            <div className="py-12 flex flex-col items-center justify-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-50 dark:bg-slate-900">
                <PackageIcon className="h-8 w-8 text-slate-300 dark:text-slate-700" />
              </div>
              <div className="space-y-1 text-center">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50">{t('admin.customOrders.empty.title', 'No custom orders')}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 px-4 max-w-sm">
                  {t('admin.customOrders.empty.description', 'Order eSIMs to assign to customers')}
                </p>
              </div>
              <Link href="/admin/purchase-orders">
                <Button className="mt-2" variant="outline" data-testid="button-start-ordering">
                  <PackageIcon className="h-4 w-4 mr-2" />
                  {t('admin.customOrders.button.orderEsims', 'Order eSIMs')}
                </Button>
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto -mx-6 px-6">
              <Table>
                <TableHeader>
                  <TableRow className="border-slate-200 dark:border-slate-800 hover:bg-transparent">
                    <TableHead className="font-semibold text-slate-900 dark:text-slate-50">{t('admin.customOrders.table.orderId', 'Order ID')}</TableHead>
                    <TableHead className="font-semibold text-slate-900 dark:text-slate-50">{t('admin.customOrders.table.requestId', 'Request ID')}</TableHead>
                    <TableHead className="font-semibold text-slate-900 dark:text-slate-50">{t('admin.customOrders.table.destination', 'Destination')}</TableHead>
                    <TableHead className="font-semibold text-slate-900 dark:text-slate-50">{t('admin.customOrders.table.package', 'Package')}</TableHead>
                    <TableHead className="font-semibold text-slate-900 dark:text-slate-50">{t('admin.customOrders.table.iccid', 'ICCID')}</TableHead>
                    <TableHead className="font-semibold text-slate-900 dark:text-slate-50">{t('admin.customOrders.table.status', 'Status')}</TableHead>
                    <TableHead className="font-semibold text-slate-900 dark:text-slate-50 text-right">{t('admin.customOrders.table.action', 'Action')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.map((order) => (
                    <TableRow
                      key={order.id}
                      className="border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors"
                      data-testid={`row-order-${order.id}`}
                    >
                      <TableCell className="font-mono text-[10px] md:text-xs text-slate-500 dark:text-slate-400">
                        {formatDisplayOrderId(order.displayOrderId)}
                      </TableCell>
                      <TableCell className="font-mono text-[10px] md:text-xs text-slate-400 dark:text-slate-500">
                        {order.requestId ? `${order.requestId.slice(0, 8)}...` : t('admin.customOrders.table.na', 'N/A')}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 min-w-[140px]">
                          {order.package.destination && (
                            <>
                              <span className="text-lg">{order.package.destination.flagEmoji}</span>
                              <span className="font-medium text-slate-900 dark:text-slate-50">
                                {order.package.destination.name}
                              </span>
                            </>
                          )}
                          {order.package.region && (
                            <>
                              <Globe className="h-4 w-4 text-slate-400" />
                              <span className="font-medium text-slate-900 dark:text-white">
                                {order.package.region.name}
                              </span>
                            </>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-0.5 min-w-[80px]">
                          <span className="text-sm font-semibold text-slate-900 dark:text-slate-50">{order.dataAmount}</span>
                          <span className="text-[10px] md:text-xs text-slate-500 dark:text-slate-400 uppercase tracking-tight">{order.validity} days</span>
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-[10px] md:text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap">
                        {order.iccid || <span className="text-slate-300 dark:text-slate-700 italic">{t('admin.customOrders.table.pending', 'Pending')}</span>}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={`${statusStyles[order.status]} border-none text-[10px] md:text-xs px-2 py-0.5 capitalize`}>
                          {order.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        {order.status === "completed" ? (
                          <Button
                            size="sm"
                            className="h-8 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700"
                            onClick={() => handleAssignClick(order)}
                            data-testid={`button-assign-${order.id}`}
                          >
                            <UserPlus className="h-3.5 w-3.5 mr-1.5" />
                            {t('admin.customOrders.button.assign', 'Assign')}
                          </Button>
                        ) : (
                          <span className="text-[10px] md:text-xs text-slate-400 dark:text-slate-500 italic px-2">
                            {order.status === "processing" ? t('admin.customOrders.table.processingStatus', 'Processing...') : order.status}
                          </span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Assign Customer Dialog */}
      <Dialog open={assignDialogOpen} onOpenChange={setAssignDialogOpen}>
        <DialogContent className="sm:max-w-md p-0 overflow-hidden border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950" data-testid="dialog-assign-customer">
          <DialogHeader className="p-6 pb-0">
            <DialogTitle className="text-xl font-bold text-slate-900 dark:text-slate-50">
              {t('admin.customOrders.dialog.title', 'Assign eSIM to Customer')}
            </DialogTitle>
            <DialogDescription className="text-slate-500 dark:text-slate-400">
              {t('admin.customOrders.dialog.description', 'Select a customer to assign this eSIM')}
            </DialogDescription>
          </DialogHeader>

          {selectedOrder && (
            <div className="p-6 space-y-6">
              {/* Order Info Summary */}
              <div className="rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-4">
                <div className="flex items-center gap-4">
                  {selectedOrder.package.destination ? (
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white dark:bg-slate-800 shadow-sm border border-slate-100 dark:border-slate-700 text-2xl">
                      {selectedOrder.package.destination.flagEmoji}
                    </div>
                  ) : selectedOrder.package.region ? (
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white dark:bg-slate-800 shadow-sm border border-slate-100 dark:border-slate-700">
                      <Globe className="h-6 w-6 text-slate-400" />
                    </div>
                  ) : null}
                  
                  <div>
                    <p className="font-bold text-slate-900 dark:text-slate-50">
                      {selectedOrder.package.destination?.name || selectedOrder.package.region?.name}
                    </p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      {selectedOrder.dataAmount} • {selectedOrder.validity} days
                    </p>
                  </div>
                </div>
                {selectedOrder.iccid && (
                  <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-800">
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                      ICCID: <span className="font-mono text-slate-700 dark:text-slate-300 ml-1">{selectedOrder.iccid}</span>
                    </p>
                  </div>
                )}
              </div>

              {/* Customer Search Section */}
              <div className="space-y-3">
                <label className="text-sm font-semibold text-slate-900 dark:text-slate-50 ml-1">
                  {t('admin.customOrders.dialog.searchLabel', 'Search Customer')}
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    placeholder={t('admin.customOrders.dialog.searchPlaceholder', 'Search by name, email, or ID...')}
                    value={customerSearchQuery}
                    onChange={(e) => setCustomerSearchQuery(e.target.value)}
                    className="pl-9 bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 focus:ring-primary"
                    data-testid="input-search-customers"
                  />
                </div>
              </div>

              {/* Customer Selection List */}
              <div className="max-h-60 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
                {filteredCustomers && filteredCustomers.length > 0 ? (
                  filteredCustomers.map((customer) => (
                    <div
                      key={customer.id}
                      onClick={() => setSelectedCustomer(customer)}
                      className={`group p-3 rounded-xl cursor-pointer transition-all border ${selectedCustomer?.id === customer.id
                        ? "bg-primary/5 dark:bg-primary/10 border-primary ring-1 ring-primary/20"
                        : "bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                        }`}
                      data-testid={`customer-${customer.id}`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <p className={`font-semibold transition-colors ${selectedCustomer?.id === customer.id ? "text-primary" : "text-slate-900 dark:text-slate-50"}`}>
                            {customer.name || t('admin.customOrders.dialog.noName', 'No Name')}
                          </p>
                          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                            {customer.email}
                          </p>
                          <p className="text-[10px] font-mono text-slate-400 dark:text-slate-500 uppercase tracking-tight pt-1">
                            {formatDisplayUserId(customer.displayUserId)}
                          </p>
                        </div>
                        {selectedCustomer?.id === customer.id && (
                          <div className="bg-primary rounded-full p-1 shadow-sm">
                            <Check className="h-4 w-4 text-white" />
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-10 bg-slate-50/50 dark:bg-slate-900/50 rounded-xl border border-dashed border-slate-200 dark:border-slate-800">
                    <AlertCircle className="h-10 w-10 text-slate-300 dark:text-slate-700 mx-auto mb-3" />
                    <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                      {t('admin.customOrders.dialog.noCustomers', 'No customers found')}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          <DialogFooter className="p-6 bg-slate-50/50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-800 flex flex-row gap-3">
            <Button
              variant="outline"
              className="flex-1 bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800"
              onClick={() => setAssignDialogOpen(false)}
              data-testid="button-cancel-assign"
            >
              {t('admin.customOrders.dialog.cancel', 'Cancel')}
            </Button>
            <Button
              className="flex-1 shadow-md shadow-primary/20"
              onClick={handleAssign}
              disabled={!selectedCustomer || assignOrderMutation.isPending}
              data-testid="button-confirm-assign"
            >
              {assignOrderMutation.isPending ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  {t('admin.customOrders.dialog.assigning', 'Assigning...')}
                </>
              ) : (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  {t('admin.customOrders.dialog.assignButton', 'Assign eSIM')}
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
