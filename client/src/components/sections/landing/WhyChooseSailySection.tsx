'use client';

import React from 'react';

import { Bell, CheckCircle, FileText, Globe, Layers, Receipt } from 'lucide-react';
import { useTranslation } from '@/contexts/TranslationContext';

interface Feature {
  id: number;
  title: string;
  description: string;
}

const WhyChooseSailySection = () => {
  const { t } = useTranslation();

  // Icon mapping by ID
  const iconMap: Record<number, React.ReactNode> = {
    1: <img src="/images/features/global.svg" className=" h-10 w-10" alt="price" />,
    2: <img src="/images/features/time (2).svg" className=" h-10 w-10" alt="activate" />,
    3: <img src="/images/features/no-wifi.svg" className=" h-10 w-10" alt="roaming" />,
    4: <img src="/images/features/sim-card.svg" className=" h-10 w-10" alt="esim" />,
    5: <img src="/images/features/bulb.svg" className=" h-10 w-10" alt="alert" />,
    6: <img src="/images/features/map-pin.svg" className=" h-10 w-10" alt="global" />,
  };

  // Get features from JSON - manually parse each one
  const features: Feature[] = [
    {
      id: 1,
      title: t('NewSimfinDes.WhyChooseSailySection.features.0.title'),
      description: t('NewSimfinDes.WhyChooseSailySection.features.0.description'),
    },
    {
      id: 2,
      title: t('NewSimfinDes.WhyChooseSailySection.features.1.title'),
      description: t('NewSimfinDes.WhyChooseSailySection.features.1.description'),
    },
    {
      id: 3,
      title: t('NewSimfinDes.WhyChooseSailySection.features.2.title'),
      description: t('NewSimfinDes.WhyChooseSailySection.features.2.description'),
    },
    {
      id: 4,
      title: t('NewSimfinDes.WhyChooseSailySection.features.3.title'),
      description: t('NewSimfinDes.WhyChooseSailySection.features.3.description'),
    },
    {
      id: 5,
      title: t('NewSimfinDes.WhyChooseSailySection.features.4.title'),
      description: t('NewSimfinDes.WhyChooseSailySection.features.4.description'),
    },
    {
      id: 6,
      title: t('NewSimfinDes.WhyChooseSailySection.features.5.title'),
      description: t('NewSimfinDes.WhyChooseSailySection.features.5.description'),
    },
  ];

  return (
    <section className="w-full bg-white py-16 sm:py-20 lg:py-24">
      <div className="containers">
        {/* Header */}
        <div className="mb-12 sm:mb-16">
          <p className="mb-3 text-center text-sm font-normal text-gray-400 sm:text-base md:text-start">
            {t('NewSimfinDes.WhyChooseSailySection.header.subtitle')}
          </p>
          <h2 className="text-center text-3xl leading-tight font-medium text-black sm:text-4xl md:text-start lg:text-5xl xl:text-4xl">
            {t('NewSimfinDes.WhyChooseSailySection.header.title')}
          </h2>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 gap-8 sm:gap-10 md:grid-cols-2 lg:grid-cols-3 lg:gap-12">
          {features.map((feature) => (
            <div key={feature.id} className="flex flex-col space-y-4">
              {/* Icon */}
              <div className="text-black">{iconMap[feature.id]}</div>

              {/* Title */}
              <h3 className="text-xl font-normal text-black sm:text-xl">{feature.title}</h3>

              {/* Description */}
              <p className="text-base leading-relaxed font-normal text-gray-600 sm:text-base">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseSailySection;
