import { useState } from 'react';
import { Link } from 'wouter';
import { ArrowRight, Globe, MapPin, Plane, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import ReactCountryFlag from 'react-country-flag';
import { useCurrency } from '@/contexts/CurrencyContext';
import { convertPrice, getCurrencySymbol } from '@/lib/currency';
import { useTranslation } from '@/contexts/TranslationContext';

interface Destination {
  id: string;
  name: string;
  slug: string;
  countryCode: string;
  minPrice?: string;
  currency?: string;
}

interface Region {
  id: string;
  name: string;
  slug: string;
  countries?: string[];
  image?: string;
  minPrice?: string;
  currency?: string;
}

interface GlobalPackage {
  id: string;
  title: string;
  dataAmount: string;
  validity: number;
  retailPrice: string;
  slug: string;
}

const regionIcons: Record<string, string> = {
  europe: 'EU',
  asia: 'AS',
  'north-america': 'NA',
  'south-america': 'SA',
  africa: 'AF',
  oceania: 'OC',
  'australia-and-oceania': 'AU',
  'middle-east': 'ME',
  'middle-east-and-north-africa': 'AE',
  caribbean: 'JM',
  'central-asia': 'KZ',
  'greater-china': 'CN',
  'usa-and-canada': 'US',
  gcc: 'SA',
  balkans: 'RS',
};

const popularCountryCodes = [
  'US',
  'GB',
  'JP',
  'DE',
  'FR',
  'IT',
  'ES',
  'AU',
  'CA',
  'TH',
  'AE',
  'KR',
];

export function DestinationsTabs() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('countries');
  const { currency, currencies } = useCurrency();
  const currencySymbol = getCurrencySymbol(currency, currencies);

  const { data: allDestinations = [], isLoading: loadingDestinations } = useQuery<Destination[]>({
    queryKey: ['/api/destinations/with-pricing'],
  });

  const { data: allRegions = [], isLoading: loadingRegions } = useQuery<Region[]>({
    queryKey: ['/api/regions/with-pricing'],
  });

  const { data: allGlobalPackages = [], isLoading: loadingGlobal } = useQuery<GlobalPackage[]>({
    queryKey: ['/api/packages/global'],
  });

  const popularDestinations = allDestinations
    .filter((d) => popularCountryCodes.includes(d.countryCode))
    .slice(0, 9);
  const destinations =
    popularDestinations.length > 0 ? popularDestinations : allDestinations.slice(0, 9);

  const regions = allRegions.filter((r) => r.name?.toLowerCase() !== 'global').slice(0, 9);

  const globalPackages = allGlobalPackages.slice(0, 9);

  const SkeletonCards = () => (
    <>
      {Array.from({ length: 9 }).map((_, i) => (
        <div
          key={i}
          className="flex items-center gap-4 bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-xl px-5 py-4"
        >
          <div className="h-10 w-10 rounded-full bg-zinc-100 dark:bg-zinc-800 animate-pulse flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <div className="h-4 w-28 bg-zinc-100 dark:bg-zinc-800 animate-pulse rounded" />
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <div className="h-4 w-16 bg-zinc-100 dark:bg-zinc-800 animate-pulse rounded" />
            <div className="h-4 w-4 bg-zinc-100 dark:bg-zinc-800 animate-pulse rounded" />
          </div>
        </div>
      ))}
    </>
  );

  return (
    <section className="py-16 md:py-24 bg-zinc-50/50 dark:bg-zinc-950">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
            {t('website.home.destinations.title', 'Choose your travel destination')}
          </h2>
          <p className="text-muted-foreground text-base md:text-lg mb-4">
            {t('website.home.destinations.subtitle', 'Pick a mobile data plan for your trip.')}
          </p>
          <Link href="/destinations">
            <span className="inline-flex items-center gap-1 text-teal-600 dark:text-teal-400 font-medium text-sm hover:underline cursor-pointer">
              {t('website.home.destinations.seeAll', 'View All Destinations')}
              <ArrowRight className="h-4 w-4" />
            </span>
          </Link>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex justify-center mb-8">
            <TabsList className="inline-flex bg-zinc-100 dark:bg-zinc-800/60 rounded-full p-1 gap-0.5">
              <TabsTrigger
                value="countries"
                className="rounded-full px-5 py-2 text-sm font-medium transition-all data-[state=active]:bg-teal-600 data-[state=active]:text-white data-[state=active]:shadow-sm text-zinc-600 dark:text-zinc-400 data-[state=inactive]:hover:text-zinc-900 dark:data-[state=inactive]:hover:text-zinc-200"
                data-testid="tab-countries"
              >
                {t('website.home.destinations.tabs.countries', 'Country')}
              </TabsTrigger>
              <TabsTrigger
                value="regional"
                className="rounded-full px-5 py-2 text-sm font-medium transition-all data-[state=active]:bg-teal-600 data-[state=active]:text-white data-[state=active]:shadow-sm text-zinc-600 dark:text-zinc-400 data-[state=inactive]:hover:text-zinc-900 dark:data-[state=inactive]:hover:text-zinc-200"
                data-testid="tab-regional"
              >
                {t('website.home.destinations.tabs.regional', 'Region')}
              </TabsTrigger>
              <TabsTrigger
                value="global"
                className="rounded-full px-5 py-2 text-sm font-medium transition-all data-[state=active]:bg-teal-600 data-[state=active]:text-white data-[state=active]:shadow-sm text-zinc-600 dark:text-zinc-400 data-[state=inactive]:hover:text-zinc-900 dark:data-[state=inactive]:hover:text-zinc-200"
                data-testid="tab-global"
              >
                {t('website.home.destinations.tabs.global', 'Global')}
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="countries" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {loadingDestinations ? (
                <SkeletonCards />
              ) : destinations.length > 0 ? (
                destinations.map((destination) => (
                  <Link key={destination.id} href={`/destination/${destination.slug}`}>
                    <div className="flex items-center gap-4 bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-xl px-5 py-4 cursor-pointer hover:border-teal-200 dark:hover:border-teal-800 hover:shadow-sm transition-all group">
                      <div className="h-10 w-10 rounded-full overflow-hidden flex items-center justify-center flex-shrink-0 border border-zinc-100 dark:border-zinc-700">
                        <ReactCountryFlag
                          countryCode={destination.countryCode}
                          svg
                          style={{
                            width: '40px',
                            height: '40px',
                            objectFit: 'cover',
                            borderRadius: '50%',
                          }}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-sm text-foreground truncate">
                          {destination.name}
                        </h3>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        {destination.minPrice && (
                          <span className="text-sm text-teal-600 dark:text-teal-400 font-semibold">
                            {t('website.home.destinations.from', 'From')} {currencySymbol}
                            {convertPrice(
                              parseFloat(destination.minPrice),
                              'USD',
                              currency,
                              currencies,
                            ).toFixed(2)}
                          </span>
                        )}
                        <ChevronRight className="h-4 w-4 text-zinc-400 dark:text-zinc-500 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors" />
                      </div>
                    </div>
                  </Link>
                ))
              ) : (
                <SkeletonCards />
              )}
            </div>
          </TabsContent>

          <TabsContent value="regional" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {loadingRegions ? (
                <SkeletonCards />
              ) : regions.length > 0 ? (
                regions.map((region) => {
                  const iconCode = regionIcons[region.slug] || 'EU';
                  const countryCount = region.countries?.length || 0;

                  return (
                    <Link key={region.id} href={`/region/${region.slug}`}>
                      <div className="flex items-center gap-4 bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-xl px-5 py-4 cursor-pointer hover:border-teal-200 dark:hover:border-teal-800 hover:shadow-sm transition-all group">
                        <div className="h-10 w-10 rounded-full overflow-hidden flex items-center justify-center flex-shrink-0 border border-zinc-100 dark:border-zinc-700">
                          <ReactCountryFlag
                            countryCode={iconCode}
                            svg
                            style={{
                              width: '40px',
                              height: '40px',
                              objectFit: 'cover',
                              borderRadius: '50%',
                            }}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-sm text-foreground truncate">
                            {region.name}
                          </h3>
                          {countryCount > 0 && (
                            <p className="text-xs text-muted-foreground">
                              {countryCount} {t('website.home.destinations.countries', 'countries')}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          {region.minPrice && (
                            <span className="text-sm text-teal-600 dark:text-teal-400 font-semibold">
                              {t('website.home.destinations.from', 'From')} {currencySymbol}
                              {convertPrice(
                                parseFloat(region.minPrice),
                                'USD',
                                currency,
                                currencies,
                              ).toFixed(2)}
                            </span>
                          )}
                          <ChevronRight className="h-4 w-4 text-zinc-400 dark:text-zinc-500 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors" />
                        </div>
                      </div>
                    </Link>
                  );
                })
              ) : (
                <SkeletonCards />
              )}
            </div>
          </TabsContent>

          <TabsContent value="global" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {loadingGlobal ? (
                <SkeletonCards />
              ) : globalPackages.length > 0 ? (
                globalPackages.map((pkg) => (
                  <Link key={pkg.id} href="/global">
                    <div className="flex items-center gap-4 bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-xl px-5 py-4 cursor-pointer hover:border-teal-200 dark:hover:border-teal-800 hover:shadow-sm transition-all group">
                      <div className="h-10 w-10 rounded-full flex items-center justify-center flex-shrink-0 bg-teal-50 dark:bg-teal-950 border border-teal-100 dark:border-teal-900">
                        <Globe className="h-5 w-5 text-teal-600 dark:text-teal-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-sm text-foreground truncate">
                          {t('website.home.destinations.global', 'Global')} — {pkg.dataAmount}
                        </h3>
                        <p className="text-xs text-muted-foreground">
                          {pkg.validity}{' '}
                          {t('website.home.destinations.daysValidity', 'days validity')}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className="text-sm text-teal-600 dark:text-teal-400 font-semibold">
                          {currencySymbol}
                          {convertPrice(
                            parseFloat(pkg.retailPrice),
                            'USD',
                            currency,
                            currencies,
                          ).toFixed(2)}
                        </span>
                        <ChevronRight className="h-4 w-4 text-zinc-400 dark:text-zinc-500 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors" />
                      </div>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <Globe className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">
                    {t(
                      'website.home.destinations.globalComingSoon',
                      'Global eSIM packages coming soon!',
                    )}
                  </p>
                  <Link href="/destinations">
                    <Button variant="ghost" className="text-teal-600 dark:text-teal-400 mt-2">
                      {t('website.home.destinations.browseAll', 'Browse all destinations')}
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>

        <div className="text-center mt-10">
          <Link href="/destinations">
            <Button
              variant="outline"
              className="rounded-full px-8 py-3 h-auto border-zinc-200 dark:border-zinc-700 text-foreground hover:bg-teal-50 dark:hover:bg-teal-950 hover:border-teal-300 dark:hover:border-teal-800 transition-all font-medium"
            >
              {t('website.home.destinations.seeAll', 'View All Destinations')}
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
