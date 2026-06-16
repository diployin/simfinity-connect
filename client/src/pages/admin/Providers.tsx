import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import {
  Server,
  RefreshCw,
  Settings as SettingsIcon,
  Check,
  X,
  Clock,
  Package,
  Star,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { formatDistanceToNow } from 'date-fns';
import ProviderConfigModal from '@/components/admin/ProviderConfigModal';
import { useTranslation } from '@/contexts/TranslationContext';

interface Provider {
  id: string;
  name: string;
  slug: string;
  apiBaseUrl: string | null;
  enabled: boolean;
  isPreferred: boolean;
  pricingMargin: string;
  syncIntervalMinutes: number;
  lastSyncAt: string | null;
  apiRateLimitPerHour: number;
  webhookSecret: string | null;
  totalPackages: number | null;
  createdAt: string;
  updatedAt: string;
}

export default function Providers() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [syncingProvider, setSyncingProvider] = useState<string | null>(null);
  const [configModalOpen, setConfigModalOpen] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null);

  const { data: providers, isLoading } = useQuery<Provider[]>({
    queryKey: ['/api/admin/providers'],
  });

  const syncProviderMutation = useMutation({
    mutationFn: async (providerId: string) => {
      return await apiRequest('POST', `/api/admin/providers/${providerId}/sync`);
    },
    onSuccess: (_data, providerId) => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/providers'] });
      toast({
        title: t('admin.providers.syncCompletedTitle', 'Sync Completed'),
        description: t(
          'admin.providers.syncCompletedDescription',
          'Provider packages have been synchronized successfully.',
        ),
      });
      setSyncingProvider(null);
    },
    onError: (error: any, providerId) => {
      toast({
        title: t('admin.providers.syncFailedTitle', 'Sync Failed'),
        description:
          error.message ||
          t('admin.providers.syncFailedDescription', 'Failed to sync provider packages.'),
        variant: 'destructive',
      });
      setSyncingProvider(null);
    },
  });

  const runPriceComparisonMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest('POST', '/api/admin/providers/price-comparison');
    },
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/providers'] });
      toast({
        title: t('admin.providers.priceComparisonCompleteTitle', 'Price Comparison Complete'),
        description: t(
          'admin.providers.priceComparisonCompleteDescription',
          'Analyzed {{total}} packages, found {{best}} best price packages.',
          { total: data.totalPackages, best: data.bestPricePackages },
        ),
      });
    },
    onError: (error: any) => {
      toast({
        title: t('admin.providers.priceComparisonFailedTitle', 'Price Comparison Failed'),
        description:
          error.message ||
          t('admin.providers.priceComparisonFailedDescription', 'Failed to run price comparison.'),
        variant: 'destructive',
      });
    },
  });

  const handleSyncProvider = (providerId: string) => {
    setSyncingProvider(providerId);
    syncProviderMutation.mutate(providerId);
  };

  const getApiHealthStatus = (provider: Provider) => {
    if (!provider.enabled) {
      return {
        status: 'disabled',
        label: t('admin.providers.status.disabled', 'Disabled'),
        variant: 'outline' as const,
        className: 'border-muted-foreground/30 text-muted-foreground',
        icon: X,
      };
    }

    if (!provider.lastSyncAt) {
      return {
        status: 'pending',
        label: t('admin.providers.status.neverSynced', 'Never Synced'),
        variant: 'outline' as const,
        className: 'border-slate-500/30 bg-slate-500/10 text-slate-600',
        icon: Clock,
      };
    }

    const lastSync = new Date(provider.lastSyncAt);
    const now = new Date();
    const hoursSinceSync = (now.getTime() - lastSync.getTime()) / (1000 * 60 * 60);

    // If last sync was within 2x the sync interval, consider it healthy
    const healthyThreshold = (provider.syncIntervalMinutes / 60) * 2;

    if (hoursSinceSync < healthyThreshold) {
      return {
        status: 'healthy',
        label: t('admin.providers.status.healthy', 'Healthy'),
        variant: 'outline' as const,
        className: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-600',
        icon: Check,
      };
    }

    return {
      status: 'warning',
      label: t('admin.providers.status.stale', 'Stale'),
      variant: 'outline' as const,
      className: 'border-amber-500/30 bg-amber-500/10 text-amber-600',
      icon: X,
    };
  };

  const formatLastSync = (lastSyncAt: string | null) => {
    if (!lastSyncAt) return t('admin.providers.never', 'Never');
    try {
      return formatDistanceToNow(new Date(lastSyncAt), { addSuffix: true });
    } catch {
      return t('admin.providers.invalidDate', 'Invalid date');
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] p-6 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-second mb-4"></div>
        <p className="text-slate-500 dark:text-slate-400 font-medium">{t('admin.providers.loading', 'Loading providers...')}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 md:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
            {t('admin.providers.title', 'Provider Management')}
          </h1>
          <p className="text-sm md:text-base text-slate-500 dark:text-slate-400 mt-1">
            {t(
              'admin.providers.subtitle',
              'Manage eSIM providers, sync packages, and configure integrations',
            )}
          </p>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <Button
            variant="outline"
            className="w-full sm:w-auto h-10 gap-2 bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 shadow-sm"
            onClick={() => runPriceComparisonMutation.mutate()}
            disabled={runPriceComparisonMutation.isPending}
            data-testid="button-run-price-comparison"
          >
            <RefreshCw className={`h-4 w-4 ${runPriceComparisonMutation.isPending ? 'animate-spin' : ''}`} />
            <span className="whitespace-nowrap">{t('admin.providers.runPriceComparison', 'Run Price Comparison')}</span>
          </Button>
        </div>
      </div>

      <Card className="border-slate-200 dark:border-slate-800 shadow-sm dark:bg-slate-950">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl font-bold text-slate-900 dark:text-slate-50">
            {t('admin.providers.cardTitle', 'Providers')}
          </CardTitle>
          <CardDescription className="text-slate-500 dark:text-slate-400">
            {t('admin.providers.cardDescription', 'View and manage all eSIM provider integrations')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!providers || providers.length === 0 ? (
            <div className="py-12 flex flex-col items-center justify-center gap-4 text-center">
              <div className="h-16 w-16 rounded-full bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
                <Server className="h-8 w-8 text-slate-300 dark:text-slate-700" />
              </div>
              <p className="text-slate-500 dark:text-slate-400 font-medium">{t('admin.providers.noProviders', 'No providers configured')}</p>
            </div>
          ) : (
            <div className="overflow-x-auto -mx-6 px-6">
              <Table data-testid="table-providers">
                <TableHeader>
                  <TableRow className="border-slate-200 dark:border-slate-800 hover:bg-transparent">
                    <TableHead className="font-semibold text-slate-900 dark:text-slate-50">{t('admin.providers.table.provider', 'Provider')}</TableHead>
                    <TableHead className="font-semibold text-slate-900 dark:text-slate-50">{t('admin.providers.table.status', 'Status')}</TableHead>
                    <TableHead className="font-semibold text-slate-900 dark:text-slate-50">{t('admin.providers.table.apiHealth', 'API Health')}</TableHead>
                    <TableHead className="font-semibold text-slate-900 dark:text-slate-50">{t('admin.providers.table.lastSync', 'Last Sync')}</TableHead>
                    <TableHead className="font-semibold text-slate-900 dark:text-slate-50">{t('admin.providers.table.packages', 'Packages')}</TableHead>
                    <TableHead className="font-semibold text-slate-900 dark:text-slate-50">{t('admin.providers.table.syncInterval', 'Interval')}</TableHead>
                    <TableHead className="font-semibold text-slate-900 dark:text-slate-50">{t('admin.providers.table.margin', 'Margin')}</TableHead>
                    <TableHead className="font-semibold text-slate-900 dark:text-slate-50 text-right">
                      {t('admin.providers.table.actions', 'Actions')}
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {providers.map((provider) => {
                    const healthStatus = getApiHealthStatus(provider);
                    const HealthIcon = healthStatus.icon;

                    return (
                      <TableRow
                        key={provider.id}
                        data-testid={`row-provider-${provider.id}`}
                        className="border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors"
                      >
                        <TableCell>
                          <div className="min-w-[160px]">
                            <div className="font-bold text-slate-900 dark:text-slate-50 flex items-center gap-2">
                              {provider.name}
                              {provider.isPreferred && (
                                <Badge
                                  className="bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 border-none px-1.5 py-0 text-[10px] uppercase font-bold"
                                  data-testid={`badge-preferred-${provider.id}`}
                                >
                                  <Star className="h-2.5 w-2.5 mr-1 fill-current" />
                                  {t('admin.providers.preferred', 'Preferred')}
                                </Badge>
                              )}
                            </div>
                            <div className="text-xs font-mono text-slate-400 dark:text-slate-500 uppercase tracking-tight">{provider.slug}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={`border-none text-[10px] md:text-xs px-2 py-0.5 capitalize ${
                              provider.enabled
                                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400'
                                : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                            }`}
                            data-testid={`badge-status-${provider.id}`}
                          >
                            {provider.enabled
                              ? t('admin.providers.enabled', 'Enabled')
                              : t('admin.providers.disabled', 'Disabled')}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={`gap-1.5 border-none text-[10px] md:text-xs px-2 py-0.5 capitalize ${healthStatus.className || ''}`}
                            data-testid={`badge-health-${provider.id}`}
                          >
                            <HealthIcon className="h-3 w-3" />
                            {healthStatus.label}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="text-[10px] md:text-xs text-slate-500 dark:text-slate-400 font-medium whitespace-nowrap" data-testid={`text-last-sync-${provider.id}`}>
                            {formatLastSync(provider.lastSyncAt)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div
                            className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5"
                            data-testid={`text-total-packages-${provider.id}`}
                          >
                            <Package className="h-3.5 w-3.5 text-slate-400" />
                            {provider.totalPackages?.toLocaleString()}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                            <Clock className="h-3.5 w-3.5 opacity-50" />
                            {provider.syncIntervalMinutes < 60
                              ? `${provider.syncIntervalMinutes}m`
                              : `${(provider.syncIntervalMinutes / 60).toFixed(0)}h`}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                            {parseFloat(provider.pricingMargin).toFixed(1)}%
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="secondary"
                              size="sm"
                              className="h-8 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700/80"
                              onClick={() => handleSyncProvider(provider.id)}
                              disabled={!provider.enabled || syncingProvider === provider.id}
                              data-testid={`button-sync-${provider.id}`}
                            >
                              {syncingProvider === provider.id ? (
                                <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                              ) : (
                                <>
                                  <RefreshCw className="h-3.5 w-3.5 mr-1.5" />
                                  {t('admin.providers.sync', 'Sync')}
                                </>
                              )}
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-slate-400 hover:text-slate-900 dark:hover:text-slate-50"
                              onClick={() => {
                                setSelectedProvider(provider);
                                setConfigModalOpen(true);
                              }}
                              data-testid={`button-configure-${provider.id}`}
                            >
                              <SettingsIcon className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <ProviderConfigModal
        provider={selectedProvider}
        open={configModalOpen}
        onOpenChange={setConfigModalOpen}
      />
    </div>
  );
}
