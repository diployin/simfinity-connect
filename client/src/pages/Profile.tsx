import { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Helmet } from 'react-helmet-async';
import { Link } from 'wouter';
import { Globe, User, Phone, MapPin, Mail, Shield, Bell, AlertCircle, Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { ThemeToggle } from '@/components/ThemeToggle';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useTranslation } from '@/contexts/TranslationContext';
import { useCurrency } from '@/contexts/CurrencyContext';
import { Select, SelectContent, SelectTrigger, SelectValue, SelectItem } from '@/components/ui/select';
import ReactCountryFlag from 'react-country-flag';

import {
  Command,
  CommandInput,
  CommandItem,
  CommandList,
  CommandEmpty,
} from '@/components/ui/command';

import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface UserProfile {
  id: string;
  email: string;
  name?: string;
  phone?: string;
  address?: string;
  destination?: string;
  currency?: string;
  kycStatus: string;
  kycRejectionReason?: string;
  notifyLowData: boolean;
  notifyExpiring: boolean;
  imagePath?: string;
}

const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().optional().or(z.literal('')),
  address: z.string().optional().or(z.literal('')),
  destination: z.string().optional(),
  currency: z.string().optional(),
});

const countryCallingCodes = [
  { code: '+1', country: 'US/CA', flag: 'US' },
  { code: '+91', country: 'IN', flag: 'IN' },
  { code: '+44', country: 'GB', flag: 'GB' },
  { code: '+61', country: 'AU', flag: 'AU' },
  { code: '+81', country: 'JP', flag: 'JP' },
  { code: '+49', country: 'DE', flag: 'DE' },
  { code: '+33', country: 'FR', flag: 'FR' },
  { code: '+39', country: 'IT', flag: 'IT' },
  { code: '+34', country: 'ES', flag: 'ES' },
  { code: '+7', country: 'RU', flag: 'RU' },
  { code: '+86', country: 'CN', flag: 'CN' },
  { code: '+55', country: 'BR', flag: 'BR' },
  { code: '+52', country: 'MX', flag: 'MX' },
  { code: '+27', country: 'ZA', flag: 'ZA' },
  { code: '+65', country: 'SG', flag: 'SG' },
  { code: '+971', country: 'AE', flag: 'AE' },
  { code: '+966', country: 'SA', flag: 'SA' },
  { code: '+82', country: 'KR', flag: 'KR' },
  { code: '+31', country: 'NL', flag: 'NL' },
  { code: '+41', country: 'CH', flag: 'CH' },
  { code: '+32', country: 'BE', flag: 'BE' },
  { code: '+46', country: 'SE', flag: 'SE' },
  { code: '+47', country: 'NO', flag: 'NO' },
  { code: '+353', country: 'IE', flag: 'IE' },
  { code: '+64', country: 'NZ', flag: 'NZ' },
  { code: '+60', country: 'MY', flag: 'MY' },
  { code: '+66', country: 'TH', flag: 'TH' },
  { code: '+62', country: 'ID', flag: 'ID' },
  { code: '+63', country: 'PH', flag: 'PH' },
  { code: '+84', country: 'VN', flag: 'VN' },
  { code: '+90', country: 'TR', flag: 'TR' },
  { code: '+92', country: 'PK', flag: 'PK' },
  { code: '+880', country: 'BD', flag: 'BD' },
  { code: '+351', country: 'PT', flag: 'PT' },
  { code: '+30', country: 'GR', flag: 'GR' },
  { code: '+43', country: 'AT', flag: 'AT' },
  { code: '+45', country: 'DK', flag: 'DK' },
  { code: '+358', country: 'FI', flag: 'FI' },
  { code: '+48', country: 'PL', flag: 'PL' },
  { code: '+40', country: 'RO', flag: 'RO' },
  { code: '+380', country: 'UA', flag: 'UA' },
  { code: '+36', country: 'HU', flag: 'HU' },
  { code: '+420', country: 'CZ', flag: 'CZ' },
  { code: '+94', country: 'LK', flag: 'LK' },
  { code: '+977', country: 'NP', flag: 'NP' },
  { code: '+20', country: 'EG', flag: 'EG' },
  { code: '+234', country: 'NG', flag: 'NG' },
  { code: '+254', country: 'KE', flag: 'KE' },
  { code: '+212', country: 'MA', flag: 'MA' },
  { code: '+54', country: 'AR', flag: 'AR' },
  { code: '+56', country: 'CL', flag: 'CL' },
  { code: '+57', country: 'CO', flag: 'CO' },
  { code: '+51', country: 'PE', flag: 'PE' },
  { code: '+58', country: 'VE', flag: 'VE' },
];

type ProfileFormData = z.infer<typeof profileSchema>;

export default function Profile() {
  const { toast } = useToast();
  const { t } = useTranslation();
  const [notifyLowData, setNotifyLowData] = useState(true);
  const [notifyExpiring, setNotifyExpiring] = useState(true);
  const [countryOpen, setCountryOpen] = useState(false);
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const { currencies } = useCurrency();

  const { data: user, isLoading } = useQuery<UserProfile>({
    queryKey: ['/api/customer/profile'],
  });

  const { data: destinations, isLoading: loadingDest } = useQuery({
    queryKey: ['/api/destinations'],
  });

  // console.log(destinations, currencies, loadingDest);

  const [selectedCountryCode, setSelectedCountryCode] = useState('+1');
  const [phoneNumberVal, setPhoneNumberVal] = useState('');

  // Update notification preferences and parse phone number when user data is loaded
  useEffect(() => {
    if (user) {
      setNotifyLowData(user.notifyLowData);
      setNotifyExpiring(user.notifyExpiring);

      if (user.phone) {
        const sortedCodes = [...countryCallingCodes].sort((a, b) => b.code.length - a.code.length);
        const matched = sortedCodes.find((c) => user.phone?.startsWith(c.code));
        if (matched) {
          setSelectedCountryCode(matched.code);
          setPhoneNumberVal(user.phone.slice(matched.code.length));
        } else {
          if (user.phone.startsWith('+')) {
            const spaceIndex = user.phone.indexOf(' ');
            if (spaceIndex !== -1) {
              setSelectedCountryCode(user.phone.slice(0, spaceIndex));
              setPhoneNumberVal(user.phone.slice(spaceIndex + 1));
            } else {
              setSelectedCountryCode('+1');
              setPhoneNumberVal(user.phone);
            }
          } else {
            setSelectedCountryCode('+1');
            setPhoneNumberVal(user.phone);
          }
        }
      } else {
        setSelectedCountryCode('+1');
        setPhoneNumberVal('');
      }
    }
  }, [user]);

  // Sync phone code/val to form state
  useEffect(() => {
    if (phoneNumberVal) {
      form.setValue('phone', selectedCountryCode + phoneNumberVal);
    } else {
      form.setValue('phone', '');
    }
  }, [selectedCountryCode, phoneNumberVal]);

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    values: {
      name: user?.name || '',
      phone: user?.phone || '',
      address: user?.address || '',
      destination: user?.destination || '',
      currency: user?.currency || '',
    },
  });

  const updateProfileMutation = useMutation({
    mutationFn: async (data: ProfileFormData) => {
      const formData = new FormData();

      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, value);
        }
      });

      if (profileImage) {
        formData.append('profileImage', profileImage);
      }

      return await apiRequest('PUT', '/api/customer/profile', formData);
    },
    onSuccess: () => {
      setProfileImage(null);
      setPreview(null);
      queryClient.invalidateQueries({ queryKey: ['/api/customer/profile'] });
      toast({
        title: t('profile.profileUpdated', 'Profile Updated'),
        description: t(
          'profile.profileUpdatedDesc',
          'Your profile information has been saved successfully.',
        ),
      });
    },
  });

  const onSubmit = (data: ProfileFormData) => {
    updateProfileMutation.mutate(data);
  };

  useEffect(() => {
    if (!profileImage) return;
    const objectUrl = URL.createObjectURL(profileImage);
    setPreview(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [profileImage]);

  const updateNotificationsMutation = useMutation({
    mutationFn: async (data: { notifyLowData: boolean; notifyExpiring: boolean }) => {
      return await apiRequest('PATCH', '/api/customer/notification-preferences', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/customer/profile'] });
      toast({
        title: t('profile.preferencesUpdated', 'Preferences Updated'),
        description: t(
          'profile.preferencesUpdatedDesc',
          'Your notification preferences have been saved successfully.',
        ),
      });
    },
    onError: (error: any) => {
      toast({
        title: t('profile.updateFailed', 'Update Failed'),
        description:
          error.message ||
          t('profile.notificationUpdateFailed', 'Failed to update notification preferences'),
        variant: 'destructive',
      });
    },
  });

  const handleNotificationChange = async (
    field: 'notifyLowData' | 'notifyExpiring',
    value: boolean,
  ) => {
    if (field === 'notifyLowData') {
      setNotifyLowData(value);
      await updateNotificationsMutation.mutateAsync({ notifyLowData: value, notifyExpiring });
    } else {
      setNotifyExpiring(value);
      await updateNotificationsMutation.mutateAsync({ notifyLowData, notifyExpiring: value });
    }
  };

  const getKycStatusBadge = (status: string | undefined) => {
    console.log('KYC Status:', status);
    const variants = {
      pending: {
        variant: 'outline' as const,
        label: t('profile.kycPending', 'Pending'),
        className: 'bg-orange-500/10 text-orange-600 border-orange-500/20',
      },
      submitted: {
        variant: 'outline' as const,
        label: t('profile.kycSubmitted', 'Submitted'),
        className: '',
      },
      approved: {
        variant: 'default' as const,
        label: t('profile.kycApproved', 'Approved'),
        className: '',
      },
      verified: {
        variant: 'default' as const,
        label: t('profile.kycVerified', 'Verified'),
        className: '',
      },
      rejected: {
        variant: 'destructive' as const,
        label: t('profile.kycRejected', 'Rejected'),
        className: '',
      },
    };
    return variants[(status || 'pending') as keyof typeof variants] || variants.pending;
  };

  const getFlagEmoji = (code: string) =>
    code.toUpperCase().replace(/./g, (char) => String.fromCodePoint(127397 + char.charCodeAt(0)));

  return (
    <div className="flex-1 min-h-screen bg-background dark:bg-gray-950 transition-colors duration-300">
      <Helmet>
        <title>My Profile | eSIM Global</title>
        <meta name="description" content="Manage your profile information and account settings" />
      </Helmet>

      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2 text-foreground dark:text-white">
          {t('profile.title', 'My Profile')}
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground dark:text-gray-400">
          {t('profile.description', 'Manage your account information and settings')}
        </p>
      </div>

      {isLoading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
        </div>
      ) : (
        <div className="grid gap-6 pb-12">
          {/* Account Overview */}
          <Card className="dark:bg-gray-900 dark:border-gray-800">
            <CardHeader>
              <CardTitle className="dark:text-white">{t('profile.accountOverview', 'Account Overview')}</CardTitle>
              <CardDescription className="dark:text-gray-400">
                {t(
                  'profile.accountOverviewDesc',
                  'Your account status and verification information',
                )}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4 min-w-0">
                <div className="relative w-20 h-20 flex-shrink-0">
                  {/* Avatar */}
                  <label htmlFor="profileImage" className="cursor-pointer">
                    <div className="w-20 h-20 rounded-full overflow-hidden border dark:border-gray-800 bg-muted dark:bg-gray-800 flex items-center justify-center shadow-inner">
                      {preview || (user?.imagePath && user.imagePath !== 'null') ? (
                        <img
                          src={preview || (user.imagePath.startsWith('http') ? user.imagePath : `/${user.imagePath}`)}
                          className="w-full h-full object-cover"
                          alt="Profile"
                        />
                      ) : (
                        <User className="h-8 w-8 text-muted-foreground dark:text-gray-500" />
                      )}
                    </div>

                    {/* Camera Icon Overlay */}
                    <div className="absolute bottom-0 right-0 bg-[var(--primary)] hover:bg-primary-second text-white rounded-full p-1.5 shadow-lg cursor-pointer transition-transform hover:scale-110 active:scale-95">
                      <Camera className="h-4 w-4" />
                    </div>
                  </label>

                  {/* Hidden input */}
                  <input
                    id="profileImage"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => setProfileImage(e.target.files?.[0] || null)}
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="font-bold text-lg truncate dark:text-white">
                    {user?.name || t('profile.noNameSet', 'No name set')}
                  </div>
                  <div className="text-sm text-muted-foreground dark:text-gray-400 flex items-center gap-2 min-w-0">
                    <Mail className="h-4 w-4 flex-shrink-0 text-primary-second dark:text-primary-light" />
                    <span className="truncate">{user?.email}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border dark:border-gray-800 bg-slate-50/50 dark:bg-gray-950/50 gap-4">
                <div className="flex items-start gap-3">
                  <Shield className="h-5 w-5 text-primary-second dark:text-primary-light flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold dark:text-white">
                      {t('profile.kycVerification', 'KYC Verification')}
                    </div>
                    <div className="text-sm text-muted-foreground dark:text-gray-400">
                      {t('profile.kycVerificationDesc', 'Identity verification status')}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
                  <Badge
                    variant={getKycStatusBadge(user?.kycStatus).variant}
                    className={cn("flex-shrink-0 shadow-sm font-semibold", getKycStatusBadge(user?.kycStatus).className)}
                    data-testid="badge-kyc-status"
                  >
                    {getKycStatusBadge(user?.kycStatus).label}
                  </Badge>
                  {user?.kycStatus !== 'approved' && (
                    <Link href="/account/kyc">
                      <Button variant="outline" size="sm" data-testid="button-verify-kyc" className="flex-shrink-0 dark:border-gray-700 dark:hover:bg-gray-800 dark:text-gray-300">
                        {user?.kycStatus === 'pending'
                          ? t('profile.submitKYC', 'Submit KYC')
                          : t('profile.viewStatus', 'View Status')}
                      </Button>
                    </Link>
                  )}
                </div>
              </div>

              {user?.kycStatus === 'rejected' && user?.kycRejectionReason && (
                <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20 dark:bg-red-950/20 dark:border-red-900/30">
                  <div className="font-bold text-destructive dark:text-red-400 mb-1 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    {t('profile.kycRejectionReason', 'KYC Rejection Reason')}
                  </div>
                  <div className="text-sm text-destructive/90 dark:text-red-300/80 leading-relaxed font-medium">{user.kycRejectionReason}</div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Profile Information Form */}
          <Card className="dark:bg-gray-900 dark:border-gray-800">
            <CardHeader>
              <CardTitle className="dark:text-white">{t('profile.profileInfo', 'Profile Information')}</CardTitle>
              <CardDescription className="dark:text-gray-400">
                {t('profile.profileInfoDesc', 'Update your personal details')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="dark:text-gray-300 font-semibold">{t('profile.fullName', 'Full Name')}</FormLabel>
                        <FormControl>
                          <Input
                            placeholder={t('profile.namePlaceholder', 'John Doe')}
                            {...field}
                            data-testid="input-name"
                            className="dark:bg-gray-950 dark:border-gray-800 dark:text-white dark:placeholder:text-gray-600"
                          />
                        </FormControl>
                        <FormMessage className="dark:text-red-400" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="dark:text-gray-300 font-semibold">{t('profile.phoneNumber', 'Phone Number')}</FormLabel>
                        <FormControl>
                          <div className="flex gap-2">
                            <Select
                              value={selectedCountryCode}
                              onValueChange={setSelectedCountryCode}
                            >
                              <SelectTrigger className="w-[120px] flex-shrink-0 dark:bg-gray-950 dark:border-gray-800 dark:text-white">
                                <SelectValue placeholder="Code" />
                              </SelectTrigger>
                              <SelectContent className="dark:bg-gray-900 dark:border-gray-800">
                                {countryCallingCodes.map((c) => (
                                  <SelectItem key={`${c.code}-${c.flag}`} value={c.code} className="dark:text-gray-300 dark:focus:bg-gray-800">
                                    <span className="flex items-center gap-2">
                                      <ReactCountryFlag
                                        svg
                                        countryCode={c.flag}
                                        style={{ width: '1.2em', height: '1.2em' }}
                                      />
                                      <span>{c.code}</span>
                                    </span>
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <div className="relative flex-1">
                              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground dark:text-gray-500" />
                              <Input
                                placeholder={t('profile.phonePlaceholder', '+1 234 567 8900')}
                                className="pl-10 dark:bg-gray-950 dark:border-gray-800 dark:text-white dark:placeholder:text-gray-600"
                                value={phoneNumberVal}
                                type="tel"
                                inputMode="numeric"
                                onChange={(e) => {
                                  const value = e.target.value.replace(/\D/g, '');
                                  setPhoneNumberVal(value);
                                }}
                                data-testid="input-phone"
                              />
                            </div>
                          </div>
                        </FormControl>
                        <FormMessage className="dark:text-red-400" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="dark:text-gray-300 font-semibold">{t('profile.address', 'Address')}</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground dark:text-gray-500" />
                            <Textarea
                              placeholder={t(
                                'profile.addressPlaceholder',
                                '123 Main St, City, Country',
                              )}
                              className="pl-10 min-h-20 dark:bg-gray-950 dark:border-gray-800 dark:text-white dark:placeholder:text-gray-600"
                              {...field}
                              data-testid="input-address"
                            />
                          </div>
                        </FormControl>
                        <FormMessage className="dark:text-red-400" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="destination"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="dark:text-gray-300 font-semibold">{t('profile.country', 'Country')}</FormLabel>

                        <Popover open={countryOpen} onOpenChange={setCountryOpen}>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              role="combobox"
                              className="w-full justify-between dark:bg-gray-950 dark:border-gray-800 dark:text-white dark:hover:bg-gray-900"
                            >
                              {field.value
                                ? destinations?.find((d: any) => d.id === field.value)?.name
                                : t('profile.selectCountry', 'Select country')}
                              <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50 text-muted-foreground" />
                            </Button>
                          </PopoverTrigger>

                          <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0 dark:bg-gray-900 dark:border-gray-800">
                            <Command className="dark:bg-gray-900">
                              <CommandInput placeholder="Search country..." className="dark:text-white" />
                              <CommandEmpty className="dark:text-gray-400">{t('profile.noCountryFound', 'No country found.')}</CommandEmpty>
                              <CommandList className="dark:bg-gray-900">
                                {destinations?.map((country: any) => (
                                  <CommandItem
                                    key={country.id}
                                    value={country.name}
                                    className="dark:text-gray-300 dark:aria-selected:bg-gray-800"
                                    onSelect={() => {
                                      field.onChange(country.id);
                                      setCountryOpen(false); // ✅ auto close
                                    }}
                                  >
                                    <Check
                                      className={cn(
                                        'mr-2 h-4 w-4',
                                        field.value === country.id ? 'opacity-100 text-primary' : 'opacity-0',
                                      )}
                                    />
                                    <ReactCountryFlag
                                      svg
                                      countryCode={country.countryCode}
                                      style={{ width: '1.25em', height: '1.25em' }}
                                      className="mr-2"
                                    />
                                    {country.name}
                                  </CommandItem>
                                ))}
                              </CommandList>
                            </Command>
                          </PopoverContent>
                        </Popover>

                        <FormMessage className="dark:text-red-400" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="currency"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="dark:text-gray-300 font-semibold">{t('profile.currency', 'Currency')}</FormLabel>

                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              role="combobox"
                              className="w-full justify-between dark:bg-gray-950 dark:border-gray-800 dark:text-white dark:hover:bg-gray-900"
                            >
                              {field.value
                                ? currencies?.find((c: any) => c.id === field.value)?.code
                                : t('profile.selectCurrency', 'Select currency')}
                              <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50 text-muted-foreground" />
                            </Button>
                          </PopoverTrigger>

                          <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0 dark:bg-gray-900 dark:border-gray-800">
                            <Command className="dark:bg-gray-900">
                              <CommandInput placeholder="Search currency..." className="dark:text-white" />
                              <CommandEmpty className="dark:text-gray-400">{t('profile.noCurrencyFound', 'No currency found.')}</CommandEmpty>
                              <CommandList className="dark:bg-gray-900">
                                {currencies?.map((currency: any) => (
                                  <CommandItem
                                    key={currency.id}
                                    value={currency.code}
                                    className="dark:text-gray-300 dark:aria-selected:bg-gray-800"
                                    onSelect={() => field.onChange(currency.id)}
                                  >
                                    <Check
                                      className={cn(
                                        'mr-2 h-4 w-4',
                                        field.value === currency.id ? 'opacity-100 text-primary' : 'opacity-0',
                                      )}
                                    />
                                    {currency.symbol} {currency.code} — {currency.name}
                                  </CommandItem>
                                ))}
                              </CommandList>
                            </Command>
                          </PopoverContent>
                        </Popover>

                        <FormMessage className="dark:text-red-400" />
                      </FormItem>
                    )}
                  />

                  <div className="flex gap-3 pt-2">
                    <Button
                      type="submit"
                      disabled={updateProfileMutation.isPending}
                      className="bg-[var(--primary)] hover:bg-primary-second text-white font-bold px-8 shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
                      data-testid="button-save-profile"
                    >
                      {updateProfileMutation.isPending
                        ? t('profile.saving', 'Saving...')
                        : t('profile.saveChanges', 'Save Changes')}
                    </Button>
                    <Link href="/my-orders">
                      <Button type="button" variant="outline" data-testid="button-cancel" className="dark:border-gray-700 dark:hover:bg-gray-800 dark:text-gray-300">
                        {t('common.cancel', 'Cancel')}
                      </Button>
                    </Link>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>

          {/* Notification Preferences */}
          <Card className="dark:bg-gray-900 dark:border-gray-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 dark:text-white">
                <Bell className="h-5 w-5 text-primary-second dark:text-primary-light" />
                {t('profile.notificationPreferences', 'Notification Preferences')}
              </CardTitle>
              <CardDescription className="dark:text-gray-400">
                {t(
                  'profile.notificationPreferencesDesc',
                  'Manage how you receive alerts about your eSIMs',
                )}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">

              {/* Low Data Alerts */}
              <div className="flex items-center justify-between p-4 rounded-xl border dark:border-gray-800 bg-slate-50/50 dark:bg-gray-950/50 transition-colors gap-4">
                <div className="flex-1 min-w-0 pr-2">
                  <Label htmlFor="notify-low-data" className="font-bold dark:text-white cursor-pointer block mb-1">
                    {t('profile.lowDataAlerts', 'Low Data Alerts')}
                  </Label>
                  <p className="text-sm text-muted-foreground dark:text-gray-400 leading-relaxed">
                    {t(
                      'profile.lowDataAlertsDesc',
                      'Receive email notifications when your eSIM reaches 75% or 90% data usage',
                    )}
                  </p>
                </div>

                {/* FORCE ALIGNMENT WRAPPER */}
                <div className="flex-shrink-0 flex items-center justify-center">
                  <Switch
                    id="notify-low-data"
                    checked={notifyLowData}
                    onCheckedChange={(value) => handleNotificationChange('notifyLowData', value)}
                    disabled={updateNotificationsMutation.isPending}
                    data-testid="switch-notify-low-data"
                    /* CRITICAL FIXES ADDED BELOW:
                      - p-0 / border-0: Wipes out global button overrides
                      - box-content: Stabilizes dimension engine calculations
                      - [&_span]: Forces the nested inner circle thumb to stay centered
                    */
                    className="p-0 border-0 box-content relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input [&_span]:block [&_span]:h-5 [&_span]:w-5 [&_span]:rounded-full [&_span]:bg-white [&_span]:shadow-lg [&_span]:ring-0 [&_span]:transition-transform data-[state=checked]:[&_span]:translate-x-5 data-[state=unchecked]:[&_span]:translate-x-0.5"
                  />
                </div>
              </div>

              {/* Expiry Alerts */}
              <div className="flex items-center justify-between p-4 rounded-xl border dark:border-gray-800 bg-slate-50/50 dark:bg-gray-950/50 transition-colors gap-4">
                <div className="flex-1 min-w-0 pr-2">
                  <Label htmlFor="notify-expiring" className="font-bold dark:text-white cursor-pointer block mb-1">
                    {t('profile.expiryAlerts', 'Expiry Alerts')}
                  </Label>
                  <p className="text-sm text-muted-foreground dark:text-gray-400 leading-relaxed">
                    {t(
                      'profile.expiryAlertsDesc',
                      'Get notified when your eSIM is about to expire (3 days and 1 day before expiration)',
                    )}
                  </p>
                </div>

                {/* FORCE ALIGNMENT WRAPPER */}
                <div className="flex-shrink-0 flex items-center justify-center">
                  <Switch
                    id="notify-expiring"
                    checked={notifyExpiring}
                    onCheckedChange={(value) => handleNotificationChange('notifyExpiring', value)}
                    disabled={updateNotificationsMutation.isPending}
                    data-testid="switch-notify-expiring"
                    className="p-0 border-0 box-content relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input [&_span]:block [&_span]:h-5 [&_span]:w-5 [&_span]:rounded-full [&_span]:bg-white [&_span]:shadow-lg [&_span]:ring-0 [&_span]:transition-transform data-[state=checked]:[&_span]:translate-x-5 data-[state=unchecked]:[&_span]:translate-x-0.5"
                  />
                </div>
              </div>

              {/* Info Box */}
              <div className="flex gap-3 p-4 rounded-xl bg-primary/5 dark:bg-primary/10 border border-primary/10 dark:border-primary/20">
                <AlertCircle className="h-5 w-5 text-primary-second dark:text-primary-light flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground dark:text-gray-300 leading-relaxed font-medium">
                    {t(
                      'profile.notificationInfo',
                      'These notifications help you manage your data usage and avoid service interruptions. You can change these preferences at any time.',
                    )}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="dark:bg-gray-900 dark:border-gray-800 shadow-lg">
            <CardHeader>
              <CardTitle className="dark:text-white">{t('profile.quickActions', 'Quick Actions')}</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3">
              <Link href="/account/orders">
                <Button
                  variant="outline"
                  className="w-full justify-start h-12 font-bold dark:border-gray-700 dark:hover:bg-gray-800 dark:text-gray-200 transition-all hover:pl-5"
                  data-testid="link-orders"
                >
                  <User className="h-4 w-4 mr-2 text-primary-second dark:text-primary-light" />
                  {t('profile.viewMyOrders', 'View My Orders')}
                </Button>
              </Link>
              <a target="_blank" rel="noopener noreferrer" href="/account/support">
                <Button
                  variant="outline"
                  className="w-full justify-start h-12 font-bold dark:border-gray-700 dark:hover:bg-gray-800 dark:text-gray-200 transition-all hover:pl-5"
                  data-testid="link-support"
                >
                  <Shield className="h-4 w-4 mr-2 text-primary-second dark:text-primary-light" />
                  {t('profile.contactSupport', 'Contact Support')}
                </Button>
              </a>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
