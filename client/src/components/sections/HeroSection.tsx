'use client';

import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import {
  Search,
  Globe,
  ChevronRight,
} from 'lucide-react';
import { useCurrency } from '@/contexts/CurrencyContext';
import { SearchModalHero } from '../modals/SearchModalHero';
import { useTranslation } from '@/contexts/TranslationContext';

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

export function HeroSection() {
  const [phoneSearchQuery, setPhoneSearchQuery] = useState('');
  const [searchType, setSearchType] = useState<'country' | 'region'>('country');
  const [, setLocation] = useLocation();
  const { currency } = useCurrency();
  const { t } = useTranslation();

  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

  const { data: destinationsWithPricing, isLoading: destinationsLoading } = useQuery<
    DestinationWithPricing[]
  >({
    queryKey: ['/api/destinations/with-pricing', { currency }],
  });

  const { data: regionsWithPricing, isLoading: regionsLoading } = useQuery<RegionWithPricing[]>({
    queryKey: ['/api/regions/with-pricing', { currency }],
  });

  const popularDestinations = destinationsWithPricing?.filter((d) => d.isPopular).slice(0, 6) || [];

  const defaultPopularDestinations = [
    { name: 'United States', countryCode: 'us', slug: 'united-states' },
    { name: 'United Kingdom', countryCode: 'gb', slug: 'united-kingdom' },
    { name: 'UAE', countryCode: 'ae', slug: 'united-arab-emirates' },
    { name: 'Japan', countryCode: 'jp', slug: 'japan' },
    { name: 'Thailand', countryCode: 'th', slug: 'thailand' },
    { name: 'France', countryCode: 'fr', slug: 'france' },
  ];

  const displayPopular =
    popularDestinations.length > 0
      ? popularDestinations.map((d) => ({
        name: d.name,
        countryCode: d.countryCode,
        slug: d.slug,
        minPrice: d.minPrice,
      }))
      : defaultPopularDestinations.map((d) => ({
        ...d,
        minPrice: '0',
      }));

  const defaultPopularRegions = [
    { id: 1, name: 'Europe', slug: 'europe', minPrice: '0' },
    { id: 2, name: 'Asia', slug: 'asia', minPrice: '0' },
    { id: 3, name: 'Americas', slug: 'americas', minPrice: '0' },
  ];

  const displayPopularRegions =
    regionsWithPricing && regionsWithPricing.length > 0
      ? regionsWithPricing.slice(0, 3)
      : defaultPopularRegions;

  const handlePhoneSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (phoneSearchQuery.trim()) {
      setLocation(`/search?q=${encodeURIComponent(phoneSearchQuery)}`);
    }
  };

  const getFilteredResults = () => {
    if (phoneSearchQuery.length === 0) return [];

    if (searchType === 'country') {
      return (
        destinationsWithPricing?.filter(
          (d) =>
            d.name.toLowerCase().includes(phoneSearchQuery.toLowerCase()) ||
            d.countryCode.toLowerCase().includes(phoneSearchQuery.toLowerCase()),
        ) || []
      ).slice(0, 5);
    } else {
      return (
        regionsWithPricing?.filter((r) =>
          r.name.toLowerCase().includes(phoneSearchQuery.toLowerCase()),
        ) || []
      ).slice(0, 5);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: 'easeOut' },
    },
  };

  return (
    <section className="relative overflow-hidden bg-[#e8f4f8] dark:bg-gray-900">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <svg className="absolute top-0 right-0 w-[60%] h-full" viewBox="0 0 600 500" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
          <path d="M200 -50 Q350 50 450 150 Q550 250 500 400 Q480 500 600 500 L600 -50 Z" fill="#14b8a6" opacity="0.15" />
          <path d="M300 -30 Q400 80 480 200 Q560 320 520 450 Q510 500 600 480 L600 -30 Z" fill="#14b8a6" opacity="0.08" />
        </svg>
        <div className="absolute top-[10%] right-[15%] w-[200px] h-[200px] rounded-full bg-teal-200/20 dark:bg-teal-800/10 blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center min-h-[520px] lg:min-h-[560px]">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-col items-start text-left py-10 lg:py-16"
          >
            <motion.h1
              variants={itemVariants}
              className="text-3xl sm:text-4xl md:text-[2.75rem] lg:text-[3.25rem] font-bold text-gray-900 dark:text-white tracking-tight leading-[1.15] mb-5"
              data-testid="text-hero-headline"
            >
              {t('website.home.hero.global', 'Affordable eSIM data')}{' '}
              {t('website.home.hero.forLifetime', 'for international travel')}
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="text-base sm:text-lg text-gray-600 dark:text-gray-400 mb-6"
            >
              {t('website.home.hero.subtitle', 'Where do you need mobile data?')}
            </motion.p>

            <motion.div variants={itemVariants} className="w-full max-w-md mb-8">
              <button
                onClick={() => setIsSearchModalOpen(true)}
                className="w-full flex items-center gap-3 px-4 py-3 sm:px-5 sm:py-3.5 rounded-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-teal-300 dark:hover:border-teal-600 transition-all shadow-sm hover:shadow-md group cursor-pointer text-left"
              >
                <span className="text-sm sm:text-base text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors flex-1">
                  {t('website.home.hero.search', 'Search for destination')}
                </span>
                <div className="p-2 rounded-full bg-teal-500 text-white flex-shrink-0">
                  <Search className="h-4 w-4" />
                </div>
              </button>
            </motion.div>

            <motion.div variants={itemVariants} className="w-full max-w-md">
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                {t('website.home.hero.popularDestinations', 'Popular destinations')}
              </p>
              <div className="flex flex-wrap items-start gap-2">
                {displayPopular.map((dest) => (
                  <Link key={dest.slug} href={`/destination/${dest.slug}`}>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.97 }}
                      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-teal-300 dark:hover:border-teal-600 transition-all cursor-pointer shadow-sm hover:shadow-md"
                    >
                      <img
                        src={`https://flagcdn.com/16x12/${dest.countryCode.toLowerCase()}.png`}
                        srcSet={`https://flagcdn.com/32x24/${dest.countryCode.toLowerCase()}.png 2x`}
                        alt={dest.name}
                        className="w-4 h-3 rounded-[2px] object-cover"
                      />
                      <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{dest.name}</span>
                      <ChevronRight className="h-3 w-3 text-gray-400" />
                    </motion.div>
                  </Link>
                ))}
                <Link href="/destinations">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.97 }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-teal-50 dark:bg-teal-900/30 border border-teal-200 dark:border-teal-700 hover:bg-teal-100 dark:hover:bg-teal-900/50 transition-all cursor-pointer"
                  >
                    <Globe className="h-3 w-3 text-teal-600 dark:text-teal-400" />
                    <span className="text-xs font-medium text-teal-600 dark:text-teal-400">
                      {t('website.home.hero.viewAll', 'View all')}
                    </span>
                  </motion.div>
                </Link>
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="hidden lg:flex items-center justify-center relative"
          >
            <img
              src="/images/hero-phone-luggage.png"
              alt="eSIM Travel"
              className="w-full max-w-md xl:max-w-lg object-contain drop-shadow-2xl relative z-10"
            />
          </motion.div>
        </div>
      </div>

      <SearchModalHero open={isSearchModalOpen} onOpenChange={setIsSearchModalOpen} />
    </section>
  );
}
