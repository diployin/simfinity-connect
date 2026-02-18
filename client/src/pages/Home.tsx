import { Helmet } from 'react-helmet-async';
import { DestinationsTabs } from '@/components/sections/DestinationsTabs';
import { BenefitsSection } from '@/components/sections/BenefitsSection';
import { HowItWorksSteps } from '@/components/sections/HowItWorksSteps';
import { FAQWithSupport } from '@/components/sections/FAQWithSupport';
import { TravelerTestimonials } from '@/components/sections/TravelerTestimonials';
import { FloatingButtons } from '@/components/sections/FloatingButtons';
import { GlobalFloatingNav } from '@/components/GlobalFloatingNav';
import { useTranslation } from '@/contexts/TranslationContext';
import { HeroSection } from '../components/sections/HeroSection';
import { WhatIsEsim } from '@/components/sections/WhatIsEsim';
import { InstantConnection } from '@/components/sections/InstantConnection';
import { DownloadApp } from '@/components/sections/DownloadApp';
import { ImpactSection } from '@/components/sections/ImpactSection';
import { useSettingByKey } from '@/hooks/useSettings';
import { useUser } from '@/hooks/use-user';

export default function Home() {
  const { t } = useTranslation();
  const siteName = useSettingByKey('platform_name');
  useUser();

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
        <link rel="canonical" href="https://simfinity.tel" />
      </Helmet>

      <div className="min-h-screen bg-background">
        <main>
          <div className="pt-16 md:pt-[72px]">
            <HeroSection />
          </div>
          <WhatIsEsim />
          <DestinationsTabs />
          <InstantConnection />
          <BenefitsSection />
          <HowItWorksSteps />
          <TravelerTestimonials />
          <FAQWithSupport />
          <DownloadApp />
          <ImpactSection />
        </main>

        <FloatingButtons />
        <GlobalFloatingNav />
      </div>
    </>
  );
}
