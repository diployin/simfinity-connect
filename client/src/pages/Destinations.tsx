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
    <div className="min-h-screen bg-background dark:bg-gray-950 flex flex-col transition-colors duration-300">
      <Helmet>
        <title>
          {String(
            t('destinations.title', 'Browse eSIM Destinations - 190+ Countries | Voltey'),
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
            <Badge className="mb-4 bg-primary-second dark:bg-primary/20 hover:bg-primary-second dark:hover:bg-primary/30 text-white dark:text-white/90 px-4 py-1.5 rounded-full border-none shadow-sm">
              <Globe className="h-3.5 w-3.5 mr-1.5 text-white dark:text-white/90" />
              {t('destinations.globalCoverage', 'Global Coverage')}
            </Badge>

            <h1 className="text-3xl md:text-4xl font-bold text-foreground dark:text-white mb-4">
              {t('destinations.allDestinations', 'All Destinations')}
            </h1>

            <p className="text-muted-foreground dark:text-gray-400 max-w-2xl mx-auto">
              {t(
                'destinations.heroDescription',
                'Find the best data plans across 200+ destinations and enjoy secure, seamless internet wherever you travel. Connect instantly with Voltey eSIM',
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
                    className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${activeTab === 'all'
                      ? 'bg-primary-second dark:bg-primary text-white shadow-md'
                      : 'bg-muted dark:bg-gray-900 text-muted-foreground dark:text-gray-400 hover:bg-muted/80 dark:hover:bg-gray-800'
                      }`}
                    data-testid="tab-all"
                  >
                    {t('destinations.all', 'All')} (
                    {(filteredDestinations?.length || 0) + (filteredRegions?.length || 0)})
                  </button>
                  <button
                    onClick={() => handleTabChange('countries')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${activeTab === 'countries'
                      ? 'bg-primary-second dark:bg-primary text-white shadow-md'
                      : 'bg-muted dark:bg-gray-900 text-muted-foreground dark:text-gray-400 hover:bg-muted/80 dark:hover:bg-gray-800'
                      }`}
                    data-testid="tab-countries"
                  >
                    <MapPin className="h-3.5 w-3.5 shrink-0" />
                    {t('destinations.countries', 'Countries')}
                  </button>
                  <button
                    onClick={() => handleTabChange('regions')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${activeTab === 'regions'
                      ? 'bg-primary-second dark:bg-primary text-white shadow-md'
                      : 'bg-muted dark:bg-gray-900 text-muted-foreground dark:text-gray-400 hover:bg-muted/80 dark:hover:bg-gray-800'
                      }`}
                    data-testid="tab-regions"
                  >
                    <Globe className="h-3.5 w-3.5 shrink-0" />
                    {t('destinations.regionalEsims', 'Regional eSIMs')}
                  </button>
                  <button
                    onClick={() => handleTabChange('global')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${activeTab === 'global'
                      ? 'bg-primary-second dark:bg-primary text-white shadow-md'
                      : 'bg-muted dark:bg-gray-900 text-muted-foreground dark:text-gray-400 hover:bg-muted/80 dark:hover:bg-gray-800'
                      }`}
                    data-testid="tab-global"
                  >
                    <Globe className="h-3.5 w-3.5 shrink-0" />
                    {t('destinations.globalEsims', 'Global eSIMs')}
                  </button>
                  <button
                    onClick={() => handleTabChange('passport')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${activeTab === 'passport'
                      ? 'bg-primary-second dark:bg-primary text-white shadow-md'
                      : 'bg-muted dark:bg-gray-900 text-muted-foreground dark:text-gray-400 hover:bg-muted/80 dark:hover:bg-gray-800'
                      }`}
                    data-testid="tab-passport"
                  >
                    <Ticket className="h-3.5 w-3.5 shrink-0" />
                    Voltey Passport
                  </button>
                </div>
              </div>
            </div>

            {/* Search Bar */}
            <div className="relative max-w-xs w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground dark:text-gray-500" />
              <Input
                type="text"
                placeholder={t('destinations.searchPlaceholder', 'Search for destination')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-10 py-2 h-10 text-sm bg-card dark:bg-gray-900 border-border dark:border-gray-800 rounded-full dark:text-white dark:placeholder:text-gray-500 shadow-sm focus:ring-primary/20"
                data-testid="input-search-destinations"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-muted dark:hover:bg-gray-800 transition-colors"
                  data-testid="button-clear-search"
                >
                  <X className="h-4 w-4 text-muted-foreground dark:text-gray-500" />
                </button>
              )}
            </div>
          </div>

          {/* Results Count */}
          {activeTab !== 'passport' && (
            <p className="text-muted-foreground dark:text-gray-400 text-sm mb-6 font-medium" data-testid="text-destination-count">
              {t('destinations.showing', 'Showing')} <span className="text-foreground dark:text-white">{totalCount}</span> {activeTab}
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
                      className="flex items-center gap-4 p-4 bg-card dark:bg-gray-900 rounded-xl border border-border dark:border-gray-800 animate-pulse"
                    >
                      <div className="w-12 h-12 rounded-full bg-muted dark:bg-gray-800" />
                      <div className="flex-1">
                        <div className="h-5 w-24 bg-muted dark:bg-gray-800 rounded mb-2" />
                        <div className="h-4 w-32 bg-muted dark:bg-gray-800 rounded" />
                      </div>
                      <div className="w-5 h-5 bg-muted dark:bg-gray-800 rounded" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {/* Countries */}
                  {filteredDestinations?.map((dest) => (
                    <Link key={dest.id} href={`/destination/${dest.slug}`}>
                      <div
                        className="flex items-center gap-4 p-4 bg-card dark:bg-gray-900 rounded-xl border border-border dark:border-gray-800 hover:border-[var(--primary-light)] dark:hover:border-primary/50 hover:shadow-md transition-all cursor-pointer group"
                        data-testid={`card-destination-${dest.slug}`}
                      >
                        <div className="w-12 h-12 rounded-full overflow-hidden bg-muted dark:bg-gray-800 flex items-center justify-center flex-shrink-0 border-2 border-gray-100 dark:border-gray-700">
                          {dest.image ? (
                            <img
                              src={dest.image}
                              alt={dest.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <ReactCountryFlag
                              countryCode={dest.countryCode}
                              svg
                              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-foreground dark:text-white truncate group-hover:text-primary-second dark:group-hover:text-primary-light transition-colors">
                            {dest.name}
                          </h3>
                          <p className="text-sm text-muted-foreground dark:text-gray-400">
                            {t('destinations.startingFrom', 'Starting from')}{' '}
                            <span className="text-sm text-black dark:text-white font-semibold group-hover:underline group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                              {getCurrencySymbol(dest.currency || 'USD')}
                              {dest.minPrice}
                            </span>
                          </p>
                        </div>
                        <ChevronRight className="w-5 h-5 text-muted-foreground dark:text-gray-500 group-hover:text-primary transition-colors flex-shrink-0" />
                      </div>
                    </Link>
                  ))}
                  {/* Regions */}
                  {filteredRegions?.map((region) => (
                    <Link key={region.id} href={`/region/${region.slug}`}>
                      <div
                        className="flex items-center gap-4 p-4 bg-card dark:bg-gray-900 rounded-xl border border-border dark:border-gray-800 hover:border-[var(--primary-light)] dark:hover:border-primary/50 hover:shadow-md transition-all cursor-pointer group"
                        data-testid={`card-region-${region.slug}`}
                      >
                        <div className="w-12 h-12 rounded-full overflow-hidden bg-gradient-to-br from-primary/10 to-primary/10 dark:from-primary/20 dark:to-primary/10 flex items-center justify-center flex-shrink-0 border-2 border-primary/10 dark:border-primary/30">
                          {region.image ? (
                            <img
                              src={region.image}
                              alt={region.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <Globe className="w-6 h-6 text-primary-second dark:text-primary-light" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-foreground dark:text-white truncate group-hover:text-primary-second dark:group-hover:text-primary-light transition-colors">
                            {region.name}
                          </h3>
                          <p className="text-sm text-muted-foreground dark:text-gray-400">
                            {t('destinations.startingFrom', 'Starting from')}{' '}
                            <span className="text-sm text-black dark:text-white font-semibold group-hover:underline group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                              {getCurrencySymbol(region.currency || 'USD')}
                              {region.minPrice}
                            </span>
                          </p>
                        </div>
                        <ChevronRight className="w-5 h-5 text-muted-foreground dark:text-gray-500 group-hover:text-primary transition-colors flex-shrink-0" />
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
                    <div className="w-16 h-16 bg-muted dark:bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-4 border border-border dark:border-gray-800 shadow-inner">
                      <Search className="w-8 h-8 text-muted-foreground dark:text-gray-500" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground dark:text-white mb-2">
                      {t('destinations.noResultsTitle', 'No destinations found')}
                    </h3>
                    <p className="text-muted-foreground dark:text-gray-400">
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
                      className="flex items-center gap-4 p-4 bg-card dark:bg-gray-900 rounded-xl border border-border dark:border-gray-800 animate-pulse"
                    >
                      <div className="w-12 h-12 rounded-full bg-muted dark:bg-gray-800" />
                      <div className="flex-1">
                        <div className="h-5 w-24 bg-muted dark:bg-gray-800 rounded mb-2" />
                        <div className="h-4 w-32 bg-muted dark:bg-gray-800 rounded" />
                      </div>
                      <div className="w-5 h-5 bg-muted dark:bg-gray-800 rounded" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredDestinations?.map((dest) => (
                    <Link key={dest.id} href={`/destination/${dest.slug}`}>
                      <div
                        className="flex items-center gap-4 p-4 bg-card dark:bg-gray-900 rounded-xl border border-border dark:border-gray-800 hover:border-[var(--primary-light)] dark:hover:border-primary/50 hover:shadow-md transition-all cursor-pointer group"
                        data-testid={`card-destination-${dest.slug}`}
                      >
                        {/* Flag Circle */}
                        <div className="w-12 h-12 rounded-full overflow-hidden bg-muted dark:bg-gray-800 flex items-center justify-center flex-shrink-0 border-2 border-gray-100 dark:border-gray-700">
                          {dest.image ? (
                            <img
                              src={dest.image}
                              alt={dest.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <ReactCountryFlag
                              countryCode={dest.countryCode}
                              svg
                              style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                              }}
                            />
                          )}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-foreground dark:text-white truncate group-hover:text-primary-second dark:group-hover:text-primary-light transition-colors">
                            {dest.name}
                          </h3>
                          <p className="text-sm text-muted-foreground dark:text-gray-400">
                            {t('destinations.startingFrom', 'Starting from')}{' '}
                            <span className="text-sm text-black dark:text-white font-semibold group-hover:underline group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                              {getCurrencySymbol(dest.currency || 'USD')}
                              {dest.minPrice}
                            </span>
                          </p>
                        </div>

                        {/* Chevron */}
                        <ChevronRight className="w-5 h-5 text-muted-foreground dark:text-gray-500 group-hover:text-primary transition-colors flex-shrink-0" />
                      </div>
                    </Link>
                  ))}
                </div>
              )}

              {/* No Results */}
              {!loadingDest && filteredDestinations?.length === 0 && (
                <div className="text-center py-16">
                  <div className="w-16 h-16 bg-muted dark:bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-4 border border-border dark:border-gray-800 shadow-inner">
                    <Search className="w-8 h-8 text-muted-foreground dark:text-gray-500" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground dark:text-white mb-2">
                    {t('destinations.noResultsTitle', 'No destinations found')}
                  </h3>
                  <p className="text-muted-foreground dark:text-gray-400">
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
                      className="flex items-center gap-4 p-4 bg-card dark:bg-gray-900 rounded-xl border border-border dark:border-gray-800 animate-pulse"
                    >
                      <div className="w-12 h-12 rounded-full bg-muted dark:bg-gray-800" />
                      <div className="flex-1">
                        <div className="h-5 w-24 bg-muted dark:bg-gray-800 rounded mb-2" />
                        <div className="h-4 w-32 bg-muted dark:bg-gray-800 rounded" />
                      </div>
                      <div className="w-5 h-5 bg-muted dark:bg-gray-800 rounded" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredRegions?.map((region) => (
                    <Link key={region.id} href={`/region/${region.slug}`}>
                      <div
                        className="flex items-center gap-4 p-4 bg-card dark:bg-gray-900 rounded-xl border border-border dark:border-gray-800 hover:border-[var(--primary-light)] dark:hover:border-primary/50 hover:shadow-md transition-all cursor-pointer group"
                        data-testid={`card-region-${region.slug}`}
                      >
                        {/* Globe Icon Circle */}
                        <div className="w-12 h-12 rounded-full overflow-hidden bg-gradient-to-br from-primary/10 to-primary/10 dark:from-primary/20 dark:to-primary/10 flex items-center justify-center flex-shrink-0 border-2 border-primary/10 dark:border-primary/30">
                          {region.image ? (
                            <img
                              src={region.image}
                              alt={region.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <Globe className="w-6 h-6 text-primary-second dark:text-primary-light" />
                          )}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-foreground dark:text-white truncate group-hover:text-primary-second dark:group-hover:text-primary-light transition-colors">
                            {region.name}
                          </h3>
                          <p className="text-sm text-muted-foreground dark:text-gray-400">
                            {t('destinations.startingFrom', 'Starting from')}{' '}
                            <span className="text-sm text-black dark:text-white font-semibold group-hover:underline group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                              {getCurrencySymbol(region.currency || 'USD')}
                              {region.minPrice}
                            </span>
                          </p>
                        </div>

                        {/* Chevron */}
                        <ChevronRight className="w-5 h-5 text-muted-foreground dark:text-gray-500 group-hover:text-primary transition-colors flex-shrink-0" />
                      </div>
                    </Link>
                  ))}
                </div>
              )}

              {/* No Results */}
              {!loadingRegions && filteredRegions?.length === 0 && (
                <div className="text-center py-16">
                  <div className="w-16 h-16 bg-muted dark:bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-4 border border-border dark:border-gray-800 shadow-inner">
                    <Search className="w-8 h-8 text-muted-foreground dark:text-gray-500" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground dark:text-white mb-2">
                    {t('destinations.noResultsTitle', 'No destinations found')}
                  </h3>
                  <p className="text-muted-foreground dark:text-gray-400">
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
                      className="flex items-center gap-4 p-4 bg-card dark:bg-gray-900 rounded-xl border border-border dark:border-gray-800 animate-pulse"
                    >
                      <div className="w-12 h-12 rounded-full bg-muted dark:bg-gray-800" />
                      <div className="flex-1">
                        <div className="h-5 w-24 bg-muted dark:bg-gray-800 rounded mb-2" />
                        <div className="h-4 w-32 bg-muted dark:bg-gray-800 rounded" />
                      </div>
                      <div className="w-16 h-5 bg-muted dark:bg-gray-800 rounded" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredGlobalPackages?.map((pkg) => (
                    <Link key={pkg.id} href="/global">
                      <div
                        className="flex items-center gap-4 p-4 bg-card dark:bg-gray-900 rounded-xl border border-border dark:border-gray-800 hover:border-[var(--primary-light)] dark:hover:border-primary/50 hover:shadow-md transition-all cursor-pointer group"
                        data-testid={`card-global-${pkg.id}`}
                      >
                        {/* Globe Icon Circle */}
                        <div className="w-12 h-12 rounded-full overflow-hidden bg-gradient-to-br from-slate-100 to-slate-100 dark:from-gray-800 dark:to-gray-800 flex items-center justify-center flex-shrink-0 border-2 border-slate-200 dark:border-gray-700">
                          <Globe className="w-6 h-6 text-slate-600 dark:text-gray-400" />
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-foreground dark:text-white truncate group-hover:text-primary-second dark:group-hover:text-primary-light transition-colors">
                            Global ({pkg.dataAmount})
                          </h3>
                          <p className="text-sm text-muted-foreground dark:text-gray-400">
                            {pkg.validity} {t('destinations.daysValidity', 'days validity')}
                          </p>
                        </div>

                        {/* Price */}
                        <div className="text-right flex-shrink-0">
                          <span className="text-sm text-black dark:text-white font-semibold group-hover:underline group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                            {getCurrencySymbol(currency)}
                            {parseFloat(pkg.retailPrice).toFixed(2)}
                          </span>
                          <span className="text-xs text-muted-foreground dark:text-gray-500 ml-1">{currency}</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}

              {/* No Results */}
              {!loadingGlobal && filteredGlobalPackages?.length === 0 && (
                <div className="text-center py-16">
                  <div className="w-16 h-16 bg-muted dark:bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-4 border border-border dark:border-gray-800 shadow-inner">
                    <Globe className="w-8 h-8 text-muted-foreground dark:text-gray-500" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground dark:text-white mb-2">
                    {t('destinations.noGlobalPackages', 'No Global eSIM packages found')}
                  </h3>
                  <p className="text-muted-foreground dark:text-gray-400">
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
              <div className="relative bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 rounded-2xl overflow-hidden mx-4 sm:mx-6 lg:mx-8 mb-8 border border-gray-800 shadow-2xl">
                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute top-0 right-0 w-96 h-96 bg-[var(--primary)]/15 rounded-full blur-3xl" />
                  <div className="absolute bottom-0 left-0 w-72 h-72 bg-[var(--primary)]/10 rounded-full blur-3xl" />
                </div>
                <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-8 p-8 md:p-12 lg:p-16">
                  <div className="flex flex-col justify-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--primary)]/20 border border-[var(--primary)]/30 mb-6 w-fit shadow-inner">
                      <Sparkles className="w-4 h-4 text-[var(--primary-light)]" />
                      <span className="text-sm font-medium text-[var(--primary-light)]">{t('destinations.passport.badge', 'Limited First Batch — Pre-Book Now')}</span>
                    </div>
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight mb-4 tracking-tight">
                      Voltey{' '}
                      <span className="bg-gradient-to-r from-[var(--primary-light)] to-[var(--primary)] bg-clip-text text-transparent">{t('destinations.passport.title', 'Passport')}</span>
                    </h2>
                    <p className="text-lg text-slate-300 leading-relaxed mb-6">
                      The world's first AI-powered global travel connectivity device. Secure browsing, built-in power bank, and a personal AI concierge — everything you need to travel smarter.
                    </p>
                    <div className="flex flex-wrap items-center gap-4 mb-8">
                      <div className="flex items-center gap-2 text-slate-300 text-sm bg-white/5 px-3 py-1.5 rounded-full border border-white/10">
                        <Globe className="w-4 h-4 text-[var(--primary-light)]" />
                        <span>{t('destinations.passport.countries', '190+ Countries')}</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-300 text-sm bg-white/5 px-3 py-1.5 rounded-full border border-white/10">
                        <Zap className="w-4 h-4 text-amber-400" />
                        <span>{t('destinations.passport.battery', '5000mAh Battery')}</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-300 text-sm bg-white/5 px-3 py-1.5 rounded-full border border-white/10">
                        <Shield className="w-4 h-4 text-blue-400" />
                        <span>{t('destinations.passport.dpn', 'DPN Protected')}</span>
                      </div>
                    </div>
                    <a href="#passport-prebook" className="btn-passport-cta inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-[var(--primary)] to-[var(--primary-light)] text-white font-semibold text-lg shadow-lg shadow-[var(--primary)]/25 hover:shadow-xl transition-all hover:scale-[1.02] w-fit">{t('destinations.passport.reserve', 'Reserve Your Device')}<ChevronRight className="w-5 h-5" />
                    </a>
                  </div>
                  <div className="flex items-center justify-center">
                    <div className="relative group">
                      <div className="absolute -inset-6 bg-gradient-to-r from-[var(--primary)]/20 via-transparent to-[var(--primary)]/20 rounded-3xl blur-xl group-hover:opacity-100 transition-opacity" />
                      <img
                        src="/images/passport-device-1.png"
                        alt="Voltey Passport Device"
                        className="relative w-full max-w-sm rounded-2xl transform transition-transform group-hover:scale-[1.03] duration-500"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Why Pre-Book */}
              <div className="px-4 sm:px-6 lg:px-8 mb-12">
                <div className="text-center mb-8">
                  <h3 className="text-2xl md:text-3xl font-bold text-foreground dark:text-white mb-3">{t('destinations.passport.whyTitle', 'Why Pre-Book?')}</h3>
                  <p className="text-muted-foreground dark:text-gray-400 max-w-2xl mx-auto">Early users don't follow trends — they lead them. Secure your priority access today.</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                  {[
                    { icon: Zap, label: 'Priority Shipping', desc: 'Be first in line', from: 'from-blue-500', to: 'to-blue-600' },
                    { icon: Bot, label: 'Early AI Access', desc: 'AI Concierge priority', from: 'from-purple-500', to: 'to-purple-600' },
                    { icon: Star, label: 'Launch Pricing', desc: 'Exclusive pricing', from: 'from-amber-500', to: 'to-amber-600' },
                    { icon: Sparkles, label: "Founders' Badge", desc: 'Digital collector badge', from: 'from-rose-500', to: 'to-rose-600' },
                    { icon: Shield, label: 'Premium Features', desc: 'First firmware updates', from: 'from-cyan-500', to: 'to-cyan-600' },
                  ].map((item) => (
                    <div key={item.label} className="flex flex-col items-center text-center p-5 rounded-xl bg-card dark:bg-gray-900 border border-border dark:border-gray-800 hover:border-primary/50 dark:hover:border-primary/50 transition-all shadow-sm hover:shadow-md">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.from} ${item.to} flex items-center justify-center mb-3 shadow-lg shadow-black/5`}>
                        <item.icon className="w-6 h-6 text-white" />
                      </div>
                      <h4 className="font-semibold text-foreground dark:text-white text-sm mb-1">{item.label}</h4>
                      <p className="text-xs text-muted-foreground dark:text-gray-400">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Core Features */}
              <div className="px-4 sm:px-6 lg:px-8 mb-12">
                <div className="text-center mb-8">
                  <h3 className="text-2xl md:text-3xl font-bold text-foreground dark:text-white mb-3">{t('destinations.passport.modernTraveler.title', 'Built for the Modern Traveler')}</h3>
                  <p className="text-muted-foreground dark:text-gray-400 max-w-2xl mx-auto">{t('destinations.passport.modernTraveler.subtitle', 'One device. Every feature you need across borders.')}</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Security Card */}
                  <div className="rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 p-8 border border-blue-100 dark:border-blue-900/30 shadow-sm">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center mb-5 shadow-lg shadow-blue-500/20">
                      <Shield className="w-7 h-7 text-white" />
                    </div>
                    <h4 className="text-xl font-bold text-foreground dark:text-white mb-3">{t('destinations.passport.security.title', 'Travel Without Fear')}</h4>
                    <ul className="space-y-2.5">
                      {[
                        'Built-in DPN (Decentralized Private Network)',
                        'Encrypted browsing on all connections',
                        'Protection on public WiFi',
                        'Remote device lock',
                        'Secure eSIM architecture',
                      ].map((item) => (
                        <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground dark:text-gray-400">
                          <CheckCircle2 className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* AI Concierge Card */}
                  <div className="rounded-2xl bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 p-8 border border-purple-100 dark:border-purple-900/30 shadow-sm">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center mb-5 shadow-lg shadow-purple-500/20">
                      <Bot className="w-7 h-7 text-white" />
                    </div>
                    <h4 className="text-xl font-bold text-foreground dark:text-white mb-3">{t('destinations.passport.aiConcierge.title', 'AI Travel Concierge')}</h4>
                    <p className="text-sm text-muted-foreground dark:text-gray-400 mb-4">{t('destinations.passport.aiConcierge.subtitle', 'Your personal AI assistant can arrange everything from one ecosystem:')}</p>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { icon: Plane, label: 'Flights' },
                        { icon: Hotel, label: 'Hotels' },
                        { icon: Car, label: 'Luxury Cars' },
                        { icon: Star, label: 'Events' },
                      ].map((s) => (
                        <div key={s.label} className="flex items-center gap-2 text-sm text-muted-foreground dark:text-gray-300 bg-white/50 dark:bg-black/20 rounded-lg px-3 py-2 border border-black/5 dark:border-white/5">
                          <s.icon className="w-4 h-4 text-purple-500" />
                          <span>{s.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Sustainability Card */}
                  <div className="rounded-2xl bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 p-8 border border-green-100 dark:border-green-900/30 shadow-sm">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center mb-5 shadow-lg shadow-green-500/20">
                      <TreePine className="w-7 h-7 text-white" />
                    </div>
                    <h4 className="text-xl font-bold text-foreground dark:text-white mb-3">{t('destinations.passport.sustainability.title', 'Travel That Gives Back')}</h4>
                    <p className="text-sm text-muted-foreground dark:text-gray-400 mb-4">{t('destinations.passport.sustainability.description', 'Every eSIM activated plants one tree. Your connectivity creates real environmental impact.')}</p>
                    <div className="bg-white/60 dark:bg-black/20 rounded-xl p-4 text-center border border-black/5 dark:border-white/5 shadow-inner">
                      <div className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-500 bg-clip-text text-transparent mb-1">{t('destinations.passport.sustainability.math', '1 eSIM = 1 Tree')}</div>
                      <p className="text-xs text-muted-foreground dark:text-gray-500">{t('destinations.passport.sustainability.mathdesc', 'Join the movement from day one')}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* What's in the Box */}
              <div className="px-4 sm:px-6 lg:px-8 mb-12">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                  <div className="relative group">
                    <div className="absolute inset-0 bg-primary/10 rounded-2xl blur-2xl group-hover:opacity-100 transition-opacity duration-700" />
                    <img
                      src="/images/passport-device-2.png"
                      alt="What's inside the Voltey Passport box"
                      className="relative w-full rounded-2xl shadow-xl transition-transform duration-500 group-hover:scale-[1.01]"
                    />
                  </div>
                  <div>
                    <h3 className="text-2xl md:text-3xl font-bold text-foreground dark:text-white mb-6">What's Inside the Box</h3>
                    <div className="space-y-4">
                      {[
                        { icon: Package, label: 'Voltey Passport Device', desc: 'Premium connectivity device with built-in global eSIM support' },
                        { icon: BatteryFull, label: '5000mAh Power Bank', desc: 'Built-in battery to keep your devices charged on the go' },
                        { icon: Zap, label: 'Premium Charging Cable', desc: 'High-quality USB-C cable for fast charging' },
                        { icon: Globe, label: 'Quick-Start Guide', desc: 'Easy setup instructions to get connected in minutes' },
                        { icon: Lock, label: 'Early Access Activation Code', desc: 'Exclusive code for priority activation and AI concierge access' },
                      ].map((item) => (
                        <div key={item.label} className="flex items-start gap-4 p-4 rounded-xl bg-card dark:bg-gray-900 border border-border dark:border-gray-800 shadow-sm transition-all hover:bg-muted dark:hover:bg-gray-800/50">
                          <div className="w-10 h-10 rounded-lg bg-[var(--primary)]/10 dark:bg-primary/20 flex items-center justify-center flex-shrink-0 border border-primary/10 dark:border-primary/20">
                            <item.icon className="w-5 h-5 text-[var(--primary)] dark:text-primary-light" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-foreground dark:text-white text-base">{item.label}</h4>
                            <p className="text-sm text-muted-foreground dark:text-gray-400">{item.desc}</p>
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
                  <h3 className="text-2xl md:text-3xl font-bold text-foreground dark:text-white mb-3">{t('destinations.passport.explorers.title', 'Designed for Global Explorers')}</h3>
                  <p className="text-muted-foreground dark:text-gray-400">{t('destinations.passport.explorers.subtitle', 'If you move across borders — this is for you.')}</p>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  {[
                    { icon: Wifi, label: 'Digital Nomads', desc: 'Work from anywhere' },
                    { icon: Briefcase, label: 'Business Travelers', desc: 'Stay productive' },
                    { icon: Plane, label: 'Frequent Flyers', desc: 'Always connected' },
                    { icon: Backpack, label: 'Backpackers', desc: 'Explore freely' },
                    { icon: Star, label: 'Luxury Travelers', desc: 'Premium experience' },
                  ].map((persona) => (
                    <div key={persona.label} className="flex flex-col items-center text-center p-6 rounded-2xl bg-gradient-to-b from-card to-muted/30 dark:from-gray-900 dark:to-gray-950 border border-border dark:border-gray-800 hover:border-primary/50 dark:hover:border-primary/50 transition-all hover:shadow-md hover:-translate-y-1">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[var(--primary)]/10 to-[var(--primary-light)]/10 dark:from-primary/20 dark:to-primary/10 flex items-center justify-center mb-3 shadow-lg shadow-black/5">
                        <persona.icon className="w-7 h-7 text-[var(--primary)] dark:text-primary-light" />
                      </div>
                      <h4 className="font-semibold text-foreground dark:text-white text-sm mb-1">{persona.label}</h4>
                      <p className="text-xs text-muted-foreground dark:text-gray-400">{persona.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Lifestyle Image Banner */}
              <div className="px-4 sm:px-6 lg:px-8 mb-12">
                <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-white/5">
                  <img
                    src="/images/passport-device-3.png"
                    alt="Travel with Voltey Passport"
                    className="w-full h-64 md:h-80 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/40 to-transparent flex items-center">
                    <div className="p-8 md:p-12 max-w-lg">
                      <h3 className="text-2xl md:text-3xl font-bold text-white mb-3 tracking-tight">{t('destinations.passport.futureTitle', 'The Future of Travel Is Here')}</h3>
                      <p className="text-slate-200 text-sm md:text-base leading-relaxed opacity-90">{t('destinations.passport.futureSubtitle', 'Before it goes global. Before it sells out. Before everyone has it. You get first access.')}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Pre-Book CTA */}
              <div id="passport-prebook" className="px-4 sm:px-6 lg:px-8 mb-8">
                <div className="rounded-2xl bg-gradient-to-br from-[var(--primary)] via-primary-second to-[var(--primary-dark)] dark:from-primary dark:via-primary-second dark:to-primary-dark p-8 md:p-12 text-center relative overflow-hidden shadow-2xl shadow-primary/20">
                  <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full blur-3xl" />
                  </div>
                  <div className="relative z-10">
                    <h3 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-white mb-4 tracking-tight">Pre-Book Your Voltey Passport</h3>
                    <p className="text-green-100 text-lg mb-2 max-w-2xl mx-auto font-medium">{t('destinations.passport.ctaSubtitle', 'Be first. Travel smarter. Stay protected.')}</p>
                    <p className="text-green-200/80 text-sm mb-8 max-w-xl mx-auto leading-relaxed">{t('destinations.passport.ctaDescription', 'The first production run is limited. Pre-booking secures your place in the first wave with priority activation and exclusive early benefits.')}</p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                      <button className="btn-passport-cta inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-white text-primary-second font-bold text-lg shadow-xl hover:shadow-white/10 transition-all hover:scale-[1.02] active:scale-[0.98]">{t('destinations.passport.ctaButton', 'Reserve Your Device Now')}<ChevronRight className="w-5 h-5" />
                      </button>
                    </div>
                    <div className="flex flex-wrap items-center justify-center gap-6 mt-10 text-green-50 text-xs font-semibold uppercase tracking-widest opacity-90">
                      <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-full">
                        <CheckCircle2 className="w-4 h-4 text-white" />
                        <span>{t('destinations.passport.features.shipping.label', 'Priority Shipping')}</span>
                      </div>
                      <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-full">
                        <CheckCircle2 className="w-4 h-4 text-white" />
                        <span>{t('destinations.passport.ctaPricing', 'Launch Pricing')}</span>
                      </div>
                      <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-full">
                        <CheckCircle2 className="w-4 h-4 text-white" />
                        <span>Founders' Edition</span>
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
