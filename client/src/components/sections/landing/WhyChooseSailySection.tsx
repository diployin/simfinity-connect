'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from '@/contexts/TranslationContext';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Feature {
  id: number;
  title: string;
  description: string;
}

const WhyChooseSailySection = () => {
  const { t } = useTranslation();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Icon mapping by ID
  const iconMap: Record<number, React.ReactNode> = {
    1: <img src="/images/features/global.svg" className="h-12 w-12 sm:h-14 sm:w-14" alt="price" />,
    2: <img src="/images/features/time (2).svg" className="h-12 w-12 sm:h-14 sm:w-14" alt="activate" />,
    3: <img src="/images/features/no-wifi.svg" className="h-12 w-12 sm:h-14 sm:w-14" alt="roaming" />,
    4: <img src="/images/features/sim-card.svg" className="h-12 w-12 sm:h-14 sm:w-14" alt="esim" />,
    5: <img src="/images/features/bulb.svg" className="h-12 w-12 sm:h-14 sm:w-14" alt="alert" />,
    6: <img src="/images/features/map-pin.svg" className="h-12 w-12 sm:h-14 sm:w-14" alt="global" />,
  };

  const features: Feature[] = [
    {
      id: 1,
      title: t('website.NewSimfinDes.WhyChooseSailySection.features.0.title'),
      description: t('website.NewSimfinDes.WhyChooseSailySection.features.0.description'),
    },
    {
      id: 2,
      title: t('website.NewSimfinDes.WhyChooseSailySection.features.1.title'),
      description: t('website.NewSimfinDes.WhyChooseSailySection.features.1.description'),
    },
    {
      id: 3,
      title: t('website.NewSimfinDes.WhyChooseSailySection.features.2.title'),
      description: t('website.NewSimfinDes.WhyChooseSailySection.features.2.description'),
    },
    {
      id: 4,
      title: t('website.NewSimfinDes.WhyChooseSailySection.features.3.title'),
      description: t('website.NewSimfinDes.WhyChooseSailySection.features.3.description'),
    },
    {
      id: 5,
      title: t('website.NewSimfinDes.WhyChooseSailySection.features.4.title'),
      description: t('website.NewSimfinDes.WhyChooseSailySection.features.4.description'),
    },
    {
      id: 6,
      title: t('website.NewSimfinDes.WhyChooseSailySection.features.5.title'),
      description: t('website.NewSimfinDes.WhyChooseSailySection.features.5.description'),
    },
  ];

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? features.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === features.length - 1 ? 0 : prev + 1));
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart(e.clientX);
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setIsDragging(false);
    const dragEnd = e.clientX;
    const diff = dragStart - dragEnd;

    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        handleNext();
      } else {
        handlePrev();
      }
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    setDragStart(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!isDragging) return;
    setIsDragging(false);
    const dragEnd = e.changedTouches[0].clientX;
    const diff = dragStart - dragEnd;

    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        handleNext();
      } else {
        handlePrev();
      }
    }
  };

  return (
    <section className="w-full bg-white py-12 sm:py-16 md:hidden">
      <div className="px-4 sm:px-6">
        {/* Header */}
        <div className="mb-10 sm:mb-12">
          <p className="mb-2 text-xs font-normal text-gray-400 sm:text-sm">
            {t('website.NewSimfinDes.WhyChooseSailySectionHeader.subtitle')}
          </p>
          <h2 className="text-2xl leading-tight font-semibold text-black sm:text-3xl">
            {t('website.NewSimfinDes.WhyChooseSailySectionHeader.title')}
          </h2>
        </div>

        {/* Carousel Container */}
        <div
          ref={containerRef}
          className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100 p-6 sm:p-8"
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Carousel Slide */}
          <div className="transition-all duration-500 ease-out">
            <div className="flex flex-col space-y-5">
              {/* Icon */}
              <div className="inline-flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-xl bg-white shadow-sm transition-transform duration-300 hover:scale-110">
                {iconMap[features[currentIndex].id]}
              </div>

              {/* Title */}
              <h3 className="text-xl font-semibold text-black sm:text-2xl leading-snug">
                {features[currentIndex].title}
              </h3>

              {/* Description */}
              <p className="text-sm leading-relaxed font-normal text-gray-600 sm:text-base pr-2">
                {features[currentIndex].description}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Section */}
        <div className="mt-8 sm:mt-10 flex items-center justify-between">
          {/* Dots Indicator */}
          <div className="flex gap-2">
            {features.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`h-2 rounded-full transition-all duration-300 ${index === currentIndex
                  ? 'w-8 bg-black'
                  : 'w-2 bg-gray-300 hover:bg-gray-400'
                  }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>

          {/* Arrow Buttons */}
          <div className="flex gap-3 sm:gap-4">
            <button
              onClick={handlePrev}
              className="inline-flex items-center justify-center h-10 w-10 sm:h-12 sm:w-12 rounded-full border border-gray-300 text-gray-700 transition-all duration-200 hover:border-black hover:text-black hover:bg-gray-50 active:scale-95"
              aria-label="Previous slide"
            >
              <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />
            </button>
            <button
              onClick={handleNext}
              className="inline-flex items-center justify-center h-10 w-10 sm:h-12 sm:w-12 rounded-full border border-gray-300 text-gray-700 transition-all duration-200 hover:border-black hover:text-black hover:bg-gray-50 active:scale-95 bg-black text-white border-black"
              aria-label="Next slide"
            >
              <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" />
            </button>
          </div>
        </div>

        {/* Slide Counter */}
        <div className="mt-6 text-center">
          <p className="text-xs font-medium text-gray-500 sm:text-sm">
            <span className="text-black font-semibold">{currentIndex + 1}</span>
            {' '}of{' '}
            <span className="text-black font-semibold">{features.length}</span>
          </p>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseSailySection;