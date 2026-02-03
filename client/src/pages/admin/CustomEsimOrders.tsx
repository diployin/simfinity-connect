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
  processing: "bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-400",
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
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/admin/orders/purchase">
            <Button variant="ghost" size="icon" data-testid="button-back">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              {t('admin.customOrders.title', 'Custom eSIM Orders')}
            </h1>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              {t('admin.customOrders.description', 'View and assign pre-purchased eSIMs to customers')}
            </p>
          </div>
        </div>
        <Link href="/admin/purchase-orders">
          <Button data-testid="button-order-more">
            <PackageIcon className="h-4 w-4 mr-2" />
            {t('admin.customOrders.button.orderMore', 'Order More eSIMs')}
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <Card className="border-0 shadow-lg">
        <CardContent className="pt-6">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder={t('admin.customOrders.search.placeholder', 'Search by order ID, request ID, or destination...')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 bg-slate-50 dark:bg-slate-900"
                  data-testid="input-search-orders"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="bg-slate-50 dark:bg-slate-900" data-testid="select-status-filter">
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
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle>{t('admin.customOrders.batch.title', 'Batch Orders')}</CardTitle>
            <CardDescription>
              {t('admin.customOrders.batch.description', 'Orders grouped by request ID (asynchronous batch orders)')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(ordersGroupedByRequest).map(([requestId, orders]) => (
                <div
                  key={requestId}
                  className="rounded-lg border border-slate-200 dark:border-slate-800 p-4"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="text-sm font-medium text-slate-900 dark:text-white">
                        {t('admin.customOrders.batch.requestId', 'Request ID')}: <span className="font-mono text-xs">{requestId}</span>
                      </p>
                      <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                        {t('admin.customOrders.batch.count', '{{count}} eSIM{{plural}} in batch', { count: orders.length, plural: orders.length > 1 ? 's' : '' })}
                      </p>
                    </div>
                    <Badge variant="outline" className={statusStyles[orders[0].status]}>
                      {orders[0].status}
                    </Badge>
                  </div>
                  <div className="grid gap-2">
                    {orders.map((order, idx) => (
                      <div
                        key={order.id}
                        className="flex items-center justify-between p-2 rounded bg-slate-50 dark:bg-slate-900"
                        data-testid={`batch-order-${order.id}`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-medium text-slate-600 dark:text-slate-400 min-w-[60px]">
                            {t('admin.customOrders.batch.esimNumber', 'eSIM #{{number}}', { number: idx + 1 })}
                          </span>
                          {order.package.destination && (
                            <div className="flex items-center gap-2">
                              <span className="text-lg">{order.package.destination.flagEmoji}</span>
                              <span className="text-sm font-medium text-slate-900 dark:text-white">
                                {order.package.destination.name}
                              </span>
                            </div>
                          )}
                          {order.package.region && (
                            <div className="flex items-center gap-2">
                              <Globe className="h-4 w-4 text-slate-400" />
                              <span className="text-sm font-medium text-slate-900 dark:text-white">
                                {order.package.region.name}
                              </span>
                            </div>
                          )}
                          <span className="text-sm text-slate-600 dark:text-slate-400">
                            {order.dataAmount} • {order.validity} days
                          </span>
                        </div>
                        {order.status === "completed" && (
                          <Button
                            size="sm"
                            variant="outline"
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
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle>{t('admin.customOrders.table.title', 'All Custom Orders')}</CardTitle>
          <CardDescription>
            {t('admin.customOrders.table.description', 'Complete list of unassigned eSIMs')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-slate-200 dark:border-slate-800">
                  <TableHead className="font-semibold">{t('admin.customOrders.table.orderId', 'Order ID')}</TableHead>
                  <TableHead className="font-semibold">{t('admin.customOrders.table.requestId', 'Request ID')}</TableHead>
                  <TableHead className="font-semibold">{t('admin.customOrders.table.destination', 'Destination')}</TableHead>
                  <TableHead className="font-semibold">{t('admin.customOrders.table.package', 'Package')}</TableHead>
                  <TableHead className="font-semibold">{t('admin.customOrders.table.iccid', 'ICCID')}</TableHead>
                  <TableHead className="font-semibold">{t('admin.customOrders.table.status', 'Status')}</TableHead>
                  <TableHead className="font-semibold text-right">{t('admin.customOrders.table.action', 'Action')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-64 text-center">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
                        <p className="text-sm text-slate-600 dark:text-slate-400">{t('admin.customOrders.loading', 'Loading orders...')}</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : !filteredOrders || filteredOrders.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-64 text-center">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800">
                          <PackageIcon className="h-8 w-8 text-slate-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{t('admin.customOrders.empty.title', 'No custom orders')}</h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          {t('admin.customOrders.empty.description', 'Order eSIMs to assign to customers')}
                        </p>
                        <Link href="/admin/orders/purchase">
                          <Button className="mt-4" data-testid="button-start-ordering">
                            <PackageIcon className="h-4 w-4 mr-2" />
                            {t('admin.customOrders.button.orderEsims', 'Order eSIMs')}
                          </Button>
                        </Link>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredOrders.map((order) => (
                    <TableRow
                      key={order.id}
                      className="border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900/50"
                      data-testid={`row-order-${order.id}`}
                    >
                      <TableCell className="font-mono text-xs">
                        {formatDisplayOrderId(order.displayOrderId)}
                      </TableCell>
                      <TableCell className="font-mono text-xs text-slate-600 dark:text-slate-400">
                        {order.requestId ? `${order.requestId.slice(0, 8)}...` : t('admin.customOrders.table.na', 'N/A')}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {order.package.destination && (
                            <>
                              <span className="text-xl">{order.package.destination.flagEmoji}</span>
                              <span className="font-medium text-slate-900 dark:text-white">
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
                        <div className="text-sm">
                          <div className="font-medium text-slate-900 dark:text-white">{order.dataAmount}</div>
                          <div className="text-xs text-slate-600 dark:text-slate-400">{order.validity} days</div>
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-xs text-slate-600 dark:text-slate-400">
                        {order.iccid || t('admin.customOrders.table.pending', 'Pending')}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={statusStyles[order.status]}>
                          {order.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        {order.status === "completed" ? (
                          <Button
                            size="sm"
                            onClick={() => handleAssignClick(order)}
                            data-testid={`button-assign-${order.id}`}
                          >
                            <UserPlus className="h-4 w-4 mr-2" />
                            {t('admin.customOrders.button.assign', 'Assign')}
                          </Button>
                        ) : (
                          <Badge variant="outline" className="text-xs">
                            {order.status === "processing" ? t('admin.customOrders.table.processingStatus', 'Processing...') : order.status}
                          </Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Assign Customer Dialog */}
      <Dialog open={assignDialogOpen} onOpenChange={setAssignDialogOpen}>
        <DialogContent className="sm:max-w-md" data-testid="dialog-assign-customer">
          <DialogHeader>
            <DialogTitle>{t('admin.customOrders.dialog.title', 'Assign eSIM to Customer')}</DialogTitle>
            <DialogDescription>
              {t('admin.customOrders.dialog.description', 'Select a customer to assign this eSIM')}
            </DialogDescription>
          </DialogHeader>

          {selectedOrder && (
            <div className="space-y-4">
              {/* Order Info */}
              <div className="rounded-lg bg-slate-50 dark:bg-slate-900 p-4">
                <div className="flex items-center gap-3">
                  {selectedOrder.package.destination && (
                    <>
                      <span className="text-2xl">{selectedOrder.package.destination.flagEmoji}</span>
                      <div>
                        <p className="font-semibold text-slate-900 dark:text-white">
                          {selectedOrder.package.destination.name}
                        </p>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          {selectedOrder.dataAmount} • {selectedOrder.validity} days
                        </p>
                      </div>
                    </>
                  )}
                  {selectedOrder.package.region && (
                    <>
                      <Globe className="h-8 w-8 text-slate-400" />
                      <div>
                        <p className="font-semibold text-slate-900 dark:text-white">
                          {selectedOrder.package.region.name}
                        </p>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          {selectedOrder.dataAmount} • {selectedOrder.validity} days
                        </p>
                      </div>
                    </>
                  )}
                </div>
                {selectedOrder.iccid && (
                  <div className="mt-2 pt-2 border-t border-slate-200 dark:border-slate-700">
                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      ICCID: <span className="font-mono">{selectedOrder.iccid}</span>
                    </p>
                  </div>
                )}
              </div>

              {/* Customer Search */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-900 dark:text-white">
                  {t('admin.customOrders.dialog.searchLabel', 'Search Customer')}
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    placeholder={t('admin.customOrders.dialog.searchPlaceholder', 'Search by name, email, or customer ID...')}
                    value={customerSearchQuery}
                    onChange={(e) => setCustomerSearchQuery(e.target.value)}
                    className="pl-9 bg-slate-50 dark:bg-slate-900"
                    data-testid="input-search-customers"
                  />
                </div>
              </div>

              {/* Customer List */}
              <div className="max-h-64 overflow-y-auto space-y-2 border border-slate-200 dark:border-slate-800 rounded-lg p-2">
                {filteredCustomers && filteredCustomers.length > 0 ? (
                  filteredCustomers.map((customer) => (
                    <div
                      key={customer.id}
                      onClick={() => setSelectedCustomer(customer)}
                      className={`p-3 rounded-lg cursor-pointer transition-colors ${selectedCustomer?.id === customer.id
                        ? "bg-teal-100 dark:bg-teal-900/30 border border-teal-500"
                        : "bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800"
                        }`}
                      data-testid={`customer-${customer.id}`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-slate-900 dark:text-white">
                            {customer.name || t('admin.customOrders.dialog.noName', 'No Name')}
                          </p>
                          <p className="text-xs text-slate-600 dark:text-slate-400">
                            {customer.email}
                          </p>
                          <p className="text-xs font-mono text-slate-500 dark:text-slate-500 mt-0.5">
                            {formatDisplayUserId(customer.displayUserId)}
                          </p>
                        </div>
                        {selectedCustomer?.id === customer.id && (
                          <Check className="h-5 w-5 text-teal-600" />
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <AlertCircle className="h-8 w-8 text-slate-400 mx-auto mb-2" />
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      {t('admin.customOrders.dialog.noCustomers', 'No customers found')}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setAssignDialogOpen(false)}
              data-testid="button-cancel-assign"
            >
              {t('admin.customOrders.dialog.cancel', 'Cancel')}
            </Button>
            <Button
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
