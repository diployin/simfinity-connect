'use client';

import { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import {
  Search,
  Globe,
  ChevronRight,
  ChevronLeft,
  CheckCircle,
  Signal,
  Database,
  Star,
} from 'lucide-react';
import { useCurrency } from '@/contexts/CurrencyContext';
import { SearchModalHero } from '../modals/SearchModalHero';
import { useTranslation } from '@/contexts/TranslationContext';
import { convertPrice, getCurrencySymbol } from '@/lib/currency';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

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
  const [carouselApi, setCarouselApi] = useState<any>();

  useEffect(() => {
    if (!carouselApi) return;

    const interval = setInterval(() => {
      carouselApi.scrollNext();
    }, 3000);

    return () => clearInterval(interval);
  }, [carouselApi]);
  const [, setLocation] = useLocation();
  const { currency, currencies } = useCurrency();
  const currencySymbol = getCurrencySymbol(currency, currencies);
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

  const popularDestinations = destinationsWithPricing?.filter((d) => d.isPopular).slice(0, 10) || [];

  const defaultPopularDestinations = [
    // { name: 'United States', countryCode: 'us', slug: 'united-states' },
    // { name: 'United Kingdom', countryCode: 'gb', slug: 'united-kingdom' },
    // { name: 'UAE', countryCode: 'ae', slug: 'united-arab-emirates' },
    // { name: 'Japan', countryCode: 'jp', slug: 'japan' },
    // { name: 'Thailand', countryCode: 'th', slug: 'thailand' },
    // { name: 'France', countryCode: 'fr', slug: 'france' },
    { countryCode: 'CN', name: 'China', slug: 'china' },
    { countryCode: 'JP', name: 'Japan', slug: 'japan' },
    { countryCode: 'TH', name: 'Thailand', slug: 'thailand' },
    { countryCode: 'AU', name: 'Australia', slug: 'australia' },
    { countryCode: 'US', name: 'United States', slug: 'united-states' },
    { countryCode: 'AE', name: 'UAE', slug: 'united-arab-emirates' },

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
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-primary/5 to-primary/10 dark:bg-none dark:bg-gray-900" />

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <svg className="absolute -top-20 right-0 w-[65%] h-[120%]" viewBox="0 0 600 600" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
          <path d="M250 -80 Q380 30 460 160 Q540 290 490 440 Q470 540 600 560 L600 -80 Z" fill="var(--primary)" opacity="0.12" />
          <path d="M320 -40 Q420 90 500 220 Q580 350 540 490 Q520 560 600 540 L600 -40 Z" fill="var(--primary)" opacity="0.06" />
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
              className="h1-fluid text-gray-900 dark:text-white mb-6"
              data-testid="text-hero-headline"
            >
              {t('website.home.hero.global', 'Your Journey Starts Here.')}{' '}
              {t('website.home.hero.forLifetime', 'Stay Connected Everywhere.')}
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="text-base sm:text-lg text-gray-500 dark:text-gray-400 mb-7 leading-relaxed"
            >
              {t('website.home.hero.subtitle', 'Instant global data with eSIM — no SIM swaps, no roaming surprises. Just connect and explore freely.')}
            </motion.p>

            <motion.div variants={itemVariants} className="w-full max-w-[420px] mb-8">
              <button
                onClick={() => setIsSearchModalOpen(true)}
                className="w-full flex items-center gap-3 pl-5 pr-2 py-2.5 rounded-full border border-gray-200/80 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-[var(--primary-light)] dark:hover:border-[var(--primary)] transition-all shadow-sm hover:shadow-md group cursor-pointer text-left"
              >
                <span className="text-sm text-gray-400 dark:text-gray-500 group-hover:text-gray-500 dark:group-hover:text-gray-300 transition-colors flex-1">
                  {t('website.home.hero.search', 'Where are you going next?')}
                </span>
                <div className="p-2.5 rounded-full bg-gradient-to-r from-[var(--primary)] to-[var(--primary-light)] text-white flex-shrink-0 transition-colors">
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
                      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white dark:bg-gray-800 border border-gray-200/80 dark:border-gray-700 hover:border-[var(--primary-light)] dark:hover:border-[var(--primary)] transition-all cursor-pointer shadow-sm hover:shadow"
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
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/5 dark:bg-[var(--primary-dark)]/30 border border-primary/10 dark:border-primary-second hover:bg-primary/10 dark:hover:bg-[var(--primary-dark)]/50 transition-all cursor-pointer"
                  >
                    <Globe className="h-3 w-3 text-[var(--primary)] dark:text-[var(--primary-light)]" />
                    <span className="text-xs font-medium text-[var(--primary)] dark:text-[var(--primary-light)]">
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
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-6 sm:py-7 relative group/stats">
          <Carousel setApi={setCarouselApi} className="w-full" opts={{ align: "start", loop: true }}>
            <CarouselContent className="-ml-4 md:grid md:grid-cols-4 md:ml-0 md:gap-4">
              <CarouselItem className="pl-4 md:pl-0 basis-[80%] sm:basis-[50%] md:basis-auto flex flex-col sm:flex-row items-center sm:items-center gap-2 sm:gap-3 text-center sm:text-left">
                <div className="flex-shrink-0 w-9 h-9 rounded-full bg-primary/5 dark:bg-[var(--primary-dark)]/30 flex items-center justify-center">
                  <CheckCircle className="h-4 w-4 text-[var(--primary)] dark:text-[var(--primary-light)]" />
                </div>
                <span className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t('website.home.hero.statDownloads', 'Trusted by 1M+ Travelers')}
                </span>
              </CarouselItem>

              <CarouselItem className="pl-4 md:pl-0 basis-[80%] sm:basis-[50%] md:basis-auto flex flex-col sm:flex-row items-center sm:items-center gap-2 sm:gap-3 text-center sm:text-left">
                <div className="flex-shrink-0 w-9 h-9 rounded-full bg-primary/5 dark:bg-[var(--primary-dark)]/30 flex items-center justify-center">
                  <Signal className="h-4 w-4 text-[var(--primary)] dark:text-[var(--primary-light)]" />
                </div>
                <span className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t('website.home.hero.statCoverage', 'Coverage in 200+ Destinations')}
                </span>
              </CarouselItem>

              <CarouselItem className="pl-4 md:pl-0 basis-[80%] sm:basis-[50%] md:basis-auto flex flex-col sm:flex-row items-center sm:items-center gap-2 sm:gap-3 text-center sm:text-left">
                <div className="flex-shrink-0 w-9 h-9 rounded-full bg-primary/5 dark:bg-[var(--primary-dark)]/30 flex items-center justify-center">
                  <Database className="h-4 w-4 text-[var(--primary)] dark:text-[var(--primary-light)]" />
                </div>
                <span className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t('website.home.hero.statPlans', 'Flexible Plans from 1GB to Unlimited')}
                </span>
              </CarouselItem>

              <CarouselItem className="pl-4 md:pl-0 basis-[80%] sm:basis-[50%] md:basis-auto flex flex-col sm:flex-row items-center sm:items-center gap-2 sm:gap-3 text-center sm:text-left">
                <div className="flex-shrink-0 w-9 h-9 rounded-full bg-primary/5 dark:bg-[var(--primary-dark)]/30 flex items-center justify-center">
                  <Star className="h-4 w-4 text-[var(--primary)] dark:text-[var(--primary-light)]" />
                </div>
                <span className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t('website.home.hero.statRatings', 'Rated 5 Stars by Thousands')}
                </span>
              </CarouselItem>
            </CarouselContent>

            {/* Mobile Arrows for Stats */}
            <div className="flex md:hidden justify-center gap-4 mt-4">
              <CarouselPrevious className="static translate-y-0 h-9 w-9 rounded-full bg-white dark:bg-gray-800 shadow-sm border border-zinc-200 dark:border-zinc-700" />
              <CarouselNext className="static translate-y-0 h-9 w-9 rounded-full bg-white dark:bg-gray-800 shadow-sm border border-zinc-200 dark:border-zinc-700" />
            </div>

            {/* Desktop Arrows for Stats (Optional, usually static grid) */}
            <div className="hidden md:group-hover/stats:block">
              {/* Not needed if md:grid is used, but kept for consistency if layout changes */}
            </div>
          </Carousel>
        </div>
      </div>

      <SearchModalHero open={isSearchModalOpen} onOpenChange={setIsSearchModalOpen} />
    </section>
  );
}
