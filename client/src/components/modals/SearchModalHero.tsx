// 'use client';

// import { useState } from 'react';
// import { Link, useLocation } from 'wouter';
// import { useQuery } from '@tanstack/react-query';
// import { motion, AnimatePresence } from 'framer-motion';
// import { Search, Globe, ChevronRight, X, MapPin } from 'lucide-react';
// import { Input } from '@/components/ui/input';
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogHeader,
//   DialogTitle,
// } from '@/components/ui/dialog';
// import { useCurrency } from '@/contexts/CurrencyContext';

// // Types
// interface DestinationWithPricing {
//   id: number;
//   name: string;
//   slug: string;
//   countryCode: string;
//   minPrice: string;
//   packageCount?: number;
//   isPopular?: boolean;
// }

// interface RegionWithPricing {
//   id: number;
//   name: string;
//   slug: string;
//   minPrice: string;
//   packageCount?: number;
//   countries?: string[];
// }

// interface SearchModalProps {
//   open: boolean;
//   onOpenChange: (open: boolean) => void;
// }

// export function SearchModalHero({ open, onOpenChange }: SearchModalProps) {
//   const [searchQuery, setSearchQuery] = useState('');
//   const [, setLocation] = useLocation();
//   const { currency } = useCurrency();

//   const { data: destinationsWithPricing, isLoading: destinationsLoading } = useQuery<
//     DestinationWithPricing[]
//   >({
//     queryKey: ['/api/destinations/with-pricing', { currency }],
//   });

//   const { data: regionsWithPricing, isLoading: regionsLoading } = useQuery<RegionWithPricing[]>({
//     queryKey: ['/api/regions/with-pricing', { currency }],
//   });

//   // Popular destinations for display
//   const popularDestinations = [
//     { name: 'Mexico', countryCode: 'mx', slug: 'mexico', price: '$4.99', type: 'country' },
//     {
//       name: 'Switzerland',
//       countryCode: 'ch',
//       slug: 'switzerland',
//       price: '$3.99',
//       type: 'country',
//     },
//     { name: 'India', countryCode: 'in', slug: 'india', price: '$3.99', type: 'country' },
//     { name: 'Global', countries: '121', slug: 'global', price: '$8.99', type: 'global' },
//     { name: 'Europe', countries: '35', slug: 'europe', price: '$4.99', type: 'region' },
//   ];

//   const handleSearch = (e: React.FormEvent) => {
//     e.preventDefault();
//     if (searchQuery.trim()) {
//       setLocation(`/search?q=${encodeURIComponent(searchQuery)}`);
//       onOpenChange(false);
//     }
//   };

//   // Combine all data for search results
//   const getAllFilteredResults = () => {
//     if (searchQuery.length === 0) return [];

//     const results = [];

//     // Search in countries
//     if (destinationsWithPricing) {
//       const filteredCountries = destinationsWithPricing
//         .filter(
//           (d) =>
//             d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//             d.countryCode.toLowerCase().includes(searchQuery.toLowerCase()),
//         )
//         .map((country) => ({
//           ...country,
//           type: 'country',
//           displayName: country.name,
//           displayPrice: `From US$${parseFloat(country.minPrice).toFixed(2)}`,
//           icon: (
//             <div className="w-8 h-6 rounded overflow-hidden flex-shrink-0">
//               <img
//                 src={`https://flagcdn.com/${country.countryCode.toLowerCase()}.svg`}
//                 alt={country.name}
//                 className="w-full h-full object-cover"
//               />
//             </div>
//           ),
//         }));
//       results.push(...filteredCountries);
//     }

//     // Search in regions
//     if (regionsWithPricing) {
//       const filteredRegions = regionsWithPricing
//         .filter((r) => r.name.toLowerCase().includes(searchQuery.toLowerCase()))
//         .map((region) => ({
//           ...region,
//           type: 'region',
//           displayName: region.name,
//           displayPrice: `From US$${parseFloat(region.minPrice).toFixed(2)}`,
//           countriesCount: region.countries?.length || 0,
//           icon: (
//             <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
//               <Globe className="h-4 w-4 text-blue-600" />
//             </div>
//           ),
//         }));
//       results.push(...filteredRegions);
//     }

//     // Add Global option
//     if ('global'.includes(searchQuery.toLowerCase())) {
//       results.unshift({
//         id: 'global',
//         name: 'Global',
//         slug: 'global',
//         type: 'global',
//         displayName: 'Global',
//         displayPrice: 'From US$8.99',
//         countriesCount: 121,
//         icon: (
//           <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0">
//             <Globe className="h-4 w-4 text-purple-600" />
//           </div>
//         ),
//       });
//     }

//     return results.slice(0, 10);
//   };

//   return (
//     <Dialog open={open} onOpenChange={onOpenChange}>
//       <DialogContent className="max-w-[500px] max-h-[80vh] overflow-hidden p-0 rounded-2xl">
//         <div className="relative">
//           {/* Header */}
//           <div className="sticky top-0 z-10 bg-white px-6 pt-6 pb-4 border-b">
//             <div className="flex items-center justify-between mb-4">
//               <DialogTitle className="text-2xl font-bold text-gray-900">Where?</DialogTitle>
//               <button
//                 onClick={() => onOpenChange(false)}
//                 className="p-2 hover:bg-gray-100 rounded-full transition-colors"
//               >
//                 <X size={20} />
//               </button>
//             </div>

//             {/* Search Input */}
//             <form onSubmit={handleSearch}>
//               <div className="relative">
//                 <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
//                 <Input
//                   type="text"
//                   placeholder="Enter your destination"
//                   value={searchQuery}
//                   onChange={(e) => setSearchQuery(e.target.value)}
//                   className="pl-12 pr-4 py-6 text-base rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 bg-gray-50 placeholder:text-gray-400"
//                   autoFocus
//                 />
//               </div>
//             </form>
//           </div>

//           {/* Content */}
//           <div className="max-h-[calc(80vh-140px)] overflow-y-auto">
//             {searchQuery.length > 0 ? (
//               // Search Results
//               <div className="p-6">
//                 <h3 className="text-sm font-semibold text-gray-700 mb-3">Search Results</h3>
//                 <div className="space-y-2">
//                   {getAllFilteredResults().map((item, idx) => (
//                     <Link
//                       key={item.id || idx}
//                       href={
//                         item.type === 'country'
//                           ? `/destination/${item.slug}`
//                           : item.type === 'region'
//                             ? `/region/${item.slug}`
//                             : `/global`
//                       }
//                       onClick={() => onOpenChange(false)}
//                     >
//                       <motion.div
//                         initial={{ opacity: 0, y: 5 }}
//                         animate={{ opacity: 1, y: 0 }}
//                         transition={{ delay: idx * 0.05 }}
//                         className="flex items-center justify-between p-3 hover:bg-blue-50 rounded-xl cursor-pointer group border border-transparent hover:border-blue-100"
//                       >
//                         <div className="flex items-center gap-3">
//                           {item.icon}
//                           <div>
//                             <p className="font-medium text-gray-900">{item.displayName}</p>
//                             <p className="text-sm text-gray-600">{item.displayPrice}</p>
//                           </div>
//                         </div>
//                         <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-blue-600" />
//                       </motion.div>
//                     </Link>
//                   ))}
//                 </div>
//               </div>
//             ) : (
//               // Default View - Most Popular
//               <div className="p-6">
//                 <h3 className="text-sm font-semibold text-gray-700 mb-4">
//                   Most popular destinations
//                 </h3>

//                 <div className="space-y-3">
//                   {popularDestinations.map((dest, idx) => (
//                     <Link
//                       key={dest.slug}
//                       href={
//                         dest.type === 'country'
//                           ? `/destination/${dest.slug}`
//                           : dest.type === 'region'
//                             ? `/region/${dest.slug}`
//                             : `/global`
//                       }
//                       onClick={() => onOpenChange(false)}
//                     >
//                       <motion.div
//                         initial={{ opacity: 0, x: -10 }}
//                         animate={{ opacity: 1, x: 0 }}
//                         transition={{ delay: idx * 0.1 }}
//                         className="flex items-center justify-between p-4 bg-gray-50 hover:bg-blue-50 rounded-xl cursor-pointer group border border-gray-100 hover:border-blue-200 transition-all"
//                       >
//                         <div className="flex items-center gap-4">
//                           {dest.type === 'country' ? (
//                             <div className="w-10 h-7 rounded overflow-hidden border border-gray-200">
//                               <img
//                                 src={`https://flagcdn.com/${dest.countryCode.toLowerCase()}.svg`}
//                                 alt={dest.name}
//                                 className="w-full h-full object-cover"
//                               />
//                             </div>
//                           ) : (
//                             <div
//                               className={`w-10 h-10 rounded-lg flex items-center justify-center ${
//                                 dest.type === 'global' ? 'bg-purple-100' : 'bg-blue-100'
//                               }`}
//                             >
//                               <Globe
//                                 className={`h-5 w-5 ${
//                                   dest.type === 'global' ? 'text-purple-600' : 'text-blue-600'
//                                 }`}
//                               />
//                             </div>
//                           )}
//                           <div>
//                             <p className="font-medium text-gray-900">{dest.name}</p>
//                             <div className="flex items-center gap-2">
//                               <span className="text-sm font-medium text-blue-600">
//                                 {dest.price}
//                               </span>
//                               {dest.countries && (
//                                 <span className="text-xs text-gray-500">
//                                   · {dest.countries} countries
//                                 </span>
//                               )}
//                             </div>
//                           </div>
//                         </div>
//                         <div className="flex items-center">
//                           <span
//                             className={`text-xs font-medium px-2 py-1 rounded ${
//                               dest.type === 'country'
//                                 ? 'bg-green-100 text-green-800'
//                                 : dest.type === 'region'
//                                   ? 'bg-blue-100 text-blue-800'
//                                   : 'bg-purple-100 text-purple-800'
//                             }`}
//                           >
//                             {dest.type === 'country'
//                               ? 'Country'
//                               : dest.type === 'region'
//                                 ? 'Region'
//                                 : 'Global'}
//                           </span>
//                           <ChevronRight className="h-5 w-5 text-gray-400 ml-2 group-hover:text-blue-600" />
//                         </div>
//                       </motion.div>
//                     </Link>
//                   ))}
//                 </div>

//                 {/* All Countries Section */}
//                 {destinationsWithPricing && destinationsWithPricing.length > 0 && (
//                   <div className="mt-8">
//                     <h3 className="text-sm font-semibold text-gray-700 mb-4">
//                       All Countries ({destinationsWithPricing.length})
//                     </h3>
//                     <div className="max-h-60 overflow-y-auto pr-2 space-y-2">
//                       {destinationsWithPricing.map((country) => (
//                         <Link
//                           key={country.slug}
//                           href={`/destination/${country.slug}`}
//                           onClick={() => onOpenChange(false)}
//                         >
//                           <motion.div
//                             whileHover={{ x: 2 }}
//                             className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg cursor-pointer group"
//                           >
//                             <div className="flex items-center gap-3">
//                               <div className="w-8 h-6 rounded overflow-hidden">
//                                 <img
//                                   src={`https://flagcdn.com/${country.countryCode.toLowerCase()}.svg`}
//                                   alt={country.name}
//                                   className="w-full h-full object-cover"
//                                 />
//                               </div>
//                               <span className="text-sm text-gray-800">{country.name}</span>
//                             </div>
//                             <div className="flex items-center gap-2">
//                               <span className="text-sm font-medium text-blue-600">
//                                 From US${parseFloat(country.minPrice).toFixed(2)}
//                               </span>
//                               <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-blue-600" />
//                             </div>
//                           </motion.div>
//                         </Link>
//                       ))}
//                     </div>
//                   </div>
//                 )}
//               </div>
//             )}
//           </div>
//         </div>
//       </DialogContent>
//     </Dialog>
//   );
// }

'use client';

import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Search, Globe, ChevronRight, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useCurrency } from '@/contexts/CurrencyContext';
import { convertPrice, getCurrencySymbol } from '@/lib/currency';

// Types
interface DestinationWithPricing {
  id: number;
  name: string;
  slug: string;
  countryCode: string;
  minPrice: string;
  packageCount?: number;
  isPopular?: boolean;
}

interface RegionWithPricing {
  id: number;
  name: string;
  slug: string;
  minPrice: string;
  packageCount?: number;
  countries?: string[];
}

interface SearchModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SearchModalHero({ open, onOpenChange }: SearchModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [, setLocation] = useLocation();
  const { currency, currencies } = useCurrency();
  const currencySymbol = getCurrencySymbol(currency, currencies);
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input when modal opens
  useEffect(() => {
    if (open && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [open]);

  const { data: destinationsWithPricing } = useQuery<DestinationWithPricing[]>({
    queryKey: ['/api/destinations/with-pricing', { currency }],
  });

  const { data: regionsWithPricing } = useQuery<RegionWithPricing[]>({
    queryKey: ['/api/regions/with-pricing', { currency }],
  });

  // Get popular destinations from API or use default
  const getPopularDestinations = () => {
    if (destinationsWithPricing && regionsWithPricing) {
      // Get top 3 popular countries
      const popularCountries = destinationsWithPricing
        .filter((d) => d.isPopular)
        .slice(0, 3)
        .map((country) => ({
          name: country.name,
          countryCode: country.countryCode,
          slug: country.slug,
          price: `${currencySymbol}${convertPrice(parseFloat(country.minPrice), 'USD', currency, currencies).toFixed(2)}`,
          type: 'country' as const,
        }));

      // Get global and europe regions
      const globalRegion = {
        name: 'Global',
        slug: 'global',
        price: `${currencySymbol}${convertPrice(8.99, 'USD', currency, currencies).toFixed(2)}`,
        countries: '121',
        type: 'global' as const,
      };

      const europeRegion = regionsWithPricing.find((r) => r.name.toLowerCase() === 'europe') || {
        name: 'Europe',
        slug: 'europe',
        price: `${currencySymbol}${convertPrice(4.99, 'USD', currency, currencies).toFixed(2)}`,
        countries: '35',
        type: 'region' as const,
      };

      return [
        ...popularCountries,
        globalRegion,
        {
          name: europeRegion.name,
          slug: europeRegion.slug,
          price: europeRegion.minPrice
            ? `${currencySymbol}${parseFloat(europeRegion.minPrice).toFixed(2)}`
            : `${currencySymbol}${convertPrice(4.99, 'USD', currency, currencies).toFixed(2)}`,
          countries: '35',
          type: 'region' as const,
        },
      ];
    }

    // Default popular destinations
    return [
      {
        name: 'Mexico',
        countryCode: 'mx',
        slug: 'mexico',
        price: `${currencySymbol}${convertPrice(4.99, 'USD', currency, currencies).toFixed(2)}`,
        type: 'country' as const,
      },
      {
        name: 'Switzerland',
        countryCode: 'ch',
        slug: 'switzerland',
        price: `${currencySymbol}${convertPrice(3.99, 'USD', currency, currencies).toFixed(2)}`,
        type: 'country' as const,
      },
      {
        name: 'India',
        countryCode: 'in',
        slug: 'india',
        price: `${currencySymbol}${convertPrice(3.99, 'USD', currency, currencies).toFixed(2)}`,
        type: 'country' as const,
      },
      {
        name: 'Global',
        slug: 'global',
        price: `${currencySymbol}${convertPrice(8.99, 'USD', currency, currencies).toFixed(2)}`,
        countries: '121',
        type: 'global' as const,
      },
      {
        name: 'Europe',
        slug: 'europe',
        price: `${currencySymbol}${convertPrice(4.99, 'USD', currency, currencies).toFixed(2)}`,
        countries: '35',
        type: 'region' as const,
      },
    ];
  };

  const popularDestinations = getPopularDestinations();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setLocation(`/search?q=${encodeURIComponent(searchQuery)}`);
      onOpenChange(false);
    }
  };

  // Combine all data for search results
  const getAllFilteredResults = () => {
    if (searchQuery.length === 0) return [];

    const results = [];

    // Search in countries
    if (destinationsWithPricing) {
      const filteredCountries = destinationsWithPricing
        .filter(
          (d) =>
            d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            d.countryCode.toLowerCase().includes(searchQuery.toLowerCase()),
        )
        .map((country) => ({
          ...country,
          type: 'country' as const,
          displayName: country.name,
          displayPrice: `From ${currencySymbol}${parseFloat(country.minPrice).toFixed(2)}`,
          icon: (
            <div className="w-8 h-6 rounded overflow-hidden flex-shrink-0">
              <img
                src={`https://flagcdn.com/${country.countryCode.toLowerCase()}.svg`}
                alt={country.name}
                className="w-full h-full object-cover"
              />
            </div>
          ),
        }));
      results.push(...filteredCountries);
    }

    // Search in regions
    if (regionsWithPricing) {
      const filteredRegions = regionsWithPricing
        .filter((r) => r.name.toLowerCase().includes(searchQuery.toLowerCase()))
        .map((region) => ({
          ...region,
          type: 'region' as const,
          displayName: region.name,
          displayPrice: `From ${currencySymbol}${parseFloat(region.minPrice).toFixed(2)}`,
          countriesCount: region.countries?.length || 0,
          icon: (
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Globe className="h-4 w-4 text-primary" />
            </div>
          ),
        }));
      results.push(...filteredRegions);
    }

    // Add Global option
    if ('global'.includes(searchQuery.toLowerCase())) {
      results.unshift({
        id: 'global',
        name: 'Global',
        slug: 'global',
        type: 'global' as const,
        displayName: 'Global',
        displayPrice: `From ${currencySymbol}${convertPrice(8.99, 'USD', currency, currencies).toFixed(2)}`,
        countriesCount: 121,
        icon: (
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
            <Globe className="h-4 w-4 text-primary" />
          </div>
        ),
      });
    }

    return results.slice(0, 15);
  };

  const hasSearchQuery = searchQuery.length > 0;
  const filteredResults = getAllFilteredResults();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[500px] max-h-[80vh] overflow-hidden p-0 rounded-2xl">
        <div className="relative flex flex-col h-full">
          {/* Header - Fixed height */}
          <div className="sticky top-0 z-10 bg-white px-6 pt-6 pb-4 border-b shrink-0">
            <div className="flex items-center justify-between mb-4">
              <DialogTitle className="text-2xl font-bold text-gray-900">Where?</DialogTitle>
              <button
                onClick={() => onOpenChange(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Search Input */}
            <form onSubmit={handleSearch} className="shrink-0">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  ref={inputRef}
                  type="text"
                  placeholder="Enter your destination"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 pr-4 py-6 text-base rounded-xl border border-primary/30 focus:border-primary focus:ring-2 focus:ring-primary/20 bg-gray-50 placeholder:text-gray-400"
                />
              </div>
            </form>
          </div>

          {/* Content - Scrollable only when searching */}
          <div className={`flex-1 overflow-y-auto ${hasSearchQuery ? '' : 'overflow-y-hidden'}`}>
            {hasSearchQuery ? (
              // Search Results - Scrollable
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Search Results</h3>
                  <span className="text-sm text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full">
                    {filteredResults.length} results
                  </span>
                </div>

                {filteredResults.length === 0 ? (
                  <div className="py-12 text-center">
                    <Globe className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500 font-medium">No results found</p>
                    <p className="text-sm text-gray-400 mt-1">Try a different search term</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {filteredResults.map((item, idx) => (
                      <Link
                        key={item.id || idx}
                        href={
                          item.type === 'country'
                            ? `/destination/${item.slug}`
                            : item.type === 'region'
                              ? `/region/${item.slug}`
                              : `/global`
                        }
                        onClick={() => onOpenChange(false)}
                      >
                        <motion.div
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.03 }}
                          className="flex items-center justify-between p-4 hover:bg-primary/5 rounded-xl cursor-pointer group border border-transparent hover:border-primary/20 transition-all"
                        >
                          <div className="flex items-center gap-4">
                            {item.icon}
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-gray-900 truncate">
                                {item.displayName}
                              </p>
                              <p className="text-sm text-gray-600">{item.displayPrice}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <span
                              className={`text-xs font-medium px-2 py-1 rounded ${item.type === 'country'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-primary/10 text-primary'
                                }`}
                            >
                              {item.type === 'country'
                                ? 'Country'
                                : item.type === 'region'
                                  ? 'Region'
                                  : 'Global'}
                            </span>
                            <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-primary transition-colors" />
                          </div>
                        </motion.div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              // Default View - Most Popular (No scroll)
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">
                  Most popular destinations
                </h3>

                <div className="space-y-3">
                  {popularDestinations.map((dest, idx) => (
                    <Link
                      key={dest.slug || idx}
                      href={
                        dest.type === 'country'
                          ? `/destination/${dest.slug}`
                          : dest.type === 'region'
                            ? `/region/${dest.slug}`
                            : `/global`
                      }
                      onClick={() => onOpenChange(false)}
                    >
                      <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="flex items-center justify-between p-4 bg-gray-50 hover:bg-primary/5 rounded-xl cursor-pointer group border border-gray-100 hover:border-primary/20 transition-all"
                      >
                        <div className="flex items-center gap-4">
                          {dest.type === 'country' ? (
                            <div className="w-10 h-7 rounded overflow-hidden border border-gray-200">
                              <img
                                src={`https://flagcdn.com/${dest.countryCode.toLowerCase()}.svg`}
                                alt={dest.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          ) : (
                            <div
                              className="w-10 h-10 rounded-lg flex items-center justify-center bg-primary/10"
                            >
                              <Globe
                                className="h-5 w-5 text-primary"
                              />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-900 truncate">{dest.name}</p>
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-bold text-primary">
                                {dest.price}
                              </span>
                              {'countries' in dest && (
                                <span className="text-xs text-gray-500">
                                  · {dest.countries} countries
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <span
                            className={`text-xs font-bold px-2 py-1 rounded ${dest.type === 'country'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-primary/10 text-primary'
                              }`}
                          >
                            {dest.type === 'country'
                              ? 'Country'
                              : dest.type === 'region'
                                ? 'Region'
                                : 'Global'}
                          </span>
                          <ChevronRight className="h-5 w-5 text-gray-400 ml-2 group-hover:text-primary transition-colors" />
                        </div>
                      </motion.div>
                    </Link>
                  ))}
                </div>

                {/* Info message - No All Countries section */}
                <div className="mt-8 p-4 bg-primary/5 rounded-xl border border-primary/10">
                  <div className="flex items-start gap-3">
                    <Search className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        Search for more destinations
                      </p>
                      <p className="text-xs text-gray-600 mt-1">
                        Type in the search bar above to explore all countries and regions
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
