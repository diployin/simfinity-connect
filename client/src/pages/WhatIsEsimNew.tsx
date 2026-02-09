'use client';

import React from 'react';

import EsimSetupTabCommon from '@/components/common/EsimSetupTabCommon';
import FAQ from '@/components/common/FAQ';
import EsimBenefitsSection from '@/components/sections/whatEsim/EsimBenefitsSection';
import EsimVsSimComparison from '@/components/sections/whatEsim/EsimVsSimComparison';
import { useTranslation } from '@/contexts/TranslationContext';
import useStaticData from '@/data/useStaticData';
import { Link, useLocation } from 'wouter';
import ThemeButton from '@/components/ThemeButton';
import FAQSection from '@/components/sections/landing/FAQSection';

const WhatEsimNew = () => {
  const staticData = useStaticData();
  const { t } = useTranslation();
  const title = t('website.NewSimfinDes.download_esim_app.DowonloadEsim.FAQData.title');
  const [, navigate] = useLocation();

  const esimSetupTabs = [
    {
      label: t('website.esimSetupTab.tabs.iphone.label'),
      title: t('website.esimSetupTab.tabs.iphone.title'),
      steps: [
        {
          number: '1',
          stepTitle: t('website.esimSetupTab.tabs.iphone.steps.1.title'),
          description: t('website.esimSetupTab.tabs.iphone.steps.1.description'),
          image: '/images/whatEsim/1.png',
        },
        {
          number: '2',
          stepTitle: t('website.esimSetupTab.tabs.iphone.steps.2.title'),
          description: t('website.esimSetupTab.tabs.iphone.steps.2.description'),
          image: '/images/whatEsim/2.png',
        },
        {
          number: '3',
          stepTitle: t('website.esimSetupTab.tabs.iphone.steps.3.title'),
          description: t('website.esimSetupTab.tabs.iphone.steps.3.description'),
          image: '/images/whatEsim/3.png',
        },
      ],
      instructions: {
        heading: t('website.esimSetupTab.tabs.iphone.instructions.heading'),
        steps: [
          t('website.esimSetupTab.tabs.iphone.instructions.steps.1'),
          t('website.esimSetupTab.tabs.iphone.instructions.steps.2'),
          t('website.esimSetupTab.tabs.iphone.instructions.steps.3'),
          t('website.esimSetupTab.tabs.iphone.instructions.steps.4'),
        ],
      },
    },

    {
      label: t('website.esimSetupTab.tabs.android.label'),
      title: t('website.esimSetupTab.tabs.android.title'),
      steps: [
        {
          number: '1',
          stepTitle: t('website.esimSetupTab.tabs.android.steps.1.title'),
          description: t('website.esimSetupTab.tabs.android.steps.1.description'),
          image: '/images/whatEsim/1-step.png',
        },
        {
          number: '2',
          stepTitle: t('website.esimSetupTab.tabs.android.steps.2.title'),
          description: t('website.esimSetupTab.tabs.android.steps.2.description'),
          image: '/images/whatEsim/2-step.png',
        },
        {
          number: '3',
          stepTitle: t('website.esimSetupTab.tabs.android.steps.3.title'),
          description: t('website.esimSetupTab.tabs.android.steps.3.description'),
          image: '/images/whatEsim/3-step.png',
        },
      ],
      instructions: {
        heading: t('website.esimSetupTab.tabs.android.instructions.heading'),
        steps: [
          t('website.esimSetupTab.tabs.android.instructions.steps.1'),
          t('website.esimSetupTab.tabs.android.instructions.steps.2'),
          t('website.esimSetupTab.tabs.android.instructions.steps.3'),
          t('website.esimSetupTab.tabs.android.instructions.steps.4'),
        ],
      },
    },

    {
      label: t('website.esimSetupTab.tabs.qr.label'),
      title: t('website.esimSetupTab.tabs.qr.title'),
      steps: [
        {
          number: '1',
          stepTitle: t('website.esimSetupTab.tabs.qr.steps.1.title'),
          description: t('website.esimSetupTab.tabs.qr.steps.1.description'),
        },
        {
          number: '2',
          stepTitle: t('website.esimSetupTab.tabs.qr.steps.2.title'),
          description: t('website.esimSetupTab.tabs.qr.steps.2.description'),
        },
        {
          number: '3',
          stepTitle: t('website.esimSetupTab.tabs.qr.steps.3.title'),
          description: t('website.esimSetupTab.tabs.qr.steps.3.description'),
        },
      ],
    },
  ];

  return (
    <div>
      <section className="bg-white px-4  pb-8 sm:px-6 lg:px-8 ">
        <div className="containers mx-auto">
          <div className="grid grid-cols-1 items-center gap-8 rounded-3xl lg:grid-cols-2 lg:gap-12">
            {/* Left Side - Image */}
            <div className="order-2 lg:order-2">
              <div className="relative h-[400px] overflow-hidden rounded-[2rem] sm:h-[600px] lg:h-[500px]">
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
              <h2 className="lg:text-5xl max-w-lg text-3xl leading-tight font-medium text-gray-900 sm:text-4xl">
                {t('website.WhatIsEsim.content.heroTittle')}
              </h2>

              <p className="text-base leading-relaxed text-gray-600 sm:text-base">
                {t('website.WhatIsEsim.content.herodes')}
              </p>

              <div className="">
                {/* <Link
                  href="/contact"
                  className="bg-themeYellow hover:bg-themeYellowHover inline-block rounded-full border px-8 py-3.5 text-base font-medium text-black transition-colors duration-200"
                >
                  {t('website.WhatIsEsim.content.ctaButton')}
                </Link> */}
                <div className=" flex justify-center md:justify-start ">
                  <ThemeButton onClick={() => navigate('/contact')}>
                    {t('website.WhatIsEsim.content.ctaButton')}
                  </ThemeButton>
                </div>
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
                {t('website.WhatIsEsim.content.heading')}
              </h2>

              <p className="text-base leading-relaxed text-gray-600 sm:text-base">
                {t('website.WhatIsEsim.content.des')}
              </p>
            </div>

            {/* Right Side - Content */}
            <div className="space-y-6">
              <p className="text-base leading-relaxed text-gray-700 sm:text-base">
                {t('website.WhatIsEsim.content.paragraph1')}
              </p>

              <p className="text-base leading-relaxed text-gray-700 sm:text-base">
                {t('website.WhatIsEsim.content.paragraph2')}
              </p>
            </div>
          </div>
        </div>
      </section>
      <section className="px-4 sm:px-6 md:pt-16 lg:px-8">
        <div className="containers mx-auto max-w-7xl">
          <div className="relative h-[300px] lg:h-[550px] overflow-hidden rounded-[2rem]">
            <img
              src="/images/whatEsim/How does an eSIM work.png"
              alt="Business professional using mobile and laptop"
              className="w-full h-full object-cover"
            />
          </div>

          <div className=" py-8 md:py-16 ">
            <h2 className="lg:text-4.5xl text-3xl leading-tight font-medium text-gray-900 sm:text-4xl">
              {t('website.WhatIsEsim.howDoesItWorkSection.heading')}
            </h2>

            <p className="py-4 text-base leading-relaxed text-gray-600 sm:text-base">
              {t('website.WhatIsEsim.howDoesItWorkSection.content.paragraph1')}
            </p>
            <p className="py-4 text-base leading-relaxed text-gray-600 sm:text-base">
              {t('website.WhatIsEsim.howDoesItWorkSection.content.paragraph2')}
            </p>
          </div>
        </div>
      </section>
      <EsimSetupTabCommon tabs={esimSetupTabs} />
      {/* <EsimSetupTabCommon tabs={staticData.WhatIsEsim.setUpEsim} /> */}
      {/* <EsimSetupTab /> */}
      <EsimBenefitsSection />
      <EsimVsSimComparison />

      <section className="px-4 py-8 sm:px-6 md:py-16 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col items-center justify-center rounded-[48px] bg-primary px-6 py-16 text-center sm:px-10 lg:px-20">
            <h2 className="text-3xl font-semibold leading-tight text-white sm:text-4xl lg:text-2.5">
              {t('website.NewSimfinDes.what_is_esim.WhatIsEsim.getEsimSection.title')}
            </h2>

            <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/90">
              {t('website.NewSimfinDes.what_is_esim.WhatIsEsim.getEsimSection.description')}
            </p>

            <Link
              href="/destinations"
              className="mt-8 inline-flex items-center justify-center rounded-full bg-black px-8 py-3.5 text-base font-medium text-white transition hover:bg-gray-900"
            >
              {t('website.NewSimfinDes.what_is_esim.WhatIsEsim.getEsimSection.ctaButton')}
            </Link>
          </div>
        </div>
      </section>

      {/* <FAQ faqs={staticData.WhatIsEsim.FAQData.faqs} title={title} maxWidth="3xl" className=" " /> */}
      <FAQSection />
    </div>
  );
};

export default WhatEsimNew;
