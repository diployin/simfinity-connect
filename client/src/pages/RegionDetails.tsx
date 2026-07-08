import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link, useParams, useLocation } from 'wouter';
import { Helmet } from 'react-helmet-async';
import {
  Globe,
  MapPin,
  Home,
  Smartphone,
  Zap,
  CheckCircle,
  Phone,
  MessageCircle,
  ChevronDown,
  ChevronUp,
  Filter,
  X,
  TrendingUp,
  Award,
  Sparkles,
  Signal,
  Wifi,
  CreditCard,
  Clock,
  ScanLine,
  Headphones,
  Star,
  Check,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { useTranslation } from '@/contexts/TranslationContext';
import { useCurrency } from '@/contexts/CurrencyContext';
import type { Region } from '@shared/schema';
import { useSettingByKey } from '@/hooks/useSettings';
import { useUser } from '@/hooks/use-user';
import { useToast } from '@/hooks/use-toast';

const formatDataAmount = (pkg: {
  dataMb: number | null;
  dataAmount: string;
  isUnlimited: boolean;
}): string => {
  if (pkg.isUnlimited) {
    return 'Unlimited';
  }

  if (pkg.dataMb !== null && pkg.dataMb !== undefined && pkg.dataMb >= 0) {
    if (pkg.dataMb >= 1000) {
      const gb = pkg.dataMb / 1024;
      if (gb >= 1 && gb === Math.floor(gb)) {
        return `${Math.floor(gb)} GB`;
      }
      return `${gb.toFixed(1)} GB`;
    }
    return `${pkg.dataMb} MB`;
  }

  if (pkg.dataAmount && !pkg.dataAmount.includes('-1')) {
    return pkg.dataAmount;
  }

  return 'Data Plan';
};

type UnifiedPackage = {
  id: string;
  slug: string;
  title: string;
  dataAmount: string;
  dataMb: number | null;
  validity: number;
  validityDays: number;
  price: string;
  currency: string;
  isUnlimited: boolean;
  isBestPrice: boolean;
  isPopular: boolean;
  isRecommended: boolean;
  isBestValue: boolean;
  isEnabled: boolean;
  providerId: string;
  providerName: string;
  providerSlug: string;
  operator: string | null;
  operatorImage: string | null;
  packageGroupKey: string | null;
  voiceMinutes: number | null;
  smsCount: number | null;
};

type RegionPackagesResponse = {
  data: {
    region: Region;
    totalPackages: number;
    packages: UnifiedPackage[];
    pagination?: {
      page: number;
      totalPages: number;
      hasPrevPage: boolean;
      hasNextPage: boolean;
    };
  };
};

const regionImages: Record<string, string> = {
  africa: 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=800&h=600&fit=crop',
  asia: 'https://images.unsplash.com/photo-1480796927426-f609979314bd?w=800&h=600&fit=crop',
  europe: 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=800&h=600&fit=crop',
  'north-america':
    'https://images.unsplash.com/photo-1485738422979-f5c462d49f74?w=800&h=600&fit=crop',
  'south-america':
    'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=800&h=600&fit=crop',
  oceania: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
  'middle-east':
    'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&h=600&fit=crop',
  caribbean: 'https://images.unsplash.com/photo-1548574505-5e239809ee19?w=800&h=600&fit=crop',
};

export default function RegionDetails() {
  const { t } = useTranslation();
  const { currency, currencies } = useCurrency();
  const { slug } = useParams();
  const [selectedPackage, setSelectedPackage] = useState<UnifiedPackage | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [, navigate] = useLocation();
  const { isAuthenticated, user } = useUser();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<'details' | 'coverage'>('details');

  const siteName = useSettingByKey('platform_name') || 'Voltey';

  // Filter states
  const [page, setPage] = useState(1);
  const limit = 10;
  const [sortBy, setSortBy] = useState<string>('');
  const [filterUnlimited, setFilterUnlimited] = useState(false);
  const [filterBestPrice, setFilterBestPrice] = useState(false);
  const [filterPopular, setFilterPopular] = useState(false);
  const [filterDataPack, setFilterDataPack] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [filterDataAndVoice, setFilterDataAndVoice] = useState(false);
  const [filterVoiceAndDataAndSmsPack, setFilterVoiceAndDataAndSmsPack] = useState(false);


  const getCurrencySymbol = (currencyCode: string) => {
    return currencies.find((c) => c.code === currencyCode)?.symbol || '$';
  };

  const isKycComplete = () => {
    return isAuthenticated && user?.kycStatus === 'approved';
  };

  const buildQueryParams = () => {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('limit', limit.toString());
    params.append('currency', currency);

    if (sortBy) params.append('sort', sortBy);
    if (filterUnlimited) params.append('isUnlimited', 'true');
    if (filterBestPrice) params.append('isBestPrice', 'true');
    if (filterPopular) params.append('isPopular', 'true');
    if (filterDataPack) params.append('dataPack', 'true');
    if (filterDataAndVoice) params.append('voiceAndDataPack', 'true');
    if (filterVoiceAndDataAndSmsPack) params.append('voiceAndDataAndSmsPack', 'true');

    return params.toString();
  };

  const { data: packagesResponse, isLoading: isLoadingPackages } =
    useQuery<RegionPackagesResponse>({
      queryKey: [
        `/api/unified-packages/by-region/${slug}`,
        {
          currency,
          page,
          limit,
          sortBy,
          filterUnlimited,
          filterBestPrice,
          filterPopular,
          filterDataPack,
          filterDataAndVoice,
          filterVoiceAndDataAndSmsPack
        },
      ],
      queryFn: () =>
        fetch(`/api/unified-packages/by-region/${slug}?${buildQueryParams()}`).then((res) =>
          res.json(),
        ),
      enabled: !!slug,
    });

  const handleGetPlanClick = (e: any, selectedPkg: UnifiedPackage) => {
    e.preventDefault();

    if (!selectedPkg) return;

    const hasVoice =
      (selectedPkg.voiceMinutes ?? 0) > 0;

    if (!hasVoice) {
      navigate(`/unified-checkout/${selectedPkg.slug}`);
      return;
    }

    if (!isAuthenticated) {
      toast({
        title: 'Please login first!',
        description: 'Login is required for Voice & SMS plans.',
      });
      setTimeout(() => navigate('/login'), 2000);
      return;
    }

    if (!isKycComplete()) {
      toast({
        title: 'KYC verification required!',
        description: 'Complete your KYC to use Voice & SMS services.',
      });
      setTimeout(() => navigate('/account/kyc'), 2000);
      return;
    }

    navigate(`/unified-checkout/${selectedPkg.slug}`);
  };


  const clearAllFilters = () => {
    setSortBy('');
    setFilterUnlimited(false);
    setFilterBestPrice(false);
    setFilterPopular(false);
    setFilterDataPack(false);
    setFilterDataAndVoice(false);
    setFilterVoiceAndDataAndSmsPack(false);
    setPage(1);
  };

  const activeFiltersCount = [
    sortBy,
    filterUnlimited,
    filterBestPrice,
    filterPopular,
    filterDataPack,
    filterDataAndVoice,
    filterVoiceAndDataAndSmsPack
  ].filter(Boolean).length;

  const region = packagesResponse?.data?.region;
  const pagination = packagesResponse?.data?.pagination;
  const regionPackages = packagesResponse?.data?.packages || [];

  const groupedPackages = regionPackages.reduce(
    (acc, pkg) => {
      const key = pkg.dataAmount;
      const pkgBadges =
        (pkg.isPopular ? 1 : 0) + (pkg.isRecommended ? 1 : 0) + (pkg.isBestValue ? 1 : 0);

      if (!acc[key]) {
        acc[key] = pkg;
      } else {
        const existingBadges =
          (acc[key].isPopular ? 1 : 0) +
          (acc[key].isRecommended ? 1 : 0) +
          (acc[key].isBestValue ? 1 : 0);

        if (
          pkgBadges > existingBadges ||
          (pkgBadges === existingBadges && parseFloat(pkg.price) < parseFloat(acc[key].price))
        ) {
          acc[key] = pkg;
        }
      }
      return acc;
    },
    {} as Record<string, UnifiedPackage>,
  );

  const packageOptions = Object.values(groupedPackages).sort((a, b) => {
    if (sortBy === 'priceLowToHigh') {
      return parseFloat(a.price) - parseFloat(b.price);
    }
    if (sortBy === 'priceHighToLow') {
      return parseFloat(b.price) - parseFloat(a.price);
    }
    const aBadges = (a.isPopular ? 1 : 0) + (a.isRecommended ? 1 : 0) + (a.isBestValue ? 1 : 0);
    const bBadges = (b.isPopular ? 1 : 0) + (b.isRecommended ? 1 : 0) + (b.isBestValue ? 1 : 0);
    if (aBadges !== bBadges) {
      return bBadges - aBadges;
    }
    return (a.dataMb || 0) - (b.dataMb || 0);
  });

  const bestChoiceIndex = Math.min(2, packageOptions.length - 1);

  useEffect(() => {
    if (!selectedPackage && packageOptions.length > 0) {
      setSelectedPackage(packageOptions[0]);
    }
  }, [packageOptions, selectedPackage]);
  const defaultHeroImage = regionImages[slug?.toLowerCase() || ''] || regionImages['asia'];
  const heroImage = region?.bannerImage || defaultHeroImage;

  const faqs = [
    {
      question: 'What is an eSIM and how does it work?',
      answer:
        'An eSIM is a built-in digital SIM that lets you activate a mobile data plan without a physical card. Just choose a plan, scan a QR code, and connect instantly when you travel.',
    },
    {
      question: 'How do I set up my eSIM on my phone?',
      answer:
        "After purchase, you'll receive an email with a QR code. Open your phone's settings, scan the code, and follow the quick setup guide to start using data.",
    },
    {
      question: 'Can I use my physical SIM and eSIM together?',
      answer:
        'Yes. You can keep your regular SIM for calls and SMS while using your eSIM for data during international travel.',
    },
    {
      question: `Where does ${siteName} work?`,
      answer:
        'Our regional plans cover multiple countries across the region - giving you high-speed internet without roaming fees across borders.',
    },
    {
      question: 'Can I top up or reuse my plan?',
      answer:
        'Yes. Some plans let you add more data or extend your validity directly from your account dashboard, so you can stay connected without buying a new QR code.',
    },
  ];

  const testimonials = [
    {
      name: 'Marcus W.',
      handle: 'Travel Blog Contributor',
      review: `I tried ${siteName} on a recent trip and it just worked without any fuss. Setup took a couple of minutes and I had data as soon as I landed. It’s the kind of thing you don’t think about once it’s running, which is exactly what you want.`,
      rating: 5,
    },
    {
      name: 'Priya S.',
      handle: 'Trustpilot',
      review: "I’m not very techy, so I was expecting this to be annoying to set up, but it was actually really straightforward. No swapping SIM cards or dealing with roaming charges. Used it across a few countries in Europe and didn’t run into any issues.",
      rating: 5,
    },
    {
      name: 'James M.',
      handle: 'Trustpilot',
      review: "The QR code came through instantly and activation was quick. Coverage was solid in most places I visited, even outside the main cities. Speeds dipped a bit in rural areas, but overall it did the job well.",
      rating: 5,
    },
  ];

  if (isLoadingPackages) {
    return (
      <div className="min-h-screen bg-background dark:bg-gray-950 flex flex-col">
        <div className="flex-1 flex items-center justify-center pt-20">
          <div className="text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[var(--primary)] border-r-transparent"></div>
            <p className="mt-4 text-muted-foreground dark:text-gray-400">
              {t('destinationDetails.loadingRegion', 'Loading region...')}
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!region) {
    return (
      <div className="min-h-screen bg-background dark:bg-gray-950 flex flex-col">
        <div className="flex-1 flex items-center justify-center pt-20">
          <Card className="max-w-md dark:bg-gray-900 border-border dark:border-gray-800">
            <CardContent className="p-8 text-center">
              <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2 dark:text-white">
                {t('destinationDetails.regionNotFound', 'Region Not Found')}
              </h2>
              <p className="text-muted-foreground dark:text-gray-400 mb-6">
                {t(
                  'destinationDetails.regionNotFoundMessage',
                  "The region you're looking for doesn't exist.",
                )}
              </p>
              <Link href="/destinations">
                <Button className="bg-[var(--primary)] hover:bg-primary-second text-white">
                  {t('destinationDetails.browseDestinations', 'Browse Destinations')}
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background dark:bg-gray-950 flex flex-col transition-colors duration-300">
      <Helmet>
        <title>
          eSIM for {region.name} - Regional Data Plans | {siteName}
        </title>
        <meta
          name="description"
          content={`Buy prepaid regional eSIM data plans for ${region.name}. Use one plan across multiple countries.`}
        />
      </Helmet>

      <main className="flex-1 pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumb className="mb-6">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/" data-testid="breadcrumb-home" className="dark:text-gray-400 dark:hover:text-white">
                  <Home className="h-4 w-4" />
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="dark:text-gray-600" />
              <BreadcrumbItem>
                <BreadcrumbLink href="/destinations" data-testid="breadcrumb-destinations" className="dark:text-gray-400 dark:hover:text-white">
                  Destinations
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="dark:text-gray-600" />
              <BreadcrumbItem>
                <BreadcrumbPage data-testid="breadcrumb-current" className="dark:text-white">{region.name}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          {/* Hero Section */}
          <div className="grid lg:grid-cols-[2fr_3fr] gap-8 mb-16">
            {/* Left Column */}
            <div className="space-y-0">
              <div className="aspect-[4/3] rounded-t-2xl lg:rounded-2xl overflow-hidden shadow-lg border border-border dark:border-gray-800">
                <img
                  src={heroImage}
                  alt={`Best ${region.name} eSIM for Travelers`}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="bg-card dark:bg-gray-900 rounded-b-2xl lg:rounded-2xl lg:mt-4 border border-border dark:border-gray-800 shadow-md">
                <div className="flex border-b border-border dark:border-gray-800">
                  <button
                    onClick={() => setActiveTab('details')}
                    className={`flex-1 py-4 text-sm font-medium text-center transition-colors ${activeTab === 'details'
                      ? 'text-green-500 border-b-2 border-green-500 -mb-px bg-green-50 dark:bg-green-500/10'
                      : 'text-muted-foreground dark:text-gray-400 hover:text-foreground dark:hover:text-white'
                      }`}
                    data-testid="tab-esim-details"
                  >
                    eSIM Details
                  </button>
                  <button
                    onClick={() => setActiveTab('coverage')}
                    className={`flex-1 py-4 text-sm font-medium text-center transition-colors ${activeTab === 'coverage'
                      ? 'text-green-500 border-b-2 border-green-500 -mb-px bg-green-50 dark:bg-green-500/10'
                      : 'text-muted-foreground dark:text-gray-400 hover:text-foreground dark:hover:text-white'
                      }`}
                    data-testid="tab-coverage"
                  >
                    Coverage
                  </button>
                </div>

                <div className="p-5">
                  {activeTab === 'details' && (
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm font-semibold text-foreground dark:text-white mb-1">
                          Selected Data Plan:
                        </p>
                        <p className="text-sm text-muted-foreground dark:text-gray-400 leading-relaxed">
                          {selectedPackage
                            ? `${region.name} ${formatDataAmount(selectedPackage)} ${selectedPackage.validity} Days`
                            : `Select a plan from the right`}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-foreground dark:text-white mb-1">Compatibility:</p>
                        <p className="text-sm text-muted-foreground dark:text-gray-400 leading-relaxed">
                          All eSIM-compatible devices are supported.
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-foreground dark:text-white mb-1">
                          Instant Delivery:
                        </p>
                        <p className="text-sm text-muted-foreground dark:text-gray-400 leading-relaxed">
                          Get your eSIM plan ready instantly. Scan the QR code or follow the
                          instructions on the confirmation page to install.
                        </p>
                      </div>
                    </div>
                  )}

                  {activeTab === 'coverage' && (
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 text-sm">
                        <Signal className="w-5 h-5 text-green-500" />
                        <div>
                          <span className="font-medium text-foreground dark:text-white">Speed:</span>
                          <span className="text-muted-foreground dark:text-gray-400 ml-2">
                            4G LTE & 5G where available
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 text-sm">
                        <Globe className="w-5 h-5 text-green-500" />
                        <div>
                          <span className="font-medium text-foreground dark:text-white">Coverage:</span>
                          <span className="text-muted-foreground dark:text-gray-400 ml-2">
                            {selectedPackage?.coverage && selectedPackage.coverage.length > 0
                              ? selectedPackage.coverage.join(', ')
                              : region?.name || 'Strong in cities; may vary in remote areas'}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 text-sm">
                        <Wifi className="w-5 h-5 text-green-500" />
                        <div>
                          <span className="font-medium text-foreground dark:text-white">Networks:</span>
                          <span className="text-muted-foreground dark:text-gray-400 ml-2">
                            {selectedPackage?.operator
                              ? `${selectedPackage.operator} in ${region?.name}`
                              : `Multiple network operators in ${region?.name || 'region'}`}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded overflow-hidden border border-border dark:border-gray-700 flex-shrink-0 bg-white dark:bg-gray-800 flex items-center justify-center shadow-sm">
                    {region.image ? (
                      <img
                        src={region.image}
                        alt={region.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Globe className="w-5 h-5 text-primary-second dark:text-primary-light" />
                    )}
                  </div>
                  <h1 className="text-2xl md:text-3xl font-bold text-foreground dark:text-white tracking-tight">
                    eSIM for {region.name}
                  </h1>
                </div>
                <p className="text-muted-foreground dark:text-gray-400 leading-relaxed">
                  Buy prepaid eSIM for {region.name}. Enjoy reliable and fast connections when
                  traveling across the region.
                </p>
              </div>

              {/* Filters and Package Header Section */}
              <div className="space-y-4">
                {/* Top Bar: Filters Toggle + Choose Plan Heading */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  {/* Choose Plan Section */}
                  <div className="flex-1 w-full sm:w-auto">
                    <h2 className="text-xl font-bold text-foreground dark:text-white tracking-tight leading-tight">{t('destination.choosePlan', 'Choose your data plan')}</h2>
                    <div className="flex items-center gap-2 mt-1">
                      <p className="text-sm text-muted-foreground dark:text-gray-400 font-medium">
                        {packageOptions.length} plan{packageOptions.length !== 1 ? 's' : ''} available
                      </p>
                      {activeFiltersCount > 0 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={clearAllFilters}
                          className="text-xs h-6 px-2 text-muted-foreground dark:text-gray-500 hover:text-foreground dark:hover:text-white"
                        >
                          <X className="w-3 h-3 mr-1" />{t('destination.clearFilters', 'Clear filters')}</Button>
                      )}
                    </div>
                  </div>

                  {/* Filter Toggle Button */}
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="flex items-center gap-3 px-4 py-3 bg-card dark:bg-gray-900 border border-border dark:border-gray-800 rounded-xl hover:bg-accent/50 dark:hover:bg-gray-800 hover:border-[var(--primary)]/50 transition-all cursor-pointer group w-full sm:w-auto shadow-sm"
                  >
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 dark:from-[var(--primary)]/20 dark:to-[var(--primary)]/10 flex items-center justify-center group-hover:scale-105 transition-transform">
                      <Filter className="w-5 h-5 text-primary-second dark:text-[var(--primary-light)]" />
                    </div>
                    <div className="text-left flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-foreground dark:text-white">{t('destination.filtersAndSorting', 'Filters & Sorting')}</h3>
                        {activeFiltersCount > 0 && (
                          <span className="px-2 py-0.5 text-xs font-medium bg-[var(--primary)] text-white rounded-full">
                            {activeFiltersCount}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground dark:text-gray-500 font-medium">
                        {activeFiltersCount > 0
                          ? `${activeFiltersCount} filter${activeFiltersCount !== 1 ? 's' : ''} active`
                          : 'Click to filter plans'
                        }
                      </p>
                    </div>
                    <div className={`transition-transform duration-200 ${showFilters ? 'rotate-180' : ''}`}>
                      <ChevronDown className="w-5 h-5 text-muted-foreground dark:text-gray-500" />
                    </div>
                  </button>
                </div>

                {/* Collapsible Filter Panel */}
                <div
                  className={`transition-all duration-300 ease-in-out overflow-hidden ${showFilters ? 'max-h-[600px] opacity-100 mb-4' : 'max-h-0 opacity-0'
                    }`}
                >
                  <div className="bg-gradient-to-br from-card to-card/50 dark:from-gray-900 dark:to-gray-950 border border-border dark:border-gray-800 rounded-xl p-4 space-y-4 shadow-md">
                    {/* Sort By */}
                    <div>
                      <label className="text-sm font-medium text-foreground dark:text-white mb-3 flex items-center gap-2">
                        <div className="w-6 h-6 rounded-md bg-gradient-to-br from-green-100 to-green-50 dark:from-green-500/20 dark:to-green-500/10 flex items-center justify-center">
                          <TrendingUp className="w-3.5 h-3.5 text-green-600 dark:text-green-400" />
                        </div>
                        Sort By
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        <Button
                          variant={sortBy === 'priceLowToHigh' ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => {
                            setSortBy(sortBy === 'priceLowToHigh' ? '' : 'priceLowToHigh');
                            setPage(1);
                          }}
                          className="w-full text-xs h-9 font-medium dark:border-gray-700 dark:hover:bg-gray-800"
                        >{t('destination.lowToHigh', '💰 Low to High')}</Button>
                        <Button
                          variant={sortBy === 'priceHighToLow' ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => {
                            setSortBy(sortBy === 'priceHighToLow' ? '' : 'priceHighToLow');
                            setPage(1);
                          }}
                          className="w-full text-xs h-9 font-medium dark:border-gray-700 dark:hover:bg-gray-800"
                        >{t('destination.highToLow', '💎 High to Low')}</Button>
                      </div>
                    </div>

                    {/* Filter Options */}
                    <div>
                      <label className="text-sm font-medium text-foreground dark:text-white mb-3 flex items-center gap-2">
                        <div className="w-6 h-6 rounded-md bg-gradient-to-br from-primary/10 to-primary/5 dark:from-[var(--primary)]/20 dark:to-[var(--primary)]/10 flex items-center justify-center">
                          <Filter className="w-3.5 h-3.5 text-primary-second dark:text-[var(--primary-light)]" />
                        </div>{t('destination.filterBy', 'Filter By')}</label>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        <Button
                          variant={filterUnlimited ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => {
                            setFilterUnlimited(!filterUnlimited);
                            setPage(1);
                          }}
                          className="w-full justify-start text-xs h-auto min-h-9 py-2 font-medium dark:border-gray-700 dark:hover:bg-gray-800"
                        >
                          <Sparkles className="w-3.5 h-3.5 mr-2 flex-shrink-0" />{t('destination.unlimited', 'Unlimited')}</Button>
                        <Button
                          variant={filterBestPrice ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => {
                            setFilterBestPrice(!filterBestPrice);
                            setPage(1);
                          }}
                          className="w-full justify-start text-xs h-auto min-h-9 py-2 font-medium dark:border-gray-700 dark:hover:bg-gray-800"
                        >
                          <Award className="w-3.5 h-3.5 mr-2 flex-shrink-0" />{t('destination.bestPrice', 'Best Price')}</Button>
                        <Button
                          variant={filterPopular ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => {
                            setFilterPopular(!filterPopular);
                            setPage(1);
                          }}
                          className="w-full justify-start text-xs h-auto min-h-9 py-2 font-medium dark:border-gray-700 dark:hover:bg-gray-800"
                        >
                          <Star className="w-3.5 h-3.5 mr-2 flex-shrink-0" />{t('destination.popular', 'Popular')}</Button>
                        <Button
                          variant={filterDataPack ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => {
                            setFilterDataPack(!filterDataPack);
                            setPage(1);
                          }}
                          className="w-full justify-start text-xs h-auto min-h-9 py-2 font-medium dark:border-gray-700 dark:hover:bg-gray-800"
                        >
                          <Wifi className="w-3.5 h-3.5 mr-2 flex-shrink-0" />{t('destination.dataOnly', 'Data Only')}</Button>
                        <Button
                          variant={filterDataAndVoice ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => {
                            setFilterDataAndVoice(!filterDataAndVoice);
                            setPage(1);
                          }}
                          className="w-full justify-start text-xs h-auto min-h-9 py-2 font-medium dark:border-gray-700 dark:hover:bg-gray-800"
                        >
                          <Wifi className="w-3.5 h-3.5 mr-2 flex-shrink-0" />{t('destination.dataVoice', 'Data + Voice')}</Button>
                        <Button
                          variant={filterVoiceAndDataAndSmsPack ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => {
                            setFilterVoiceAndDataAndSmsPack(!filterVoiceAndDataAndSmsPack);
                            setPage(1);
                          }}
                          className="w-full justify-start text-xs h-auto min-h-9 py-2 font-medium whitespace-normal text-left leading-tight dark:border-gray-700 dark:hover:bg-gray-800"
                        >
                          <Wifi className="w-3.5 h-3.5 mr-2 flex-shrink-0" />{t('destination.dataVoiceSms', 'Data + Voice + SMS')}</Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Package Selection Grid */}
              <div className="w-full pb-28">
                <div
                  className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 ${packageOptions.length > 9
                    ? 'max-h-[500px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-[var(--primary)]/20 dark:scrollbar-thumb-primary/20 scrollbar-track-transparent hover:scrollbar-thumb-[var(--primary)]/40 dark:hover:scrollbar-thumb-primary/40'
                    : ''
                    }`}
                >
                  {packageOptions.map((pkg, index) => {
                    const isBestChoice = index === bestChoiceIndex;
                    const isSelected = selectedPackage?.id === pkg.id;
                    const hasBadges =
                      pkg.isPopular || pkg.isRecommended || pkg.isBestValue || isBestChoice;

                    return (
                      <button
                        key={pkg.id}
                        onClick={() => setSelectedPackage(pkg)}
                        className={`relative w-full flex flex-col justify-between p-4 sm:p-5 rounded-2xl border-2 transition-all text-left overflow-visible group ${isSelected
                          ? 'border-[var(--primary)] bg-gradient-to-br from-primary/5/50 to-primary/10/30 dark:from-primary/20 dark:to-primary/10 shadow-lg shadow-[var(--primary)]/20 dark:shadow-primary/10 scale-[1.01]'
                          : 'border-border dark:border-gray-800 bg-card dark:bg-gray-900 hover:border-[var(--primary)]/30 dark:hover:border-primary/40 hover:shadow-md dark:hover:shadow-primary/5 hover:scale-[1.01]'
                          }`}
                        data-testid={`button-package-${pkg.dataAmount}`}
                      >
                        {/* Badge row */}
                        {hasBadges && (
                          <div className="absolute -top-3 left-2 right-2 flex flex-wrap gap-1 justify-center z-10">
                            {pkg.isPopular && (
                              <span
                                className="bg-gradient-to-r from-green-500 to-green-600 text-white text-[10px] sm:text-xs font-semibold px-2 py-1 rounded-full shadow-md text-center"
                                data-testid={`badge-popular-${pkg.id}`}
                              >{t('destination.badges.popular', '🔥 Popular')}</span>
                            )}
                            {pkg.isRecommended && (
                              <span
                                className="bg-gradient-to-r from-[var(--primary)] to-primary-second text-white text-[10px] sm:text-xs font-semibold px-2 py-1 rounded-full shadow-md text-center"
                                data-testid={`badge-recommended-${pkg.id}`}
                              >{t('destination.badges.recommended', '⭐ Recommended')}</span>
                            )}
                            {pkg.isBestValue && (
                              <span
                                className="bg-gradient-to-r from-green-500 to-green-600 text-white text-[10px] sm:text-xs font-semibold px-2 py-1 rounded-full shadow-md text-center"
                                data-testid={`badge-best-value-${pkg.id}`}
                              >{t('destination.badges.bestValue', '💎 Best Value')}</span>
                            )}
                            {isBestChoice &&
                              !pkg.isPopular &&
                              !pkg.isRecommended &&
                              !pkg.isBestValue && (
                                <span
                                  className="bg-gradient-to-r from-green-500 to-green-600 text-white text-[10px] sm:text-xs font-semibold px-2 py-1 rounded-full shadow-md text-center"
                                  data-testid={`badge-best-choice-${pkg.id}`}
                                >{t('destination.badges.bestChoice', '✨ Best Choice')}</span>
                              )}
                          </div>
                        )}

                        {/* Top Section */}
                        <div className="w-full mb-4">
                          <div className="flex items-center gap-3 mt-2 mb-2">
                            <div
                              className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${isSelected
                                ? 'bg-[var(--primary)] text-white shadow-sm'
                                : 'bg-gradient-to-br from-primary/10 to-primary/5 dark:from-primary/20 dark:to-primary/10 text-primary-second dark:text-primary-light'
                                }`}
                            >
                              <Wifi className="w-4 h-4 sm:w-5 sm:h-5" />
                            </div>
                            <div>
                              <p className="text-base sm:text-lg font-bold text-foreground dark:text-white leading-tight">
                                {formatDataAmount(pkg)}
                              </p>
                              <div className="flex items-center gap-1 mt-0.5">
                                <Clock className="w-3 h-3 text-muted-foreground dark:text-gray-400 flex-shrink-0" />
                                <p className="text-xs font-medium text-muted-foreground dark:text-gray-400">
                                  {pkg.validity} Days
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* Voice & SMS info */}
                          {((pkg.voiceMinutes !== null && pkg.voiceMinutes > 0) ||
                            (pkg.smsCount !== null && pkg.smsCount > 0)) && (
                              <div className="flex flex-wrap gap-2 mt-2 p-2 rounded-xl bg-accent/50 dark:bg-white/5 w-full border border-black/5 dark:border-white/5">
                                {pkg.voiceMinutes !== null && pkg.voiceMinutes > 0 && (
                                  <span
                                    className="flex items-center gap-1 text-[11px] sm:text-xs font-medium text-foreground dark:text-gray-200"
                                    data-testid={`voice-${pkg.id}`}
                                  >
                                    <Phone className="w-3.5 h-3.5 text-green-600 dark:text-green-400" />
                                    {pkg.voiceMinutes === -1 ? 'Unlimited' : `${pkg.voiceMinutes}m`}
                                  </span>
                                )}
                                {pkg.smsCount !== null && pkg.smsCount > 0 && (
                                  <span
                                    className="flex items-center gap-1 text-[11px] sm:text-xs font-medium text-foreground dark:text-gray-200"
                                    data-testid={`sms-${pkg.id}`}
                                  >
                                    <MessageCircle className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                                    {pkg.smsCount === -1 ? 'Unlimited' : `${pkg.smsCount} SMS`}
                                  </span>
                                )}
                              </div>
                            )}
                        </div>

                        {/* Bottom Section */}
                        <div className="flex items-center justify-between pt-3 border-t border-border dark:border-gray-800 mt-auto w-full gap-2">
                          <div className="min-w-0">
                            <div className="flex items-baseline gap-1 whitespace-nowrap">
                              <span className="text-base sm:text-lg font-bold text-foreground dark:text-white">
                                {getCurrencySymbol(pkg.currency)}{pkg.price}
                              </span>
                              <span className="text-[10px] sm:text-xs text-muted-foreground dark:text-gray-500 font-semibold uppercase tracking-wider">
                                {pkg.currency}
                              </span>
                            </div>
                          </div>
                          <div
                            className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 flex items-center justify-center transition-all flex-shrink-0 ${isSelected
                              ? 'border-[var(--primary)] bg-[var(--primary)] scale-105 shadow-sm'
                              : 'border-muted-foreground/30 dark:border-gray-700 group-hover:border-[var(--primary)]/50'
                              }`}
                          >
                            {isSelected && <Check className="h-3 w-3 text-white stroke-[3px]" />}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Pagination */}
              {pagination && pagination.totalPages > 1 && (
                <Card className="border dark:border-gray-800 shadow-sm dark:bg-gray-900">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center">
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={!pagination.hasPrevPage}
                        onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                        className="gap-2 dark:border-gray-700 dark:hover:bg-gray-800"
                      >
                        <ChevronUp className="w-4 h-4 rotate-[-90deg]" />
                        Previous
                      </Button>

                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground dark:text-gray-400">
                          Page <span className="text-foreground dark:text-white font-medium">{pagination.page}</span> of <span className="text-foreground dark:text-white font-medium">{pagination.totalPages}</span>
                        </span>
                      </div>

                      <Button
                        variant="outline"
                        size="sm"
                        disabled={!pagination.hasNextPage}
                        onClick={() => setPage((prev) => prev + 1)}
                        className="gap-2 dark:border-gray-700 dark:hover:bg-gray-800"
                      >
                        Next
                        <ChevronDown className="w-4 h-4 rotate-[-90deg]" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Checkout Card */}
              <div className="lg:sticky lg:top-24">
                <Card className="shadow-lg border-0 bg-gradient-to-br from-primary/5 to-primary/5 dark:bg-gray-800/80 dark:from-gray-800/80 dark:to-gray-800/80 overflow-hidden relative">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none dark:bg-primary/5" />
                  <CardContent className="p-5 relative z-10">
                    {selectedPackage ? (
                      <>
                        <div className="flex items-center justify-between mb-5">
                          <div>
                            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground dark:text-gray-400 mb-1">Selected Plan</p>
                            <p className="font-bold text-foreground dark:text-white text-lg">
                              {formatDataAmount(selectedPackage)} - {selectedPackage.validity} Days
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-black text-foreground dark:text-white">
                              {getCurrencySymbol(selectedPackage.currency)}
                              {selectedPackage.price}
                            </p>
                            <p className="text-xs font-bold text-muted-foreground dark:text-gray-400 uppercase">
                              {selectedPackage.currency}
                            </p>
                          </div>
                        </div>
                        <Button
                          onClick={(e) => handleGetPlanClick(e, selectedPackage)}
                          className="w-full bg-primary-gradient hover:bg-primary-gradient-hover text-white font-bold h-12 rounded-xl shadow-lg shadow-primary/20 dark:shadow-primary/30 transition-all hover:scale-[1.01] active:scale-[0.99]"
                          data-testid="button-checkout"
                        >
                          Buy Now
                        </Button>
                        <div className="mt-4 grid grid-cols-2 gap-4">
                          <div className="flex items-center gap-1.5 text-[10px] sm:text-xs font-medium text-muted-foreground dark:text-gray-300">
                            <Smartphone className="w-3.5 h-3.5 text-primary-second dark:text-primary-light" />
                            <span>eSIM Compatible</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-[10px] sm:text-xs font-medium text-muted-foreground dark:text-gray-300">
                            <CheckCircle className="w-3.5 h-3.5 text-green-500 dark:text-green-400" />
                            <span>Secure Payment</span>
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="text-center py-6">
                        <div className="w-12 h-12 rounded-full bg-primary/10 dark:bg-gray-700/50 flex items-center justify-center mx-auto mb-3">
                          <Smartphone className="w-6 h-6 text-primary-second dark:text-primary-light" />
                        </div>
                        <p className="font-bold text-foreground dark:text-white">Select a data plan above</p>
                        <p className="text-sm text-muted-foreground dark:text-gray-300 mt-1">
                          Choose the best option for your trip
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>

          {/* How to Setup Section */}
          <section className="mb-20">
            <h2 className="text-2xl md:text-4xl font-black text-center text-foreground dark:text-white mb-4 tracking-tight">
              How to setup your {region.name} eSIM
            </h2>
            <p className="text-center text-muted-foreground dark:text-gray-400 mb-12 max-w-2xl mx-auto font-medium">
              Get connected in just 3 simple steps
            </p>

            <div className="grid md:grid-cols-3 gap-8">
              <Card className="text-center border-0 shadow-xl dark:bg-gray-900 overflow-hidden group">
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary/10 to-primary/10 dark:from-primary/20 dark:to-primary/20 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-inner group-hover:scale-110 transition-transform">
                    <CreditCard className="w-8 h-8 text-primary-second dark:text-primary-light" />
                  </div>
                  <Badge variant="outline" className="mb-4 bg-primary/5 dark:bg-primary/20 dark:text-primary-light dark:border-primary/30">
                    Step 1
                  </Badge>
                  <h3 className="font-bold text-foreground dark:text-white text-lg mb-3">
                    Choose a data plan
                  </h3>
                  <p className="text-sm text-muted-foreground dark:text-gray-400 leading-relaxed">
                    Find the best eSIM plan tailored for the region.
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center border-0 shadow-xl dark:bg-gray-900 overflow-hidden group">
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-amber-100 dark:from-green-500/20 dark:to-amber-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-inner group-hover:scale-110 transition-transform">
                    <ScanLine className="w-8 h-8 text-green-600 dark:text-green-400" />
                  </div>
                  <Badge variant="outline" className="mb-4 bg-green-50 dark:bg-green-500/20 dark:text-green-400 dark:border-green-500/30">
                    Step 2
                  </Badge>
                  <h3 className="font-bold text-foreground dark:text-white text-lg mb-3">
                    Scan the QR code
                  </h3>
                  <p className="text-sm text-muted-foreground dark:text-gray-400 leading-relaxed">
                    Instantly install and set up your eSIM in seconds.
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center border-0 shadow-xl dark:bg-gray-900 overflow-hidden group">
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-500/20 dark:to-emerald-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-inner group-hover:scale-110 transition-transform">
                    <Signal className="w-8 h-8 text-green-600 dark:text-green-400" />
                  </div>
                  <Badge variant="outline" className="mb-4 bg-emerald-50 dark:bg-emerald-500/20 dark:text-emerald-400 dark:border-emerald-500/30">
                    Step 3
                  </Badge>
                  <h3 className="font-bold text-foreground dark:text-white text-lg mb-3">
                    Enjoy fast data abroad
                  </h3>
                  <p className="text-sm text-muted-foreground dark:text-gray-400 leading-relaxed">
                    Stay connected anywhere with reliable high-speed internet.
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="text-center mt-10">
              <Button
                className="bg-primary-gradient text-white px-10 h-12 rounded-full font-bold shadow-lg shadow-primary/20 transition-all hover:scale-[1.02]"
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              >
                Get started now
              </Button>
            </div>
          </section>

          {/* Why Choose Us Section */}
          <section className="mb-20">
            <h2 className="text-2xl md:text-4xl font-black text-center text-foreground dark:text-white mb-4 tracking-tight">
              Why choose {siteName} for your
              <br />
              {region.name} trip
            </h2>
            <p className="text-center text-muted-foreground dark:text-gray-400 mb-12 max-w-2xl mx-auto font-medium">
              Experience hassle-free connectivity with our premium eSIM service
            </p>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { icon: Wifi, title: 'Unlimited data plans', desc: 'Stay connected with fast data worldwide.', color: 'primary' },
                { icon: Globe, title: 'No roaming charges', desc: 'Travel freely without extra charges.', color: 'green' },
                { icon: Phone, title: 'Keep physical SIM', desc: 'Keep your local SIM for calls and texts.', color: 'green' },
                { icon: Zap, title: 'Quick eSIM setup', desc: 'Activate online and connect in minutes.', color: 'primary' }
              ].map((item, i) => (
                <Card key={i} className="border-0 shadow-lg text-center dark:bg-gray-900 group hover:-translate-y-1 transition-all">
                  <CardContent className="p-8">
                    <div className={`w-14 h-14 bg-${item.color === 'primary' ? 'primary/10' : 'green-100'} dark:bg-${item.color === 'primary' ? 'primary/20' : 'green-500/20'} rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-inner`}>
                      <item.icon className={`w-7 h-7 text-${item.color === 'primary' ? 'primary-second' : 'green-600'} dark:text-${item.color === 'primary' ? 'primary-light' : 'green-400'}`} />
                    </div>
                    <h3 className="font-bold text-foreground dark:text-white mb-2 text-lg">{item.title}</h3>
                    <p className="text-sm text-muted-foreground dark:text-gray-400 leading-relaxed">
                      {item.desc}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* FAQ Section */}
          <section className="mb-20">
            <h2 className="text-2xl md:text-4xl font-black text-center text-foreground dark:text-white mb-4 tracking-tight">
              FAQs about eSIM {region.name}
            </h2>
            <p className="text-center text-muted-foreground dark:text-gray-400 mb-12 max-w-2xl mx-auto font-medium">
              Everything you need to know about using eSIM in {region.name}
            </p>

            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-4">
                {faqs.map((faq, index) => (
                  <Card key={index} className="border dark:border-gray-800 shadow-sm overflow-hidden dark:bg-gray-900 transition-all hover:border-primary/30">
                    <button
                      onClick={() => setOpenFaq(openFaq === index ? null : index)}
                      className="w-full p-5 flex items-center justify-between text-left"
                      data-testid={`faq-toggle-${index}`}
                    >
                      <span className="font-bold text-foreground dark:text-white pr-4">{faq.question}</span>
                      {openFaq === index ? (
                        <ChevronUp className="h-5 w-5 text-primary flex-shrink-0" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-muted-foreground dark:text-gray-500 flex-shrink-0" />
                      )}
                    </button>
                    {openFaq === index && (
                      <div className="px-5 pb-5 border-t border-border dark:border-gray-800 pt-4 bg-muted/30 dark:bg-black/10">
                        <p className="text-sm text-muted-foreground dark:text-gray-400 leading-relaxed font-medium">{faq.answer}</p>
                      </div>
                    )}
                  </Card>
                ))}
              </div>

              <div>
                <Card className="border border-border dark:border-gray-800 shadow-2xl bg-card dark:bg-gray-900/50 overflow-hidden relative">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none dark:bg-primary/20" />
                  <CardContent className="p-8 text-center relative z-10">
                    <div className="w-16 h-16 bg-primary/10 dark:bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg border border-primary/20">
                      <Headphones className="w-8 h-8 text-primary-second dark:text-primary-light" />
                    </div>
                    <Badge variant="outline" className="mb-4 bg-primary/5 dark:bg-primary/20 dark:border-primary/30 dark:text-primary-light font-bold uppercase tracking-widest text-[10px]">
                      support
                    </Badge>
                    <h3 className="font-black text-foreground dark:text-white text-xl mb-3">Need more help?</h3>
                    <p className="text-sm text-muted-foreground dark:text-gray-400 mb-6 leading-relaxed">
                      Can't find what you're looking for? Our support team is available 24/7 by
                      email or chat.
                    </p>
                    <Link href="/help-center">
                      <Button variant="default" className="w-full h-11 font-bold rounded-xl shadow-md">
                        Visit Help Center
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>

          {/* Testimonials Section */}
          <section className="mb-16">
            <h2 className="text-2xl md:text-4xl font-black text-center text-foreground dark:text-white mb-4 tracking-tight">
              What travelers say about {siteName}
            </h2>
            <p className="text-center text-muted-foreground dark:text-gray-400 mb-12 max-w-2xl mx-auto font-medium">
              Join thousands of happy travelers who stay connected with us
            </p>

            <div className="grid md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <Card key={index} className="border-0 shadow-xl dark:bg-gray-900 transition-all hover:scale-[1.02]">
                  <CardContent className="p-8">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-12 h-12 bg-gradient-to-br from-[var(--primary-light)] to-[var(--primary)] rounded-full flex items-center justify-center text-white font-black text-lg shadow-lg">
                        {testimonial.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-foreground dark:text-white">{testimonial.name}</p>
                        <p className="text-xs font-medium text-muted-foreground dark:text-gray-500 uppercase tracking-wider">{testimonial.handle}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${i < testimonial.rating ? 'text-amber-400 fill-amber-400' : 'text-muted-foreground/30 dark:text-gray-700'}`}
                        />
                      ))}
                    </div>

                    <p className="text-sm text-muted-foreground dark:text-gray-300 leading-relaxed font-medium italic">"{testimonial.review}"</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="text-center mt-12">
              <Link href="/destinations">
                <Button variant="outline" className="px-10 h-12 rounded-full font-bold dark:border-gray-700 dark:hover:bg-gray-800 transition-all">
                  View all destinations
                </Button>
              </Link>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
