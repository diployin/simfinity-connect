import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import {
  Search,
  Eye,
  Download,
  ChevronLeft,
  ChevronRight,
  UserCircle,
  Package,
  Activity,
  CheckCircle,
  XCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { apiRequest, queryClient } from '@/lib/queryClient';
import type { User, Order, Package as PackageType, Destination } from '@shared/schema';
import { MoreVertical } from 'lucide-react';
import { formatDisplayUserId, formatDisplayOrderId } from '@shared/utils';
import { useTranslation } from '@/contexts/TranslationContext';
import { useAdmin } from '@/hooks/use-admin';

type OrderWithDetails = Order & {
  package: PackageType & { destination?: Destination };
};



const userStatusStyles: Record<string, string> = {
  active: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  deleted: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
};


export default function CustomerManagement() {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [kycFilter, setKycFilter] = useState('all');
  const [selectedCustomer, setSelectedCustomer] = useState<User | null>(null);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [newCustomerEmail, setNewCustomerEmail] = useState('');
  const [newCustomerName, setNewCustomerName] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const { toast } = useToast();

  const { user } = useAdmin();

  // ---------------------------------------------------------------------------
  // UPDATED BACKEND DATA FETCHING (pagination + search + kycFilter)
  // ---------------------------------------------------------------------------

  const { data: customersRes, isLoading } = useQuery({
    queryKey: ['/api/admin/customers', currentPage, searchQuery, kycFilter],
    queryFn: () =>
      fetch(
        `/api/admin/customers?page=${currentPage}&limit=${itemsPerPage}&search=${searchQuery}&kycStatus=${kycFilter}`,
      ).then((res) => res.json()),
  });

  const customers = customersRes?.data?.data || [];
  const pagination = customersRes?.data?.pagination || {};
  const totalPages = pagination.totalPages || 1;
  const totalItems = pagination.total || 0;
  const stats = customersRes?.data?.stats || {};

  // console.log("Customers Res:", customersRes);

  // ---------------------------------------------------------------------------
  // Existing orders fetch
  // ---------------------------------------------------------------------------

  const { data: customerOrders } = useQuery<OrderWithDetails[]>({
    queryKey: ['/api/admin/orders', selectedCustomer?.id],
    enabled: !!selectedCustomer,
  });

  // ---------------------------------------------------------------------------
  // Mutations (UNCHANGED)
  // ---------------------------------------------------------------------------

  const updateKycMutation = useMutation({
    mutationFn: async ({ customerId, kycStatus }: { customerId: string; kycStatus: string }) => {
      return await apiRequest('PUT', `/api/admin/customers/${customerId}/kyc`, { kycStatus });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/customers'] });
      toast({
        title: t('common.success', 'Success'),
        description: t(
          'admin.customers.kycStatusUpdated',
          'Customer KYC status updated successfully',
        ),
      });
    },
    onError: (error: any) => {
      toast({
        title: t('common.error', 'Error'),
        description:
          error.message || t('admin.customers.failedToUpdateKyc', 'Failed to update KYC status'),
        variant: 'destructive',
      });
    },
  });

  const deleteCustomerMutation = useMutation({
    mutationFn: async (customerId: string) => {
      return await apiRequest('DELETE', `/api/admin/customers/${customerId}`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/customers'] });
      toast({
        title: t('common.success', 'Success'),
        description: t('admin.customers.deleteSuccess', 'Customer deleted successfully'),
      });
    },
    onError: (error: any) => {
      toast({
        title: t('common.error', 'Error'),
        description:
          error.message || t('admin.customers.failedToDelete', 'Failed to delete customer'),
        variant: 'destructive',
      });
    },
  });

  const createCustomerMutation = useMutation({
    mutationFn: async ({ email, name }: { email: string; name: string }) => {
      return await apiRequest('POST', '/api/admin/customers', { email, name });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/customers'] });
      setCreateDialogOpen(false);
      setNewCustomerEmail('');
      setNewCustomerName('');
      toast({
        title: t('common.success', 'Success'),
        description: t('admin.customers.createSuccess', 'Customer created successfully'),
      });
    },
    onError: (error: any) => {
      toast({
        title: t('common.error', 'Error'),
        description:
          error.message || t('admin.customers.failedToCreate', 'Failed to create customer'),
        variant: 'destructive',
      });
    },
  });

  // ---------------------------------------------------------------------------
  // CSV Export Function (UNCHANGED)
  // ---------------------------------------------------------------------------

  const exportToCSV = async () => {
    try {

      if (user?.email === "de****@di***") {
        return toast({
          title: t("comman.error", "Error"),
          description: "Demo users are not allowed to perform this action",
          variant: 'destructive',
        })
      }

      const res = await fetch(`/api/admin/customers?page=1&limit=1000000`);

      const json = await res.json();
      const allCustomers = json?.data?.data || [];

      if (!allCustomers.length) {
        toast({
          title: t('common.noData', 'No Data'),
          description: t(
            'admin.customers.noCustomersToExport',
            'There are no customers to export.',
          ),
          variant: 'destructive',
        });
        return;
      }

      const headers = [
        t('admin.customers.customerId', 'Customer ID'),
        t('common.name', 'Name'),
        t('common.email', 'Email'),
        t('admin.customers.phone', 'Phone'),
        t('admin.customers.address', 'Address'),
        t('admin.customers.kycStatus', 'KYC Status'),
        t('admin.customers.joinedDate', 'Joined Date'),
      ];

      const rows = allCustomers.map((customer) => [
        formatDisplayUserId(customer.displayUserId),
        customer.name || '',
        customer.email,
        customer.phone || '',
        customer.address || '',
        customer.kycStatus,
        new Date(customer.createdAt).toLocaleDateString(),
      ]);

      const csvContent = [
        headers.join(','),
        ...rows.map((row) => row.map((cell) => `"${cell}"`).join(',')),
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.href = url;
      link.download = `customers-${new Date().toISOString().split('T')[0]}.csv`;
      link.click();

      toast({
        title: t('admin.customers.exportSuccess', 'Export Successful'),
        description: t(
          'admin.customers.exportedCustomers',
          `Exported ${allCustomers.length} customers to CSV.`,
        ),
      });
    } catch (err) {
      toast({
        title: t('common.error', 'Error'),
        description: 'Failed to export customers.',
        variant: 'destructive',
      });
    }
  };

  // ---------------------------------------------------------------------------
  // KYC Status Styles (unchanged)
  // ---------------------------------------------------------------------------

  const kycStatusStyles: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
    verified: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    rejected: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
  };

  // ---------------------------------------------------------------------------
  // START OF JSX (UNCHANGED — FULL UI PRESERVED)
  // ---------------------------------------------------------------------------

  return (
    <div className="space-y-6 p-4 md:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
            {t('admin.customers.title', 'Customer Management')}
          </h1>
          <p className="text-sm md:text-base text-slate-500 dark:text-slate-400 mt-1">
            {t('admin.customers.description', 'View and manage all registered customers')}
          </p>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <Button 
            className="w-full sm:w-auto h-10 shadow-sm"
            onClick={() => setCreateDialogOpen(true)} 
            data-testid="button-create-customer"
          >
            {t('admin.customers.createCustomer', 'Create Customer')}
          </Button>
          <Button
            variant="outline"
            className="w-full sm:w-auto h-10 gap-2 bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 shadow-sm"
            onClick={exportToCSV}
            data-testid="button-export-customers"
          >
            <Download className="h-4 w-4" />
            <span className="whitespace-nowrap">{t('admin.customers.exportCustomers', 'Export Customers')}</span>
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
        <Card
          className="border-slate-200 dark:border-slate-800 shadow-sm p-5 bg-white dark:bg-slate-950"
          data-testid="card-total-customers-stat"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs md:text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                {t('admin.customers.totalCustomers', 'Total Customers')}
              </p>
              <h3
                className="text-2xl font-bold text-slate-900 dark:text-slate-50 mt-1"
                data-testid="text-total-customers-count"
              >
                {totalItems}
              </h3>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <UserCircle className="h-6 w-6 text-primary-second" />
            </div>
          </div>
        </Card>

        <Card
          className="border-slate-200 dark:border-slate-800 shadow-sm p-5 bg-white dark:bg-slate-950"
          data-testid="card-verified-customers"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs md:text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                {t('admin.customers.verified', 'Verified')}
              </p>
              <h3
                className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1"
                data-testid="text-verified-count"
              >
                {stats?.totalVerified}
              </h3>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 dark:bg-emerald-900/10">
              <CheckCircle className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
            </div>
          </div>
        </Card>

        <Card
          className="border-slate-200 dark:border-slate-800 shadow-sm p-5 bg-white dark:bg-slate-950"
          data-testid="card-pending-kyc"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs md:text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                {t('admin.customers.pendingKyc', 'Pending KYC')}
              </p>
              <h3
                className="text-2xl font-bold text-amber-600 dark:text-amber-400 mt-1"
                data-testid="text-pending-kyc-count"
              >
                {stats?.totalPending}
              </h3>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-50 dark:bg-amber-900/10">
              <Activity className="h-6 w-6 text-amber-600 dark:text-amber-400" />
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="border-slate-200 dark:border-slate-800 shadow-sm dark:bg-slate-950">
        <div className="p-4 md:p-6">
          <div className="grid gap-4 md:grid-cols-4 items-center">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder={t(
                    'admin.customers.searchPlaceholder',
                    'Search by name, email, or ID...',
                  )}
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="pl-9 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800"
                  data-testid="input-search-customers"
                />
              </div>
            </div>

            <Select
              value={kycFilter}
              onValueChange={(value) => {
                setKycFilter(value);
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800" data-testid="select-kyc-filter">
                <SelectValue
                  placeholder={t('admin.customers.filterByKyc', 'Filter by KYC status')}
                />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">
                  {t('admin.customers.allStatuses', 'All Statuses')}
                </SelectItem>
                <SelectItem value="pending">{t('common.pending', 'Pending')}</SelectItem>
                <SelectItem value="approved">
                  {t('admin.customers.approved', 'Approved')}
                </SelectItem>
                <SelectItem value="submitted">
                  {t('admin.customers.submitted', 'Submitted')}
                </SelectItem>
                <SelectItem value="rejected">
                  {t('admin.customers.rejected', 'Rejected')}
                </SelectItem>
                <SelectItem value="verified">
                  {t('admin.customers.verified', 'Verified')}
                </SelectItem>
              </SelectContent>
            </Select>

            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-none px-3 py-1 font-medium">
                {totalItems} {t('admin.customers.customers', 'customers')}
              </Badge>
            </div>
          </div>
        </div>
      </Card>

      {/* Customers Table */}
      <Card className="border-slate-200 dark:border-slate-800 shadow-sm dark:bg-slate-950 overflow-hidden">
        {isLoading ? (
          <div className="h-64 flex flex-col items-center justify-center gap-3">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-second"></div>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">{t('admin.customers.loadingCustomers', 'Loading customers...')}</p>
          </div>
        ) : customers.length === 0 ? (
          <div className="py-12 flex flex-col items-center justify-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-50 dark:bg-slate-900">
              <UserCircle className="h-8 w-8 text-slate-300 dark:text-slate-700" />
            </div>
            <div className="space-y-1 text-center">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50">{t('admin.customers.noCustomersFound', 'No customers found')}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 px-4 max-w-sm">
                {searchQuery || kycFilter !== 'all'
                  ? t('common.tryAdjustingFilters', 'Try adjusting your filters')
                  : t(
                    'admin.customers.customersWillAppear',
                    'Customers will appear here once they register',
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
                    <TableHead className="font-semibold text-slate-900 dark:text-slate-50">
                      {t('admin.customers.customerId', 'Customer ID')}
                    </TableHead>
                    <TableHead className="font-semibold text-slate-900 dark:text-slate-50">{t('common.name', 'Name')}</TableHead>
                    <TableHead className="font-semibold text-slate-900 dark:text-slate-50">{t('common.email', 'Email')}</TableHead>
                    <TableHead className="font-semibold text-slate-900 dark:text-slate-50">
                      {t('admin.customers.phone', 'Phone')}
                    </TableHead>
                    <TableHead className="font-semibold text-slate-900 dark:text-slate-50">
                      {t('admin.customers.kycStatus', 'KYC Status')}
                    </TableHead>
                    <TableHead className="font-semibold text-slate-900 dark:text-slate-50">
                      User Status
                    </TableHead>

                    <TableHead className="font-semibold text-slate-900 dark:text-slate-50">
                      {t('admin.customers.joined', 'Joined')}
                    </TableHead>
                    <TableHead className="font-semibold text-slate-900 dark:text-slate-50 text-right">
                      {t('common.actions', 'Actions')}
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {customers.map((customer) => (
                    <TableRow
                      key={customer.id}
                      className="border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors"
                      data-testid={`row-customer-${customer.id}`}
                    >
                      <TableCell className="font-mono text-[10px] md:text-xs text-slate-500 dark:text-slate-400 font-medium">
                        {formatDisplayUserId(customer.displayUserId)}
                      </TableCell>

                      <TableCell>
                        <div className="flex items-center gap-3 min-w-[150px]">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary-second text-xs font-bold border border-primary/20">
                            {customer.name?.charAt(0).toUpperCase() ||
                              customer.email.charAt(0).toUpperCase()}
                          </div>
                          <span className="font-semibold text-slate-900 dark:text-slate-50">
                            {customer.name || t('common.na', 'N/A')}
                          </span>
                        </div>
                      </TableCell>

                      <TableCell className="text-slate-600 dark:text-slate-400 text-sm min-w-[180px]">
                        {customer.email}
                      </TableCell>

                      <TableCell className="text-slate-600 dark:text-slate-400 text-sm min-w-[120px]">
                        {customer.phone || t('common.na', 'N/A')}
                      </TableCell>

                      <TableCell>
                        <Badge variant="outline" className={`${kycStatusStyles[customer.kycStatus]} border-none text-[10px] md:text-xs px-2 py-0.5 capitalize`}>
                          {customer.kycStatus}
                        </Badge>
                      </TableCell>


                      <TableCell>
                        <Badge
                          variant="outline"
                          className={`${
                            customer.isDeleted
                              ? userStatusStyles.deleted
                              : userStatusStyles.active
                          } border-none text-[10px] md:text-xs px-2 py-0.5 capitalize`}
                        >
                          {customer.isDeleted ? 'Deleted' : 'Active'}
                        </Badge>
                      </TableCell>


                      <TableCell className="text-[10px] md:text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap font-medium">
                        {new Date(customer.createdAt).toLocaleDateString()}
                      </TableCell>

                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-50"
                              data-testid={`button-actions-customer-${customer.id}`}
                            >
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>

                          <DropdownMenuContent align="end" className="w-48 dark:bg-slate-950 border-slate-200 dark:border-slate-800">
                            <DropdownMenuItem className="cursor-pointer" onClick={() => setSelectedCustomer(customer)}>
                              <Eye className="mr-2 h-4 w-4" />
                              {t('common.viewDetails', 'View Details')}
                            </DropdownMenuItem>

                            <DropdownMenuItem
                              className="cursor-pointer"
                              onClick={() =>
                                updateKycMutation.mutate({
                                  customerId: customer.id,
                                  kycStatus: 'verified',
                                })
                              }
                              disabled={
                                updateKycMutation.isPending || customer.kycStatus === 'verified'
                              }
                            >
                              {t('admin.customers.verifyKyc', 'Verify KYC')}
                            </DropdownMenuItem>

                            <DropdownMenuItem
                              className="cursor-pointer"
                              onClick={() =>
                                updateKycMutation.mutate({
                                  customerId: customer.id,
                                  kycStatus: 'rejected',
                                })
                              }
                              disabled={
                                updateKycMutation.isPending || customer.kycStatus === 'rejected'
                              }
                            >
                              {t('admin.customers.rejectKyc', 'Reject KYC')}
                            </DropdownMenuItem>

                            <DropdownMenuItem
                              className="text-red-600 cursor-pointer hover:text-red-700 dark:hover:text-red-400 focus:text-red-700 dark:focus:text-red-400"
                              onClick={() => {
                                if (
                                  confirm(
                                    t(
                                      'admin.customers.deleteConfirm',
                                      'Are you sure you want to delete this customer?',
                                    ),
                                  )
                                ) {
                                  deleteCustomerMutation.mutate(customer.id);
                                }
                              }}
                              disabled={deleteCustomerMutation.isPending}
                              data-testid={`button-delete-customer-${customer.id}`}
                            >
                              {t('admin.customers.deleteCustomer', 'Delete Customer')}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex flex-col sm:flex-row items-center justify-between border-t border-slate-100 dark:border-slate-800 px-6 py-4 gap-4">
                <div className="text-xs md:text-sm text-slate-500 dark:text-slate-400 font-medium order-2 sm:order-1">
                  {t('common.showing', 'Showing')} {(currentPage - 1) * itemsPerPage + 1}{' '}
                  {t('common.to', 'to')} {Math.min(currentPage * itemsPerPage, totalItems)}{' '}
                  {t('common.of', 'of')} {totalItems} {t('admin.customers.customers', 'customers')}
                </div>

                <div className="flex items-center gap-2 order-1 sm:order-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 w-8 p-0 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800"
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>

                  <div className="flex items-center gap-1">
                    {Array.from({ length: totalPages }, (_, i) => {
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
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </Card>

      {/* Create Customer Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent className="sm:max-w-md border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-0 overflow-hidden">
          <DialogHeader className="p-6 pb-0">
            <DialogTitle className="text-xl font-bold text-slate-900 dark:text-slate-50">
              {t('admin.customers.createNewCustomer', 'Create New Customer')}
            </DialogTitle>
            <DialogDescription className="text-slate-500 dark:text-slate-400">
              {t('admin.customers.addNewCustomer', 'Add a new customer to the system')}
            </DialogDescription>
          </DialogHeader>

          <div className="p-6 space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-900 dark:text-slate-50 ml-1">{t('common.email', 'Email')}</label>
              <Input
                value={newCustomerEmail}
                onChange={(e) => setNewCustomerEmail(e.target.value)}
                placeholder="customer@example.com"
                className="bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800"
                data-testid="input-create-customer-email"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-900 dark:text-slate-50 ml-1">{t('common.name', 'Name')}</label>
              <Input
                value={newCustomerName}
                onChange={(e) => setNewCustomerName(e.target.value)}
                placeholder="John Doe"
                className="bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800"
                data-testid="input-create-customer-name"
              />
            </div>

            <Button
              onClick={() =>
                createCustomerMutation.mutate({ email: newCustomerEmail, name: newCustomerName })
              }
              disabled={!newCustomerEmail || createCustomerMutation.isPending}
              className="w-full h-11 shadow-md shadow-primary/20"
              data-testid="button-submit-create-customer"
            >
              {createCustomerMutation.isPending ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>{t('admin.customers.creating', 'Creating...')}</span>
                </div>
              ) : (
                t('admin.customers.createCustomer', 'Create Customer')
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Customer Details Dialog */}
      <Dialog open={!!selectedCustomer} onOpenChange={() => setSelectedCustomer(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] p-0 overflow-hidden border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950" data-testid="dialog-customer-details">
          <DialogHeader className="p-6 pb-0">
            <DialogTitle className="text-xl font-bold text-slate-900 dark:text-slate-50">{t('admin.customers.customerDetails', 'Customer Details')}</DialogTitle>
            <DialogDescription className="text-slate-500 dark:text-slate-400">
              {t('admin.customers.completeInformation', 'Complete information about this customer')}
            </DialogDescription>
          </DialogHeader>

          {selectedCustomer && (
            <div className="flex flex-col h-full overflow-hidden">
              <div className="p-6 pb-0">
                <div className="flex items-center gap-4 p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary-second text-2xl font-bold border-2 border-primary/20">
                    {selectedCustomer.name?.charAt(0).toUpperCase() ||
                      selectedCustomer.email.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-slate-50">
                      {selectedCustomer.name || t('admin.customers.customer', 'Customer')}
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                      {selectedCustomer.email}
                    </p>
                  </div>
                </div>
              </div>

              {/* Tabs */}
              <Tabs defaultValue="details" className="flex-1 flex flex-col overflow-hidden p-6 pt-4">
                <TabsList className="grid w-full grid-cols-3 bg-slate-100/50 dark:bg-slate-900 p-1 rounded-xl mb-6">
                  <TabsTrigger value="details" className="rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800 data-[state=active]:shadow-sm" data-testid="tab-customer-details">
                    {t('admin.customers.details', 'Details')}
                  </TabsTrigger>
                  <TabsTrigger value="orders" className="rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800 data-[state=active]:shadow-sm" data-testid="tab-customer-orders">
                    {t('admin.customers.orders', 'Orders')} (
                    {customerOrders?.filter((o) => o.userId === selectedCustomer.id).length || 0})
                  </TabsTrigger>
                  <TabsTrigger value="activity" className="rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800 data-[state=active]:shadow-sm" data-testid="tab-customer-activity">
                    {t('admin.customers.activity', 'Activity')}
                  </TabsTrigger>
                </TabsList>

                <div className="flex-1 overflow-hidden">
                  <ScrollArea className="h-full pr-4 custom-scrollbar">
                    {/* Details Tab */}
                    <TabsContent value="details" className="space-y-8 mt-0 focus-visible:outline-none">
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div className="space-y-1">
                          <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                            {t('admin.customers.customerId', 'Customer ID')}
                          </p>
                          <p className="text-sm font-mono text-slate-700 dark:text-slate-300">
                            {formatDisplayUserId(selectedCustomer.displayUserId)}
                          </p>
                        </div>

                        <div className="space-y-1">
                          <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                            {t('admin.customers.kycStatus', 'KYC Status')}
                          </p>
                          <Badge
                            className={`${kycStatusStyles[selectedCustomer.kycStatus]} border-none px-2 py-0.5 capitalize`}
                            variant="outline"
                          >
                            {selectedCustomer.kycStatus}
                          </Badge>
                        </div>

                        <div className="space-y-1">
                          <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                            {t('admin.customers.phoneNumber', 'Phone Number')}
                          </p>
                          <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                            {selectedCustomer.phone || t('admin.customers.notProvided', 'Not provided')}
                          </p>
                        </div>

                        <div className="space-y-1">
                          <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                            {t('admin.customers.joinedDate', 'Joined Date')}
                          </p>
                          <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                            {new Date(selectedCustomer.createdAt).toLocaleDateString()}
                          </p>
                        </div>

                        <div className="space-y-1">
                          <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                            {t('admin.customers.address', 'Address')}
                          </p>
                          <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                            {selectedCustomer.address ||
                              t('admin.customers.notProvided', 'Not provided')}
                          </p>
                        </div>

                        <div className="space-y-1">
                          <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                            {t('admin.customers.lastUpdated', 'Last Updated')}
                          </p>
                          <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                            {new Date(selectedCustomer.updatedAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      {/* eSIM Statistics */}
                      <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                        <h4 className="text-sm font-bold text-slate-900 dark:text-slate-50">{t('admin.customers.esimStats', 'eSIM Statistics')}</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          <Card className="p-4 bg-slate-50 dark:bg-slate-900/50 border-slate-100 dark:border-slate-800 shadow-none">
                            <div className="flex items-center gap-2 mb-2">
                              <Package className="h-4 w-4 text-primary-second" />
                              <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                                Total eSIMs
                              </p>
                            </div>
                            <p className="text-2xl font-bold text-slate-900 dark:text-slate-50">
                              {customerOrders?.filter((o) => o.userId === selectedCustomer.id).length ||
                                0}
                            </p>
                          </Card>

                          <Card className="p-4 bg-emerald-50/50 dark:bg-emerald-900/10 border-emerald-100/50 dark:border-emerald-800/30 shadow-none">
                            <div className="flex items-center gap-2 mb-2">
                              <CheckCircle className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                              <p className="text-xs font-bold text-emerald-600/60 dark:text-emerald-400/60 uppercase tracking-wider">
                                Active eSIMs
                              </p>
                            </div>
                            <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                              {customerOrders?.filter(
                                (o) => o.userId === selectedCustomer.id && o.status === 'completed',
                              ).length || 0}
                            </p>
                          </Card>

                          <Card className="p-4 bg-slate-50 dark:bg-slate-900/50 border-slate-100 dark:border-slate-800 shadow-none">
                            <div className="flex items-center gap-2 mb-2">
                              <XCircle className="h-4 w-4 text-slate-400" />
                              <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                                Failed
                              </p>
                            </div>
                            <p className="text-2xl font-bold text-slate-600 dark:text-slate-400">
                              {customerOrders?.filter(
                                (o) => o.userId === selectedCustomer.id && o.status === 'failed',
                              ).length || 0}
                            </p>
                          </Card>
                        </div>
                      </div>
                    </TabsContent>

                    {/* Orders Tab */}
                    <TabsContent value="orders" className="mt-0 focus-visible:outline-none">
                      {customerOrders &&
                        customerOrders.filter((o) => o.userId === selectedCustomer.id).length > 0 ? (
                        <div className="space-y-4">
                          {customerOrders
                            .filter((o) => o.userId === selectedCustomer.id)
                            .map((order) => (
                              <Card
                                key={order.id}
                                className="p-4 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 shadow-sm hover:border-primary/30 transition-colors"
                                data-testid={`card-customer-order-${order.id}`}
                              >
                                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                                  <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-4">
                                      <span className="text-3xl filter drop-shadow-sm">
                                        {order.package.destination?.flagEmoji || '🌍'}
                                      </span>
                                      <div>
                                        <p className="font-bold text-slate-900 dark:text-slate-50">
                                          {order.package.destination?.name || 'Global'}
                                        </p>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                                          {order.dataAmount} • {order.validity} days
                                        </p>
                                      </div>
                                    </div>

                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
                                      <div className="space-y-1">
                                        <span className="text-slate-400 dark:text-slate-500 font-bold uppercase tracking-tight">
                                          Order ID
                                        </span>
                                        <p className="font-mono text-slate-700 dark:text-slate-300">
                                          {formatDisplayOrderId(order.displayOrderId)}
                                        </p>
                                      </div>

                                      <div className="space-y-1">
                                        <span className="text-slate-400 dark:text-slate-500 font-bold uppercase tracking-tight">
                                          Price
                                        </span>
                                        <p className="font-bold text-emerald-600 dark:text-emerald-400">${order.price}</p>
                                      </div>

                                      <div className="space-y-1">
                                        <span className="text-slate-400 dark:text-slate-500 font-bold uppercase tracking-tight">
                                          Date
                                        </span>
                                        <p className="text-slate-700 dark:text-slate-300">{new Date(order.createdAt).toLocaleDateString()}</p>
                                      </div>
                                    </div>

                                    {order.iccid && (
                                      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/50 space-y-1 text-xs">
                                        <span className="text-slate-400 dark:text-slate-500 font-bold uppercase tracking-tight">
                                          ICCID
                                        </span>
                                        <p className="font-mono text-slate-900 dark:text-slate-100 break-all bg-slate-50 dark:bg-slate-950 p-2 rounded-lg">
                                          {order.iccid}
                                        </p>
                                      </div>
                                    )}
                                  </div>

                                  <Badge
                                    className={`${
                                      order.status === 'completed'
                                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                                        : order.status === 'processing'
                                          ? 'bg-primary/10 text-primary-second dark:bg-primary/20 dark:text-primary-second'
                                          : order.status === 'failed'
                                            ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                                            : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                                    } border-none px-3 py-1 capitalize self-start`}
                                    variant="outline"
                                  >
                                    {order.status}
                                  </Badge>
                                </div>
                              </Card>
                            ))}
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center py-20 bg-slate-50/50 dark:bg-slate-900/30 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
                          <Package className="h-12 w-12 text-slate-300 dark:text-slate-700 mb-3" />
                          <p className="font-bold text-slate-900 dark:text-slate-50">No Orders Yet</p>
                          <p className="text-sm text-slate-500 dark:text-slate-400">
                            This customer hasn't made any purchases
                          </p>
                        </div>
                      )}
                    </TabsContent>

                    {/* Activity Tab */}
                    <TabsContent value="activity" className="mt-0 focus-visible:outline-none">
                      <div className="relative pl-6 ml-3 border-l-2 border-slate-100 dark:border-slate-800 space-y-8">
                        <div className="relative" data-testid="activity-account-created">
                          <div className="absolute -left-[35px] top-0 flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 dark:bg-primary/20 border-4 border-white dark:border-slate-950">
                            <UserCircle className="h-4 w-4 text-primary-second" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-bold text-slate-900 dark:text-slate-50">Account Created</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                              {new Date(selectedCustomer.createdAt).toLocaleDateString()} at{' '}
                              {new Date(selectedCustomer.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </p>
                          </div>
                        </div>

                        <div className="relative" data-testid="activity-kyc-status">
                          <div
                            className={`absolute -left-[35px] top-0 flex h-8 w-8 items-center justify-center rounded-full border-4 border-white dark:border-slate-950 ${selectedCustomer.kycStatus === 'verified'
                                ? 'bg-green-100 dark:bg-green-900/30'
                                : selectedCustomer.kycStatus === 'rejected'
                                  ? 'bg-red-100 dark:bg-red-900/30'
                                  : 'bg-yellow-100 dark:bg-yellow-900/30'
                              }`}
                          >
                            <Activity
                              className={`h-4 w-4 ${selectedCustomer.kycStatus === 'verified'
                                  ? 'text-green-600 dark:text-green-400'
                                  : selectedCustomer.kycStatus === 'rejected'
                                    ? 'text-red-600 dark:text-red-400'
                                    : 'text-yellow-600 dark:text-yellow-400'
                                }`}
                            />
                          </div>

                          <div className="flex-1">
                            <p className="text-sm font-bold text-slate-900 dark:text-slate-50">
                              KYC Status: <span className="capitalize">{selectedCustomer.kycStatus}</span>
                            </p>
                            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                              Current verification status
                            </p>
                          </div>
                        </div>

                        {customerOrders
                          ?.filter((o) => o.userId === selectedCustomer.id)
                          .map((order) => (
                            <div
                              key={order.id}
                              className="relative"
                              data-testid={`activity-order-${order.id}`}
                            >
                              <div className="absolute -left-[35px] top-0 flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 border-4 border-white dark:border-slate-950">
                                <Package className="h-4 w-4 text-slate-500" />
                              </div>

                              <div className="flex-1">
                                <p className="text-sm font-bold text-slate-900 dark:text-slate-50">
                                  Purchased eSIM for {order.package.destination?.name || 'Global'}
                                </p>
                                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                                  {new Date(order.createdAt).toLocaleDateString()} • ${order.price} •{' '}
                                  <span className="capitalize">{order.status}</span>
                                </p>
                              </div>
                            </div>
                          ))}

                        {(!customerOrders ||
                          customerOrders.filter((o) => o.userId === selectedCustomer.id).length ===
                          0) && (
                            <div className="flex flex-col items-center justify-center py-8 text-center ml-[-24px]">
                              <Activity className="h-10 w-10 text-slate-300 dark:text-slate-700 mb-2" />
                              <p className="text-sm font-bold text-slate-900 dark:text-slate-50">
                                No Recent Activity
                              </p>
                            </div>
                          )}
                      </div>
                    </TabsContent>
                  </ScrollArea>
                </div>
              </Tabs>

              <div className="p-6 bg-slate-50/50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                <Button
                  className="w-full sm:w-auto"
                  variant="outline"
                  onClick={() => setSelectedCustomer(null)}
                >
                  {t('common.close', 'Close')}
                </Button>
              </div>
              </div>
              )}
              </DialogContent>
              </Dialog>
              </div>
              );
              }
