import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link, useLocation, useSearch } from 'wouter';
import { Helmet } from 'react-helmet-async';
import {
  Search,
  Globe,
  MapPin,
  ChevronRight,
  X,
  Ticket,
  Shield,
  Bot,
  BatteryFull,
  TreePine,
  Zap,
  Plane,
  Hotel,
  Car,
  Lock,
  Wifi,
  Package,
  Briefcase,
  Backpack,
  Star,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { SiteHeader } from '@/components/layout/SiteHeader';
import SiteFooter from '@/components/layout/SiteFooter';
import { useTranslation } from '@/contexts/TranslationContext';
import { useCurrency } from '@/contexts/CurrencyContext';
import ReactCountryFlag from 'react-country-flag';
import type { Destination, Region } from '@shared/schema';

type DestinationWithPricing = Destination & {
  minPrice: string;
  minDataAmount: string;
  minValidity: number;
  currency?: string;
};

type RegionWithPricing = Region & {
  minPrice: string;
  minDataAmount: string;
  minValidity: number;
  currency?: string;
};

interface GlobalPackage {
  id: string;
  title: string;
  dataAmount: string;
  validity: number;
  retailPrice: string;
  slug: string;
}

export default function Destinations() {
  const { t } = useTranslation();
  const { currency, currencies } = useCurrency();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'countries' | 'regions' | 'global' | 'passport'>('all');
  const [location, setLocation] = useLocation();
  const search = useSearch();

  useEffect(() => {
    const params = new URLSearchParams(search);
    const tab = params.get('tab');
    if (tab && ['all', 'countries', 'regions', 'global', 'passport'].includes(tab)) {
      setActiveTab(tab as any);
    } else if (!tab && location === '/destinations') {
      setActiveTab('all');
    }
  }, [search, location]);

  const handleTabChange = (tab: 'all' | 'countries' | 'regions' | 'global' | 'passport') => {
    setActiveTab(tab);
    setLocation(`/destinations?tab=${tab}`);
  };

  const getCurrencySymbol = (currencyCode: string) => {
    return currencies.find((c) => c.code === currencyCode)?.symbol || '$';
  };

  const { data: destinationsWithPricing, isLoading: loadingDest } = useQuery<
    DestinationWithPricing[]
  >({
    queryKey: ['/api/destinations/with-pricing', { currency }],
  });

  const { data: regionsWithPricing, isLoading: loadingRegions } = useQuery<RegionWithPricing[]>({
    queryKey: ['/api/regions/with-pricing', { currency }],
  });

  const { data: globalPackages = [], isLoading: loadingGlobal } = useQuery<GlobalPackage[]>({
    queryKey: ['/api/packages/global', { currency }],
  });

  const filteredGlobalPackages = globalPackages.filter(
    (pkg) =>
      pkg.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pkg.dataAmount?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const filteredDestinations = destinationsWithPricing?.filter(
    (d) =>
      d.active &&
      (d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.countryCode.toLowerCase().includes(searchQuery.toLowerCase())),
  );

  const filteredRegions = regionsWithPricing?.filter(
    (r) => r.active && r.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const totalCount =
    activeTab === 'all'
      ? (filteredDestinations?.length || 0) + (filteredRegions?.length || 0)
      : activeTab === 'countries'
        ? filteredDestinations?.length || 0
        : activeTab === 'regions'
          ? filteredRegions?.length || 0
          : activeTab === 'passport'
            ? 0
            : filteredGlobalPackages?.length || 0;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Helmet>
        <title>
          {String(
            t('destinations.title', 'Browse eSIM Destinations - 190+ Countries | Simfinity'),
          )}
        </title>
        <meta
          name="description"
          content={String(
            t(
              'destinations.description',
              'Explore eSIM data plans for countries worldwide. Find affordable prepaid data packages for your next trip.',
            ),
          )}
        />
      </Helmet>

      {/* <SiteHeader /> */}

      <main className="flex-1 pt-28 pb-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Header Section */}
          <div className="text-center mb-10">
            <Badge className="mb-4 bg-[#1e5427] hover:bg-[#1e5427] text-white px-4 py-1.5 rounded-full">
              <Globe className="h-3.5 w-3.5 mr-1.5" />
              {t('destinations.globalCoverage', 'Global Coverage')}
            </Badge>

            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              {t('destinations.allDestinations', 'All Destinations')}
            </h1>

            <p className="text-muted-foreground max-w-2xl mx-auto">
              {t(
                'destinations.heroDescription',
                'Find the best data plans in over 224+ destinations — and enjoy easy and safe internet access wherever you go. Connect instantly with our premium eSIM solutions.',
              )}
            </p>
          </div>

          {/* Tabs and Search Row */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div className="relative">
              <div className="flex overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4">
                <div className="flex items-center gap-2 min-w-max">
                  <button
                    onClick={() => handleTabChange('all')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${activeTab === 'all'
                      ? 'bg-[#1e5427] text-white'
                      : 'bg-muted text-muted-foreground hover:bg-muted/80'
                      }`}
                    data-testid="tab-all"
                  >
                    {t('destinations.all', 'All')} (
                    {(filteredDestinations?.length || 0) + (filteredRegions?.length || 0)})
                  </button>
                  <button
                    onClick={() => handleTabChange('countries')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${activeTab === 'countries'
                      ? 'bg-[#1e5427] text-white'
                      : 'bg-muted text-muted-foreground hover:bg-muted/80'
                      }`}
                    data-testid="tab-countries"
                  >
                    <MapPin className="h-3.5 w-3.5 shrink-0" />
                    {t('destinations.countries', 'Countries')}
                  </button>
                  <button
                    onClick={() => handleTabChange('regions')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${activeTab === 'regions'
                      ? 'bg-[#1e5427] text-white'
                      : 'bg-muted text-muted-foreground hover:bg-muted/80'
                      }`}
                    data-testid="tab-regions"
                  >
                    <Globe className="h-3.5 w-3.5 shrink-0" />
                    {t('destinations.regionalEsims', 'Regional eSIMs')}
                  </button>
                  <button
                    onClick={() => handleTabChange('global')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${activeTab === 'global'
                      ? 'bg-[#1e5427] text-white'
                      : 'bg-muted text-muted-foreground hover:bg-muted/80'
                      }`}
                    data-testid="tab-global"
                  >
                    <Globe className="h-3.5 w-3.5 shrink-0" />
                    {t('destinations.globalEsims', 'Global eSIMs')}
                  </button>
                  <button
                    onClick={() => handleTabChange('passport')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${activeTab === 'passport'
                      ? 'bg-[#1e5427] text-white'
                      : 'bg-muted text-muted-foreground hover:bg-muted/80'
                      }`}
                    data-testid="tab-passport"
                  >
                    <Ticket className="h-3.5 w-3.5 shrink-0" />
                    Simfinity Passport
                  </button>
                </div>
              </div>
            </div>

            {/* Search Bar */}
            <div className="relative max-w-xs w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder={t('destinations.searchPlaceholder', 'Search for destination')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-10 py-2 h-10 text-sm bg-card border-border rounded-full"
                data-testid="input-search-destinations"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-muted transition-colors"
                  data-testid="button-clear-search"
                >
                  <X className="h-4 w-4 text-muted-foreground" />
                </button>
              )}
            </div>
          </div>

          {/* Results Count */}
          {activeTab !== 'passport' && (
            <p className="text-muted-foreground text-sm mb-6" data-testid="text-destination-count">
              {t('destinations.showing', 'Showing')} {totalCount} {activeTab}
            </p>
          )}

          {/* Destinations Grid - All (Countries + Regions) */}
          {activeTab === 'all' && (
            <>
              {loadingDest || loadingRegions ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[...Array(12)].map((_, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-4 p-4 bg-card rounded-xl border border-border animate-pulse"
                    >
                      <div className="w-12 h-12 rounded-full bg-muted" />
                      <div className="flex-1">
                        <div className="h-5 w-24 bg-muted rounded mb-2" />
                        <div className="h-4 w-32 bg-muted rounded" />
                      </div>
                      <div className="w-5 h-5 bg-muted rounded" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {/* Countries */}
                  {filteredDestinations?.map((dest) => (
                    <Link key={dest.id} href={`/destination/${dest.slug}`}>
                      <div
                        className="flex items-center gap-4 p-4 bg-card rounded-xl border border-border hover:border-[#3d9a4d] dark:hover:border-[#2c7338]/50 hover:shadow-md transition-all cursor-pointer group"
                        data-testid={`card-destination-${dest.slug}`}
                      >
                        <div className="w-12 h-12 rounded-full overflow-hidden bg-muted flex items-center justify-center flex-shrink-0 border-2 border-gray-100 dark:border-gray-700">
                          <ReactCountryFlag
                            countryCode={dest.countryCode}
                            svg
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-foreground truncate group-hover:text-[#1e5427] dark:group-hover:text-[#3d9a4d] transition-colors">
                            {dest.name}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {t('destinations.startingFrom', 'Starting from')}{' '}
                            <span className="text-green-500 font-semibold">
                              {getCurrencySymbol(dest.currency || 'USD')}
                              {dest.minPrice}
                            </span>
                          </p>
                        </div>
                        <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-[#2c7338] transition-colors flex-shrink-0" />
                      </div>
                    </Link>
                  ))}
                  {/* Regions */}
                  {filteredRegions?.map((region) => (
                    <Link key={region.id} href={`/region/${region.slug}`}>
                      <div
                        className="flex items-center gap-4 p-4 bg-card rounded-xl border border-border hover:border-[#3d9a4d] dark:hover:border-[#2c7338]/50 hover:shadow-md transition-all cursor-pointer group"
                        data-testid={`card-region-${region.slug}`}
                      >
                        <div className="w-12 h-12 rounded-full overflow-hidden bg-gradient-to-br from-[#dcf0de] to-[#dcf0de] dark:from-[#194520]/30 dark:to-[#194520]/30 flex items-center justify-center flex-shrink-0 border-2 border-[#dcf0de] dark:border-[#1e5427]">
                          <Globe className="w-6 h-6 text-[#1e5427] dark:text-[#3d9a4d]" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-foreground truncate group-hover:text-[#1e5427] dark:group-hover:text-[#3d9a4d] transition-colors">
                            {region.name}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {t('destinations.startingFrom', 'Starting from')}{' '}
                            <span className="text-green-500 font-semibold">
                              {getCurrencySymbol(region.currency || 'USD')}
                              {region.minPrice}
                            </span>
                          </p>
                        </div>
                        <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-[#2c7338] transition-colors flex-shrink-0" />
                      </div>
                    </Link>
                  ))}
                </div>
              )}

              {/* No Results */}
              {!loadingDest &&
                !loadingRegions &&
                (filteredDestinations?.length || 0) + (filteredRegions?.length || 0) === 0 && (
                  <div className="text-center py-16">
                    <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                      <Search className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      {t('destinations.noResultsTitle', 'No destinations found')}
                    </h3>
                    <p className="text-muted-foreground">
                      {t('destinations.noResults', 'Try adjusting your search query')}
                    </p>
                  </div>
                )}
            </>
          )}

          {/* Destinations Grid - Countries */}
          {activeTab === 'countries' && (
            <>
              {loadingDest ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[...Array(12)].map((_, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-4 p-4 bg-card rounded-xl border border-border animate-pulse"
                    >
                      <div className="w-12 h-12 rounded-full bg-muted" />
                      <div className="flex-1">
                        <div className="h-5 w-24 bg-muted rounded mb-2" />
                        <div className="h-4 w-32 bg-muted rounded" />
                      </div>
                      <div className="w-5 h-5 bg-muted rounded" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredDestinations?.map((dest) => (
                    <Link key={dest.id} href={`/destination/${dest.slug}`}>
                      <div
                        className="flex items-center gap-4 p-4 bg-card rounded-xl border border-border hover:border-[#3d9a4d] dark:hover:border-[#2c7338]/50 hover:shadow-md transition-all cursor-pointer group"
                        data-testid={`card-destination-${dest.slug}`}
                      >
                        {/* Flag Circle */}
                        <div className="w-12 h-12 rounded-full overflow-hidden bg-muted flex items-center justify-center flex-shrink-0 border-2 border-gray-100 dark:border-gray-700">
                          <ReactCountryFlag
                            countryCode={dest.countryCode}
                            svg
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover',
                            }}
                          />
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-foreground truncate group-hover:text-[#1e5427] dark:group-hover:text-[#3d9a4d] transition-colors">
                            {dest.name}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {t('destinations.startingFrom', 'Starting from')}{' '}
                            <span className="text-green-500 font-semibold">
                              {getCurrencySymbol(dest.currency || 'USD')}
                              {dest.minPrice}
                            </span>
                          </p>
                        </div>

                        {/* Chevron */}
                        <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-[#2c7338] transition-colors flex-shrink-0" />
                      </div>
                    </Link>
                  ))}
                </div>
              )}

              {/* No Results */}
              {!loadingDest && filteredDestinations?.length === 0 && (
                <div className="text-center py-16">
                  <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    {t('destinations.noResultsTitle', 'No destinations found')}
                  </h3>
                  <p className="text-muted-foreground">
                    {t('destinations.noResults', 'Try adjusting your search query')}
                  </p>
                </div>
              )}
            </>
          )}

          {/* Destinations Grid - Regions */}
          {activeTab === 'regions' && (
            <>
              {loadingRegions ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[...Array(6)].map((_, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-4 p-4 bg-card rounded-xl border border-border animate-pulse"
                    >
                      <div className="w-12 h-12 rounded-full bg-muted" />
                      <div className="flex-1">
                        <div className="h-5 w-24 bg-muted rounded mb-2" />
                        <div className="h-4 w-32 bg-muted rounded" />
                      </div>
                      <div className="w-5 h-5 bg-muted rounded" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredRegions?.map((region) => (
                    <Link key={region.id} href={`/region/${region.slug}`}>
                      <div
                        className="flex items-center gap-4 p-4 bg-card rounded-xl border border-border hover:border-[#3d9a4d] dark:hover:border-[#2c7338]/50 hover:shadow-md transition-all cursor-pointer group"
                        data-testid={`card-region-${region.slug}`}
                      >
                        {/* Globe Icon Circle */}
                        <div className="w-12 h-12 rounded-full overflow-hidden bg-gradient-to-br from-[#dcf0de] to-[#dcf0de] dark:from-[#194520]/30 dark:to-[#194520]/30 flex items-center justify-center flex-shrink-0 border-2 border-[#dcf0de] dark:border-[#1e5427]">
                          <Globe className="w-6 h-6 text-[#1e5427] dark:text-[#3d9a4d]" />
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-foreground truncate group-hover:text-[#1e5427] dark:group-hover:text-[#3d9a4d] transition-colors">
                            {region.name}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {t('destinations.startingFrom', 'Starting from')}{' '}
                            <span className="text-green-500 font-semibold">
                              {getCurrencySymbol(region.currency || 'USD')}
                              {region.minPrice}
                            </span>
                          </p>
                        </div>

                        {/* Chevron */}
                        <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-[#2c7338] transition-colors flex-shrink-0" />
                      </div>
                    </Link>
                  ))}
                </div>
              )}

              {/* No Results */}
              {!loadingRegions && filteredRegions?.length === 0 && (
                <div className="text-center py-16">
                  <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    {t('destinations.noResultsTitle', 'No regions found')}
                  </h3>
                  <p className="text-muted-foreground">
                    {t('destinations.noResults', 'Try adjusting your search query')}
                  </p>
                </div>
              )}
            </>
          )}

          {/* Destinations Grid - Global eSIMs */}
          {activeTab === 'global' && (
            <>
              {loadingGlobal ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[...Array(6)].map((_, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-4 p-4 bg-card rounded-xl border border-border animate-pulse"
                    >
                      <div className="w-12 h-12 rounded-full bg-muted" />
                      <div className="flex-1">
                        <div className="h-5 w-24 bg-muted rounded mb-2" />
                        <div className="h-4 w-32 bg-muted rounded" />
                      </div>
                      <div className="w-16 h-5 bg-muted rounded" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredGlobalPackages?.map((pkg) => (
                    <Link key={pkg.id} href="/global">
                      <div
                        className="flex items-center gap-4 p-4 bg-card rounded-xl border border-border hover:border-[#3d9a4d] dark:hover:border-[#2c7338]/50 hover:shadow-md transition-all cursor-pointer group"
                        data-testid={`card-global-${pkg.id}`}
                      >
                        {/* Globe Icon Circle */}
                        <div className="w-12 h-12 rounded-full overflow-hidden bg-gradient-to-br from-slate-100 to-slate-100 dark:from-slate-800 dark:to-slate-800 flex items-center justify-center flex-shrink-0 border-2 border-slate-200 dark:border-slate-700">
                          <Globe className="w-6 h-6 text-slate-600 dark:text-slate-400" />
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-foreground truncate group-hover:text-[#1e5427] dark:group-hover:text-[#3d9a4d] transition-colors">
                            Global ({pkg.dataAmount})
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {pkg.validity} {t('destinations.daysValidity', 'days validity')}
                          </p>
                        </div>

                        {/* Price */}
                        <div className="text-right flex-shrink-0">
                          <span className="text-green-500 font-semibold">
                            {getCurrencySymbol(currency)}
                            {parseFloat(pkg.retailPrice).toFixed(2)}
                          </span>
                          <span className="text-xs text-muted-foreground ml-1">{currency}</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}

              {/* No Results */}
              {!loadingGlobal && filteredGlobalPackages?.length === 0 && (
                <div className="text-center py-16">
                  <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                    <Globe className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    {t('destinations.noGlobalPackages', 'No Global eSIM packages found')}
                  </h3>
                  <p className="text-muted-foreground">
                    {t('destinations.noResults', 'Try adjusting your search query')}
                  </p>
                </div>
              )}
            </>
          )}

          {/* Destinations Grid - Passport */}
          {activeTab === 'passport' && (
            <div className="-mx-4 sm:-mx-6 lg:-mx-8">
              {/* Hero Section */}
              <div className="relative bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 rounded-2xl overflow-hidden mx-4 sm:mx-6 lg:mx-8 mb-8">
                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute top-0 right-0 w-96 h-96 bg-[#2c7338]/15 rounded-full blur-3xl" />
                  <div className="absolute bottom-0 left-0 w-72 h-72 bg-[#2c7338]/10 rounded-full blur-3xl" />
                </div>
                <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-8 p-8 md:p-12 lg:p-16">
                  <div className="flex flex-col justify-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#2c7338]/20 border border-[#2c7338]/30 mb-6 w-fit">
                      <Sparkles className="w-4 h-4 text-[#3d9a4d]" />
                      <span className="text-sm font-medium text-[#3d9a4d]">Limited First Batch — Pre-Book Now</span>
                    </div>
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight mb-4">
                      Simfinity{' '}
                      <span className="bg-gradient-to-r from-[#3d9a4d] to-[#2c7338] bg-clip-text text-transparent">
                        Passport
                      </span>
                    </h2>
                    <p className="text-lg text-slate-300 leading-relaxed mb-6">
                      The world's first AI-powered global travel connectivity device. Secure browsing, built-in power bank, and a personal AI concierge — everything you need to travel smarter.
                    </p>
                    <div className="flex flex-wrap items-center gap-4 mb-8">
                      <div className="flex items-center gap-2 text-slate-300 text-sm">
                        <Globe className="w-4 h-4 text-[#3d9a4d]" />
                        <span>190+ Countries</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-300 text-sm">
                        <Zap className="w-4 h-4 text-amber-400" />
                        <span>5000mAh Battery</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-300 text-sm">
                        <Shield className="w-4 h-4 text-blue-400" />
                        <span>DPN Protected</span>
                      </div>
                    </div>
                    <a href="#passport-prebook" className="btn-passport-cta inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-[#2c7338] to-[#3d9a4d] text-white font-semibold text-lg shadow-lg shadow-[#2c7338]/25 hover:shadow-xl transition-all hover:scale-[1.02] w-fit">
                      Reserve Your Device
                      <ChevronRight className="w-5 h-5" />
                    </a>
                  </div>
                  <div className="flex items-center justify-center">
                    <div className="relative">
                      <div className="absolute -inset-6 bg-gradient-to-r from-[#2c7338]/20 via-transparent to-[#2c7338]/20 rounded-3xl blur-xl" />
                      <img
                        src="/images/passport-device-1.png"
                        alt="Simfinity Passport Device"
                        className="relative w-full max-w-sm rounded-2xl"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Why Pre-Book */}
              <div className="px-4 sm:px-6 lg:px-8 mb-12">
                <div className="text-center mb-8">
                  <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-3">Why Pre-Book?</h3>
                  <p className="text-muted-foreground max-w-2xl mx-auto">Early users don't follow trends — they lead them. Secure your priority access today.</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                  {[
                    { icon: Zap, label: 'Priority Shipping', desc: 'Be first in line', from: 'from-blue-500', to: 'to-blue-600' },
                    { icon: Bot, label: 'Early AI Access', desc: 'AI Concierge priority', from: 'from-purple-500', to: 'to-purple-600' },
                    { icon: Star, label: 'Launch Pricing', desc: 'Exclusive pricing', from: 'from-amber-500', to: 'to-amber-600' },
                    { icon: Sparkles, label: "Founders' Badge", desc: 'Digital collector badge', from: 'from-rose-500', to: 'to-rose-600' },
                    { icon: Shield, label: 'Premium Features', desc: 'First firmware updates', from: 'from-cyan-500', to: 'to-cyan-600' },
                  ].map((item) => (
                    <div key={item.label} className="flex flex-col items-center text-center p-5 rounded-xl bg-card border border-border hover:border-[#3d9a4d]/50 transition-colors">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.from} ${item.to} flex items-center justify-center mb-3`}>
                        <item.icon className="w-6 h-6 text-white" />
                      </div>
                      <h4 className="font-semibold text-foreground text-sm mb-1">{item.label}</h4>
                      <p className="text-xs text-muted-foreground">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Core Features */}
              <div className="px-4 sm:px-6 lg:px-8 mb-12">
                <div className="text-center mb-8">
                  <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-3">Built for the Modern Traveler</h3>
                  <p className="text-muted-foreground max-w-2xl mx-auto">One device. Every feature you need across borders.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Security Card */}
                  <div className="rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 p-8 border border-blue-100 dark:border-blue-900/30">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center mb-5">
                      <Shield className="w-7 h-7 text-white" />
                    </div>
                    <h4 className="text-xl font-bold text-foreground mb-3">Travel Without Fear</h4>
                    <ul className="space-y-2.5">
                      {[
                        'Built-in DPN (Decentralized Private Network)',
                        'Encrypted browsing on all connections',
                        'Protection on public WiFi',
                        'Remote device lock',
                        'Secure eSIM architecture',
                      ].map((item) => (
                        <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <CheckCircle2 className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* AI Concierge Card */}
                  <div className="rounded-2xl bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 p-8 border border-purple-100 dark:border-purple-900/30">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center mb-5">
                      <Bot className="w-7 h-7 text-white" />
                    </div>
                    <h4 className="text-xl font-bold text-foreground mb-3">AI Travel Concierge</h4>
                    <p className="text-sm text-muted-foreground mb-4">Your personal AI assistant can arrange everything from one ecosystem:</p>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { icon: Plane, label: 'Flights' },
                        { icon: Hotel, label: 'Hotels' },
                        { icon: Car, label: 'Luxury Cars' },
                        { icon: Star, label: 'Events' },
                      ].map((s) => (
                        <div key={s.label} className="flex items-center gap-2 text-sm text-muted-foreground bg-white/50 dark:bg-white/5 rounded-lg px-3 py-2">
                          <s.icon className="w-4 h-4 text-purple-500" />
                          <span>{s.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Sustainability Card */}
                  <div className="rounded-2xl bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 p-8 border border-green-100 dark:border-green-900/30">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center mb-5">
                      <TreePine className="w-7 h-7 text-white" />
                    </div>
                    <h4 className="text-xl font-bold text-foreground mb-3">Travel That Gives Back</h4>
                    <p className="text-sm text-muted-foreground mb-4">Every eSIM activated plants one tree. Your connectivity creates real environmental impact.</p>
                    <div className="bg-white/60 dark:bg-white/5 rounded-xl p-4 text-center">
                      <div className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-500 bg-clip-text text-transparent mb-1">1 eSIM = 1 Tree</div>
                      <p className="text-xs text-muted-foreground">Join the movement from day one</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* What's in the Box */}
              <div className="px-4 sm:px-6 lg:px-8 mb-12">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                  <div>
                    <img
                      src="/images/passport-device-2.png"
                      alt="What's inside the Simfinity Passport box"
                      className="w-full rounded-2xl"
                    />
                  </div>
                  <div>
                    <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-6">What's Inside the Box</h3>
                    <div className="space-y-4">
                      {[
                        { icon: Package, label: 'Simfinity Passport Device', desc: 'Premium connectivity device with built-in global eSIM support' },
                        { icon: BatteryFull, label: '5000mAh Power Bank', desc: 'Built-in battery to keep your devices charged on the go' },
                        { icon: Zap, label: 'Premium Charging Cable', desc: 'High-quality USB-C cable for fast charging' },
                        { icon: Globe, label: 'Quick-Start Guide', desc: 'Easy setup instructions to get connected in minutes' },
                        { icon: Lock, label: 'Early Access Activation Code', desc: 'Exclusive code for priority activation and AI concierge access' },
                      ].map((item) => (
                        <div key={item.label} className="flex items-start gap-4 p-4 rounded-xl bg-card border border-border">
                          <div className="w-10 h-10 rounded-lg bg-[#2c7338]/10 flex items-center justify-center flex-shrink-0">
                            <item.icon className="w-5 h-5 text-[#2c7338]" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-foreground">{item.label}</h4>
                            <p className="text-sm text-muted-foreground">{item.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Who It's For */}
              <div className="px-4 sm:px-6 lg:px-8 mb-12">
                <div className="text-center mb-8">
                  <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-3">Designed for Global Explorers</h3>
                  <p className="text-muted-foreground">If you move across borders — this is for you.</p>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  {[
                    { icon: Wifi, label: 'Digital Nomads', desc: 'Work from anywhere' },
                    { icon: Briefcase, label: 'Business Travelers', desc: 'Stay productive' },
                    { icon: Plane, label: 'Frequent Flyers', desc: 'Always connected' },
                    { icon: Backpack, label: 'Backpackers', desc: 'Explore freely' },
                    { icon: Star, label: 'Luxury Travelers', desc: 'Premium experience' },
                  ].map((persona) => (
                    <div key={persona.label} className="flex flex-col items-center text-center p-6 rounded-2xl bg-gradient-to-b from-card to-muted/30 border border-border hover:border-[#3d9a4d]/50 transition-all hover:shadow-md">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#2c7338]/10 to-[#3d9a4d]/10 flex items-center justify-center mb-3">
                        <persona.icon className="w-7 h-7 text-[#2c7338]" />
                      </div>
                      <h4 className="font-semibold text-foreground text-sm mb-1">{persona.label}</h4>
                      <p className="text-xs text-muted-foreground">{persona.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Lifestyle Image Banner */}
              <div className="px-4 sm:px-6 lg:px-8 mb-12">
                <div className="relative rounded-2xl overflow-hidden">
                  <img
                    src="/images/passport-device-3.png"
                    alt="Travel with Simfinity Passport"
                    className="w-full h-64 md:h-80 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-slate-950/40 to-transparent flex items-center">
                    <div className="p-8 md:p-12 max-w-lg">
                      <h3 className="text-2xl md:text-3xl font-bold text-white mb-3">The Future of Travel Is Here</h3>
                      <p className="text-slate-200 text-sm md:text-base">Before it goes global. Before it sells out. Before everyone has it. You get first access.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Pre-Book CTA */}
              <div id="passport-prebook" className="px-4 sm:px-6 lg:px-8 mb-8">
                <div className="rounded-2xl bg-gradient-to-br from-[#2c7338] via-[#1e5427] to-[#194520] p-8 md:p-12 text-center relative overflow-hidden">
                  <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full blur-3xl" />
                  </div>
                  <div className="relative z-10">
                    <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-4">Pre-Book Your Simfinity Passport</h3>
                    <p className="text-green-100 text-lg mb-2 max-w-2xl mx-auto">
                      Be first. Travel smarter. Stay protected.
                    </p>
                    <p className="text-green-200/70 text-sm mb-8 max-w-xl mx-auto">
                      The first production run is limited. Pre-booking secures your place in the first wave with priority activation and exclusive early benefits.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                      <button className="btn-passport-cta inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-white text-[#1e5427] font-bold text-lg shadow-lg hover:shadow-xl transition-all hover:scale-[1.02]">
                        Reserve Your Device Now
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </div>
                    <div className="flex flex-wrap items-center justify-center gap-6 mt-8 text-green-100 text-sm">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Priority Shipping</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Exclusive Launch Pricing</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Founders' Edition Badge</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* <SiteFooter /> */}
    </div>
  );
}
