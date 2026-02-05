'use client';

import { SearchModalHero } from '@/components/modals/SearchModalHero';
import { useCurrency } from '@/contexts/CurrencyContext';
import { useTranslation } from '@/contexts/TranslationContext';
import useStaticData from '@/data/useStaticData';
import { useSettingByKey } from '@/hooks/useSettings';
import { RootState } from '@/redux/store/store';
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

  const { isExpanded } = useSelector((state: RootState) => state.topNavbar);

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

  return (
    // <div className="relative w-full overflow-hidden bg-[url('/images/Banner.png')] bg-cover bg-center ">
    <div className="relative w-full bg-sky-200   ">
      {/* Desktop Layout */}
      <div className="absolute -top-[72px] bottom-0 w-full flex flex-col items-center overflow-hidden bg-gradient-hero">
        <div className="absolute bottom-0 min-w-[1038px] md:min-w-[1153px] lg:min-w-[1372px] xl:min-w-[1716px] md:translate-x-[18%] lg:translate-x-[21%] xl:translate-x-[25%]">
          <div>
            <picture>
              <img
                alt="The Saily international eSIM app."
                loading="eager"
                width="1200"
                height="908"
                decoding="async"
                style={{ color: 'transparent' }}
                srcSet="/images/Untitled_design.png"
                src="/images/Untitled_design.png"
              />
            </picture>
          </div>
        </div>
      </div>
      {/* <div className="absolute -top-[72px] bottom-0 w-full flex flex-col items-center overflow-hidden bg-gradient-hero">
        <div className="absolute bottom-0 min-w-[1038px] md:min-w-[1153px] lg:min-w-[1372px] xl:min-w-[1716px] md:translate-x-[18%] lg:translate-x-[21%] xl:translate-x-[23%]">
          <div>
            <picture>
              <img
                alt="The Saily international eSIM app."
                loading="eager"
                width="1716"
                height="908"
                decoding="async"
                style={{ color: 'transparent' }}
                srcSet="/images/Untitled_design.png"
                src="/images/Untitled_design.png"
              />
            </picture>
          </div>
        </div>
      </div> */}
      <div
        data-section="Hero"
        data-testid="section-Hero"
        className="relative scroll-mt-20 xl:scroll-mt-24"
      >
        <div>
          <div className="mx-4 sm:mx-auto">
            <div className="containers mx-auto">
              <div
                className={`md:flex flex-col justify-center py-16 max-md:pb-[404px] md:max-w-[370px] lg:max-w-[540px] xl:max-w-[680px] min-h-[743px] md:min-h-[480px] lg:min-h-[592px] xl:min-h-[800px] ${isExpanded ? 'mt-10' : 'mt-32'} mt-10 md:mt-16 lg:mt-5`}
              >
                <div className="h-full w-full flex group/stack flex-col text-start justify-start gap-y-6 items-stretch">
                  <div className="flex flex-col justify-end  ">
                    <h1 className="max-w-xl text-4xl leading-tight font-medium text-black lg:text-5xl xl:text-5xl">
                      {t('hero.headline')}
                    </h1>

                    {/* Search Box */}
                    <div className="w-full max-w-full sm:max-w-md md:max-w-lg lg:max-w-sm pt-10">
                      <p className="mb-3 text-base sm:text-lg font-medium text-black">
                        {t('hero.searchSubtitle')}
                      </p>
                      <button
                        onClick={() => setIsSearchModalOpen(true)}
                        className="relative flex w-full items-center justify-between rounded-2xl bg-white py-3 px-5 sm:py-4 sm:px-6 shadow-md hover:shadow-lg transition-all "
                      >
                        <span className="text-sm sm:text-base text-gray-500">
                          {t('hero.searchPlaceholder')}
                        </span>
                        <div className="bg-primary hover:bg-primaryHover flex-shrink-0 rounded-lg p-3 transition-colors">
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

                    {/* Terms Link */}
                    <p className="text-xs font-normal text-black mt-5">
                      {t('hero.termsPromo')}
                      <Link href="#" className="underline transition-colors hover:text-black">
                        {t('hero.termsLink')}
                      </Link>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Mobile & Tablet Layout */}

      {isSearchModalOpen && (
        <SearchModalHero open={isSearchModalOpen} onOpenChange={setIsSearchModalOpen} />
      )}
    </div>
  );
};

export default HeroSection;
