import React from 'react';

const TestHeroSection = () => {
  return (
    <div className="relative">
      <div className="absolute -top-[72px] bottom-0 w-full flex flex-col items-center overflow-hidden bg-gradient-hero">
        <div className="absolute bottom-0 min-w-[1038px] md:min-w-[1153px] lg:min-w-[1372px] xl:min-w-[1716px] md:translate-x-[18%] lg:translate-x-[21%] xl:translate-x-[23%]">
          <div>
            <picture>
              <img
                alt="The Saily international eSIM app."
                loading="eager"
                width="1716"
                height="908"
                decoding="async"
                style={{ color: 'transparent' }}
                srcSet="/images/sf-homepage-hero-asset.webp"
                src="/images/sf-homepage-hero-asset.webp"
              />
            </picture>
          </div>
        </div>
      </div>

      <div
        data-section="Hero"
        data-testid="section-Hero"
        className="relative scroll-mt-20 xl:scroll-mt-24"
      >
        <div>
          <div className="mx-4 sm:mx-auto">
            <div className="container mx-auto">
              <div className="md:flex flex-col justify-center py-16 max-md:pb-[404px] md:max-w-[370px] lg:max-w-[540px] xl:max-w-[680px] min-h-[743px] md:min-h-[480px] lg:min-h-[592px] xl:min-h-[683px]">
                <div className="h-full w-full flex group/stack flex-col text-start justify-start gap-y-6 items-stretch">
                 
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestHeroSection;
