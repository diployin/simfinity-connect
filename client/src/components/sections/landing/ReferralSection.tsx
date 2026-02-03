'use client';

import { useTranslation } from '@/contexts/TranslationContext';
import React, { useEffect, useState } from 'react';
import { Link } from 'wouter';

const ReferralSection = () => {
  const [isMobile, setIsMobile] = useState(false);

  const { t } = useTranslation();

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    // Initial check
    checkMobile();

    // Add event listener
    window.addEventListener('resize', checkMobile);

    // Cleanup
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <section className="w-full bg-white py-16 sm:py-20 lg:py-24">
      <div className="containers">
        <div className="relative overflow-hidden rounded-3xl bg-[#eef1f6]">
          <div className="grid grid-cols-1 items-center lg:grid-cols-2">
            {/* Left Side - Content */}
            <div className="relative z-10 order-1 space-y-6 p-8 sm:p-10 lg:p-16 xl:p-20">
              <h2 className="text-4.5xl leading-tight font-medium text-black">
                {t('NewSimfinDes.Referfriend.title')}
              </h2>

              <p className="max-w-md text-base leading-relaxed text-gray-700 sm:text-lg">
                {t('NewSimfinDes.Referfriend.des')}
              </p>

              <Link
                href="/referral"
                className="inline-flex items-center justify-center rounded-full border border-gray-300 bg-[#eef1f6] px-8 py-4 font-medium text-black transition-colors duration-200 hover:bg-black hover:text-white"
              >
                {t('NewSimfinDes.Referfriend.btn')}
              </Link>
            </div>

            {/* Right Side - Full Width on Mobile */}
            <div className="relative order-2 h-[400px] lg:h-[420px]">
              {/* src={isMobile ? '/images/refer-a-friend-xs.webp' : '/images/refer-a-friend-xl.webp'} */}
              <img
                src={'/images/One device. Unlimited travel freedom.png'}
                alt="Refer a friend - Friends taking selfie"
                className="rounded-2xl object-cover object-center lg:object-contain lg:object-center"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ReferralSection;
