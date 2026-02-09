// 'use client';

// import { useTranslation } from '@/contexts/TranslationContext';
// import { Apple } from 'lucide-react';
// import React from 'react';
// import { Link } from 'wouter';

// const DownloadAppSection = () => {
//   const { t } = useTranslation();

//   return (
//     <section className="w-full bg-white py-8 md:py-16">
//       <div className="containers">
//         <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
//           {/* Left */}
//           <div className="space-y-6 text-center md:text-start lg:space-y-8 lg:pr-2">
//             {/* Heading */}
//             <h2 className="xl:text-2.5 text-3xl leading-tight font-medium text-black sm:text-4xl lg:text-5xl">
//               {t('website.downloadAppSection.title')}
//             </h2>

//             {/* Description */}
//             <p className="max-w-lg text-base leading-relaxed text-gray-600 sm:text-base">
//               {t('website.downloadAppSection.description')}
//             </p>

//             {/* Store Buttons */}
//             <div className="flex flex-wrap gap-3">
//               <Link href="#">
//                 <img src="/images/app-store.svg" className="h-12" />
//               </Link>
//               <Link href="#">
//                 <img src="/images/google-play.svg" className="h-12" />
//               </Link>
//             </div>
//           </div>

//           {/* Right Side - Phone Image */}
//           <div className="relative flex items-center justify-center lg:justify-end">
//             <div className="relative h-[400px] w-full max-w-[600px] rounded-2xl sm:h-[450px] lg:h-[550px]">
//               {/* src='/images/download-asset-xl.webp' */}
//               <img
//                 src="/images/The Simfinity app is almost heres.png"
//                 className="max-h-[70vh] w-auto object-contain"
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
import { Apple } from 'lucide-react';
import React from 'react';
import { Link } from 'wouter';

const DownloadAppSection = () => {
  const { t } = useTranslation();

  return (
    <section className="w-full bg-white py-8 md:py-16">
      <div className="containers">
        <div className="grid grid-cols-1 items-center gap-8 md:gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left */}
          <div className="space-y-6 text-center md:text-start lg:space-y-8 lg:pr-4">
            {/* Heading */}
            <h2 className="text-2xl leading-tight font-medium text-black sm:text-3xl md:text-4xl lg:text-4xl xl:text-5xl">
              {t('website.downloadAppSection.title')}
            </h2>

            {/* Description */}
            <p className="max-w-lg text-sm leading-relaxed text-gray-600 sm:text-base md:text-lg">
              {t('website.downloadAppSection.description')}
            </p>

            {/* Store Buttons */}
            <div className="flex flex-wrap gap-3 justify-center md:justify-start">
              <Link href="#">
                <img
                  src="/images/app-store.svg"
                  className="h-10 sm:h-12"
                  alt="Download on App Store"
                />
              </Link>
              <Link href="#">
                <img
                  src="/images/google-play.svg"
                  className="h-10 sm:h-12"
                  alt="Get it on Google Play"
                />
              </Link>
            </div>
          </div>

          {/* Right Side - Phone Image */}
          <div className="relative flex items-center justify-center lg:justify-end">
            <div className="relative h-[250px] w-full max-w-[300px] sm:h-[300px] sm:max-w-[350px] md:h-[350px] md:max-w-[400px] lg:h-[450px] lg:max-w-[500px]">
              <img
                src="/images/The Simfinity app is almost heres.png"
                alt="Simfinity App Preview"
                className="h-full w-full object-contain"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DownloadAppSection;
