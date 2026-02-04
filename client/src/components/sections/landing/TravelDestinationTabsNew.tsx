'use client';

import React, { useState, useMemo } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CountryRegionSkeleton from '../../skeleton/CountryRegionSkeleton';
import { useTranslation } from '@/contexts/TranslationContext';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { useCurrency } from '@/contexts/CurrencyContext';
import { convertPrice } from '@/lib/currency';
import DestinationCardSmall from '@/components/cards/DestinationCard';
import ThemeButton from '@/components/ThemeButton';

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

  const { data: allDestinations = [], isLoading: loadingDestinations } = useQuery<Destination[]>({
    queryKey: ['/api/destinations/with-pricing'],
  });

  const { data: allRegions = [], isLoading: loadingRegions } = useQuery<Region[]>({
    queryKey: ['/api/regions/with-pricing'],
  });

  const { data: allGlobalPackages = [], isLoading: loadingGlobal } = useQuery<GlobalPackage[]>({
    queryKey: ['/api/packages/global'],
  });

  const countries = useMemo(
    () =>
      allDestinations.slice(0, 9).map((dest) => ({
        id: parseInt(dest.id),
        name: dest.name,
        slug: dest.slug,
        countryCode: dest.countryCode,
        image: dest.image || undefined,
        startPrice: dest.minPrice ? parseFloat(dest.minPrice) : 0,
        type: 'country' as const,
      })),
    [allDestinations],
  );

  const regions = useMemo(
    () =>
      allRegions
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
        })),
    [allRegions],
  );

  const globalPackages = useMemo(
    () =>
      allGlobalPackages.slice(0, 9).map((pkg) => ({
        id: parseInt(pkg.id),
        name: `Global (${pkg.dataAmount})`,
        slug: 'global',
        startPrice: parseFloat(pkg.retailPrice),
        validity: pkg.validity,
        type: 'global' as const,
      })),
    [allGlobalPackages],
  );

  return (
    <section className="w-full bg-white">
      <div className="containers py-10">
        {/* Header */}
        <div className="mb-10 sm:mb-12">
          <p className="mb-3 text-center text-sm text-gray-400 sm:text-base md:text-start">
            {t('travelTabs.subtitle')}
          </p>

          <div className="mb-4 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <h2 className="text-center text-3xl font-normal text-black sm:text-4xl md:text-start lg:text-5xl">
              {t('travelTabs.title')}
            </h2>

            {/* <Button onClick={() => navigate('/destinations')}>{t('travelTabs.viewAll')}</Button> */}
            <ThemeButton onClick={() => navigate('/destinations')} size="md">
              {t('travelTabs.viewAll')}
            </ThemeButton>
          </div>

          <p className="text-center text-base text-gray-600 sm:text-lg md:text-start">
            {t('travelTabs.description')}
          </p>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="country" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="mb-10 w-fit rounded-full border border-gray-200 bg-white p-1.5 shadow-sm flex gap-1">
            {/* Country */}
            <TabsTrigger
              value="country"
              className="rounded-full px-5 py-2 text-base font-medium 
    text-gray-600 
    data-[state=active]:bg-black 
    data-[state=active]:text-white"
            >
              {t('travelTabs.country')}
            </TabsTrigger>

            {/* Region */}
            <TabsTrigger
              value="region"
              className="rounded-full px-5 py-2 text-base font-medium 
    text-gray-600 
    data-[state=active]:bg-black 
    data-[state=active]:text-white"
            >
              {t('travelTabs.region')}
            </TabsTrigger>

            {/* Ultra */}
            <TabsTrigger
              value="ultra"
              className="rounded-full px-5 py-2 text-base font-medium 
    text-gray-600 
    data-[state=active]:bg-black 
    data-[state=active]:text-white flex items-center"
            >
              {t('travelTabs.ultra')}
              <span className="bg-primary ml-2 rounded-full px-1.5 py-0.5 text-[9px] font-bold uppercase text-white">
                {t('travelTabs.new')}
              </span>
            </TabsTrigger>

            <TabsTrigger
              value="passport"
              className="rounded-full px-5 py-2 text-base font-medium 
    text-gray-600 
    data-[state=active]:bg-black 
    data-[state=active]:text-white"
            >
              Simfinity Passport
            </TabsTrigger>
          </TabsList>

          {/* Country */}
          <TabsContent value="country">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {loadingDestinations ? (
                <CountryRegionSkeleton count={9} />
              ) : (
                countries.map((c, i) => (
                  <DestinationCardSmall
                    key={c.id}
                    {...c}
                    startPrice={convertPrice(c.startPrice, 'USD', currency, currencies)}
                    onClick={(slug) => navigate(`/destination/${slug}`)}
                    index={i}
                  />
                ))
              )}
            </div>
          </TabsContent>

          {/* Region */}
          <TabsContent value="region">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {loadingRegions ? (
                <CountryRegionSkeleton count={9} />
              ) : regions.length ? (
                regions.map((r, i) => (
                  <DestinationCardSmall
                    key={r.id}
                    {...r}
                    startPrice={convertPrice(r.startPrice, 'USD', currency, currencies)}
                    additionalInfo={`${r.countryCount} ${t('travelTabs.countries')}`}
                    onClick={(slug) => navigate(`/region/${slug}`)}
                    index={i}
                  />
                ))
              ) : (
                <p className="col-span-full py-12 text-center text-gray-500">
                  {t('travelTabs.noRegions')}
                </p>
              )}
            </div>
          </TabsContent>

          {/* Ultra / Global */}
          <TabsContent value="ultra">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {loadingGlobal ? (
                <CountryRegionSkeleton count={6} />
              ) : globalPackages.length ? (
                globalPackages.map((g, i) => (
                  <DestinationCardSmall
                    key={g.id}
                    {...g}
                    startPrice={convertPrice(g.startPrice, 'USD', currency, currencies)}
                    additionalInfo={`${g.validity} ${t('travelTabs.daysValidity')}`}
                    onClick={() => navigate('/global')}
                    index={i}
                  />
                ))
              ) : (
                <p className="col-span-full py-12 text-center text-gray-500">
                  {t('travelTabs.ultraComing')}
                </p>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
};

export default TravelDestinationTabsNew;
