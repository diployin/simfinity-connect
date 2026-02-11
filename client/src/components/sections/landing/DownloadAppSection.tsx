'use client';

import { useTranslation } from '@/contexts/TranslationContext';
import { Star } from 'lucide-react';
import React from 'react';
import { Link } from 'wouter';

const DownloadAppSection = () => {
  const { t } = useTranslation();

  return (
    <section className="w-full bg-slate-50 py-16 md:py-24 lg:py-32 overflow-hidden">
      <div className="containers mx-auto px-4">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-20">
          {/* Left Content */}
          <div className="flex flex-col space-y-10 text-left order-2 lg:order-1">
            <div className="space-y-6">
              <p className="text-gray-400 font-medium uppercase tracking-[0.2em] text-xs sm:text-sm">
                Simple & Seamless
              </p>
              <h2 className="text-3xl sm:text-4xl lg:text-2.5 font-medium leading-[1.1] text-gray-900 tracking-tight">
                {t('website.downloadAppSection.title')}
              </h2>
              <p className="max-w-xl text-base md:text-lg lg:text-xl text-gray-600 leading-relaxed font-thin">
                {t('website.downloadAppSection.description')}
              </p>
            </div>

            {/* Store Buttons & Ratings */}
            <div className="space-y-6">
              <div className="flex flex-row gap-4 items-start">
                <Link href="#">
                  <img
                    src="/images/app-store.svg"
                    className="h-10 sm:h-12 w-auto transition-all hover:scale-105 active:scale-95 drop-shadow-sm"
                    alt="Download on App Store"
                  />
                </Link>
                <Link href="#">
                  <img
                    src="/images/google-play.svg"
                    className="h-10 sm:h-12 w-auto transition-all hover:scale-105 active:scale-95 drop-shadow-sm"
                    alt="Get it on Google Play"
                  />
                </Link>
              </div>
            </div>
          </div>

          {/* Right Image */}
          <div className="relative flex items-center justify-center lg:justify-end order-1 lg:order-2">
            <div className="relative w-full max-w-[500px] md:max-w-[650px] lg:max-w-[750px] transform lg:translate-x-12">
              {/* Subtle background glow */}
              <div className="absolute -inset-10 bg-primary/5 rounded-full blur-[100px] opacity-60" />
              <img
                src="/images/The Simfinity app is almost heres.png"
                alt="Simfinity App Preview"
                className="relative w-full h-auto object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.12)]"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DownloadAppSection;
