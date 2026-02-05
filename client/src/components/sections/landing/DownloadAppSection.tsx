// 'use client';

// import { useTranslation } from '@/contexts/TranslationContext';
// import React from 'react';
// import { Link } from 'wouter';

// const DownloadAppSection = () => {
//   const { t } = useTranslation();
//   return (
//     <section className="w-full bg-white py-8 md:py-16">
//       <div className="containers">
//         <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
//           {/* Left Side - Content */}
//           <div className="space-y-6 text-center md:text-start lg:space-y-8 lg:pr-2">
//             {/* Trustpilot Badge */}
//             <div className="bg-primary flex w-fit items-center gap-2 rounded-lg px-3 py-2">
//               {/* <span className="font-medium text-white">Coming soon</span> */}

//               {/* <Image
//                                 src='/images/Trustpilot_logo.svg'
//                                 alt=''
//                                 width={100}
//                                 height={70}
//                                 className='mt-3 h-10'
//                             /> */}
//             </div>

//             {/* Main Heading */}
//             <h2 className="xl:text-4.5xl text-3xl leading-tight font-medium text-black sm:text-4xl lg:text-5xl">
//               {/* {t('NewSimfinDes.DownloadAppSection.title')} */}
//               The Simfinity app is almost here
//             </h2>

//             {/* Description */}
//             <p className="max-w-lg text-base leading-relaxed text-gray-600 sm:text-base">
//               {/* {t('NewSimfinDes.DownloadAppSection.des')} */}A smarter, faster way to manage your
//               eSIM — launching soon on iOS and Android.
//             </p>

//             {/* App Store Buttons */}
//             <div className="flex flex-col gap-4 sm:flex-row">
//               {/* App Store Button */}
//               <Link href="#" target="_blank" className="inline-block">
//                 <div className="flex items-center gap-3 rounded-xl bg-black px-2 py-2 transition-colors hover:bg-gray-800">
//                   <svg className="h-8 w-8 text-white" fill="currentColor" viewBox="0 0 24 24">
//                     <path d="M18.71 19.5C17.88 20.74 17 21.95 15.66 21.97C14.32 22 13.89 21.18 12.37 21.18C10.84 21.18 10.37 21.95 9.09997 22C7.78997 22.05 6.79997 20.68 5.95997 19.47C4.24997 17 2.93997 12.45 4.69997 9.39C5.56997 7.87 7.12997 6.91 8.81997 6.88C10.1 6.86 11.32 7.75 12.11 7.75C12.89 7.75 14.37 6.68 15.92 6.84C16.57 6.87 18.39 7.1 19.56 8.82C19.47 8.88 17.39 10.1 17.41 12.63C17.44 15.65 20.06 16.66 20.09 16.67C20.06 16.74 19.67 18.11 18.71 19.5M13 3.5C13.73 2.67 14.94 2.04 15.94 2C16.07 3.17 15.6 4.35 14.9 5.19C14.21 6.04 13.07 6.7 11.95 6.61C11.8 5.46 12.36 4.26 13 3.5Z" />
//                   </svg>
//                   <div className="flex flex-col items-start">
//                     <span className="text-xs text-white/80">Download on the</span>
//                     <span className="text-lg font-semibold text-white">App Store</span>
//                   </div>
//                 </div>
//               </Link>

//               {/* Google Play Button */}
//               <Link href="#" target="_blank" className="inline-block">
//                 <div className="flex items-center gap-3 rounded-xl bg-black px-2 py-2 transition-colors hover:bg-gray-800">
//                   <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none">
//                     <defs>
//                       <linearGradient id="playStoreGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
//                         <stop offset="0%" stopColor="#00D7FF" />
//                         <stop offset="100%" stopColor="#0084FF" />
//                       </linearGradient>
//                       <linearGradient id="playStoreGradient2" x1="0%" y1="0%" x2="100%" y2="0%">
//                         <stop offset="0%" stopColor="#FFD500" />
//                         <stop offset="100%" stopColor="#FF9500" />
//                       </linearGradient>
//                       <linearGradient id="playStoreGradient3" x1="0%" y1="100%" x2="0%" y2="0%">
//                         <stop offset="0%" stopColor="#FF0844" />
//                         <stop offset="100%" stopColor="#FF5B00" />
//                       </linearGradient>
//                       <linearGradient id="playStoreGradient4" x1="100%" y1="100%" x2="0%" y2="0%">
//                         <stop offset="0%" stopColor="#00E082" />
//                         <stop offset="100%" stopColor="#00DA3C" />
//                       </linearGradient>
//                     </defs>
//                     <path
//                       d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5"
//                       fill="url(#playStoreGradient1)"
//                     />
//                     <path
//                       d="M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12"
//                       fill="url(#playStoreGradient2)"
//                     />
//                     <path
//                       d="M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81"
//                       fill="url(#playStoreGradient3)"
//                     />
//                     <path
//                       d="M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66"
//                       fill="url(#playStoreGradient4)"
//                     />
//                   </svg>

//                   <div className="flex flex-col items-start">
//                     <span className="text-xs text-white/80">GET IT ON</span>
//                     <span className="text-lg font-semibold text-white">Google Play</span>
//                   </div>
//                 </div>
//               </Link>
//             </div>

//             {/* Ratings */}
//             {/* <div className="flex flex-col gap-6 sm:flex-row sm:gap-12">
//               <div className="space-y-1">
//                 <div className="flex items-center gap-2">
//                   <svg className="h-5 w-5 text-black" fill="currentColor" viewBox="0 0 20 20">
//                     <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
//                   </svg>
//                   <span className="text-base font-semibold text-black">4.7 rating</span>
//                 </div>
//                 <p className="text-sm font-medium text-gray-600">(35,487+) reviews</p>
//               </div>

//               <div className="space-y-1">
//                 <div className="flex items-center gap-2">
//                   <svg className="h-5 w-5 text-black" fill="currentColor" viewBox="0 0 20 20">
//                     <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
//                   </svg>
//                   <span className="text-base font-semibold text-black">4.7 rating</span>
//                 </div>
//                 <p className="text-sm font-medium text-gray-600">(61,942+) reviews</p>
//               </div>
//             </div> */}
//           </div>

//           {/* Right Side - Phone Image */}
//           <div className="relative flex items-center justify-center lg:justify-end">
//             <div className="relative h-[400px] w-full max-w-[600px] rounded-2xl sm:h-[500px] lg:h-[600px]">
//               {/* src='/images/download-asset-xl.webp' */}
//               <img
//                 src="/images/The Simfinity app is almost heres.png"
//                 // src='https://placehold.co/800x800.png'
//                 alt="Download Simfinity eSIM app - Phone with QR code"
//                 className="rounded-2xl object-contain"
//                 sizes="(max-width: 1024px) 100vw, 50vw"
//               />
//             </div>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default DownloadAppSection;








'use client';

import { useTranslation } from '@/contexts/TranslationContext';
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
                <div className="flex items-center gap-3 rounded-xl bg-black px-2 py-2">
                  <div className="flex flex-col items-start">
                    <span className="text-xs text-white/80">
                      {t('website.downloadAppSection.appstoreSmall')}
                    </span>
                    <span className="text-lg font-semibold text-white">
                      {t('website.downloadAppSection.appstore')}
                    </span>
                  </div>
                </div>
              </Link>

              {/* Google Play */}
              <Link href="#" target="_blank">
                <div className="flex items-center gap-3 rounded-xl bg-black px-2 py-2">
                  <div className="flex flex-col items-start">
                    <span className="text-xs text-white/80">
                      {t('website.downloadAppSection.playstoreSmall')}
                    </span>
                    <span className="text-lg font-semibold text-white">
                      {t('website.downloadAppSection.playstore')}
                    </span>
                  </div>
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

