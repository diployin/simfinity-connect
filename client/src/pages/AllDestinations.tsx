'use client';

import React, { useState, useMemo } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, X, MapPin, Globe } from 'lucide-react';
import CountryRegionSkeleton from '@/components/skeleton/CountryRegionSkeleton';
import { useTranslation } from '@/contexts/TranslationContext';
import { useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { useCurrency } from '@/contexts/CurrencyContext';
import { convertPrice } from '@/lib/currency';
import DestinationCardSmall from '@/components/cards/DestinationCard';

// ✅ SAME INTERFACES
export interface Destination {
  id: string;
  slug: string;
  name: string;
  countryCode: string;
  image: string | null;
  active: boolean;
  minPrice: string;
}

export interface Region {
  id: string;
  slug: string;
  name: string;
  image: string | null;
  countries: string[];
  active: boolean;
  minPrice: string;
}

interface GlobalPackage {
  id: string;
  title: string;
  dataAmount: string;
  validity: number;
  retailPrice: string;
  slug: string;
}

const AllDestinations = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'countries' | 'regions' | 'global'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const { t } = useTranslation();
  const [, navigate] = useLocation();
  const { currency, currencies } = useCurrency();

  // ✅ Data fetch
  const { data: destinations = [], isLoading: loadingDest } = useQuery({
    queryKey: ['/api/destinations/with-pricing', { currency }],
  });

  const { data: regionsData = [], isLoading: loadingRegions } = useQuery({
    queryKey: ['/api/regions/with-pricing', { currency }],
  });

  const { data: globalPackagesData = [], isLoading: loadingGlobal } = useQuery({
    queryKey: ['/api/packages/global', { currency }],
  });

  // ✅ SIMPLE FILTER - bilkul TravelDestinationTabsNew jaisa
  const countries = useMemo(() => {
    return (
      destinations
        ?.filter((d) => d.active)
        ?.filter(
          (d) =>
            d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            d.countryCode.toLowerCase().includes(searchQuery.toLowerCase()),
        )
        ?.map((d) => ({
          id: parseInt(d.id),
          name: d.name,
          slug: d.slug,
          countryCode: d.countryCode,
          image: d.image,
          startPrice: parseFloat(d.minPrice || '0'),
          type: 'country' as const,
        })) || []
    );
  }, [destinations, searchQuery]);

  const regions = useMemo(() => {
    return (
      regionsData
        ?.filter((r) => r.active && r.name?.toLowerCase() !== 'global')
        ?.filter((r) => r.name.toLowerCase().includes(searchQuery.toLowerCase()))
        ?.map((r) => ({
          id: parseInt(r.id),
          name: r.name,
          slug: r.slug,
          image: r.image,
          startPrice: parseFloat(r.minPrice || '0'),
          countryCount: r.countries?.length || 0,
          type: 'region' as const,
        })) || []
    );
  }, [regionsData, searchQuery]);

  const globalPackages = useMemo(() => {
    return (
      globalPackagesData
        ?.filter(
          (pkg) =>
            pkg.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            pkg.dataAmount?.toLowerCase().includes(searchQuery.toLowerCase()),
        )
        ?.map((pkg) => ({
          id: parseInt(pkg.id),
          name: `Global (${pkg.dataAmount})`,
          slug: pkg.slug || 'global',
          startPrice: parseFloat(pkg.retailPrice || '0'),
          validity: pkg.validity,
          type: 'global' as const,
        })) || []
    );
  }, [globalPackagesData, searchQuery]);

  // ✅ Navigation
  const handleCountryClick = (slug: string) => navigate(`/destination/${slug}`);
  const handleRegionClick = (slug: string) => navigate(`/region/${slug}`);
  const handleGlobalClick = () => navigate('/global');

  // ✅ Counts - working perfectly
  const getCount = () => {
    switch (activeTab) {
      case 'all':
        return countries.length + regions.length;
      case 'countries':
        return countries.length;
      case 'regions':
        return regions.length;
      case 'global':
        return globalPackages.length;
      default:
        return 0;
    }
  };

  // 🔥 FIXED - SIMPLE TAB CONTENT - No complex logic!
  const CountryContent = () =>
    loadingDest ? (
      <CountryRegionSkeleton count={12} />
    ) : countries.length ? (
      countries.map((item, index) => (
        <DestinationCardSmall
          key={item.id}
          id={item.id}
          name={item.name}
          slug={item.slug}
          image={item.image}
          countryCode={item.countryCode}
          startPrice={convertPrice(item.startPrice, 'USD', currency, currencies)}
          onClick={handleCountryClick}
          index={index}
          type="country"
        />
      ))
    ) : (
      <div className="col-span-full text-center py-12">
        <Search className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
        <p>No countries found</p>
      </div>
    );

  const RegionContent = () =>
    loadingRegions ? (
      <CountryRegionSkeleton count={12} />
    ) : regions.length ? (
      regions.map((item, index) => (
        <DestinationCardSmall
          key={item.id}
          id={item.id}
          name={item.name}
          slug={item.slug}
          image={item.image}
          startPrice={convertPrice(item.startPrice, 'USD', currency, currencies)}
          additionalInfo={`${item.countryCount} countries`}
          fallbackIcon="🌍"
          onClick={handleRegionClick}
          index={index}
          type="region"
        />
      ))
    ) : (
      <div className="col-span-full text-center py-12">
        <Search className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
        <p>No regions found</p>
      </div>
    );

  const GlobalContent = () =>
    loadingGlobal ? (
      <CountryRegionSkeleton count={12} />
    ) : globalPackages.length ? (
      globalPackages.map((item, index) => (
        <DestinationCardSmall
          key={item.id}
          id={item.id}
          name={item.name}
          slug={item.slug}
          startPrice={convertPrice(item.startPrice, 'USD', currency, currencies)}
          additionalInfo={`${item.validity} days validity`}
          fallbackIcon="🌍"
          onClick={handleGlobalClick}
          index={index}
          type="global"
        />
      ))
    ) : (
      <div className="col-span-full text-center py-12">
        <Search className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
        <p>No global packages found</p>
      </div>
    );

  const AllContent = () =>
    loadingDest || loadingRegions ? (
      <CountryRegionSkeleton count={12} />
    ) : countries.length + regions.length ? (
      [...countries, ...regions].map((item, index) => (
        <DestinationCardSmall
          key={item.id}
          id={item.id}
          name={item.name}
          slug={item.slug}
          image={item.image}
          countryCode={item.countryCode}
          startPrice={convertPrice(item.startPrice, 'USD', currency, currencies)}
          additionalInfo={item.countryCount ? `${item.countryCount} countries` : ''}
          fallbackIcon={item.type !== 'country' ? '🌍' : undefined}
          onClick={item.type === 'country' ? handleCountryClick : handleRegionClick}
          index={index}
          type={item.type}
        />
      ))
    ) : (
      <div className="col-span-full text-center py-12">
        <Search className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
        <p>No destinations found</p>
      </div>
    );

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full bg-teal-100 px-4 py-2 text-sm font-semibold text-teal-700">
            <Globe className="h-4 w-4" />
            Explore 200+ Destinations
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">All Destinations</h1>
          <p className="mx-auto max-w-2xl text-xl text-muted-foreground">
            Find your perfect eSIM plan
          </p>
        </div>

        {/* Search + Tabs */}
        <div className="mb-12">
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)}>
            <div className="flex flex-col lg:flex-row lg:items-center gap-6 mb-12">
              {/* Search */}
              <div className="relative w-full lg:w-96 order-2 lg:order-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search destinations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-12 pl-11 pr-12 rounded-2xl border-2 border-border bg-card shadow-sm focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all duration-200"
                />
                {searchQuery && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 h-9 w-9 p-0 -translate-y-1/2 bg-white/80 hover:bg-white shadow-sm border border-gray-200 rounded-xl transition-all duration-200 group"
                    onClick={() => setSearchQuery('')}
                  >
                    <X className="h-4 w-4 text-gray-500 group-hover:text-gray-700 transition-colors" />
                  </Button>
                )}
              </div>

              {/* Tabs */}
              <TabsList className="grid w-full grid-cols-2 lg:w-auto lg:grid-cols-4 gap-2 p-1 bg-white/50 backdrop-blur-sm rounded-2xl border border-gray-200 shadow-lg">
                <TabsTrigger
                  value="all"
                  className="h-14 px-6 py-3 text-sm font-semibold rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-teal-600 data-[state=active]:to-teal-500 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:scale-[1.02] transition-all duration-300 hover:scale-[1.01] hover:shadow-md"
                >
                  All ({getCount()})
                </TabsTrigger>

                <TabsTrigger
                  value="countries"
                  className="h-14 px-6 py-3 text-sm font-semibold rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-teal-600 data-[state=active]:to-teal-500 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:scale-[1.02] transition-all duration-300 hover:scale-[1.01] hover:shadow-md"
                >
                  <MapPin className="inline mr-1.5 h-4 w-4 mb-0.5" />
                  Countries ({countries.length})
                </TabsTrigger>

                <TabsTrigger
                  value="regions"
                  className="h-14 px-6 py-3 text-sm font-semibold rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-teal-600 data-[state=active]:to-teal-500 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:scale-[1.02] transition-all duration-300 hover:scale-[1.01] hover:shadow-md"
                >
                  <Globe className="inline mr-1.5 h-4 w-4 mb-0.5" />
                  Regions ({regions.length})
                </TabsTrigger>

                <TabsTrigger
                  value="global"
                  className="h-14 px-6 py-3 text-sm font-semibold rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-teal-600 data-[state=active]:to-teal-500 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:scale-[1.02] transition-all duration-300 hover:scale-[1.01] hover:shadow-md"
                >
                  🌍 Global ({globalPackages.length})
                </TabsTrigger>
              </TabsList>
            </div>

            <p className="text-sm text-muted-foreground mb-8">
              Showing {getCount()} {searchQuery && `for "${searchQuery}"`}
            </p>

            {/* 🔥 SEPARATE CONTENT FOR EACH TAB - NO COMPLEX LOGIC */}
            <TabsContent value="all" className="w-full">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                <AllContent />
              </div>
            </TabsContent>

            <TabsContent value="countries" className="w-full">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                <CountryContent />
              </div>
            </TabsContent>

            <TabsContent value="regions" className="w-full">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                <RegionContent />
              </div>
            </TabsContent>

            <TabsContent value="global" className="w-full">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                <GlobalContent />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </section>
  );
};

export default AllDestinations;
