import React from 'react';
import useStaticData from '@/data/useStaticData';
import { useTranslation } from '@/contexts/TranslationContext';

const WhatIsEsimSection = () => {
  const { t } = useTranslation();
  const staticData = useStaticData();

  return (
    <section className="w-full py-16 md:py-12 lg:py-20 bg-white dark:bg-transparent">
      <div className="containers mx-auto px-4">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:gap-16 xl:gap-24">
          {/* Left Side - Image */}
          <div className="order-2 flex items-center justify-center lg:order-1 lg:justify-start">
            <div className="relative w-full transform hover:scale-[1.05] transition-transform duration-500">
              <img
                src="/images/homepage-what-is-esim.png"
                alt={t('esimIntro.imageAlt')}
                className="w-full h-auto object-contain drop-shadow-2xl"
                loading="lazy"
              />
            </div>
          </div>

          {/* Right Side - Content */}
          <div className="order-1 flex flex-col space-y-6 lg:order-2 text-start">
            <h2 className="text-3xl sm:text-4xl lg:text-2.5 font-medium leading-[1.1] text-gray-900 tracking-tight">
              {t('esimIntro.title')}
            </h2>

            <p className="text-base font-thin leading-relaxed text-gray-600 sm:text-lg">
              {t('esimIntro.description')}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhatIsEsimSection;
