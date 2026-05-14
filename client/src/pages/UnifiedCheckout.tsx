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
  const country = pkg.countryName || pkg.countryCode || '';

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

  // Promo states
  const [promoCode, setPromoCode] = useState('');
  const [promoCodeType, setPromoCodeType] = useState('voucher');
  const [isPromoOpen, setIsPromoOpen] = useState(true);
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [isValidatingPromo, setIsValidatingPromo] = useState(false);
  const siteName = useSettingByKey('platform_name');
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

  // useEffect(() => {
  //   apiRequest('GET', '/api/payments/gateways')
  //     .then((res) => res.json())
  //     .then((data) => {
  //       setGateways(data.data || []);
  //       if (data.data?.length === 1) setSelectedGateway(data.data[0]);
  //     });
  // }, []);



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

  console.log('packageData', packageData?.coverage);

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

      // toast({
      //   title: 'Code Applied',
      //   description: data.description || `Discount of $${data.discount.toFixed(2)} applied`,
      // });

      toast({
        title: 'Code Applied',
        description:
          data.description ||
          `Discount of ${getCurrencySymbol(packageData.currency)}${data.discount.toFixed(2)} applied`,
      });

      setPromoCode('');
      setIsPromoOpen(false);
    } catch (error) {
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

    // 🟢 CASE 1: FREE ORDER (₹0)
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

          // Customer info
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

        // ✅ Redirect to success / orders page
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

    // 🔵 CASE 2: PAID ORDER → Normal Gateway Flow
    if (!selectedGateway) {
      toast({
        title: 'Select payment method',
        description: 'Please choose a payment gateway',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);

    const payload = {
      gatewayId: selectedGateway.id,

      // 🔑 Pricing inputs (NOT amount)
      packageId: packageData.id,
      quantity,
      currency: packageData.currency,
      orderId: `ORDER_${Date.now()}`,

      // Promo
      promoCode: appliedPromo?.code || null,
      promoType: appliedPromo?.type || null,
      voucherId: appliedPromo?.voucherId || null,
      giftCardId: appliedPromo?.giftCardId || null,

      // Referral
      referralCredits: appliedReferralCredits || 0,

      // Customer info
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

        console.log(selectedGateway.provider, {
          redirectData: resData?.powertranz?.redirectData,
          spiToken: resData?.powertranz?.spiToken,
        });


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

      // ✅ Final payment completion
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
  }, []);



  const onSubmitOLD = (data) => {
    if (!selectedGateway) {
      toast({
        title: 'Select payment method',
        description: 'Please choose a payment gateway',
        variant: 'destructive',
      });
      return;
    }

    setCustomerInfo(data);

    const payload = {
      gatewayId: selectedGateway.id,

      // 🔑 Pricing inputs (NOT amount)
      packageId: packageData.id,
      quantity,
      currency: packageData.currency,
      orderId: `ORDER_${Date.now()}`,

      // Promo
      promoCode: appliedPromo?.code || null,
      promoType: appliedPromo?.type || null,
      voucherId: appliedPromo?.voucherId || null,
      giftCardId: appliedPromo?.giftCardId || null,

      // Referral
      referralCredits: appliedReferralCredits || 0,

      // Guest info
      email: data.email,
      name: data.name || 'Guest',
    };

    apiRequest('POST', '/api/payments/init', payload)
      .then((res) => res.json())
      .then((resData) => {
        if (resData.success) {
          setShowPromo(false);
          setInitResponse(resData.payment);
          toast({ title: 'Payment Initialized', description: 'You can now complete your payment' });
        } else {
          toast({
            title: 'Payment Init Failed',
            description: resData.message || 'Could not initialize payment',
            variant: 'destructive',
          });
        }
      })
      .catch((err) => {
        toast({
          title: 'Payment Init Error',
          description: err.message || 'Failed to call payment init API',
          variant: 'destructive',
        });
      });
  };

  if (isLoadingPackage) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        {/* <SiteHeader /> */}
        <div className="flex-1 flex items-center justify-center pt-20">
          <div className="text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[var(--primary)] border-r-transparent"></div>
            <p className="mt-4 text-muted-foreground">Loading...</p>
          </div>
        </div>
        {/* <SiteFooter /> */}
      </div>
    );
  }

  if (!packageData) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        {/* <SiteHeader /> */}
        <div className="flex-1 flex items-center justify-center pt-20">
          <div className="text-center">
            <p className="text-muted-foreground">Package not found</p>
            <Button onClick={() => setLocation('/')} className="mt-4">
              Go Home
            </Button>
          </div>
        </div>
        {/* <SiteFooter /> */}
      </div>
    );
  }

  const unitPrice = parseFloat(packageData.retailPrice || packageData.price || '0');

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col font-sans">
      <Helmet>
        <title>{`Checkout - ${formatDataAmount(packageData)} eSIM | ${siteName}`}</title>
      </Helmet>

      <main className="flex-1 py-8">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="flex items-center gap-2 mb-6">
            <Button variant="ghost" onClick={() => window.history.back()} className="p-0 h-auto hover:bg-transparent text-gray-600">
              <ArrowLeft className="w-4 h-4 mr-1" />
              <span className="text-base font-medium">Back to plans</span>
            </Button>
          </div>

          <div className="grid lg:grid-cols-12 gap-6 items-start">
            {/* LEFT COLUMN */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* ACCOUNT & CONTACT SECTION */}
              <Card className="border-0 shadow-sm rounded-xl overflow-hidden bg-white">
                <CardContent className="p-6">
                  {isAuthenticated ? (
                    <div className="space-y-4">
                      <h2 className="text-xl font-bold text-[#1A1A1A]">Your Account</h2>
                      <div className="flex items-center gap-3 bg-primary/5 p-3 rounded-lg border border-primary/10">
                        <div className="w-10 h-10 rounded-full bg-primary-second flex items-center justify-center text-white font-bold text-lg">
                          {user?.name?.charAt(0) || user?.email?.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-sm text-[#1A1A1A]">{user?.name || 'User'}</p>
                          <p className="text-xs text-[#4B5563]">{user?.email}</p>
                        </div>
                        <Button variant="ghost" size="sm" onClick={() => apiRequest('POST', '/api/auth/logout').then(() => refetchUser())} className="h-8 text-xs text-red-600 hover:text-red-700 hover:bg-red-50">
                          Logout
                        </Button>
                      </div>
                      <p className="text-xs text-gray-400">Your eSIM details will be sent to this email address.</p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <div>
                        <h2 className="text-xl font-bold text-[#1A1A1A] mb-4">Sign up or log in</h2>
                        <div className="flex flex-col sm:flex-row gap-3">
                          <Button 
                            variant="outline" 
                            onClick={handleGoogleLogin}
                            className="h-11 px-6 rounded-lg border-gray-200 hover:bg-gray-50 flex items-center justify-center gap-2 text-sm font-semibold"
                          >
                            <svg width="18" height="18" viewBox="0 0 24 24">
                              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                            </svg>
                            Continue with Google
                          </Button>
                        </div>
                      </div>

                      <div className="relative py-2">
                        <div className="absolute inset-0 flex items-center">
                          <span className="w-full border-t border-gray-100"></span>
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                          <span className="bg-white px-2 text-gray-400">Or continue as guest</span>
                        </div>
                      </div>

                      {!initResponse && (
                        <Form {...form}>
                          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <FormField
                              control={form.control}
                              name="email"
                              render={({ field }) => (
                                <FormItem className="space-y-1.5">
                                  <FormLabel className="text-xs font-semibold text-[#374151]">Email</FormLabel>
                                  <FormControl>
                                    <div className="relative">
                                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                      <Input
                                        {...field}
                                        type="email"
                                        placeholder="your@email.com"
                                        className="h-11 pl-10 rounded-lg border-gray-200 focus:border-primary-second"
                                      />
                                    </div>
                                  </FormControl>
                                  <FormMessage className="text-xs" />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name="phone"
                              render={({ field }) => (
                                <FormItem className="space-y-1.5">
                                  <FormLabel className="text-xs font-semibold text-[#374151]">Phone number</FormLabel>
                                  <div className="flex gap-2">
                                    <Popover open={openCountry} onOpenChange={setOpenCountry}>
                                      <PopoverTrigger asChild>
                                        <Button
                                          variant="outline"
                                          role="combobox"
                                          aria-expanded={openCountry}
                                          className="w-[100px] h-11 rounded-lg border-gray-200 justify-between px-3 font-normal"
                                        >
                                          <div className="flex items-center gap-2 overflow-hidden">
                                            <ReactCountryFlag 
                                              countryCode={countries.find((c) => c.dialCode === selectedDialCode)?.code || 'IN'} 
                                              svg 
                                            />
                                            <span className="text-sm truncate">{selectedDialCode}</span>
                                          </div>
                                          <ChevronsUpDown className="ml-1 h-3 w-3 shrink-0 opacity-50" />
                                        </Button>
                                      </PopoverTrigger>
                                      <PopoverContent className="w-[300px] p-0" align="start">
                                        <Command>
                                          <CommandInput placeholder="Search country or code..." />
                                          <CommandList>
                                            <CommandEmpty>No country found.</CommandEmpty>
                                            <CommandGroup className="max-h-[300px] overflow-auto">
                                              {countries.map((c) => (
                                                <CommandItem
                                                  key={`${c.code}-${c.dialCode}`}
                                                  value={`${c.name} ${c.dialCode} ${c.code}`}
                                                  onSelect={() => {
                                                    setSelectedDialCode(c.dialCode);
                                                    setOpenCountry(false);
                                                  }}
                                                >
                                                  <div className="flex items-center gap-3 w-full">
                                                    <ReactCountryFlag countryCode={c.code} svg />
                                                    <span className="flex-1 text-sm">{c.name}</span>
                                                    <span className="text-xs text-gray-400">{c.dialCode}</span>
                                                    <CheckIcon
                                                      className={cn(
                                                        "ml-auto h-4 w-4",
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
                                      <div className="relative flex-1">
                                        <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        <Input
                                          {...field}
                                          type="tel"
                                          inputMode="numeric"
                                          placeholder="000 000 000"
                                          className="h-11 pl-10 rounded-lg border-gray-200"
                                          onChange={(e) => {
                                            const value = e.target.value.replace(/\D/g, '');
                                            field.onChange(value);
                                          }}
                                        />
                                      </div>
                                    </FormControl>
                                  </div>
                                  <FormMessage className="text-xs" />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name="acceptTerms"
                              render={({ field }) => (
                                <FormItem className="flex flex-row items-start space-x-2 space-y-0 pt-1">
                                  <FormControl>
                                    <Checkbox checked={field.value} onCheckedChange={field.onChange} className="mt-0.5 w-4 h-4 border-gray-300 data-[state=checked]:bg-primary-second" />
                                  </FormControl>
                                  <div className="leading-tight">
                                    <FormLabel className="text-xs font-normal text-[#4B5563] cursor-pointer">
                                      I agree to the{' '}
                                      <Link href="/terms-and-condition" className="text-primary-second font-medium hover:underline">
                                        Terms of Service
                                      </Link>{' '}
                                      and{' '}
                                      <Link href="/privacy-policy" className="text-primary-second font-medium hover:underline">
                                        Privacy Policy
                                      </Link>
                                    </FormLabel>
                                    <FormMessage className="text-xs" />
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
              <Card className="border-0 shadow-sm rounded-xl bg-white overflow-hidden">
                <CardContent className="p-6">
                  <h2 className="text-xl font-bold text-[#1A1A1A] mb-4">Select a payment method</h2>
                  
                  {!initResponse ? (
                    <div className="space-y-4">
                      {gateways.length > 0 ? (
                        <div className="space-y-2.5">
                          {gateways.map((gateway) => {
                            const isSelected = selectedGateway?.id === gateway.id;
                            const providerName = gateway.provider.toLowerCase();
                            
                            return (
                              <div
                                key={gateway.id}
                                onClick={() => setSelectedGateway(gateway)}
                                className={`
                                  group relative p-4 rounded-lg border transition-all duration-200
                                  flex items-center justify-between
                                  ${isSelected
                                    ? 'border-primary-second bg-[#F0FDF4]'
                                    : 'border-gray-100 hover:border-gray-200 bg-white'}
                                `}
                              >
                                <div className="flex items-center gap-3">
                                  <div className={`w-9 h-9 rounded-full flex items-center justify-center ${isSelected ? 'bg-primary-second/10 text-primary-second' : 'bg-gray-50 text-gray-400'}`}>
                                    {providerName.includes('card') || providerName.includes('stripe') || providerName.includes('powertranz') ? (
                                      <CreditCard className="w-4.5 h-4.5" />
                                    ) : providerName.includes('paypal') ? (
                                      <Wallet className="w-4.5 h-4.5" />
                                    ) : (
                                      <CircleDollarSign className="w-4.5 h-4.5" />
                                    )}
                                  </div>
                                  <div>
                                    <p className={`font-semibold text-sm ${isSelected ? 'text-primary-second' : 'text-[#1A1A1A]'}`}>
                                      {providerName.includes('stripe') || providerName.includes('powertranz') ? 'Credit or debit card' : 
                                       providerName.includes('paypal') ? 'PayPal' : 
                                       providerName.includes('google') ? 'Google Pay' : gateway.provider.toUpperCase()}
                                    </p>
                                    {providerName.includes('card') && (
                                      <div className="flex gap-1 mt-0.5">
                                        <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" className="h-2.5 opacity-60" alt="Visa" />
                                        <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" className="h-2.5 opacity-60" alt="Mastercard" />
                                      </div>
                                    )}
                                  </div>
                                </div>
                                <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${isSelected ? 'border-primary-second bg-primary-second' : 'border-gray-200'}`}>
                                  {isSelected && <Check className="w-3 h-3 text-white" />}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="p-6 text-center border border-dashed border-gray-100 rounded-lg">
                          <p className="text-sm text-gray-400">No payment methods available for this currency.</p>
                        </div>
                      )}

                      {/* POWERTRANZ CARD FORM */}
                      {selectedGateway?.provider === 'powertranz' && (
                        <div className="mt-4 p-4 bg-gray-50 rounded-xl space-y-3 border border-gray-100">
                          <h4 className="text-sm font-semibold text-[#1A1A1A] flex items-center gap-2">
                            <CreditCard className="w-4 h-4 text-gray-400" />
                            Card Details
                          </h4>
                          <Input
                            placeholder="Card Number"
                            className="h-10 text-sm rounded-md border-gray-200"
                            onChange={(e) => setCustomerInfo(prev => ({ ...prev, cardPan: e.target.value.replace(/\D/g, '') }))}
                          />
                          <div className="grid grid-cols-2 gap-3">
                            <Input
                              placeholder="MM/YY"
                              className="h-10 text-sm rounded-md border-gray-200"
                              onChange={(e) => setCustomerInfo(prev => ({ ...prev, cardExpiry: e.target.value.replace(/\D/g, '') }))}
                            />
                            <Input
                              placeholder="CVV"
                              className="h-10 text-sm rounded-md border-gray-200"
                              onChange={(e) => setCustomerInfo(prev => ({ ...prev, cardCvv: e.target.value.replace(/\D/g, '') }))}
                            />
                          </div>
                        </div>
                      )}

                      <Button 
                        disabled={isSubmitting || !selectedGateway} 
                        onClick={() => isAuthenticated ? onSubmit({ email: user?.email, acceptTerms: true }) : form.handleSubmit(onSubmit)()}
                        className="w-full h-12 mt-2 bg-primary-second hover:bg-[#1a4a22] text-white text-base font-bold rounded-lg transition-all"
                      >
                        {isSubmitting ? (
                          <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Processing...</>
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

              <div className="flex items-center gap-4 justify-center py-2">
                <div className="flex items-center gap-1.5 text-xs text-gray-400">
                  <Shield className="w-3.5 h-3.5" />
                  <span>Secure Checkout</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-gray-400">
                  <Lock className="w-3.5 h-3.5" />
                  <span>Encrypted</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-gray-400">
                  <Zap className="w-3.5 h-3.5" />
                  <span>Instant Delivery</span>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN - ORDER SUMMARY */}
            <div className="lg:col-span-5">
              <Card className="border-0 shadow-sm rounded-xl bg-white sticky top-8">
                <CardContent className="p-6">
                  <h2 className="text-xl font-bold text-[#1A1A1A] mb-6">Order summary</h2>

                  <div className="bg-[#F8F9FA] rounded-xl p-3.5 flex items-center gap-3 mb-6">
                    {packageData.countryCode && (
                      <div className="w-10 h-7 rounded overflow-hidden shadow-sm flex-shrink-0">
                        <ReactCountryFlag
                          countryCode={packageData.countryCode}
                          svg
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      </div>
                    )}
                    <span className="text-lg font-bold text-[#1A1A1A]">
                      {packageData.countryName || packageData.countryCode || 'Global'}
                    </span>
                  </div>

                  <div className="space-y-4 pb-6 border-b border-gray-100">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-[#6B7280]">Plan</span>
                      <span className="font-bold text-[#1A1A1A]">{formatDataAmount(packageData)}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-[#6B7280]">Type</span>
                      <span className="font-bold text-[#1A1A1A]">Data only</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-[#6B7280]">Duration</span>
                      <span className="font-bold text-[#1A1A1A]">{packageData.validity} days</span>
                    </div>
                  </div>

                  {/* PRICE & PROMOS */}
                  <div className="py-6 space-y-3.5">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-[#1A1A1A]">Total</span>
                      <span className="text-2xl font-black text-[#1A1A1A]">
                        {getCurrencySymbol(packageData.currency)}{calculateTotal()}
                      </span>
                    </div>

                    {appliedPromo && (
                      <div className="flex justify-between items-center bg-green-50 p-2.5 rounded-lg border border-green-100">
                        <div className="flex items-center gap-2">
                          <Tag className="w-3.5 h-3.5 text-green-600" />
                          <span className="text-xs font-semibold text-green-700">{appliedPromo.code} applied</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-green-700">-{getCurrencySymbol(packageData.currency)}{appliedPromo.discount.toFixed(2)}</span>
                          <Button variant="ghost" size="sm" onClick={removePromo} className="h-5 w-5 p-0 rounded-full hover:bg-green-100 text-green-700">
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    )}

                    {appliedReferralCredits > 0 && (
                      <div className="flex justify-between items-center bg-amber-50 p-2.5 rounded-lg border border-amber-100">
                        <div className="flex items-center gap-2">
                          <Coins className="w-3.5 h-3.5 text-amber-600" />
                          <span className="text-xs font-semibold text-amber-700">Credits used</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-amber-700">-{getCurrencySymbol(packageData.currency)}{appliedReferralCredits.toFixed(2)}</span>
                          <Button variant="ghost" size="sm" onClick={removeCredits} className="h-5 w-5 p-0 rounded-full hover:bg-amber-100 text-amber-700">
                            <X className="h-3 w-3" />
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
                          <Button variant="ghost" className="w-full h-10 rounded-lg text-primary-second hover:text-[#1a4a22] hover:bg-green-50 text-sm font-bold border border-green-100">
                            Got a coupon?
                          </Button>
                        </CollapsibleTrigger>
                        <CollapsibleContent className="pt-3 space-y-3 animate-in slide-in-from-top-2 duration-200">
                          {/* Restore Promo Type Selection */}
                          {!appliedPromo && (
                            <div className="flex gap-1 p-1 bg-gray-100 rounded-lg">
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className={`flex-1 h-8 text-[10px] uppercase tracking-wider font-bold transition-all ${
                                  promoCodeType === 'voucher' 
                                    ? 'bg-primary-second text-white shadow-sm hover:bg-primary-second hover:text-white' 
                                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200'
                                }`}
                                onClick={() => setPromoCodeType('voucher')}
                              >
                                Voucher
                              </Button>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className={`flex-1 h-8 text-[10px] uppercase tracking-wider font-bold transition-all ${
                                  promoCodeType === 'giftcard' 
                                    ? 'bg-primary-second text-white shadow-sm hover:bg-primary-second hover:text-white' 
                                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200'
                                }`}
                                onClick={() => setPromoCodeType('giftcard')}
                              >
                                Gift Card
                              </Button>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className={`flex-1 h-8 text-[10px] uppercase tracking-wider font-bold transition-all ${
                                  promoCodeType === 'referral' 
                                    ? 'bg-primary-second text-white shadow-sm hover:bg-primary-second hover:text-white' 
                                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200'
                                }`}
                                onClick={() => setPromoCodeType('referral')}
                              >
                                Referral
                              </Button>
                            </div>
                          )}

                          <div className="flex gap-2">
                            <Input 
                              placeholder={`Enter ${promoCodeType} code`} 
                              value={promoCode} 
                              onChange={(e) => setPromoCode(e.target.value)}
                              className="h-10 text-sm rounded-lg"
                            />
                            <Button onClick={handleApplyPromo} disabled={isValidatingPromo || !promoCode} className="h-10 px-4 rounded-lg bg-primary-second">
                              {isValidatingPromo ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Apply'}
                            </Button>
                          </div>
                        </CollapsibleContent>
                      </Collapsible>

                      {availableCredits > 0 && !appliedReferralCredits && (
                        <div className="p-3 bg-amber-50 rounded-lg border border-amber-100">
                          <p className="text-xs font-semibold text-amber-800 mb-2">Available Credits: ${availableCredits.toFixed(2)}</p>
                          <Button size="sm" onClick={() => handleApplyCredits(availableCredits)} className="w-full h-8 bg-amber-600 hover:bg-amber-700 text-xs font-bold rounded-md">
                            Apply Referral Credits
                          </Button>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
