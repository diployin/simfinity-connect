'use client';

import ThemeButton from '@/components/ThemeButton';
import { useTranslation } from '@/contexts/TranslationContext';
import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'wouter';

const ReferralSection = () => {
  const { t } = useTranslation();
  const [, navigate] = useLocation();

  return (
    <section className="w-full bg-white py-16 md:py-24 overflow-hidden">
      <div className="containers mx-auto px-4">
        <div className="relative overflow-hidden rounded-[2rem] bg-[#eef1f6] border border-gray-100 dark:border-gray-800">
          <div className="grid grid-cols-1 items-stretch lg:grid-cols-2">
            {/* Left Side - Content */}
            <div className="relative z-10 flex flex-col justify-center space-y-8 p-8 sm:p-12 lg:p-16 xl:p-20">
              <div className="space-y-4">
                <p className="text-gray-400 font-medium uppercase tracking-[0.2em] text-xs sm:text-sm">
                  Refer & Earn
                </p>
                <h2 className="text-3xl sm:text-4xl lg:text-2.5 font-medium leading-[1.1] text-gray-900 tracking-tight">
                  {t('website.heroReferfriend.title')}
                </h2>
                <p className="max-w-md text-base sm:text-lg text-gray-700 leading-relaxed font-thin">
                  {t('website.heroReferfriend.des')}
                </p>
              </div>

              {/* Action Button - Full Width */}
              <div className="w-full">
                <ThemeButton
                  onClick={() => navigate('/referral')}
                  className="w-full bg-transparent border border-primary text-primary py-3 rounded-full text-lg font-bold shadow-lg hover:shadow-primary/20 transition-all duration-300 transform hover:-translate-y-1"
                >
                  {t('website.heroReferfriend.btn')}
                </ThemeButton>
              </div>
            </div>

            {/* Right Side - Image Box */}
            <div className="relative h-[350px] sm:h-[450px] lg:h-auto min-h-[400px]">
              <img
                src={'/images/referral_modern_hero_1770800025686.png'}
                alt="Refer a friend"
                className="absolute inset-0 h-full w-full object-cover lg:object-contain object-center lg:object-right lg:p-0"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ReferralSection;
