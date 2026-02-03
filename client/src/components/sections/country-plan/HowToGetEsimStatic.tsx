'use client';

import { useTranslation } from '@/contexts/TranslationContext';
import React from 'react';

interface CountryName {
  countryName?: string | null;
  image?: string | null;
}

const HowToGetEsimStatic: React.FC<CountryName> = ({ countryName, image }) => {
  const { t } = useTranslation();

  // ✅ Type-safe: Ensure countryName is always a string
  const safeCountryName = (countryName ?? 'Unknown') as string;

  return (
    <section className="w-full bg-white py-12 lg:py-16">
      <div className="containers">
        {/* Header */}
        <h2 className="mb-12 text-3xl leading-tight font-medium text-gray-900 sm:text-4xl lg:text-4xl">
          {t('NewSimfinDes.SingleCountryPlan.HowToGetEsimStatic.title', {
            countryName: safeCountryName,
          })}
        </h2>

        {/* Steps Grid - 3 Columns */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-5">
          {/* Step 1 */}
          <div className="flex flex-col overflow-hidden rounded-3xl bg-gray-100">
            <div className="flex-1 space-y-4 p-8 sm:p-6">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-base font-medium text-black shadow-md">
                1
              </div>
              <h3 className="text-xl leading-tight font-medium text-black sm:text-xl">
                {t('NewSimfinDes.SingleCountryPlan.HowToGetEsimStatic.step1.heading')}
              </h3>
              <p className="text-base leading-relaxed text-gray-600">
                {t('NewSimfinDes.SingleCountryPlan.HowToGetEsimStatic.step1.description')}
              </p>
            </div>

            <div className="relative flex h-[250px] items-center justify-center sm:h-[300px]">
              <div className="relative mt-12 h-full w-full">
                <img
                  src={'/images/setupStep/step1.png'}
                  alt="Step 1"
                  className="object-contain"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex flex-col overflow-hidden rounded-3xl bg-gray-100">
            <div className="flex-1 space-y-4 p-8 sm:p-6">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-base font-medium text-black shadow-md">
                2
              </div>
              <h3 className="text-xl leading-tight font-medium text-black sm:text-xl">
                {t('NewSimfinDes.SingleCountryPlan.HowToGetEsimStatic.step2.heading')}
              </h3>
              <p className="text-base leading-relaxed text-gray-600">
                {t('NewSimfinDes.SingleCountryPlan.HowToGetEsimStatic.step2.description')}
              </p>
            </div>

            <div className="relative flex h-[250px] items-center justify-center sm:h-[300px]">
              <div className="relative mt-12 h-full w-full">
                <img
                  src={'/images/setupStep/step2.png'}
                  alt="Step 2"
                  className="object-contain"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex flex-col overflow-hidden rounded-3xl bg-gray-100">
            <div className="flex-1 space-y-4 p-8 sm:p-6">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-base font-medium text-black shadow-md">
                3
              </div>
              <h3 className="text-xl leading-tight font-medium text-black sm:text-xl">
                {t('NewSimfinDes.SingleCountryPlan.HowToGetEsimStatic.step3.heading')}
              </h3>
              <p className="text-base leading-relaxed text-gray-600">
                {t('NewSimfinDes.SingleCountryPlan.HowToGetEsimStatic.step3.description')}
              </p>
            </div>

            <div className="relative flex h-[240px] flex-col items-center justify-center sm:h-[300px]">
              <div className="mx-4 mb-6 w-[80%] space-y-8 rounded-xl bg-white p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative h-[40px] w-[40px] shrink-0 overflow-hidden rounded-full">
                      {image ? (
                        <img
                          src={image}
                          alt={safeCountryName}
                          width={50}
                          height={100}
                          className="h-full w-full rounded-full object-cover"
                        />
                      ) : (
                        <span className="flex h-full w-full items-center justify-center bg-gray-200 text-sm font-semibold">
                          {safeCountryName.charAt(0).toUpperCase()}
                        </span>
                      )}
                    </div>
                    <span className="font-semibold text-black">{safeCountryName}</span>
                  </div>
                  <span className="inline-block rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                    {t('NewSimfinDes.SingleCountryPlan.HowToGetEsimStatic.step3.activeLabel')}
                  </span>
                </div>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>
                      {t(
                        'NewSimfinDes.SingleCountryPlan.HowToGetEsimStatic.step3.remainingDataLabel',
                      )}
                    </span>
                    <span className="font-medium text-black">
                      {t(
                        'NewSimfinDes.SingleCountryPlan.HowToGetEsimStatic.step3.remainingDataValue',
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>
                      {t('NewSimfinDes.SingleCountryPlan.HowToGetEsimStatic.step3.expiresInLabel')}
                    </span>
                    <span className="font-medium text-black">
                      {t('NewSimfinDes.SingleCountryPlan.HowToGetEsimStatic.step3.expiresInValue')}
                    </span>
                  </div>
                </div>
              </div>

              <div className="relative h-full w-full">
                <img
                  src={'/images/Frame 3466833(1)(1).svg'}
                  alt="Step 3 visualization"
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowToGetEsimStatic;
