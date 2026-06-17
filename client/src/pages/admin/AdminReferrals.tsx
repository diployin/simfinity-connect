import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import {
  Gift,
  Settings,
  Users,
  TrendingUp,
  DollarSign,
  Percent,
  Save,
  Download,
  Check,
  X,
  Search,
  Filter,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useTranslation } from '@/contexts/TranslationContext';
import { useCurrency } from '@/contexts/CurrencyContext';
import { getCurrencySymbol } from '@/lib/currency';
import { format } from 'date-fns';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import {
  XCircle,
  Clock,
  ArrowRightLeft,
} from 'lucide-react';

// Types
interface ReferralSettings {
  id: string;
  enabled: boolean;
  rewardType: string;
  rewardValue: string;
  referredUserDiscount: string;
  minOrderAmount: string;
  expiryDays: number;
  termsAndConditions: string;
}

interface Referral {
  id: string;
  referralCode: string;
  status: string;
  rewardAmount: string | null;
  rewardPaid: boolean;
  completedAt: string | null;
  createdAt: string;
  referrerEmail: string | null;
  referrerName: string | null;
  referredEmail: string | null;
  referredName: string | null;
}

interface ReferralsResponse {
  referrals: Referral[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  statistics: {
    totalReferrals: number;
    pending: number;
    completed: number;
    totalRewards: number;
    pendingPayouts: number;
  };
}

interface TopReferrer {
  userId: string;
  userEmail: string;
  userName: string | null;
  referralCode: string;
  totalReferrals: number;
  totalEarnings: string;
}

interface StatusDistributionItem {
  status: string;
  count: number;
}

interface MonthlyGrowthItem {
  month: string;
  count: number;
}

interface AnalyticsData {
  averageReward: number;
  avgTimeToConversion: number;
  mostActiveMonth: string;
}

interface ReferralTransaction {
  id: string;
  userId: string;
  userEmail: string;
  userName: string | null;
  type: 'credit_earned' | 'credit_used' | 'credit_expired' | 'credit_adjusted';
  amount: string;
  balanceBefore: string;
  balanceAfter: string;
  description: string | null;
  createdAt: string;
  orderId: string | null;
}

interface TransactionsResponse {
  success: boolean;
  transactions: ReferralTransaction[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Form schema
const settingsSchema = z.object({
  enabled: z.boolean(),
  rewardType: z.enum(['percentage', 'fixed']),
  rewardValue: z.string().min(1, 'Reward value is required'),
  referredUserDiscount: z.string().min(1, 'Discount is required'),
  minOrderAmount: z.string().min(1, 'Minimum order amount is required'),
  expiryDays: z.number().min(1, 'Expiry days must be at least 1'),
  termsAndConditions: z.string(),
});

type SettingsFormData = z.infer<typeof settingsSchema>;

// Settings Tab Component
function SettingsTab() {
  const { t } = useTranslation();
  const { toast } = useToast();

  const { data: settings, isLoading } = useQuery<ReferralSettings>({
    queryKey: ['/api/admin/referrals/settings'],
  });

  const form = useForm<SettingsFormData>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      enabled: settings?.enabled || false,
      rewardType: (settings?.rewardType as 'percentage' | 'fixed') || 'percentage',
      rewardValue: settings?.rewardValue || '10',
      referredUserDiscount: settings?.referredUserDiscount || '10',
      minOrderAmount: settings?.minOrderAmount || '0',
      expiryDays: settings?.expiryDays || 90,
      termsAndConditions: settings?.termsAndConditions || '',
    },
  });

  // Update form when settings load
  useState(() => {
    if (settings) {
      form.reset({
        enabled: settings.enabled,
        rewardType: settings.rewardType as 'percentage' | 'fixed',
        rewardValue: settings.rewardValue,
        referredUserDiscount: settings.referredUserDiscount,
        minOrderAmount: settings.minOrderAmount,
        expiryDays: settings.expiryDays,
        termsAndConditions: settings.termsAndConditions || '',
      });
    }
  });

  const saveMutation = useMutation({
    mutationFn: async (data: SettingsFormData) => {
      return await apiRequest('PUT', '/api/admin/referrals/settings', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['/api/admin/referrals/settings'],
      });
      toast({
        title: t('common.success'),
        description: t('adminPanel.referrals.settingsSaved'),
      });
    },
    onError: (error: any) => {
      toast({
        title: t('common.error'),
        description: error.message || 'Failed to save settings',
        variant: 'destructive',
      });
    },
  });

  const onSubmit = (data: SettingsFormData) => {
    saveMutation.mutate(data);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-24" />
        ))}
      </div>
    );
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <Card className="dark:bg-slate-950">
        <CardHeader>
          <CardTitle>{t('adminPanel.referrals.settings', 'Settings')}</CardTitle>
          <CardDescription>{t('adminPanel.referrals.settingsDescription', 'Configure the referral program settings')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Enable Program */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="enabled">{t('adminPanel.referrals.enabled', 'Enabled')}</Label>
              <div className="text-sm text-muted-foreground">
                {t('adminPanel.referrals.enabledDescription', 'Enable or disable the referral program')}
              </div>
            </div>
            <Switch
              id="enabled"
              checked={form.watch('enabled')}
              onCheckedChange={(checked) => form.setValue('enabled', checked)}
              data-testid="switch-enabled"
            />
          </div>

          {/* Reward Type */}
          <div className="space-y-3">
            <Label>{t('adminPanel.referrals.rewardType', 'Reward Type')}</Label>
            <RadioGroup
              value={form.watch('rewardType')}
              onValueChange={(value) =>
                form.setValue('rewardType', value as 'percentage' | 'fixed')
              }
              data-testid="radio-reward-type"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="percentage" id="percentage" />
                <Label htmlFor="percentage" className="font-normal">
                  {t('adminPanel.referrals.percentage', 'Percentage')}
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="fixed" id="fixed" />
                <Label htmlFor="fixed" className="font-normal">
                  {t('adminPanel.referrals.fixedAmount', 'Fixed Amount')}
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Reward Value */}
          <div className="space-y-2">
            <Label htmlFor="rewardValue">
              {t('adminPanel.referrals.rewardValue', 'Reward Value')} (
              {form.watch('rewardType') === 'percentage' ? '%' : '$'})
            </Label>
            <Input
              id="rewardValue"
              type="number"
              step="0.01"
              {...form.register('rewardValue')}
              data-testid="input-reward-value"
              className="dark:bg-slate-900"
            />
            {form.formState.errors.rewardValue && (
              <p className="text-sm text-destructive">
                {form.formState.errors.rewardValue.message}
              </p>
            )}
          </div>

          {/* Referred User Discount */}
          <div className="space-y-2">
            <Label htmlFor="referredUserDiscount">{t('adminPanel.referrals.referredDiscount', 'Referred Discount')}</Label>
            <Input
              id="referredUserDiscount"
              type="number"
              step="0.01"
              {...form.register('referredUserDiscount')}
              data-testid="input-referred-discount"
              className="dark:bg-slate-900"
            />
            {form.formState.errors.referredUserDiscount && (
              <p className="text-sm text-destructive">
                {form.formState.errors.referredUserDiscount.message}
              </p>
            )}
          </div>

          {/* Min Order Amount */}
          <div className="space-y-2">
            <Label htmlFor="minOrderAmount">{t('adminPanel.referrals.minOrderAmount', 'Min Order Amount')}</Label>
            <Input
              id="minOrderAmount"
              type="number"
              step="0.01"
              {...form.register('minOrderAmount')}
              data-testid="input-min-order"
              className="dark:bg-slate-900"
            />
            {form.formState.errors.minOrderAmount && (
              <p className="text-sm text-destructive">
                {form.formState.errors.minOrderAmount.message}
              </p>
            )}
          </div>

          {/* Expiry Days */}
          <div className="space-y-2">
            <Label htmlFor="expiryDays">{t('adminPanel.referrals.expiryDays', 'Expiry Days')}</Label>
            <Input
              id="expiryDays"
              type="number"
              {...form.register('expiryDays', { valueAsNumber: true })}
              data-testid="input-expiry-days"
              className="dark:bg-slate-900"
            />
            {form.formState.errors.expiryDays && (
              <p className="text-sm text-destructive">{form.formState.errors.expiryDays.message}</p>
            )}
          </div>

          {/* Terms & Conditions */}
          <div className="space-y-2">
            <Label htmlFor="termsAndConditions">{t('adminPanel.referrals.termsAndConditions', 'Terms & Conditions')}</Label>
            <Textarea
              id="termsAndConditions"
              rows={6}
              placeholder={t('adminPanel.referrals.termsPlaceholder', 'Enter terms and conditions...')}
              {...form.register('termsAndConditions')}
              data-testid="textarea-terms"
              className="dark:bg-slate-900"
            />
          </div>

          <Button
            type="submit"
            disabled={saveMutation.isPending}
            data-testid="button-save-settings"
          >
            <Save className="h-4 w-4 mr-2" />
            {saveMutation.isPending ? t('common.loading', 'Loading...') : t('adminPanel.referrals.saveSettings', 'Save Settings')}
          </Button>
        </CardContent>
      </Card>
    </form>
  );
}

// Referrals Tab Component
function ReferralsTab() {
  const { t } = useTranslation();
  const { currencies } = useCurrency();
  const { toast } = useToast();
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const { data: referralsData, isLoading } = useQuery<ReferralsResponse>({
    queryKey: ['/api/admin/referrals'],
  });

  const referrals: Referral[] = referralsData?.referrals || [];

  const markPaidMutation = useMutation({
    mutationFn: async (referralId: string) => {
      return await apiRequest('POST', `/api/admin/referrals/${referralId}/mark-paid`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/referrals'] });
      toast({
        title: t('common.success'),
        description: t('adminPanel.referrals.markedPaid'),
      });
    },
    onError: (error: any) => {
      toast({
        title: t('common.error'),
        description: error.message || 'Failed to mark as paid',
        variant: 'destructive',
      });
    },
  });

  // Filter referrals
  const filteredReferrals = referrals.filter((ref: Referral) => {
    const matchesStatus = statusFilter === 'all' || ref.status === statusFilter;
    const matchesSearch =
      !searchQuery ||
      ref.referrerEmail?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ref.referredEmail?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ref.referralCode.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesStatus && matchesSearch;
  });

  // Calculate stats - use API statistics if available, otherwise calculate locally
  const totalReferrals = referralsData?.statistics?.totalReferrals ?? referrals.length;
  const completedReferrals =
    referralsData?.statistics?.completed ??
    referrals.filter((r: Referral) => r.status === 'completed').length;
  const conversionRate = totalReferrals > 0 ? (completedReferrals / totalReferrals) * 100 : 0;
  const totalRewardsPaid =
    referralsData?.statistics?.totalRewards ??
    referrals
      .filter((r: Referral) => r.rewardPaid && r.rewardAmount)
      .reduce((sum: number, r: Referral) => sum + parseFloat(r.rewardAmount || '0'), 0);
  const pendingPayouts =
    referralsData?.statistics?.pendingPayouts ??
    referrals
      .filter((r: Referral) => r.status === 'completed' && !r.rewardPaid && r.rewardAmount)
      .reduce((sum: number, r: Referral) => sum + parseFloat(r.rewardAmount || '0'), 0);

  // Export to CSV
  const exportToCSV = () => {
    const headers = [
      'Referrer Email',
      'Referred Email',
      'Code',
      'Status',
      'Reward Amount',
      'Paid',
      'Date',
    ];
    const rows = filteredReferrals.map((ref: Referral) => [
      ref.referrerEmail || '',
      ref.referredEmail || '',
      ref.referralCode,
      ref.status,
      ref.rewardAmount || '0',
      ref.rewardPaid ? 'Yes' : 'No',
      format(new Date(ref.createdAt), 'yyyy-MM-dd'),
    ]);

    const csvContent = [headers.join(','), ...rows.map((row: string[]) => row.join(','))].join(
      '\n',
    );

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `referrals-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);

    toast({
      title: t('common.success'),
      description: 'Exported referrals to CSV',
    });
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t('adminPanel.referrals.totalReferrals')}
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalReferrals}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t('adminPanel.referrals.conversionRate')}
            </CardTitle>
            <Percent className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{conversionRate.toFixed(1)}%</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t('adminPanel.referrals.totalRewards')}
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {getCurrencySymbol('USD', currencies)}
              {totalRewardsPaid.toFixed(2)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Most Active Month</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{referralsData?.statistics ? (analyticsData?.mostActiveMonth || 'N/A') : <Skeleton className="h-8 w-20" />}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="list" className="space-y-4">
        <TabsList>
          <TabsTrigger value="list">Referral List</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <CardTitle>Referral List</CardTitle>
                <div className="flex gap-2 w-full sm:w-auto">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={exportToCSV}
                    data-testid="button-export-csv"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    {t('adminPanel.referrals.exportCSV')}
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by email or code..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                    data-testid="input-search"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full sm:w-[180px]" data-testid="select-status-filter">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Referrals Table */}
              {isLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-16" />
                  ))}
                </div>
              ) : filteredReferrals.length === 0 ? (
                <div className="text-center py-12">
                  <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No referrals found</h3>
                  <p className="text-muted-foreground">
                    {searchQuery || statusFilter !== 'all'
                      ? 'Try adjusting your filters'
                      : 'Referrals will appear here when users start sharing'}
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4 font-medium">Referrer</th>
                        <th className="text-left py-3 px-4 font-medium">Referred User</th>
                        <th className="text-left py-3 px-4 font-medium">Code</th>
                        <th className="text-left py-3 px-4 font-medium">Status</th>
                        <th className="text-left py-3 px-4 font-medium">Reward</th>
                        <th className="text-left py-3 px-4 font-medium">Paid</th>
                        <th className="text-left py-3 px-4 font-medium">Date</th>
                        <th className="text-left py-3 px-4 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredReferrals.map((referral: Referral, index: number) => (
                        <tr
                          key={referral.id}
                          className="border-b"
                          data-testid={`row-referral-${index}`}
                        >
                          <td className="py-4 px-4">
                            <div className="text-sm">
                              <div className="font-medium">{referral.referrerName || 'Unknown'}</div>
                              <div className="text-muted-foreground">{referral.referrerEmail}</div>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <div className="text-sm">
                              <div className="font-medium">{referral.referredName || 'Unknown'}</div>
                              <div className="text-muted-foreground">{referral.referredEmail}</div>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <code className="text-xs bg-muted px-2 py-1 rounded">
                              {referral.referralCode}
                            </code>
                          </td>
                          <td className="py-4 px-4">
                            <Badge
                              variant={referral.status === 'completed' ? 'default' : 'secondary'}
                              className={
                                referral.status === 'completed' ? 'bg-green-500' : 'bg-yellow-500'
                              }
                            >
                              {referral.status}
                            </Badge>
                          </td>
                          <td className="py-4 px-4 font-semibold">
                            {referral.rewardAmount
                              ? `${getCurrencySymbol(
                                'USD',
                                currencies,
                              )}${parseFloat(referral.rewardAmount).toFixed(2)}`
                              : '-'}
                          </td>
                          <td className="py-4 px-4">
                            {referral.rewardPaid ? (
                              <Check className="h-5 w-5 text-green-500" />
                            ) : (
                              <X className="h-5 w-5 text-muted-foreground" />
                            )}
                          </td>
                          <td className="py-4 px-4 text-sm text-muted-foreground">
                            {format(new Date(referral.createdAt), 'MMM d, yyyy')}
                          </td>
                          <td className="py-4 px-4">
                            {referral.status === 'completed' && !referral.rewardPaid && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => markPaidMutation.mutate(referral.id)}
                                disabled={markPaidMutation.isPending}
                                data-testid={`button-mark-paid-${index}`}
                              >
                                {t('adminPanel.referrals.markPaid')}
                              </Button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="transactions">
          <ReferralTransactionsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function ReferralTransactionsTab() {
  const { currencies } = useCurrency();
  const { data: txsData, isLoading } = useQuery<TransactionsResponse>({
    queryKey: ['/api/admin/referrals/transactions'],
  });

  const transactions = txsData?.transactions || [];

  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-16" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Referral Transactions</CardTitle>
        <CardDescription>History of all referral credits earned and used</CardDescription>
      </CardHeader>
      <CardContent>
        {transactions.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <ArrowRightLeft className="h-12 w-12 mx-auto mb-4 opacity-20" />
            <p>No referral transactions found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b text-sm">
                  <th className="text-left py-3 px-4 font-medium">User</th>
                  <th className="text-left py-3 px-4 font-medium">Type</th>
                  <th className="text-left py-3 px-4 font-medium">Amount</th>
                  <th className="text-left py-3 px-4 font-medium">Balance</th>
                  <th className="text-left py-3 px-4 font-medium">Description</th>
                  <th className="text-left py-3 px-4 font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((tx) => (
                  <tr key={tx.id} className="border-b text-sm">
                    <td className="py-3 px-4">
                      <div>
                        <div className="font-medium">{tx.userName || 'Unknown'}</div>
                        <div className="text-xs text-muted-foreground">{tx.userEmail}</div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant="outline" className="capitalize">
                        {tx.type.replace('_', ' ')}
                      </Badge>
                    </td>
                    <td className={`py-3 px-4 font-medium ${parseFloat(tx.amount) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {parseFloat(tx.amount) >= 0 ? '+' : ''}{getCurrencySymbol('USD', currencies)}{parseFloat(tx.amount).toFixed(2)}
                    </td>
                    <td className="py-3 px-4 text-muted-foreground">
                      {getCurrencySymbol('USD', currencies)}{parseFloat(tx.balanceAfter).toFixed(2)}
                    </td>
                    <td className="py-3 px-4 max-w-xs truncate" title={tx.description || ''}>
                      {tx.description}
                    </td>
                    <td className="py-3 px-4 text-xs text-muted-foreground">
                      {format(new Date(tx.createdAt), 'MMM d, p')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}


// Analytics Tab Component
function AnalyticsTab() {
  const { t } = useTranslation();
  const { currencies } = useCurrency();

  const { data: analyticsData, isLoading } = useQuery<AnalyticsData>({
    queryKey: ['/api/admin/referrals/analytics'],
  });

  console.log(analyticsData);

  const COLORS = ['var(--primary)', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  if (isLoading) {
    return (
      <div className="space-y-6">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-96" />
        ))}
      </div>
    );
  }

  if (!analyticsData) {
    return <div>No analytics data available</div>;
  }

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <Percent className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {Number(analyticsData?.conversionRate).toFixed(1)}%
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Reward</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {getCurrencySymbol('USD', currencies)}
              {analyticsData.averageReward.toFixed(2)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Time to Convert</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{analyticsData?.avgTimeToConversion.toFixed(1)}d</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Most Active Month</CardTitle>
            <Gift className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData?.mostActiveMonth}</div>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Growth Chart */}
      <Card>
        <CardHeader>
          <CardTitle>{t('adminPanel.referrals.monthlyGrowth')}</CardTitle>
          <CardDescription>Referral trends over time</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={analyticsData.monthlyGrowth}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="count" stroke="var(--primary)" name="Total Referrals" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Top Referrers Chart */}
        <Card>
          <CardHeader>
            <CardTitle>{t('adminPanel.referrals.topReferrers')}</CardTitle>
            <CardDescription>Top 10 referrers by successful referrals</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analyticsData.topReferrers.slice(0, 10)}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="userEmail" angle={-45} textAnchor="end" height={100} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="totalReferrals" fill="var(--primary)" name="Referrals" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Status Distribution Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Status Distribution</CardTitle>
            <CardDescription>Referral status breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={analyticsData.statusDistribution}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="count"
                  nameKey="status"
                >
                  {analyticsData.statusDistribution.map(
                    (entry: StatusDistributionItem, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ),
                  )}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Main Component
export default function AdminReferrals() {
  const { t } = useTranslation();

  return (
    <>
      <Helmet>
        <title>
          {String(t('adminPanel.referrals.title', 'Referral Program'))} - Admin - eSIM Global
        </title>
        <meta name="description" content="Manage the referral program" />
      </Helmet>

      <div className="space-y-6">
        <div className="flex flex-col md:flex-row items-start gap-3">
          <Gift className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold text-foreground">{t('adminPanel.referrals.title')}</h1>
            <p className="text-muted-foreground">Manage and track your referral program</p>
          </div>
        </div>

        <Tabs defaultValue="settings" className="space-y-6">
          <TabsList className="flex w-full p-1 gap-1">
            <TabsTrigger
              value="settings"
              className="flex-1 gap-1 sm:gap-2"
              data-testid="tab-settings"
            >
              <Settings className="h-4 w-4" />
              <span className="hidden xs:inline text-sm">{t('adminPanel.referrals.settings')}</span>
              <span className="xs:hidden text-xs">Settings</span>
            </TabsTrigger>
            <TabsTrigger
              value="referrals"
              className="flex-1 gap-1 sm:gap-2"
              data-testid="tab-referrals"
            >
              <Users className="h-4 w-4" />
              <span className="hidden xs:inline text-sm">{t('adminPanel.referrals.referrals')}</span>
              <span className="xs:hidden text-xs">Referrals</span>
            </TabsTrigger>
            <TabsTrigger
              value="analytics"
              className="flex-1 gap-1 sm:gap-2"
              data-testid="tab-analytics"
            >
              <TrendingUp className="h-4 w-4" />
              <span className="hidden xs:inline text-sm">{t('adminPanel.referrals.analytics')}</span>
              <span className="xs:hidden text-xs">Analytics</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="settings">
            <SettingsTab />
          </TabsContent>

          <TabsContent value="referrals">
            <ReferralsTab />
          </TabsContent>

          <TabsContent value="analytics">
            <AnalyticsTab />
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
