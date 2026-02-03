import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
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
  processing: 'bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-400',
  completed: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  failed: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
};

export default function AdminTopupsPage() {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const { toast } = useToast();

  const { data: topups, isLoading } = useQuery<any[]>({
    queryKey: ['/api/topups'],
  });

  // CSV Export Function
  const exportToCSV = () => {
    if (!topups || topups.length === 0) {
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

    const rows = filteredTopups?.map((topup) => {
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
      ...(rows || []).map((row) => row.map((cell) => `"${cell}"`).join(',')),
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
        `${filteredTopups?.length} top-ups exported to CSV`,
      ),
    });
  };

  // Filter topups
  const filteredTopups = topups?.filter((topup) => {
    const matchesSearch =
      topup.user?.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      false ||
      topup.iccid?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      false ||
      topup.displayTopupId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      false;

    const matchesStatus = statusFilter === 'all' || topup.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Pagination
  const totalPages = Math.ceil((filteredTopups?.length || 0) / itemsPerPage);
  const paginatedTopups = filteredTopups?.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  // Calculate totals
  const totalRevenue =
    filteredTopups?.reduce((sum, topup) => sum + parseFloat(topup.customerPrice || '0'), 0) || 0;
  const totalCost =
    filteredTopups?.reduce((sum, topup) => sum + parseFloat(topup.airaloPrice || '0'), 0) || 0;
  const totalProfit = totalRevenue - totalCost;

  return (
    <div className="space-y-6 p-6" data-testid="page-admin-topups">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground ">
            {t('admin.topups.title', 'Top-Up Management')}
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            {t('admin.topups.description', 'Manage all top-up orders and track revenue')}
          </p>
        </div>
        <Button
          onClick={exportToCSV}
          disabled={!topups || topups.length === 0}
          data-testid="button-export-csv"
        >
          <Download className="mr-2 h-4 w-4" />
          {t('admin.topups.exportCSV', 'Export CSV')}
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                {t('admin.topups.totalTopUps', 'Total Top-Ups')}
              </p>
              <p
                className="text-2xl font-bold text-slate-900 dark:text-white mt-1"
                data-testid="text-total-topups"
              >
                {filteredTopups?.length || 0}
              </p>
            </div>
            <Plus className="h-8 w-8 text-teal-600 opacity-75" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
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

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
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

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
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
      <Card className="p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder={t(
                'admin.topups.searchPlaceholder',
                'Search by email, ICCID, or Topup ID...',
              )}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
              data-testid="input-search"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full md:w-[200px]" data-testid="select-status-filter">
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
      </Card>

      {/* Table */}
      <Card className="border-0 shadow-lg">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-slate-200 dark:border-slate-800">
                <TableHead className="font-semibold">
                  {t('admin.topups.topupId', 'Topup ID')}
                </TableHead>
                <TableHead className="font-semibold">
                  {t('admin.topups.customer', 'Customer')}
                </TableHead>
                <TableHead className="font-semibold">{t('admin.topups.iccid', 'ICCID')}</TableHead>
                <TableHead className="font-semibold">
                  {t('admin.topups.package', 'Package')}
                </TableHead>
                <TableHead className="font-semibold">
                  {t('admin.topups.customerPrice', 'Customer Price')}
                </TableHead>
                <TableHead className="font-semibold">
                  {t('admin.topups.airalosCost', 'Airalo Cost')}
                </TableHead>
                <TableHead className="font-semibold">
                  {t('admin.topups.margin', 'Margin')}
                </TableHead>
                <TableHead className="font-semibold">
                  {t('admin.topups.profit', 'Profit')}
                </TableHead>
                <TableHead className="font-semibold">
                  {t('admin.topups.status', 'Status')}
                </TableHead>
                <TableHead className="font-semibold">{t('admin.topups.date', 'Date')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={10} className="h-64 text-center">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        {t('admin.topups.loadingTopups', 'Loading top-ups...')}
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : !paginatedTopups || paginatedTopups.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={10} className="h-64 text-center">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800">
                        <Plus className="h-8 w-8 text-slate-400" />
                      </div>
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                        {t('admin.topups.noTopupsFound', 'No top-ups found')}
                      </h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        {searchQuery || statusFilter !== 'all'
                          ? t('admin.topups.tryAdjustingFilters', 'Try adjusting your filters')
                          : t('admin.topups.topupsWillAppear', 'Top-up orders will appear here')}
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                paginatedTopups.map((topup) => {
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
                      className="border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900/50"
                      data-testid={`row-topup-${topup.id}`}
                    >
                      <TableCell
                        className="font-mono text-xs font-medium"
                        data-testid={`text-topup-id-${topup.id}`}
                      >
                        {topup.displayTopupId || topup.id.substring(0, 8)}
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium text-slate-900 dark:text-white">
                            {topup.user?.name || 'Unknown'}
                          </p>
                          <p className="text-xs text-slate-600 dark:text-slate-400">
                            {topup.user?.email || 'N/A'}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-xs">{topup.iccid || 'N/A'}</TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div className="font-medium text-slate-900 dark:text-white">
                            {topup.package?.title || `${topup.dataAmount} - ${topup.validity} Days`}
                          </div>
                          <div className="text-xs text-slate-600 dark:text-slate-400">
                            {topup.dataAmount} • {topup.validity} days
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="font-semibold text-emerald-600 dark:text-emerald-400">
                        ${topup.customerPrice}
                      </TableCell>
                      <TableCell className="font-medium text-orange-600 dark:text-orange-400">
                        ${topup.airaloPrice}
                      </TableCell>
                      <TableCell className="text-sm">
                        <Badge variant="outline">+{topup.margin || 40}%</Badge>
                      </TableCell>
                      <TableCell className={`font-semibold ${profitColor}`}>${profit}</TableCell>
                      <TableCell>
                        <Badge className={statusStyles[topup.status]} variant="outline">
                          {topup.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-slate-600 dark:text-slate-400">
                        {new Date(topup.createdAt).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {filteredTopups && filteredTopups.length > itemsPerPage && (
          <div className="flex items-center justify-between border-t border-slate-200 dark:border-slate-800 px-6 py-4">
            <div className="text-sm text-slate-600 dark:text-slate-400">
              {t('admin.topups.showing', 'Showing')} {(currentPage - 1) * itemsPerPage + 1}{' '}
              {t('admin.topups.to', 'to')}{' '}
              {Math.min(currentPage * itemsPerPage, filteredTopups.length)}{' '}
              {t('admin.topups.of', 'of')} {filteredTopups.length}{' '}
              {t('admin.topups.topups', 'top-ups')}
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
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
                      className="w-8"
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
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage >= totalPages}
                data-testid="button-next-page"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
