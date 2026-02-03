import useStaticData from '@/data/useStaticData';
import React from 'react';

const SecurityHeroSection: React.FC = () => {
  const staticData = useStaticData();

  return (
    <section className="w-full overflow-hidden bg-gradient-to-b from-blue-50 via-blue-100 to-blue-200">
      {/* Image Container with Background Gradient */}
      <div className="relative min-h-[400px] sm:min-h-[450px] md:min-h-[480px] lg:min-h-[592px] xl:min-h-[683px]">
        {/* Gradient Background */}
        <div className="absolute -top-24 bottom-0 flex w-full flex-col items-center overflow-hidden bg-[linear-gradient(180deg,#E9F2FF_0%,#9FCFF2_146.48%)]">
          {/* Image Container */}
          <div className="absolute bottom-0 mx-auto flex w-full justify-center overflow-hidden">
            {/* Mobile/Tablet Image (SM Breakpoint) */}
            <div className="block sm:block md:hidden">
              <div className="relative h-[320px] w-[320px] sm:h-[350px] sm:w-[420px]">
                <img
                  // src='https://placehold.co/800x800.png'
                  src="/images/features/Safe_ravels_features.png"
                  alt="sf lp hero asset"
                  className="object-cover"
                  sizes="(max-width: 640px) 320px, 420px"
                />
              </div>
            </div>

            {/* Tablet Image (MD Breakpoint) */}
            <div className="hidden md:block lg:hidden">
              <div className="relative h-[400px] w-[480px]">
                <img
                  src="/images/features/Safe_ravels_features.png"
                  // src='/images/features/sf-lp-hero-asset.webp'
                  alt="sf lp hero asset"
                  className="object-cover"
                  sizes="626px"
                />
              </div>
            </div>

            {/* Large Tablet Image (LG Breakpoint) */}
            <div className="hidden lg:block xl:hidden">
              <div className="relative h-[450px] w-[600px]">
                <img
                  // src='/images/features/sf-lp-hero-asset.webp'
                  src="/images/features/Safe_ravels_features.png"
                  alt="sf lp hero asset"
                  className="object-cover"
                  sizes="783px"
                />
              </div>
            </div>

            {/* Desktop Image (XL Breakpoint) */}
            <div className="hidden xl:block">
              <div className="relative h-[550px] w-[750px]">
                <img
                  // src='/images/features/sf-lp-hero-asset.webp'
                  src="/images/features/Safe_ravels_features.png"
                  alt="Enjoy safer browsing with Simfinity's security features."
                  className="object-cover"
                  sizes="979px"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Text Content */}
        <div
          data-section="centered-hero"
          className="relative z-10 flex scroll-mt-20 flex-col items-center justify-center pt-12 md:pt-8 lg:pt-12 xl:scroll-mt-24"
        >
          <div>
            <div className="mx-4 sm:mx-auto">
              <div className="container mx-auto">
                <div className="relative mx-auto max-w-[768px]">
                  <div className="relative flex flex-col justify-center gap-y-2">
                    {/* Heading */}
                    <div className="flex flex-col">
                      <h1 className="lg:text-4.5xl mb-3 max-w-xs px-4 text-center text-xl leading-tight font-medium text-gray-900 sm:mb-4 sm:max-w-md sm:text-2xl md:mb-6 md:max-w-2xl md:text-3xl lg:max-w-lg">
                        {staticData.Security_Features.heroSec.title}
                      </h1>
                    </div>

                    {/* Description */}
                    <p className="m-auto mx-auto max-w-[280px] px-4 text-center text-xs leading-relaxed text-black sm:max-w-sm sm:text-sm md:max-w-md md:text-base lg:max-w-xl lg:text-base">
                      {staticData.Security_Features.heroSec.des}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SecurityHeroSection;
