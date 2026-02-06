import { Helmet } from 'react-helmet-async';

import { EsimNumHero } from '@/components/sections/EsimNumHero';
import { TopFeaturesStrip } from '@/components/sections/TopFeaturesStrip';
import { DestinationsTabs } from '@/components/sections/DestinationsTabs';
import { PopularEsims } from '@/components/sections/PopularEsims';
import { CompleteEsims } from '@/components/sections/CompleteEsims';
import { BenefitsSection } from '@/components/sections/BenefitsSection';
import { HowItWorksSteps } from '@/components/sections/HowItWorksSteps';
import { FAQWithSupport } from '@/components/sections/FAQWithSupport';
import { TravelerTestimonials } from '@/components/sections/TravelerTestimonials';
import { FloatingButtons } from '@/components/sections/FloatingButtons';
import { GlobalFloatingNav } from '@/components/GlobalFloatingNav';
import { Wifi, Smartphone, Phone, Headphones, Signal, Globe } from 'lucide-react';
import { useTranslation } from '@/contexts/TranslationContext';
import {
  ComparisonTable,
  InfiniteScrollTicker,
  NetworkPartners,
  TrustBadges,
} from '@/components/marketing';
import FeatureSectionCompo from '@/components/sections/FeatureSectionCompo';
import { SubscriptionBanner } from '@/components/sections/SubscriptionBanner';
import { TravelReadyBanner } from '@/components/sections/TravelReadyBanner';
import { AgencyProblemsSection } from '@/components/sections/AgencyProblemsSection';
import { useSettingByKey, useSettings } from '@/hooks/useSettings';
import BannerSection from '@/components/sections/BannerSection';
import { useUser } from '@/hooks/use-user';
import HeroSection from '@/components/sections/landing/hero-section';
import WhatIsEsimSection from '@/components/sections/landing/WhatIsEsimSection';
import TravelDestinationTabsNew from '@/components/sections/landing/TravelDestinationTabsNew';
import WhyChooseSailySection from '@/components/sections/landing/WhyChooseSailySection';
import InstantConnectionSection from '@/components/sections/landing/InstantConnectionSection';
import HowDoesItWorkSection from '@/components/sections/landing/HowDoesItWorkSection';
import DownloadAppSection from '@/components/sections/landing/DownloadAppSection';
import TestimonialsSection from '@/components/sections/landing/TestimonialsSection';
import FAQSection from '@/components/sections/landing/FAQSection';
import ReferralSection from '@/components/sections/landing/ReferralSection';
import TestHeroSection from '@/components/sections/landing/TestHeroSection';
import FeaturesBar from '@/components/FeaturesBar';

export default function Home() {
  const { t } = useTranslation();
  const siteName = useSettingByKey('platform_name');

  const { isAuthenticated, user } = useUser();

  console.log('isAuthenticated', isAuthenticated);

  console.log('siteName_new', siteName);

  const featureItems = [
    { icon: Wifi, label: t('website.home.features.unlimitedData', 'Unlimited Data') },
    { icon: Smartphone, label: t('website.home.features.esimReady', 'eSIM Ready') },
    { icon: Phone, label: t('website.home.features.dataVoice', 'Data + Voice') },
    { icon: Headphones, label: t('website.home.features.support', '24x7 Support') },
    { icon: Signal, label: t('website.home.features.hotspot', 'Hotspot Sharing') },
    { icon: Globe, label: t('website.home.features.countries', '200+ Countries') },
  ];
  const seoTitle = t(
    'website.home.seo.title',
    `${siteName} - Affordable eSIM Plans for International Travel`,
  );
  const seoDescription = t(
    'website.home.seo.description',
    'Instant data in 200+ destinations with one eSIM, no roaming needed. Get affordable eSIM plans for international travel and stay connected worldwide.',
  );

  return (
    <>
      <Helmet>
        <title>{seoTitle}</title>
        <meta name="description" content={seoDescription} />
        <meta
          name="keywords"
          content="eSIM, travel eSIM, international data, roaming, mobile data, travel connectivity, prepaid data, global eSIM"
        />
        <meta property="og:title" content={seoTitle} />
        <meta property="og:description" content={seoDescription} />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="https://esim.com" />
      </Helmet>

      <div className="min-h-screen bg-background">
        {/* <SiteHeader /> */}

        <main>
          {/* Hero section wrapper - fills viewport with strip at bottom above floating nav */}
          <div className="relative min-h-screen flex flex-col  ">
            {/* <HeroSection /> */}
            <HeroSection />
            <FeaturesBar />
            <WhatIsEsimSection />
            <TravelDestinationTabsNew />
          </div>
          <WhyChooseSailySection />
          <InstantConnectionSection />
          <HowDoesItWorkSection />
          <DownloadAppSection />
          <TestimonialsSection />
          <FAQSection />
          <ReferralSection />
        </main>
      </div>
    </>
  );
}
