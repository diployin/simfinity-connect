import useStaticData from '@/data/useStaticData';
import React from 'react';

const SecurityHeroSection: React.FC = () => {
  const staticData = useStaticData();

  return (
    <section className="relative w-full h-screen overflow-hidden bg-gradient-to-b from-blue-50 via-blue-100 to-blue-200">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-[linear-gradient(180deg,#E9F2FF_0%,#9FCFF2_146.48%)]" />

      {/* Text Content - Keep original */}
      <div
        data-section="centered-hero"
        className="relative z-20 flex scroll-mt-20 flex-col items-center justify-center pt-12 md:pt-8 lg:pt-12 xl:scroll-mt-24"
      >
        <div>
          <div className="mx-4 sm:mx-auto">
            <div className="container mx-auto">
              <div className="relative mx-auto max-w-[768px]">
                <div className="relative flex flex-col justify-center gap-y-2 py-32">
                  <div className="flex flex-col">
                    <h1 className="lg:text-2.5 mb-3 max-w-xs px-4 text-center text-2.5 leading-tight font-medium text-gray-900 sm:mb-4 sm:max-w-md sm:text-2xl md:mb-6 md:max-w-2xl md:text-2.5 lg:max-w-xl">
                      {staticData.Security_Features.heroSec.title}
                    </h1>
                  </div>
                  <p className="m-auto mx-auto max-w-[280px] px-4 text-center text-sm leading-relaxed text-black sm:max-w-sm sm:text-sm md:max-w-md md:text-base lg:max-w-xl lg:text-base">
                    {staticData.Security_Features.heroSec.des}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Single Responsive Image Container */}
      <div className="absolute inset-0 z-10 flex items-end justify-center">
        <div className="relative w-full h-full flex items-end justify-center">
          <div className="relative w-full h-full flex items-end justify-center">
            <img
              src="/images/features/Safe_ravels_features.png"
              alt="Enjoy safer browsing with Simfinity's security features."
              className="max-h-[85vh] w-auto object-contain object-bottom"
              style={{
                width: 'auto',
                height: 'auto',
                maxWidth: '90%',
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default SecurityHeroSection;
