// components/admin/tabs/GeneralSettings.tsx - Complete with internal state management
import { useState, useEffect, useMemo } from 'react';
import {
  Save,
  Building2,
  CheckCircle,
  AlertCircle,
  Loader2,
  Image as ImageIcon,
  Brain,
  Zap,
  TrendingUp,
  Settings2,
  Play,
  RefreshCw,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { useTranslation } from '@/contexts/TranslationContext';
import type { CurrencyRate } from '@shared/schema';

import { useToast } from '@/hooks/use-toast';
import { useQuery, useMutation } from '@tanstack/react-query';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { SettingsResponse } from '@/types/types';
import { useAppDispatch } from '@/redux/store/store';
import { setSettings } from '@/redux/slice/settingsSlice';

interface AIStatus {
  isConfigured: boolean;
  isReady: boolean;
  maskedKey: string | null;
  aiEnabled: boolean;
  weights: {
    price: number;
    quality: number;
    provider: number;
  };
  usage: {
    totalRequests: number;
    totalTokens: number;
    estimatedCost: number;
    errors: number;
    lastRequestAt: string | null;
  };
}

function AISettingsCard() {
  const { t } = useTranslation();
  const { toast } = useToast();

  const [aiEnabled, setAiEnabled] = useState(false);
  const [priceWeight, setPriceWeight] = useState(50);
  const [qualityWeight, setQualityWeight] = useState(30);
  const [providerWeight, setProviderWeight] = useState(20);
  const [testing, setTesting] = useState(false);
  const [running, setRunning] = useState(false);

  const { data: aiStatus, refetch: refetchStatus } = useQuery<AIStatus>({
    queryKey: ['/api/admin/ai-settings/status'],
  });

  useEffect(() => {
    if (aiStatus) {
      setAiEnabled(aiStatus.aiEnabled);
      setPriceWeight(aiStatus.weights.price);
      setQualityWeight(aiStatus.weights.quality);
      setProviderWeight(aiStatus.weights.provider);
    }
  }, [aiStatus]);

  const saveAISettings = useMutation({
    mutationFn: async (data: {
      enabled?: boolean;
      priceWeight?: number;
      qualityWeight?: number;
      providerWeight?: number;
    }) => {
      return await apiRequest('POST', '/api/admin/ai-settings/update', data);
    },
    onSuccess: () => {
      refetchStatus();
      queryClient.invalidateQueries({ queryKey: ['/api/admin/platform-settings'] });
      toast({ title: 'Success', description: 'AI settings updated' });
    },
    onError: (error: any) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    },
  });

  const testConnection = async () => {
    setTesting(true);
    try {
      const res = await apiRequest('POST', '/api/admin/ai-settings/test');
      const data = await res.json();
      if (data.success) {
        toast({
          title: 'Connection Successful',
          description: `Latency: ${data.data?.latencyMs}ms`,
        });
      } else {
        toast({ title: 'Connection Failed', description: data.message, variant: 'destructive' });
      }
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } finally {
      setTesting(false);
    }
  };

  const runAISelection = async () => {
    setRunning(true);
    try {
      const res = await apiRequest('POST', '/api/admin/ai-settings/run-selection');
      const data = await res.json();
      if (data.success) {
        toast({
          title: 'AI Selection Complete',
          description: `Enabled: ${data.data?.packagesEnabled}, Disabled: ${data.data?.packagesDisabled}`,
        });
        refetchStatus();
      } else {
        toast({ title: 'Failed', description: data.message, variant: 'destructive' });
      }
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } finally {
      setRunning(false);
    }
  };

  const handleSaveWeights = () => {
    const total = priceWeight + qualityWeight + providerWeight;
    if (total !== 100) {
      toast({
        title: 'Invalid Weights',
        description: 'Weights must sum to 100%',
        variant: 'destructive',
      });
      return;
    }
    saveAISettings.mutate({ priceWeight, qualityWeight, providerWeight });
  };

  const handleToggleAI = (enabled: boolean) => {
    setAiEnabled(enabled);
    saveAISettings.mutate({ enabled });
  };

  return (
    <Card className="border-0 shadow-xl hover:shadow-[0_25px_50px_-12px_color-mix(in_srgb,var(--primary-hex)_30%,transparent)] transition-all duration-500">
      <CardHeader>
        <CardTitle className="text-2xl font-bold bg-gradient-to-r from-[var(--primary-hex)] to-[var(--primary-second-hex)] bg-clip-text text-transparent flex items-center gap-2">
          <Brain className="h-6 w-6 text-[var(--primary-hex)]" />
          {t('admin.settings.ai.title', 'AI-Enhanced Package Selection')}
        </CardTitle>
        <CardDescription className="text-lg text-[var(--primary-hex)]/70">
          {t(
            'admin.settings.ai.description',
            'Use AI to intelligently select the best packages considering price, quality, and provider reliability',
          )}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 p-8">
        {/* Connection Status */}
        <div className="p-6 rounded-2xl border-2 border-border bg-gradient-to-br from-muted/30 to-transparent">
          <div className="flex items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-3">
              <Zap className="h-5 w-5 text-[var(--primary-hex)]" />
              <span className="text-xl font-bold">OpenAI Connection</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge
                className={aiStatus?.isReady ? 'bg-green-600 text-white' : 'bg-red-500 text-white'}
              >
                {aiStatus?.isReady ? 'Connected' : 'Not Connected'}
              </Badge>
              {aiStatus?.maskedKey && (
                <span className="text-xs text-muted-foreground font-mono">
                  {aiStatus.maskedKey}
                </span>
              )}
            </div>
          </div>

          {!aiStatus?.isConfigured && (
            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 mb-4">
              <p className="text-sm text-amber-600 dark:text-amber-400">
                Add your OpenAI API key as a secret named{' '}
                <code className="font-mono bg-muted px-1 rounded">OPENAI_API_KEY</code> to enable AI
                features.
              </p>
            </div>
          )}

          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={testConnection}
              disabled={testing || !aiStatus?.isConfigured}
              data-testid="button-test-ai"
            >
              {testing ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Play className="h-4 w-4 mr-2" />
              )}
              Test Connection
            </Button>
          </div>
        </div>

        {/* AI Toggle */}
        <div className="p-6 rounded-2xl border-2 border-border">
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="text-xl font-bold mb-1 flex items-center gap-2">
                <Brain className="h-5 w-5 text-[var(--primary-hex)]" />
                Enable AI Selection
              </div>
              <p className="text-sm text-muted-foreground">
                When enabled, AI analyzes packages and scores them based on value, not just price
              </p>
            </div>
            <Switch
              checked={aiEnabled}
              onCheckedChange={handleToggleAI}
              disabled={!aiStatus?.isReady || saveAISettings.isPending}
              data-testid="switch-ai-enabled"
            />
          </div>
        </div>

        {/* Scoring Weights */}
        {aiEnabled && (
          <div className="p-6 rounded-2xl border-2 border-[var(--primary-hex)]/30 bg-gradient-to-br from-[var(--primary-light-hex)]/10 to-transparent">
            <div className="flex items-center gap-2 mb-6">
              <Settings2 className="h-5 w-5 text-[var(--primary-hex)]" />
              <span className="text-xl font-bold">Scoring Weights</span>
              <Badge variant="outline" className="ml-auto">
                Total: {priceWeight + qualityWeight + providerWeight}%
              </Badge>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="font-semibold">Price Weight</Label>
                  <span className="text-sm font-mono bg-muted px-2 py-1 rounded">
                    {priceWeight}%
                  </span>
                </div>
                <Slider
                  value={[priceWeight]}
                  onValueChange={([v]) => setPriceWeight(v)}
                  max={100}
                  step={5}
                  data-testid="slider-price-weight"
                />
                <p className="text-xs text-muted-foreground">How much to prioritize lower prices</p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="font-semibold">Quality Weight</Label>
                  <span className="text-sm font-mono bg-muted px-2 py-1 rounded">
                    {qualityWeight}%
                  </span>
                </div>
                <Slider
                  value={[qualityWeight]}
                  onValueChange={([v]) => setQualityWeight(v)}
                  max={100}
                  step={5}
                  data-testid="slider-quality-weight"
                />
                <p className="text-xs text-muted-foreground">
                  AI-analyzed value (data/price ratio, validity, features)
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="font-semibold">Provider Weight</Label>
                  <span className="text-sm font-mono bg-muted px-2 py-1 rounded">
                    {providerWeight}%
                  </span>
                </div>
                <Slider
                  value={[providerWeight]}
                  onValueChange={([v]) => setProviderWeight(v)}
                  max={100}
                  step={5}
                  data-testid="slider-provider-weight"
                />
                <p className="text-xs text-muted-foreground">
                  Provider reliability and reputation score
                </p>
              </div>
            </div>

            <div className="flex gap-2 mt-6">
              <Button
                onClick={handleSaveWeights}
                disabled={saveAISettings.isPending}
                className="bg-gradient-to-r from-[var(--primary-hex)] to-[var(--primary-second-hex)]"
                data-testid="button-save-weights"
              >
                {saveAISettings.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Save className="h-4 w-4 mr-2" />
                )}
                Save Weights
              </Button>
              <Button
                variant="outline"
                onClick={runAISelection}
                disabled={running}
                data-testid="button-run-ai"
              >
                {running ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <RefreshCw className="h-4 w-4 mr-2" />
                )}
                Run AI Selection Now
              </Button>
            </div>
          </div>
        )}

        {/* Usage Stats */}
        {aiStatus?.usage && aiStatus.usage.totalRequests > 0 && (
          <div className="p-6 rounded-xl bg-gradient-to-r from-[var(--primary-light-hex)]/20 to-transparent border border-[var(--primary-hex)]/30">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="h-5 w-5 text-[var(--primary-hex)]" />
              <span className="text-lg font-bold text-[var(--primary-hex)]">
                AI Usage Statistics
              </span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-3 bg-muted/50 rounded-lg">
                <div className="text-2xl font-bold">{aiStatus.usage.totalRequests}</div>
                <div className="text-xs text-muted-foreground">Requests</div>
              </div>
              <div className="text-center p-3 bg-muted/50 rounded-lg">
                <div className="text-2xl font-bold">
                  {(aiStatus.usage.totalTokens / 1000).toFixed(1)}k
                </div>
                <div className="text-xs text-muted-foreground">Tokens</div>
              </div>
              <div className="text-center p-3 bg-muted/50 rounded-lg">
                <div className="text-2xl font-bold">${aiStatus.usage.estimatedCost.toFixed(2)}</div>
                <div className="text-xs text-muted-foreground">Est. Cost</div>
              </div>
              <div className="text-center p-3 bg-muted/50 rounded-lg">
                <div className="text-2xl font-bold">{aiStatus.usage.errors}</div>
                <div className="text-xs text-muted-foreground">Errors</div>
              </div>
            </div>
          </div>
        )}

        {/* AI Features List */}
        <div className="p-6 rounded-xl bg-gradient-to-r from-[var(--primary-light-hex)]/20 to-transparent border border-[var(--primary-hex)]/30">
          <p className="text-lg font-bold mb-3 text-[var(--primary-hex)]">AI-Powered Features</p>
          <ul className="text-sm text-muted-foreground leading-relaxed space-y-2">
            <li className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              Composite scoring combining price, quality, and provider reliability
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              Intelligent package analysis with value assessments
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              Automatic fallback to price-only mode if AI unavailable
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              24-hour result caching to minimize API costs
            </li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}

export function GeneralSettings() {
  const { t } = useTranslation();
  const { toast } = useToast();

  const dispatch = useAppDispatch();

  // Internal state management
  const [platformName, setPlatformName] = useState('');
  const [platformTagline, setPlatformTagline] = useState('');
  const [logo, setLogo] = useState<string | null>(null);
  const [whiteLogo, setWhiteLogo] = useState<string | null>(null);
  const [favicon, setFavicon] = useState<string | null>(null);
  const [copyrightText, setCopyrightText] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [email, setEmail] = useState('');
  const [packageSelectionMode, setPackageSelectionMode] = useState<'auto' | 'manual'>('auto');

  // Fetch settings from API
  const { data: settingsResponse } = useQuery<SettingsResponse>({
    queryKey: ['/api/admin/settings'],
  });



  // console.log('settingsResponse', settingsResponse);

  // Fetch available currencies
  const { data: currencies = [] } = useQuery<CurrencyRate[]>({
    queryKey: ['/api/admin/currencies'],
  });

  // Transform settings array to object
  const settings = useMemo(() => {
    if (!settingsResponse) return {};

    return settingsResponse?.reduce((acc: Record<string, string>, setting: any) => {
      acc[setting.key] = setting.value;
      return acc;
    }, {});
  }, [settingsResponse]);

  // Load settings into state
  useEffect(() => {
    if (settings && Object.keys(settings).length > 0) {
      setPlatformName(settings.platform_name || '');
      setPlatformTagline(settings.platform_tagline || '');
      setLogo(settings.logo || null);
      setWhiteLogo(settings.white_logo || null);
      setFavicon(settings.favicon || null);
      setCopyrightText(settings.copyright_text || '');
      setCurrency(settings.currency || 'USD');
      setEmail(settings.email || '')
      setPackageSelectionMode((settings.package_selection_mode as 'auto' | 'manual') || 'auto');
    }
  }, [settings]);

  // Update setting mutation
  const updateSettingMutation = useMutation({
    mutationFn: async ({
      key,
      value,
      category,
    }: {
      key: string;
      value: string;
      category: string;
    }) => {
      return await apiRequest('PUT', `/api/admin/settings/${key}`, {
        value,
        category,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/settings'] });
      queryClient.invalidateQueries({ queryKey: ['/api/packages'] });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/packages'] });
      toast({
        title: t('admin.settings.success', 'Success'),
        description: t('admin.settings.settingsUpdatedSuccess', 'Settings updated successfully'),
      });
    },
    onError: (error: any) => {
      toast({
        title: t('admin.settings.error', 'Error'),
        description:
          error.message || t('admin.settings.failedToUpdateSettings', 'Failed to update settings'),
        variant: 'destructive',
      });
    },
  });

  // Save single setting
  const saveSetting = async (key: string, value: string, category: string = 'general') => {
    await updateSettingMutation.mutateAsync({ key, value, category });
  };

  // Handle general settings save
  const handleSaveGeneral = async () => {
    if (!platformName.trim()) {
      toast({
        title: t('admin.settings.validationError', 'Validation Error'),
        description: t('admin.settings.platformNameRequired', 'Platform name is required'),
        variant: 'destructive',
      });
      return;
    }
    await saveSetting('platform_name', platformName, 'general');
    await saveSetting('platform_tagline', platformTagline, 'general');
    await saveSetting('copyright_text', copyrightText, 'general');
    await saveSetting('currency', currency, 'general');
    await saveSetting('email', email, 'general');
    if (logo) {
      await saveSetting('logo', logo, 'general');
    }
    if (whiteLogo) {
      await saveSetting('white_logo', whiteLogo, 'general');
    }
    if (favicon) {
      await saveSetting('favicon', favicon, 'general');
    }
  };

  // Upload image helper
  const uploadImage = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('image', file);

    const res = await apiRequest('POST', '/api/upload', formData);

    if (!res.ok) {
      throw new Error('Image upload failed');
    }

    const data = await res.json();
    // console.log('data', data);
    return data?.data?.fileUrl;
  };

  // Handle logo upload
  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const path = await uploadImage(file);
      // console.log('path', path);
      setLogo(path);
      toast({
        title: 'Success',
        description: 'Logo uploaded successfully',
      });
    } catch (err) {
      console.error(err);
      toast({
        title: 'Error',
        description: 'Failed to upload logo',
        variant: 'destructive',
      });
    }
  };

  // Handle white logo upload
  const handleWhiteLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const path = await uploadImage(file);
      setWhiteLogo(path);
      toast({
        title: 'Success',
        description: 'White logo uploaded successfully',
      });
    } catch (err) {
      console.error(err);
      toast({
        title: 'Error',
        description: 'Failed to upload white logo',
        variant: 'destructive',
      });
    }
  };

  // Handle favicon upload
  const handleFaviconUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const path = await uploadImage(file);
      // console.log('path', path);
      setFavicon(path);
      toast({
        title: 'Success',
        description: 'Favicon uploaded successfully',
      });
    } catch (err) {
      console.error(err);
      toast({
        title: 'Error',
        description: 'Failed to upload favicon',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Platform Information Card */}
      <Card className="border-0 shadow-xl hover:shadow-[0_25px_50px_-12px_color-mix(in_srgb,var(--primary-hex)_30%,transparent)] transition-all duration-500">
        <CardHeader>
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-[var(--primary-hex)] via-[var(--primary-second-hex)] to-[var(--primary-light-hex)] bg-clip-text text-transparent">
            {t('admin.settings.general.platformInfoTitle', 'Platform Information')}
          </CardTitle>
          <CardDescription className="text-lg text-[var(--primary-hex)]/80">
            {t(
              'admin.settings.general.platformInfoDescription',
              "Configure your platform's basic information and branding",
            )}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-8 space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Text Inputs */}
            <div className="space-y-6">
              <div className="space-y-3">
                <Label className="text-lg font-semibold flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-[var(--primary-hex)]" />
                  {t('admin.settings.general.platformName', 'Platform Name')}
                </Label>
                <Input
                  value={platformName}
                  onChange={(e) => setPlatformName(e.target.value)}
                  placeholder={t('admin.settings.general.platformNamePlaceholder', 'My eSIM Store')}
                  className="h-14 text-lg ring-2 ring-[var(--primary-hex)]/20 focus:ring-[var(--primary-hex)] focus:border-[var(--primary-hex)] transition-all duration-300"
                  data-testid="input-platform-name"
                />
              </div>


              <div className="space-y-3">
                <Label className="text-lg font-semibold">
                  {t('admin.settings.general.tagline', 'Tagline')}
                </Label>
                <Input
                  value={platformTagline}
                  onChange={(e) => setPlatformTagline(e.target.value)}
                  placeholder={t(
                    'admin.settings.general.taglinePlaceholder',
                    'Global connectivity made easy',
                  )}
                  className="h-12 ring-2 ring-[var(--primary-hex)]/20 focus:ring-[var(--primary-hex)] focus:border-[var(--primary-hex)] transition-all duration-300"
                  data-testid="input-platform-tagline"
                />
              </div>
              <div className="space-y-3">
                <Label className="text-lg font-semibold flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-[var(--primary-hex)]" />
                  {t('admin.settings.general.email', 'Email')}
                </Label>
                <Input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t('admin.settings.general.emailPlaceholder', 'My Email')}
                  className="h-14 text-lg ring-2 ring-[var(--primary-hex)]/20 focus:ring-[var(--primary-hex)] focus:border-[var(--primary-hex)] transition-all duration-300"
                  data-testid="input-platform-email"
                />
              </div>


              <div className="space-y-3">
                <Label className="text-lg font-semibold">
                  {t('admin.settings.general.currency', 'Default Currency')}
                </Label>
                <Select value={currency} onValueChange={setCurrency}>
                  <SelectTrigger
                    className="h-12 text-lg ring-2 ring-[var(--primary-hex)]/20 focus:ring-[var(--primary-hex)] focus:border-[var(--primary-hex)]"
                    data-testid="select-currency"
                  >
                    <SelectValue placeholder="Select a currency" />
                  </SelectTrigger>
                  <SelectContent>
                    {currencies.map((curr) => (
                      <SelectItem key={curr.id} value={curr.code}>
                        <span className="flex items-center gap-2">
                          <span className="font-mono">{curr.symbol}</span>
                          <span>{curr.code}</span>
                          <span className="text-muted-foreground">- {curr.name}</span>
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-sm font-medium px-3 py-2 bg-[var(--primary-light-hex)]/20 rounded-lg border border-[var(--primary-hex)]/20">
                  {t(
                    'admin.settings.general.currencyHelp',
                    'Select the default currency for your platform. Manage currencies in Platform Setup > Currencies.',
                  )}
                </p>
              </div>
            </div>

            {/* Right Column - Logo & Favicon */}
            <div className="space-y-6">
              {/* Logo Upload */}
              <div className="space-y-4 p-6 bg-gradient-to-br from-[var(--primary-light-hex)]/10 to-transparent border border-[var(--primary-hex)]/20 rounded-2xl">
                <Label className="text-lg font-bold text-[var(--primary-hex)] flex items-center gap-2">
                  <ImageIcon className="h-5 w-5" />
                  {t('admin.settings.general.logo', 'Platform Logo')}
                </Label>

                <div className="flex items-center gap-4">
                  {logo ? (
                    <div className="h-24 w-24 rounded-xl overflow-hidden bg-white dark:bg-black/20 shadow-xl border-2 border-[var(--primary-hex)]/30 flex items-center justify-center hover:scale-105 transition-all duration-300">
                      <img
                        src={logo}
                        alt="Logo Preview"
                        className="max-h-20 max-w-20 object-contain"
                      />
                    </div>
                  ) : (
                    <div className="h-24 w-24 rounded-xl border-2 border-dashed border-[var(--primary-hex)]/50 flex flex-col items-center justify-center text-[var(--primary-hex)] bg-[var(--primary-light-hex)]/20 hover:scale-105 transition-all duration-300">
                      <Building2 className="h-8 w-8 mb-1 opacity-70" />
                      <span className="text-xs font-semibold">No Logo</span>
                    </div>
                  )}

                  <div className="flex-1">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="h-12 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-gradient-to-r file:from-[var(--primary-hex)] file:to-[var(--primary-second-hex)] file:text-black hover:file:brightness-110 cursor-pointer"
                    />
                  </div>
                </div>

                <p className="text-xs text-[var(--primary-hex)]/70 px-3 py-1.5 bg-[var(--primary-light-hex)]/30 rounded-lg">
                  {t(
                    'admin.settings.general.logoHelp',
                    'Recommended: PNG or SVG, transparent background',
                  )}
                </p>
              </div>

              {/* White Logo Upload */}
              <div className="space-y-4 p-6 bg-gradient-to-br from-[var(--primary-light-hex)]/10 to-transparent border border-[var(--primary-hex)]/20 rounded-2xl">
                <Label className="text-lg font-bold text-[var(--primary-hex)] flex items-center gap-2">
                  <ImageIcon className="h-5 w-5" />
                  {t('admin.settings.general.whiteLogo', 'White Logo (Dark Mode)')}
                </Label>

                <div className="flex items-center gap-4">
                  {whiteLogo ? (
                    <div className="h-24 w-24 rounded-xl overflow-hidden bg-black/80 shadow-xl border-2 border-[var(--primary-hex)]/30 flex items-center justify-center hover:scale-105 transition-all duration-300">
                      <img
                        src={whiteLogo}
                        alt="White Logo Preview"
                        className="max-h-20 max-w-20 object-contain"
                      />
                    </div>
                  ) : (
                    <div className="h-24 w-24 rounded-xl border-2 border-dashed border-[var(--primary-hex)]/50 flex flex-col items-center justify-center text-[var(--primary-hex)] bg-black/40 hover:scale-105 transition-all duration-300">
                      <Building2 className="h-8 w-8 mb-1 opacity-70" />
                      <span className="text-xs font-semibold">No White Logo</span>
                    </div>
                  )}

                  <div className="flex-1">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleWhiteLogoUpload}
                      className="h-12 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-gradient-to-r file:from-[var(--primary-hex)] file:to-[var(--primary-second-hex)] file:text-black hover:file:brightness-110 cursor-pointer"
                    />
                  </div>
                </div>

                <p className="text-xs text-[var(--primary-hex)]/70 px-3 py-1.5 bg-[var(--primary-light-hex)]/30 rounded-lg">
                  {t(
                    'admin.settings.general.whiteLogoHelp',
                    'Recommended: White version for dark backgrounds',
                  )}
                </p>
              </div>

              {/* Favicon Upload */}
              <div className="space-y-4 p-6 bg-gradient-to-br from-[var(--primary-light-hex)]/10 to-transparent border border-[var(--primary-hex)]/20 rounded-2xl">
                <Label className="text-lg font-bold text-[var(--primary-hex)]">
                  {t('admin.settings.general.favicon', 'Favicon')}
                </Label>

                <div className="flex items-center gap-4">
                  {favicon ? (
                    <div className="h-16 w-16 rounded-lg overflow-hidden bg-white dark:bg-black/20 shadow-lg border-2 border-[var(--primary-hex)]/30 flex items-center justify-center hover:scale-105 transition-all duration-300">
                      <img
                        src={favicon}
                        alt="Favicon Preview"
                        className="h-10 w-10 object-contain"
                      />
                    </div>
                  ) : (
                    <div className="h-16 w-16 rounded-lg border-2 border-dashed border-[var(--primary-hex)]/50 flex items-center justify-center text-[var(--primary-hex)] bg-[var(--primary-light-hex)]/20 text-xs font-semibold hover:scale-105 transition-all duration-300">
                      No Favicon
                    </div>
                  )}

                  <div className="flex-1">
                    <Input
                      type="file"
                      accept="image/png,image/x-icon,image/svg+xml"
                      onChange={handleFaviconUpload}
                      className="h-12 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-gradient-to-r file:from-[var(--primary-hex)] file:to-[var(--primary-second-hex)] file:text-black hover:file:brightness-110 cursor-pointer"
                    />
                  </div>
                </div>

                <p className="text-xs text-[var(--primary-hex)]/70 px-3 py-1.5 bg-[var(--primary-light-hex)]/30 rounded-lg">
                  {t('admin.settings.general.faviconHelp', 'Recommended: 32×32 or 48×48 PNG/ICO')}
                </p>
              </div>
            </div>
          </div>

          {/* Copyright Text */}
          <div className="space-y-3">
            <Label className="text-lg font-semibold">
              {t('admin.settings.general.copyright', 'Copyright Text')}
            </Label>
            <Textarea
              value={copyrightText}
              onChange={(e) => setCopyrightText(e.target.value)}
              placeholder={t(
                'admin.settings.general.copyrightPlaceholder',
                '© 2024 My Company. All rights reserved.',
              )}
              rows={3}
              className="ring-2 ring-[var(--primary-hex)]/20 focus:ring-[var(--primary-hex)] focus:border-[var(--primary-hex)] resize-none"
              data-testid="textarea-copyright"
            />
          </div>

          <Button
            onClick={handleSaveGeneral}
            disabled={updateSettingMutation.isPending}
            className="gap-2 h-12 px-8 text-lg bg-gradient-to-r from-[var(--primary-hex)] to-[var(--primary-second-hex)] hover:from-[var(--primary-dark-hex)] hover:to-[var(--primary-hex)] shadow-lg hover:shadow-glow transition-all duration-300"
            data-testid="button-save-general"
          >
            {updateSettingMutation.isPending ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                {t('admin.settings.general.saving', 'Saving...')}
              </>
            ) : (
              <>
                <Save className="h-5 w-5" />
                {t('admin.settings.general.saveGeneralSettings', 'Save General Settings')}
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Package Selection Mode Card */}
      <Card className="border-0 shadow-xl hover:shadow-[0_25px_50px_-12px_color-mix(in_srgb,var(--primary-hex)_30%,transparent)] transition-all duration-500">
        <CardHeader>
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-[var(--primary-hex)] to-[var(--primary-second-hex)] bg-clip-text text-transparent">
            {t('admin.settings.general.packageModeTitle', 'Package Selection Mode')}
          </CardTitle>
          <CardDescription className="text-lg text-[var(--primary-hex)]/70">
            {t(
              'admin.settings.general.packageModeDescription',
              'Configure how packages are automatically enabled from multiple providers',
            )}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 p-8">
          <div className="space-y-4">
            {/* Auto Mode */}
            <div
              className={`p-6 rounded-2xl border-2 cursor-pointer transition-all duration-300 hover:shadow-lg ${packageSelectionMode === 'auto'
                ? 'border-[var(--primary-hex)] bg-gradient-to-br from-[var(--primary-light-hex)]/20 to-[var(--primary-hex)]/10 shadow-[0_10px_30px_-10px_color-mix(in_srgb,var(--primary-hex)_40%,transparent)]'
                : 'border-border hover:border-[var(--primary-hex)]/50 hover-elevate'
                }`}
              onClick={() => setPackageSelectionMode('auto')}
              data-testid="option-auto-mode"
            >
              <div className="flex items-start gap-4">
                <div className="flex items-center h-6">
                  <div
                    className={`h-6 w-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${packageSelectionMode === 'auto'
                      ? 'border-[var(--primary-hex)] shadow-[0_0_10px_color-mix(in_srgb,var(--primary-hex)_50%,transparent)]'
                      : 'border-muted-foreground'
                      }`}
                  >
                    {packageSelectionMode === 'auto' && (
                      <div className="h-3 w-3 rounded-full bg-gradient-to-br from-[var(--primary-hex)] to-[var(--primary-second-hex)] shadow-glow-sm"></div>
                    )}
                  </div>
                </div>
                <div className="flex-1">
                  <div className="text-xl font-bold mb-2 flex items-center gap-2">
                    {t('admin.settings.general.autoMode', 'Auto (Best Price)')}
                    {packageSelectionMode === 'auto' && (
                      <Badge className="bg-gradient-to-r from-[var(--primary-hex)] to-[var(--primary-second-hex)] text-black font-semibold shadow-md">
                        Active
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                    {t(
                      'admin.settings.general.autoModeDescription',
                      'Automatically enable packages with the best price across all providers. When multiple providers offer the same best price, packages from the preferred provider are enabled.',
                    )}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Badge
                      variant="outline"
                      className="text-xs border-[var(--primary-hex)]/40 bg-[var(--primary-light-hex)]/20 text-[var(--primary-hex)]"
                    >
                      <CheckCircle className="h-3 w-3 mr-1" />
                      {t('admin.settings.general.priceComparison', 'Price Comparison')}
                    </Badge>
                    <Badge
                      variant="outline"
                      className="text-xs border-[var(--primary-hex)]/40 bg-[var(--primary-light-hex)]/20 text-[var(--primary-hex)]"
                    >
                      <CheckCircle className="h-3 w-3 mr-1" />
                      {t(
                        'admin.settings.general.preferredProviderFallback',
                        'Preferred Provider Fallback',
                      )}
                    </Badge>
                    <Badge
                      variant="outline"
                      className="text-xs border-[var(--primary-hex)]/40 bg-[var(--primary-light-hex)]/20 text-[var(--primary-hex)]"
                    >
                      <CheckCircle className="h-3 w-3 mr-1" />
                      {t('admin.settings.general.automaticUpdates', 'Automatic Updates')}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>

            {/* Manual Mode */}
            <div
              className={`p-6 rounded-2xl border-2 cursor-pointer transition-all duration-300 hover:shadow-lg ${packageSelectionMode === 'manual'
                ? 'border-[var(--primary-hex)] bg-gradient-to-br from-[var(--primary-light-hex)]/20 to-[var(--primary-hex)]/10 shadow-[0_10px_30px_-10px_color-mix(in_srgb,var(--primary-hex)_40%,transparent)]'
                : 'border-border hover:border-[var(--primary-hex)]/50 hover-elevate'
                }`}
              onClick={() => setPackageSelectionMode('manual')}
              data-testid="option-manual-mode"
            >
              <div className="flex items-start gap-4">
                <div className="flex items-center h-6">
                  <div
                    className={`h-6 w-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${packageSelectionMode === 'manual'
                      ? 'border-[var(--primary-hex)] shadow-[0_0_10px_color-mix(in_srgb,var(--primary-hex)_50%,transparent)]'
                      : 'border-muted-foreground'
                      }`}
                  >
                    {packageSelectionMode === 'manual' && (
                      <div className="h-3 w-3 rounded-full bg-gradient-to-br from-[var(--primary-hex)] to-[var(--primary-second-hex)] shadow-glow-sm"></div>
                    )}
                  </div>
                </div>
                <div className="flex-1">
                  <div className="text-xl font-bold mb-2 flex items-center gap-2">
                    {t('admin.settings.general.manualMode', 'Manual Selection')}
                    {packageSelectionMode === 'manual' && (
                      <Badge className="bg-gradient-to-r from-[var(--primary-hex)] to-[var(--primary-second-hex)] text-black font-semibold shadow-md">
                        Active
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                    {t(
                      'admin.settings.general.manualModeDescription',
                      'Full control over which packages are enabled. You manually choose which packages from which providers are visible to customers. Price comparison still runs but packages are not auto-enabled.',
                    )}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Badge
                      variant="outline"
                      className="text-xs border-[var(--primary-hex)]/40 bg-[var(--primary-light-hex)]/20 text-[var(--primary-hex)]"
                    >
                      <AlertCircle className="h-3 w-3 mr-1" />
                      {t('admin.settings.general.manualControl', 'Manual Control')}
                    </Badge>
                    <Badge
                      variant="outline"
                      className="text-xs border-[var(--primary-hex)]/40 bg-[var(--primary-light-hex)]/20 text-[var(--primary-hex)]"
                    >
                      <AlertCircle className="h-3 w-3 mr-1" />
                      {t('admin.settings.general.noAutoUpdates', 'No Auto Updates')}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Current Mode Info */}
          <div className="p-6 rounded-xl bg-gradient-to-r from-[var(--primary-light-hex)]/20 to-transparent border border-[var(--primary-hex)]/30 backdrop-blur-sm">
            <p className="text-lg font-bold mb-3 text-[var(--primary-hex)]">
              {t('admin.settings.general.currentMode', 'Current Mode')}
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {packageSelectionMode === 'auto'
                ? t(
                  'admin.settings.general.autoModeActive',
                  'Auto mode is active. Packages are automatically enabled based on best price. Configure your preferred provider in the Providers page to set the fallback when multiple providers have the same price.',
                )
                : t(
                  'admin.settings.general.manualModeActive',
                  'Manual mode is active. You have full control over package visibility. Use the Package Management page to enable/disable specific packages.',
                )}
            </p>
          </div>

          <Button
            onClick={() => saveSetting('package_selection_mode', packageSelectionMode, 'general')}
            disabled={updateSettingMutation.isPending}
            className="gap-2 h-12 px-8 text-lg bg-gradient-to-r from-[var(--primary-hex)] to-[var(--primary-second-hex)] hover:from-[var(--primary-dark-hex)] hover:to-[var(--primary-hex)] shadow-lg hover:shadow-glow transition-all duration-300"
            data-testid="button-save-package-mode"
          >
            {updateSettingMutation.isPending ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                {t('admin.settings.general.saving', 'Saving...')}
              </>
            ) : (
              <>
                <Save className="h-5 w-5" />
                {t('admin.settings.general.savePackageMode', 'Save Package Mode')}
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* AI-Enhanced Package Selection Card */}
      <AISettingsCard />
    </div>
  );
}
