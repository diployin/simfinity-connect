import React from 'react';
import useStaticData from '@/data/useStaticData';
import { useTranslation } from '@/contexts/TranslationContext';

const WhatIsEsimSection = () => {
  const { t } = useTranslation();
  const staticData = useStaticData();

  return (
    <section className="w-full py-4 md:py-6 lg:py-8">
      <div className="containers">
        <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-12 xl:gap-16">
          {/* Left Side - Image */}
          <div className="order-2 flex items-center justify-center lg:order-1 lg:justify-start">
            <div className="relative aspect-[4/3] w-full max-w-[500px] lg:max-w-[600px]">
              <img
                src="/images/homepage-what-is-esim.png"
                alt={t('esimIntro.imageAlt')}
                className="h-full w-full object-contain"
                loading="lazy"
              />
            </div>
          </div>

          {/* Right Side - Content */}
          <div className="order-1 flex flex-col space-y-6 lg:order-2">
            <h2 className="text-xl font-normal leading-tight text-black sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl">
              {t('esimIntro.title')}
            </h2>

            <p className="text-base leading-relaxed text-gray-700 opacity-90">
              {t('esimIntro.description')}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhatIsEsimSection;
