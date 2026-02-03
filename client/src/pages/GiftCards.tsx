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

  const { currency, setCurrency, currencies } = useCurrency();

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
          title: 'Payment Failed',
          description: error.message,
          variant: 'destructive',
        });
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        toast({
          title: 'Gift Card Purchased!',
          description: "The gift card has been sent to the recipient's email.",
        });
        setLocation('/profile');
      }
    } catch (err: any) {
      toast({
        title: 'Payment Error',
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
          Back
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
              Processing...
            </>
          ) : (
            `Pay ${symbol}${amount}`
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
  const { currency, setCurrency, currencies } = useCurrency();

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
            <Badge className="bg-white/20 text-white border-0 hover:bg-white/30">Gift Card</Badge>
          </div>

          <div className="mb-6">
            <p className="text-white/80 text-sm mb-1">Value</p>
            <p className="text-4xl font-bold text-white">
              {symbol}
              {amount || 0}
            </p>
          </div>

          {recipientName && (
            <div className="mb-4">
              <p className="text-white/80 text-sm">For</p>
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

  const { currency, setCurrency, currencies } = useCurrency();

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
          My Gift Cards
        </CardTitle>
        <CardDescription>Your purchased and redeemed gift cards</CardDescription>
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
                    Balance: {symbol}
                    {card.balance}
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
        title: 'Authentication Required',
        description: 'Please log in to purchase a gift card',
        variant: 'destructive',
      });
      setLocation('/login');
      return;
    }

    const amount = selectedAmount || parseFloat(customAmount);

    if (!amount || amount < 10) {
      toast({
        title: 'Invalid Amount',
        description: `Gift card amount must be at least ${symbol}10`,
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
        title: 'Purchase Failed',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const handleRedeem = async () => {
    if (!isAuthenticated) {
      toast({
        title: 'Authentication Required',
        description: 'Please log in to redeem a gift card',
        variant: 'destructive',
      });
      setLocation('/login');
      return;
    }

    if (!redemptionCode) {
      toast({
        title: 'Code Required',
        description: 'Please enter a gift card code',
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
        title: 'Gift Card Redeemed!',
        description: `${symbol}${response.amount} has been added to your account.`,
      });

      setRedemptionCode('');
    } catch (error: any) {
      toast({
        title: 'Redemption Failed',
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
        <title>Gift Cards - Give the Gift of Connectivity | {siteName}</title>
        <meta
          name="description"
          content={`Give the gift of global connectivity with ${siteName} gift cards. Perfect for travelers and remote workers.`}
        />
      </Helmet>

      {/* <SiteHeader /> */}

      <main className="flex-1   ">
        <div className="relative bg-gradient-to-br from-teal-500/10 via-teal-400/5 to-background py-16 md:py-24 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl" />
          </div>

          <div className="container mx-auto px-4 relative z-10 mt-[40px]">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 bg-primary-light text-white px-4 py-2 rounded-full mb-6">
                <Sparkles className="h-4 w-4" />
                <span className="text-sm font-medium">Perfect Gift for Travelers</span>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                Give the Gift of <span className="text-primary">Connectivity</span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
                Send an {siteName} gift card to friends and family. Perfect for travelers, remote
                workers, and anyone who needs to stay connected worldwide.
              </p>
            </div>
          </div>
        </div>

        <div className="py-12 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
              {[
                { icon: Gift, label: 'Instant Delivery', desc: 'Email delivery in seconds' },
                { icon: Globe, label: '200+ Countries', desc: 'Works worldwide' },
                { icon: Clock, label: 'Never Expires', desc: 'Use anytime' },
                { icon: Wallet, label: 'Any Amount', desc: 'From $10 to $500' },
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
                  Buy Gift Card
                </TabsTrigger>
                <TabsTrigger value="redeem" data-testid="tab-redeem">
                  <Check className="h-4 w-4 mr-2" />
                  Redeem Code
                </TabsTrigger>
              </TabsList>

              <TabsContent value="purchase" className="space-y-8">
                {!clientSecret ? (
                  <div className="grid lg:grid-cols-2 gap-8">
                    <div className="order-2 lg:order-1">
                      <Card>
                        <CardHeader>
                          <CardTitle>Purchase Gift Card</CardTitle>
                          <CardDescription>
                            Select an amount and personalize your gift
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                          <div>
                            <Label className="mb-3 block">Select Amount</Label>
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
                              Or Enter Custom Amount ({symbol}10 - {symbol}500)
                            </Label>
                            <Input
                              id="customAmount"
                              type="number"
                              min="10"
                              max="500"
                              placeholder="Enter amount"
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
                            <Label htmlFor="recipientName">Recipient Name</Label>
                            <Input
                              id="recipientName"
                              placeholder="John Doe"
                              value={recipientName}
                              onChange={(e) => setRecipientName(e.target.value)}
                              data-testid="input-recipient-name"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="recipientEmail">Recipient Email</Label>
                            <Input
                              id="recipientEmail"
                              type="email"
                              placeholder="friend@example.com"
                              value={recipientEmail}
                              onChange={(e) => setRecipientEmail(e.target.value)}
                              data-testid="input-recipient-email"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="message">Personal Message (Optional)</Label>
                            <Textarea
                              id="message"
                              placeholder="Happy travels! Stay connected wherever you go..."
                              value={message}
                              onChange={(e) => setMessage(e.target.value)}
                              rows={3}
                              data-testid="input-message"
                            />
                          </div>

                          <Separator />

                          <div className="space-y-3">
                            <Label>Payment Method</Label>
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
                                    <span className="text-sm">Credit/Debit Card</span>
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
                                    <span className="text-sm">PayPal</span>
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
                            Continue to Payment - {symbol}
                            {currentAmount}
                          </Button>
                        </CardContent>
                      </Card>
                    </div>

                    <div className="order-1 lg:order-2 space-y-6">
                      <div className="lg:sticky lg:top-24">
                        <h3 className="text-lg font-semibold mb-4 text-center lg:text-left">
                          Preview
                        </h3>
                        <GiftCardPreview
                          amount={currentAmount}
                          recipientName={recipientName || undefined}
                          message={message || undefined}
                        />

                        <Card className="mt-6">
                          <CardHeader>
                            <CardTitle className="text-base">How It Works</CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-3">
                            {[
                              { step: 1, text: 'Choose an amount or enter a custom value' },
                              { step: 2, text: 'Add recipient details and a message' },
                              { step: 3, text: 'Complete secure payment' },
                              { step: 4, text: 'Recipient gets the gift card instantly via email' },
                              { step: 5, text: 'They can use it for any eSIM package' },
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
                      <CardTitle>Complete Your Purchase</CardTitle>
                      <CardDescription>
                        {symbol}
                        {selectedAmount || customAmount} Gift Card
                        {recipientEmail && ` for ${recipientEmail}`}
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
                      <CardTitle>Redeem Your Gift Card</CardTitle>
                      <CardDescription>
                        Enter your gift card code to add credit to your account
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="redemptionCode">Gift Card Code</Label>
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
                            Redeeming...
                          </>
                        ) : (
                          <>
                            <Check className="mr-2 h-4 w-4" />
                            Redeem Gift Card
                          </>
                        )}
                      </Button>
                    </CardContent>
                    <CardFooter className="flex-col gap-4 text-center">
                      <Separator />
                      <p className="text-sm text-muted-foreground">
                        Don't have a gift card?{' '}
                        <button
                          onClick={() => setActiveTab('purchase')}
                          className="text-primary hover:underline font-medium"
                          data-testid="link-buy-gift-card"
                        >
                          Buy one for someone special
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
              <h2 className="text-2xl font-bold text-center mb-8">Frequently Asked Questions</h2>
              <div className="grid md:grid-cols-2 gap-6">
                {[
                  {
                    q: 'How are gift cards delivered?',
                    a: "Gift cards are delivered instantly via email to the recipient's email address you provide.",
                  },
                  {
                    q: 'Do gift cards expire?',
                    a: `No, ${siteName} gift cards never expire. The recipient can use them anytime.`,
                  },
                  {
                    q: 'Can I use a gift card for multiple purchases?',
                    a: 'Yes! The gift card balance can be used across multiple purchases until the balance is depleted.',
                  },
                  {
                    q: 'What if my purchase exceeds the gift card balance?',
                    a: 'You can pay the remaining amount using any of our supported payment methods.',
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
