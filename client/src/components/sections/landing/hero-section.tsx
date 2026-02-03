'use client';

import { SearchModalHero } from '@/components/modals/SearchModalHero';
import { useCurrency } from '@/contexts/CurrencyContext';
import { useTranslation } from '@/contexts/TranslationContext';
import useStaticData from '@/data/useStaticData';
import { useSettingByKey } from '@/hooks/useSettings';
import { useQuery } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react';

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

import { useSelector } from 'react-redux';
import { Link, useLocation } from 'wouter';

const HeroSection = () => {
  const [showDestinationModal, setShowDestinationModal] = useState(false);
  const [selectedDestination, setSelectedDestination] = useState<string>('');
  const { t } = useTranslation();
  const handleDestinationSelect = (destination: string) => {
    setSelectedDestination(destination);
  };

  const [phoneSearchQuery, setPhoneSearchQuery] = useState('');
  const [searchType, setSearchType] = useState<'country' | 'region'>('country');
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [, setLocation] = useLocation();
  const { currency } = useCurrency();

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

  console.log('regionsWithPricing', regionsWithPricing);

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

  // Get filtered results
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
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' },
    },
  };
  //   const { logo } = useSelector((state: RootState) => state.appSettings);

  const logo = useSettingByKey('logo');

  const staticData = useStaticData();

  return (
    // 58B0EC
    <div
      className="relative w-full overflow-hidden"
      style={{
        background: 'linear-gradient(130deg, #4C9540 0%, #0f5130 100%)',
      }}
    >
      {/* Desktop Layout */}
      <div className="relative hidden min-h-screen w-full overflow-hidden lg:block">
        <div className="grid min-h-screen grid-cols-1 items-center lg:grid-cols-2">
          {/* Left Side - Text Content with Container Padding (only left) */}
          <div className="flex flex-col justify-center py-16 pr-8 pl-4 sm:pl-6 lg:pl-8 xl:pl-16 2xl:pl-42">
            <h1 className="max-w-xl text-4xl leading-tight font-medium text-white lg:text-5xl xl:text-5xl">
              {/* {staticData.heroSecData.title} */}
              {/* {t('NewSimfinDes.heroSec.title')} */}
              {/* Woah! These are the cheapest eSIM plans I’ve ever seen! */}
              {t('hero.headline')}
            </h1>

            <div className="space-y-2 pt-6">
              <p className="text-lg font-medium text-white">
                {/* {t('NewSimfinDes.heroSec.Browse')} */}
                {/* Pick your perfect eSIM plan — the smart choice for every traveler.Amazing Cashback! */}
                {t('hero.subheading')}
              </p>

              <div className="">
                {/* <p className='text-base font-normal text-white'>{t('NewSimfinDes.heroSec.Get')}</p> */}
                {/* <p className="text-base font-normal text-white">{t('NewSimfinDes.heroSec.Up')}</p> */}
                <p className="text-base font-normal text-white">{t('hero.cashbackOffer')}</p>
              </div>
            </div>

            {/* Search Box */}
            <div className="w-full max-w-sm">
              <p className="my-4 text-base font-medium text-white xl:text-lg">
                {/* {t('NewSimfinDes.heroSec.Where_do')} */}
                {t('hero.searchSubtitle')}
              </p>
              <button
                onClick={() => setIsSearchModalOpen(true)}
                className="relative flex w-sm items-center justify-between rounded-lg bg-white py-2 pr-2 pl-6 shadow-md"
              >
                <span className="text-gray-500">{t('hero.searchPlaceholder')}</span>
                <div className="bg-primary hover:bg-primaryHover flex-shrink-0 rounded-lg p-4 transition-colors">
                  <svg
                    className="h-4 w-4 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
              </button>
            </div>

            {/* Brand Credit */}
            <div className="flex items-center gap-3 py-4 lg:py-6">
              <p className="text-xs font-normal text-white/80 xl:text-sm">
                {t('hero.brandCredit')}
              </p>
              <div className="flex items-center gap-2 rounded-lg bg-white">
                <img src="/images/brands/cits.svg" className="h-12" alt="NordVPN" />
              </div>
            </div>
            

            {/* Terms Link */}
            <p className="text-xs font-normal text-white/80">
              {t('hero.termsPromo')}
              <Link href="#" className="underline transition-colors hover:text-black">
                {t('hero.termsLink')}
              </Link>
            </p>
          </div>

          {/* Right Side - Image (Full Width, No Padding) */}
          <div className="relative flex h-full w-full items-center justify-center">
            <div className="relative h-[600px] w-full lg:h-[700px] xl:h-[750px]">
              <img
                src={staticData.heroSecData.image}
                alt="Happy traveler with eSIM"
                className="object-contain object-center"
                sizes="50vw"
              />

              {/* Floating Badge on Image */}
              <div className="absolute top-[30%] left-1/4 z-10 -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white px-5 py-4 shadow-2xl lg:left-1/3">
                <div className="flex items-center gap-3">
                  <div className="bg-primary rounded-xl p-2">
                    <svg className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-normal whitespace-nowrap text-black">
                      {t('hero.badgeText1')}
                    </p>
                    <p className="text-base font-bold whitespace-nowrap text-black">
                      {t('hero.badgeText2')}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile & Tablet Layout */}
      <div className="lg:hidden">
        <div className="containers pt-10 sm:py-18">
          {/* Mobile Text Content */}
          <div className="mt-10 flex flex-col space-y-5 sm:space-y-6 md:space-y-8">
            <h1 className="text-3xl leading-tight font-medium text-black sm:text-4xl md:text-5xl">
              {t('NewSimfinDes.heroSec.title')}
            </h1>

            <div className="space-y-3 sm:space-y-4">
              <p className="text-lg font-medium text-black sm:text-xl md:text-xl">
                {t('NewSimfinDes.heroSec.Browse')}
              </p>

              <div className="space-y-1">
                <p className="text-sm font-normal text-black sm:text-base md:text-lg">
                  {t('NewSimfinDes.heroSec.Get')}
                </p>
                <p className="text-sm font-normal text-black sm:text-base md:text-lg">
                  {t('NewSimfinDes.heroSec.Up')}
                </p>
              </div>
            </div>

            {/* Search Box */}
            <div className="w-full max-w-xl">
              <p className="mb-4 text-base font-medium text-black xl:text-lg">
                {t('NewSimfinDes.heroSec.Where_do')}
              </p>
              <button
                onClick={() => setShowDestinationModal(true)}
                className="relative flex w-xs items-center justify-between rounded-lg bg-white py-2 pr-2 pl-6 shadow-md"
              >
                <span className="text-gray-500">{t('NewSimfinDes.heroSec.placeHolder')}</span>
                <div className="bg-themeYellow hover:bg-themeYellowHover flex-shrink-0 rounded-lg p-4 transition-colors">
                  <svg
                    className="h-4 w-4 text-black"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
              </button>
            </div>

            {/* Brand Credit */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <p className="text-xs font-normal text-gray-700 sm:text-sm md:text-base">
                {t('NewSimfinDes.heroSec.creators')}
              </p>
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-blue-700 sm:h-8 sm:w-8">
                  <span className="text-xs font-bold text-white sm:text-sm">N</span>
                </div>
                {/* <span className="text-black font-bold text-base sm:text-lg">NordVPN</span> */}
                <img src="/images/brands/nordvpn.svg" className="h-auto w-auto" alt="" />
              </div>
            </div>

            {/* Terms Link */}
            <p className="pb-8 text-xs font-normal text-gray-700 sm:text-sm">
              {t('NewSimfinDes.heroSec.term')}{' '}
              <Link href="#" className="underline transition-colors hover:text-black">
                {t('NewSimfinDes.heroSec.term_Link')}
              </Link>
            </p>
          </div>
          {/* Mobile Image First */}
          <div className="relative mb-8 h-[400px] w-full sm:mb-12 sm:h-[500px] md:h-[600px]">
            <img src="" alt="Happy traveler with eSIM" className="object-contain" sizes="100vw" />

            {/* Mobile Badge */}
            <div className="absolute top-8 right-4 z-10 rounded-xl bg-white px-3 py-2 shadow-2xl sm:top-12 sm:right-8 sm:rounded-2xl sm:px-4 sm:py-3 md:top-16 md:right-12 md:px-5 md:py-4">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="rounded-lg bg-yellow-400 p-1.5 sm:rounded-xl sm:p-2">
                  <svg
                    className="h-3 w-3 text-black sm:h-4 sm:w-4 md:h-5 md:w-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </div>
                <div>
                  <p className="text-[10px] font-normal whitespace-nowrap text-black sm:text-xs md:text-sm">
                    {t('NewSimfinDes.heroSec.card_c1')}
                  </p>
                  <p className="text-xs font-bold whitespace-nowrap text-black sm:text-sm md:text-base">
                    {t('NewSimfinDes.heroSec.card_c2')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* <DestinationModal
        isOpen={showDestinationModal}
        onClose={() => setShowDestinationModal(false)}
        onSelect={handleDestinationSelect}
      /> */}

      {isSearchModalOpen && (
        <SearchModalHero open={isSearchModalOpen} onOpenChange={setIsSearchModalOpen} />
      )}
    </div>
  );
};

export default HeroSection;
