'use client';

import { useTranslation } from '@/contexts/TranslationContext';
import React from 'react';
import { Link } from 'wouter';

const CareerCTASection = () => {
  const { t } = useTranslation();

  return (
    <section className="relative min-h-[500px] w-full overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src="/images/about/Always connected. Always on course.png"
          alt={t('website.NewSimfinDes.about_us.CareerCTASection.backgroundImageAlt')}
          className="object-cover"
        />
      </div>

      {/* Content */}
      <div className="containers relative z-10 flex min-h-[500px] items-center justify-center py-20">
        {/* Glass Card */}
        <div className="w-full rounded-3xl border border-white/20 bg-white/10 p-8 text-center shadow-2xl backdrop-blur-xl md:p-12 lg:p-16">
          <h2 className="mb-6 text-3xl leading-tight font-medium text-white sm:text-4xl md:text-5xl">
            {t('website.NewSimfinDes.about_us.CareerCTASection.heading')}
          </h2>

          <p className="mx-auto mb-8 max-w-2xl text-base font-thin text-white/90 sm:text-base">
            {t('website.NewSimfinDes.about_us.CareerCTASection.description')}
          </p>

          <Link
            href={t('website.NewSimfinDes.about_us.CareerCTASection.ctaLink')}
            className="inline-block rounded-full border border-white/30 bg-white/20 px-8 py-3 text-base font-medium text-white backdrop-blur-md transition-all duration-300 hover:scale-105 hover:bg-white/30"
          >
            {t('website.NewSimfinDes.about_us.CareerCTASection.ctaButton')}
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CareerCTASection;
