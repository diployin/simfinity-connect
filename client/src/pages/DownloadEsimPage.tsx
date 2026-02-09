'use client';

import React from 'react';

import CTASection from '@/components/common/CTASection';
import EsimSetupTabCommon from '@/components/common/EsimSetupTabCommon';
import FAQ from '@/components/common/FAQ';
import ImageContentSection from '@/components/common/ImageContentSection';
import DownloadAppSection from '@/components/sections/landing/DownloadAppSection';

import { CheckCircle, CreditCard, Globe, MessageSquare, Plane, Smartphone } from 'lucide-react';
import { useTranslation } from '@/contexts/TranslationContext';
import useStaticData from '@/data/useStaticData';
import FAQSection from '@/components/sections/landing/FAQSection';

const DownloadEsimPage = () => {
  const staticData = useStaticData();
  const { t } = useTranslation();

  return (
    <>
      <DownloadAppSection />
      <section className="bg-white py-8 md:py-16">
        <div className="containers mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-12">
            {/* Feature 1 */}
            <div className="flex flex-col items-start space-y-3 text-start">
              <Plane className="h-5 w-5 text-gray-900" strokeWidth={1.5} />
              <p className="max-w-xs text-sm leading-snug font-medium text-gray-900">
                {t('DownloadEsimPage.freaters1')}
              </p>
            </div>
            {/* Feature 2 */}
            <div className="flex flex-col items-start space-y-3 text-start">
              <Smartphone className="h-5 w-5 text-gray-900" strokeWidth={1.5} />
              <p className="max-w-xs text-sm leading-snug font-medium text-gray-900">
                {t('DownloadEsimPage.freaters2')}
              </p>
            </div>

            {/* Feature 3 */}
            <div className="flex flex-col items-start justify-start space-y-3 text-start">
              <MessageSquare className="h-5 w-5 text-gray-900" strokeWidth={1.5} />
              <p className="max-w-xs text-sm leading-snug font-medium text-gray-900">
                {t('DownloadEsimPage.freaters3')}
              </p>
            </div>

            {/* Feature 4 */}
            <div className="flex flex-col items-start justify-start space-y-3 text-start">
              <CheckCircle className="h-5 w-5 text-gray-900" strokeWidth={1.5} />
              <p className="max-w-xs text-sm leading-snug font-medium text-gray-900">
                {t('DownloadEsimPage.freaters4')}
              </p>
            </div>
          </div>
        </div>
      </section>
      <ImageContentSection
        title={t('DownloadEsimPage.heroTitle')}
        description={t('DownloadEsimPage.heroDescription')}
        imageSrc="/images/Simfinity Asia (1).png"
        imageAlt="Woman using eSIM on mobile phone"
        imagePosition="left"
        button={{
          text: t('DownloadEsimPage.ctaButton'),
          href: '/destinations',
        }}
      />

      <EsimSetupTabCommon tabs={staticData.DowonloadEsim.setupTabs} />
      <ImageContentSection
        title={t('DownloadEsimPage.activationTitle')}
        description={t('DownloadEsimPage.activationDescription')}
        imageSrc="/images/simfinity asia.png"
        imageAlt="Woman using eSIM on mobile phone"
        imagePosition="right"
      />
      <section className="bg-white px-4 sm:px-6 lg:px-8 py-8 md:py-16">
        <div className="containers mx-auto ">
          {/* Header */}
          <div className="mb-12 ">
            <h2 className="lg:text-4.5xl mb-4 text-3xl font-medium text-gray-900">
              {t('DownloadEsimPage.benefitsHeading')}
            </h2>

            <p className="text-base text-gray-600">{t('DownloadEsimPage.benefitsSubheading')}</p>
          </div>

          {/* Benefits Grid */}
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 lg:gap-12">
            <div className="space-y-4">
              <CheckCircle className="h-10 w-10 text-gray-900" strokeWidth={1.5} />
              <h3 className="text-xl font-medium text-gray-900">
                {t('DownloadEsimPage.benefit1Title')}
              </h3>
              <p className="text-gray-600">{t('DownloadEsimPage.benefit1Desc')}</p>
            </div>

            <div className="space-y-4">
              <CreditCard className="h-10 w-10 text-gray-900" strokeWidth={1.5} />
              <h3 className="text-xl font-medium text-gray-900">
                {t('DownloadEsimPage.benefit2Title')}
              </h3>
              <p className="text-gray-600">{t('DownloadEsimPage.benefit2Desc')}</p>
            </div>

            <div className="space-y-4">
              <Globe className="h-10 w-10 text-gray-900" strokeWidth={1.5} />
              <h3 className="text-xl font-medium text-gray-900">
                {t('DownloadEsimPage.benefit3Title')}
              </h3>
              <p className="text-gray-600">{t('DownloadEsimPage.benefit3Desc')}</p>
            </div>
          </div>
        </div>
      </section>

      <CTASection
        heading={t('DownloadEsimPage.ctaHeading')}
        description={t('DownloadEsimPage.ctaDescription')}
        button={{
          text: t('DownloadEsimPage.ctaButtonContact'),
          href: '/signup',
          variant: 'outline',
        }}
        contentAlignment="start"
        backgroundColor="bg-[#f7f7f8]"
        textColor="text-gray-900  "
      />

      {/* <FAQ faqs={staticData.DowonloadEsim.FAQData.faqs} /> */}
      <FAQSection />
      <CTASection
        heading={t('DownloadEsimPage.referCtaHeading')}
        description={t('DownloadEsimPage.referCtaDescription')}
        button={{
          text: t('DownloadEsimPage.referCtaButton'),
          href: '/signup',
          variant: 'outline_dark',
        }}
        contentAlignment="center"
        backgroundColor="bg-primary "
        textColor="text-white"
        descriptionColor="text-white/80"
        containerClassName="rounded-xl"
      />
    </>
  );
};

export default DownloadEsimPage;
