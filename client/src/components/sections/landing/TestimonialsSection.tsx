// import { useTranslation } from '@/contexts/TranslationContext';
// import React from 'react';

// interface TestimonialCardProps {
//   name: string;
//   platform?: string;
//   avatar?: string;
//   content?: string;
//   rating?: number;
//   platformBadge?: string;
// }

// const TestimonialsSection = () => {
//   const { t } = useTranslation();
//   const TestimonialCard = ({
//     name,
//     platform,
//     avatar,
//     content,
//     rating,
//     platformBadge,
//   }: TestimonialCardProps) => (
//     <div className="flex flex-col space-y-4 rounded-3xl bg-white p-2 lg:p-8">
//       <div className="flex items-center justify-between">
//         <div className="flex items-center gap-3">
//           {avatar && (
//             <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-full bg-gray-100">
//               <img
//                 src={avatar}
//                 alt={name}
//                 width={40}
//                 height={40}
//                 className="h-full w-full object-cover"
//               />
//             </div>
//           )}
//           <span className="text-base font-normal text-gray-900">{name}</span>
//         </div>

//         {/* {platformBadge} */}
//         {platformBadge && (
//           <div className="h-10 w-10 flex-shrink-0">
//             <img
//               src={platformBadge}
//               alt={name}
//               width={100}
//               height={100}
//               className="object-cover object-center"
//             />
//           </div>
//         )}
//       </div>

//       {/* Content */}
//       <p className="text-sm leading-relaxed font-normal text-gray-600">{content}</p>

//       {/* Rating */}
//       {rating && (
//         <div className="flex items-center gap-1">
//           <span className="text-sm font-normal text-gray-900">{rating}</span>
//           {[...Array(5)].map((_, i) => (
//             <svg
//               key={i}
//               className="h-4 w-4 text-yellow-400"
//               fill="currentColor"
//               viewBox="0 0 20 20"
//             >
//               <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
//             </svg>
//           ))}
//         </div>
//       )}
//     </div>
//   );

//   return (
//     <section className="bg-sky-100 w-full py-16 sm:py-20 lg:py-24">
//       <div className="containers">
//         {/* Header */}
//         <div className="mb-12 text-center lg:mb-16  mx-auto">
//           <h2 className="lg:text-5xl mb-4 text-3xl leading-tight font-medium text-black sm:text-4xl">
//             {/* {t('NewSimfinDes.SingleCountryPlan.TestimonialsSection.title')} */}
//             Simfinity reviews from travelers” to - Real travelers. Real experiences. Real Simfinity.
//           </h2>
//           <p className="text-base font-normal text-gray-600 sm:text-lg">
//             {/* {t('NewSimfinDes.SingleCountryPlan.TestimonialsSection.des')} */}
//             Watch quick video reviews from global travelers who use Simfinity on every trip.
//           </p>
//         </div>

//         {/* 4-Column Grid Layout */}
//         <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
//           {/* Column 1 - Left */}
//           <div className="flex flex-col gap-6">
//             <TestimonialCard
//               name="Jorge A."
//               platformBadge="/images/Trustpilot_logo.svg"
//               content="Easy, cheap and fast. Easy step to step setup and troubleshooting, super fast speed (around 100 mbps). Cheap, great coverage and helpful chat/assistance. Keep up the good work."
//               rating={5}
//             />
//             <TestimonialCard
//               name="PewDiePie"
//               avatar="/images/pewdiepie.png"
//               platformBadge="/images/youtube-logo.svg"
//               content="I can set it up at home right now, activate it when I'm ready (it takes literally just a couple of minutes, I've tried it myself), and boom! I have internet on my phone when traveling, as it should be... So I recommend checking out Simfinity next time you're traveling — it's a must!"
//             />
//           </div>

//           {/* Column 2 - Center-Left (Highlight Card) */}
//           <div className="mt-10 flex flex-col gap-6">
//             <div className="flex min-h-[400px] flex-col justify-center space-y-6 rounded-3xl bg-white p-8 md:min-h-[600px] lg:p-10">
//               <p className="text-lg leading-relaxed font-normal text-black lg:text-xl">
//                 {' '}
//                 <span className="text-6xl leading-none text-black">"</span> Simfinity is an
//                 affordable, easy-to-use, and sustainable eSIM service that gives reliable mobile and
//                 internet connections from anywhere in the world. That's why we recommend Simfinity
//                 as our eSIM partner.
//               </p>
//               <img
//                 src="/images/Trustpilot_logo.svg"
//                 alt="Lonely Planet"
//                 width={120}
//                 height={30}
//                 className="md:mt-auto"
//               />
//             </div>
//           </div>

//           {/* Column 3 - Center-Right */}
//           <div className="flex flex-col gap-6">
//             <TestimonialCard
//               name="DutchPilotGirl"
//               platformBadge="/images/youtube-logo.svg"
//               avatar="/images/dutchpilotgirl.webp"
//               content="There's so much you can't do abroad without a proper internet connection. Simfinity takes care of everything. It's simple to buy and easy to install. I love it."
//             />
//             <TestimonialCard
//               name="Domas R."
//               platformBadge="/images/Trustpilot_logo.svg"
//               content="Awesome — used Simfinity across 3 countries already (UK, Netherlands and Belgium). Took me like 1min to buy esim and activate it. My internet was way better than my friends' who remained connected to their local providers and used roaming plans instead."
//               rating={5}
//             />
//           </div>

//           {/* Column 4 - Right */}
//           <div className="mt-18 flex flex-col gap-6">
//             <TestimonialCard
//               name="cybernews"
//               platformBadge="/images/Trustpilot_logo.svg"
//               content="With comprehensive coverage and affordable prices, Simfinity is the best eSIM for Europe. Activating Simfinity is straightforward. Download the app, choose your plan, and surf the internet. You can contact the Simfinity customer support team via live chat or email if you encounter any issues."
//             />
//             <TestimonialCard
//               name="TechRadar"
//               platformBadge="/images/Trustpilot_logo.svg"
//               content="As a product backed by the reputable NordVPN brand, Simfinity benefits from the company's focus on security and privacy. Users praise its easy installation process, affordable pricing, and reliable coverage across the world."
//             />
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default TestimonialsSection;

import { useTranslation } from '@/contexts/TranslationContext';
import React from 'react';

interface TestimonialCardProps {
  name: string;
  platform?: string;
  avatar?: string;
  content?: string;
  rating?: number;
  platformBadge?: string;
}

const TestimonialsSection = () => {
  const { t } = useTranslation();

  const TestimonialCard = ({
    name,
    platform,
    avatar,
    content,
    rating,
    platformBadge,
  }: TestimonialCardProps) => (
    <div className="flex flex-col space-y-4 rounded-3xl bg-white p-2 lg:p-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {avatar && (
            <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-full bg-gray-100">
              <img
                src={avatar}
                alt={name}
                width={40}
                height={40}
                className="h-full w-full object-cover"
              />
            </div>
          )}
          <span className="text-base font-normal text-gray-900">{name}</span>
        </div>

        {platformBadge && (
          <div className="h-10 w-10 flex-shrink-0">
            <img
              src={platformBadge}
              alt={name}
              width={100}
              height={100}
              className="object-cover object-center"
            />
          </div>
        )}
      </div>

      <p className="text-sm font-normal leading-relaxed text-gray-600">{content}</p>

      {rating && (
        <div className="flex items-center gap-1">
          <span className="text-sm font-normal text-gray-900">{rating}</span>
          {[...Array(5)].map((_, i) => (
            <svg
              key={i}
              className="h-4 w-4 text-yellow-400"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <section className="w-full bg-primary py-16 sm:py-20 lg:py-24">
      <div className="containers">
        {/* Header */}
        <div className="mx-auto mb-12 text-center lg:mb-16">
          <h2 className="mb-4 text-3xl font-medium leading-tight text-white sm:text-4xl lg:text-5xl">
            {t('website.NewSimfinDes.TestimonialsSection.title')}
          </h2>
          <p className="text-base font-normal text-gray-100 sm:text-lg">
            {t('website.NewSimfinDes.TestimonialsSection.des')}
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {/* Column 1 */}
          <div className="flex flex-col gap-6">
            <TestimonialCard
              name="Jorge A."
              platformBadge="/images/Trustpilot_logo.svg"
              content={t('website.NewSimfinDes.TestimonialsSection.review1')}
              rating={5}
            />
            <TestimonialCard
              name="PewDiePie"
              avatar="/images/pewdiepie.png"
              platformBadge="/images/youtube-logo.svg"
              content={t('website.NewSimfinDes.TestimonialsSection.review2')}
            />
          </div>

          {/* Column 2 – Highlight */}
          <div className="mt-10 flex flex-col gap-6">
            <div className="flex min-h-[400px] flex-col justify-center space-y-6 rounded-3xl bg-white p-8 md:min-h-[600px] lg:p-10">
              <p className="text-lg font-normal leading-relaxed text-black lg:text-xl">
                <span className="text-6xl leading-none text-black">"</span>{' '}
                {t('website.NewSimfinDes.TestimonialsSection.review3')}
              </p>
              <img
                src="/images/Trustpilot_logo.svg"
                alt="Trustpilot"
                width={120}
                height={30}
                className="md:mt-auto"
              />
            </div>
          </div>

          {/* Column 3 */}
          <div className="flex flex-col gap-6">
            <TestimonialCard
              name="DutchPilotGirl"
              avatar="/images/dutchpilotgirl.webp"
              platformBadge="/images/youtube-logo.svg"
              content={t('website.NewSimfinDes.TestimonialsSection.review4')}
            />
            <TestimonialCard
              name="Domas R."
              platformBadge="/images/Trustpilot_logo.svg"
              content={t('website.NewSimfinDes.TestimonialsSection.review5')}
              rating={5}
            />
          </div>

          {/* Column 4 */}
          <div className="flex flex-col gap-6">
            <TestimonialCard
              name="Cybernews"
              platformBadge="/images/Trustpilot_logo.svg"
              content={t('website.NewSimfinDes.TestimonialsSection.review6')}
            />
            <TestimonialCard
              name="TechRadar"
              platformBadge="/images/Trustpilot_logo.svg"
              content={t('website.NewSimfinDes.TestimonialsSection.review7')}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
