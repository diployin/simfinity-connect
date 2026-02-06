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
        <div className="mb-12 text-center sm:mb-16">
          <h2 className="mx-auto mb-6 max-w-5xl text-3xl font-normal leading-tight text-black sm:text-4xl lg:text-5xl xl:text-5xl">
            {t('website.NewSimfinDes.NewSimfinDes.title')}
          </h2>

          <p className="mx-auto mb-8 max-w-4xl text-base text-gray-600 sm:text-lg lg:text-base">
            {t('website.NewSimfinDes.NewSimfinDes.des')}
          </p>

          <ThemeButton onClick={() => navigate('/all-destinations')} size="md">
            {t('website.NewSimfinDes.NewSimfinDes.btn')}
          </ThemeButton>
        </div>

        {/* Two Column Cards */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-8">
          {/* Card 1 */}
          <div className="group relative flex min-h-[500px] sm:min-h-[600px] lg:min-h-[700px] flex-col overflow-hidden rounded-3xl bg-gray-100 transition-all duration-300 hover:shadow-xl">
            <div className="space-y-4 p-6 sm:p-8 lg:p-10 xl:p-12 flex-shrink-0">
              <h3 className="text-xl sm:text-2xl lg:text-[32px] font-medium text-black">
                {t('website.NewSimfinDes.NewSimfinDes.card1.title')}
              </h3>
              <p className="text-sm sm:text-base leading-relaxed text-gray-600">
                {t('website.NewSimfinDes.NewSimfinDes.card1.des')}
              </p>
            </div>

            <div className="relative w-full flex-1 overflow-hidden">
              <img
                src="/images/By_Simfinitys.png"
                alt="Connect instantly - Travel destinations"
                className="absolute inset-0 h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 600px"
              />
            </div>
          </div>

          {/* Card 2 */}
          <div className="group relative flex min-h-[500px] sm:min-h-[600px] lg:min-h-[700px] flex-col overflow-hidden rounded-3xl bg-[#A8D5F2] transition-all duration-300 hover:shadow-xl">
            <div className="space-y-4 p-6 sm:p-8 lg:p-10 xl:p-12 flex-shrink-0">
              <h3 className="text-xl sm:text-2xl lg:text-[32px] font-medium text-black">
                {t('website.NewSimfinDes.NewSimfinDes.card2.title')}
              </h3>
              <p className="text-sm sm:text-base leading-relaxed text-gray-700">
                {t('website.NewSimfinDes.NewSimfinDes.card2.des')}
              </p>
            </div>

            <div className="relative w-full flex-1 overflow-hidden">
              <img
                src="/images/No more SIM card drama.png"
                alt="Avoid waiting in line - Woman with phone"
                className="absolute inset-0 h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 600px"
              />
            </div>
          </div>
        </div>

        {/* Stay Protected Online */}
        <div className="group relative mt-8 sm:mt-12 lg:mt-16 overflow-hidden rounded-3xl bg-gradient-to-br from-gray-50 to-gray-100 transition-all duration-300 hover:shadow-xl">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <div className="flex flex-col justify-center space-y-4 sm:space-y-6 p-6 sm:p-8 lg:p-10 xl:p-12 text-center md:text-start">
              <h3 className="text-xl sm:text-2xl lg:text-3xl lg:text-[32px] font-medium leading-tight text-black">
                {t('website.NewSimfinDes.NewSimfinDes.card3.title')}
              </h3>

              <p className="text-sm sm:text-base leading-relaxed text-gray-600 max-w-lg mx-auto md:mx-0">
                {t('website.NewSimfinDes.NewSimfinDes.card3.des')}
              </p>

              <div className="mt-4 sm:mt-6">
                <ThemeButton variant="outline" className="">
                  {t('website.NewSimfinDes.NewSimfinDes.card3.btn')}
                </ThemeButton>
              </div>
            </div>

            <div className="relative flex items-end justify-center lg:justify-end">
              <div className="relative w-full max-w-[400px] sm:max-w-[450px] lg:max-w-[500px] xl:max-w-[550px] h-[400px] sm:h-[450px] lg:h-[500px] xl:h-[550px]">
                <img
                  src="/images/By_Simfinitys.png"
                  alt="Stay protected online - Phone security features"
                  className="absolute inset-0 h-full w-full rounded-2xl object-cover object-bottom transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 600px"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InstantConnectionSection;
