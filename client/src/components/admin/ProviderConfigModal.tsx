import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { X } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

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
  totalPackages: number;
  createdAt: string;
  updatedAt: string;
}

interface ProviderConfigModalProps {
  provider: Provider | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface NotificationSettings {
  lowData75Enabled: boolean;
  lowData90Enabled: boolean;
  expiring3DaysEnabled: boolean;
  expiring1DayEnabled: boolean;
  orderStatusEnabled: boolean;
}

export default function ProviderConfigModal({
  provider,
  open,
  onOpenChange,
}: ProviderConfigModalProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState<Partial<Provider>>({});
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    lowData75Enabled: true,
    lowData90Enabled: true,
    expiring3DaysEnabled: true,
    expiring1DayEnabled: true,
    orderStatusEnabled: true,
  });

  const updateProviderMutation = useMutation({
    mutationFn: async (data: Partial<Provider>) => {
      if (!provider) throw new Error('No provider selected');
      return await apiRequest('PATCH', `/api/admin/providers/${provider.id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/providers'] });
      toast({
        title: 'Provider Updated',
        description: 'Provider configuration has been updated successfully.',
      });
      onOpenChange(false);
    },
    onError: (error: any) => {
      toast({
        title: 'Update Failed',
        description: error.message || 'Failed to update provider configuration.',
        variant: 'destructive',
      });
    },
  });

  const handleSubmit = () => {
    updateProviderMutation.mutate(formData);
  };

  const getValue = (key: keyof Provider) => {
    if (formData[key] !== undefined) {
      return formData[key];
    }
    return provider?.[key];
  };

  const setValue = (key: keyof Provider, value: any) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  if (!provider) return null;

  const webhookBaseUrl = `${window.location.origin}/api/webhooks/${provider.slug}`;
  const webhookEndpoints = [
    { type: 'order-complete', url: `${webhookBaseUrl}/order-complete` },
    { type: 'order-status', url: `${webhookBaseUrl}/order-status` },
    { type: 'low-data', url: `${webhookBaseUrl}/low-data` },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-3xl max-h-[90vh] overflow-y-auto"
        data-testid="modal-provider-config"
      >
        <DialogHeader>
          <DialogTitle>Configure {provider.name}</DialogTitle>
          <DialogDescription>
            Manage API settings, sync configuration, webhooks, and pricing
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="api" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger
              className=" text-xs md:text-base "
              value="api"
              data-testid="tab-api-settings"
            >
              API
            </TabsTrigger>
            <TabsTrigger
              className=" text-xs md:text-base "
              value="sync"
              data-testid="tab-sync-settings"
            >
              Sync
            </TabsTrigger>
            <TabsTrigger
              className=" text-xs md:text-base "
              value="webhook"
              data-testid="tab-webhook-settings"
            >
              Webhook
            </TabsTrigger>
            <TabsTrigger
              className=" text-xs md:text-base "
              value="pricing"
              data-testid="tab-pricing-settings"
            >
              Pricing
            </TabsTrigger>
            <TabsTrigger
              className=" text-xs md:text-base "
              value="preferred"
              data-testid="tab-preferred-settings"
            >
              Preferred
            </TabsTrigger>
          </TabsList>

          <TabsContent value="api" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>API Settings</CardTitle>
                <CardDescription>
                  Configure API connection and rate limiting. API keys are stored securely in
                  Secrets.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="apiBaseUrl">API Base URL</Label>
                  <Input
                    id="apiBaseUrl"
                    value={(getValue('apiBaseUrl') as string) || ''}
                    onChange={(e) => setValue('apiBaseUrl', e.target.value)}
                    placeholder="https://api.example.com"
                    data-testid="input-api-base-url"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="apiRateLimitPerHour">API Rate Limit (requests/hour)</Label>
                  <Input
                    id="apiRateLimitPerHour"
                    type="number"
                    value={(getValue('apiRateLimitPerHour') as number) || 1000}
                    onChange={(e) => setValue('apiRateLimitPerHour', parseInt(e.target.value))}
                    placeholder="1000"
                    data-testid="input-api-rate-limit"
                  />
                  <p className="text-sm text-muted-foreground">
                    Maximum API requests allowed per hour to prevent rate limiting
                  </p>
                </div>

                <div className="p-4 rounded-md bg-muted">
                  <p className="text-sm font-medium mb-2">API Key Configuration</p>
                  <p className="text-sm text-muted-foreground">
                    API keys for {provider.name} are stored securely in  Secrets:
                  </p>
                  <ul className="list-disc list-inside text-sm text-muted-foreground mt-2 space-y-1">
                    {provider.slug === 'airalo' && (
                      <>
                        <li>AIRALO_API_KEY</li>
                        <li>AIRALO_API_SECRET</li>
                      </>
                    )}
                    {provider.slug === 'esim-access' && (
                      <>
                        <li>ESIM_ACCESS_CLIENT_ID</li>
                        <li>ESIM_ACCESS_CLIENT_SECRET</li>
                      </>
                    )}
                    {provider.slug === 'esim-go' && <li>ESIM_GO_API_KEY</li>}
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sync" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Sync Settings</CardTitle>
                <CardDescription>
                  Configure package synchronization and provider status
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="enabled">Enable Provider</Label>
                    <p className="text-sm text-muted-foreground">
                      Enable or disable this provider for package syncing and orders
                    </p>
                  </div>
                  <Switch
                    id="enabled"
                    checked={getValue('enabled') as boolean}
                    onCheckedChange={(checked) => setValue('enabled', checked)}
                    data-testid="switch-enabled"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="syncIntervalMinutes">Sync Interval (minutes)</Label>
                  <Input
                    id="syncIntervalMinutes"
                    type="number"
                    value={(getValue('syncIntervalMinutes') as number) || 60}
                    onChange={(e) => setValue('syncIntervalMinutes', parseInt(e.target.value))}
                    placeholder="60"
                    data-testid="input-sync-interval"
                  />
                  <p className="text-sm text-muted-foreground">
                    How often to sync packages from this provider (in minutes)
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="webhook" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Webhook Configuration</CardTitle>
                <CardDescription>
                  Configure webhooks for real-time order and notification updates
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <Label>Webhook Endpoints</Label>
                  <p className="text-sm text-muted-foreground">
                    Configure these webhook URLs in your {provider.name} provider dashboard. Each
                    event type has its own endpoint.
                  </p>

                  {webhookEndpoints.map((endpoint) => (
                    <div key={endpoint.type} className="space-y-1">
                      <Label className="text-xs font-normal text-muted-foreground capitalize">
                        {endpoint.type.replace('-', ' ')} Event
                      </Label>
                      <div className="flex gap-2">
                        <Input
                          value={endpoint.url}
                          readOnly
                          className="font-mono text-xs"
                          data-testid={`input-webhook-url-${endpoint.type}`}
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            navigator.clipboard.writeText(endpoint.url);
                            toast({
                              title: 'Copied',
                              description: `${endpoint.type} webhook URL copied to clipboard`,
                            });
                          }}
                          data-testid={`button-copy-webhook-${endpoint.type}`}
                        >
                          Copy
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                <Separator />

                <div className="space-y-4">
                  <div>
                    <Label>Notification Settings</Label>
                    <p className="text-sm text-muted-foreground mt-1">
                      Enable or disable specific notification types for this provider
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="lowData75" className="font-normal">
                          Low Data Alert (75% Used)
                        </Label>
                        <p className="text-xs text-muted-foreground">
                          Send notifications when 75% of data is consumed
                        </p>
                      </div>
                      <Switch
                        id="lowData75"
                        checked={notificationSettings.lowData75Enabled}
                        onCheckedChange={(checked) =>
                          setNotificationSettings({
                            ...notificationSettings,
                            lowData75Enabled: checked,
                          })
                        }
                        data-testid="switch-low-data-75"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="lowData90" className="font-normal">
                          Low Data Alert (90% Used)
                        </Label>
                        <p className="text-xs text-muted-foreground">
                          Send notifications when 90% of data is consumed
                        </p>
                      </div>
                      <Switch
                        id="lowData90"
                        checked={notificationSettings.lowData90Enabled}
                        onCheckedChange={(checked) =>
                          setNotificationSettings({
                            ...notificationSettings,
                            lowData90Enabled: checked,
                          })
                        }
                        data-testid="switch-low-data-90"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="expiring3Days" className="font-normal">
                          Expiring Soon Alert (3 Days)
                        </Label>
                        <p className="text-xs text-muted-foreground">
                          Send notifications 3 days before eSIM expires
                        </p>
                      </div>
                      <Switch
                        id="expiring3Days"
                        checked={notificationSettings.expiring3DaysEnabled}
                        onCheckedChange={(checked) =>
                          setNotificationSettings({
                            ...notificationSettings,
                            expiring3DaysEnabled: checked,
                          })
                        }
                        data-testid="switch-expiring-3days"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="expiring1Day" className="font-normal">
                          Expiring Alert (1 Day)
                        </Label>
                        <p className="text-xs text-muted-foreground">
                          Send notifications 1 day before eSIM expires
                        </p>
                      </div>
                      <Switch
                        id="expiring1Day"
                        checked={notificationSettings.expiring1DayEnabled}
                        onCheckedChange={(checked) =>
                          setNotificationSettings({
                            ...notificationSettings,
                            expiring1DayEnabled: checked,
                          })
                        }
                        data-testid="switch-expiring-1day"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="orderStatusUpdates" className="font-normal">
                          Order Status Updates
                        </Label>
                        <p className="text-xs text-muted-foreground">
                          Send notifications for order completions and failures
                        </p>
                      </div>
                      <Switch
                        id="orderStatusUpdates"
                        checked={notificationSettings.orderStatusEnabled}
                        onCheckedChange={(checked) =>
                          setNotificationSettings({
                            ...notificationSettings,
                            orderStatusEnabled: checked,
                          })
                        }
                        data-testid="switch-order-status"
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label htmlFor="webhookSecret">Webhook Secret</Label>
                  <Input
                    id="webhookSecret"
                    type="password"
                    value={(getValue('webhookSecret') as string) || ''}
                    onChange={(e) => setValue('webhookSecret', e.target.value)}
                    placeholder="Enter webhook secret for signature validation"
                    data-testid="input-webhook-secret"
                  />
                  <p className="text-sm text-muted-foreground">
                    Secret key used to validate webhook signatures (HMAC-SHA256)
                  </p>
                </div>

                <div className="p-4 rounded-md bg-muted">
                  <p className="text-sm font-medium mb-2">Supported Webhook Events</p>
                  <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                    <li>Order Status Updates (completed, failed)</li>
                    <li>Low Data Notifications</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="pricing" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Pricing Configuration</CardTitle>
                <CardDescription>
                  Configure pricing margin for packages from this provider
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="pricingMargin">Pricing Margin (%)</Label>
                  <Input
                    id="pricingMargin"
                    type="number"
                    step="0.1"
                    value={(getValue('pricingMargin') as string) || '15.00'}
                    onChange={(e) => setValue('pricingMargin', e.target.value)}
                    placeholder="15.00"
                    data-testid="input-pricing-margin"
                  />
                  <p className="text-sm text-muted-foreground">
                    Percentage markup applied to provider's base price
                  </p>
                </div>

                <div className="p-4 rounded-md bg-muted">
                  <p className="text-sm font-medium mb-2">Example Calculation</p>
                  <p className="text-sm text-muted-foreground">
                    If provider price is $10.00 and margin is {getValue('pricingMargin') || '15.00'}
                    %:
                  </p>
                  <p className="text-sm font-mono mt-1">
                    Customer Price = $10.00 × (1 + {getValue('pricingMargin') || '15.00'}/100) = $
                    {(
                      10 *
                      (1 + parseFloat((getValue('pricingMargin') as string) || '15.00') / 100)
                    ).toFixed(2)}
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="preferred" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Preferred Provider</CardTitle>
                <CardDescription>
                  Set as preferred provider for auto package selection fallback
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="isPreferred">Preferred Provider</Label>
                    <p className="text-sm text-muted-foreground">
                      When auto mode finds multiple best-price packages, prefer this provider
                    </p>
                  </div>
                  <Switch
                    id="isPreferred"
                    checked={getValue('isPreferred') as boolean}
                    onCheckedChange={(checked) => setValue('isPreferred', checked)}
                    data-testid="switch-is-preferred"
                  />
                </div>

                <div className="p-4 rounded-md bg-muted">
                  <p className="text-sm font-medium mb-2">How Preferred Provider Works</p>
                  <p className="text-sm text-muted-foreground">
                    In auto mode, the system first identifies packages with the best price across
                    all providers. If multiple providers offer the same best price, packages from
                    the preferred provider are enabled automatically.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={updateProviderMutation.isPending}
            data-testid="button-cancel-provider-config"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={updateProviderMutation.isPending}
            data-testid="button-save-provider-config"
          >
            {updateProviderMutation.isPending ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
