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
    <section className="relative overflow-hidden bg-gradient-to-b from-primary/[0.03] via-background to-background dark:from-primary/[0.06] dark:via-background dark:to-background">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full bg-primary/[0.04] dark:bg-primary/[0.08] blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-[400px] h-[400px] rounded-full bg-primary/[0.03] dark:bg-primary/[0.06] blur-3xl" />
      </div>

      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-14 md:pt-16 pb-10 sm:pb-14">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center text-center max-w-3xl mx-auto"
        >
          <motion.div
            variants={itemVariants}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/[0.08] dark:bg-primary/[0.15] border border-primary/10 dark:border-primary/20 mb-8"
            data-testid="badge-trust-rating"
          >
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className="h-3 w-3 text-yellow-500 fill-yellow-500 dark:text-yellow-400 dark:fill-yellow-400"
                />
              ))}
            </div>
            <span className="text-xs font-medium text-foreground/80 dark:text-foreground/70">
              {t('website.home.hero.rating', 'Rated 4.7/5 with 500K+ Downloads')}
            </span>
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-foreground tracking-tight leading-[1.1] mb-2"
            data-testid="text-hero-headline"
          >
            {t('website.home.hero.global', 'Global')}{' '}
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

          <motion.h1
            variants={itemVariants}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-foreground tracking-tight leading-[1.1] mb-5"
            data-testid="text-hero-headline-2"
          >
            {t('website.home.hero.forLifetime', 'for Lifetime')}
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="text-base sm:text-lg text-muted-foreground mb-8 max-w-lg"
            data-testid="text-hero-subtitle"
          >
            <span className="font-semibold text-foreground">{t('website.home.hero.dataVoice', 'Data + Voice')}</span>{' '}
            | {t('website.home.hero.magicSIM', 'Magic SIM available')}
          </motion.p>

          <motion.div variants={itemVariants} className="w-full max-w-xl mb-8">
            <button
              onClick={() => setIsSearchModalOpen(true)}
              className="w-full flex items-center gap-3 px-5 py-4 rounded-2xl border border-border/60 bg-background dark:bg-card hover:border-primary/40 transition-all shadow-sm hover:shadow-md group cursor-pointer text-left"
            >
              <Search className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
              <span className="text-sm sm:text-base text-muted-foreground group-hover:text-foreground transition-colors flex-1">
                {t('website.home.hero.search', 'Search for countries or regions...')}
              </span>
              <div className="px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-medium flex-shrink-0">
                <Search className="h-3.5 w-3.5" />
              </div>
            </button>
          </motion.div>

          <motion.div variants={itemVariants} className="w-full max-w-xl">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
              {t('website.home.hero.popularDestinations', 'Popular destinations')}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-2">
              {displayPopular.map((dest) => (
                <Link key={dest.slug} href={`/destination/${dest.slug}`}>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.97 }}
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-background dark:bg-card border border-border/50 hover:border-primary/30 transition-all cursor-pointer shadow-sm hover:shadow-md"
                  >
                    <img
                      src={`https://flagcdn.com/16x12/${dest.countryCode.toLowerCase()}.png`}
                      srcSet={`https://flagcdn.com/32x24/${dest.countryCode.toLowerCase()}.png 2x`}
                      alt={dest.name}
                      className="w-4 h-3 rounded-[2px] object-cover"
                    />
                    <span className="text-xs font-medium text-foreground">{dest.name}</span>
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

      <SearchModalHero open={isSearchModalOpen} onOpenChange={setIsSearchModalOpen} />
    </section>
  );
}
