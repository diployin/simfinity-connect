import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useDebounce } from '@/hooks/use-debounce';
import { Search, Download, Filter, ChevronLeft, ChevronRight, Plus } from 'lucide-react';
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from '@/contexts/TranslationContext';

const statusStyles: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
  processing: 'bg-primary/10 text-[var(--primary-dark)] dark:bg-[var(--primary-dark)]/30 dark:text-[var(--primary-light)]',
  completed: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  failed: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
};

export default function AdminTopupsPage() {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearch = useDebounce(searchQuery, 500);
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const { toast } = useToast();

  const { data, isLoading } = useQuery({
    queryKey: ['/api/admin/topups', currentPage, itemsPerPage, debouncedSearch, statusFilter],
    queryFn: async () => {
      const params = new URLSearchParams();
      params.append('page', currentPage.toString());
      params.append('limit', itemsPerPage.toString());
      if (debouncedSearch) params.append('search', debouncedSearch);
      if (statusFilter && statusFilter !== 'all') params.append('status', statusFilter);

      const res = await fetch(`/api/admin/topups?${params.toString()}`);
      if (!res.ok) throw new Error('Failed to fetch topups');
      return res.json();
    },
    keepPreviousData: true,
  });

  const topups = data?.topups || [];
  const pagination = data?.pagination || { page: 1, limit: 10, total: 0, totalPages: 1 };
  const stats = data?.stats || { totalRevenue: 0, totalCost: 0, totalProfit: 0 };

  // CSV Export Function
  const exportToCSV = async () => {
    try {
      const params = new URLSearchParams();
      params.append('limit', '10000'); // Fetch large batch for export
      if (debouncedSearch) params.append('search', debouncedSearch);
      if (statusFilter && statusFilter !== 'all') params.append('status', statusFilter);

      const res = await fetch(`/api/admin/topups?${params.toString()}`);
      if (!res.ok) throw new Error('Failed to fetch export data');

      const exportData = await res.json();
      const exportTopups = exportData.topups || [];

      if (exportTopups.length === 0) {
        toast({
          title: t('admin.topups.noData', 'No Data'),
          description: t('admin.topups.noTopupsToExport', 'There are no top-ups to export.'),
          variant: 'destructive',
        });
        return;
      }

      const headers = [
        t('admin.topups.topupId', 'Topup ID'),
        t('admin.topups.customerEmail', 'Customer Email'),
        t('admin.topups.iccid', 'ICCID'),
        t('admin.topups.package', 'Package'),
        t('admin.topups.dataAmount', 'Data Amount'),
        t('admin.topups.validityDays', 'Validity (Days)'),
        t('admin.topups.customerPrice', 'Customer Price'),
        t('admin.topups.airalosCost', 'Airalo Cost'),
        t('admin.topups.marginPercent', 'Margin (%)'),
        t('admin.topups.profit', 'Profit'),
        t('admin.topups.status', 'Status'),
        t('admin.topups.date', 'Date'),
      ];

      const rows = exportTopups.map((topup: any) => {
        const customerPrice = parseFloat(topup.customerPrice || '0');
        const airaloPrice = parseFloat(topup.airaloPrice || '0');
        const profit = (customerPrice - airaloPrice).toFixed(2);
        const margin = topup.margin || '40';

        return [
          topup.displayTopupId || topup.id,
          topup.user?.email || 'N/A',
          topup.iccid || 'N/A',
          topup.package?.title || `${topup.dataAmount} - ${topup.validity} Days`,
          topup.dataAmount || 'N/A',
          topup.validity || 'N/A',
          `$${topup.customerPrice}`,
          `$${topup.airaloPrice}`,
          `${margin}%`,
          `$${profit}`,
          topup.status,
          new Date(topup.createdAt).toLocaleString(),
        ];
      });

      const csvContent = [
        headers.join(','),
        ...rows.map((row: any[]) => row.map((cell) => `"${cell}"`).join(',')),
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `topups-export-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      toast({
        title: t('admin.topups.exportSuccessful', 'Export Successful'),
        description: t(
          'admin.topups.topupsExportedToCSV',
          `${exportTopups.length} top-ups exported to CSV`,
        ),
      });
    } catch (error) {
      toast({
        title: t('admin.topups.exportFailed', 'Export Failed'),
        description: t('admin.topups.failedToExport', 'Failed to export top-ups.'),
        variant: 'destructive',
      });
    }
  };

  const totalRevenue = stats.totalRevenue || 0;
  const totalCost = stats.totalCost || 0;
  const totalProfit = stats.totalProfit || 0;

  return (
    <div className="space-y-6 p-4 md:p-6 lg:p-8" data-testid="page-admin-topups">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
            {t('admin.topups.title', 'Top-Up Management')}
          </h1>
          <p className="text-sm md:text-base text-slate-500 dark:text-slate-400 mt-1">
            {t('admin.topups.description', 'Manage all top-up orders and track revenue')}
          </p>
        </div>
        <Button
          className="w-full md:w-auto h-10 shadow-sm"
          onClick={exportToCSV}
          disabled={!topups || topups.length === 0}
          data-testid="button-export-csv"
        >
          <Download className="mr-2 h-4 w-4" />
          {t('admin.topups.exportCSV', 'Export CSV')}
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="p-4 md:p-5 border-slate-200 dark:border-slate-800 shadow-sm dark:bg-slate-950">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs md:text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                {t('admin.topups.totalTopUps', 'Total Top-Ups')}
              </p>
              <p
                className="text-2xl font-bold text-slate-900 dark:text-slate-50 mt-1"
                data-testid="text-total-topups"
              >
                {pagination.total}
              </p>
            </div>
            <div className="bg-primary/10 p-2 rounded-lg">
              <Plus className="h-6 w-6 text-primary-second" />
            </div>
          </div>
        </Card>

        <Card className="p-4 md:p-5 border-slate-200 dark:border-slate-800 shadow-sm dark:bg-slate-950">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs md:text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                {t('admin.topups.totalRevenue', 'Total Revenue')}
              </p>
              <p
                className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1"
                data-testid="text-total-revenue"
              >
                ${totalRevenue.toFixed(2)}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4 md:p-5 border-slate-200 dark:border-slate-800 shadow-sm dark:bg-slate-950">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs md:text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                {t('admin.topups.totalCost', 'Total Cost')}
              </p>
              <p
                className="text-2xl font-bold text-orange-600 dark:text-orange-400 mt-1"
                data-testid="text-total-cost"
              >
                ${totalCost.toFixed(2)}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4 md:p-5 border-slate-200 dark:border-slate-800 shadow-sm dark:bg-slate-950">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs md:text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                {t('admin.topups.totalProfit', 'Total Profit')}
              </p>
              <p
                className="text-2xl font-bold text-green-600 dark:text-green-400 mt-1"
                data-testid="text-total-profit"
              >
                ${totalProfit.toFixed(2)}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="border-slate-200 dark:border-slate-800 shadow-sm dark:bg-slate-950">
        <div className="p-4 md:p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder={t(
                  'admin.topups.searchPlaceholder',
                  'Search by email, ICCID, or Topup ID...',
                )}
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-9 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800"
                data-testid="input-search"
              />
            </div>
            <Select 
              value={statusFilter} 
              onValueChange={(value) => {
                setStatusFilter(value);
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="w-full md:w-[200px] bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800" data-testid="select-status-filter">
                <SelectValue placeholder={t('admin.topups.filterByStatus', 'Filter by status')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('admin.topups.allStatuses', 'All Statuses')}</SelectItem>
                <SelectItem value="pending">{t('admin.topups.pending', 'Pending')}</SelectItem>
                <SelectItem value="processing">
                  {t('admin.topups.processing', 'Processing')}
                </SelectItem>
                <SelectItem value="completed">{t('admin.topups.completed', 'Completed')}</SelectItem>
                <SelectItem value="failed">{t('admin.topups.failed', 'Failed')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {/* Table */}
      <Card className="border-slate-200 dark:border-slate-800 shadow-sm dark:bg-slate-950 overflow-hidden">
        {isLoading ? (
          <div className="h-64 flex flex-col items-center justify-center gap-3">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-second"></div>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">{t('admin.topups.loadingTopups', 'Loading top-ups...')}</p>
          </div>
        ) : !topups || topups.length === 0 ? (
          <div className="py-12 flex flex-col items-center justify-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-50 dark:bg-slate-900">
              <Plus className="h-8 w-8 text-slate-300 dark:text-slate-700" />
            </div>
            <div className="space-y-1 text-center">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50">{t('admin.topups.noTopupsFound', 'No top-ups found')}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 px-4 max-w-sm">
                {searchQuery || statusFilter !== 'all'
                  ? t('admin.topups.tryAdjustingFilters', 'Try adjusting your filters')
                  : t('admin.topups.topupsWillAppear', 'Top-up orders will appear here')}
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
                      {t('admin.topups.topupId', 'Topup ID')}
                    </TableHead>
                    <TableHead className="font-semibold text-slate-900 dark:text-slate-50">
                      {t('admin.topups.customer', 'Customer')}
                    </TableHead>
                    <TableHead className="font-semibold text-slate-900 dark:text-slate-50">{t('admin.topups.iccid', 'ICCID')}</TableHead>
                    <TableHead className="font-semibold text-slate-900 dark:text-slate-50">
                      {t('admin.topups.package', 'Package')}
                    </TableHead>
                    <TableHead className="font-semibold text-slate-900 dark:text-slate-50">
                      {t('admin.topups.customerPrice', 'Customer Price')}
                    </TableHead>
                    <TableHead className="font-semibold text-slate-900 dark:text-slate-50">
                      {t('admin.topups.airalosCost', 'Airalo Cost')}
                    </TableHead>
                    <TableHead className="font-semibold text-slate-900 dark:text-slate-50">
                      {t('admin.topups.margin', 'Margin')}
                    </TableHead>
                    <TableHead className="font-semibold text-slate-900 dark:text-slate-50">
                      {t('admin.topups.profit', 'Profit')}
                    </TableHead>
                    <TableHead className="font-semibold text-slate-900 dark:text-slate-50">
                      {t('admin.topups.status', 'Status')}
                    </TableHead>
                    <TableHead className="font-semibold text-slate-900 dark:text-slate-50">{t('admin.topups.date', 'Date')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {topups.map((topup: any) => {
                    const customerPrice = parseFloat(topup.customerPrice || '0');
                    const airaloPrice = parseFloat(topup.airaloPrice || '0');
                    const profit = (customerPrice - airaloPrice).toFixed(2);
                    const profitColor =
                      parseFloat(profit) > 0
                        ? 'text-green-600 dark:text-green-400'
                        : 'text-red-600 dark:text-red-400';

                    return (
                      <TableRow
                        key={topup.id}
                        className="border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors"
                        data-testid={`row-topup-${topup.id}`}
                      >
                        <TableCell
                          className="font-mono text-[10px] md:text-xs text-slate-500 dark:text-slate-400 font-medium"
                          data-testid={`text-topup-id-${topup.id}`}
                        >
                          {topup.displayTopupId || topup.id.substring(0, 8)}
                        </TableCell>
                        <TableCell>
                          <div className="min-w-[150px]">
                            <p className="text-sm font-semibold text-slate-900 dark:text-slate-50">
                              {topup.user?.name || 'Unknown'}
                            </p>
                            <p className="text-[10px] md:text-xs text-slate-500 dark:text-slate-400">
                              {topup.user?.email || 'N/A'}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell className="font-mono text-[10px] md:text-xs text-slate-500 dark:text-slate-400">{topup.iccid || 'N/A'}</TableCell>
                        <TableCell>
                          <div className="flex flex-col gap-0.5 min-w-[120px]">
                            <div className="text-sm font-semibold text-slate-900 dark:text-slate-50 truncate max-w-[150px]">
                              {topup.package?.title || `${topup.dataAmount} - ${topup.validity} Days`}
                            </div>
                            <div className="text-[10px] md:text-xs text-slate-500 dark:text-slate-400 uppercase tracking-tight">
                              {topup.dataAmount} • {topup.validity} days
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="font-bold text-emerald-600 dark:text-emerald-400 text-sm">
                          ${topup.customerPrice}
                        </TableCell>
                        <TableCell className="font-medium text-orange-600 dark:text-orange-400 text-sm">
                          ${topup.airaloPrice}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="bg-slate-100 dark:bg-slate-800 border-none text-[10px] md:text-xs px-2 py-0.5 font-bold">
                            +{topup.margin || 40}%
                          </Badge>
                        </TableCell>
                        <TableCell className={`font-bold text-sm ${profitColor}`}>${profit}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className={`${statusStyles[topup.status]} border-none text-[10px] md:text-xs px-2 py-0.5 capitalize`}>
                            {topup.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-[10px] md:text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap font-medium">
                          {new Date(topup.createdAt).toLocaleDateString()}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            {pagination.total > itemsPerPage && (
              <div className="flex flex-col sm:flex-row items-center justify-between border-t border-slate-100 dark:border-slate-800 px-6 py-4 gap-4">
                <div className="text-xs md:text-sm text-slate-500 dark:text-slate-400 font-medium order-2 sm:order-1">
                  {t('admin.topups.showing', 'Showing')} {(currentPage - 1) * itemsPerPage + 1}{' '}
                  {t('admin.topups.to', 'to')}{' '}
                  {Math.min(currentPage * itemsPerPage, pagination.total)}{' '}
                  {t('admin.topups.of', 'of')} {pagination.total}{' '}
                  {t('admin.topups.topups', 'top-ups')}
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
                    {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                      let pageNum;
                      if (pagination.totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= pagination.totalPages - 2) {
                        pageNum = pagination.totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }

                      return (
                        <Button
                          key={pageNum}
                          variant={currentPage === pageNum ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setCurrentPage(pageNum)}
                          className={`h-8 w-8 p-0 ${currentPage === pageNum ? '' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'}`}
                          data-testid={`button-page-${pageNum}`}
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
                    onClick={() => setCurrentPage((p) => Math.min(pagination.totalPages, p + 1))}
                    disabled={currentPage >= pagination.totalPages}
                    data-testid="button-next-page"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </Card>
    </div>
  );
}
