

'use client';

import { useTranslation } from '@/contexts/TranslationContext';
import { Apple } from 'lucide-react';
import React from 'react';
import { Link } from 'wouter';

const DownloadAppSection = () => {
  const { t } = useTranslation();

  return (
    <section className="w-full bg-white py-8 md:py-16">
      <div className="containers">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left */}
          <div className="space-y-6 text-center md:text-start lg:space-y-8 lg:pr-2">
            {/* Heading */}
            <h2 className="xl:text-4.5xl text-3xl leading-tight font-medium text-black sm:text-4xl lg:text-5xl">
              {t('website.downloadAppSection.title')}
            </h2>

            {/* Description */}
            <p className="max-w-lg text-base leading-relaxed text-gray-600 sm:text-base">
              {t('website.downloadAppSection.description')}
            </p>

            {/* Store Buttons */}
            <div className="flex flex-col gap-4 sm:flex-row">
              {/* App Store */}
              <Link href="#" target="_blank">
                <div className="group flex items-center gap-2 px-5 py-3 transition-all hover:scale-[1.02]">
                  {/* Apple Icon */}
                  <img src="/images/app-store-1.svg" className="h-12" />

                  {/* <div className="flex flex-col items-start leading-tight">
                    <span className="text-[11px] text-white/70">
                      {t("website.downloadAppSection.appstoreSmall")}
                    </span>
                    <span className="text-base font-semibold text-white">
                      {t("website.downloadAppSection.appstore")}
                    </span>
                  </div> */}
                </div>
              </Link>

              {/* Google Play */}
              <Link href="#" target="_blank">
                <div className="group flex items-center gap-2 px-5 py-3 transition-all hover:scale-[1.02]">
                  {/* Play Store Icon */}

                  <img src="/images/google-play-1.svg" className="h-12" />

                  {/* <div className="flex flex-col items-start leading-tight">
                    <span className="text-[11px] text-white/70">
                      {t("website.downloadAppSection.playstoreSmall")}
                    </span>
                    <span className="text-base font-semibold text-white">
                      {t("website.downloadAppSection.playstore")}
                    </span>
                  </div> */}
                </div>
              </Link>
            </div>
          </div>

          {/* Right Image */}
          <div className="relative flex items-center justify-center lg:justify-end">
            <div className="relative h-[400px] w-full max-w-[600px] rounded-2xl sm:h-[500px] lg:h-[600px]">
              <img
                src="/images/The Simfinity app is almost heres.png"
                alt="Download Simfinity App"
                className="rounded-2xl object-contain"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DownloadAppSection;
