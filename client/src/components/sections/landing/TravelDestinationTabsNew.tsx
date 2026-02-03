'use client';

import React, { useState, useMemo } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CountryRegionSkeleton from '../../skeleton/CountryRegionSkeleton';
import { useTranslation } from '@/contexts/TranslationContext';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { useCurrency } from '@/contexts/CurrencyContext';
import { convertPrice, getCurrencySymbol } from '@/lib/currency';
import DestinationCardSmall from '@/components/cards/DestinationCard';

export interface Destination {
  id: string;
  airaloId: string | null;
  slug: string;
  name: string;
  countryCode: string;
  flagEmoji: string | null;
  image: string | null;
  active: boolean;
  minPrice: string;
  minDataAmount: string;
  minValidity: number;
  packageCount: number;
  currency: string;
}

export interface Region {
  id: string;
  airaloId: string | null;
  slug: string;
  name: string;
  image: string | null;
  countries: string[];
  active: boolean;
  createdAt: string;
  updatedAt: string;
  minPrice: string;
  minDataAmount: string;
  minValidity: number;
  packageCount: number;
  currency: string;
}

interface GlobalPackage {
  id: string;
  title: string;
  dataAmount: string;
  validity: number;
  retailPrice: string;
  slug: string;
}

const TravelDestinationTabsNew = () => {
  const [activeTab, setActiveTab] = useState('country');
  const { t } = useTranslation();
  const [, navigate] = useLocation();
  const { currency, currencies } = useCurrency();
  const currencySymbol = getCurrencySymbol(currency, currencies);

  // Fetch data using APIs
  const { data: allDestinations = [], isLoading: loadingDestinations } = useQuery<Destination[]>({
    queryKey: ['/api/destinations/with-pricing'],
  });

  const { data: allRegions = [], isLoading: loadingRegions } = useQuery<Region[]>({
    queryKey: ['/api/regions/with-pricing'],
  });

  const { data: allGlobalPackages = [], isLoading: loadingGlobal } = useQuery<GlobalPackage[]>({
    queryKey: ['/api/packages/global'],
  });

  // Transform data for component
  const countries = useMemo(() => {
    return allDestinations.slice(0, 9).map((dest) => ({
      id: parseInt(dest.id),
      name: dest.name,
      slug: dest.slug,
      countryCode: dest.countryCode,
      image: dest.image || undefined,
      startPrice: dest.minPrice ? parseFloat(dest.minPrice) : 0,
      type: 'country' as const,
    }));
  }, [allDestinations]);

  const regions = useMemo(() => {
    return allRegions
      .filter((r) => r.name?.toLowerCase() !== 'global')
      .slice(0, 9)
      .map((region) => ({
        id: parseInt(region.id),
        name: region.name,
        slug: region.slug,
        image: region.image || undefined,
        startPrice: region.minPrice ? parseFloat(region.minPrice) : 0,
        countryCount: region.countries?.length || 0,
        type: 'region' as const,
      }));
  }, [allRegions]);

  const globalPackages = useMemo(() => {
    return allGlobalPackages.slice(0, 9).map((pkg) => ({
      id: parseInt(pkg.id),
      name: `Global (${pkg.dataAmount})`,
      slug: 'global',
      startPrice: parseFloat(pkg.retailPrice),
      validity: pkg.validity,
      type: 'global' as const,
    }));
  }, [allGlobalPackages]);

  const handleCountryClick = (countrySlug: string) => {
    navigate(`/destination/${countrySlug}`);
  };

  const handleRegionClick = (regionSlug: string) => {
    navigate(`/region/${regionSlug}`);
  };

  const handleGlobalClick = () => {
    navigate('/global');
  };

  return (
    <section className="w-full bg-white">
      <div className="containers py-10">
        <div className="mb-10 sm:mb-12">
          <p className="mb-3 text-center text-sm font-normal text-gray-400 sm:text-base md:text-start">
            {/* {t('NewSimfinDes.TravelDestinationTabsNew.subTitle')} */}
            What’s your next destination?
          </p>

          <div className="mb-4 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <h2 className="text-center text-3xl leading-tight font-normal text-black sm:text-4xl md:text-start lg:text-5xl">
              {/* {t('NewSimfinDes.TravelDestinationTabsNew.title')} */}
              Choose your travel destination
            </h2>
            <Button onClick={() => navigate('/destinations')}>
              {/* {t('NewSimfinDes.TravelDestinationTabsNew.btn')} */}
              View All Destinations
            </Button>
          </div>

          <p className="text-center text-base font-normal text-gray-600 sm:text-lg md:text-start">
            {/* {t('NewSimfinDes.TravelDestinationTabsNew.des')} */}
            Find your destination and let Simfinity handle the rest, Instant data, zero stress.
          </p>
        </div>

        <Tabs
          defaultValue="country"
          className="w-full"
          onValueChange={(value) => setActiveTab(value)}
        >
          <TabsList className="mb-10 inline-flex h-auto gap-0 rounded-full border border-gray-200 bg-white p-1.5 shadow-sm">
            <TabsTrigger
              value="country"
              className="relative z-10 cursor-pointer rounded-full bg-transparent px-5 py-1 text-sm font-semibold text-gray-700 transition-all duration-300 ease-in-out hover:bg-gray-50 data-[state=active]:bg-black data-[state=active]:text-white data-[state=inactive]:hover:bg-gray-50 lg:text-base"
            >
              {/* {t('NewSimfinDes.TravelDestinationTabsNew.Country')} */}
              Country
            </TabsTrigger>
            <TabsTrigger
              value="region"
              className="relative z-10 cursor-pointer rounded-full bg-transparent px-5 py-1 text-sm font-semibold text-gray-700 transition-all duration-300 ease-in-out hover:bg-gray-50 data-[state=active]:bg-black data-[state=active]:text-white data-[state=inactive]:hover:bg-gray-50 lg:text-base"
            >
              {/* {t('NewSimfinDes.TravelDestinationTabsNew.Region')} */}
              Region
            </TabsTrigger>
            <TabsTrigger
              value="ultra"
              className="relative z-10 cursor-pointer rounded-full bg-transparent px-5 py-1 text-sm font-semibold text-gray-700 transition-all duration-300 ease-in-out hover:bg-gray-50 data-[state=active]:bg-black data-[state=active]:text-white data-[state=inactive]:hover:bg-gray-50 lg:text-base"
            >
              {/* {t('NewSimfinDes.TravelDestinationTabsNew.Ultra')}{' '} */} Ultra
              <span className="bg-themeYellow absolute -top-2 -right-1 rounded-full px-1.5 py-0.5 text-[9px] font-bold tracking-wide text-white uppercase shadow-sm">
                {/* {t('NewSimfinDes.TravelDestinationTabsNew.new')} */}
                new
              </span>
            </TabsTrigger>
          </TabsList>

          {/* Country Tab */}
          <TabsContent
            value="country"
            className={`mt-0 transition-all duration-500 ease-in-out ${
              activeTab === 'country'
                ? 'translate-x-0 opacity-100'
                : 'absolute translate-x-4 opacity-0'
            }`}
          >
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {loadingDestinations ? (
                <CountryRegionSkeleton count={9} />
              ) : (
                countries.map((country, index) => (
                  <DestinationCardSmall
                    key={country.id}
                    id={country.id}
                    name={country.name}
                    slug={country.slug}
                    image={country.image}
                    countryCode={country.countryCode}
                    startPrice={convertPrice(country.startPrice, 'USD', currency, currencies)}
                    onClick={handleCountryClick}
                    index={index}
                    type="country"
                  />
                ))
              )}
            </div>
          </TabsContent>

          {/* Region Tab */}
          <TabsContent
            value="region"
            className={`mt-0 transition-all duration-500 ease-in-out ${
              activeTab === 'region'
                ? 'translate-x-0 opacity-100'
                : 'absolute translate-x-4 opacity-0'
            }`}
          >
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {loadingRegions ? (
                <CountryRegionSkeleton count={9} />
              ) : regions.length > 0 ? (
                regions.map((region, index) => (
                  <DestinationCardSmall
                    key={region.id}
                    id={region.id}
                    name={region.name}
                    slug={region.slug}
                    image={region.image}
                    startPrice={convertPrice(region.startPrice, 'USD', currency, currencies)}
                    fallbackIcon="🌍"
                    additionalInfo={`${region.countryCount} countries`}
                    onClick={handleRegionClick}
                    index={index}
                    type="region"
                  />
                ))
              ) : (
                <div className="col-span-full py-12 text-center">
                  <p className="text-gray-500">No regions available</p>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Global Tab */}
          <TabsContent
            value="ultra"
            className={`mt-0 transition-all duration-500 ease-in-out ${
              activeTab === 'ultra'
                ? 'translate-x-0 opacity-100'
                : 'absolute translate-x-4 opacity-0'
            }`}
          >
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {loadingGlobal ? (
                <CountryRegionSkeleton count={6} />
              ) : globalPackages.length > 0 ? (
                globalPackages.map((pkg, index) => (
                  <DestinationCardSmall
                    key={pkg.id}
                    id={pkg.id}
                    name={pkg.name}
                    slug={pkg.slug}
                    startPrice={convertPrice(pkg.startPrice, 'USD', currency, currencies)}
                    fallbackIcon="🌍"
                    additionalInfo={`${pkg.validity} days validity`}
                    onClick={handleGlobalClick}
                    index={index}
                    type="global"
                  />
                ))
              ) : (
                <div className="col-span-full py-12 text-center">
                  <p className="text-lg text-gray-500">Ultra plans coming soon...</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
};

export default TravelDestinationTabsNew;
