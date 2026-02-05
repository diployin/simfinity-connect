// 'use client';

// import React, { useState } from 'react';

// import Image from 'next/image';
// import Link from 'next/link';

// // TypeScript Interface Definitions
// interface Step {
//     number: string;
//     stepTitle: string;
//     description: string;
//     image?: string;
// }

// interface TabData {
//     label: string;
//     title: string;
//     steps: Step[];
//     instructions?: {
//         heading: string;
//         steps: string[];
//     };
// }

// const EsimSetupTab = () => {
//     const [activeTab, setActiveTab] = useState<number>(0);

//     // Static Data
//     const tabsData: TabData[] = [
//         {
//             label: 'On iPhone',
//             title: 'Set up an eSIM on your iPhone with the Simfinity app',
//             steps: [
//                 {
//                     number: '1',
//                     stepTitle: 'Pick an eSIM data plan for your trip',
//                     description: "Select the country you're heading to and choose a plan.",
//                     image: '/images/1-step.svg'
//                 },
//                 {
//                     number: '2',
//                     stepTitle: 'Download the Simfinity eSIM app',
//                     description: 'Get the app, tap Install eSIM, and follow the steps on the screen.',
//                     image: '/images/2-step.svg'
//                 },
//                 {
//                     number: '3',
//                     stepTitle: 'Your plan will automatically activate',
//                     description: 'Get ready for your trip — your plan will activate when you arrive.',
//                     image: '/images/3-step.svg'
//                 }
//             ],
//             instructions: {
//                 heading: 'Set up an eSIM manually on your iPhone',
//                 steps: [
//                     'Go to "Settings", then "Mobile Service" or "Cellular".',
//                     'Tap "Add eSIM" or "Add Cellular Plan".',
//                     'Tap "Use QR Code".',
//                     'Scan the QR code or enter the details manually.'
//                 ]
//             }
//         },
//         {
//             label: 'On Android',
//             title: 'Set up an eSIM on your Android with the Simfinity app',
//             steps: [
//                 {
//                     number: '1',
//                     stepTitle: 'Pick an eSIM data plan for your trip',
//                     description: "Select the country you're heading to and choose a plan.",
//                     image: '/images/whatEsim/card-choose-data-plan.svg'
//                 },
//                 {
//                     number: '2',
//                     stepTitle: 'Download the Simfinity eSIM app',
//                     description: 'Get the app, tap Install eSIM and follow the steps on the screen to set it up.',
//                     image: '/images/whatEsim/card-setup-instructions.svg'
//                 },
//                 {
//                     number: '3',
//                     stepTitle: 'Your plan will automatically activate',
//                     description: 'Get ready for your trip — your plan will activate when you arrive.',
//                     image: '/images/whatEsim/card-activate-plan.svg'
//                 }
//             ],
//             instructions: {
//                 heading: 'Set up an eSIM manually on your Android',
//                 steps: [
//                     'Go to "Settings", then "Connections".',
//                     'Tap "SIM manager".',
//                     'Select "Add eSIM".',
//                     'Tap "Scan the QR code" or choose another way to add your eSIM.'
//                 ]
//             }
//         },
//         {
//             label: 'With a QR code',
//             title: 'Set up an eSIM using a QR code',
//             steps: [
//                 {
//                     number: '1',
//                     stepTitle: 'Scan the QR code to download Simfinity',
//                     description: 'Use your phone to scan the QR and download the Simfinity app.'
//                 },
//                 {
//                     number: '2',
//                     stepTitle: 'Buy an eSIM data plan for your trip',
//                     description: "Get a mobile data plan for the country you'll be visiting."
//                 },
//                 {
//                     number: '3',
//                     stepTitle: 'Your plan will automatically activate',
//                     description: 'Get online the moment you arrive at your destination.'
//                 }
//             ]
//             // No instructions for QR code tab
//         }
//     ];

//     return (
//         <section className='w-full bg-white py-16 sm:py-20 lg:py-20'>
//             <div className='containers'>
//                 <div className='py-4'>
//                     <h2 className='lg:text-4.5xl text-3xl leading-tight font-medium text-gray-900 sm:text-4xl'>
//                         How to set up an eSIM
//                     </h2>

//                     <p className='py-4 text-base leading-relaxed text-gray-600 sm:text-base'>
//                         Follow these steps to start using an eSIM on your iPhone or Android.
//                     </p>
//                 </div>

//                 {/* Tab Buttons */}
//                 <div className='mb-8 flex w-fit flex-wrap justify-center gap-3 rounded-3xl border p-1 sm:justify-start'>
//                     {tabsData.map((tab: TabData, index: number) => (
//                         <button
//                             key={index}
//                             onClick={() => setActiveTab(index)}
//                             className={`rounded-full px-4 py-1 text-base font-medium transition-all duration-200 ${
//                                 activeTab === index ? 'bg-black text-white' : 'bg-white text-gray-700'
//                             }`}>
//                             {tab.label}
//                         </button>
//                     ))}
//                 </div>

//                 {/* Active Tab Content */}
//                 <div className='animate-fadeIn'>
//                     {/* Title */}
//                     <h2 className='text-2.5xl lg:text-3.5xl mb-8 leading-tight font-medium text-black sm:mb-12 sm:text-3xl xl:text-3xl'>
//                         {tabsData[activeTab].title}
//                     </h2>

//                     {/* Steps Grid */}
//                     <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-5'>
//                         {tabsData[activeTab].steps.map((step: Step, index: number) => (
//                             <div
//                                 key={index}
//                                 className={`flex flex-col overflow-hidden rounded-3xl bg-gray-100 ${
//                                     !step.image ? 'p-8 sm:p-6' : ''
//                                 }`}>
//                                 {/* Text Section - Top Half */}
//                                 <div className={`${step.image ? 'p-8 sm:p-6' : ''} flex-1 space-y-4`}>
//                                     {/* Step Number in Circle */}
//                                     <div className='flex h-8 w-8 items-center justify-center rounded-full bg-white text-base font-medium text-black shadow-md'>
//                                         {step.number}
//                                     </div>

//                                     {/* Step Title */}
//                                     <h3 className='text-xl leading-tight font-medium text-black sm:text-xl'>
//                                         {step.stepTitle}
//                                     </h3>

//                                     {/* Step Description */}
//                                     <p className='text-base leading-relaxed text-gray-600'>{step.description}</p>
//                                 </div>

//                                 {/* Conditional Image Section - Only if image exists */}
//                                 {step.image && (
//                                     <div className='relative flex h-[250px] items-center justify-center sm:h-[300px]'>
//                                         <div className={`relative h-full w-full ${activeTab == 1 ? 'mt-14' : ''} `}>
//                                             <Image
//                                                 src={step.image}
//                                                 fill
//                                                 alt={step.stepTitle}
//                                                 className='object-contain'
//                                                 sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
//                                             />
//                                         </div>
//                                     </div>
//                                 )}
//                             </div>
//                         ))}
//                     </div>

//                     {/* Dynamic Instructions Section - Only for tabs with instructions */}
//                     {tabsData[activeTab].instructions && (
//                         <div className='mt-16 sm:mt-20'>
//                             <h3 className='sm:text-2.5xl mb-6 text-2xl leading-tight font-medium text-black lg:text-3xl'>
//                                 {tabsData[activeTab].instructions?.heading}
//                             </h3>

//                             <ol className='list-inside list-decimal space-y-3 text-base text-black marker:font-medium marker:text-gray-900 sm:text-base'>
//                                 {tabsData[activeTab].instructions?.steps.map((instruction: string, index: number) => (
//                                     <li key={index} className='leading-relaxed'>
//                                         {instruction}
//                                     </li>
//                                 ))}
//                             </ol>
//                         </div>
//                     )}
//                 </div>
//             </div>
//         </section>
//     );
// };

// export default EsimSetupTab;





'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useTranslation } from '@/contexts/TranslationContext';

interface Step {
  number: string;
  stepTitle: string;
  description: string;
  image?: string;
}

interface TabData {
  label: string;
  title: string;
  steps: Step[];
  instructions?: {
    heading: string;
    steps: string[];
  };
}

const EsimSetupTab = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<number>(0);

  const tabsData: TabData[] = [
    {
      label: t('website.esimSetupTab.tabs.iphone.label'),
      title: t('website.esimSetupTab.tabs.iphone.title'),
      steps: [
        {
          number: '1',
          stepTitle: t('website.esimSetupTab.tabs.iphone.steps.1.title'),
          description: t('website.esimSetupTab.tabs.iphone.steps.1.description'),
          image: '/images/1-step.svg',
        },
        {
          number: '2',
          stepTitle: t('website.esimSetupTab.tabs.iphone.steps.2.title'),
          description: t('website.esimSetupTab.tabs.iphone.steps.2.description'),
          image: '/images/2-step.svg',
        },
        {
          number: '3',
          stepTitle: t('website.esimSetupTab.tabs.iphone.steps.3.title'),
          description: t('website.esimSetupTab.tabs.iphone.steps.3.description'),
          image: '/images/3-step.svg',
        },
      ],
      instructions: {
        heading: t(
          'website.esimSetupTab.tabs.iphone.instructions.heading'
        ),
        steps: [
          t('website.esimSetupTab.tabs.iphone.instructions.steps.1'),
          t('website.esimSetupTab.tabs.iphone.instructions.steps.2'),
          t('website.esimSetupTab.tabs.iphone.instructions.steps.3'),
          t('website.esimSetupTab.tabs.iphone.instructions.steps.4'),
        ],
      },
    },

    {
      label: t('website.esimSetupTab.tabs.android.label'),
      title: t('website.esimSetupTab.tabs.android.title'),
      steps: [
        {
          number: '1',
          stepTitle: t('website.esimSetupTab.tabs.android.steps.1.title'),
          description: t('website.esimSetupTab.tabs.android.steps.1.description'),
          image: '/images/whatEsim/card-choose-data-plan.svg',
        },
        {
          number: '2',
          stepTitle: t('website.esimSetupTab.tabs.android.steps.2.title'),
          description: t('website.esimSetupTab.tabs.android.steps.2.description'),
          image: '/images/whatEsim/card-setup-instructions.svg',
        },
        {
          number: '3',
          stepTitle: t('website.esimSetupTab.tabs.android.steps.3.title'),
          description: t('website.esimSetupTab.tabs.android.steps.3.description'),
          image: '/images/whatEsim/card-activate-plan.svg',
        },
      ],
      instructions: {
        heading: t(
          'website.esimSetupTab.tabs.android.instructions.heading'
        ),
        steps: [
          t('website.esimSetupTab.tabs.android.instructions.steps.1'),
          t('website.esimSetupTab.tabs.android.instructions.steps.2'),
          t('website.esimSetupTab.tabs.android.instructions.steps.3'),
          t('website.esimSetupTab.tabs.android.instructions.steps.4'),
        ],
      },
    },

    {
      label: t('website.esimSetupTab.tabs.qr.label'),
      title: t('website.esimSetupTab.tabs.qr.title'),
      steps: [
        {
          number: '1',
          stepTitle: t('website.esimSetupTab.tabs.qr.steps.1.title'),
          description: t('website.esimSetupTab.tabs.qr.steps.1.description'),
        },
        {
          number: '2',
          stepTitle: t('website.esimSetupTab.tabs.qr.steps.2.title'),
          description: t('website.esimSetupTab.tabs.qr.steps.2.description'),
        },
        {
          number: '3',
          stepTitle: t('website.esimSetupTab.tabs.qr.steps.3.title'),
          description: t('website.esimSetupTab.tabs.qr.steps.3.description'),
        },
      ],
    },
  ];

  return (
    <section className="w-full bg-white py-16 sm:py-20 lg:py-20">
      <div className="containers">

        {/* Heading */}
        <div className="py-4">
          <h2 className="text-3xl font-medium text-gray-900 sm:text-4xl">
            {t('website.esimSetupTab.heading')}
          </h2>

          <p className="py-4 text-base text-gray-600">
            {t('website.esimSetupTab.subheading')}
          </p>
        </div>

        {/* Tabs */}
        <div className="mb-8 flex w-fit gap-3 rounded-3xl border p-1">
          {tabsData.map((tab, index) => (
            <button
              key={index}
              onClick={() => setActiveTab(index)}
              className={`rounded-full px-4 py-1 ${
                activeTab === index
                  ? 'bg-black text-white'
                  : 'bg-white text-gray-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Title */}
        <h2 className="text-2xl mb-8 font-medium text-black">
          {tabsData[activeTab].title}
        </h2>

        {/* Steps */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {tabsData[activeTab].steps.map((step, index) => (
            <div key={index} className="rounded-3xl bg-gray-100">
              <div className="p-6 space-y-4">
                <div className="h-8 w-8 bg-white rounded-full flex items-center justify-center">
                  {step.number}
                </div>

                <h3 className="text-xl font-medium">
                  {step.stepTitle}
                </h3>

                <p className="text-gray-600">
                  {step.description}
                </p>
              </div>

              {step.image && (
                <div className="relative h-[250px]">
                  <Image
                    src={step.image}
                    fill
                    alt={step.stepTitle}
                    className="object-contain"
                  />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Instructions */}
        {tabsData[activeTab].instructions && (
          <div className="mt-16">
            <h3 className="text-2xl font-medium mb-6">
              {tabsData[activeTab].instructions?.heading}
            </h3>

            <ol className="list-decimal space-y-2">
              {tabsData[activeTab].instructions?.steps.map(
                (instruction, index) => (
                  <li key={index}>{instruction}</li>
                )
              )}
            </ol>
          </div>
        )}
      </div>
    </section>
  );
};

export default EsimSetupTab;

