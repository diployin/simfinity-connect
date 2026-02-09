'use client';

import React from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import Autoplay from 'embla-carousel-autoplay';
import { useTranslation } from '@/contexts/TranslationContext';

interface Feature {
  id: number;
  titleKey: string;
  descriptionKey: string;
}

const WhyChooseSailySection = () => {
  const { t } = useTranslation();

  const autoplayPlugin = React.useRef(
    Autoplay({ delay: 3000, stopOnInteraction: false })
  );

  // Icon mapping by ID
  const iconMap: Record<number, React.ReactNode> = {
    1: <img src="/images/features/global.svg" className="h-10 w-10" alt="price" />,
    2: <img src="/images/features/time (2).svg" className="h-10 w-10" alt="activate" />,
    3: <img src="/images/features/no-wifi.svg" className="h-10 w-10" alt="roaming" />,
    4: <img src="/images/features/sim-card.svg" className="h-10 w-10" alt="esim" />,
    5: <img src="/images/features/bulb.svg" className="h-10 w-10" alt="alert" />,
    6: <img src="/images/features/map-pin.svg" className="h-10 w-10" alt="global" />,
  };

  // Features with i18n keys (without "website." prefix)
  const features: Feature[] = [
    {
      id: 1,
      titleKey: 'website.NewSimfinDes.WhyChooseSailySection.features.0.title',
      descriptionKey: 'website.NewSimfinDes.WhyChooseSailySection.features.0.description',
    },
    {
      id: 2,
      titleKey: 'website.NewSimfinDes.WhyChooseSailySection.features.1.title',
      descriptionKey: 'website.NewSimfinDes.WhyChooseSailySection.features.1.description',
    },
    {
      id: 3,
      titleKey: 'website.NewSimfinDes.WhyChooseSailySection.features.2.title',
      descriptionKey: 'website.NewSimfinDes.WhyChooseSailySection.features.2.description',
    },
    {
      id: 4,
      titleKey: 'website.NewSimfinDes.WhyChooseSailySection.features.3.title',
      descriptionKey: 'website.NewSimfinDes.WhyChooseSailySection.features.3.description',
    },
    {
      id: 5,
      titleKey: 'website.NewSimfinDes.WhyChooseSailySection.features.4.title',
      descriptionKey: 'website.NewSimfinDes.WhyChooseSailySection.features.4.description',
    },
    {
      id: 6,
      titleKey: 'website.NewSimfinDes.WhyChooseSailySection.features.5.title',
      descriptionKey: 'website.NewSimfinDes.WhyChooseSailySection.features.5.description',
    },
  ];

  return (
    <section className="w-full bg-white py-16 sm:py-20 lg:py-24">
      <div className="containers">
        {/* Header */}
        <div className="mb-12 sm:mb-16">
          <p className="mb-3 text-center text-sm font-normal text-gray-400 sm:text-base md:text-start">
            {t('website.NewSimfinDes.WhyChooseSailySectionHeader.subtitle')}
          </p>
          <h2 className="text-center text-3xl leading-tight font-medium text-black sm:text-4xl md:text-start lg:text-5xl xl:text-4xl">
            {t('website.NewSimfinDes.WhyChooseSailySectionHeader.title')}
          </h2>
        </div>

        {/* Mobile Carousel */}
        <div className="block md:hidden relative">
          <Carousel
            plugins={[autoplayPlugin.current]}
            className="w-full"
            onMouseEnter={autoplayPlugin.current.stop}
            onMouseLeave={autoplayPlugin.current.reset}
          >
            <CarouselContent>
              {features.map((feature) => (
                <CarouselItem key={feature.id} className="pl-4">
                  <div className="flex flex-col space-y-4 p-4 border rounded-lg bg-white shadow-sm">
                    <div className="text-black">{iconMap[feature.id]}</div>
                    <h3 className="text-xl font-normal text-black">
                      {t(feature.titleKey)}
                    </h3>
                    <p className="text-base leading-relaxed font-normal text-gray-600">
                      {t(feature.descriptionKey)}
                    </p>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>

            <div className="flex justify-end items-center gap-4 mt-5">
              <CarouselPrevious className="static h-12 w-12 rounded-full bg-white border border-gray-200 shadow-md hover:bg-gray-50 hover:shadow-lg" />
              <CarouselNext className="static h-12 w-12 rounded-full bg-white border border-gray-200 shadow-md hover:bg-gray-50 hover:shadow-lg" />
            </div>
          </Carousel>
        </div>

        {/* Desktop Grid */}
        <div className="hidden md:grid grid-cols-1 gap-8 sm:gap-10 md:grid-cols-2 lg:grid-cols-3 lg:gap-12">
          {features.map((feature) => (
            <div key={feature.id} className="flex flex-col space-y-4">
              <div className="text-black">{iconMap[feature.id]}</div>
              <h3 className="text-xl font-normal text-black sm:text-xl">
                {t(feature.titleKey)}
              </h3>
              <p className="text-base leading-relaxed font-normal text-gray-600 sm:text-base">
                {t(feature.descriptionKey)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseSailySection;
