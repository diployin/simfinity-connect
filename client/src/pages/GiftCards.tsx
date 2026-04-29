import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import {
  Gift,
  Check,
  Loader2,
  Send,
  CreditCard,
  Sparkles,
  Mail,
  Globe,
  Clock,
  Wallet,
  ChevronRight,
  Copy,
  CheckCircle2,
} from 'lucide-react';
import { SiPaypal, SiApplepay, SiGooglepay } from 'react-icons/si';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { useUser } from '@/hooks/use-user';
import { apiRequest } from '@/lib/queryClient';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useLocation } from 'wouter';
import { useSettingByKey } from '@/hooks/useSettings';
import { useCurrency } from '@/contexts/CurrencyContext';
// import { SiteHeader } from '@/components/layout/SiteHeader';
// import { SiteFooter } from '@/components/layout/SiteFooter';
import { useTranslation } from '@/contexts/TranslationContext';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY || '');

const amounts = [25, 50, 100, 200];

const isApplePayAvailable = (): boolean => {
  if (typeof window === 'undefined') return false;
  return !!(window as any).ApplePaySession && (window as any).ApplePaySession.canMakePayments();
};

const isGooglePayAvailable = (): boolean => {
  if (typeof window === 'undefined') return false;
  return !!(window as any).PaymentRequest;
};

type PaymentMethodType = 'card' | 'paypal' | 'apple_pay' | 'google_pay';

function GiftCardCheckoutForm({
  amount,
  recipient,
  onBack,
}: {
  amount: number;
  recipient: any;
  onBack: () => void;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [isProcessing, setIsProcessing] = useState(false);
  const { t } = useTranslation();

  const { currency, currencies } = useCurrency();

  const enabledCurrencies = currencies.filter((c) => c.isEnabled);
  const currentCurrency =
    enabledCurrencies.find((c) => c.code === currency) || enabledCurrencies[0];

  const symbol = currentCurrency.symbol;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    setIsProcessing(true);

    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        redirect: 'if_required',
        confirmParams: {
          return_url: `${window.location.origin}/profile`,
        },
      });

      if (error) {
        toast({
          title: t('website.giftCards.paymentFailed', 'Payment Failed'),
          description: error.message,
          variant: 'destructive',
        });
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        toast({
          title: t('website.giftCards.paymentSuccess', 'Gift Card Purchased!'),
          description: t('website.giftCards.paymentSuccessDesc', "The gift card has been sent to the recipient's email."),
        });
        setLocation('/profile');
      }
    } catch (err: any) {
      toast({
        title: t('website.giftCards.paymentError', 'Payment Error'),
        description: err.message,
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement />
      <div className="flex gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          className="flex-1"
          data-testid="button-back-payment"
        >
          {t('website.giftCards.back', 'Back')}
        </Button>
        <Button
          type="submit"
          className="flex-1"
          disabled={!stripe || isProcessing}
          data-testid="button-complete-purchase"
        >
          {isProcessing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {t('website.giftCards.processing', 'Processing...')}
            </>
          ) : (
            t('website.giftCards.payAmount', { symbol, amount })
          )}
        </Button>
      </div>
    </form>
  );
}

function GiftCardPreview({
  amount,
  recipientName,
  message,
}: {
  amount: number;
  recipientName?: string;
  message?: string;
}) {
  const siteName = useSettingByKey('platform_name');
  const { currency, currencies } = useCurrency();
  const { t } = useTranslation();

  const enabledCurrencies = currencies.filter((c) => c.isEnabled);
  const currentCurrency =
    enabledCurrencies.find((c) => c.code === currency) || enabledCurrencies[0];

  const symbol = currentCurrency.symbol;
  return (
    <div className="relative w-full max-w-sm mx-auto">
      <div className="relative bg-primary-gradient rounded-2xl p-6 shadow-xl overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />

        <div className="relative z-10">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2">
              <Globe className="h-6 w-6 text-white" />
              <span className="font-bold text-white text-lg">{siteName}</span>
            </div>
            <Badge className="bg-white/20 text-white border-0 hover:bg-white/30">
              {t('website.giftCards.giftCardBadge', 'Gift Card')}
            </Badge>
          </div>

          <div className="mb-6">
            <p className="text-white/80 text-sm mb-1">{t('website.giftCards.value', 'Value')}</p>
            <p className="text-4xl font-bold text-white">
              {symbol}
              {amount || 0}
            </p>
          </div>

          {recipientName && (
            <div className="mb-4">
              <p className="text-white/80 text-sm">{t('website.giftCards.for', 'For')}</p>
              <p className="text-white font-medium">{recipientName}</p>
            </div>
          )}

          {message && (
            <div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm">
              <p className="text-white/90 text-sm italic">"{message}"</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function MyGiftCardsSection() {
  const { isAuthenticated } = useUser();
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const { t } = useTranslation();

  const { currency, currencies } = useCurrency();

  const enabledCurrencies = currencies.filter((c) => c.isEnabled);
  const currentCurrency =
    enabledCurrencies.find((c) => c.code === currency) || enabledCurrencies[0];

  const symbol = currentCurrency.symbol;

  const { data: myCards, isLoading } = useQuery({
    queryKey: ['/api/gift-cards/my-cards'],
    enabled: isAuthenticated,
  });

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  if (!isAuthenticated) return null;

  const cards = (myCards as any)?.data || (Array.isArray(myCards) ? myCards : []);

  if (isLoading) {
    return (
      <Card>
        <CardContent className="py-8">
          <div className="flex items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (cards.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wallet className="h-5 w-5 text-primary" />
          {t('website.giftCards.myCardsTitle', 'My Gift Cards')}
        </CardTitle>
        <CardDescription>
          {t('website.giftCards.myCardsDesc', 'Your purchased and redeemed gift cards')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {cards.map((card: any) => (
            <div
              key={card.id}
              className="flex items-center justify-between p-4 rounded-lg border bg-card hover-elevate"
              data-testid={`card-my-gift-card-${card.id}`}
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-primary-gradient flex items-center justify-center">
                  <Gift className="h-6 w-6 text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-semibold">
                      {symbol}
                      {card.amount}
                    </p>
                    <Badge
                      variant={card.status === 'active' ? 'default' : 'secondary'}
                      className={card.status === 'active' ? 'bg-green-600 hover:bg-green-600' : ''}
                    >
                      {card.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {t('website.giftCards.balance', { symbol, balance: card.balance })}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <code className="text-xs bg-muted px-2 py-1 rounded font-mono">{card.code}</code>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => copyCode(card.code)}
                  data-testid={`button-copy-code-${card.id}`}
                >
                  {copiedCode === card.code ? (
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default function GiftCards() {
  const { toast } = useToast();
  const { isAuthenticated, user } = useUser();
  const [, setLocation] = useLocation();
  const { t } = useTranslation();

  const [selectedAmount, setSelectedAmount] = useState<number | null>(50);
  const [customAmount, setCustomAmount] = useState('');
  const [recipientEmail, setRecipientEmail] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [message, setMessage] = useState('');
  const [clientSecret, setClientSecret] = useState('');
  const [redemptionCode, setRedemptionCode] = useState('');
  const [isRedeeming, setIsRedeeming] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType>('card');
  const [applePaySupported, setApplePaySupported] = useState(false);
  const [googlePaySupported, setGooglePaySupported] = useState(false);
  const [activeTab, setActiveTab] = useState('purchase');

  const { currency, setCurrency, currencies } = useCurrency();

  const enabledCurrencies = currencies.filter((c) => c.isEnabled);
  const currentCurrency =
    enabledCurrencies.find((c) => c.code === currency) || enabledCurrencies[0];

  const symbol = currentCurrency?.symbol;

  useEffect(() => {
    setApplePaySupported(isApplePayAvailable());
    setGooglePaySupported(isGooglePayAvailable());
  }, []);

  const handlePurchase = async () => {
    if (!isAuthenticated) {
      toast({
        title: t('website.giftCards.authRequired', 'Authentication Required'),
        description: t('website.giftCards.authPurchaseDesc', 'Please log in to purchase a gift card'),
        variant: 'destructive',
      });
      setLocation('/login');
      return;
    }

    const amount = selectedAmount || parseFloat(customAmount);

    if (!amount || amount < 10) {
      toast({
        title: t('website.giftCards.invalidAmount', 'Invalid Amount'),
        description: t('website.giftCards.minAmountDesc', { symbol }),
        variant: 'destructive',
      });
      return;
    }

    try {
      const response: any = await apiRequest('POST', '/api/gift-cards/purchase', {
        amount,
        recipientEmail,
        recipientName,
        message,
        paymentMethodType: paymentMethod,
      });

      setClientSecret(response.clientSecret);
    } catch (error: any) {
      toast({
        title: t('website.giftCards.purchaseFailed', 'Purchase Failed'),
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const handleRedeem = async () => {
    if (!isAuthenticated) {
      toast({
        title: t('website.giftCards.authRequired', 'Authentication Required'),
        description: t('website.giftCards.authRedeemDesc', 'Please log in to redeem a gift card'),
        variant: 'destructive',
      });
      setLocation('/login');
      return;
    }

    if (!redemptionCode) {
      toast({
        title: t('website.giftCards.codeRequired', 'Code Required'),
        description: t('website.giftCards.codeRequiredDesc', 'Please enter a gift card code'),
        variant: 'destructive',
      });
      return;
    }

    setIsRedeeming(true);

    try {
      const response: any = await apiRequest('POST', '/api/gift-cards/apply', {
        code: redemptionCode,
      });

      toast({
        title: t('website.giftCards.redeemSuccess', 'Gift Card Redeemed!'),
        description: t('website.giftCards.redeemSuccessDesc', { symbol, amount: response.amount }),
      });

      setRedemptionCode('');
    } catch (error: any) {
      toast({
        title: t('website.giftCards.redeemFailed', 'Redemption Failed'),
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsRedeeming(false);
    }
  };

  const currentAmount = selectedAmount || parseFloat(customAmount) || 0;
  const siteName = useSettingByKey('platform_name');

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Helmet>
        <title>{t('website.giftCards.pageTitle', { siteName })}</title>
        <meta
          name="description"
          content={t('website.giftCards.pageMeta', { siteName })}
        />
      </Helmet>

      {/* <SiteHeader /> */}

      <main className="flex-1   ">
        <div className="relative bg-gradient-to-br from-[#2c7338]/10 via-[#3d9a4d]/5 to-background py-16 md:py-24 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-[#2c7338]/10 rounded-full blur-3xl" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#2c7338]/10 rounded-full blur-3xl" />
          </div>

          <div className="container mx-auto px-4 relative z-10 mt-[40px]">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 bg-primary-light text-white px-4 py-2 rounded-full mb-6">
                <Sparkles className="h-4 w-4" />
                <span className="text-sm font-medium">
                  {t('website.giftCards.heroBadge', 'Perfect Gift for Travelers')}
                </span>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                {t('website.giftCards.heroTitle', 'Give the Gift of Connectivity')}
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
                {t('website.giftCards.heroDescription', { siteName })}
              </p>
            </div>
          </div>
        </div>

        <div className="py-12 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
              {[
                { icon: Gift, label: t('website.giftCards.feature1Title', 'Instant Delivery'), desc: t('website.giftCards.feature1Desc', 'Email delivery in seconds') },
                { icon: Globe, label: t('website.giftCards.feature2Title', '200+ Countries'), desc: t('website.giftCards.feature2Desc', 'Works worldwide') },
                { icon: Clock, label: t('website.giftCards.feature3Title', 'Never Expires'), desc: t('website.giftCards.feature3Desc', 'Use anytime') },
                { icon: Wallet, label: t('website.giftCards.feature4Title', 'Any Amount'), desc: t('website.giftCards.feature4Desc', { symbol: '$' }) },
              ].map((feature, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center text-center p-4 rounded-xl bg-background border hover-elevate"
                >
                  <div className="w-12 h-12 rounded-full bg-orange-500/10 flex items-center justify-center mb-3">
                    <feature.icon className="h-5 w-5 text-primary" />
                  </div>
                  <p className="font-semibold text-sm">{feature.label}</p>
                  <p className="text-xs text-muted-foreground">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-12">
          <div className="max-w-5xl mx-auto">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
              <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
                <TabsTrigger value="purchase" data-testid="tab-purchase">
                  <Gift className="h-4 w-4 mr-2" />
                  {t('website.giftCards.buyTab', 'Buy Gift Card')}
                </TabsTrigger>
                <TabsTrigger value="redeem" data-testid="tab-redeem">
                  <Check className="h-4 w-4 mr-2" />
                  {t('website.giftCards.redeemTab', 'Redeem Code')}
                </TabsTrigger>
              </TabsList>

              <TabsContent value="purchase" className="space-y-8">
                {!clientSecret ? (
                  <div className="grid lg:grid-cols-2 gap-8">
                    <div className="order-2 lg:order-1">
                      <Card>
                        <CardHeader>
                          <CardTitle>{t('website.giftCards.purchaseTitle', 'Purchase Gift Card')}</CardTitle>
                          <CardDescription>
                            {t('website.giftCards.purchaseDesc', 'Select an amount and personalize your gift')}
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                          <div>
                            <Label className="mb-3 block">{t('website.giftCards.selectAmount', 'Select Amount')}</Label>
                            <div className="grid grid-cols-2 gap-3">
                              {amounts.map((amount) => (
                                <Button
                                  key={amount}
                                  variant="outline"
                                  className={`h-14 text-lg font-semibold ${selectedAmount === amount ? 'bg-primary-gradient text-white border-primary-dark hover:bg-primary-dark' : ''}`}
                                  onClick={() => {
                                    setSelectedAmount(amount);
                                    setCustomAmount('');
                                  }}
                                  data-testid={`button-amount-${amount}`}
                                >
                                  {symbol}
                                  {amount}
                                </Button>
                              ))}
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="customAmount">
                              {t('website.giftCards.customAmount', { symbol })}
                            </Label>
                            <Input
                              id="customAmount"
                              type="number"
                              min="10"
                              max="500"
                              placeholder={String(t('website.giftCards.amountPlaceholder', 'Enter amount'))}
                              value={customAmount}
                              onChange={(e) => {
                                setCustomAmount(e.target.value);
                                setSelectedAmount(null);
                              }}
                              data-testid="input-custom-amount"
                            />
                          </div>

                          <Separator />

                          <div className="space-y-2">
                            <Label htmlFor="recipientName">{t('website.giftCards.recipientName', 'Recipient Name')}</Label>
                            <Input
                              id="recipientName"
                              placeholder={String(t('website.giftCards.recipientNamePlaceholder', 'John Doe'))}
                              value={recipientName}
                              onChange={(e) => setRecipientName(e.target.value)}
                              data-testid="input-recipient-name"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="recipientEmail">{t('website.giftCards.recipientEmail', 'Recipient Email')}</Label>
                            <Input
                              id="recipientEmail"
                              type="email"
                              placeholder={String(t('website.giftCards.recipientEmailPlaceholder', 'friend@example.com'))}
                              value={recipientEmail}
                              onChange={(e) => setRecipientEmail(e.target.value)}
                              data-testid="input-recipient-email"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="message">{t('website.giftCards.personalMessage', 'Personal Message (Optional)')}</Label>
                            <Textarea
                              id="message"
                              placeholder={String(t('website.giftCards.messagePlaceholder', 'Happy travels! Stay connected wherever you go...'))}
                              value={message}
                              onChange={(e) => setMessage(e.target.value)}
                              rows={3}
                              data-testid="input-message"
                            />
                          </div>

                          <Separator />

                          <div className="space-y-3">
                            <Label>{t('website.giftCards.paymentMethod', 'Payment Method')}</Label>
                            <RadioGroup
                              value={paymentMethod}
                              onValueChange={(value) =>
                                setPaymentMethod(value as PaymentMethodType)
                              }
                              data-testid="radiogroup-payment-method-gift"
                            >
                              <div className="space-y-2">
                                <div className="flex items-center space-x-3 rounded-lg border p-3 hover-elevate active-elevate-2 cursor-pointer">
                                  <RadioGroupItem
                                    value="card"
                                    id="gift-payment-card"
                                    data-testid="radio-payment-card-gift"
                                  />
                                  <Label
                                    htmlFor="gift-payment-card"
                                    className="flex items-center gap-2 cursor-pointer flex-1"
                                  >
                                    <CreditCard className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-sm">{t('website.giftCards.creditCard', 'Credit/Debit Card')}</span>
                                  </Label>
                                </div>

                                <div className="flex items-center space-x-3 rounded-lg border p-3 hover-elevate active-elevate-2 cursor-pointer">
                                  <RadioGroupItem
                                    value="paypal"
                                    id="gift-payment-paypal"
                                    data-testid="radio-payment-paypal-gift"
                                  />
                                  <Label
                                    htmlFor="gift-payment-paypal"
                                    className="flex items-center gap-2 cursor-pointer flex-1"
                                  >
                                    <SiPaypal className="h-4 w-4 text-primary" />
                                    <span className="text-sm">{t('website.giftCards.payPal', 'PayPal')}</span>
                                  </Label>
                                </div>

                                {applePaySupported && (
                                  <div className="flex items-center space-x-3 rounded-lg border p-3 hover-elevate active-elevate-2 cursor-pointer">
                                    <RadioGroupItem
                                      value="apple_pay"
                                      id="gift-payment-apple"
                                      data-testid="radio-payment-apple-gift"
                                    />
                                    <Label
                                      htmlFor="gift-payment-apple"
                                      className="flex items-center gap-2 cursor-pointer flex-1"
                                    >
                                      <SiApplepay className="h-4 w-4 text-muted-foreground" />
                                      <span className="text-sm">Apple Pay</span>
                                    </Label>
                                  </div>
                                )}

                                {/* {googlePaySupported && (
                                  <div className="flex items-center space-x-3 rounded-lg border p-3 hover-elevate active-elevate-2 cursor-pointer">
                                    <RadioGroupItem
                                      value="google_pay"
                                      id="gift-payment-google"
                                      data-testid="radio-payment-google-gift"
                                    />
                                    <Label
                                      htmlFor="gift-payment-google"
                                      className="flex items-center gap-2 cursor-pointer flex-1"
                                    >
                                      <SiGooglepay className="h-4 w-4 text-muted-foreground" />
                                      <span className="text-sm">Google Pay</span>
                                    </Label>
                                  </div>
                                )} */}
                              </div>
                            </RadioGroup>
                          </div>

                          <Button
                            className="w-full"
                            size="lg"
                            onClick={handlePurchase}
                            disabled={!selectedAmount && !customAmount}
                            data-testid="button-purchase-gift-card"
                          >
                            <Send className="mr-2 h-4 w-4" />
                            {t('website.giftCards.continueToPayment', { symbol, amount: currentAmount })}
                          </Button>
                        </CardContent>
                      </Card>
                    </div>

                    <div className="order-1 lg:order-2 space-y-6">
                      <div className="lg:sticky lg:top-24">
                        <h3 className="text-lg font-semibold mb-4 text-center lg:text-left">
                          {t('website.giftCards.preview', 'Preview')}
                        </h3>
                        <GiftCardPreview
                          amount={currentAmount}
                          recipientName={recipientName || undefined}
                          message={message || undefined}
                        />

                        <Card className="mt-6">
                          <CardHeader>
                            <CardTitle className="text-base">{t('website.giftCards.howItWorksTitle', 'How It Works')}</CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-3">
                            {[
                              { step: 1, text: t('website.giftCards.step1', 'Choose an amount or enter a custom value') },
                              { step: 2, text: t('website.giftCards.step2', 'Add recipient details and a message') },
                              { step: 3, text: t('website.giftCards.step3', 'Complete secure payment') },
                              { step: 4, text: t('website.giftCards.step4', 'Recipient gets the gift card instantly via email') },
                              { step: 5, text: t('website.giftCards.step5', 'They can use it for any eSIM package') },
                            ].map((item) => (
                              <div key={item.step} className="flex items-start gap-3">
                                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-xs font-semibold">
                                  {item.step}
                                </div>
                                <p className="text-sm text-muted-foreground">{item.text}</p>
                              </div>
                            ))}
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  </div>
                ) : (
                  <Card className="max-w-lg mx-auto">
                    <CardHeader>
                      <CardTitle>{t('website.giftCards.completePurchase', 'Complete Your Purchase')}</CardTitle>
                      <CardDescription>
                        {t('website.giftCards.checkoutBadge', { symbol, amount: selectedAmount || customAmount })}
                        {recipientEmail && t('website.giftCards.checkoutFor', { email: recipientEmail })}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Elements stripe={stripePromise} options={{ clientSecret }}>
                        <GiftCardCheckoutForm
                          amount={selectedAmount || parseFloat(customAmount)}
                          recipient={{ email: recipientEmail, name: recipientName, message }}
                          onBack={() => setClientSecret('')}
                        />
                      </Elements>
                    </CardContent>
                  </Card>
                )}

                <MyGiftCardsSection />
              </TabsContent>

              <TabsContent value="redeem">
                <div className="max-w-lg mx-auto">
                  <Card>
                    <CardHeader className="text-center">
                      <div className="w-16 h-16 rounded-full bg-orange-500/10 flex items-center justify-center mx-auto mb-4">
                        <Gift className="h-8 w-8 text-primary" />
                      </div>
                      <CardTitle>{t('website.giftCards.redeemTitle', 'Redeem Your Gift Card')}</CardTitle>
                      <CardDescription>
                        {t('website.giftCards.redeemDesc', 'Enter your gift card code to add credit to your account')}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="redemptionCode">{t('website.giftCards.redeemCodeLabel', 'Gift Card Code')}</Label>
                        <Input
                          id="redemptionCode"
                          placeholder="GIFT-XXXX-XXXX-XXXX"
                          value={redemptionCode}
                          onChange={(e) => setRedemptionCode(e.target.value.toUpperCase())}
                          className="text-center font-mono text-lg tracking-wider"
                          data-testid="input-redemption-code"
                        />
                      </div>
                      <Button
                        className="w-full"
                        size="lg"
                        onClick={handleRedeem}
                        disabled={isRedeeming || !redemptionCode}
                        data-testid="button-redeem"
                      >
                        {isRedeeming ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            {t('website.giftCards.redeeming', 'Redeeming...')}
                          </>
                        ) : (
                          <>
                            <Check className="mr-2 h-4 w-4" />
                            {t('website.giftCards.redeemBtn', 'Redeem Gift Card')}
                          </>
                        )}
                      </Button>
                    </CardContent>
                    <CardFooter className="flex-col gap-4 text-center">
                      <Separator />
                      <p className="text-sm text-muted-foreground">
                        {t('website.giftCards.dontHave', "Don't have a gift card?")}{' '}
                        <button
                          onClick={() => setActiveTab('purchase')}
                          className="text-primary hover:underline font-medium"
                          data-testid="link-buy-gift-card"
                        >
                          {t('website.giftCards.buyOne', 'Buy one for someone special')}
                        </button>
                      </p>
                    </CardFooter>
                  </Card>

                  <MyGiftCardsSection />
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        <div className="bg-muted/30 py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold text-center mb-8">{t('website.giftCards.faqTitle', 'Frequently Asked Questions')}</h2>
              <div className="grid md:grid-cols-2 gap-6">
                {[
                  {
                    q: t('website.giftCards.faqQ1', 'How are gift cards delivered?'),
                    a: t('website.giftCards.faqA1', "Gift cards are delivered instantly via email to the recipient's email address you provide."),
                  },
                  {
                    q: t('website.giftCards.faqQ2', 'Do gift cards expire?'),
                    a: t('website.giftCards.faqA2', { siteName }),
                  },
                  {
                    q: t('website.giftCards.faqQ3', 'Can I use a gift card for multiple purchases?'),
                    a: t('website.giftCards.faqA3', 'Yes! The gift card balance can be used across multiple purchases until the balance is depleted.'),
                  },
                  {
                    q: t('website.giftCards.faqQ4', 'What if my purchase exceeds the gift card balance?'),
                    a: t('website.giftCards.faqA4', 'You can pay the remaining amount using any of our supported payment methods.'),
                  },
                ].map((faq, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <CardTitle className="text-base">{faq.q}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">{faq.a}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* <SiteFooter /> */}
    </div>
  );
}
