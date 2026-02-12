'use client';

import { useTranslation } from '@/contexts/TranslationContext';
import React from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import Autoplay from 'embla-carousel-autoplay';
import { Star, Quote } from 'lucide-react';

interface Testimonial {
  id: string;
  name: string;
  avatar?: string;
  content: string;
  rating?: number;
  platformBadge?: string;
  isHighlight?: boolean;
}

const TestimonialsSection = () => {
  const { t } = useTranslation();

  const autoplayPlugin = React.useRef(
    Autoplay({ delay: 5000, stopOnInteraction: false })
  );

  const testimonials: Testimonial[] = [
    {
      id: "1",
      name: "Jorge A.",
      platformBadge: "/images/Trustpilot_logo.svg",
      content: t('website.NewSimfinDes.TestimonialsSection.review1'),
      rating: 5,
    },
    {
      id: "2",
      name: "PewDiePie",
      avatar: "/images/pewdiepie.png",
      platformBadge: "/images/youtube-logo.svg",
      content: t('website.NewSimfinDes.TestimonialsSection.review2'),
      rating: 5,
    },
    {
      id: "3",
      name: "Lonely Planet",
      platformBadge: "/images/Trustpilot_logo.svg",
      content: t('website.NewSimfinDes.TestimonialsSection.review3'),
      rating: 5,
      isHighlight: true,
    },
    {
      id: "4",
      name: "DutchPilotGirl",
      avatar: "/images/dutchpilotgirl.webp",
      platformBadge: "/images/youtube-logo.svg",
      content: t('website.NewSimfinDes.TestimonialsSection.review4'),
      rating: 5,
    },
    {
      id: "5",
      name: "Domas R.",
      platformBadge: "/images/Trustpilot_logo.svg",
      content: t('website.NewSimfinDes.TestimonialsSection.review5'),
      rating: 5,
    },
    {
      id: "6",
      name: "Cybernews",
      platformBadge: "/images/Trustpilot_logo.svg",
      content: t('website.NewSimfinDes.TestimonialsSection.review6'),
      rating: 5,
    },
    {
      id: "7",
      name: "TechRadar",
      platformBadge: "/images/Trustpilot_logo.svg",
      content: t('website.NewSimfinDes.TestimonialsSection.review7'),
      rating: 5,
    },
  ];

  const TestimonialCard = ({ item }: { item: Testimonial }) => (
    <div className="flex flex-col h-full space-y-5 rounded-[2rem] bg-white p-8 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          {item.avatar && (
            <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-full border border-gray-100">
              <img src={item.avatar} alt={item.name} className="h-full w-full object-cover" />
            </div>
          )}
          <span className="text-base font-bold text-gray-900">{item.name}</span>
        </div>
        {item.platformBadge && (
          <img src={item.platformBadge} alt="Platform" className="h-6 w-auto grayscale opacity-50" />
        )}
      </div>

      <p className="text-sm font-medium leading-relaxed text-gray-600 flex-grow">
        "{item.content}"
      </p>

      {item.rating && (
        <div className="flex items-center gap-0.5">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
          ))}
        </div>
      )}
    </div>
  );

  return (
    <section className="w-full bg-slate-50 py-16 sm:py-24 lg:py-32 overflow-hidden">
      <div className="containers mx-auto px-4">
        {/* Header */}
        <div className="mb-12 sm:mb-20 text-start flex flex-col items-start max-w-4xl">
          <p className="text-gray-400 font-medium uppercase tracking-[0.2em] text-xs sm:text-sm mb-4">
            Real travelers. Real experiences. Real Simfinity.
          </p>
          <h2 className="mb-6 text-3xl sm:text-4xl lg:text-2.5 font-medium leading-tight text-gray-900 tracking-tight">
            Simfinity reviews from travelers”
          </h2>
          <p className="text-base font-thin text-gray-600 sm:text-lg leading-relaxed max-w-2xl">
            Watch quick video reviews from global travelers who use Simfinity on every trip.
          </p>
        </div>

        {/* MOBILE SLIDER (Carousel) */}
        <div className="block lg:hidden mx-auto max-w-md">
          <Carousel
            plugins={[autoplayPlugin.current]}
            className="w-full px-2"
            opts={{
              align: "start",
              loop: true,
            }}
          >
            <CarouselContent className="-ml-2">
              {testimonials.map((item) => (
                <CarouselItem key={item.id} className="pl-2">
                  <div className="py-8 h-full">
                    <div className="flex flex-col space-y-6 rounded-[2rem] bg-white p-8 shadow-xl border border-gray-100 h-full min-h-[400px]">
                      {item.isHighlight ? (
                        /* Style for Lonely Planet (Highlight) */
                        <div className="flex flex-col h-full text-start">
                          <Quote className="w-8 h-8 text-black fill-black mb-6 rotate-180" />
                          <p className="text-xl font-bold text-gray-900 leading-[1.4] mb-auto">
                            {item.content}
                          </p>
                          <div className="mt-8 pt-6">
                            {item.platformBadge && (
                              <img src={item.platformBadge} alt={item.name} className="h-8 grayscale-0" />
                            )}
                          </div>
                        </div>
                      ) : (
                        /* Style for PewDiePie and others */
                        <div className="flex flex-col h-full text-start">
                          <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-3">
                              {item.avatar && (
                                <img src={item.avatar} alt={item.name} className="h-12 w-12 rounded-full object-cover border-2 border-gray-100 shadow-sm" />
                              )}
                              <span className="text-lg font-bold text-gray-900">{item.name}</span>
                            </div>
                            {item.platformBadge && (
                              <div className="flex-shrink-0">
                                <img src={item.platformBadge} alt="Platform" className="h-7 w-auto" />
                              </div>
                            )}
                          </div>
                          <p className="text-base font-medium text-gray-700 leading-relaxed mb-auto">
                            {item.content}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>

            {/* Navigation Buttons aligned to right */}
            <div className="flex justify-end gap-2 mt-2 px-2">
              <CarouselPrevious className="h-11 w-11 rounded-full bg-white border-primary/20 shadow-lg relative left-0 top-0 translate-y-0" />
              <CarouselNext className="h-11 w-11 rounded-full bg-white border-primary/20 shadow-lg relative right-0 top-0 translate-y-0" />
            </div>
          </Carousel>
        </div>

        {/* DESKTOP GRID */}
        <div className="hidden lg:grid grid-cols-4 gap-6 items-start">
          {/* Column 1 */}
          <div className="flex flex-col gap-6">
            <TestimonialCard item={testimonials[0]} />
            <TestimonialCard item={testimonials[1]} />
          </div>

          {/* Column 2 - Highlight Card */}
          <div className="flex flex-col h-full pt-12">
            <div className="flex flex-col space-y-10 rounded-[2.5rem] bg-white p-12 shadow-md border border-gray-100 h-[600px] justify-center relative overflow-hidden group">
              <div className="absolute top-10 left-10 opacity-10 flex flex-col gap-4">
                <Quote className="w-20 h-20 text-primary fill-primary" />
              </div>
              <p className="text-2xl font-bold text-gray-900 leading-[1.4] tracking-tight relative z-10 italic">
                "{testimonials[2].content}"
              </p>
              <div className="pt-8 border-t border-gray-100 relative z-10">
                <img src={testimonials[2].platformBadge} alt="Trustpilot" className="h-10 w-autograyscale group-hover:grayscale-0 transition-all duration-500" />
                <p className="mt-4 text-sm font-bold text-gray-500 uppercase tracking-widest">Featured Review</p>
              </div>
            </div>
          </div>

          {/* Column 3 */}
          <div className="flex flex-col gap-6">
            <TestimonialCard item={testimonials[3]} />
            <TestimonialCard item={testimonials[4]} />
          </div>

          {/* Column 4 */}
          <div className="flex flex-col gap-6 mt-12">
            <TestimonialCard item={testimonials[5]} />
            <TestimonialCard item={testimonials[6]} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
