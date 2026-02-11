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
    queryKey: ['/api/admin/referrals/settings'],
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
        title: 'Success!',
        description: 'Your balance has been converted to a gift card',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
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
        title: type === 'code' ? 'Code copied!' : 'Link copied!',
        description:
          type === 'code'
            ? 'Referral code copied to clipboard'
            : 'Referral link copied to clipboard',
      });
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to copy to clipboard',
        variant: 'destructive',
      });
    }
  };

  // Share functions
  const shareEmail = () => {
    const subject = encodeURIComponent(`Join me on eSIM Global!`);
    const body = encodeURIComponent(
      `I'm using eSIM Global for affordable travel data. Use my code ${program?.referralCode} to get ${settings?.referredUserDiscount}% off your first order!\n\n${shareUrl}`,
    );
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  const shareWhatsApp = () => {
    const text = encodeURIComponent(
      `Join me on eSIM Global! Use code ${program?.referralCode} for ${settings?.referredUserDiscount}% off: ${shareUrl}`,
    );
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  const shareTwitter = () => {
    const text = encodeURIComponent(
      `Get ${settings?.referredUserDiscount}% off your first eSIM on @eSIMGlobal with my code ${program?.referralCode}! ${shareUrl}`,
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
        title: 'Invalid amount',
        description: 'Please enter a valid amount',
        variant: 'destructive',
      });
      return;
    }

    const availableBalance = parseFloat(program?.totalEarnings || '0');
    if (parseFloat(formData.amount) > availableBalance) {
      toast({
        title: 'Insufficient balance',
        description: 'Amount exceeds your available balance',
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
        <title>{String(t('userPanel.referrals.title', 'Referrals'))} - eSIM Global</title>
        <meta
          name="description"
          content={String(t('userPanel.referrals.subtitle', 'Earn rewards by referring friends'))}
        />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-background to-accent/5">
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          {/* Header */}
          <div className="mb-12 text-start flex flex-col items-start max-w-4xl px-4">
            <div className="flex items-center gap-3 mb-2">
              <Gift className="h-8 w-8 text-primary" />
              <h1 className="text-3xl sm:text-4xl lg:text-2.5 font-medium text-foreground">{t('website.referrals.title')}</h1>
            </div>
            <p className="text-gray-600 text-base sm:text-lg font-thin leading-relaxed">{t('userPanel.referrals.subtitle')}</p>
          </div>

          {/* Referral Code Section */}
          <Card className="mb-8 border-primary/20">
            <CardHeader>
              <CardTitle>{t('userPanel.referrals.yourCode')}</CardTitle>
              <CardDescription>{t('userPanel.referrals.shareVia')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Code Display */}
              <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-xl p-6 border border-primary/20">
                <div className="flex items-center justify-between gap-4 flex-wrap">
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">{t('referrals.yourCode')}</p>
                    <p
                      className="text-5xl font-bold tracking-wider"
                      data-testid="text-referral-code"
                    >
                      {program?.referralCode}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="lg"
                      onClick={() => copyToClipboard(program?.referralCode || '', 'code')}
                      data-testid="button-copy-code"
                    >
                      <Copy className="h-5 w-5 mr-2" />
                      {t('userPanel.referrals.copyCode')}
                    </Button>
                    <Button
                      variant="default"
                      size="lg"
                      onClick={() => copyToClipboard(shareUrl, 'link')}
                      data-testid="button-copy-link"
                    >
                      <Share2 className="h-5 w-5 mr-2" />
                      {t('userPanel.referrals.copyLink')}
                    </Button>
                  </div>
                </div>
              </div>

              {/* Share Buttons */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <Button
                  variant="outline"
                  onClick={shareEmail}
                  className="h-auto py-4"
                  data-testid="button-share-email"
                >
                  <Mail className="h-5 w-5 mr-2" />
                  Email
                </Button>
                <Button
                  variant="outline"
                  onClick={shareWhatsApp}
                  className="h-auto py-4"
                  data-testid="button-share-whatsapp"
                >
                  <SiWhatsapp className="h-5 w-5 mr-2" />
                  WhatsApp
                </Button>
                <Button
                  variant="outline"
                  onClick={shareTwitter}
                  className="h-auto py-4"
                  data-testid="button-share-twitter"
                >
                  <SiX className="h-5 w-5 mr-2" />
                  Twitter
                </Button>
                <Button
                  variant="outline"
                  onClick={shareFacebook}
                  className="h-auto py-4"
                  data-testid="button-share-facebook"
                >
                  <SiFacebook className="h-5 w-5 mr-2" />
                  Facebook
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Statistics */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {t('userPanel.referrals.totalReferrals')}
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold" data-testid="text-total-referrals">
                  {program?.totalReferrals || 0}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {t('userPanel.referrals.successfulReferrals')}
                </CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold" data-testid="text-successful-referrals">
                  {successfulReferrals}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {t('userPanel.referrals.totalEarnings')}
                </CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold" data-testid="text-total-earnings">
                  {getCurrencySymbol('USD', currencies)}
                  {parseFloat(program?.totalEarnings || '0').toFixed(2)}
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => setIsRedeemDialogOpen(true)}
                // disabled={parseFloat(program?.totalEarnings || "0") <= 0}
                >
                  <CreditCard className="h-4 w-4 mr-2" />
                  {t('userPanel.referrals.convertToGiftCard')}
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {t('userPanel.referrals.pendingRewards')}
                </CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold" data-testid="text-pending-rewards">
                  {getCurrencySymbol('USD', currencies)}
                  {pendingRewards.toFixed(2)}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* How It Works */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>{t('userPanel.referrals.howItWorks')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <Share2 className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="font-medium mb-2">{t('userPanel.referrals.step1Title')}</h3>
                  <p className="text-sm text-gray-600 font-thin">
                    {t('userPanel.referrals.step1Desc')}
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <Users className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="font-medium mb-2">{t('userPanel.referrals.step2Title')}</h3>
                  <p className="text-sm text-gray-600 font-thin">
                    {t('userPanel.referrals.step2Desc')}
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <Gift className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="font-medium mb-2">{t('userPanel.referrals.step3Title')}</h3>
                  <p className="text-sm text-gray-600 font-thin">
                    {t('userPanel.referrals.step3Desc', { reward: rewardText })}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tabs for History */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="referrals" data-testid="tab-referrals">
                <Users className="h-4 w-4 mr-2" />
                Referral History
              </TabsTrigger>
              <TabsTrigger value="giftcards" data-testid="tab-giftcards">
                <Gift className="h-4 w-4 mr-2" />
                Redeemed Gift Cards
              </TabsTrigger>
            </TabsList>

            {/* Referral History Tab */}
            <TabsContent value="referrals">
              <Card>
                <CardHeader>
                  <CardTitle>{t('userPanel.referrals.referralHistory')}</CardTitle>
                  <CardDescription>
                    {referrals.length} {referrals.length === 1 ? 'referral' : 'referrals'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {referralsLoading ? (
                    <div className="space-y-3">
                      {[1, 2, 3].map((i) => (
                        <Skeleton key={i} className="h-16" />
                      ))}
                    </div>
                  ) : referrals.length === 0 ? (
                    <div className="text-center py-12">
                      <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <h3 className="text-lg font-semibold mb-2">No referrals yet</h3>
                      <p className="text-muted-foreground mb-4">
                        Start sharing your code to earn rewards!
                      </p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left py-3 px-4 font-medium">
                              {t('userPanel.referrals.referredUser')}
                            </th>
                            <th className="text-left py-3 px-4 font-medium">
                              {t('userPanel.referrals.status')}
                            </th>
                            <th className="text-left py-3 px-4 font-medium">
                              {t('userPanel.referrals.rewardAmount')}
                            </th>
                            <th className="text-left py-3 px-4 font-medium">
                              {t('userPanel.referrals.date')}
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {referrals.map((referral, index) => (
                            <tr
                              key={referral.id}
                              className="border-b"
                              data-testid={`row-referral-${index}`}
                            >
                              <td
                                className="py-4 px-4"
                                data-testid={`text-referred-email-${index}`}
                              >
                                {referral.referredUserEmail
                                  ? maskEmail(referral.referredUserEmail)
                                  : '**p@***.com'}
                              </td>
                              <td className="py-4 px-4">
                                <Badge
                                  variant={
                                    referral.status === 'completed' ? 'default' : 'secondary'
                                  }
                                  className={
                                    referral.status === 'completed'
                                      ? 'bg-green-500'
                                      : 'bg-yellow-500'
                                  }
                                  data-testid={`badge-status-${index}`}
                                >
                                  {referral.status === 'completed'
                                    ? t('userPanel.referrals.completed')
                                    : t('userPanel.referrals.pending')}
                                </Badge>
                              </td>
                              <td
                                className="py-4 px-4 font-semibold"
                                data-testid={`text-reward-${index}`}
                              >
                                {referral.rewardAmount
                                  ? `${getCurrencySymbol('USD', currencies)}${parseFloat(referral.rewardAmount).toFixed(2)}`
                                  : '-'}
                              </td>
                              <td
                                className="py-4 px-4 text-muted-foreground"
                                data-testid={`text-date-${index}`}
                              >
                                {format(new Date(referral.createdAt), 'MMM d, yyyy')}
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

            {/* Gift Cards History Tab */}
            <TabsContent value="giftcards">
              <Card>
                <CardHeader>
                  <CardTitle>Redeemed Gift Cards</CardTitle>
                  <CardDescription>
                    {giftCards.length} {giftCards.length === 1 ? 'gift card' : 'gift cards'}{' '}
                    redeemed
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {giftCardsLoading ? (
                    <div className="space-y-3">
                      {[1, 2, 3].map((i) => (
                        <Skeleton key={i} className="h-24" />
                      ))}
                    </div>
                  ) : giftCards.length === 0 ? (
                    <div className="text-center py-12">
                      <Gift className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <h3 className="text-lg font-semibold mb-2">No gift cards yet</h3>
                      <p className="text-muted-foreground mb-4">
                        Convert your referral earnings to gift cards!
                      </p>
                    </div>
                  ) : (
                    <div className="grid gap-4 md:grid-cols-2">
                      {giftCards.map((card, index) => (
                        <Card key={card.id} className="border-2" data-testid={`card-gift-${index}`}>
                          <CardHeader>
                            <div className="flex items-start justify-between">
                              <div>
                                <CardTitle className="text-lg flex items-center gap-2">
                                  <Tag className="h-4 w-4" />
                                  {card.code}
                                </CardTitle>
                                <CardDescription className="mt-1">
                                  Theme: {card.theme}
                                </CardDescription>
                              </div>
                              <Badge variant={card.status === 'active' ? 'default' : 'secondary'}>
                                {card.status}
                              </Badge>
                            </div>
                          </CardHeader>
                          <CardContent className="space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-muted-foreground">Amount:</span>
                              <span className="font-semibold text-lg">
                                {getCurrencySymbol(card.currency, currencies)}
                                {parseFloat(card.amount).toFixed(2)}
                              </span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-muted-foreground">Balance:</span>
                              <span className="font-semibold">
                                {getCurrencySymbol(card.currency, currencies)}
                                {parseFloat(card.balance).toFixed(2)}
                              </span>
                            </div>
                            {card.message && (
                              <div className="pt-2 border-t">
                                <p className="text-sm italic text-muted-foreground">
                                  "{card.message}"
                                </p>
                              </div>
                            )}
                            <div className="flex items-center gap-2 text-sm text-muted-foreground pt-2">
                              <Calendar className="h-3 w-3" />
                              <span>
                                Expires: {format(new Date(card.expiresAt), 'MMM d, yyyy')}
                              </span>
                            </div>
                            {card.redeemedAt && (
                              <div className="text-sm text-muted-foreground">
                                Redeemed: {format(new Date(card.redeemedAt), 'MMM d, yyyy')}
                              </div>
                            )}
                          </CardContent>
                          <CardFooter>
                            <Button
                              variant="outline"
                              className="w-full"
                              onClick={() => copyToClipboard(card.code, 'code')}
                            >
                              <Copy className="h-4 w-4 mr-2" />
                              Copy Code
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
          {settings && (
            <Collapsible open={termsOpen} onOpenChange={setTermsOpen} className="mt-8">
              <Card>
                <CollapsibleTrigger className="w-full" data-testid="button-toggle-terms">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-left">
                      {t('userPanel.referrals.termsAndConditions')}
                    </CardTitle>
                    <ChevronDown
                      className={`h-5 w-5 transition-transform ${termsOpen ? 'rotate-180' : ''}`}
                    />
                  </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent>
                    <div className="prose prose-sm max-w-none dark:prose-invert">
                      {settings && (
                        <div className="whitespace-pre-wrap text-sm text-muted-foreground">
                          {/* Default terms if none set */}
                          1. Share your unique referral code with friends and family.{'\n'}
                          2. When they sign up using your code and make their first purchase,
                          they'll receive {settings.referredUserDiscount}% off.{'\n'}
                          3. You'll earn {rewardText} for each successful referral.{'\n'}
                          4. Minimum order amount: {getCurrencySymbol('USD', currencies)}
                          {parseFloat(settings.minOrderAmount || '0').toFixed(2)}
                          {'\n'}
                          5. Rewards are credited after the referred user completes their first
                          purchase.{'\n'}
                          6. Referral codes are valid for 90 days from the date of sharing.{'\n'}
                          7. This program is subject to change or termination at any time.
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
            <DialogTitle>Convert Balance to Gift Card</DialogTitle>
            <DialogDescription>
              Available balance: {getCurrencySymbol('USD', currencies)}
              {parseFloat(program?.totalEarnings || '0').toFixed(2)}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Amount ($)</Label>
              <Input
                type="number"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                placeholder="Custom amount"
                data-testid="input-custom-amount"
                max={parseFloat(program?.totalEarnings || '0')}
              />
            </div>
            <div className="space-y-2">
              <Label>Theme</Label>
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
                      {theme.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Personal Message (optional)</Label>
              <Textarea
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Add a personal message to your gift card..."
                data-testid="input-message"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRedeemDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleRedeemSubmit}
              disabled={
                redeemMutation.isPending || !formData.amount || parseFloat(formData.amount) <= 0
              }
              data-testid="button-submit-redeem"
            >
              {redeemMutation.isPending ? 'Creating...' : 'Create Gift Card'}
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
