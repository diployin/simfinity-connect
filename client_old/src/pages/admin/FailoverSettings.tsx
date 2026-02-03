import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import {
  Shield,
  RefreshCw,
  Loader2,
  AlertTriangle,
  Check,
  ArrowUp,
  ArrowDown,
  Percent,
  Save,
  Server,
  Key,
  Plus,
  Trash2,
  Copy,
  Eye,
  EyeOff,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { formatDistanceToNow } from 'date-fns';

interface Provider {
  id: string;
  name: string;
  slug: string;
  enabled: boolean;
  isPreferred: boolean;
  pricingMargin: string;
  priority: number;
  minMarginPercent: number;
}

interface FailoverSettings {
  enabled: boolean;
  globalMinMargin: number;
  maxFailoverAttempts: number;
}

interface ApiKey {
  id: string;
  name: string;
  keyHash: string;
  isActive: boolean;
  rateLimit: number;
  requestCount: number;
  lastUsedAt: string | null;
  createdAt: string;
}

export default function FailoverSettings() {
  const { toast } = useToast();
  const [providerMargins, setProviderMargins] = useState<Record<string, string>>({});
  const [settings, setSettings] = useState<FailoverSettings>({
    enabled: false,
    globalMinMargin: 15,
    maxFailoverAttempts: 3,
  });
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  const [newApiKeyName, setNewApiKeyName] = useState('');
  const [newApiKeyRateLimit, setNewApiKeyRateLimit] = useState('1000');
  const [generatedKey, setGeneratedKey] = useState<{ key: string; secret: string } | null>(null);
  const [visibleSecrets, setVisibleSecrets] = useState<Record<string, boolean>>({});

  const { data: providers, isLoading: providersLoading } = useQuery<Provider[]>({
    queryKey: ['/api/admin/providers'],
  });

  const { data: failoverSettings, isLoading: settingsLoading } = useQuery<FailoverSettings>({
    queryKey: ['/api/admin/failover-settings'],
  });

  const { data: apiKeys, isLoading: apiKeysLoading } = useQuery<ApiKey[]>({
    queryKey: ['/api/admin/api-keys'],
  });

  const updateFailoverSettingsMutation = useMutation({
    mutationFn: async (data: Partial<FailoverSettings>) => {
      return await apiRequest('PUT', '/api/admin/failover-settings', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/failover-settings'] });
      toast({
        title: 'Settings Updated',
        description: 'Failover settings have been saved successfully.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Update Failed',
        description: error.message || 'Failed to update failover settings.',
        variant: 'destructive',
      });
    },
  });

  const updateProviderMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Provider> }) => {
      return await apiRequest('PUT', `/api/admin/providers/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/providers'] });
      toast({
        title: 'Provider Updated',
        description: 'Provider settings have been saved.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Update Failed',
        description: error.message || 'Failed to update provider.',
        variant: 'destructive',
      });
    },
  });

  const updateProviderPriorityMutation = useMutation({
    mutationFn: async (priorities: { id: string; priority: number }[]) => {
      return await apiRequest('PUT', '/api/admin/provider-priorities', { priorities });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/providers'] });
      toast({
        title: 'Priorities Updated',
        description: 'Provider failover order has been saved.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Update Failed',
        description: error.message || 'Failed to update priorities.',
        variant: 'destructive',
      });
    },
  });

  const createApiKeyMutation = useMutation({
    mutationFn: async (data: { name: string; rateLimit: number }) => {
      return await apiRequest('POST', '/api/admin/api-keys', data);
    },
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/api-keys'] });
      setGeneratedKey({ key: data.apiKey, secret: data.apiSecret });
      setNewApiKeyName('');
      setNewApiKeyRateLimit('1000');
      toast({
        title: 'API Key Created',
        description: "Make sure to copy the secret - it won't be shown again!",
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Creation Failed',
        description: error.message || 'Failed to create API key.',
        variant: 'destructive',
      });
    },
  });

  const toggleApiKeyMutation = useMutation({
    mutationFn: async ({ id, isActive }: { id: string; isActive: boolean }) => {
      return await apiRequest('PUT', `/api/admin/api-keys/${id}`, { isActive });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/api-keys'] });
      toast({
        title: 'API Key Updated',
        description: 'API key status has been changed.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Update Failed',
        description: error.message || 'Failed to update API key.',
        variant: 'destructive',
      });
    },
  });

  const deleteApiKeyMutation = useMutation({
    mutationFn: async (id: string) => {
      return await apiRequest('DELETE', `/api/admin/api-keys/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/api-keys'] });
      toast({
        title: 'API Key Deleted',
        description: 'The API key has been permanently removed.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Deletion Failed',
        description: error.message || 'Failed to delete API key.',
        variant: 'destructive',
      });
    },
  });

  const sortedProviders = [...(providers || [])].sort(
    (a, b) => (a.priority || 0) - (b.priority || 0),
  );

  const moveProviderUp = (index: number) => {
    if (index === 0) return;
    const newOrder = [...sortedProviders];
    [newOrder[index - 1], newOrder[index]] = [newOrder[index], newOrder[index - 1]];
    const priorities = newOrder.map((p, i) => ({ id: p.id, priority: i + 1 }));
    updateProviderPriorityMutation.mutate(priorities);
  };

  const moveProviderDown = (index: number) => {
    if (index === sortedProviders.length - 1) return;
    const newOrder = [...sortedProviders];
    [newOrder[index], newOrder[index + 1]] = [newOrder[index + 1], newOrder[index]];
    const priorities = newOrder.map((p, i) => ({ id: p.id, priority: i + 1 }));
    updateProviderPriorityMutation.mutate(priorities);
  };

  const handleMarginChange = (providerId: string, value: string) => {
    setProviderMargins((prev) => ({ ...prev, [providerId]: value }));
  };

  const saveProviderMargin = (provider: Provider) => {
    const margin = providerMargins[provider.id];
    if (margin !== undefined) {
      updateProviderMutation.mutate({
        id: provider.id,
        data: { pricingMargin: margin },
      });
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: 'Copied',
      description: 'Value copied to clipboard.',
    });
  };

  const isLoading = providersLoading || settingsLoading;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64" data-testid="loading-spinner">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const currentSettings = failoverSettings || settings;

  return (
    <div className="space-y-6" data-testid="failover-settings-page">
      <div>
        <h1 className="text-2xl font-bold text-foreground" data-testid="page-title">
          Smart Failover Settings
        </h1>
        <p className="text-muted-foreground">
          Configure automatic order routing when providers fail
        </p>
      </div>

      <Tabs defaultValue="failover" className="space-y-4">
        <div className="overflow-x-auto scrollbar-hide">
          <TabsList className="flex min-w-max gap-1 p-1" data-testid="tabs-list">
            <TabsTrigger
              value="failover"
              className="whitespace-nowrap px-3 py-2 text-sm"
              data-testid="tab-failover"
            >
              <Shield className="h-4 w-4 mr-2 shrink-0" />
              Failover
            </TabsTrigger>
            <TabsTrigger
              value="providers"
              className="whitespace-nowrap px-3 py-2 text-sm"
              data-testid="tab-providers"
            >
              <Server className="h-4 w-4 mr-2 shrink-0" />
              Provider Priority
            </TabsTrigger>
            <TabsTrigger
              value="api-keys"
              className="whitespace-nowrap px-3 py-2 text-sm"
              data-testid="tab-api-keys"
            >
              <Key className="h-4 w-4 mr-2 shrink-0" />
              API Keys
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="failover" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Smart Failover Configuration
              </CardTitle>
              <CardDescription>
                When a provider fails to fulfill an order, the system can automatically try
                alternative providers
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Enable Smart Failover</Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically route orders to backup providers when primary fails
                  </p>
                </div>
                <Switch
                  data-testid="switch-failover-enabled"
                  checked={currentSettings.enabled}
                  onCheckedChange={(checked) => {
                    updateFailoverSettingsMutation.mutate({ enabled: checked });
                  }}
                />
              </div>

              <div className="grid gap-4 pt-4 border-t">
                <div className="space-y-2">
                  <Label htmlFor="globalMinMargin">Global Minimum Margin (%)</Label>
                  <div className="flex gap-2">
                    <Input
                      id="globalMinMargin"
                      data-testid="input-global-min-margin"
                      type="number"
                      min="0"
                      max="100"
                      step="0.1"
                      value={currentSettings.globalMinMargin}
                      onChange={(e) =>
                        setSettings((prev) => ({
                          ...prev,
                          globalMinMargin: parseFloat(e.target.value) || 0,
                        }))
                      }
                      className="max-w-[150px]"
                    />
                    <Button
                      data-testid="button-save-global-margin"
                      onClick={() =>
                        updateFailoverSettingsMutation.mutate({
                          globalMinMargin: settings.globalMinMargin,
                        })
                      }
                      disabled={updateFailoverSettingsMutation.isPending}
                    >
                      {updateFailoverSettingsMutation.isPending ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Save className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Minimum profit margin required for failover to proceed
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="maxAttempts">Maximum Failover Attempts</Label>
                  <div className="flex gap-2">
                    <Input
                      id="maxAttempts"
                      data-testid="input-max-attempts"
                      type="number"
                      min="1"
                      max="10"
                      value={currentSettings.maxFailoverAttempts}
                      onChange={(e) =>
                        setSettings((prev) => ({
                          ...prev,
                          maxFailoverAttempts: parseInt(e.target.value) || 1,
                        }))
                      }
                      className="max-w-[150px]"
                    />
                    <Button
                      data-testid="button-save-max-attempts"
                      onClick={() =>
                        updateFailoverSettingsMutation.mutate({
                          maxFailoverAttempts: settings.maxFailoverAttempts,
                        })
                      }
                      disabled={updateFailoverSettingsMutation.isPending}
                    >
                      {updateFailoverSettingsMutation.isPending ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Save className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    How many alternative providers to try before giving up
                  </p>
                </div>
              </div>

              <div className="p-4 bg-muted rounded-md">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5" />
                  <div>
                    <p className="font-medium">How Failover Works</p>
                    <ul className="text-sm text-muted-foreground mt-1 space-y-1">
                      <li>1. Primary provider receives the order first</li>
                      <li>2. If it fails, system checks alternative providers by priority</li>
                      <li>3. Only providers with packages meeting margin requirements are used</li>
                      <li>4. Order is routed to the first successful provider</li>
                      <li>5. All attempts are logged for admin review</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="providers" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Server className="h-5 w-5" />
                Provider Failover Priority
              </CardTitle>
              <CardDescription>
                Order determines which provider is tried first during failover
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-16">Priority</TableHead>
                    <TableHead>Provider</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Margin %</TableHead>
                    <TableHead className="w-24">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedProviders.map((provider, index) => (
                    <TableRow key={provider.id} data-testid={`provider-row-${provider.slug}`}>
                      <TableCell>
                        <Badge variant="outline">{index + 1}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{provider.name}</span>
                          {provider.isPreferred && (
                            <Badge variant="secondary" className="text-xs">
                              Preferred
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {provider.enabled ? (
                          <Badge className="bg-green-500/10 text-green-600 border-green-500/20">
                            <Check className="h-3 w-3 mr-1" />
                            Active
                          </Badge>
                        ) : (
                          <Badge variant="secondary">Disabled</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Input
                            data-testid={`input-margin-${provider.slug}`}
                            type="number"
                            min="0"
                            max="100"
                            step="0.1"
                            value={providerMargins[provider.id] ?? provider.pricingMargin}
                            onChange={(e) => handleMarginChange(provider.id, e.target.value)}
                            className="w-20 text-right"
                          />
                          <Percent className="h-4 w-4 text-muted-foreground" />
                          <Button
                            size="icon"
                            variant="ghost"
                            data-testid={`button-save-margin-${provider.slug}`}
                            onClick={() => saveProviderMargin(provider)}
                            disabled={updateProviderMutation.isPending}
                          >
                            <Save className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button
                            size="icon"
                            variant="ghost"
                            data-testid={`button-move-up-${provider.slug}`}
                            onClick={() => moveProviderUp(index)}
                            disabled={index === 0 || updateProviderPriorityMutation.isPending}
                          >
                            <ArrowUp className="h-4 w-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            data-testid={`button-move-down-${provider.slug}`}
                            onClick={() => moveProviderDown(index)}
                            disabled={
                              index === sortedProviders.length - 1 ||
                              updateProviderPriorityMutation.isPending
                            }
                          >
                            <ArrowDown className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="api-keys" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-4">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Key className="h-5 w-5" />
                  External API Keys
                </CardTitle>
                <CardDescription>
                  Manage API keys for external partners and mobile applications
                </CardDescription>
              </div>
              <Dialog open={showApiKeyModal} onOpenChange={setShowApiKeyModal}>
                <DialogTrigger asChild>
                  <Button data-testid="button-create-api-key">
                    <Plus className="h-4 w-4 mr-2" />
                    Create API Key
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create New API Key</DialogTitle>
                    <DialogDescription>
                      Generate a new API key for external integrations
                    </DialogDescription>
                  </DialogHeader>
                  {generatedKey ? (
                    <div className="space-y-4">
                      <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-md">
                        <div className="flex items-start gap-2">
                          <AlertTriangle className="h-5 w-5 text-amber-500" />
                          <div>
                            <p className="font-medium text-amber-600">
                              Save these credentials now!
                            </p>
                            <p className="text-sm text-muted-foreground">
                              The secret will not be shown again after you close this dialog.
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>API Key</Label>
                        <div className="flex gap-2">
                          <Input value={generatedKey.key} readOnly className="font-mono text-sm" />
                          <Button
                            size="icon"
                            variant="outline"
                            onClick={() => copyToClipboard(generatedKey.key)}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>API Secret</Label>
                        <div className="flex gap-2">
                          <Input
                            value={generatedKey.secret}
                            readOnly
                            className="font-mono text-sm"
                          />
                          <Button
                            size="icon"
                            variant="outline"
                            onClick={() => copyToClipboard(generatedKey.secret)}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button
                          onClick={() => {
                            setGeneratedKey(null);
                            setShowApiKeyModal(false);
                          }}
                        >
                          Done
                        </Button>
                      </DialogFooter>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="apiKeyName">Name</Label>
                        <Input
                          id="apiKeyName"
                          data-testid="input-api-key-name"
                          placeholder="e.g., Mobile App Production"
                          value={newApiKeyName}
                          onChange={(e) => setNewApiKeyName(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="apiKeyRateLimit">Rate Limit (requests/day)</Label>
                        <Input
                          id="apiKeyRateLimit"
                          data-testid="input-api-key-rate-limit"
                          type="number"
                          min="100"
                          max="100000"
                          value={newApiKeyRateLimit}
                          onChange={(e) => setNewApiKeyRateLimit(e.target.value)}
                        />
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setShowApiKeyModal(false)}>
                          Cancel
                        </Button>
                        <Button
                          data-testid="button-generate-api-key"
                          onClick={() =>
                            createApiKeyMutation.mutate({
                              name: newApiKeyName,
                              rateLimit: parseInt(newApiKeyRateLimit) || 1000,
                            })
                          }
                          disabled={!newApiKeyName || createApiKeyMutation.isPending}
                        >
                          {createApiKeyMutation.isPending ? (
                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                          ) : null}
                          Generate Key
                        </Button>
                      </DialogFooter>
                    </div>
                  )}
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              {apiKeysLoading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin" />
                </div>
              ) : (apiKeys?.length || 0) === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No API keys created yet. Click "Create API Key" to get started.
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Key ID</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Rate Limit</TableHead>
                      <TableHead className="text-right">Requests</TableHead>
                      <TableHead>Last Used</TableHead>
                      <TableHead className="w-24">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {apiKeys?.map((key) => (
                      <TableRow key={key.id} data-testid={`api-key-row-${key.id}`}>
                        <TableCell className="font-medium">{key.name}</TableCell>
                        <TableCell>
                          <code className="text-xs bg-muted px-1 py-0.5 rounded">
                            {key.keyHash.substring(0, 16)}...
                          </code>
                        </TableCell>
                        <TableCell>
                          <Switch
                            data-testid={`switch-api-key-${key.id}`}
                            checked={key.isActive}
                            onCheckedChange={(checked) =>
                              toggleApiKeyMutation.mutate({ id: key.id, isActive: checked })
                            }
                          />
                        </TableCell>
                        <TableCell className="text-right">
                          {key.rateLimit.toLocaleString()}/day
                        </TableCell>
                        <TableCell className="text-right">
                          {key.requestCount.toLocaleString()}
                        </TableCell>
                        <TableCell>
                          {key.lastUsedAt ? (
                            formatDistanceToNow(new Date(key.lastUsedAt), { addSuffix: true })
                          ) : (
                            <span className="text-muted-foreground">Never</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                size="icon"
                                variant="ghost"
                                data-testid={`button-delete-api-key-${key.id}`}
                              >
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete API Key?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This will permanently revoke access for any applications using
                                  this key. This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => deleteApiKeyMutation.mutate(key.id)}
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
