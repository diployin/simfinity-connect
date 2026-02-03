'use client';

import React from 'react';

import EsimSetupTabCommon from '@/components/common/EsimSetupTabCommon';
import FAQ from '@/components/common/FAQ';
import EsimBenefitsSection from '@/components/sections/whatEsim/EsimBenefitsSection';
import EsimVsSimComparison from '@/components/sections/whatEsim/EsimVsSimComparison';
import { useTranslation } from '@/contexts/TranslationContext';
import useStaticData from '@/data/useStaticData';
import { Link } from 'wouter';

const WhatEsimNew = () => {
  const staticData = useStaticData();
  const { t } = useTranslation();
  return (
    <div>
      <section className="bg-white px-4 pt-16 pb-8 sm:px-6 lg:px-8 lg:py-16">
        <div className="containers mx-auto">
          <div className="grid grid-cols-1 items-center gap-4 rounded-3xl lg:grid-cols-2 lg:gap-12">
            {/* Left Side - Image */}
            <div className="order-2 lg:order-2">
              <div className="relative h-[400px] overflow-hidden rounded-[2rem] sm:h-[600px] lg:h-[550px]">
                <img
                  src="/images/whatEsim/What_is_an_esim.png"
                  alt="Business professional using mobile and laptop"
                  className="object-contain"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
            </div>

            {/* Right Side - Content */}
            <div className="order-1 space-y-6 text-center md:text-start lg:order-1">
              <h2 className="lg:text-4.5xl max-w-lg text-3xl leading-tight font-medium text-gray-900 sm:text-4xl">
                {t('WhatIsEsim.heroTittle')}
              </h2>

              <p className="text-base leading-relaxed text-gray-600 sm:text-base">
                {t('WhatIsEsim.herodes')}
              </p>

              <div className="">
                <Link
                  href="/contact"
                  className="bg-themeYellow hover:bg-themeYellowHover inline-block rounded-full border px-8 py-3.5 text-base font-medium text-white transition-colors duration-200"
                >
                  {t('NewSimfinDes.what_is_esim.WhatIsEsim.heroSection.ctaButton')}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="px-4 py-8 sm:px-6 md:py-16 lg:px-8">
        <div className="containers mx-auto max-w-7xl">
          <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-2 lg:gap-16">
            {/* Left Side - Heading */}
            <div>
              <h2 className="lg:text-4.5xl text-4xl leading-tight font-medium text-gray-900 sm:text-4xl">
                {t('NewSimfinDes.what_is_esim.WhatIsEsim.whatIsEsimSection.heading')}
              </h2>

              <p className="text-base leading-relaxed text-gray-600 sm:text-base">
                {t('NewSimfinDes.what_is_esim.WhatIsEsim.whatIsEsimSection.des')}
              </p>
            </div>

            {/* Right Side - Content */}
            <div className="space-y-6">
              <p className="text-base leading-relaxed text-gray-700 sm:text-base">
                {t('NewSimfinDes.what_is_esim.WhatIsEsim.whatIsEsimSection.content.0.paragraph')}
              </p>

              <p className="text-base leading-relaxed text-gray-700 sm:text-base">
                {t('NewSimfinDes.what_is_esim.WhatIsEsim.whatIsEsimSection.content.1.paragraph')}
              </p>
            </div>
          </div>
        </div>
      </section>
      <section className="px-4 sm:px-6 md:pt-16 lg:px-8">
        <div className="containers mx-auto max-w-7xl">
          <div className="relative h-[300px] overflow-hidden rounded-[2rem] lg:h-[550px]">
            <img
              src="/images/whatEsim/How does an eSIM work.png" // Your image path
              alt="Business professional using mobile and laptop"
              className="object-contain"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>

          <div className="px-4 py-8 sm:px-6 md:py-16 lg:px-8">
            <h2 className="lg:text-4.5xl text-3xl leading-tight font-medium text-gray-900 sm:text-4xl">
              {t('NewSimfinDes.what_is_esim.WhatIsEsim.howDoesItWorkSection.heading')}
            </h2>

            <p className="py-4 text-base leading-relaxed text-gray-600 sm:text-base">
              {t('NewSimfinDes.what_is_esim.WhatIsEsim.howDoesItWorkSection.content.0.paragraph')}
            </p>
            <p className="py-4 text-base leading-relaxed text-gray-600 sm:text-base">
              {t('NewSimfinDes.what_is_esim.WhatIsEsim.howDoesItWorkSection.content.1.paragraph')}
            </p>
          </div>
        </div>
      </section>
      {/* <EsimSetupTabCommon tabs={staticData.WhatIsEsim.setUpEsim} /> */}
      <EsimSetupTabCommon tabs={staticData.WhatIsEsim.setUpEsim} />
      {/* <EsimSetupTab /> */}
      <EsimBenefitsSection />
      <EsimVsSimComparison />

      <section className="px-4 py-8 sm:px-6 md:py-16 lg:px-8">
        <div className="containers mx-auto max-w-7xl">
          <div className="bg-themeYellow flex flex-col items-center justify-center rounded-4xl px-4 py-16 sm:px-6 lg:px-8">
            <h2 className="lg:text-4.5xl text-3xl leading-tight font-medium text-white sm:text-4xl">
              {t('NewSimfinDes.what_is_esim.WhatIsEsim.getEsimSection.title')}
            </h2>

            <p className="py-4 text-base leading-relaxed text-white/80 sm:text-base">
              {t('NewSimfinDes.what_is_esim.WhatIsEsim.getEsimSection.description')}
            </p>
            <div className="">
              <Link
                href="/contact"
                className="inline-block rounded-full border bg-[#235347] px-8 py-3.5 text-base font-medium text-white transition-colors duration-200 hover:bg-[#0b2b26]"
              >
                {t('NewSimfinDes.what_is_esim.WhatIsEsim.getEsimSection.ctaButton')}
              </Link>
            </div>
          </div>
        </div>
      </section>

      <FAQ
        faqs={staticData.WhatIsEsim.FAQData.faqs}
        title={staticData.WhatIsEsim.FAQData.title}
        maxWidth="3xl"
        className=" "
      />
    </div>
  );
};

export default WhatEsimNew;
