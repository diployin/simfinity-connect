// import { useTranslation } from '@/contexts/TranslationContext';
// import React from 'react';

// interface Step {
//   id: number;
//   title: string;
//   description: string;
//   image: string;
// }

// const HowDoesItWorkSection = () => {
//   const { t } = useTranslation();
//   const steps: Step[] = [
//     {
//       id: 1,
//       title: 'Better value for every trip',
//       description:
//         'Simfinity gives you the lowest travel data costs with no hidden fees — perfect for short trips, business travel, and long adventures.',
//       image: '/images/setupStep/Better value for every trip 2.png', // Radio button selection mockup
//     },
//     {
//       id: 2,
//       title: 'Coverage that reaches further',
//       description:
//         'We partner with top networks worldwide to give you stronger, faster data even in remote or challenging locations.',
//       // image: 'https://placehold.co/600x600.png'
//       image: '/images/setupStep/Coverage that reaches further.png',
//     },
//     {
//       id: 3,
//       title: 'Designed for real travelers',
//       description:
//         'Built for tourists, backpackers, business flyers, digital nomads, and global movers — Simfinity keeps you connected wherever your journey takes you.',
//       // image: 'https://placehold.co/600x600.png'
//       image: '/images/setupStep/Designed for real travelers.png',
//     },
//   ];
//   // const steps: Step[] = [
//   //   {
//   //     id: 1,
//   //     title: t('NewSimfinDes.NewSimfinWorkDes.card1.title'),
//   //     description: t('NewSimfinDes.NewSimfinWorkDes.card1.des'),
//   //     image: '/images/setupStep/Better value for every trip 2.png', // Radio button selection mockup
//   //   },
//   //   {
//   //     id: 2,
//   //     title: t('NewSimfinDes.NewSimfinWorkDes.card2.title'),
//   //     description: t('NewSimfinDes.NewSimfinWorkDes.card2.des'),
//   //     // image: 'https://placehold.co/600x600.png'
//   //     image: '/images/setupStep/Coverage that reaches further.png',
//   //   },
//   //   {
//   //     id: 3,
//   //     title: t('NewSimfinDes.NewSimfinWorkDes.card3.title'),
//   //     description: t('NewSimfinDes.NewSimfinWorkDes.card3.des'),
//   //     // image: 'https://placehold.co/600x600.png'
//   //     image: '/images/setupStep/Designed for real travelers.png',
//   //   },
//   // ];

//   return (
//     <section className="w-full bg-white py-8 sm:py-20 lg:py-20">
//       <div className="containers">
//         {/* Header */}
//         <div className="text mb-12 text-center sm:mb-16 md:text-start">
//           <p className="mb-3 text-sm font-normal text-gray-400 sm:text-base">
//             {/* {t('NewSimfinDes.NewSimfinWorkDes.subTitle')} */}
//             Why Simfinity stands out
//           </p>
//           <h2 className="xl:text-4.5xl mb-6 text-3xl leading-tight font-medium text-black sm:text-4xl lg:text-5xl">
//             {/* {t('NewSimfinDes.NewSimfinWorkDes.title')} */}A smarter choice for global travelers
//           </h2>
//           <p className="text-base text-gray-600 sm:text-lg">
//             {/* {t('NewSimfinDes.NewSimfinWorkDes.des')} */}
//             More coverage, better prices, and features that actually make sense.
//           </p>
//         </div>

//         {/* Steps Grid */}
//         <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-5">
//           {steps.map((step) => (
//             <div key={step.id} className="flex flex-col overflow-hidden rounded-3xl bg-gray-100">
//               {/* Text Section - Top Half */}
//               <div className="flex-1 space-y-4 p-8 sm:p-6">
//                 <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-base font-medium text-black shadow-md">
//                   {step.id}
//                 </div>

//                 <h3 className="text-xl leading-tight font-medium text-black sm:text-xl">
//                   {step.title}
//                 </h3>
//                 <p className="text-base leading-relaxed text-gray-600">{step.description}</p>
//               </div>

//               {/* Image Section - Bottom Half */}
//               <div className="relative flex h-[250px] items-center justify-center sm:h-[300px]">
//                 <div className="relative h-full w-full">
//                   <img
//                     src={step.image}
//                     alt={step.title}
//                     className="object-contain"
//                     sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
//                   />
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// };

// export default HowDoesItWorkSection;







import { useTranslation } from '@/contexts/TranslationContext';
import React from 'react';

interface Step {
  id: number;
  title: string;
  description: string;
  image: string;
}

const HowDoesItWorkSection = () => {
  const { t } = useTranslation();

  const steps: Step[] = [
    {
      id: 1,
      title: t('website.NewSimfinDes.NewSimfinWorkDes.card1.title'),
      description: t('website.NewSimfinDes.NewSimfinWorkDes.card1.des'),
      image: '/images/setupStep/Better value for every trip 2.png',
    },
    {
      id: 2,
      title: t('website.NewSimfinDes.NewSimfinWorkDes.card2.title'),
      description: t('website.NewSimfinDes.NewSimfinWorkDes.card2.des'),
      image: '/images/setupStep/Coverage that reaches further.png',
    },
    {
      id: 3,
      title: t('website.NewSimfinDes.NewSimfinWorkDes.card3.title'),
      description: t('website.NewSimfinDes.NewSimfinWorkDes.card3.des'),
      image: '/images/setupStep/Designed for real travelers.png',
    },
  ];

  return (
    <section className="w-full bg-white py-8 sm:py-20 lg:py-20">
      <div className="containers">
        {/* Header */}
        <div className="mb-12 text-center sm:mb-16 md:text-start">
          <p className="mb-3 text-sm font-normal text-gray-400 sm:text-base">
            {t('website.NewSimfinDes.NewSimfinWorkDes.subTitle')}
          </p>

          <h2 className="mb-6 text-3xl font-medium leading-tight text-black sm:text-4xl lg:text-5xl">
            {t('website.NewSimfinDes.NewSimfinWorkDes.title')}
          </h2>

          <p className="text-base text-gray-600 sm:text-lg">
            {t('website.NewSimfinDes.NewSimfinWorkDes.des')}
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-5">
          {steps.map((step) => (
            <div key={step.id} className="flex flex-col overflow-hidden rounded-3xl bg-gray-100">
              <div className="flex-1 space-y-4 p-8 sm:p-6">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-base font-medium text-black shadow-md">
                  {step.id}
                </div>

                <h3 className="text-xl font-medium text-black">
                  {step.title}
                </h3>

                <p className="text-base text-gray-600">
                  {step.description}
                </p>
              </div>

              <div className="relative flex h-[250px] items-center justify-center sm:h-[300px]">
                <img
                  src={step.image}
                  alt={step.title}
                  className="object-contain"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowDoesItWorkSection;

