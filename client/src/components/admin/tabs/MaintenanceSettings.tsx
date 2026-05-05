import { useState, useEffect } from 'react';
import { Hammer, Save, Loader2, ShieldCheck, Globe, Zap } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useQuery, useMutation } from '@tanstack/react-query';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useTranslation } from '@/contexts/TranslationContext';
import { SettingsResponse } from '@/types/types';

export function MaintenanceSettings() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [maintenanceMode, setMaintenanceMode] = useState(false);

  // Fetch settings
  const { data: settingsResponse } = useQuery<Record<string, string>>({
    queryKey: ['/api/admin/settings'],
  });

  useEffect(() => {
    if (settingsResponse) {
      setMaintenanceMode(settingsResponse.maintenance_mode === 'true');
    }
  }, [settingsResponse]);

  const updateSettingMutation = useMutation({
    mutationFn: async ({ key, value, category }: { key: string; value: string; category: string }) => {
      return await apiRequest('PUT', `/api/admin/settings/${key}`, { value, category });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/settings'] });
      queryClient.invalidateQueries({ queryKey: ['/api/public/settings'] });
      toast({
        title: 'Success',
        description: 'Maintenance settings updated successfully',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update maintenance settings',
        variant: 'destructive',
      });
    },
  });

  const handleToggle = (checked: boolean) => {
    setMaintenanceMode(checked);
  };

  const handleSave = async () => {
    await updateSettingMutation.mutateAsync({
      key: 'maintenance_mode',
      value: maintenanceMode ? 'true' : 'false',
      category: 'general',
    });
  };

  return (
    <div className="space-y-6">
      <Card className="border-0 shadow-xl overflow-hidden bg-white dark:bg-slate-900">
        <div className="h-2 bg-gradient-to-r from-[var(--primary-hex)] via-[var(--primary-light-hex)] to-[var(--primary-hex)]" />
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <CardTitle className="text-2xl font-bold flex items-center gap-2 text-[var(--primary-hex)]">
                <Hammer className="h-6 w-6" />
                Platform Visibility
              </CardTitle>
              <CardDescription>
                Control whether the platform is accessible to the public or in maintenance mode.
              </CardDescription>
            </div>
            <Badge 
              variant={maintenanceMode ? "destructive" : "secondary"} 
              className={maintenanceMode ? "bg-red-500 text-white" : "bg-green-500 text-white"}
            >
              {maintenanceMode ? "System Offline" : "System Live"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-8 p-8">
          <div className="flex items-center justify-between p-6 rounded-3xl bg-[var(--primary-light-hex)]/10 border-2 border-[var(--primary-hex)]/20 transition-all hover:border-[var(--primary-hex)]/40 group">
            <div className="space-y-1">
              <h4 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                Maintenance Mode
                {maintenanceMode && <Zap className="h-4 w-4 text-amber-500 animate-pulse" />}
              </h4>
              <p className="text-sm text-slate-600 dark:text-slate-400 max-w-md">
                When active, all visitors except administrators will be redirected to the "Web Under Maintenance" page.
              </p>
            </div>
            <Switch
              checked={maintenanceMode}
              onCheckedChange={handleToggle}
              className="data-[state=checked]:bg-[var(--primary-hex)]"
              data-testid="switch-maintenance-mode"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 space-y-3 hover:shadow-md transition-shadow">
              <ShieldCheck className="h-8 w-8 text-[var(--primary-hex)]" />
              <h5 className="font-bold">Admin Bypass</h5>
              <p className="text-xs text-slate-500">Administrators retain full access to all features and the frontend while maintenance is active.</p>
            </div>
            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 space-y-3 hover:shadow-md transition-shadow">
              <Globe className="h-8 w-8 text-[var(--primary-hex)]" />
              <h5 className="font-bold">Real-time Apply</h5>
              <p className="text-xs text-slate-500">Visibility changes are applied instantly across the entire platform without server restarts.</p>
            </div>
            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 space-y-3 hover:shadow-md transition-shadow">
              <Zap className="h-8 w-8 text-[var(--primary-hex)]" />
              <h5 className="font-bold">Zero Latency</h5>
              <p className="text-xs text-slate-500">The maintenance check is highly optimized to ensure no impact on platform performance.</p>
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <Button
              onClick={handleSave}
              disabled={updateSettingMutation.isPending}
              className="bg-gradient-to-r from-[var(--primary-hex)] to-[var(--primary-second-hex)] text-white px-8 py-6 rounded-2xl font-bold shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95"
            >
              {updateSettingMutation.isPending ? (
                <Loader2 className="h-5 w-5 animate-spin mr-2" />
              ) : (
                <Save className="h-5 w-5 mr-2" />
              )}
              Save Configuration
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
