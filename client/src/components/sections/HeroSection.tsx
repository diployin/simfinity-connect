'use client';

import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import {
  Search,
  Globe,
  ChevronRight,
  CheckCircle,
  Signal,
  Database,
  Star,
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
        staggerChildren: 0.12,
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
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[#e8f5e9] via-[#f0f9f1] to-[#c8e6c9] dark:bg-none dark:bg-gray-900" />

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <svg className="absolute -top-20 right-0 w-[65%] h-[120%]" viewBox="0 0 600 600" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
          <path d="M250 -80 Q380 30 460 160 Q540 290 490 440 Q470 540 600 560 L600 -80 Z" fill="#2c7338" opacity="0.12" />
          <path d="M320 -40 Q420 90 500 220 Q580 350 540 490 Q520 560 600 540 L600 -40 Z" fill="#2c7338" opacity="0.06" />
        </svg>
      </div>

      <div className="relative max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-center min-h-[540px] lg:min-h-[600px]">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-col items-start text-left py-12 lg:py-20"
          >
            <motion.h1
              variants={itemVariants}
              className="text-[2rem] sm:text-[2.5rem] md:text-[2.75rem] lg:text-[3.25rem] font-bold text-gray-900 dark:text-white leading-[1.12] tracking-[-0.02em] mb-6"
              data-testid="text-hero-headline"
            >
              {t('website.home.hero.global', 'Affordable eSIM data')}{' '}
              {t('website.home.hero.forLifetime', 'for international travel')}
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="text-base sm:text-lg text-gray-500 dark:text-gray-400 mb-7 leading-relaxed"
            >
              {t('website.home.hero.subtitle', 'Where do you need mobile data?')}
            </motion.p>

            <motion.div variants={itemVariants} className="w-full max-w-[420px] mb-8">
              <button
                onClick={() => setIsSearchModalOpen(true)}
                className="w-full flex items-center gap-3 pl-5 pr-2 py-2.5 rounded-full border border-gray-200/80 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-[#3d9a4d] dark:hover:border-[#2c7338] transition-all shadow-sm hover:shadow-md group cursor-pointer text-left"
              >
                <span className="text-sm text-gray-400 dark:text-gray-500 group-hover:text-gray-500 dark:group-hover:text-gray-300 transition-colors flex-1">
                  {t('website.home.hero.search', 'Search for destination')}
                </span>
                <div className="p-2.5 rounded-full bg-gradient-to-r from-[#2c7338] to-[#3d9a4d] text-white flex-shrink-0 transition-colors">
                  <Search className="h-4 w-4" />
                </div>
              </button>
            </motion.div>

            <motion.div variants={itemVariants} className="w-full max-w-[420px]">
              <p className="text-[11px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-[0.1em] mb-3">
                {t('website.home.hero.popularDestinations', 'Popular destinations')}
              </p>
              <div className="flex flex-wrap items-start gap-2">
                {displayPopular.map((dest) => (
                  <Link key={dest.slug} href={`/destination/${dest.slug}`}>
                    <motion.div
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.97 }}
                      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white dark:bg-gray-800 border border-gray-200/80 dark:border-gray-700 hover:border-[#3d9a4d] dark:hover:border-[#2c7338] transition-all cursor-pointer shadow-sm hover:shadow"
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
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.97 }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#f0f9f1] dark:bg-[#194520]/30 border border-[#dcf0de] dark:border-[#1e5427] hover:bg-[#dcf0de] dark:hover:bg-[#194520]/50 transition-all cursor-pointer"
                  >
                    <Globe className="h-3 w-3 text-[#2c7338] dark:text-[#3d9a4d]" />
                    <span className="text-xs font-medium text-[#2c7338] dark:text-[#3d9a4d]">
                      {t('website.home.hero.viewAll', 'View all')}
                    </span>
                  </motion.div>
                </Link>
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
            className="hidden lg:flex items-end justify-center relative self-end"
          >
            <img
              src="/images/hero-phone-luggage.png"
              alt="eSIM Travel"
              className="w-full max-w-none object-contain drop-shadow-2xl relative z-10 lg:scale-125 lg:origin-bottom"
            />
          </motion.div>
        </div>
      </div>

      <div className="relative bg-white dark:bg-gray-950 border-t border-gray-100 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-6 sm:py-7">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
            <div className="flex flex-col sm:flex-row items-center sm:items-center gap-2 sm:gap-3 text-center sm:text-left">
              <div className="flex-shrink-0 w-9 h-9 rounded-full bg-[#f0f9f1] dark:bg-[#194520]/30 flex items-center justify-center">
                <CheckCircle className="h-4 w-4 text-[#2c7338] dark:text-[#3d9a4d]" />
              </div>
              <span className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">
                {t('website.home.hero.statDownloads', 'Over 50K+ Users')}
              </span>
            </div>
            <div className="flex flex-col sm:flex-row items-center sm:items-center gap-2 sm:gap-3 text-center sm:text-left">
              <div className="flex-shrink-0 w-9 h-9 rounded-full bg-[#f0f9f1] dark:bg-[#194520]/30 flex items-center justify-center">
                <Signal className="h-4 w-4 text-[#2c7338] dark:text-[#3d9a4d]" />
              </div>
              <span className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">
                {t('website.home.hero.statCoverage', 'Coverage for 200+ destinations')}
              </span>
            </div>
            <div className="flex flex-col sm:flex-row items-center sm:items-center gap-2 sm:gap-3 text-center sm:text-left">
              <div className="flex-shrink-0 w-9 h-9 rounded-full bg-[#f0f9f1] dark:bg-[#194520]/30 flex items-center justify-center">
                <Database className="h-4 w-4 text-[#2c7338] dark:text-[#3d9a4d]" />
              </div>
              <span className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">
                {t('website.home.hero.statPlans', 'Plans from 1 GB to unlimited data')}
              </span>
            </div>
            <div className="flex flex-col sm:flex-row items-center sm:items-center gap-2 sm:gap-3 text-center sm:text-left">
              <div className="flex-shrink-0 w-9 h-9 rounded-full bg-[#f0f9f1] dark:bg-[#194520]/30 flex items-center justify-center">
                <Star className="h-4 w-4 text-[#2c7338] dark:text-[#3d9a4d]" />
              </div>
              <span className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">
                {t('website.home.hero.statRatings', '10K 5 Star Rating')}
              </span>
            </div>
          </div>
        </div>
      </div>

      <SearchModalHero open={isSearchModalOpen} onOpenChange={setIsSearchModalOpen} />
    </section>
  );
}
