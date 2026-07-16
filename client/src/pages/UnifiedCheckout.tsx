import { useState, useEffect, useRef } from 'react';
import { useParams, useLocation, Link } from 'wouter';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import {
  ArrowLeft,
  Shield,
  Lock,
  CreditCard,
  Mail,
  Phone,
  Check,
  Loader2,
  Zap,
  Plus,
  Minus,
  Tag,
  Gift,
  Users,
  Coins,
  Wallet,
  CircleDollarSign,
  X,
  Smartphone,
  CheckCircle,
  Wifi,
  Signal,
  Clock,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { ChevronsUpDown, Check as CheckIcon } from "lucide-react";
import { useToast } from '@/hooks/use-toast';
import { useUser } from '@/hooks/use-user';
import { useCurrency } from '@/contexts/CurrencyContext';
import ReactCountryFlag from 'react-country-flag';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { CheckoutAuth } from '@/components/CheckoutAuth';
import { PackageDataApiRes } from '@/types/types';
import { signInWithGoogle } from "@/lib/firebase";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSettingByKey } from '@/hooks/useSettings';
import { useTranslation } from '@/contexts/TranslationContext';

type UnifiedPackage = {
  id: string;
  slug: string;
  title: string;
  dataAmount: string;
  dataMb: number | null;
  validity: number;
  validityDays: number;
  price: string;
  retailPrice: string;
  currency: string;
  isUnlimited: boolean;
  providerId: string;
  providerName: string;
  destinationId: string | null;
  operator: string | null;
  countryCode: string | null;
  countryName: string | null;
};

import { countries } from '@/lib/countries';
import PaymentGatewayRenderer from '@/components/payments/PaymentGatewayRenderer';

const formatDataAmount = (pkg: any): string => {
  if (!pkg) return 'eSIM';
  const dataMb = Number(pkg.dataMb);
  if (
    pkg.isUnlimited ||
    dataMb === -1 ||
    dataMb < 0 ||
    pkg.dataAmount === '-1MB' ||
    pkg.dataAmount?.includes('-1')
  ) {
    return 'Unlimited';
  }
  if (!isNaN(dataMb) && dataMb > 0) {
    if (dataMb >= 1024) {
      const gb = dataMb / 1024;
      if (gb === Math.floor(gb)) {
        return `${Math.floor(gb)}GB`;
      }
      return `${gb.toFixed(1)}GB`;
    }
    return `${dataMb}MB`;
  }
  if (pkg.dataAmount && !pkg.dataAmount.includes('-1')) {
    return pkg.dataAmount;
  }
  return 'Data';
};

const formatPackageTitle = (pkg: any): string => {
  const data = formatDataAmount(pkg);
  let validity = pkg.validity ?? pkg.validityDays ?? 0;
  const country = pkg.destination?.name || pkg.countryName || pkg.destination?.countryCode || pkg.countryCode || '';

  if (validity === 0 && pkg.title) {
    const daysMatch = pkg.title.match(/(\d+)\s*Days?/i);
    if (daysMatch) {
      validity = parseInt(daysMatch[1], 10);
    }
  }

  if (country && data) {
    if (validity > 0) {
      return `${data} - ${validity} Days - ${country}`;
    }
    return `${data} - ${country}`;
  }
  if (pkg.title) {
    let formattedTitle = pkg.title
      .replace(/-1MB/g, 'Unlimited')
      .replace(/-1 MB/g, 'Unlimited')
      .replace(/-1mb/g, 'Unlimited');
    const parts = formattedTitle.match(/^(.+?)\s+(\d+(?:GB|MB)|Unlimited)\s+(\d+)\s*Days?$/i);
    if (parts) {
      return `${parts[2]} - ${parts[3]} Days - ${parts[1]}`;
    }
    return formattedTitle;
  }
  return `${data} eSIM`;
};

const checkoutSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(5, 'Please enter a valid phone number'),
  acceptTerms: z.boolean().refine((val) => val === true, {
    message: 'You must accept the terms and privacy policy',
  }),
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

export default function UnifiedCheckout() {
  const { packageSlug } = useParams();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { currency, currencies } = useCurrency();
  const { user, isAuthenticated, isLoading: userLoading, refetchUser } = useUser();

  const [gateways, setGateways] = useState([]);
  const [selectedGateway, setSelectedGateway] = useState(null);
  const [initResponse, setInitResponse] = useState(null);
  const [customerInfo, setCustomerInfo] = useState(null);
  const [quantity, setQuantity] = useState(1);

  const { t } = useTranslation();

  // Promo states
  const [promoCode, setPromoCode] = useState('');
  const [promoCodeType, setPromoCodeType] = useState('voucher');
  const [isPromoOpen, setIsPromoOpen] = useState(true);
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [isValidatingPromo, setIsValidatingPromo] = useState(false);
  const siteName = useSettingByKey('platform_name') || 'Voltey';
  const [showPromo, setShowPromo] = useState(true);

  // Credits states
  const [appliedReferralCredits, setAppliedReferralCredits] = useState(0);
  const [isCreditsOpen, setIsCreditsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [openCountry, setOpenCountry] = useState(false);
  const [selectedDialCode, setSelectedDialCode] = useState('+91');

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithGoogle();
      const idToken = await result.user.getIdToken();

      await apiRequest("POST", "/api/auth/web/login-with-google", {
        idToken,
        referralCode: localStorage.getItem("pendingReferralCode"),
      });

      refetchUser();
      toast({
        title: "Success",
        description: "Signed in with Google successfully",
      });
    } catch (err) {
      console.error("Google login error", err);
      toast({
        title: "Error",
        description: "Failed to sign in with Google",
        variant: "destructive",
      });
    }
  };

  const getCurrencySymbol = (currencyCode) =>
    currencies.find((c) => c.code === currencyCode)?.symbol || '$';

  useEffect(() => {
    apiRequest('GET', `/api/payments/gateways?currency=${currency}`)
      .then((res) => res.json())
      .then((data) => {
        setGateways(data.data || []);
        if (data.data?.length === 1) setSelectedGateway(data.data[0]);
      });
  }, [currency]);


  const { data: referralBalanceData } = useQuery({
    queryKey: ['/api/referrals/my-balance'],
    enabled: isAuthenticated,
  });

  const form = useForm({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      email: user?.email || '',
      phone: user?.phone || '',
      acceptTerms: false,
    },
  });

  const { data: packageData, isLoading: isLoadingPackage } = useQuery<PackageDataApiRes>({
    queryKey: [`/api/unified-packages/slug/${packageSlug}`, { currency }],
    enabled: !!packageSlug,
  });

  const calculateTotal = () => {
    const basePrice = parseFloat(packageData?.retailPrice || packageData?.price || '0');
    const subtotal = basePrice * quantity;
    const totalDiscount = (appliedPromo?.discount || 0) + appliedReferralCredits;
    return Math.max(subtotal - totalDiscount, 0).toFixed(2);
  };

  const availableCredits = referralBalanceData?.balance || 0;

  const handleApplyPromo = async () => {
    if (!promoCode.trim()) {
      toast({
        title: 'Enter a code',
        description: 'Please enter a promo code, gift card, or referral code',
        variant: 'destructive',
      });
      return;
    }
    if (appliedPromo) {
      toast({
        title: 'Code Already Applied',
        description: 'Remove the current code first to apply a different one',
        variant: 'destructive',
      });
      return;
    }

    setIsValidatingPromo(true);
    try {
      const basePrice = parseFloat(packageData?.retailPrice || packageData?.price || '0');
      const orderAmount = basePrice * quantity;

      const res = await apiRequest('POST', '/api/validate-promo-code', {
        code: promoCode.trim(),
        type: promoCodeType,
        orderAmount,
      });

      const data = await res.json();

      if (!data.success) {
        toast({
          title: 'Invalid Code',
          description: 'This code is not valid',
          variant: 'destructive',
        });
        return;
      }

      setAppliedPromo({
        code: data.code,
        discount: data.discount,
        type: data.type,
        voucherId: data.voucherId,
        giftCardId: data.giftCardId,
        referrerId: data.referrerId,
        balance: data.balance,
        description: data.description,
      });

      toast({
        title: 'Code Applied',
        description:
          data.description ||
          `Discount of ${getCurrencySymbol(packageData.currency)}${data.discount.toFixed(2)} applied`,
      });

      setPromoCode('');
      setIsPromoOpen(false);
    } catch (error: any) {
      const extractErrorMessage = (error: any): string => {
        if (typeof error?.message !== 'string') return 'Something went wrong';
        try {
          const json = error.message.slice(error.message.indexOf('{'));
          return JSON.parse(json).message;
        } catch {
          return error.message;
        }
      };
      toast({
        title: 'Error',
        description: extractErrorMessage(error) || 'Failed to validate code',
        variant: 'destructive',
      });
    } finally {
      setIsValidatingPromo(false);
    }
  };

  const removePromo = () => {
    setAppliedPromo(null);
    toast({ title: 'Code Removed', description: 'Promo code has been removed' });
  };

  const handleApplyCredits = (amount) => {
    const basePrice = parseFloat(packageData?.retailPrice || packageData?.price || '0');
    const subtotal = basePrice * quantity;
    const promoDiscount = appliedPromo?.discount || 0;
    const maxCredits = Math.min(amount, subtotal - promoDiscount, availableCredits);

    if (maxCredits <= 0) {
      toast({
        title: 'Cannot apply credits',
        description: 'Credits cannot exceed the order total',
        variant: 'destructive',
      });
      return;
    }

    setAppliedReferralCredits(Math.round(maxCredits * 100) / 100);
    toast({
      title: 'Credits Applied',
      description: `$${maxCredits.toFixed(2)} in referral credits applied to your order`,
    });
  };

  const removeCredits = () => {
    setAppliedReferralCredits(0);
    toast({
      title: 'Credits Removed',
      description: 'Referral credits have been removed from your order',
    });
  };
  const totalAmount = Number(calculateTotal());
  const isFreeOrder = totalAmount === 0;

  const onSubmit = async (data) => {
    setCustomerInfo(data);

    const orderEmail = data?.email || user?.email;
    const orderName = (user?.name && user.name !== 'Guest')
      ? user.name
      : (data?.name && data.name !== 'Guest')
        ? data.name
        : (orderEmail ? orderEmail.split('@')[0] : 'Guest');

    if (totalAmount === 0) {
      setIsSubmitting(true);
      try {
        const res = await apiRequest('POST', '/api/complete-order', {
          type: 'package_purchase',
          userId: user?.id,
          packageId: packageData.id,
          quantity,
          currency: packageData.currency,
          promoType: appliedPromo?.type || null,
          promoCode: appliedPromo?.code || null,
          giftCardId: appliedPromo?.giftCardId || null,
          voucherId: appliedPromo?.voucherId || null,
          referralCredits: appliedReferralCredits || 0,
          promoDiscount: (appliedPromo?.discount || 0) + (appliedReferralCredits || 0),
          email: orderEmail,
          name: orderName,
          phone: data?.phone,
        });

        const result = await res.json();
        if (!result.success) {
          toast({
            title: 'Order Failed',
            description: result.message,
            variant: 'destructive',
          });
          setIsSubmitting(false);
          return;
        }

        toast({
          title: 'Order Confirmed 🎉',
          description: 'Your eSIM has been activated successfully',
        });
        setLocation(`/account/orders`);
        return;
      } catch (err: any) {
        toast({
          title: 'Error',
          description: err.message || 'Failed to complete order',
          variant: 'destructive',
        });
        setIsSubmitting(false);
        return;
      }
    }

    if (!selectedGateway) {
      toast({
        title: 'Select payment method',
        description: 'Please choose a payment gateway',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);
    const payload: any = {
      gatewayId: selectedGateway.id,
      packageId: packageData.id,
      quantity,
      currency: packageData.currency,
      orderId: `ORDER_${Date.now()}`,
      promoCode: appliedPromo?.code || null,
      promoType: appliedPromo?.type || null,
      voucherId: appliedPromo?.voucherId || null,
      giftCardId: appliedPromo?.giftCardId || null,
      referralCredits: appliedReferralCredits || 0,
      email: orderEmail,
      name: orderName,
    };

    if (selectedGateway.provider === 'powertranz') {
      payload.card = {
        pan: customerInfo?.cardPan,
        cvv: customerInfo?.cardCvv,
        expiry: customerInfo?.cardExpiry,
      };
    }

    apiRequest('POST', '/api/payments/init', payload)
      .then((res) => res.json())
      .then((resData) => {
        if (!resData.success) {
          toast({
            title: 'Payment Init Failed',
            description: resData.message,
            variant: 'destructive',
          });
          setIsSubmitting(false);
          return;
        }
        setInitResponse(resData.payment);
        setIsSubmitting(false);
      }).catch((err) => {
        toast({
          title: 'Payment Init Error',
          description: err.message || 'Failed to call payment init API',
          variant: 'destructive',
        });
        setIsSubmitting(false);
      });
  };

  useEffect(() => {
    const handler = (event) => {
      if (event.data?.type !== 'POWERTRANZ_3DS_RESULT') return;
      if (!event.data.success) {
        toast({
          title: 'Payment Failed',
          description: '3DS authentication failed',
          variant: 'destructive',
        });
        return;
      }
      apiRequest('POST', '/api/payments/confirm-payments', {
        provider: 'powertranz',
        spiToken: event.data.spiToken,
      })
        .then((r) => r.json())
        .then((res) => {
          if (res.success) {
            setLocation('/account/orders');
          } else {
            toast({
              title: 'Payment Failed',
              description: res.message,
              variant: 'destructive',
            });
          }
        });
    };
    window.addEventListener('message', handler);
    return () => window.removeEventListener('message', handler);
  }, [setLocation, toast]);

  if (isLoadingPackage) {
    return (
      <div className="min-h-screen bg-background dark:bg-gray-950 flex flex-col">
        <div className="flex-1 flex items-center justify-center pt-20">
          <div className="text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[var(--primary)] border-r-transparent"></div>
            <p className="mt-4 text-muted-foreground dark:text-gray-400">{t('common.loading', 'Loading...')}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!packageData) {
    return (
      <div className="min-h-screen bg-background dark:bg-gray-950 flex flex-col">
        <div className="flex-1 flex items-center justify-center pt-20">
          <div className="text-center">
            <p className="text-muted-foreground dark:text-gray-400">{t('checkout.packageNotFound', 'Package not found')}</p>
            <Button onClick={() => setLocation('/')} className="mt-4 bg-primary-second hover:bg-primary-dark">{t('common.goHome', 'Go Home')}</Button>
          </div>
        </div>
      </div>
    );
  }

  const unitPrice = parseFloat(packageData.retailPrice || packageData.price || '0');

  return (
    <div className="min-h-screen mt-20 bg-gray-50 dark:bg-gray-950 flex flex-col font-sans transition-colors duration-300">
      <Helmet>
        <title>{`Checkout - ${formatDataAmount(packageData)} eSIM | ${siteName}`}</title>
      </Helmet>

      <main className="flex-1 py-8">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="flex items-center gap-2 mb-6">
            <Button variant="ghost" onClick={() => window.history.back()} className="p-0 h-auto hover:bg-transparent text-gray-600 dark:text-gray-400 dark:hover:text-white">
              <ArrowLeft className="w-4 h-4 mr-1" />
              <span className="text-base font-medium">{t('checkout.backToPlans', 'Back to plans')}</span>
            </Button>
          </div>

          <div className="grid lg:grid-cols-12 gap-6 items-start">
            {/* LEFT COLUMN */}
            <div className="lg:col-span-7 space-y-6">

              {/* ACCOUNT & CONTACT SECTION */}
              <Card className="border-0 shadow-sm rounded-2xl overflow-hidden bg-white dark:bg-gray-900 border-border dark:border-gray-800">
                <CardContent className="p-6">
                  {isAuthenticated ? (
                    <div className="space-y-4">
                      <h2 className="text-xl font-bold text-gray-900 dark:text-white">{t('checkout.yourAccount', 'Your Account')}</h2>
                      <div className="flex items-center gap-3 bg-primary/5 dark:bg-primary/10 p-3 rounded-xl border border-primary/10 dark:border-primary/20">
                        <div className="w-12 h-12 rounded-full bg-primary-second flex items-center justify-center text-white font-bold text-lg shadow-sm">
                          {user?.name?.charAt(0) || user?.email?.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1">
                          <p className="font-bold text-base text-gray-900 dark:text-white">{user?.name || 'User'}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{user?.email}</p>
                        </div>
                        <Button variant="ghost" size="sm" onClick={() => apiRequest('POST', '/api/auth/logout').then(() => { queryClient.setQueryData(['/api/auth/me'], null); refetchUser(); })} className="h-9 px-3 text-xs text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors font-semibold">{t('checkout.logout', 'Logout')}</Button>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
                        <Shield className="w-3 h-3 text-green-500" />
                        {t('checkout.emailNote', 'Your eSIM details will be sent to this email address.')}
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <div>
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">{t('checkout.signUpOrLogin', 'Sign up or log in')}</h2>
                        <div className="flex flex-col sm:flex-row gap-3">
                          <Button
                            variant="outline"
                            onClick={handleGoogleLogin}
                            className="h-12 px-6 rounded-xl border-gray-200 dark:border-gray-800 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-white flex items-center justify-center gap-3 text-sm font-bold transition-all shadow-sm"
                          >
                            <svg width="20" height="20" viewBox="0 0 24 24">
                              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
                              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                            </svg>{t('checkout.continueWithGoogle', 'Continue with Google')}</Button>
                        </div>
                      </div>

                      <div className="relative py-2">
                        <div className="absolute inset-0 flex items-center">
                          <span className="w-full border-t border-gray-100 dark:border-gray-800"></span>
                        </div>
                        <div className="relative flex justify-center text-xs uppercase tracking-wider font-bold">
                          <span className="bg-white dark:bg-gray-900 px-3 text-gray-400 dark:text-gray-500">{t('checkout.continueAsGuest', 'Or continue as guest')}</span>
                        </div>
                      </div>

                      {!initResponse && (
                        <Form {...form}>
                          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                            <FormField
                              control={form.control}
                              name="email"
                              render={({ field }) => (
                                <FormItem className="space-y-2">
                                  <FormLabel className="text-sm font-bold text-gray-700 dark:text-gray-300">{t('checkout.emailLabel', 'Email Address')}</FormLabel>
                                  <FormControl>
                                    <div className="relative group">
                                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-primary-second transition-colors" />
                                      <Input
                                        {...field}
                                        type="email"
                                        placeholder="your@email.com"
                                        className="h-12 pl-12 rounded-xl border-gray-200 dark:border-gray-800 dark:bg-gray-800/50 dark:text-white focus:ring-primary-second transition-all"
                                      />
                                    </div>
                                  </FormControl>
                                  <FormMessage className="text-xs font-medium" />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name="phone"
                              render={({ field }) => (
                                <FormItem className="space-y-2">
                                  <FormLabel className="text-sm font-bold text-gray-700 dark:text-gray-300">{t('checkout.phone', 'Phone Number')}</FormLabel>
                                  <div className="flex gap-3">
                                    <Popover open={openCountry} onOpenChange={setOpenCountry}>
                                      <PopoverTrigger asChild>
                                        <Button
                                          variant="outline"
                                          role="combobox"
                                          aria-expanded={openCountry}
                                          className="min-w-[110px] w-fit h-12 rounded-xl border-gray-200 dark:border-gray-800 dark:bg-gray-800/50 dark:text-white justify-between px-4 font-bold transition-all shadow-sm"
                                        >
                                          <div className="flex items-center gap-2 shrink-0">
                                            <ReactCountryFlag
                                              countryCode={countries.find((c) => c.dialCode === selectedDialCode)?.code || 'IN'}
                                              svg
                                            />
                                            <span className="text-sm whitespace-nowrap">{selectedDialCode}</span>
                                          </div>
                                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                        </Button>
                                      </PopoverTrigger>
                                      <PopoverContent className="w-[300px] p-0 dark:bg-gray-900 dark:border-gray-800 shadow-2xl" align="start">
                                        <Command className="dark:bg-gray-900">
                                          <CommandInput placeholder="Search country or code..." className="dark:text-white" />
                                          <CommandList>
                                            <CommandEmpty className="dark:text-gray-400">{t('checkout.noCountryFound', 'No country found.')}</CommandEmpty>
                                            <CommandGroup className="max-h-[300px] overflow-auto">
                                              {countries.map((c) => (
                                                <CommandItem
                                                  key={`${c.code}-${c.dialCode}`}
                                                  value={`${c.name} ${c.dialCode} ${c.code}`}
                                                  className="dark:hover:bg-gray-800 dark:text-gray-200 cursor-pointer p-3"
                                                  onSelect={() => {
                                                    setSelectedDialCode(c.dialCode);
                                                    setOpenCountry(false);
                                                  }}
                                                >
                                                  <div className="flex items-center gap-3 w-full">
                                                    <ReactCountryFlag countryCode={c.code} svg />
                                                    <span className="flex-1 text-sm font-medium">{c.name}</span>
                                                    <span className="text-xs text-gray-400 dark:text-gray-500 font-bold">{c.dialCode}</span>
                                                    <CheckIcon
                                                      className={cn(
                                                        "ml-auto h-4 w-4 text-primary-second",
                                                        selectedDialCode === c.dialCode ? "opacity-100" : "opacity-0"
                                                      )}
                                                    />
                                                  </div>
                                                </CommandItem>
                                              ))}
                                            </CommandGroup>
                                          </CommandList>
                                        </Command>
                                      </PopoverContent>
                                    </Popover>
                                    <FormControl className="flex-1">
                                      <div className="relative flex-1 group">
                                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-primary-second transition-colors" />
                                        <Input
                                          {...field}
                                          type="tel"
                                          inputMode="numeric"
                                          placeholder="000 000 000"
                                          className="h-12 pl-12 rounded-xl border-gray-200 dark:border-gray-800 dark:bg-gray-800/50 dark:text-white focus:ring-primary-second transition-all"
                                          onChange={(e) => {
                                            const value = e.target.value.replace(/\D/g, '');
                                            field.onChange(value);
                                          }}
                                        />
                                      </div>
                                    </FormControl>
                                  </div>
                                  <FormMessage className="text-xs font-medium" />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name="acceptTerms"
                              render={({ field }) => (
                                <FormItem className="flex flex-row items-start space-x-3 space-y-0 pt-2">
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value}
                                      onCheckedChange={field.onChange}
                                      className="mt-1 w-5 h-5 rounded-md border-gray-300 dark:border-gray-700 data-[state=checked]:bg-primary-second data-[state=checked]:border-primary-second"
                                    />
                                  </FormControl>
                                  <div className="leading-tight">
                                    <FormLabel className="text-sm font-medium text-gray-600 dark:text-gray-400 cursor-pointer select-none">
                                      I agree to the{' '}
                                      <Link href="/terms-of-service" className="text-primary-second font-bold hover:underline">{t('checkout.termsOfService', 'Terms of Service')}</Link>{' '}
                                      and{' '}
                                      <Link href="/privacy-policy" className="text-primary-second font-bold hover:underline">{t('checkout.privacyPolicy', 'Privacy Policy')}</Link>
                                    </FormLabel>
                                    <FormMessage className="text-xs font-semibold" />
                                  </div>
                                </FormItem>
                              )}
                            />
                          </form>
                        </Form>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* PAYMENT SECTION */}
              <Card className="border-0 shadow-sm rounded-2xl bg-white dark:bg-gray-900 border-border dark:border-gray-800 overflow-hidden">
                <CardContent className="p-6">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">{t('checkout.selectPaymentMethod', 'Select a payment method')}</h2>

                  {!initResponse ? (
                    <div className="space-y-6">
                      {gateways.length > 0 ? (
                        <div className="space-y-3">
                          {gateways.map((gateway: any) => {
                            const isSelected = selectedGateway?.id === gateway.id;
                            const providerName = gateway.provider.toLowerCase();

                            return (
                              <div
                                key={gateway.id}
                                onClick={() => setSelectedGateway(gateway)}
                                className={`
                                  group relative p-5 rounded-2xl border-2 transition-all duration-300
                                  flex items-center justify-between cursor-pointer
                                  ${isSelected
                                    ? 'border-primary-second bg-primary/5 dark:bg-primary/10 shadow-md scale-[1.01]'
                                    : 'border-gray-100 dark:border-gray-800 hover:border-primary-second/30 bg-white dark:bg-gray-800/40'}
                                `}
                              >
                                <div className="flex items-center gap-4">
                                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-inner transition-colors ${isSelected ? 'bg-primary-second text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'}`}>
                                    {providerName.includes('card') || providerName.includes('stripe') || providerName.includes('powertranz') ? (
                                      <CreditCard className="w-6 h-6" />
                                    ) : providerName.includes('paypal') ? (
                                      <Wallet className="w-6 h-6" />
                                    ) : (
                                      <CircleDollarSign className="w-6 h-6" />
                                    )}
                                  </div>
                                  <div>
                                    <p className={`font-bold text-base transition-colors ${isSelected ? 'text-primary-second' : 'text-gray-900 dark:text-white'}`}>
                                      {providerName.includes('stripe') || providerName.includes('powertranz') ? 'Credit or debit card' :
                                        providerName.includes('paypal') ? 'PayPal' :
                                          providerName.includes('google') ? 'Google Pay' : gateway.provider.toUpperCase()}
                                    </p>
                                    {(providerName.includes('card') || providerName.includes('stripe') || providerName.includes('powertranz')) && (
                                      <div className="flex gap-2 mt-1.5 opacity-80">
                                        <img src="/payment-providers/visa.png" className="h-5" alt="Visa" />
                                        <img src="/payment-providers/master.png" className="h-5" alt="Mastercard" />
                                        <img src="/payment-providers/paypal.png" className="h-5 dark:brightness-200" alt="PayPal" />
                                      </div>
                                    )}
                                  </div>
                                </div>
                                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${isSelected ? 'border-primary-second bg-primary-second shadow-sm' : 'border-gray-300 dark:border-gray-700 group-hover:border-primary-second/50'}`}>
                                  {isSelected && <Check className="w-4 h-4 text-white font-black" />}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="p-10 text-center border-2 border-dashed border-gray-100 dark:border-gray-800 rounded-2xl">
                          <CreditCard className="w-10 h-10 text-gray-300 dark:text-gray-700 mx-auto mb-4" />
                          <p className="text-sm font-medium text-gray-400 dark:text-gray-500">{t('checkout.noGateways', 'No payment methods available for this currency.')}</p>
                        </div>
                      )}

                      {/* POWERTRANZ CARD FORM */}
                      {selectedGateway?.provider === 'powertranz' && (
                        <div className="mt-4 p-5 bg-gray-50 dark:bg-gray-800/50 rounded-2xl space-y-4 border border-gray-100 dark:border-gray-800 shadow-inner">
                          <h4 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            <Lock className="w-4 h-4 text-primary-second" />{t('checkout.cardDetails', 'Secure Card Details')}</h4>
                          <Input
                            placeholder="Card Number"
                            className="h-11 text-sm rounded-xl border-gray-200 dark:border-gray-800 dark:bg-gray-900 dark:text-white"
                            onChange={(e) => setCustomerInfo((prev: any) => ({ ...prev, cardPan: e.target.value.replace(/\D/g, '') }))}
                          />
                          <div className="grid grid-cols-2 gap-4">
                            <Input
                              placeholder="MM/YY"
                              className="h-11 text-sm rounded-xl border-gray-200 dark:border-gray-800 dark:bg-gray-900 dark:text-white"
                              onChange={(e) => setCustomerInfo((prev: any) => ({ ...prev, cardExpiry: e.target.value.replace(/\D/g, '') }))}
                            />
                            <Input
                              placeholder="CVV"
                              className="h-11 text-sm rounded-xl border-gray-200 dark:border-gray-800 dark:bg-gray-900 dark:text-white"
                              onChange={(e) => setCustomerInfo((prev: any) => ({ ...prev, cardCvv: e.target.value.replace(/\D/g, '') }))}
                            />
                          </div>
                        </div>
                      )}

                      <Button
                        disabled={isSubmitting || !selectedGateway}
                        onClick={() => isAuthenticated ? onSubmit({ email: user?.email, acceptTerms: true }) : form.handleSubmit(onSubmit)()}
                        className="w-full h-14 mt-4 bg-primary-gradient hover:bg-primary-gradient-hover text-white text-lg font-black rounded-2xl transition-all shadow-xl shadow-primary/20 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:hover:scale-100"
                      >
                        {isSubmitting ? (
                          <><Loader2 className="w-5 h-5 mr-3 animate-spin" />{t('checkout.processing', 'Processing...')}</>
                        ) : (
                          isFreeOrder ? 'Confirm Order' : 'Complete Purchase'
                        )}
                      </Button>
                    </div>
                  ) : (
                    <PaymentGatewayRenderer
                      initData={initResponse}
                      email={customerInfo?.email || user?.email}
                    />
                  )}
                </CardContent>
              </Card>

              <div className="flex flex-wrap items-center gap-6 justify-center py-4 px-4 bg-gray-100/50 dark:bg-gray-900/50 rounded-2xl border border-gray-100 dark:border-gray-800">
                <div className="flex items-center gap-2 text-xs font-bold text-gray-500 dark:text-gray-400">
                  <Shield className="w-4 h-4 text-primary-second" />
                  <span>{t('checkout.secureCheckout', 'SECURE CHECKOUT')}</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-gray-500 dark:text-gray-400">
                  <Lock className="w-4 h-4 text-primary-second" />
                  <span>{t('checkout.encrypted', '256-BIT ENCRYPTED')}</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-gray-500 dark:text-gray-400">
                  <Zap className="w-4 h-4 text-primary-second" />
                  <span>{t('checkout.instantDelivery', 'INSTANT DELIVERY')}</span>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN - ORDER SUMMARY */}
            <div className="lg:col-span-5">
              <Card className="border-0 shadow-xl rounded-2xl bg-white dark:bg-gray-900 border-border dark:border-gray-800 sticky top-8 overflow-hidden">
                <div className="h-2 bg-primary-gradient w-full" />
                <CardContent className="p-6 sm:p-8">
                  <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-8 tracking-tight">{t('checkout.orderSummary', 'Order Summary')}</h2>

                  <div className="bg-gray-50 dark:bg-gray-800/60 rounded-2xl p-4 flex items-center gap-4 mb-8 border border-gray-100 dark:border-gray-800 shadow-inner">
                    {(packageData.destination?.countryCode || packageData.countryCode) && (
                      <div className="w-12 h-9 rounded-lg overflow-hidden shadow-md flex-shrink-0 border-2 border-white dark:border-gray-700">
                        <ReactCountryFlag
                          countryCode={packageData.destination?.countryCode || packageData.countryCode}
                          svg
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      </div>
                    )}
                    <div>
                      <span className="text-xl font-black text-gray-900 dark:text-white block leading-tight">
                        {packageData.destination?.name || packageData.countryName || packageData.destination?.countryCode || packageData.countryCode || 'Global'}
                      </span>
                      <span className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">{t('checkout.esimPlan', 'ESIM DATA PLAN')}</span>
                    </div>
                  </div>

                  <div className="space-y-5 pb-8 border-b border-gray-100 dark:border-gray-800">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-bold text-gray-500 dark:text-gray-400">{t('checkout.plan', 'Plan Data')}</span>
                      <div className="flex items-center gap-2">
                        <Wifi className="w-4 h-4 text-primary-second" />
                        <span className="font-black text-gray-900 dark:text-white">{formatDataAmount(packageData)}</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-bold text-gray-500 dark:text-gray-400">{t('checkout.type', 'Network')}</span>
                      <div className="flex items-center gap-2">
                        <Signal className="w-4 h-4 text-primary-second" />
                        <span className="font-black text-gray-900 dark:text-white">4G/5G {t('checkout.ready', 'Ready')}</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-bold text-gray-500 dark:text-gray-400">{t('checkout.duration', 'Validity')}</span>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-primary-second" />
                        <span className="font-black text-gray-900 dark:text-white">{packageData.validity} days</span>
                      </div>
                    </div>
                  </div>

                  {/* PRICE & PROMOS */}
                  <div className="py-8 space-y-4">
                    <div className="flex justify-between items-end mb-2">
                      <span className="text-base font-bold text-gray-900 dark:text-white">{t('checkout.total', 'Total Amount')}</span>
                      <div className="text-right">
                        <span className="text-3xl font-black text-gray-900 dark:text-white tracking-tighter">
                          {getCurrencySymbol(packageData.currency)}{calculateTotal()}
                        </span>
                        <p className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">{packageData.currency}</p>
                      </div>
                    </div>

                    {appliedPromo && (
                      <div className="flex justify-between items-center bg-green-50 dark:bg-green-500/10 p-3 rounded-xl border border-green-100 dark:border-green-500/20 animate-in zoom-in-95 duration-300">
                        <div className="flex items-center gap-3">
                          <Tag className="w-4 h-4 text-green-600 dark:text-green-400" />
                          <span className="text-xs font-black text-green-700 dark:text-green-400 uppercase tracking-wider">{appliedPromo.code} applied</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-black text-green-700 dark:text-green-400">-{getCurrencySymbol(packageData.currency)}{appliedPromo.discount.toFixed(2)}</span>
                          <Button variant="ghost" size="sm" onClick={removePromo} className="h-6 w-6 p-0 rounded-full hover:bg-green-200 dark:hover:bg-green-500/20 text-green-700 dark:text-green-400">
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    )}

                    {appliedReferralCredits > 0 && (
                      <div className="flex justify-between items-center bg-amber-50 dark:bg-amber-500/10 p-3 rounded-xl border border-amber-100 dark:border-amber-500/20 animate-in zoom-in-95 duration-300">
                        <div className="flex items-center gap-3">
                          <Coins className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                          <span className="text-xs font-black text-amber-700 dark:text-amber-400 uppercase tracking-wider">{t('checkout.creditsUsed', 'Credits used')}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-black text-amber-700 dark:text-amber-400">-{getCurrencySymbol(packageData.currency)}{appliedReferralCredits.toFixed(2)}</span>
                          <Button variant="ghost" size="sm" onClick={removeCredits} className="h-6 w-6 p-0 rounded-full hover:bg-amber-200 dark:hover:bg-amber-500/20 text-amber-700 dark:text-amber-400">
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* PROMO ACTIONS - Only show if logged in */}
                  {isAuthenticated && (
                    <div className="space-y-4">
                      <Collapsible open={isPromoOpen} onOpenChange={setIsPromoOpen}>
                        <CollapsibleTrigger asChild>
                          <Button variant="ghost" className="w-full h-11 rounded-xl text-primary-second hover:text-primary-dark hover:bg-primary/5 dark:hover:bg-primary/10 text-sm font-black border-2 border-dashed border-primary/20 transition-all">{t('checkout.gotCoupon', 'Got a coupon or gift card?')}</Button>
                        </CollapsibleTrigger>
                        <CollapsibleContent className="pt-4 space-y-4 animate-in slide-in-from-top-2 duration-300">
                          {!appliedPromo && (
                            <div className="flex gap-1.5 p-1.5 bg-gray-100 dark:bg-gray-800 rounded-xl shadow-inner">
                              {['voucher', 'giftcard', 'referral'].map((type) => (
                                <button
                                  key={type}
                                  type="button"
                                  className={`flex-1 py-2 text-[10px] uppercase tracking-widest font-black rounded-lg transition-all ${promoCodeType === type
                                    ? 'bg-white dark:bg-gray-700 text-primary-second shadow-sm'
                                    : 'text-gray-500 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                                    }`}
                                  onClick={() => setPromoCodeType(type)}
                                >{t(`checkout.${type}`, type === 'giftcard' ? 'Gift Card' : type.charAt(0).toUpperCase() + type.slice(1))}</button>
                              ))}
                            </div>
                          )}

                          <div className="flex gap-3">
                            <Input
                              placeholder={`Enter ${promoCodeType} code`}
                              value={promoCode}
                              onChange={(e) => setPromoCode(e.target.value)}
                              className="h-11 text-sm rounded-xl dark:bg-gray-800 dark:border-gray-700 dark:text-white font-bold tracking-wider"
                            />
                            <Button onClick={handleApplyPromo} disabled={isValidatingPromo || !promoCode} className="h-11 px-6 rounded-xl bg-primary-second font-black shadow-lg shadow-primary/20">
                              {isValidatingPromo ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Apply'}
                            </Button>
                          </div>
                        </CollapsibleContent>
                      </Collapsible>

                      {availableCredits > 0 && !appliedReferralCredits && (
                        <div className="p-4 bg-amber-50 dark:bg-amber-500/5 rounded-2xl border-2 border-dashed border-amber-200 dark:border-amber-500/20 group hover:border-amber-400 transition-all">
                          <p className="text-xs font-black text-amber-800 dark:text-amber-400 mb-3 uppercase tracking-wider flex items-center gap-2">
                            <Coins className="w-3.5 h-3.5" />
                            Available Credits: {getCurrencySymbol(packageData.currency)}{availableCredits.toFixed(2)}
                          </p>
                          <Button size="sm" onClick={() => handleApplyCredits(availableCredits)} className="w-full h-10 bg-amber-600 hover:bg-amber-700 text-xs font-black rounded-xl shadow-lg shadow-amber-600/20 transition-all group-hover:scale-[1.02]">{t('checkout.applyReferralCredits', 'Apply Credits')}</Button>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-800">
                    <div className="flex items-center gap-3 text-xs font-bold text-gray-400 dark:text-gray-500">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>{t('checkout.guarantee', '100% SECURE & VERIFIED PURCHASE')}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
