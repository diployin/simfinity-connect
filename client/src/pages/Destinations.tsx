'use client';

import { useState, useMemo, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Search, X } from 'lucide-react';
import { useTranslation } from '@/contexts/TranslationContext';
import { useCurrency } from '@/contexts/CurrencyContext';
import { convertPrice } from '@/lib/currency';
import DestinationCardSmall from '@/components/cards/DestinationCard';
import CountryRegionSkeleton from '@/components/skeleton/CountryRegionSkeleton';
import { useLocation } from 'wouter';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store/store';

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

export default function Destinations() {
  const { t } = useTranslation();
  const { currency, currencies } = useCurrency();
  const [, navigate] = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const { isExpanded } = useSelector((state: RootState) => state.topNavbar);
  const isTopBarVisible = !isExpanded;


  /* =========================
     API CALLS
  ========================= */

  const { data: allDestinations = [], isLoading: loadingDest } =
    useQuery<Destination[]>({
      queryKey: ['/api/destinations/with-pricing'],
    });

  const { data: allRegions = [], isLoading: loadingRegions } =
    useQuery<Region[]>({
      queryKey: ['/api/regions/with-pricing'],
    });

  const { data: allGlobalPackages = [], isLoading: loadingGlobal } =
    useQuery<GlobalPackage[]>({
      queryKey: ['/api/packages/global'],
    });


  /* =========================
     FILTER LOGIC
  ========================= */

  const countries = useMemo(() => {
    return allDestinations
      .filter((d) =>
        d.name?.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .map((d) => ({
        id: Number(d.id),
        name: d.name,
        slug: d.slug,
        countryCode: d.countryCode,
        startPrice: Number(d.minPrice),
        type: 'country' as const,
      }));
  }, [allDestinations, searchQuery]);


  const regions = useMemo(() => {
    return allRegions
      .filter((r) =>
        r.name?.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .map((r) => ({
        id: Number(r.id),
        name: r.name,
        slug: r.slug,
        startPrice: Number(r.minPrice),
        countryCount: r.countries?.length || 0,
        type: 'region' as const,
      }));
  }, [allRegions, searchQuery]);


  const globalPackages = useMemo(() => {
    return allGlobalPackages
      .filter((g) =>
        g.title?.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .map((g) => ({
        id: Number(g.id),
        name: `Global (${g.dataAmount})`,
        slug: 'global',
        startPrice: Number(g.retailPrice),
        validity: g.validity,
        type: 'global' as const,
      }));
  }, [allGlobalPackages, searchQuery]);


  useEffect(() => {
    if (searchQuery) {
      setActiveTab('all');
    }
  }, [searchQuery]);


  /* =========================
     UI
  ========================= */

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Destinations</title>
      </Helmet>

      <main className={isTopBarVisible
        ? 'mt-28 md:mt-0'
        : 'mt-18 md:mt-0'}>
        <div className="max-w-6xl mx-auto px-4">
          {/* =========================
             HEADER
          ========================= */}
          <div className="flex flex-col items-start text-start mb-12 max-w-4xl">
            <h1 className="text-3xl sm:text-4xl lg:text-2.5 font-medium tracking-tight text-foreground">
              All Destinations
            </h1>
            <p className="max-w-2xl mt-4 text-base md:text-lg text-gray-600 leading-relaxed font-thin">
              Find the best data plans worldwide and connect instantly with our premium eSIM
              solutions.
            </p>
          </div>

          {/* =========================
             SEARCH
          ========================= */}

          {/* =========================
             TABS
          ========================= */}
          <Tabs defaultValue="all" onValueChange={setActiveTab}>
            <TabsList
              className="
    mb-10 w-full sm:w-fit
    rounded-full border bg-white p-1 shadow-sm
    flex gap-1
    overflow-x-auto sm:overflow-visible
    whitespace-nowrap
    no-scrollbar
  "
            >
              {[
                { id: 'all', label: 'All' },
                { id: 'country', label: 'Country' },
                { id: 'region', label: 'Region' },
                // { id: 'ultra', label: 'Ultra Plan', badge: 'New' },
                { id: 'passport', label: 'Simfinity Passport' },
              ].map((tab) => (
                <TabsTrigger
                  key={tab.id}
                  value={tab.id}
                  className="
        rounded-full
        px-3 py-1.5 sm:px-5 sm:py-2
        text-sm sm:text-base
        font-medium
        text-gray-600
        data-[state=active]:bg-black
        data-[state=active]:text-white
        flex items-center
      "
                >
                  {tab.label}
                  {tab.badge && (
                    <span className="ml-2 bg-primary text-white text-[9px] px-1.5 py-0.5 rounded-full uppercase">
                      {tab.badge}
                    </span>
                  )}
                </TabsTrigger>
              ))}
            </TabsList>


            <div className="relative mb-8  border-2 rounded-xl">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />

              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={'Search for destination'}
                className="pl-11 pr-10 h-12 rounded-xl bg-white border shadow-sm text-lg placeholder:text-gray-400"
              />

              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2"
                >
                  <X className="h-4 w-4 text-gray-400" />
                </button>
              )}
            </div>

            {/* =========================
               ALL
            ========================= */}
            <TabsContent value="all">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {loadingDest || loadingRegions ? (
                  <CountryRegionSkeleton count={9} />
                ) : (
                  [...countries, ...regions].map((item: any, i) => (
                    <DestinationCardSmall
                      key={item.id}
                      {...item}
                      startPrice={convertPrice(item.startPrice, 'USD', currency, currencies)}
                      onClick={(slug) => navigate(`/destination/${slug}`)}
                      index={i}
                    />
                  ))
                )}
              </div>
            </TabsContent>

            {/* =========================
               COUNTRY
            ========================= */}
            <TabsContent value="country">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {loadingDest ? (
                  <CountryRegionSkeleton count={9} />
                ) : (
                  countries.map((c: any, i) => (
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

            {/* =========================
               REGION
            ========================= */}
            <TabsContent value="region">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {loadingRegions ? (
                  <CountryRegionSkeleton count={9} />
                ) : (
                  regions.map((r: any, i) => (
                    <DestinationCardSmall
                      key={r.id}
                      {...r}
                      additionalInfo={`${r.countryCount} countries`}
                      startPrice={convertPrice(r.startPrice, 'USD', currency, currencies)}
                      index={i}
                      onClick={(slug) => navigate(`/region/${slug}`)}
                    />
                  ))
                )}
              </div>
            </TabsContent>

            {/* =========================
               ULTRA
            ========================= */}
            <TabsContent value="passport">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {loadingGlobal ? (
                  <CountryRegionSkeleton count={6} />
                ) : (
                  globalPackages.slice(0, 1).map((g: any, i) => (
                    <DestinationCardSmall
                      key={g.id}
                      {...g}
                      additionalInfo={`${g.validity} days`}
                      startPrice={convertPrice(g.startPrice, 'USD', currency, currencies)}
                      onClick={(slug) => navigate(`/global`)}
                      index={i}
                    />
                  ))
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
        <div className="h-24 sm:h-32 md:h-40" /> {/* Dynamic bottom spacing before footer */}
      </main>
    </div>
  );
}
