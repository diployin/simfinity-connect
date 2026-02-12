// components/MobileDestinationSearch.tsx
'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { ChevronDown, Search, X, MapPin, Globe, Zap } from 'lucide-react';
import { Link, useLocation } from 'wouter';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { useQuery } from '@tanstack/react-query';
import { useCurrency } from '@/contexts/CurrencyContext';
import { convertPrice } from '@/lib/currency';
import DestinationCardSmall from '@/components/cards/DestinationCard';
import CountryRegionSkeleton from '@/components/skeleton/CountryRegionSkeleton';
import { Sheet, SheetContent } from '@/components/ui/sheet';

// ✅ INTERFACES
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

interface MobileDestinationSearchProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileDestinationSearch: React.FC<MobileDestinationSearchProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'top10' | 'countries' | 'regions' | 'global'>('top10');
  const [searchQuery, setSearchQuery] = useState('');
  const [, navigate] = useLocation();
  const { currency, currencies } = useCurrency();

  // ✅ Fetch Data
  const { data: destinations = [], isLoading: loadingDest } = useQuery({
    queryKey: ['/api/destinations/with-pricing', { currency }],
    enabled: isOpen,
  });

  const { data: regionsData = [], isLoading: loadingRegions } = useQuery({
    queryKey: ['/api/regions/with-pricing', { currency }],
    enabled: isOpen,
  });

  const { data: globalPackagesData = [], isLoading: loadingGlobal } = useQuery({
    queryKey: ['/api/packages/global', { currency }],
    enabled: isOpen,
  });

  // ✅ Process Countries
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

  // ✅ Process Regions
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

  // ✅ Process Global Packages
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

  // ✅ Top 10 Popular Destinations
  const top10Destinations = useMemo(() => {
    return countries.slice(0, 10);
  }, [countries]);

  // ✅ Navigation Handlers
  const handleCountryClick = (slug: string) => {
    navigate(`/destination/${slug}`);
    onClose();
  };

  const handleRegionClick = (slug: string) => {
    navigate(`/region/${slug}`);
    onClose();
  };

  const handleGlobalClick = () => {
    navigate('/global');
    onClose();
  };

  // ✅ Close on escape
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent
        side="right"
        overlayClassName="bg-transparent"
        className="w-full sm:w-full p-0 bg-white/90 dark:bg-background/90 backdrop-blur-lg flex flex-col border-none shadow-none"
      >
        {/* 🔥 MOBILE HEADER - Logo + Search */}
        <div className="sticky top-0 z-20 bg-white dark:bg-background border-b border-gray-200 dark:border-gray-700">
          {/* Header with close button */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Find Destinations
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Search Bar */}
          <div className="p-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Where are you travelling?"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
                className="pl-12 pr-12 h-11 text-lg border-none bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors"
                >
                  <X className="h-4 w-4 text-gray-400" />
                </button>
              )}
            </div>
          </div>

          {/* Tabs */}
          <div className="border-t border-gray-200 dark:border-gray-700 px-4">
            <div className="flex gap-0 overflow-x-auto scrollbar-hide">
              {[
                { id: 'top10', label: 'Top 10' },
                { id: 'countries', label: 'Country' },
                { id: 'regions', label: 'Region' },
                { id: 'global', label: 'Simfinity Passport', badge: 'New' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={cn(
                    'flex items-center gap-2 px-4 py-3 text-sm font-medium transition-all whitespace-nowrap border-b-2 flex-shrink-0',
                    activeTab === tab.id
                      ? 'border-primary text-primary'
                      : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white',
                  )}
                >
                  {tab.label}
                  {tab.badge && (
                    <span className="ml-1 rounded-full bg-yellow-400 px-1.5 py-0.5 text-[10px] font-bold text-black uppercase">
                      {tab.badge}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 🔥 MOBILE CONTENT - Full screen scrollable */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4 space-y-4">
            {/* Top 10 Tab */}
            {activeTab === 'top10' && (
              <div className="space-y-4">
                <div className="text-sm font-semibold text-gray-700 dark:text-gray-300 px-2 py-2">
                  Popular Destinations
                </div>
                {loadingDest ? (
                  <div className="grid grid-cols-2 gap-3">
                    <CountryRegionSkeleton count={6} />
                  </div>
                ) : top10Destinations.length ? (
                  <div className="grid grid-cols-2 gap-3">
                    {top10Destinations.map((item, index) => (
                      <DestinationCardSmall
                        key={item.id}
                        id={item.id}
                        name={item.name}
                        slug={item.slug}
                        image={item.image}
                        countryCode={item.countryCode}
                        startPrice={item.startPrice}
                        onClick={handleCountryClick}
                        index={index}
                        type="country"
                      />
                    ))}
                  </div>
                ) : (
                  <div className="col-span-full text-center py-12">
                    <Search className="mx-auto h-12 w-12 text-muted-foreground mb-3" />
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      No destinations found
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Countries Tab */}
            {activeTab === 'countries' && (
              <div className="space-y-4">
                <div className="text-sm font-semibold text-gray-700 dark:text-gray-300 px-2 py-2">
                  All Countries ({countries.length})
                </div>
                {loadingDest ? (
                  <div className="grid grid-cols-2 gap-3">
                    <CountryRegionSkeleton count={8} />
                  </div>
                ) : countries.length ? (
                  <div className="grid grid-cols-2 gap-3">
                    {countries.map((item, index) => (
                      <DestinationCardSmall
                        key={item.id}
                        id={item.id}
                        name={item.name}
                        slug={item.slug}
                        image={item.image}
                        countryCode={item.countryCode}
                        startPrice={item.startPrice}
                        onClick={handleCountryClick}
                        index={index}
                        type="country"
                      />
                    ))}
                  </div>
                ) : (
                  <div className="col-span-full text-center py-12">
                    <MapPin className="mx-auto h-12 w-12 text-muted-foreground mb-3" />
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      {searchQuery ? 'No countries match your search' : 'No countries available'}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Regions Tab */}
            {activeTab === 'regions' && (
              <div className="space-y-4">
                <div className="text-sm font-semibold text-gray-700 dark:text-gray-300 px-2 py-2">
                  All Regions ({regions.length})
                </div>
                {loadingRegions ? (
                  <div className="grid grid-cols-2 gap-3">
                    <CountryRegionSkeleton count={8} />
                  </div>
                ) : regions.length ? (
                  <div className="grid grid-cols-2 gap-3">
                    {regions.map((item, index) => (
                      <DestinationCardSmall
                        key={item.id}
                        id={item.id}
                        name={item.name}
                        slug={item.slug}
                        image={item.image}
                        startPrice={item.startPrice}
                        additionalInfo={`${item.countryCount} countries`}
                        onClick={handleRegionClick}
                        index={index}
                        type="region"
                      />
                    ))}
                  </div>
                ) : (
                  <div className="col-span-full text-center py-12">
                    <Globe className="mx-auto h-12 w-12 text-muted-foreground mb-3" />
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      {searchQuery ? 'No regions match your search' : 'No regions available'}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Simfinity Passport Plan Tab */}
            {activeTab === 'global' && (
              <div className="space-y-4">
                <div className="flex flex-col items-center justify-center py-12 text-center min-h-[300px]">
                  <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                    <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-1">Simfinity Passport</h3>
                  <p className="text-gray-500 font-thin text-base">
                    Coming soon
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 🔥 MOBILE FOOTER - CTA Buttons */}
        <div className="sticky bottom-0 bg-white dark:bg-background border-t border-gray-200 dark:border-gray-700 p-4 space-y-3">
          <Link
            href="/supported-devices"
            className="flex items-center justify-center gap-2 text-xs font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors py-2"
            onClick={onClose}
          >
            <span className="flex h-4 w-4 items-center justify-center rounded-full border border-gray-400 text-xs flex-shrink-0">
              ?
            </span>
            Is your device eSIM compatible?
          </Link>
          <button
            onClick={() => {
              navigate('/destinations');
              onClose();
            }}
            className="w-full bg-primary text-white font-bold py-3 px-6 rounded-full hover:bg-primary/90 transition-all active:scale-[0.98]"
          >
            View All Destinations
          </button>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileDestinationSearch;
