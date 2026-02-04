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
  const title = t("website.NewSimfinDes.download_esim_app.DowonloadEsim.FAQData.title");

  const esimSetupTabs = [
  {
    label: "On iPhone",
    title: "Set up an eSIM on iPhone",
    steps: [
      {
        number: "1",
        stepTitle: "Open Settings",
        description: "Go to Settings > Mobile Data > Add eSIM on your iPhone.",
        image: "/images/esim/iphone-step-1.png",
      },
      {
        number: "2",
        stepTitle: "Scan QR code",
        description: "Use your iPhone camera to scan the QR code you received.",
        image: "/images/esim/iphone-step-2.png",
      },
      {
        number: "3",
        stepTitle: "Activate your eSIM",
        description: "Confirm the plan and wait for the eSIM to activate.",
      },
    ],
  },

  {
    label: "On Android",
    title: "Set up an eSIM on Android",
    steps: [
      {
        number: "1",
        stepTitle: "Open Network Settings",
        description: "Go to Settings > Network & Internet > SIMs.",
        image: "/images/esim/android-step-1.png",
      },
      {
        number: "2",
        stepTitle: "Add eSIM",
        description: "Tap Add SIM and scan the QR code provided.",
        image: "/images/esim/android-step-2.png",
      },
      {
        number: "3",
        stepTitle: "Finish setup",
        description: "Download and enable the eSIM for mobile data.",
      },
    ],
  },

  {
    label: "With a QR code",
    title: "Set up an eSIM using a QR code",
    steps: [
      {
        number: "1",
        stepTitle: "Scan the QR code to download the app",
        description:
          "Use your phone camera to scan the QR code and download the eSIM app.",
      },
      {
        number: "2",
        stepTitle: "Buy an eSIM data plan for your trip",
        description:
          "Choose a mobile data plan for the country or region you’re visiting.",
      },
      {
        number: "3",
        stepTitle: "Your plan will automatically activate",
        description:
          "Get online the moment you arrive at your destination.",
      },
    ],
  },
];



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
                {t('website.WhatIsEsim.content.heroTittle')}
              </h2>

              <p className="text-base leading-relaxed text-gray-600 sm:text-base">
                {t('website.WhatIsEsim.content.herodes')}
              </p>

              <div className="">
                <Link
                  href="/contact"
                  className="bg-themeYellow hover:bg-themeYellowHover inline-block rounded-full border px-8 py-3.5 text-base font-medium text-black transition-colors duration-200"
                >
                  {t('website.WhatIsEsim.content.ctaButton')}
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
        <div className="containers mx-auto max-w-7xl">
          <div className="bg-themeYellow flex flex-col items-center justify-center rounded-4xl px-4 py-16 sm:px-6 lg:px-8">
            <h2 className="lg:text-4.5xl text-3xl leading-tight font-medium text-white sm:text-4xl">
              {t('website.NewSimfinDes.what_is_esim.WhatIsEsim.getEsimSection.title')}
            </h2>

            <p className="py-4 text-base leading-relaxed text-white/80 sm:text-base">
              {t('website.NewSimfinDes.what_is_esim.WhatIsEsim.getEsimSection.description')}
            </p>
            <div className="">
              <Link
                href="/contact"
                className="inline-block rounded-full border bg-[#235347] px-8 py-3.5 text-base font-medium text-white transition-colors duration-200 hover:bg-[#0b2b26]"
              >
                {t('website.NewSimfinDes.what_is_esim.WhatIsEsim.getEsimSection.ctaButton')}
              </Link>
            </div>
          </div>
        </div>
      </section>

      <FAQ
        faqs={staticData.WhatIsEsim.FAQData.faqs}
        title={title}
        maxWidth="3xl"
        className=" "
      />
    </div>
  );
};

export default WhatEsimNew;
