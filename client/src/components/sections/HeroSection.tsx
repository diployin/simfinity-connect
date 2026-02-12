'use client';

import { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Globe,
  Star,
  ChevronRight,
  CheckCircle,
  Signal,
  Database,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [, setLocation] = useLocation();
  const { currency } = useCurrency();
  const { t } = useTranslation();

  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

  const rotatingWords = ['Anywhere', 'Traveling', 'Abroad', 'Roaming'];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWordIndex((prev) => (prev + 1) % rotatingWords.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

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
    <section className="relative overflow-hidden bg-gradient-to-b from-teal-50/60 dark:from-teal-950/20 to-white dark:to-background">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full bg-teal-100/30 dark:bg-teal-900/10 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-[400px] h-[400px] rounded-full bg-teal-50/40 dark:bg-teal-950/10 blur-3xl" />
      </div>

      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-16 md:pt-20 pb-8 sm:pb-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-start text-left max-w-3xl lg:max-w-[60%]"
        >
          <motion.p
            variants={itemVariants}
            className="text-sm sm:text-base text-muted-foreground dark:text-muted-foreground/80 mb-4"
          >
            {t('website.home.hero.subtitle', 'Where do you need mobile data?')}
          </motion.p>

          <motion.h1
            variants={itemVariants}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground dark:text-foreground tracking-tight leading-[1.15] mb-2"
            data-testid="text-hero-headline"
          >
            {t('website.home.hero.global', 'Affordable eSIM data')}{' '}
            <AnimatePresence mode="wait">
              <motion.span
                key={currentWordIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4, ease: 'easeInOut' }}
                className="text-primary inline-block"
                data-testid="text-rotating-word"
              >
                {t(`website.home.hero.${rotatingWords[currentWordIndex]}`, rotatingWords[currentWordIndex])}
              </motion.span>
            </AnimatePresence>
          </motion.h1>

          <motion.h2
            variants={itemVariants}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground dark:text-foreground tracking-tight leading-[1.15] mb-6"
            data-testid="text-hero-headline-2"
          >
            {t('website.home.hero.forLifetime', 'for international travel')}
          </motion.h2>

          <motion.div variants={itemVariants} className="w-full max-w-xl mb-6">
            <button
              onClick={() => setIsSearchModalOpen(true)}
              className="w-full flex items-center gap-3 px-4 py-3.5 sm:px-5 sm:py-4 rounded-xl border border-border/60 dark:border-border/40 bg-white dark:bg-card hover:border-primary/40 transition-all shadow-sm hover:shadow-md group cursor-pointer text-left"
            >
              <span className="text-sm sm:text-base text-muted-foreground group-hover:text-foreground transition-colors flex-1">
                {t('website.home.hero.search', 'Search for destination')}
              </span>
              <div className="p-2.5 rounded-lg bg-primary text-primary-foreground flex-shrink-0">
                <Search className="h-4 w-4" />
              </div>
            </button>
          </motion.div>

          <motion.div variants={itemVariants} className="w-full max-w-xl">
            <p className="text-xs font-medium text-muted-foreground dark:text-muted-foreground/70 uppercase tracking-wider mb-3">
              {t('website.home.hero.popularDestinations', 'Popular destinations')}
            </p>
            <div className="flex flex-wrap items-start gap-2">
              {displayPopular.map((dest) => (
                <Link key={dest.slug} href={`/destination/${dest.slug}`}>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.97 }}
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white dark:bg-card border border-border/50 dark:border-border/30 hover:border-primary/30 transition-all cursor-pointer shadow-sm hover:shadow-md"
                  >
                    <img
                      src={`https://flagcdn.com/16x12/${dest.countryCode.toLowerCase()}.png`}
                      srcSet={`https://flagcdn.com/32x24/${dest.countryCode.toLowerCase()}.png 2x`}
                      alt={dest.name}
                      className="w-4 h-3 rounded-[2px] object-cover"
                    />
                    <span className="text-xs font-medium text-foreground dark:text-foreground/90">{dest.name}</span>
                    <ChevronRight className="h-3 w-3 text-muted-foreground" />
                  </motion.div>
                </Link>
              ))}
              <Link href="/destinations">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.97 }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/[0.08] dark:bg-primary/[0.15] border border-primary/20 hover:bg-primary/[0.12] transition-all cursor-pointer"
                >
                  <Globe className="h-3 w-3 text-primary" />
                  <span className="text-xs font-medium text-primary">
                    {t('website.home.hero.viewAll', 'View all')}
                  </span>
                </motion.div>
              </Link>
            </div>
          </motion.div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        className="relative border-t border-border/30 dark:border-border/20 bg-white/60 dark:bg-background/60 backdrop-blur-sm"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0 w-9 h-9 rounded-full bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center">
                <CheckCircle className="h-4.5 w-4.5 text-teal-600 dark:text-teal-400" />
              </div>
              <span className="text-xs sm:text-sm font-medium text-foreground dark:text-foreground/90">
                {t('website.home.hero.statDownloads', 'Over 12M downloads')}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0 w-9 h-9 rounded-full bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center">
                <Signal className="h-4.5 w-4.5 text-teal-600 dark:text-teal-400" />
              </div>
              <span className="text-xs sm:text-sm font-medium text-foreground dark:text-foreground/90">
                {t('website.home.hero.statCoverage', 'Coverage for 200+ destinations')}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0 w-9 h-9 rounded-full bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center">
                <Database className="h-4.5 w-4.5 text-teal-600 dark:text-teal-400" />
              </div>
              <span className="text-xs sm:text-sm font-medium text-foreground dark:text-foreground/90">
                {t('website.home.hero.statPlans', 'Plans from 1 GB to unlimited data')}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0 w-9 h-9 rounded-full bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center">
                <Star className="h-4.5 w-4.5 text-teal-600 dark:text-teal-400" />
              </div>
              <span className="text-xs sm:text-sm font-medium text-foreground dark:text-foreground/90">
                {t('website.home.hero.statRatings', '100K+ 5-star ratings')}
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      <SearchModalHero open={isSearchModalOpen} onOpenChange={setIsSearchModalOpen} />
    </section>
  );
}
