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
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store/store';


const DownloadEsimPage = () => {
  const staticData = useStaticData();
  const { t } = useTranslation();

  const { isExpanded } = useSelector((state: RootState) => state.topNavbar);
  const isTopBarVisible = !isExpanded;


  return (
    <div className={`min-h-screen bg-background flex flex-col ${isTopBarVisible
      ? 'mt-28 md:mt-0'
      : 'mt-18 md:mt-0'}`}>
      <DownloadAppSection />
      <section className="bg-white py-10 sm:py-14 lg:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">

            {/* Feature 1 */}
            <div className="group rounded-2xl border border-gray-100 bg-gray-50 p-6 transition-all duration-300 hover:-translate-y-1 hover:bg-white hover:shadow-lg">
              <Plane className="h-6 w-6 text-gray-900 transition-colors group-hover:text-primary" strokeWidth={1.5} />
              <p className="mt-4 text-sm leading-relaxed font-medium text-gray-900">
                {t('website.DownloadEsimPage.freaters1')}
              </p>
            </div>

            {/* Feature 2 */}
            <div className="group rounded-2xl border border-gray-100 bg-gray-50 p-6 transition-all duration-300 hover:-translate-y-1 hover:bg-white hover:shadow-lg">
              <Smartphone className="h-6 w-6 text-gray-900 transition-colors group-hover:text-primary" strokeWidth={1.5} />
              <p className="mt-4 text-sm leading-relaxed font-medium text-gray-900">
                {t('website.DownloadEsimPage.freaters2')}
              </p>
            </div>

            {/* Feature 3 */}
            <div className="group rounded-2xl border border-gray-100 bg-gray-50 p-6 transition-all duration-300 hover:-translate-y-1 hover:bg-white hover:shadow-lg">
              <MessageSquare className="h-6 w-6 text-gray-900 transition-colors group-hover:text-primary" strokeWidth={1.5} />
              <p className="mt-4 text-sm leading-relaxed font-medium text-gray-900">
                {t('website.DownloadEsimPage.freaters3')}
              </p>
            </div>

            {/* Feature 4 */}
            <div className="group rounded-2xl border border-gray-100 bg-gray-50 p-6 transition-all duration-300 hover:-translate-y-1 hover:bg-white hover:shadow-lg">
              <CheckCircle className="h-6 w-6 text-gray-900 transition-colors group-hover:text-primary" strokeWidth={1.5} />
              <p className="mt-4 text-sm leading-relaxed font-medium text-gray-900">
                {t('website.DownloadEsimPage.freaters4')}
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
    </div>
  );
};

export default DownloadEsimPage;
