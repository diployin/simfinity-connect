import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link, useLocation, useSearch } from 'wouter';
import { Helmet } from 'react-helmet-async';
import { Search, Globe, MapPin, ChevronRight, X, Ticket } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { SiteFooter } from '@/components/layout/SiteFooter';
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
          <p className="text-muted-foreground text-sm mb-6" data-testid="text-destination-count">
            {t('destinations.showing', 'Showing')} {totalCount}{' '}
            {/* {t('destinations.destinations', 'destinations')} */} {activeTab === 'passport' ? 'Simfinity passport' : activeTab}
          </p>

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
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-6">
                <Ticket className="w-10 h-10 text-muted-foreground" />
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-3">Simfinity Passport</h2>
              <p className="text-muted-foreground max-w-md mx-auto mb-8">
                Our exclusive passport plan is coming soon. Stay tuned for seamless global connectivity without boundaries.
              </p>
              <Badge variant="outline" className="text-base py-1 px-4 border-dashed border-[#1e5427] text-[#1e5427] bg-[#1e5427]/5">
                Coming Soon
              </Badge>
            </div>
          )}
        </div>
      </main>

      {/* <SiteFooter /> */}
    </div>
  );
}
