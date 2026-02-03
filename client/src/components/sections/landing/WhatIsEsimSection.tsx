import React from 'react';

import useStaticData from '@/data/useStaticData';
import { useTranslation } from '@/contexts/TranslationContext';

const WhatIsEsimSection = () => {
  const { t } = useTranslation();

  const staticData = useStaticData();
  return (
    <section className="w-full py-4 md:py-6 lg:py-8">
      <div className="containers">
        <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-12 xl:gap-16">
          {/* Left Side - Image/Illustration */}
          <div className="order-2 flex items-center justify-center lg:order-1 lg:justify-start">
            <div className="relative aspect-[4/3] w-full max-w-[500px] lg:max-w-[600px]">
              <img
                src="/images/homepage-what-is-esim.png"
                alt="eSIM illustration"
                className="w-full h-full object-contain"
                loading="lazy"
              />
            </div>
          </div>

          {/* Right Side - Content */}
          <div className="order-1 flex flex-col space-y-6 lg:order-2">
            <h2 className="text-xl leading-tight font-normal text-black sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl">
              {/* {staticData.WhatIsEsimSectionData.title} */}
              {/* {t('NewSimfinDes.whatIsEsimNew.whatEsim')} */}
              Still buying physical SIM cards?
            </h2>

            <p className="text-base leading-relaxed text-gray-700 opacity-90 sm:text-base md:text-base">
              {/* {staticData.WhatIsEsimSectionData.description.split(' ')[0]}{' '} */}
              {/* {t('NewSimfinDes.whatIsEsimNew.An')} */}
              {/* <span className='font-semibold text-black underline decoration-2 underline-offset-4'>
                                {' '}
                                {staticData.WhatIsEsimSectionData.description.split(' ')[1]}
                            </span>{' '} */}
              &nbsp;
              {/* {staticData.WhatIsEsimSectionData.description.split(' ').slice(2).join(' ')} */}
              {/* {t('NewSimfinDes.whatIsEsimNew.para')} */}
              That’s old-school! Meet the eSIM — a smart digital SIM already built into your phone
              that lets you activate mobile data instantly without buying or changing any physical
              SIM cards. No shops, no plastic, no swapping — just scan, connect, and enjoy fast,
              reliable internet in seconds. With Simfinity, staying online while traveling becomes
              effortless, flexible, and 100% hassle-free.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhatIsEsimSection;
