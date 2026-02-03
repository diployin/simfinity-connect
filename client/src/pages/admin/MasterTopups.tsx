import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { RefreshCw, Search, Server, Package, Globe, MapPin, Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";

interface Provider {
  id: string;
  name: string;
  slug: string;
  enabled: boolean;
  lastSyncAt: string | null;
}

interface TopupPackage {
  id: string;
  title: string;
  dataAmount: string;
  validity: number;
  price: string;
  currency: string;
  type: string;
  operator: string | null;
  operatorImage: string | null;
  destinationName: string | null;
  regionName: string | null;
  active: boolean;
  provider: string;
  providerName: string;
  createdAt: string;
  parentPackageId: string | null;
  parentOperator: string | null;
  hasParentPackage: boolean;
}

interface TopupsResponse {
  success: boolean;
  data: TopupPackage[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  stats: {
    airalo: number;
    esimAccess: number;
    esimGo: number;
    maya: number;
    total: number;
  };
}

// Format data amount for display - handles eSIM Go's "-1" for unlimited
function formatDataAmount(dataAmount: string): string {
  if (!dataAmount) return "-";
  
  // eSIM Go uses "-1" or "-1MB" to mean unlimited
  if (dataAmount === "-1" || dataAmount === "-1MB" || dataAmount === "-1 MB") {
    return "Unlimited";
  }
  
  // Already formatted as "Unlimited"
  if (dataAmount.toLowerCase() === "unlimited") {
    return "Unlimited";
  }
  
  // Return as-is for normal data amounts (e.g., "1GB", "500MB")
  return dataAmount;
}

export default function MasterTopups() {
  const { toast } = useToast();
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [providerFilter, setProviderFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [syncingProviderId, setSyncingProviderId] = useState<string | null>(null);
  const itemsPerPage = 50;

  // Debounce search - wait 300ms after user stops typing
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchInput);
      setCurrentPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const { data: providers, isLoading: loadingProviders } = useQuery<{
    success: boolean;
    data: Provider[];
  }>({
    queryKey: ["/api/admin/providers"],
    queryFn: async () => {
      const res = await fetch('/api/admin/providers', { credentials: 'include' });
      if (!res.ok) throw new Error('Failed to fetch providers');
      return res.json();
    },
  });

  const { data: topupsData, isLoading: loadingTopups } = useQuery<TopupsResponse>({
    queryKey: ["/api/admin/master-topups", { provider: providerFilter, search: debouncedSearch, page: currentPage }],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (providerFilter !== 'all') params.append('provider', providerFilter);
      if (debouncedSearch) params.append('search', debouncedSearch);
      params.append('page', String(currentPage));
      const url = `/api/admin/master-topups?${params.toString()}`;
      const res = await fetch(url, { credentials: 'include' });
      if (!res.ok) throw new Error('Failed to fetch topups');
      return res.json();
    },
  });

  const syncMutation = useMutation({
    mutationFn: async (providerId: string) => {
      setSyncingProviderId(providerId);
      const response = await apiRequest(
        "POST",
        `/api/admin/providers/${providerId}/sync-topups`
      );
      return response.json();
    },
    onSuccess: (data: any) => {
      setSyncingProviderId(null);
      if (data.success) {
        toast({
          title: "Topup Sync Complete",
          description: `Synced ${data.topupsSynced || 0} topups, updated ${data.topupsUpdated || 0}.`,
        });
        queryClient.invalidateQueries({ queryKey: ["/api/admin/master-topups"] });
        queryClient.invalidateQueries({ queryKey: ["/api/admin/providers"] });
      } else {
        toast({
          title: "Topup Sync Failed",
          description: data.errorMessage || data.message || "Unknown error occurred",
          variant: "destructive",
        });
      }
    },
    onError: (error: any) => {
      setSyncingProviderId(null);
      toast({
        title: "Sync Failed",
        description: error.message || "Failed to trigger topup sync",
        variant: "destructive",
      });
    },
  });

  const enabledProviders = providers?.data?.filter((p) => p.enabled) || [];
  const topups = topupsData?.data || [];
  const stats = topupsData?.stats || { airalo: 0, esimAccess: 0, esimGo: 0, maya: 0, total: 0 };
  const pagination = topupsData?.pagination || { page: 1, limit: 50, total: 0, totalPages: 0 };

  const getProviderBadgeColor = (provider: string) => {
    switch (provider) {
      case 'airalo':
        return 'bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200';
      case 'esim-access':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'esim-go':
        return 'bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200';
      case 'maya':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <RefreshCw className="h-6 w-6" />
            Topup Packages
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Manage topup packages for reloading existing eSIMs
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">
              Total Topup Packages
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500 flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-teal-500" />
              Airalo Topups
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.airalo.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500 flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500" />
              eSIM Access Topups
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Badge variant="secondary" className="bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200">
              On-demand
            </Badge>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500 flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-teal-500" />
              eSIM Go Topups
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(stats.esimGo || 0).toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500 flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-orange-500" />
              Maya Mobile Topups
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(stats.maya || 0).toLocaleString()}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Topup Sync Status</CardTitle>
          <p className="text-sm text-slate-500 mt-1">
            Sync topup packages from all providers. Topups are also auto-synced after base package sync.
          </p>
        </CardHeader>
        <CardContent>
          {loadingProviders ? (
            <div className="flex items-center justify-center py-8">
              <RefreshCw className="h-6 w-6 animate-spin text-slate-400" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Airalo sync card - always visible */}
              <div
                className="flex items-center justify-between p-4 rounded-lg border border-slate-200 dark:border-slate-700"
                data-testid="card-sync-airalo"
              >
                <div className="flex items-center gap-3">
                  <Server className="h-5 w-5 text-teal-500" />
                  <div>
                    <p className="font-medium">Airalo Topups</p>
                    <p className="text-xs text-slate-500">
                      Last sync:{" "}
                      {providers?.data?.find(p => p.slug === 'airalo')?.lastSyncAt
                        ? new Date(providers.data.find(p => p.slug === 'airalo')!.lastSyncAt!).toLocaleString()
                        : "Never"}
                    </p>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    const airalo = providers?.data?.find(p => p.slug === 'airalo');
                    if (airalo) syncMutation.mutate(airalo.id);
                  }}
                  disabled={syncMutation.isPending || !providers?.data?.find(p => p.slug === 'airalo')}
                  data-testid="button-sync-topups-airalo"
                >
                  <RefreshCw
                    className={`h-4 w-4 ${syncingProviderId === providers?.data?.find(p => p.slug === 'airalo')?.id ? "animate-spin" : ""}`}
                  />
                  <span className="ml-2">Sync</span>
                </Button>
              </div>
              
              {/* eSIM Access card - On-demand only (no bulk sync API available) */}
              <div
                className="flex items-center justify-between p-4 rounded-lg border border-slate-200 dark:border-slate-700"
                data-testid="card-sync-esim-access"
              >
                <div className="flex items-center gap-3">
                  <Server className="h-5 w-5 text-green-500" />
                  <div>
                    <span className="font-medium flex items-center gap-2">
                      eSIM Access Topups
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="h-4 w-4 text-slate-400 cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <span className="max-w-xs">eSIM Access API requires a specific package to query topups. Topup packages are fetched on-demand when a user requests them for their eSIM.</span>
                        </TooltipContent>
                      </Tooltip>
                    </span>
                    <p className="text-xs text-slate-500">
                      Fetched when users request topups
                    </p>
                  </div>
                </div>
                <Badge variant="secondary" className="bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200">
                  On-demand
                </Badge>
              </div>
              
              {/* eSIM Go sync card */}
              <div
                className="flex items-center justify-between p-4 rounded-lg border border-slate-200 dark:border-slate-700"
                data-testid="card-sync-esim-go"
              >
                <div className="flex items-center gap-3">
                  <Server className="h-5 w-5 text-teal-500" />
                  <div>
                    <span className="font-medium flex items-center gap-2">
                      eSIM Go Topups
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="h-4 w-4 text-slate-400 cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <span className="max-w-xs">Topups are fetched from base packages with canTopup=true. Auto-synced after base package sync.</span>
                        </TooltipContent>
                      </Tooltip>
                    </span>
                    <p className="text-xs text-slate-500">
                      Last sync:{" "}
                      {providers?.data?.find(p => p.slug === 'esim-go')?.lastSyncAt
                        ? new Date(providers.data.find(p => p.slug === 'esim-go')!.lastSyncAt!).toLocaleString()
                        : "Never"}
                    </p>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    const esimGo = providers?.data?.find(p => p.slug === 'esim-go');
                    if (esimGo) syncMutation.mutate(esimGo.id);
                  }}
                  disabled={syncMutation.isPending || !providers?.data?.find(p => p.slug === 'esim-go')}
                  data-testid="button-sync-topups-esim-go"
                >
                  <RefreshCw
                    className={`h-4 w-4 ${syncingProviderId === providers?.data?.find(p => p.slug === 'esim-go')?.id ? "animate-spin" : ""}`}
                  />
                  <span className="ml-2">Sync</span>
                </Button>
              </div>
              
              {/* Maya sync card */}
              <div
                className="flex items-center justify-between p-4 rounded-lg border border-slate-200 dark:border-slate-700"
                data-testid="card-sync-maya"
              >
                <div className="flex items-center gap-3">
                  <Server className="h-5 w-5 text-orange-500" />
                  <div>
                    <p className="font-medium">Maya Mobile Topups</p>
                    <p className="text-xs text-slate-500">
                      Last sync:{" "}
                      {providers?.data?.find(p => p.slug === 'maya')?.lastSyncAt
                        ? new Date(providers.data.find(p => p.slug === 'maya')!.lastSyncAt!).toLocaleString()
                        : "Never"}
                    </p>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    const maya = providers?.data?.find(p => p.slug === 'maya');
                    if (maya) syncMutation.mutate(maya.id);
                  }}
                  disabled={syncMutation.isPending || !providers?.data?.find(p => p.slug === 'maya')}
                  data-testid="button-sync-topups-maya"
                >
                  <RefreshCw
                    className={`h-4 w-4 ${syncingProviderId === providers?.data?.find(p => p.slug === 'maya')?.id ? "animate-spin" : ""}`}
                  />
                  <span className="ml-2">Sync</span>
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <CardTitle>All Topup Packages</CardTitle>
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input
                  placeholder="Search topups..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="pl-9 w-full sm:w-[200px]"
                  data-testid="input-search-topups"
                />
              </div>
              <Select value={providerFilter} onValueChange={(v) => { setProviderFilter(v); setCurrentPage(1); }}>
                <SelectTrigger className="w-full sm:w-[150px]" data-testid="select-provider">
                  <SelectValue placeholder="All Providers" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Providers</SelectItem>
                  <SelectItem value="airalo">Airalo</SelectItem>
                  <SelectItem value="esim-access">eSIM Access</SelectItem>
                  <SelectItem value="esim-go">eSIM Go</SelectItem>
                  <SelectItem value="maya">Maya Mobile</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loadingTopups ? (
            <div className="flex items-center justify-center py-8">
              <RefreshCw className="h-6 w-6 animate-spin text-slate-400" />
            </div>
          ) : topups.length === 0 ? (
            <div className="text-center py-8 text-slate-500">
              <Package className="h-12 w-12 mx-auto mb-4 text-slate-300" />
              <p>No topup packages found.</p>
              <p className="text-sm mt-2">
                {debouncedSearch ? "Try a different search term." : "Trigger a sync to fetch topup packages."}
              </p>
            </div>
          ) : (
            <>
              <div className="rounded-md border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Provider</TableHead>
                      <TableHead>Destination</TableHead>
                      <TableHead>Data</TableHead>
                      <TableHead>Validity</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Linked</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {topups.map((topup) => (
                      <TableRow key={`${topup.provider}-${topup.id}`}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {topup.operatorImage && (
                              <img 
                                src={topup.operatorImage} 
                                alt={topup.operator || ""} 
                                className="w-8 h-8 rounded object-cover"
                              />
                            )}
                            <div>
                              <p className="font-medium text-sm">{topup.title}</p>
                              {topup.operator && (
                                <p className="text-xs text-slate-500">{topup.operator}</p>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getProviderBadgeColor(topup.provider)} variant="secondary">
                            {topup.providerName}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1 text-sm">
                            {topup.regionName ? (
                              <>
                                <Globe className="h-3 w-3 text-slate-400" />
                                {topup.regionName}
                              </>
                            ) : topup.destinationName ? (
                              <>
                                <MapPin className="h-3 w-3 text-slate-400" />
                                {topup.destinationName}
                              </>
                            ) : (
                              <span className="text-slate-400">-</span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="font-medium">{formatDataAmount(topup.dataAmount)}</span>
                        </TableCell>
                        <TableCell>
                          {topup.validity} days
                        </TableCell>
                        <TableCell>
                          <span className="font-medium">
                            ${parseFloat(topup.price).toFixed(2)}
                          </span>
                          <span className="text-xs text-slate-500 ml-1">{topup.currency}</span>
                        </TableCell>
                        <TableCell>
                          {topup.hasParentPackage ? (
                            <Badge variant="default" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                              Linked
                            </Badge>
                          ) : (
                            <Badge variant="secondary" className="bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                              Unlinked
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge variant={topup.active ? "default" : "secondary"}>
                            {topup.active ? "Active" : "Inactive"}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="flex items-center justify-between mt-4">
                  <p className="text-sm text-slate-500">
                    Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, pagination.total)} of {pagination.total} packages
                  </p>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      data-testid="button-prev-page"
                    >
                      Previous
                    </Button>
                    <span className="text-sm">
                      Page {currentPage} of {pagination.totalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage((p) => Math.min(pagination.totalPages, p + 1))}
                      disabled={currentPage === pagination.totalPages}
                      data-testid="button-next-page"
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
