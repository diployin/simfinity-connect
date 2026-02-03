import React from 'react';

import BrandShowcase from '@/components/carousel/BrandShowcase';
import AboutHero from '@/components/sections/about/AboutHero';
import CareerCTASection from '@/components/sections/about/CareerCTASection';
import SailyTaleSection from '@/components/sections/about/SailyTaleSection';
import ValuesSection from '@/components/sections/about/ValuesSection';
import VoicesSection from '@/components/sections/about/VoicesSection';

const page = () => {
  return (
    <>
      <AboutHero />
      <BrandShowcase />
      <ValuesSection />
      <SailyTaleSection />
      <VoicesSection />
      <CareerCTASection />
    </>
  );
};

export default page;
