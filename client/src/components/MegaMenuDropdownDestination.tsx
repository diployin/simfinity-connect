'use client';

import React, { useEffect, useRef, useState, useMemo } from 'react';
import { Button } from './ui/button';
import { ChevronDown, Search, X } from 'lucide-react';
import { Link, useLocation } from 'wouter';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { useQuery } from '@tanstack/react-query';
import { useCurrency } from '@/contexts/CurrencyContext';
import { convertPrice } from '@/lib/currency';
import DestinationCardSmall from '@/components/cards/DestinationCard';
import CountryRegionSkeleton from '@/components/skeleton/CountryRegionSkeleton';

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

interface MegaMenuDropdownProps {
  label: string;
  badge?: string;
  config?: any;
  onOpenChange?: (isOpen: boolean) => void;
  className: string;
  isDarkBackground?: boolean;
}

const MegaMenuDropdownDestination: React.FC<MegaMenuDropdownProps> = ({
  label,
  badge,
  config,
  onOpenChange,
  className,
  isDarkBackground = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'top10' | 'countries' | 'regions' | 'global'>('top10');
  const [searchQuery, setSearchQuery] = useState('');
  const menuRef = useRef<HTMLDivElement>(null);
  const [, navigate] = useLocation();
  const { currency, currencies } = useCurrency();

  // ✅ Fetch Data
  const { data: destinations = [], isLoading: loadingDest } = useQuery({
    queryKey: ['/api/destinations/with-pricing', { currency }],
  });

  const { data: regionsData = [], isLoading: loadingRegions } = useQuery({
    queryKey: ['/api/regions/with-pricing', { currency }],
  });

  const { data: globalPackagesData = [], isLoading: loadingGlobal } = useQuery({
    queryKey: ['/api/packages/global', { currency }],
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

  // ✅ Outside click handler
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        onOpenChange?.(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onOpenChange]);

  // ✅ Escape key handler
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
        onOpenChange?.(false);
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onOpenChange]);

  const handleToggle = () => {
    const newState = !isOpen;
    setIsOpen(newState);
    onOpenChange?.(newState);
  };

  const closeMenu = () => {
    setIsOpen(false);
    onOpenChange?.(false);
    setSearchQuery('');
  };

  // ✅ Navigation Handlers
  const handleCountryClick = (slug: string) => {
    navigate(`/destination/${slug}`);
    closeMenu();
  };

  const handleRegionClick = (slug: string) => {
    navigate(`/region/${slug}`);
    closeMenu();
  };

  const handleGlobalClick = () => {
    navigate('/global');
    closeMenu();
  };

  // Only show if label is "Destinations" or similar
  if (label !== 'Destinations') {
    return (
      <div ref={menuRef} className="relative">
        <button
          type="button"
          onClick={handleToggle}
          className={cn(
            'flex items-center gap-1 px-3 py-2 text-sm font-medium transition-colors hover:text-gray-600 dark:hover:text-gray-300',
          )}
        >
          {label}s
          {badge && (
            <span className="rounded-full bg-yellow-400 px-2 py-0.5 text-xs font-medium text-black">
              {badge}
            </span>
          )}
          <ChevronDown
            className={cn('h-4 w-4 transition-transform duration-200', isOpen && 'rotate-180')}
          />
        </button>

        {/* Default Mega Menu (Original Config-based) */}
        {isOpen && config && (
          <>
            <div className="fixed inset-0 z-40" onClick={closeMenu} />
            <div className="fixed top-[69px] right-0 left-0 z-50">
              <div className="mx-auto">
                <div className="overflow-hidden border border-gray-200 shadow-2xl bg-white dark:bg-gray-900 backdrop-blur-2xl">
                  <div className="grid grid-cols-12 gap-0">
                    <div className={`${config.slider ? 'col-span-8' : 'col-span-12'} px-8 py-10`}>
                      <div className="grid grid-cols-2 gap-x-12 gap-y-8">
                        {config.columns?.map((column: any, colIndex: number) => (
                          <div key={colIndex} className="space-y-5">
                            <ul className="space-y-2">
                              {column.items?.map((item: any, itemIndex: number) => (
                                <li key={itemIndex}>
                                  <Link
                                    href={item.href}
                                    className="group flex items-start gap-3 rounded-lg p-3 transition-all hover:bg-gray-50 dark:hover:bg-gray-800"
                                    onClick={closeMenu}
                                  >
                                    {item.icon && (
                                      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-yellow-400 text-black transition-transform group-hover:scale-110">
                                        {item.icon}
                                      </div>
                                    )}
                                    <div className="flex-1 pt-0.5">
                                      <div className="flex items-center gap-2">
                                        <span className="text-sm font-semibold group-hover:text-gray-700">
                                          {item.label}
                                        </span>
                                        {item.badge && (
                                          <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-700">
                                            {item.badge}
                                          </span>
                                        )}
                                      </div>
                                      {item.description && (
                                        <p className="mt-1 text-xs leading-relaxed text-gray-500">
                                          {item.description}
                                        </p>
                                      )}
                                    </div>
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    );
  }

  return (
    <div ref={menuRef} className="relative">
      <button
        type="button"
        onClick={handleToggle}
        className={cn(
          `inline-flex items-center gap-1 px-5 py-2 text-sm font-medium transition-all border rounded-3xl gap-3`,
          isDarkBackground
            ? "text-white border-white/30 hover:bg-white/10"
            : "text-gray-900 border-black hover:text-white hover:bg-black",
          className
        )}
      >
        <Search className={cn("w-4 h-4 transition-colors", isDarkBackground ? "text-white" : "text-black group-hover:text-white")} />

        {label}
      </button>

      {/* 🔥 DESTINATIONS MEGA MENU */}
      {isOpen && (
        <>
          <div className="fixed inset-0 z-40 " onClick={closeMenu} />

          <div className="fixed top-[69px] right-0 left-0 z-50">
            <div className="w-full">
              <div className="overflow-hidden rounded-b-2xl border border-gray-200 dark:border-gray-700 shadow-2xl bg-white dark:bg-gray-900">
                {/* 🔥 SEARCH BAR - Like Saily */}
                <div className="border-b border-gray-200 dark:border-gray-700 p-6">
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      type="text"
                      placeholder="Where are you travelling to?"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-12 pr-12 h-12 text-base rounded-full border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-teal-500"
                    />
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery('')}
                        className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
                      >
                        <X className="h-4 w-4 text-gray-400" />
                      </button>
                    )}
                  </div>
                </div>

                {/* 🔥 TABS - Top 10, Country, Region, Ultra Plan */}
                <div className="border-b border-gray-200 dark:border-gray-700 px-6">
                  <div className="flex gap-1">
                    {[
                      { id: 'top10', label: 'Top 10' },
                      { id: 'countries', label: 'Country' },
                      { id: 'regions', label: 'Region' },
                      { id: 'global', label: 'Ultra Plan', badge: 'New' },
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={cn(
                          'px-6 py-3 text-sm font-medium transition-all relative',
                          activeTab === tab.id
                            ? 'text-gray-900 dark:text-white'
                            : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white',
                        )}
                      >
                        <span className="flex items-center gap-2">
                          {tab.label}
                          {tab.badge && (
                            <span className="rounded-full bg-yellow-400 px-2 py-0.5 text-xs font-medium text-black">
                              {tab.badge}
                            </span>
                          )}
                        </span>
                        {activeTab === tab.id && (
                          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-black dark:bg-white" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 🔥 CONTENT AREA - Grid of Destinations */}
                <div className="p-6 max-h-[500px] overflow-y-auto">
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {/* Top 10 Tab */}
                    {activeTab === 'top10' &&
                      (loadingDest ? (
                        <CountryRegionSkeleton count={10} />
                      ) : top10Destinations.length ? (
                        top10Destinations.map((item, index) => (
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
                          <p className="text-gray-600 dark:text-gray-400">No destinations found</p>
                        </div>
                      ))}

                    {/* Countries Tab */}
                    {activeTab === 'countries' &&
                      (loadingDest ? (
                        <CountryRegionSkeleton count={12} />
                      ) : countries.length ? (
                        countries
                          .slice(0, 10)
                          .map((item, index) => (
                            <DestinationCardSmall
                              key={item.id}
                              id={item.id}
                              name={item.name}
                              slug={item.slug}
                              image={item.image}
                              countryCode={item.countryCode}
                              startPrice={convertPrice(
                                item.startPrice,
                                'USD',
                                currency,
                                currencies,
                              )}
                              onClick={handleCountryClick}
                              index={index}
                              type="country"
                            />
                          ))
                      ) : (
                        <div className="col-span-full text-center py-12">
                          <Search className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
                          <p className="text-gray-600 dark:text-gray-400">No countries found</p>
                        </div>
                      ))}

                    {/* Regions Tab */}
                    {activeTab === 'regions' &&
                      (loadingRegions ? (
                        <CountryRegionSkeleton count={12} />
                      ) : regions.length ? (
                        regions
                          .slice(0, 10)
                          .map((item, index) => (
                            <DestinationCardSmall
                              key={item.id}
                              id={item.id}
                              name={item.name}
                              slug={item.slug}
                              image={item.image}
                              startPrice={convertPrice(
                                item.startPrice,
                                'USD',
                                currency,
                                currencies,
                              )}
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
                          <p className="text-gray-600 dark:text-gray-400">No regions found</p>
                        </div>
                      ))}

                    {/* Global/Ultra Plan Tab */}
                    {activeTab === 'global' &&
                      (loadingGlobal ? (
                        <CountryRegionSkeleton count={12} />
                      ) : globalPackages.length ? (
                        globalPackages
                          .slice(0, 10)
                          .map((item, index) => (
                            <DestinationCardSmall
                              key={item.id}
                              id={item.id}
                              name={item.name}
                              slug={item.slug}
                              startPrice={convertPrice(
                                item.startPrice,
                                'USD',
                                currency,
                                currencies,
                              )}
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
                          <p className="text-gray-600 dark:text-gray-400">
                            No global packages found
                          </p>
                        </div>
                      ))}
                  </div>
                </div>

                {/* 🔥 BOTTOM SECTION - eSIM Compatible Check + CTA */}
                <div className="flex items-center justify-between border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-6 py-4">
                  <Link
                    href="/esim-supported-devices"
                    className="flex items-center gap-2 text-sm font-medium text-gray-900 dark:text-white hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                    onClick={closeMenu}
                  >
                    <span className="flex h-5 w-5 items-center justify-center rounded-full border border-gray-400 text-xs">
                      ?
                    </span>
                    Is your device eSIM compatible?
                  </Link>
                  <Button
                    onClick={() => {
                      navigate('/destinations');
                      closeMenu();
                    }}
                    className="bg-primary-gradient text-white rounded-full px-6"
                  >
                    View All Destinations
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default MegaMenuDropdownDestination;
