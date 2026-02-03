'use client';

import React, { useState } from 'react';

import { Carousel, CarouselApi, CarouselContent, CarouselItem } from '@/components/ui/carousel';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useTranslation } from '@/contexts/TranslationContext';

interface TimelineEvent {
  id: number;
  date: string;
  title: string;
  description: string;
  image: string;
}

const SailyTaleSection = () => {
  const { t } = useTranslation();
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  // Get events data from translation
  const events: TimelineEvent[] = [
    {
      id: 1,
      date: t('NewSimfinDes.about_us.SailyTaleSection.events.0.date'),
      title: t('NewSimfinDes.about_us.SailyTaleSection.events.0.title'),
      description: t('NewSimfinDes.about_us.SailyTaleSection.events.0.description'),
      image: '/images/about/Slider_1.png',
    },
    {
      id: 2,
      date: t('NewSimfinDes.about_us.SailyTaleSection.events.1.date'),
      title: t('NewSimfinDes.about_us.SailyTaleSection.events.1.title'),
      description: t('NewSimfinDes.about_us.SailyTaleSection.events.1.description'),
      // image: '/images/about/about-us-timeline-step-2.svg'
      image: '/images/about/Slider_2.png',
    },
    {
      id: 3,
      date: t('NewSimfinDes.about_us.SailyTaleSection.events.2.date'),
      title: t('NewSimfinDes.about_us.SailyTaleSection.events.2.title'),
      description: t('NewSimfinDes.about_us.SailyTaleSection.events.2.description'),
      // image: '/images/about/about-us-timeline-step-3.svg',
      image: '/images/about/Slider_3.png',
    },
    {
      id: 4,
      date: t('NewSimfinDes.about_us.SailyTaleSection.events.3.date'),
      title: t('NewSimfinDes.about_us.SailyTaleSection.events.3.title'),
      description: t('NewSimfinDes.about_us.SailyTaleSection.events.3.description'),
      image: '/images/about/Slider_1.png',
    },
    {
      id: 5,
      date: t('NewSimfinDes.about_us.SailyTaleSection.events.4.date'),
      title: t('NewSimfinDes.about_us.SailyTaleSection.events.4.title'),
      description: t('NewSimfinDes.about_us.SailyTaleSection.events.4.description'),
      image: '/images/about/Slider_2.png',
    },
  ];

  React.useEffect(() => {
    if (!api) return;

    setCurrent(api.selectedScrollSnap());

    api.on('select', () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  const scrollTo = (index: number) => {
    api?.scrollTo(index);
  };

  return (
    <section className="bg-white py-20">
      <div className="containers">
        {/* Header */}
        <div className="mb-16 text-center md:text-start">
          <h2 className="text-4.5xl mb-4 font-medium text-black">
            {t('NewSimfinDes.about_us.SailyTaleSection.heading')}
          </h2>
          <p className="max-w-3xl text-base text-gray-600 sm:text-lg">
            {t('NewSimfinDes.about_us.SailyTaleSection.subheading')}
          </p>
        </div>

        {/* Carousel */}
        <Carousel
          setApi={setApi}
          opts={{
            align: 'start',
            loop: false,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-4">
            {events.map((event) => (
              <CarouselItem key={event.id} className="cursor-grab pl-4 md:basis-1/2 lg:basis-1/3">
                <div className="flex h-full flex-col">
                  {/* Card */}
                  <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-gray-200 shadow-sm">
                    {/* Image Section - Half */}
                    <div className="relative h-36 w-full bg-gradient-to-br from-blue-100 to-blue-200">
                      <img src={event.image} alt={event.title} className="object-cover" />
                    </div>

                    {/* Content Section - Half */}
                    <div className="flex flex-1 flex-col bg-white p-6">
                      <h3 className="mb-3 text-xl font-medium text-black">{event.title}</h3>
                      <p className="text-base leading-relaxed text-gray-600">{event.description}</p>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>

        {/* Timeline with Navigation */}
        <div className="relative mt-12">
          {/* Timeline Line */}
          <div className="relative">
            <div className="absolute top-1/2 right-0 left-0 h-0.5 -translate-y-1/2 bg-gray-200" />

            {/* Timeline Points */}
            <div className="relative flex items-center justify-between px-4">
              {events.map((event, index) => (
                <button
                  key={event.id}
                  onClick={() => scrollTo(index)}
                  className="group flex cursor-pointer flex-col items-center"
                >
                  {/* Dot */}
                  <div
                    className={`flex h-4 w-4 items-center justify-center rounded-full transition-all duration-300 ${
                      current === index ? 'scale-125 bg-black' : 'bg-gray-300 hover:bg-gray-400'
                    }`}
                  >
                    <div className="h-2 w-2 rounded-full bg-white" />
                  </div>
                  {/* Date Label */}
                  <span
                    className={`mt-4 hidden text-sm font-medium whitespace-nowrap transition-colors sm:block ${
                      current === index ? 'text-black' : 'text-gray-500 group-hover:text-gray-700'
                    }`}
                  >
                    {event.date}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="mt-8 flex justify-end gap-3">
            <button
              onClick={() => api?.scrollPrev()}
              disabled={current === 0}
              className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-gray-300 transition-all hover:border-black hover:bg-black hover:text-white disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:border-gray-300 disabled:hover:bg-transparent disabled:hover:text-black"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={() => api?.scrollNext()}
              disabled={current === events.length - 1}
              className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-gray-300 transition-all hover:border-black hover:bg-black hover:text-white disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:border-gray-300 disabled:hover:bg-transparent disabled:hover:text-black"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SailyTaleSection;
