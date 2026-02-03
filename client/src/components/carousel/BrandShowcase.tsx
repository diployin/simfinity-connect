'use client';

import React from 'react';

import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';

import Autoplay from 'embla-carousel-autoplay';

interface Brand {
  id: number;
  name: string;
  logo: string;
}

const BrandShowcase = () => {
  const brands: Brand[] = [
    { id: 1, name: 'Lonely Planet', logo: '/images/brands/lonely-planet.svg' },
    { id: 2, name: 'Conde Nast Traveler', logo: '/images/brands/national-geographic.svg' },
    { id: 3, name: 'Forbes', logo: '/images/brands/forbes.svg' },
    { id: 4, name: 'CNN', logo: '/images/brands/cnn.svg' },
    { id: 5, name: 'PC Magazine', logo: '/images/brands/pcmag.svg' },
    { id: 6, name: 'TechRadar', logo: '/images/brands/techradar.svg' },
  ];

  const plugin = React.useRef(Autoplay({ delay: 2000, stopOnInteraction: false }));

  return (
    <section className="bg-white py-16">
      <div className="containers">
        <div className="hidden lg:block">
          <div className="rounded-full border border-gray-200 bg-white px-8 py-6 shadow-sm">
            <div className="flex items-center justify-between gap-8">
              <h3 className="text-base font-medium whitespace-nowrap text-black">
                They talk about us
              </h3>

              <div className="flex flex-1 items-center justify-center gap-8">
                {brands.map((brand) => (
                  <div
                    key={brand.id}
                    className="relative flex h-14 w-auto items-center justify-center transition-all duration-300"
                  >
                    <img
                      src={brand.logo}
                      alt={brand.name}
                      width={200}
                      height={120}
                      className="h-20 w-auto object-contain"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Mobile/Tablet View - Carousel Slider */}
        <div className="block lg:hidden">
          <div className="mb-8 text-start">
            <h3 className="text-sm font-medium text-black lg:text-lg">They talk about us</h3>
          </div>

          <Carousel
            plugins={[plugin.current]}
            className="w-full"
            opts={{
              align: 'start',
              loop: true,
            }}
            onMouseEnter={() => plugin.current.stop()}
            onMouseLeave={() => plugin.current.play()}
          >
            <CarouselContent className="-ml-4">
              {brands.map((brand) => (
                <CarouselItem key={brand.id} className="basis-1/2 pl-4 sm:basis-1/3">
                  <div className="flex h-20 items-center justify-center">
                    <img
                      src={brand.logo}
                      alt={brand.name}
                      width={120}
                      height={32}
                      className="h-14 w-auto object-contain"
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>
      </div>
    </section>
  );
};

export default BrandShowcase;
