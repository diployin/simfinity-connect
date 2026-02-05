// 'use client';

// import React from 'react';

// import ThemeButton from '@/components/ThemeButton';
// import { useTranslation } from '@/contexts/TranslationContext';
// import { useLocation } from 'wouter';

// const InstantConnectionSection = () => {
//   const [, navigate] = useLocation();
//   const { t } = useTranslation();

//   return (
//     <section className="w-full bg-white py-8 sm:py-20 lg:py-24">
//       <div className="containers">
//         {/* Header */}
//         <div className="mb-12 text-center sm:mb-16">
//           <h2 className="mx-auto mb-6 max-w-5xl text-3xl leading-tight font-normal text-black sm:text-4xl lg:text-5xl xl:text-5xl">
//             {/* {t('NewSimfinDes.NewSimfinDes.title')} */}
//             Instant connection, zero travel stress, only with Simfinity
//           </h2>
//           <p className="mx-auto mb-8 max-w-4xl text-base text-gray-600 sm:text-lg lg:text-base">
//             {/* {t('NewSimfinDes.NewSimfinDes.des')} */}
//             Traveling should be fun, not frustrating. Simfinity keeps you online instantly,
//             anywhere.
//           </p>
//           <ThemeButton onClick={() => navigate('/all-destinations')} size="md">
//             {/* {t('NewSimfinDes.NewSimfinDes.btn')} */}
//             View All Destinations
//           </ThemeButton>
//         </div>

//         {/* Two Column Cards */}

//         <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-8">
//           {/* Card 1 - Connect Instantly */}
//           <div className="relative flex min-h-[650px] flex-col overflow-hidden rounded-3xl bg-gray-100 sm:min-h-[850px]">
//             {/* Text Content at Top */}
//             <div className="space-y-4 bg-gray-100 p-8 sm:p-10 lg:p-12">
//               <h3 className="text-2xl font-normal text-black sm:text-3xl lg:text-4xl">
//                 {/* {t('NewSimfinDes.NewSimfinDes.card1.title')} */}
//                 Never ask ‘WiFi password?’ again
//               </h3>
//               <p className="text-base leading-relaxed text-gray-600 sm:text-lg">
//                 {/* {t('NewSimfinDes.NewSimfinDes.card1.des')} */}
//                 Simfinity keeps you online from the moment you land — no searching for cafés, no
//                 begging for hotspots, and no relying on slow public WiFi.
//               </p>
//             </div>

//             {/* Image Section with Badge Overlay */}
//             <div className="relative w-full flex-1">
//               <img
//                 // src='https://placehold.co/400x600.png'
//                 src="/images/By_Simfinitys.png"
//                 alt="Connect instantly - Travel destinations"
//                 className="object-cover object-center"
//                 sizes="(max-width: 1024px) 100vw, 50vw"
//               />
//             </div>
//           </div>

//           {/* Card 2 - Avoid Waiting in Line */}
//           <div className="relative flex min-h-[650px] flex-col overflow-hidden rounded-3xl bg-[#A8D5F2] sm:min-h-[850px]">
//             {/* Text Content at Top */}
//             <div className="space-y-4 bg-[#A8D5F2] p-8 sm:p-10 lg:p-12">
//               <h3 className="text-2xl font-normal text-black sm:text-3xl lg:text-4xl">
//                 {/* {t('NewSimfinDes.NewSimfinDes.card2.title')} */}
//                 No more SIM card drama
//               </h3>
//               <p className="text-base leading-relaxed text-gray-700 sm:text-lg pb-5">
//                 {/* {t('NewSimfinDes.NewSimfinDes.card2.des')} */}
//                 Skip the hassle of finding SIM shops, swapping tiny cards, or carrying ejector pins.
//                 With Simfinity eSIM, everything is digital — activate once, travel freely, and enjoy
//                 stress-free connectivity on every trip.
//               </p>
//             </div>

//             {/* Image Section with Plan Options Overlay */}
//             <div className="relative w-full flex-1">
//               {/* src='/images/homepage-display-tile-2.webp' */}
//               <img
//                 src="/images/No more SIM card drama.png"
//                 // src='https://placehold.co/400x600.png'
//                 alt="Avoid waiting in line - Woman with phone"
//                 className="object-cover object-center"
//                 sizes="(max-width: 1024px) 100vw, 50vw"
//               />
//             </div>
//           </div>
//         </div>

//         {/* Stay protected online */}

//         {/* Stay Protected Online Section */}
//         <div className="relative mt-6 overflow-hidden rounded-3xl bg-gradient-to-br from-gray-50 to-gray-100 lg:mt-8">
//           <div className="grid h-full grid-cols-1 lg:grid-cols-2">
//             {/* Left Side - Text Content */}
//             <div className="flex flex-col justify-center space-y-6 p-8 text-center sm:p-10 md:text-start lg:p-14 xl:p-16">
//               <h3 className="text-2xl leading-tight font-normal text-black sm:text-3xl lg:text-4xl xl:text-5xl">
//                 {/* {t('NewSimfinDes.NewSimfinDes.card3.title')} */}
//                 Travel with privacy, powered by Simfinity
//               </h3>
//               <p className="max-w-lg text-base leading-relaxed text-gray-600 sm:text-lg">
//                 {/* {t('NewSimfinDes.NewSimfinDes.card3.des')} */}
//                 Whether you're booking hotels, using public WiFi, or exploring new cities, your data
//                 stays protected with Simfinity. Every eSIM connection is encrypted, secure, and
//                 keeps your online activity private — no matter which country you visit. Travel
//                 freely knowing your connection is always safe.
//               </p>
//               <div>
//                 <ThemeButton
//                   variant="default"
//                   className="bg-themeYellow hover:themeYellowHover inline-flex w-max items-center justify-center rounded-full border border-gray-300 px-8 py-4 font-medium text-white transition-colors duration-200"
//                 >
//                   {/* {t('NewSimfinDes.NewSimfinDes.card3.btn')} */}
//                   See how
//                 </ThemeButton>
//               </div>
//             </div>

//             {/* Right Side - Phone Mockup (large & bottom touch) */}
//             <div className="relative flex h-full items-end justify-end overflow-hidden">
//               <div className="relative h-[95%] w-full max-w-[450px] sm:max-w-[500px] lg:max-w-[550px]">
//                 {/* src='/images/homepage-display-tile-3.webp' */}
//                 <img
//                   // src='https://placehold.co/600x600.png'
//                   src="/images/By_Simfinitys.png"
//                   alt="Stay protected online - Phone security features"
//                   className="rounded-2xl object-cover object-bottom"
//                   sizes="(max-width: 1024px) 100vw, 50vw"
//                 />
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default InstantConnectionSection;

'use client';

import React from 'react';

import ThemeButton from '@/components/ThemeButton';
import { useTranslation } from '@/contexts/TranslationContext';
import { useLocation } from 'wouter';

const InstantConnectionSection = () => {
  const [, navigate] = useLocation();
  const { t } = useTranslation();

  return (
    <section className="w-full bg-white py-8 sm:py-20 lg:py-24">
      <div className="containers">
        {/* Header */}
        <div className="mb-12 text-center sm:mb-16">
          <h2 className="mx-auto mb-6 max-w-5xl text-3xl font-normal leading-tight text-black sm:text-4xl lg:text-5xl xl:text-5xl">
            {t('website.NewSimfinDes.NewSimfinDes.title')}
          </h2>

          <p className="mx-auto mb-8 max-w-4xl text-base text-gray-600 sm:text-lg lg:text-base">
            {t('website.NewSimfinDes.NewSimfinDes.des')}
          </p>

          <ThemeButton onClick={() => navigate('/all-destinations')} size="md">
            {t('website.NewSimfinDes.NewSimfinDes.btn')}
          </ThemeButton>
        </div>

        {/* Two Column Cards */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-8">
          {/* Card 1 */}
          <div className="relative flex min-h-[650px] flex-col overflow-hidden rounded-3xl bg-gray-100 sm:min-h-[850px]">
            <div className="space-y-4 p-8 sm:p-10 lg:p-12">
              <h3 className="text-2xl font-normal text-black sm:text-3xl lg:text-4xl">
                {t('website.NewSimfinDes.NewSimfinDes.card1.title')}
              </h3>
              <p className="text-base leading-relaxed text-gray-600 sm:text-lg">
                {t('website.NewSimfinDes.NewSimfinDes.card1.des')}
              </p>
            </div>

            <div className="relative w-full flex-1">
              <img
                src="/images/By_Simfinitys.png"
                alt="Connect instantly - Travel destinations"
                className="object-cover object-center"
              />
            </div>
          </div>

          {/* Card 2 */}
          <div className="relative flex min-h-[650px] flex-col overflow-hidden rounded-3xl bg-[#A8D5F2] sm:min-h-[850px]">
            <div className="space-y-4 p-8 sm:p-10 lg:p-12">
              <h3 className="text-2xl font-normal text-black sm:text-3xl lg:text-4xl">
                {t('website.NewSimfinDes.NewSimfinDes.card2.title')}
              </h3>
              <p className="pb-5 text-base leading-relaxed text-gray-700 sm:text-lg">
                {t('website.NewSimfinDes.NewSimfinDes.card2.des')}
              </p>
            </div>

            <div className="relative w-full flex-1">
              <img
                src="/images/No more SIM card drama.png"
                alt="Avoid waiting in line - Woman with phone"
                className="object-cover object-center"
              />
            </div>
          </div>
        </div>

        {/* Stay Protected Online */}
        <div className="relative mt-6 overflow-hidden rounded-3xl bg-gradient-to-br from-gray-50 to-gray-100 lg:mt-8">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <div className="flex flex-col justify-center space-y-6 p-8 text-center sm:p-10 md:text-start lg:p-14 xl:p-16">
              <h3 className="text-2xl font-normal leading-tight text-black sm:text-3xl lg:text-4xl xl:text-5xl">
                {t('website.NewSimfinDes.NewSimfinDes.card3.title')}
              </h3>

              <p className="max-w-lg text-base leading-relaxed text-gray-600 sm:text-lg">
                {t('website.NewSimfinDes.NewSimfinDes.card3.des')}
              </p>

              <ThemeButton
                variant="default"
                className="bg-themeYellow hover:themeYellowHover w-max rounded-full border border-gray-300 px-8 py-4 font-medium text-white"
              >
                {t('website.NewSimfinDes.NewSimfinDes.card3.btn')}
              </ThemeButton>
            </div>

            <div className="relative flex items-end justify-end">
              <div className="relative h-[95%] w-full max-w-[550px]">
                <img
                  src="/images/By_Simfinitys.png"
                  alt="Stay protected online - Phone security features"
                  className="rounded-2xl object-cover object-bottom"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InstantConnectionSection;
