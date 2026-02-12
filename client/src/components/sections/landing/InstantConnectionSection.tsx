'use client';

import React from 'react';

import ThemeButton from '@/components/ThemeButton';
import { useTranslation } from '@/contexts/TranslationContext';
import { useLocation } from 'wouter';

const InstantConnectionSection = () => {
  const [, navigate] = useLocation();
  const { t } = useTranslation();

  return (
    <section className="w-full bg-white py-8 sm:py-20 lg:py-24">
      <div className="containers">
        {/* Header */}
        {/* Header */}
        <div className="mb-12 sm:mb-20 flex flex-col lg:flex-row lg:items-center justify-between gap-8 ">
          <div className="flex flex-col items-start text-start max-w-4xl">
            <h2 className="mb-6 text-3xl sm:text-4xl lg:text-2.5 font-medium leading-[1.1] text-gray-900 tracking-tight">
              {t('website.NewSimfinDes.NewSimfinDes.title')}
            </h2>

            <p className="max-w-2xl text-base font-thin leading-relaxed text-gray-600 sm:text-lg">
              {t('website.NewSimfinDes.NewSimfinDes.des')}
            </p>
          </div>

          <div className="flex-shrink-0">
            <ThemeButton
              onClick={() => navigate('/destinations')}
              className="px-6 py-3 sm:px-10 sm:py-6 rounded-full text-base sm:text-lg font-medium shadow-lg hover:shadow-primary/20 transition-all duration-300 transform hover:-translate-y-1"
            >
              {t('website.NewSimfinDes.NewSimfinDes.btn')}
            </ThemeButton>
          </div>
        </div>

        {/* Two Column Cards */}
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2 lg:gap-8">
          {/* Card 1 - Connect Instantly (Keep Image) */}
          <div className="group relative flex flex-col overflow-hidden rounded-lg bg-slate-50 border border-gray-100 dark:border-gray-800 transition-all duration-500 hover:shadow-2xl">
            <div className="space-y-4 p-8 sm:p-10 lg:p-12">
              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-medium text-gray-900 dark:text-gray-100 tracking-tight">
                {t('website.NewSimfinDes.NewSimfinDes.card1.title')}
              </h3>
              <p className="text-sm md:text-base leading-relaxed text-gray-600 dark:text-gray-400 font-thin max-w-md">
                {t('website.NewSimfinDes.NewSimfinDes.card1.des')}
              </p>
            </div>

            <div className="relative w-full h-[300px] sm:h-[400px] lg:h-[450px] overflow-hidden">
              <img
                src="/images/By_Simfinitys.png"
                alt="Connect instantly"
                className="absolute inset-0 h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
              />
            </div>
          </div>

          {/* Card 2 - Avoid Waiting In Line (Hide Image on Mobile) */}
          <div className="group relative flex flex-col overflow-hidden rounded-lg bg-primary transition-all duration-500 hover:shadow-2xl hover:shadow-primary/20">
            <div className="space-y-5 p-8 sm:p-10 lg:p-12">
              <div className="w-14 h-14 rounded-md bg-white/20 flex items-center justify-center mb-2">
                <img src="/images/features/time2.svg" className="h-8 w-8 " alt="icon" />
              </div>
              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-medium text-white tracking-tight">
                {t('website.NewSimfinDes.NewSimfinDes.card2.title')}
              </h3>
              <p className="text-sm md:text-base leading-relaxed text-white/90 font-thin max-w-md">
                {t('website.NewSimfinDes.NewSimfinDes.card2.des')}
              </p>
            </div>

            <div className="hidden md:block relative w-full flex-1 overflow-hidden min-h-[300px]">
              <img
                src="/images/No more SIM card drama.png"
                alt="Avoid waiting in line"
                className="absolute inset-0 h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
              />
            </div>
          </div>
        </div>

        {/* Card 3 - Stay Protected (Hide Image on Mobile) */}
        <div className="group relative mt-8 sm:mt-12 overflow-hidden rounded-lg bg-slate-50 border border-gray-100 dark:border-gray-800 transition-all duration-500 hover:shadow-2xl">
          <div className="grid grid-cols-1 md:grid-cols-2">
            <div className="flex flex-col justify-center space-y-6 p-8 sm:p-10 lg:p-12 xl:p-16">
              <div className="w-14 h-14 rounded-md bg-primary/10 flex items-center justify-center">
                <img src="/images/features/bulb.svg" className="h-8 w-8" alt="icon" />
              </div>
              <div className="space-y-4">
                <h3 className="text-2xl sm:text-3xl lg:text-4xl font-medium text-gray-900 dark:text-white tracking-tight">
                  {t('website.NewSimfinDes.NewSimfinDes.card3.title')}
                </h3>

                <p className="text-sm md:text-base lg:text-lg leading-relaxed text-gray-600 dark:text-gray-400 font-thin max-w-lg text-left">
                  {t('website.NewSimfinDes.NewSimfinDes.card3.des')}
                </p>
              </div>

              <div className="flex justify-start">
                <ThemeButton variant="outline" className="px-6 w-full py-3 sm:px-8 sm:py-5 rounded-full font-bold border-2 hover:bg-gray-100 transition-all text-sm sm:text-base">
                  {t('website.NewSimfinDes.NewSimfinDes.card3.btn')}
                </ThemeButton>
              </div>
            </div>

            <div className="hidden md:flex relative items-end justify-end overflow-hidden h-full">
              <img
                src="/images/By_Simfinitys.png"
                alt="Stay protected"
                className="h-full w-full object-cover object-bottom transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InstantConnectionSection;
