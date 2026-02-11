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
    2: <img src="/images/features/time2.svg" className="h-10 w-10" alt="activate" />,
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
    <section className="w-full bg-white pt-0 pb-16 sm:py-20 lg:py-24">
      <div className="containers">
        {/* Header */}
        <div className="mb-12 sm:mb-16 flex flex-col items-start text-start max-w-4xl">
          <p className="mb-3 text-sm font-medium text-gray-400 sm:text-base uppercase tracking-wider">
            {t('website.NewSimfinDes.WhyChooseSailySectionHeader.subtitle')}
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-2.5 font-medium leading-tight text-gray-900 tracking-tight">
            {t('website.NewSimfinDes.WhyChooseSailySectionHeader.title')}
          </h2>
        </div>

        <div className="block md:hidden">
          <Carousel
            plugins={[autoplayPlugin.current]}
            className="w-full"
            onMouseEnter={autoplayPlugin.current.stop}
            onMouseLeave={autoplayPlugin.current.reset}
            opts={{
              align: "start",
              loop: true,
            }}
          >
            <CarouselContent className="-ml-4 pb-16">
              {features.map((feature) => (
                <CarouselItem key={feature.id} className="pl-4 basis-[85%]">
                  <div className="p-1">
                    <div className="flex flex-col space-y-5 p-6 border border-gray-100 dark:border-gray-800 rounded-2xl bg-white dark:bg-slate-900 shadow-sm hover:shadow-md transition-all h-full">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                        {iconMap[feature.id]}
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                        {t(feature.titleKey)}
                      </h3>
                      <p className="text-base text-gray-600 dark:text-gray-400 leading-relaxed">
                        {t(feature.descriptionKey)}
                      </p>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>

            {/* Mobile arrows */}
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 flex gap-4 z-10">
              <CarouselPrevious className="h-11 w-11 rounded-full bg-white dark:bg-slate-800 border-primary/20 shadow-lg static translate-y-0" />
              <CarouselNext className="h-11 w-11 rounded-full bg-white dark:bg-slate-800 border-primary/20 shadow-lg static translate-y-0" />
            </div>
          </Carousel>
        </div>


        <div className="hidden md:grid grid-cols-1 gap-8 sm:gap-10 md:grid-cols-2 lg:grid-cols-3 lg:gap-12">
          {features.map((feature) => (
            <div key={feature.id} className="group flex flex-col space-y-5 p-6 rounded-2xl border border-transparent hover:border-primary/20 hover:bg-primary/[0.02] transition-all">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                {iconMap[feature.id]}
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white sm:text-xl tracking-tight">
                {t(feature.titleKey)}
              </h3>
              <p className="text-base leading-relaxed font-thin text-gray-600 dark:text-gray-400 sm:text-base">
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
