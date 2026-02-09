'use client';

import React, { useState } from 'react';

import { Carousel, CarouselApi, CarouselContent, CarouselItem } from '@/components/ui/carousel';

import Autoplay from 'embla-carousel-autoplay';
import LifeAtSailySection from './LifeAtSailySection';
import { useTranslation } from '@/contexts/TranslationContext';

interface Testimonial {
  id: number;
  quote: string;
  name: string;
  designation: string;
  image: string;
}

const VoicesSection = () => {
  const { t } = useTranslation();
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  // Autoplay plugin with configuration
  const plugin = React.useRef(
    Autoplay({
      delay: 5000,
      stopOnInteraction: false,
      stopOnMouseEnter: true,
    }),
  );

  // Get testimonials from translation
  const testimonials: Testimonial[] = [
    {
      id: 1,
      quote: t('website.NewSimfinDes.about_us.VoicesSection.testimonials.0.quote'),
      name: t('website.NewSimfinDes.about_us.VoicesSection.testimonials.0.name'),
      designation: t('website.NewSimfinDes.about_us.VoicesSection.testimonials.0.designation'),
      image: '/images/about/Voices_crew1.png',
    },
    {
      id: 2,
      quote: t('website.NewSimfinDes.about_us.VoicesSection.testimonials.1.quote'),
      name: t('website.NewSimfinDes.about_us.VoicesSection.testimonials.1.name'),
      designation: t('website.NewSimfinDes.about_us.VoicesSection.testimonials.1.designation'),
      // image: '/images/about/about-us-voices-of-simfinity-neringa.webp'
      image: '/images/about/Voices_crew2.png',
    },
    {
      id: 3,
      quote: t('website.NewSimfinDes.about_us.VoicesSection.testimonials.2.quote'),
      name: t('website.NewSimfinDes.about_us.VoicesSection.testimonials.2.name'),
      designation: t('website.NewSimfinDes.about_us.VoicesSection.testimonials.2.designation'),
      // image: '/images/about/about-us-voices-of-simfinity-matas.webp'
      image: '/images/about/Voices_crew3.png',
    },
  ];

  React.useEffect(() => {
    if (!api) return;

    setCurrent(api.selectedScrollSnap());

    api.on('select', () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  return (
    <div className="relative">
      <section className="overflow-hidden bg-black py-20 text-white">
        {/* Background Image */}
        <div className="pointer-events-none absolute top-18 right-0 h-full w-full">
          <img
            src="/images/about/two-sections-wave-xl-dark.svg"
            alt=""
            className="w-full"
            width={1000}
            height={400}
          />
        </div>

        <div className="containers relative z-10">
          {/* Header */}
          <div className="mb-16">
            <h2 className="text-4.5xl mb-4 font-medium text-white">
              {t('website.NewSimfinDes.about_us.VoicesSection.heading')}
            </h2>
            <p className="max-w-3xl text-base text-gray-300 sm:text-lg">
              {t('website.NewSimfinDes.about_us.VoicesSection.subheading')}
            </p>
          </div>

          {/* Carousel */}
          <Carousel
            setApi={setApi}
            plugins={[plugin.current]}
            opts={{
              align: 'start',
              loop: true,
            }}
            className="w-full"
            onMouseEnter={() => plugin.current.stop()}
            onMouseLeave={() => plugin.current.play()}
          >
            <CarouselContent>
              {testimonials.map((testimonial) => {
                return (
                  <CarouselItem key={testimonial.id}>
                    <div className="rounded-3xl border border-gray-700 bg-gradient-to-br from-gray-900/50 to-black/50 p-8 backdrop-blur-sm md:p-12">
                      <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12">
                        {/* Quote Section - Left Side */}
                        <div className="flex gap-3 lg:col-span-7">
                          {/* Quote Icon */}
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="64"
                            height="57"
                            fill="none"
                            className="flex-shrink-0 max-md:hidden"
                          >
                            <path
                              d="M37.618 57V37.918c0-10.437 2.036-19 6.107-25.686C47.96 5.545 54.718 1.468 64 0v10.03c-5.537.652-9.445 2.773-11.725 6.36-2.28 3.588-3.42 9.297-3.42 17.125l-7.328-.979h22.229V57H37.618ZM0 57V37.918c0-10.437 2.036-19 6.107-25.686C10.34 5.545 17.099 1.468 26.382 0v10.03c-5.537.652-9.446 2.773-11.726 6.36-2.28 3.588-3.42 9.297-3.42 17.125l-7.328-.979h22.23V57H0Z"
                              fill="#4D4E56"
                            ></path>
                          </svg>

                          {/* Quote Text */}
                          <blockquote className="text-xl leading-relaxed font-normal text-white sm:text-2xl md:text-xl">
                            {testimonial.quote}
                          </blockquote>
                        </div>

                        {/* Image and Info Section - Right Side */}
                        <div className="flex flex-col items-center lg:col-span-5 lg:items-end">
                          {/* Profile Image */}
                          <div className="relative mb-6 h-72 w-72 overflow-hidden rounded-2xl">
                            <div className="from-themeYellow absolute inset-0 bg-gradient-to-br to-red-300" />
                            <img
                              src={testimonial.image}
                              alt={testimonial.name}
                              className="object-cover"
                            />
                          </div>

                          {/* Name and Designation */}
                          <div className="w-full text-center">
                            <h3 className="mb-1 text-base font-medium text-white">
                              {testimonial.name}
                            </h3>
                            <p className="text-sm text-gray-400">{testimonial.designation}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CarouselItem>
                );
              })}
            </CarouselContent>
          </Carousel>

          {/* Pagination Dots */}
          <div className="mt-8 flex justify-center gap-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => api?.scrollTo(index)}
                className={`rounded-full transition-all duration-300 ${
                  current === index ? 'h-2 w-8 bg-white' : 'h-2 w-2 bg-gray-600 hover:bg-gray-500'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </section>
      <LifeAtSailySection />
    </div>
  );
};

export default VoicesSection;
