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
                {t('NewSimfinDes.download_esim_app.DowonloadEsim.features.0.title')}
              </p>
            </div>
            {/* Feature 2 */}
            <div className="flex flex-col items-start space-y-3 text-start">
              <Smartphone className="h-5 w-5 text-gray-900" strokeWidth={1.5} />
              <p className="max-w-xs text-sm leading-snug font-medium text-gray-900">
                {t('NewSimfinDes.download_esim_app.DowonloadEsim.features.1.title')}
              </p>
            </div>

            {/* Feature 3 */}
            <div className="flex flex-col items-start justify-start space-y-3 text-start">
              <MessageSquare className="h-5 w-5 text-gray-900" strokeWidth={1.5} />
              <p className="max-w-xs text-sm leading-snug font-medium text-gray-900">
                {t('NewSimfinDes.download_esim_app.DowonloadEsim.features.2.title')}
              </p>
            </div>

            {/* Feature 4 */}
            <div className="flex flex-col items-start justify-start space-y-3 text-start">
              <CheckCircle className="h-5 w-5 text-gray-900" strokeWidth={1.5} />
              <p className="max-w-xs text-sm leading-snug font-medium text-gray-900">
                {t('NewSimfinDes.download_esim_app.DowonloadEsim.features.3.title')}
              </p>
            </div>
          </div>
        </div>
      </section>
      <ImageContentSection
        title={t('NewSimfinDes.download_esim_app.DowonloadEsim.heroSection.title')}
        description={t('NewSimfinDes.download_esim_app.DowonloadEsim.heroSection.description')}
        imageSrc="/images/Simfinity Asia (1).png"
        imageAlt="Woman using eSIM on mobile phone"
        imagePosition="left"
        button={{
          text: t('NewSimfinDes.download_esim_app.DowonloadEsim.heroSection.ctaButton'),
          href: '/destinations',
        }}
      />

      <EsimSetupTabCommon tabs={staticData.DowonloadEsim.setupTabs} />
      <ImageContentSection
        title={t('NewSimfinDes.download_esim_app.DowonloadEsim.activationSection.title')}
        description={t('NewSimfinDes.download_esim_app.DowonloadEsim.heroSection.description')}
        imageSrc="/images/simfinity asia.png"
        imageAlt="Woman using eSIM on mobile phone"
        imagePosition="right"
      />
      <section className="bg-white py-8 md:py-16">
        <div className="containers mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-12">
            <h2 className="lg:text-4.5xl mb-4 text-3xl leading-tight font-medium text-gray-900 sm:text-4xl lg:max-w-3xl">
              {t('NewSimfinDes.download_esim_app.DowonloadEsim.benefitsSection.heading')}
            </h2>
            <p className="text-base text-gray-600 sm:text-base">
              {t('NewSimfinDes.download_esim_app.DowonloadEsim.benefitsSection.subheading')}
            </p>
          </div>

          {/* Benefits Grid */}
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 lg:gap-12">
            {/* Benefit 1 */}
            <div className="space-y-4">
              <CheckCircle className="h-10 w-10 text-gray-900" strokeWidth={1.5} />
              <h3 className="text-xl font-medium text-gray-900">
                {t('NewSimfinDes.download_esim_app.DowonloadEsim.benefitsSection.benefits.0.title')}
              </h3>
              <p className="text-base leading-relaxed text-gray-600">
                {t(
                  'NewSimfinDes.download_esim_app.DowonloadEsim.benefitsSection.benefits.0.description',
                )}
              </p>
            </div>

            {/* Benefit 2 */}
            <div className="space-y-4">
              <CreditCard className="h-10 w-10 text-gray-900" strokeWidth={1.5} />
              <h3 className="text-xl font-medium text-gray-900">
                {t('NewSimfinDes.download_esim_app.DowonloadEsim.benefitsSection.benefits.1.title')}
              </h3>
              <p className="text-base leading-relaxed text-gray-600">
                {t(
                  'NewSimfinDes.download_esim_app.DowonloadEsim.benefitsSection.benefits.1.description',
                )}
              </p>
            </div>

            {/* Benefit 3 */}
            <div className="space-y-4">
              <Globe className="h-10 w-10 text-gray-900" strokeWidth={1.5} />
              <h3 className="text-xl font-medium text-gray-900">
                {t('NewSimfinDes.download_esim_app.DowonloadEsim.benefitsSection.benefits.2.title')}
              </h3>
              <p className="text-base leading-relaxed text-gray-600">
                {t(
                  'NewSimfinDes.download_esim_app.DowonloadEsim.benefitsSection.benefits.2.description',
                )}
              </p>
            </div>
          </div>
        </div>
      </section>

      <CTASection
        heading={t('NewSimfinDes.download_esim_app.DowonloadEsim.ctaSections.0.heading')}
        description={t('NewSimfinDes.download_esim_app.DowonloadEsim.ctaSections.0.description')}
        button={{
          text: t('NewSimfinDes.download_esim_app.DowonloadEsim.ctaSections.0.ctaButton'),
          href: '/signup',
          variant: 'white',
        }}
        contentAlignment="start"
        backgroundColor=" bg-[#f7f7f8]  "
        textColor="text-gray-900"
      />

      <FAQ faqs={staticData.DowonloadEsim.FAQData.faqs} />
      <CTASection
        heading={t('NewSimfinDes.download_esim_app.DowonloadEsim.ctaSections.1.heading')}
        description={t('NewSimfinDes.download_esim_app.DowonloadEsim.ctaSections.1.description')}
        button={{
          text: 'Get Started',
          href: '/signup',
          variant: 'black',
        }}
        contentAlignment="center"
        backgroundColor="bg-primary "
        textColor="text-gray-900"
      />
    </>
  );
};

export default DownloadEsimPage;
