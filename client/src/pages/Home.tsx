import { Helmet } from 'react-helmet-async';

import { Wifi, Smartphone, Phone, Headphones, Signal, Globe } from 'lucide-react';
import { useTranslation } from '@/contexts/TranslationContext';
import { useSettingByKey } from '@/hooks/useSettings';
import { useUser } from '@/hooks/use-user';
import HeroSection from '@/components/sections/landing/hero-section';
import WhatIsEsimSection from '@/components/sections/landing/WhatIsEsimSection';
import TravelDestinationTabsNew from '@/components/sections/landing/TravelDestinationTabsNew';
import InstantConnectionSection from '@/components/sections/landing/InstantConnectionSection';
import HowDoesItWorkSection from '@/components/sections/landing/HowDoesItWorkSection';
import DownloadAppSection from '@/components/sections/landing/DownloadAppSection';
import TestimonialsSection from '@/components/sections/landing/TestimonialsSection';
import FAQSection from '@/components/sections/landing/FAQSection';
import ReferralSection from '@/components/sections/landing/ReferralSection';
import FeaturesBar from '@/components/FeaturesBar';
import WhyChooseSailySection from '@/components/sections/landing/WhyChooseSailySection';

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
