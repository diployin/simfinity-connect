'use client';

import React, { useState } from 'react';

import { Carousel, CarouselApi, CarouselContent, CarouselItem } from '@/components/ui/carousel';

import Autoplay from 'embla-carousel-autoplay';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useTranslation } from '@/contexts/TranslationContext';

const LifeAtSailySection = () => {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  const { t } = useTranslation();

  const plugin = React.useRef(
    Autoplay({
      delay: 5000,
      stopOnInteraction: false,
      stopOnMouseEnter: true,
    }),
  );

  // NewSimfinDes.about_us.LifeAtSailySection.card.0.title

  // Data for each column
  const lifeColumns = [
    // First special column - Full height with text on top and image on bottom
    {
      id: 0,
      special: true,
      icon: (
        <svg className="text-themeYellow h-10 w-10" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 3L1 9l11 6 9-4.91V17h2V9M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z" />
        </svg>
      ),
      title: t('NewSimfinDes.LifeAtSailySection.card.0.title'),
      description: t('NewSimfinDes.LifeAtSailySection.card.0.des'),
      image: '/images/about/Growth Opportunities.png',
      alt: 'Team learning session',
    },
    {
      id: 1,
      topCard: {
        type: 'image',
        image: '/images/about/Meet the people behind Simfinity Slide 1st (1).png',
        alt: 'Team celebration',
      },
      bottomCard: {
        type: 'text',
        icon: (
          <svg className="text-themeYellow h-10 w-10" viewBox="0 0 24 24" fill="currentColor">
            <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
          </svg>
        ),
        title: t('NewSimfinDes.LifeAtSailySection.card.1.title'),
        description: t('NewSimfinDes.LifeAtSailySection.card.1.des'),
      },
    },
    {
      id: 2,
      topCard: {
        type: 'text',
        icon: (
          <svg className="text-themeYellow h-10 w-10" viewBox="0 0 24 24" fill="currentColor">
            <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
          </svg>
        ),
        title: t('NewSimfinDes.LifeAtSailySection.card.2.title'),
        description: t('NewSimfinDes.LifeAtSailySection.card.2.des'),
      },
      bottomCard: {
        type: 'image',
        image: '/images/about/Meet the people behind Simfinity Slide 4th.png',
        alt: 'Team event',
      },
    },
    {
      id: 3,
      topCard: {
        type: 'image',
        image: '/images/about/Work life Balance.png',
        alt: 'Team collaboration',
      },
      bottomCard: {
        type: 'text',
        icon: (
          <svg className="text-themeYellow h-10 w-10" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
          </svg>
        ),
        title: t('NewSimfinDes.LifeAtSailySection.card.3.title'),
        description: t('NewSimfinDes.LifeAtSailySection.card.3.des'),
      },
    },
    {
      id: 4,
      topCard: {
        type: 'text',
        icon: (
          <svg className="text-themeYellow h-10 w-10" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z" />
          </svg>
        ),
        title: t('NewSimfinDes.LifeAtSailySection.card.4.title'),
        description: t('NewSimfinDes.LifeAtSailySection.card.4.des'),
      },
      bottomCard: {
        type: 'image',
        image: '/images/about/Meet the people behind Simfinity Slide 1st.png',
        alt: 'Remote work',
      },
    },
  ];

  React.useEffect(() => {
    if (!api) return;
    setCurrent(api.selectedScrollSnap());
    api.on('select', () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  const renderCard = (card: any) => {
    if (card.type === 'image') {
      return (
        <div className="h-[250px] overflow-hidden rounded-3xl">
          <img
            src={card.image}
            alt={card.alt}
            width={500}
            height={280}
            className="h-full w-full object-cover"
          />
        </div>
      );
    }

    return (
      <div className="flex h-[230px] flex-col gap-4 rounded-3xl border border-gray-700 bg-gradient-to-br from-gray-900/50 to-black/50 p-6 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <div className="flex h-12 w-12 items-center justify-center">{card.icon}</div>
          <h3 className="text-xl font-medium text-white">{card.title}</h3>
        </div>
        <p className="text-sm leading-relaxed text-gray-300">{card.description}</p>
      </div>
    );
  };

  return (
    <section className="overflow-hidden bg-black py-14 text-white sm:py-18 lg:py-20">
      <div className="containers">
        {/* Header */}

        {/* Carousel */}
        <div className="relative">
          <Carousel
            setApi={setApi}
            plugins={[plugin.current]}
            opts={{
              align: 'start',
              loop: true,
              slidesToScroll: 1,
            }}
            className="w-full"
            onMouseEnter={() => plugin.current.stop()}
            onMouseLeave={() => plugin.current.play()}
          >
            <CarouselContent className="-ml-4">
              {lifeColumns.map((column) => (
                <CarouselItem key={column.id} className="pl-4 md:basis-1/3">
                  {column.special ? (
                    // Special first card - Two separate items stacked
                    <div className="flex flex-col gap-4">
                      {/* Text Card - Top */}
                      <span className="py-6 text-4xl">
                        {' '}
                        {t('NewSimfinDes.LifeAtSailySection.title')}
                      </span>
                      <div className="flex h-[175px] flex-col gap-4 overflow-y-scroll rounded-3xl border border-gray-700 bg-gradient-to-br from-gray-900/50 to-black/50 p-6 backdrop-blur-sm lg:overflow-hidden">
                        <div className="flex items-center gap-2">
                          <div className="flex h-12 w-12 items-center justify-center">
                            {column.icon}
                          </div>
                          <h3 className="text-xl font-medium text-white">{column.title}</h3>
                        </div>
                        <p className="text-sm leading-relaxed text-gray-300">
                          {column.description}
                        </p>
                      </div>

                      {/* Image Card - Bottom */}
                      <div className="h-[200px] overflow-hidden rounded-3xl">
                        <img
                          src={column.image}
                          alt={column.alt}
                          width={500}
                          height={330}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    </div>
                  ) : (
                    // Regular two-card column
                    <div className="flex flex-col gap-4">
                      {renderCard(column.topCard)}
                      {renderCard(column.bottomCard)}
                    </div>
                  )}
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>

          {/* Navigation Buttons */}
          <div className="mt-8 flex justify-end gap-3">
            <button
              onClick={() => api?.scrollPrev()}
              className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-white transition-all hover:bg-white hover:text-black"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button
              onClick={() => api?.scrollNext()}
              className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-white transition-all hover:bg-white hover:text-black"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LifeAtSailySection;
