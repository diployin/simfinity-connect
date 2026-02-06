'use client';

import { useTranslation } from '@/contexts/TranslationContext';
import React from 'react';

interface ImageData {
  src: string;
  alt: string;
  width: number;
  height: number;
}

const AboutHero = () => {
  const { t } = useTranslation();
  const images: ImageData[] = [
    {
      src: '/images/about/Work life Balance.png',
      alt: 'People taking photos of the cake as they celebrate at the company HQ',
      width: 498,
      height: 300,
    },
    {
      src: '/images/about/Meet the people behind Simfinity Slide 1st (1).png',
      alt: 'CEO speaking at an event',
      width: 214,
      height: 300,
    },
    {
      src: '/images/about/Meet the people behind Simfinity Slide 3rd.png',
      alt: 'A team member hugging a dog at the office',
      width: 214,
      height: 300,
    },
    {
      src: '/images/about/Growth Opportunities.png',
      alt: 'Employees gathered around a phone during a business event',
      width: 454,
      height: 300,
    },
    {
      src: '/images/about/Meet the people behind Simfinity Slide 5th.png',
      alt: 'Presenter giving a talk at an event',
      width: 214,
      height: 300,
    },
    {
      src: '/images/about/Meet the people behind Simfinity Slide 4th.png',
      alt: 'A traveler wearing a backpack with a company sticker',
      width: 214,
      height: 300,
    },
  ];

  return (
    <>
      <section className="scroll-mt-20 xl:scroll-mt-24">
        <div className="pointer-events-none absolute top-18 right-0 h-full w-full">
          <img
            src="/images/about/two-sections-wave-xl-yellow.svg"
            alt=""
            className="w-full"
            width={1000}
            height={400}
          />
        </div>
        <div className="py-16">
          <div className="mx-4 sm:mx-auto">
            <div className="containers">
              <div className="relative flex flex-wrap gap-6">
                {/* Image 1 - Large left image */}
                <div className="order-2 hidden h-[300px] w-full md:block md:w-[498px] lg:order-1 lg:w-[454px]">
                  <div className="relative h-full w-full">
                    <img
                      src={images[0].src}
                      alt={images[0].alt}
                      width={images[0].width}
                      height={images[0].height}
                      className="h-full w-full rounded-4xl object-cover"
                    />
                  </div>
                </div>

                {/* Text Card */}
                <div className="order-1 w-full lg:order-2 lg:w-[452px]">
                  <div className="relative flex h-full flex-col items-start gap-4 rounded-4xl border border-gray-200/50 bg-white/60 p-6 text-left shadow-sm backdrop-blur-[25px] lg:p-8">
                    <div className="flex h-full w-full flex-col gap-y-3">
                      <div>
                        <h1 className="lg:text4.5xl text-3xl leading-tight font-medium text-black sm:text-4xl">
                          {t('website.NewSimfinDes.about_us.HeroSec.card.title')}
                        </h1>
                      </div>
                      <div>
                        <p className="text-base font-medium text-gray-600 sm:text-base">
                          {t('website.NewSimfinDes.about_us.HeroSec.card.description')}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Image 2 - First vertical image */}
                <div className="order-3 hidden h-[300px] w-[214px] md:block">
                  <div className="relative h-full w-full">
                    <img
                      src={images[1].src}
                      alt={images[1].alt}
                      width={images[1].width}
                      height={images[1].height}
                      className="h-full w-full rounded-4xl object-cover"
                    />
                  </div>
                </div>

                {/* Image 3 - Second vertical image (hidden on smaller screens) */}
                <div className="order-4 hidden h-[300px] w-[214px] lg:block">
                  <div className="relative h-full w-full">
                    <img
                      src={images[2].src}
                      alt={images[2].alt}
                      width={images[2].width}
                      height={images[2].height}
                      className="h-full w-full rounded-4xl object-cover"
                    />
                  </div>
                </div>

                {/* Image 4 - Medium horizontal image */}
                <div className="order-5 hidden h-[300px] w-full lg:block lg:w-[454px]">
                  <div className="relative h-full w-full">
                    <img
                      src={images[3].src}
                      alt={images[3].alt}
                      width={images[3].width}
                      height={images[3].height}
                      className="h-full w-full rounded-4xl object-cover"
                    />
                  </div>
                </div>

                {/* Image 5 - Third vertical image (only on xl screens) */}
                <div className="order-6 hidden h-[300px] w-[214px] xl:block">
                  <div className="relative h-full w-full">
                    <img
                      src={images[4].src}
                      alt={images[4].alt}
                      width={images[4].width}
                      height={images[4].height}
                      className="h-full w-full rounded-4xl object-cover"
                      loading="lazy"
                    />
                  </div>
                </div>

                {/* Image 6 - Fourth vertical image (only on xl screens) */}
                <div className="order-7 hidden h-[300px] w-[214px] xl:block">
                  <div className="relative h-full w-full">
                    <img
                      src={images[5].src}
                      alt={images[5].alt}
                      width={images[5].width}
                      height={images[5].height}
                      className="h-full w-full rounded-4xl object-cover"
                      loading="lazy"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="overflow-hidden bg-white py-8 md:py-16">
        <div className="containers relative z-10">
          <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-12">
            {/* Left Side - Text Content */}
            <div className="space-y-6 text-center md:text-start">
              <h2 className="text-4.5xl leading-tight font-medium text-black">
                {t('website.NewSimfinDes.about_us.WhyBuiltSec.title')}
              </h2>

              <div className="space-y-4">
                <p className="text-base leading-relaxed text-gray-700 sm:text-base">
                  {t('website.NewSimfinDes.about_us.WhyBuiltSec.para1')}
                </p>

                <p className="text-base leading-relaxed text-gray-700 sm:text-base">
                  {t('website.NewSimfinDes.about_us.WhyBuiltSec.para2')}
                </p>
              </div>
            </div>

            {/* Right Side - Image */}
            <div className="relative h-[400px] w-full lg:h-[500px]">
              <div className="relative h-full w-full overflow-hidden rounded-3xl">
                <img
                  src="/images/about/Voices_crew1.png"
                  alt="People enjoying an event together"
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default AboutHero;
