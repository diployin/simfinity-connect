'use client';

import React from 'react';

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';

import {
  FaCompass,
  FaGlobeAmericas,
  FaHeart,
  FaLightbulb,
  FaRocket,
  FaSeedling,
} from 'react-icons/fa';
import { useTranslation } from '@/contexts/TranslationContext';

interface Value {
  id: number;
  iconType: string;
  title: string;
  description: string;
}

const ValuesSection = () => {
  const { t } = useTranslation();

  // Icon mapping by type
  const iconMap: Record<string, React.ReactNode> = {
    GlobeAmericas: <FaGlobeAmericas className="text-themeYellow h-8 w-8" />,
    Lightbulb: <FaLightbulb className="text-themeYellow h-8 w-8" />,
    Heart: <FaHeart className="text-themeYellow h-8 w-8" />,
    Seedling: <FaSeedling className="text-themeYellow h-8 w-8" />,
    Compass: <FaCompass className="text-themeYellow h-8 w-8" />,
    Rocket: <FaRocket className="text-themeYellow h-8 w-8" />,
  };

  // Get values data from translation
  const values: Value[] = [
    {
      id: 1,
      iconType: t('website.NewSimfinDes.about_us.ValuesSection.values.0.iconType'),
      title: t('website.NewSimfinDes.about_us.ValuesSection.values.0.title'),
      description: t('website.NewSimfinDes.about_us.ValuesSection.values.0.description'),
    },
    {
      id: 2,
      iconType: t('website.NewSimfinDes.about_us.ValuesSection.values.1.iconType'),
      title: t('website.NewSimfinDes.about_us.ValuesSection.values.1.title'),
      description: t('website.NewSimfinDes.about_us.ValuesSection.values.1.description'),
    },
    {
      id: 3,
      iconType: t('website.NewSimfinDes.about_us.ValuesSection.values.2.iconType'),
      title: t('website.NewSimfinDes.about_us.ValuesSection.values.2.title'),
      description: t('website.NewSimfinDes.about_us.ValuesSection.values.2.description'),
    },
    {
      id: 4,
      iconType: t('website.NewSimfinDes.about_us.ValuesSection.values.3.iconType'),
      title: t('website.NewSimfinDes.about_us.ValuesSection.values.3.title'),
      description: t('website.NewSimfinDes.about_us.ValuesSection.values.3.description'),
    },
    {
      id: 5,
      iconType: t('website.NewSimfinDes.about_us.ValuesSection.values.4.iconType'),
      title: t('website.NewSimfinDes.about_us.ValuesSection.values.4.title'),
      description: t('website.NewSimfinDes.about_us.ValuesSection.values.4.description'),
    },
    {
      id: 6,
      iconType: t('website.NewSimfinDes.about_us.ValuesSection.values.5.iconType'),
      title: t('website.NewSimfinDes.about_us.ValuesSection.values.5.title'),
      description: t('website.NewSimfinDes.about_us.ValuesSection.values.5.description'),
    },
  ];

  return (
    <section className="bg-black py-20 text-white">
      <div className="containers">
        {/* Header */}
        <div className="mb-16">
          <h2 className="mb-4 text-3xl font-medium text-white sm:text-4xl md:text-start">
            {t('website.NewSimfinDes.about_us.ValuesSection.heading')}
          </h2>
          <p className="max-w-3xl text-base font-thin text-gray-300 sm:text-base md:text-start">
            {t('website.NewSimfinDes.about_us.ValuesSection.subheading')}
          </p>
        </div>

        {/* Desktop Grid View */}
        <div className="hidden grid-cols-1 gap-8 md:grid-cols-2 lg:grid lg:grid-cols-3">
          {values.map((value) => (
            <div key={value.id} className="flex flex-col gap-4">
              <div className="flex h-10 w-10 items-center justify-center">
                {iconMap[value.iconType] || (
                  <FaGlobeAmericas className="text-themeYellow h-8 w-8" />
                )}
              </div>
              <h3 className="text-xl font-medium text-white">{value.title}</h3>
              <p className="text-base leading-relaxed text-gray-300">{value.description}</p>
            </div>
          ))}
        </div>

        {/* Mobile Carousel View */}
        <div className="relative block lg:hidden">
          <Carousel
            opts={{
              align: 'start',
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent>
              {values.map((value) => (
                <CarouselItem key={value.id} className="md:basis-1/2">
                  <div className="flex flex-col gap-4 p-6">
                    <div className="flex h-10 w-10 items-center justify-center">
                      {iconMap[value.iconType] || (
                        <FaGlobeAmericas className="text-themeYellow h-8 w-8" />
                      )}
                    </div>
                    <h3 className="text-2xl font-medium text-white">{value.title}</h3>
                    <p className="text-base leading-relaxed text-gray-300">{value.description}</p>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>

            {/* Navigation Buttons */}
            <div className="mt-8 flex justify-end mr-10">
              <CarouselPrevious className="static h-14 w-14 translate-y-0 border-2 border-white bg-transparent text-white transition-colors hover:bg-white hover:text-black [&_svg]:!h-8 [&_svg]:!w-8" />
              <CarouselNext className="static h-14 w-14 translate-y-0 border-2 border-white bg-transparent text-white transition-colors hover:bg-white hover:text-black [&_svg]:!h-8 [&_svg]:!w-8" />
            </div>
          </Carousel>
        </div>
      </div>
    </section>
  );
};

export default ValuesSection;
