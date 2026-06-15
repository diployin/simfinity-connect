import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import { Link } from 'wouter';
import {
  Users,
  CheckCircle,
  DollarSign,
  Clock,
  Copy,
  Mail,
  Share2,
  Gift,
  ChevronDown,
  ArrowLeft,
  CreditCard,
  Calendar,
  Tag,
} from 'lucide-react';
import { SiWhatsapp, SiX, SiFacebook } from 'react-icons/si';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from '@/contexts/TranslationContext';
import { useCurrency } from '@/contexts/CurrencyContext';
import { getCurrencySymbol } from '@/lib/currency';
import { format } from 'date-fns';
import { apiRequest } from '@/lib/queryClient';
import { useUser } from '@/hooks/use-user';

interface ReferralProgram {
  id: string;
  userId: string;
  referralCode: string;
  totalReferrals: number;
  totalEarnings: string;
  createdAt: string;
  updatedAt: string;
}

interface Referral {
  id: string;
  referrerId: string;
  referredId: string;
  referralCode: string;
  status: string;
  rewardAmount: string | null;
  rewardPaid: boolean;
  completedAt: string | null;
  createdAt: string;
  referredUser?: {
    email: string;
  };
}

interface ReferralSettings {
  enabled: boolean;
  rewardType: string;
  rewardValue: string;
  referredUserDiscount: string;
  minOrderAmount?: string;
}

interface GiftCard {
  id: string;
  code: string;
  amount: string;
  currency: string;
  balance: string;
  status: string;
  theme: string;
  message: string | null;
  recipientName: string | null;
  recipientEmail: string | null;
  expiresAt: string;
  redeemedAt: string | null;
  createdAt: string;
}

interface RedeemFormData {
  amount: string;
  currency: string;
  message: string;
  theme: string;
}

const initialRedeemFormData: RedeemFormData = {
  amount: '',
  currency: 'USD',
  message: '',
  theme: 'default',
};

const themes = [
  { value: 'default', label: 'Default' },
  { value: 'birthday', label: 'Birthday' },
  { value: 'holiday', label: 'Holiday' },
  { value: 'travel', label: 'Travel' },
  { value: 'thank-you', label: 'Thank You' },
  { value: 'celebration', label: 'Celebration' },
];

const presetAmounts = [10, 25, 50, 100, 200];

function generateGiftCardCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = 'GC-';
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    if (i < 3) result += '-';
  }
  return result;
}

export default function Referrals() {
  const { t } = useTranslation();
  const { currencies } = useCurrency();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [termsOpen, setTermsOpen] = useState(false);
  const [isRedeemDialogOpen, setIsRedeemDialogOpen] = useState(false);
  const [formData, setFormData] = useState<RedeemFormData>(initialRedeemFormData);
  const [activeTab, setActiveTab] = useState('referrals');
  const { user } = useUser();

  console.log('user', user);

  // Fetch referral program data
  const { data: program, isLoading: programLoading } = useQuery<ReferralProgram>({
    queryKey: ['/api/referrals/my-program'],
  });

  // Fetch referral history
  const { data: referralsData, isLoading: referralsLoading } = useQuery<Referral[]>({
    queryKey: ['/api/referrals/my-referrals'],
  });

  const referrals = referralsData?.referrals || [];

  // Fetch redeemed gift cards
  const { data: giftCardsData, isLoading: giftCardsLoading } = useQuery<GiftCard[]>({
    queryKey: ['/api/referrals/my-gift-cards'],
  });

  const giftCards = giftCardsData?.giftCardsData || [];
  // console.log("giftCards", giftCards);

  // Fetch settings to show reward info
  const { data: settings } = useQuery<ReferralSettings>({
    queryKey: ['/api/referrals/settings'],
  });

  const shareUrl = program ? `${window.location.origin}/login?ref=${program.referralCode}` : '';

  // Calculate stats
  const successfulReferrals = referrals?.filter((r) => r.status === 'completed').length;
  const pendingRewards = referrals
    ?.filter((r) => r.status === 'completed' && !r.rewardPaid && r.rewardAmount)
    .reduce((sum, r) => sum + parseFloat(r.rewardAmount || '0'), 0);

  // Redeem balance to gift card mutation
  const redeemMutation = useMutation({
    mutationFn: async (data: RedeemFormData) => {
      return apiRequest('POST', '/api/referrals/redeem-to-gift-card', {
        code: generateGiftCardCode(),
        amount: parseFloat(data.amount),
        currency: data.currency,
        message: data.message || null,
        theme: data.theme,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/referrals/my-program'] });
      queryClient.invalidateQueries({ queryKey: ['/api/referrals/my-gift-cards'] });
      setIsRedeemDialogOpen(false);
      setFormData(initialRedeemFormData);
      toast({
        title: t('website.referrals.toasts.redeemSuccessTitle', 'Success!'),
        description: t('website.referrals.toasts.redeemSuccessDesc', 'Your earnings have been successfully converted to a gift card.'),
      });
    },
    onError: (error: Error) => {
      toast({
        title: t('common.error', 'Error'),
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  // Copy to clipboard
  const copyToClipboard = async (text: string, type: 'code' | 'link') => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: type === 'code' ? t('website.referrals.toasts.codeCopiedTitle', 'Code Copied!') : t('website.referrals.toasts.linkCopiedTitle', 'Link Copied!'),
        description:
          type === 'code'
            ? t('website.referrals.toasts.codeCopiedDesc', 'Referral code copied to clipboard.')
            : t('website.referrals.toasts.linkCopiedDesc', 'Referral link copied to clipboard.'),
      });
    } catch (err) {
      toast({
        title: t('common.error', 'Error'),
        description: t('website.referrals.toasts.copyErrorDesc', 'Failed to copy to clipboard.'),
        variant: 'destructive',
      });
    }
  };

  // Share functions
  const shareEmail = () => {
    const subject = encodeURIComponent(t('website.referrals.shareEmailSubject', 'Get discount on eSIM Global!'));
    const body = encodeURIComponent(
      t('website.referrals.shareEmailBody', 'Hey, use my referral code {code} to get a {discount}% discount on your first eSIM purchase with eSIM Global! Click here: {url}', {
        code: program?.referralCode || '',
        discount: settings?.referredUserDiscount || 0,
        url: shareUrl,
      }),
    );
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  const shareWhatsApp = () => {
    const text = encodeURIComponent(
      t('website.referrals.shareWhatsApp', 'Hey! Use my referral code {code} to get {discount}% off your first eSIM: {url}', {
        code: program?.referralCode || '',
        discount: settings?.referredUserDiscount || 0,
        url: shareUrl,
      }),
    );
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  const shareTwitter = () => {
    const text = encodeURIComponent(
      t('website.referrals.shareTwitter', 'Get {discount}% off your first eSIM at @eSIMGlobal using my referral code {code}! {url}', {
        code: program?.referralCode || '',
        discount: settings?.referredUserDiscount || 0,
        url: shareUrl,
      }),
    );
    window.open(`https://twitter.com/intent/tweet?text=${text}`, '_blank');
  };

  const shareFacebook = () => {
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
      '_blank',
    );
  };

  // Mask email address
  const maskEmail = (email: string) => {
    const [name, domain] = email.split('@');
    if (name.length <= 1) return email;
    return `${name[0]}***@${domain}`;
  };

  const rewardText =
    settings?.rewardType === 'percentage'
      ? `${settings.rewardValue}%`
      : `${getCurrencySymbol('USD', currencies)}${settings?.rewardValue}`;

  const handleRedeemSubmit = () => {
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      toast({
        title: t('website.referrals.toasts.invalidAmountTitle', 'Invalid Amount'),
        description: t('website.referrals.toasts.invalidAmountDesc', 'Please enter a valid amount greater than zero.'),
        variant: 'destructive',
      });
      return;
    }

    const availableBalance = parseFloat(program?.totalEarnings || '0');
    if (parseFloat(formData.amount) > availableBalance) {
      toast({
        title: t('website.referrals.toasts.insufficientBalanceTitle', 'Insufficient Balance'),
        description: t('website.referrals.toasts.insufficientBalanceDesc', 'You do not have enough referral balance.'),
        variant: 'destructive',
      });
      return;
    }

    redeemMutation.mutate(formData);
  };

  if (programLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-accent/5">
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          <Skeleton className="h-12 w-64 mb-8" />
          <div className="grid gap-6 md:grid-cols-4 mb-8">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-32" />
            ))}
          </div>
          <Skeleton className="h-96" />
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{String(t('website.referrals.title', 'Referral Program'))} - eSIM Global</title>
        <meta
          name="description"
          content={String(t('website.referrals.subtitle', 'Refer friends and earn rewards'))}
        />
      </Helmet>
      <div className="min-h-screen bg-gradient-to-br from-background to-accent/5 dark:from-gray-950 dark:to-gray-900">
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <Gift className="h-8 w-8 text-primary" />
              <h1 className="text-4xl font-bold text-foreground dark:text-white">{t('website.referrals.title', 'Referral Program')}</h1>
            </div>
            <p className="text-muted-foreground text-lg dark:text-gray-400">{t('website.referrals.subtitle', 'Refer friends and earn rewards')}</p>
          </div>

          {/* Referral Code Section */}
          <Card className="mb-8 border-primary/20 dark:bg-gray-900 dark:border-gray-800">
            <CardHeader>
              <CardTitle className="dark:text-white">{t('website.referrals.yourCode', 'Your Referral Code')}</CardTitle>
              <CardDescription className="dark:text-gray-400">{t('website.referrals.shareVia', 'Share via')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Code Display */}
              <div className="bg-gradient-to-r from-primary/10 to-accent/10 dark:from-primary/5 dark:to-accent/5 rounded-xl p-4 md:p-6 border border-primary/20 dark:border-gray-800">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-8">
                  <div className="text-center md:text-left w-full md:w-auto">
                    <p className="text-sm text-muted-foreground dark:text-gray-400 mb-2">{t('website.referrals.yourCode', 'Your Referral Code')}</p>
                    <div className="bg-background/50 dark:bg-gray-950 rounded-lg px-4 py-2 inline-block md:block w-full md:w-auto">
                      <p
                        className="text-3xl md:text-5xl font-bold tracking-wider break-all dark:text-white"
                        data-testid="text-referral-code"
                      >
                        {program?.referralCode}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                    <Button
                      variant="outline"
                      size="lg"
                      className="w-full sm:w-auto flex-1 dark:border-gray-700 dark:hover:bg-gray-800 dark:text-gray-300"
                      onClick={() => copyToClipboard(program?.referralCode || '', 'code')}
                      data-testid="button-copy-code"
                    >
                      <Copy className="h-5 w-5 mr-2" />
                      {t('website.referrals.copyCode', 'Copy Code')}
                    </Button>
                    <Button
                      variant="default"
                      size="lg"
                      className="w-full sm:w-auto flex-1"
                      onClick={() => copyToClipboard(shareUrl, 'link')}
                      data-testid="button-copy-link"
                    >
                      <Share2 className="h-5 w-5 mr-2" />
                      {t('website.referrals.copyLink', 'Copy Link')}
                    </Button>
                  </div>
                </div>
              </div>

              {/* Share Buttons */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { icon: Mail, label: 'Email', action: shareEmail, id: 'button-share-email' },
                  { icon: SiWhatsapp, label: 'WhatsApp', action: shareWhatsApp, id: 'button-share-whatsapp' },
                  { icon: SiX, label: 'X (Twitter)', action: shareTwitter, id: 'button-share-twitter' },
                  { icon: SiFacebook, label: 'Facebook', action: shareFacebook, id: 'button-share-facebook' },
                ].map((btn, i) => (
                  <Button
                    key={i}
                    variant="outline"
                    onClick={btn.action}
                    className="h-auto py-4 dark:border-gray-700 dark:hover:bg-gray-800 dark:text-gray-300"
                    data-testid={btn.id}
                  >
                    <btn.icon className="h-5 w-5 mr-2" />
                    {t(`website.referrals.${btn.label.toLowerCase().replace(' (twitter)', '')}`, btn.label)}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Statistics */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
            {[
              { title: 'Total Referrals', val: program?.totalReferrals || 0, icon: Users, id: 'text-total-referrals' },
              { title: 'Successful Referrals', val: successfulReferrals, icon: CheckCircle, id: 'text-successful-referrals' },
              { title: 'Total Earnings', val: `${getCurrencySymbol('USD', currencies)}${parseFloat(program?.totalEarnings || '0').toFixed(2)}`, icon: DollarSign, id: 'text-total-earnings', action: true },
              { title: 'Pending Rewards', val: `${getCurrencySymbol('USD', currencies)}${pendingRewards.toFixed(2)}`, icon: Clock, id: 'text-pending-rewards' },
            ].map((stat, i) => (
              <Card key={i} className="dark:bg-gray-900 dark:border-gray-800">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium dark:text-gray-400">
                    {t(`website.referrals.${stat.title.toLowerCase().replace(' ', '')}`, stat.title)}
                  </CardTitle>
                  <stat.icon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold dark:text-white" data-testid={stat.id}>
                    {stat.val}
                  </div>
                </CardContent>
                {stat.action && (
                  <CardFooter>
                    <Button
                      variant="outline"
                      className="w-full truncate dark:border-gray-700 dark:hover:bg-gray-800 dark:text-gray-300"
                      onClick={() => setIsRedeemDialogOpen(true)}
                    >
                      <CreditCard className="h-4 w-4 mr-2 shrink-0" />
                      <span className="truncate">{t('website.referrals.convertToGiftCard', 'Convert to Gift Card')}</span>
                    </Button>
                  </CardFooter>
                )}
              </Card>
            ))}
          </div>

          {/* How It Works */}
          <Card className="mb-8 dark:bg-gray-900 dark:border-gray-800">
            <CardHeader>
              <CardTitle className="dark:text-white">{t('website.referrals.howItWorks', 'How It Works')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                {[
                  { icon: Share2, title: 'Share Your Code', desc: 'Share your unique referral code with friends' },
                  { icon: Users, title: 'They Sign Up', desc: 'Your friend signs up and makes their first purchase' },
                  { icon: Gift, title: 'You Earn Rewards', desc: `Get ${rewardText} reward for each successful referral` },
                ].map((step, i) => (
                  <div key={i} className="text-center">
                    <div className="w-16 h-16 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center mx-auto mb-4">
                      <step.icon className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="font-semibold mb-2 dark:text-white">{t(`website.referrals.step${i + 1}Title`, step.title)}</h3>
                    <p className="text-sm text-muted-foreground dark:text-gray-400">
                      {t(`website.referrals.step${i + 1}Desc`, step.desc)}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Tabs for History */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="flex w-full mb-6 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg overflow-x-auto scrollbar-hide">
              <TabsTrigger
                value="referrals"
                data-testid="tab-referrals"
                className="flex-1 min-w-[140px] px-4 py-2.5 dark:data-[state=active]:bg-gray-700 dark:data-[state=active]:text-white data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm transition-all duration-200 whitespace-nowrap"
              >
                <Users className="h-4 w-4 mr-2 flex-shrink-0" />
                <span className="truncate">{t('website.referrals.referralHistory', 'Referral History')}</span>
              </TabsTrigger>
              <TabsTrigger
                value="giftcards"
                data-testid="tab-giftcards"
                className="flex-1 min-w-[140px] px-4 py-2.5 dark:data-[state=active]:bg-gray-700 dark:data-[state=active]:text-white data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm transition-all duration-200 whitespace-nowrap"
              >
                <Gift className="h-4 w-4 mr-2 flex-shrink-0" />
                <span className="truncate">{t('website.referrals.giftCards.title', 'My Gift Cards')}</span>
              </TabsTrigger>
            </TabsList>

            {/* Referral History Tab */}
            <TabsContent value="referrals" className="mt-0">
              <Card className="dark:bg-gray-900 dark:border-gray-800">
                <CardHeader className="pb-3">
                  <CardTitle className="dark:text-white text-base sm:text-lg">
                    {t('website.referrals.referralHistory', 'Referral History')}
                  </CardTitle>
                  <CardDescription className="dark:text-gray-400 text-sm">
                    {t('website.referrals.count', 'You have {count} referral(s)', { count: referrals.length })}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {referralsLoading ? (
                    <div className="space-y-3">
                      {[1, 2, 3].map((i) => (
                        <Skeleton key={i} className="h-16 dark:bg-gray-800" />
                      ))}
                    </div>
                  ) : referrals.length === 0 ? (
                    <div className="text-center py-8 sm:py-12">
                      <Users className="h-10 w-10 sm:h-12 sm:w-12 mx-auto text-gray-400 dark:text-gray-600 mb-4" />
                      <h3 className="text-base sm:text-lg font-semibold mb-2 text-gray-900 dark:text-white">
                        {t('website.referrals.noReferrals', 'No referrals yet')}
                      </h3>
                      <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 mb-4 px-4">
                        {t('website.referrals.noReferralsDesc', 'Share your code to start earning rewards!')}
                      </p>
                    </div>
                  ) : (
                    <>
                      {/* Mobile Card View */}
                      <div className="block md:hidden space-y-4">
                        {referrals.map((referral, index) => (
                          <div
                            key={referral.id}
                            className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 border border-gray-200 dark:border-gray-700"
                            data-testid={`mobile-card-referral-${index}`}
                          >
                            <div className="space-y-3">
                              <div className="flex justify-between items-start">
                                <div className="flex-1">
                                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                                    {t('website.referrals.referredUser', 'Referred User')}
                                  </p>
                                  <p className="font-medium text-gray-900 dark:text-white break-all">
                                    {referral.referredUserEmail
                                      ? maskEmail(referral.referredUserEmail)
                                      : '**p@***.com'}
                                  </p>
                                </div>
                                <Badge
                                  variant={referral.status === 'completed' ? 'default' : 'secondary'}
                                  className={
                                    referral.status === 'completed'
                                      ? 'bg-green-500 hover:bg-green-600 dark:bg-green-600 text-white text-xs px-2 py-1'
                                      : 'bg-yellow-500 hover:bg-yellow-600 dark:bg-yellow-600 text-white text-xs px-2 py-1'
                                  }
                                >
                                  {referral.status === 'completed'
                                    ? t('website.referrals.completed', 'Completed')
                                    : t('website.referrals.pending', 'Pending')}
                                </Badge>
                              </div>

                              <div className="grid grid-cols-2 gap-3 pt-2">
                                <div>
                                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                                    {t('website.referrals.rewardAmount', 'Reward')}
                                  </p>
                                  <p className="font-semibold text-gray-900 dark:text-white">
                                    {referral.rewardAmount
                                      ? `${getCurrencySymbol('USD', currencies)}${parseFloat(referral.rewardAmount).toFixed(2)}`
                                      : '-'}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                                    {t('website.referrals.date', 'Date')}
                                  </p>
                                  <p className="text-sm text-gray-600 dark:text-gray-300">
                                    {format(new Date(referral.createdAt), 'MMM d, yyyy')}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Desktop Table View */}
                      <div className="hidden md:block overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="border-b border-gray-200 dark:border-gray-800">
                              <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-400 text-sm">
                                {t('website.referrals.referredUser', 'Referred User')}
                              </th>
                              <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-400 text-sm">
                                {t('website.referrals.status', 'Status')}
                              </th>
                              <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-400 text-sm">
                                {t('website.referrals.rewardAmount', 'Reward')}
                              </th>
                              <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-400 text-sm">
                                {t('website.referrals.date', 'Date')}
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {referrals.map((referral, index) => (
                              <tr
                                key={referral.id}
                                className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                                data-testid={`row-referral-${index}`}
                              >
                                <td className="py-4 px-4 text-gray-900 dark:text-gray-300" data-testid={`text-referred-email-${index}`}>
                                  {referral.referredUserEmail
                                    ? maskEmail(referral.referredUserEmail)
                                    : '**p@***.com'}
                                </td>
                                <td className="py-4 px-4">
                                  <Badge
                                    variant={referral.status === 'completed' ? 'default' : 'secondary'}
                                    className={
                                      referral.status === 'completed'
                                        ? 'bg-green-500 hover:bg-green-600 dark:bg-green-600 text-white'
                                        : 'bg-yellow-500 hover:bg-yellow-600 dark:bg-yellow-600 text-white'
                                    }
                                    data-testid={`badge-status-${index}`}
                                  >
                                    {referral.status === 'completed'
                                      ? t('website.referrals.completed', 'Completed')
                                      : t('website.referrals.pending', 'Pending')}
                                  </Badge>
                                </td>
                                <td className="py-4 px-4 font-semibold text-gray-900 dark:text-white" data-testid={`text-reward-${index}`}>
                                  {referral.rewardAmount
                                    ? `${getCurrencySymbol('USD', currencies)}${parseFloat(referral.rewardAmount).toFixed(2)}`
                                    : '-'}
                                </td>
                                <td className="py-4 px-4 text-gray-500 dark:text-gray-400" data-testid={`text-date-${index}`}>
                                  {format(new Date(referral.createdAt), 'MMM d, yyyy')}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Gift Cards History Tab */}
            <TabsContent value="giftcards" className="mt-0">
              <Card className="dark:bg-gray-900 dark:border-gray-800">
                <CardHeader className="pb-3">
                  <CardTitle className="dark:text-white text-base sm:text-lg">
                    {t('website.referrals.giftCards.title', 'My Gift Cards')}
                  </CardTitle>
                  <CardDescription className="dark:text-gray-400 text-sm">
                    {t('website.referrals.giftCards.count', 'You have {count} gift card(s)', { count: giftCards.length })}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {giftCardsLoading ? (
                    <div className="space-y-3">
                      {[1, 2, 3].map((i) => (
                        <Skeleton key={i} className="h-24 dark:bg-gray-800" />
                      ))}
                    </div>
                  ) : giftCards.length === 0 ? (
                    <div className="text-center py-8 sm:py-12">
                      <Gift className="h-10 w-10 sm:h-12 sm:w-12 mx-auto text-gray-400 dark:text-gray-600 mb-4" />
                      <h3 className="text-base sm:text-lg font-semibold mb-2 text-gray-900 dark:text-white">
                        {t('website.referrals.giftCards.noGiftCards', 'No gift cards created yet')}
                      </h3>
                      <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 mb-4 px-4">
                        {t('website.referrals.giftCards.noGiftCardsDesc', 'Convert your referral earnings to gift cards and use them at checkout.')}
                      </p>
                    </div>
                  ) : (
                    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2">
                      {giftCards.map((card, index) => (
                        <Card
                          key={card.id}
                          className="border-2 border-gray-200 dark:border-gray-800 dark:bg-gray-900/50 hover:shadow-lg transition-all duration-300"
                          data-testid={`card-gift-${index}`}
                        >
                          <CardHeader className="pb-2">
                            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                              <div className="flex-1 min-w-0">
                                <CardTitle className="text-base sm:text-lg flex items-center gap-2 text-gray-900 dark:text-white">
                                  <Tag className="h-4 w-4 text-primary dark:text-primary-light flex-shrink-0" />
                                  <span className="font-mono text-sm sm:text-base truncate">{card.code}</span>
                                </CardTitle>
                                <CardDescription className="mt-1 dark:text-gray-400 text-xs sm:text-sm truncate">
                                  {t('website.referrals.giftCards.theme', 'Theme: {theme}', { theme: t(`referrals.giftCards.themes.${card.theme}`, card.theme) })}
                                </CardDescription>
                              </div>
                              <Badge
                                variant={card.status === 'active' ? 'default' : 'secondary'}
                                className={
                                  card.status === 'active'
                                    ? 'bg-green-500 hover:bg-green-600 dark:bg-green-600 text-white text-xs sm:text-sm self-start'
                                    : 'bg-gray-500 hover:bg-gray-600 dark:bg-gray-600 text-white text-xs sm:text-sm self-start'
                                }
                              >
                                {card.status}
                              </Badge>
                            </div>
                          </CardHeader>
                          <CardContent className="space-y-2 pt-2">
                            <div className="flex justify-between items-center">
                              <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                                {t('website.referrals.giftCards.amount', 'Amount:')}
                              </span>
                              <span className="font-semibold text-sm sm:text-lg text-gray-900 dark:text-white">
                                {getCurrencySymbol(card.currency, currencies)}
                                {parseFloat(card.amount).toFixed(2)}
                              </span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                                {t('website.referrals.giftCards.balance', 'Balance:')}
                              </span>
                              <span className="font-semibold text-sm sm:text-base text-gray-900 dark:text-white">
                                {getCurrencySymbol(card.currency, currencies)}
                                {parseFloat(card.balance).toFixed(2)}
                              </span>
                            </div>
                            {card.message && (
                              <div className="pt-2 border-t border-gray-100 dark:border-gray-800">
                                <p className="text-xs sm:text-sm italic text-gray-600 dark:text-gray-400 break-words">
                                  "{card.message}"
                                </p>
                              </div>
                            )}
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-2 text-xs sm:text-sm text-gray-500 dark:text-gray-400 pt-2">
                              <div className="flex items-center gap-2">
                                <Calendar className="h-3 w-3 flex-shrink-0" />
                                <span className="truncate">
                                  {t('website.referrals.giftCards.expires', 'Expires:')} {format(new Date(card.expiresAt), 'MMM d, yyyy')}
                                </span>
                              </div>
                              {card.redeemedAt && (
                                <div className="flex items-center gap-2">
                                  <span>{t('website.referrals.giftCards.redeemedAt', 'Redeemed:')}</span>
                                  <span>{format(new Date(card.redeemedAt), 'MMM d, yyyy')}</span>
                                </div>
                              )}
                            </div>
                          </CardContent>
                          <CardFooter className="pt-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="w-full dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white transition-colors text-sm"
                              onClick={() => copyToClipboard(card.code, 'code')}
                            >
                              <Copy className="h-4 w-4 mr-2" />
                              {t('website.referrals.giftCards.copyCode', 'Copy Code')}
                            </Button>
                          </CardFooter>
                        </Card>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Terms & Conditions */}
          {/* Terms & Conditions */}
          {settings && (
            <Collapsible open={termsOpen} onOpenChange={setTermsOpen} className="mt-8">
              <Card className="dark:bg-gray-900 dark:border-gray-800 overflow-hidden">
                <CollapsibleTrigger
                  className="w-full group"
                  data-testid="button-toggle-terms"
                >
                  <CardHeader className="flex flex-row items-center justify-between p-4 sm:p-6 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors duration-200">
                    <CardTitle className="text-left text-base sm:text-lg dark:text-white">
                      {t('website.referrals.termsAndConditions', 'Terms & Conditions')}
                    </CardTitle>
                    <ChevronDown
                      className={`h-5 w-5 text-gray-500 dark:text-gray-400 transition-all duration-300 flex-shrink-0 ml-4 ${termsOpen ? 'rotate-180' : 'rotate-0'
                        } group-hover:text-gray-700 dark:group-hover:text-gray-300`}
                    />
                  </CardHeader>
                </CollapsibleTrigger>

                <CollapsibleContent>
                  <CardContent className="pt-0 pb-6 px-4 sm:px-6">
                    <div className="prose prose-sm max-w-none dark:prose-invert">
                      {settings && (
                        <div className="space-y-3">
                          {/* Desktop View */}
                          <div className="hidden sm:block">
                            <div className="whitespace-pre-wrap text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                              {t('website.referrals.termsList', '• Referrers will receive a {reward} reward for each successful referral.\n• Referred users will receive a {discount}% discount on their first purchase.\n• The minimum order amount for a referral to be considered successful is {minAmount}.', {
                                discount: settings.referredUserDiscount || 0,
                                reward: rewardText,
                                minAmount: `${getCurrencySymbol('USD', currencies)}${parseFloat(settings.minOrderAmount || '0').toFixed(2)}`
                              })}
                            </div>
                          </div>

                          {/* Mobile View - Better formatted */}
                          <div className="block sm:hidden space-y-3">
                            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
                              <div className="space-y-3 text-sm text-gray-700 dark:text-gray-300">
                                <div className="flex items-start gap-3">
                                  <div className="w-1.5 h-1.5 rounded-full bg-green-500 dark:bg-green-400 mt-2 flex-shrink-0" />
                                  <p className="flex-1">
                                    {t('website.referrals.terms.mobile.referrerReward', 'Referrers will receive a {reward} reward for each successful referral', {
                                      reward: rewardText
                                    })}
                                  </p>
                                </div>
                                <div className="flex items-start gap-3">
                                  <div className="w-1.5 h-1.5 rounded-full bg-green-500 dark:bg-green-400 mt-2 flex-shrink-0" />
                                  <p className="flex-1">
                                    {t('website.referrals.terms.mobile.referredDiscount', 'Referred users will receive a {discount}% discount on their first purchase', {
                                      discount: settings.referredUserDiscount || 0
                                    })}
                                  </p>
                                </div>
                                <div className="flex items-start gap-3">
                                  <div className="w-1.5 h-1.5 rounded-full bg-green-500 dark:bg-green-400 mt-2 flex-shrink-0" />
                                  <p className="flex-1">
                                    {t('website.referrals.terms.mobile.minAmount', 'The minimum order amount for a referral to be considered successful is {minAmount}', {
                                      minAmount: `${getCurrencySymbol('USD', currencies)}${parseFloat(settings.minOrderAmount || '0').toFixed(2)}`
                                    })}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>


                        </div>
                      )}
                    </div>
                  </CardContent>
                </CollapsibleContent>
              </Card>
            </Collapsible>
          )}
        </div>
      </div>
      <Dialog open={isRedeemDialogOpen} onOpenChange={setIsRedeemDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{t('website.referrals.giftCards.convertTitle', 'Convert Earnings to Gift Card')}</DialogTitle>
            <DialogDescription>
              {t('website.referrals.giftCards.availableBalance', 'Available Balance:')} {getCurrencySymbol('USD', currencies)}
              {parseFloat(program?.totalEarnings || '0').toFixed(2)}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>{t('website.referrals.giftCards.amountLabel', 'Amount ($)')}</Label>
              <Input
                type="number"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                placeholder={t('website.referrals.giftCards.amountPlaceholder', 'Enter amount')}
                data-testid="input-custom-amount"
                max={parseFloat(program?.totalEarnings || '0')}
              />
            </div>
            <div className="space-y-2">
              <Label>{t('website.referrals.giftCards.themeLabel', 'Gift Card Theme')}</Label>
              <Select
                value={formData.theme}
                onValueChange={(value) => setFormData({ ...formData, theme: value })}
              >
                <SelectTrigger data-testid="select-theme">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {themes.map((theme) => (
                    <SelectItem key={theme.value} value={theme.value}>
                      {t(`referrals.giftCards.themes.${theme.value}`, theme.label)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>{t('website.referrals.giftCards.messageLabel', 'Gift Card Message')}</Label>
              <Textarea
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder={t('website.referrals.giftCards.messagePlaceholder', 'Enter personal message (optional)')}
                data-testid="input-message"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRedeemDialogOpen(false)}>
              {t('common.cancel', 'Cancel')}
            </Button>
            <Button
              onClick={handleRedeemSubmit}
              disabled={
                redeemMutation.isPending || !formData.amount || parseFloat(formData.amount) <= 0
              }
              data-testid="button-submit-redeem"
            >
              {redeemMutation.isPending ? t('website.referrals.giftCards.creating', 'Creating...') : t('website.referrals.giftCards.createButton', 'Create Gift Card')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

// function GiftCardForm({
//   formData,
//   setFormData,
//   onSubmit,
//   isSubmitting,
// }: {
//   formData: GiftCardFormData;
//   setFormData: (data: GiftCardFormData) => void;
//   onSubmit: () => void;
//   isSubmitting: boolean;
// }) {
//   return (
//     <div className="space-y-4">
//       <div className="space-y-2">
//         <Label>Amount ($)</Label>
//         <div className="flex gap-2 flex-wrap">
//           {presetAmounts.map((amount) => (
//             <Button
//               key={amount}
//               type="button"
//               variant={formData.amount === amount.toString() ? "default" : "outline"}
//               size="sm"
//               onClick={() => setFormData({ ...formData, amount: amount.toString() })}
//               data-testid={`button-amount-${amount}`}
//             >
//               ${amount}
//             </Button>
//           ))}
//         </div>
//         <Input
//           type="number"
//           value={formData.amount}
//           onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
//           placeholder="Custom amount"
//           data-testid="input-custom-amount"
//         />
//       </div>

//       <div className="space-y-2">
//         <Label>Theme</Label>
//         <Select value={formData.theme} onValueChange={(value) => setFormData({ ...formData, theme: value })}>
//           <SelectTrigger data-testid="select-theme">
//             <SelectValue />
//           </SelectTrigger>
//           <SelectContent>
//             {themes.map((theme) => (
//               <SelectItem key={theme.value} value={theme.value}>{theme.label}</SelectItem>
//             ))}
//           </SelectContent>
//         </Select>
//       </div>

//       <div className="grid grid-cols-2 gap-4">
//         <div className="space-y-2">
//           <Label>Recipient Name (optional)</Label>
//           <Input
//             value={formData.recipientName}
//             onChange={(e) => setFormData({ ...formData, recipientName: e.target.value })}
//             placeholder="John Doe"
//             data-testid="input-recipient-name"
//           />
//         </div>
//         <div className="space-y-2">
//           <Label>Recipient Email (optional)</Label>
//           <Input
//             type="email"
//             value={formData.recipientEmail}
//             onChange={(e) => setFormData({ ...formData, recipientEmail: e.target.value })}
//             placeholder="john@example.com"
//             data-testid="input-recipient-email"
//           />
//         </div>
//       </div>

//       <div className="space-y-2">
//         <Label>Personal Message (optional)</Label>
//         <Textarea
//           value={formData.message}
//           onChange={(e) => setFormData({ ...formData, message: e.target.value })}
//           placeholder="Enjoy your eSIM gift card!"
//           data-testid="input-message"
//         />
//       </div>

//       <div className="space-y-2">
//         <Label>Expires On</Label>
//         <Input
//           type="date"
//           value={formData.expiresAt}
//           onChange={(e) => setFormData({ ...formData, expiresAt: e.target.value })}
//           data-testid="input-expires-at"
//         />
//       </div>

//       <DialogFooter>
//         <Button onClick={onSubmit} disabled={isSubmitting || !formData.amount} data-testid="button-submit-gift-card">
//           {isSubmitting ? "Creating..." : "Create Gift Card"}
//         </Button>
//       </DialogFooter>
//     </div>
//   );
// }
