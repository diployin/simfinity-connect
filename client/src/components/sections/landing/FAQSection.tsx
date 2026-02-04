// 'use client';

// import React from 'react';

// import { useTranslation } from '@/contexts/TranslationContext';
// import FAQ from '@/components/common/FAQ';

// interface FAQItem {
//   id: string;
//   question: string;
//   answer: string;
// }

// const FAQSection = () => {
//   const { t } = useTranslation();

//   // Get title from translation
//   const title = t('NewSimfinDes.HeroFAQSection.title');

//   // Get FAQs data - manually create array from JSON
//   const faqs: FAQItem[] = [
//     {
//       id: t('NewSimfinDes.HeroFAQSection.faqs.0.id'),
//       question: t('NewSimfinDes.HeroFAQSection.faqs.0.question'),
//       answer: t('NewSimfinDes.HeroFAQSection.faqs.0.answer'),
//     },
//     {
//       id: t('NewSimfinDes.HeroFAQSection.faqs.1.id'),
//       question: t('NewSimfinDes.HeroFAQSection.faqs.1.question'),
//       answer: t('NewSimfinDes.HeroFAQSection.faqs.1.answer'),
//     },
//     {
//       id: t('NewSimfinDes.HeroFAQSection.faqs.2.id'),
//       question: t('NewSimfinDes.HeroFAQSection.faqs.2.question'),
//       answer: t('NewSimfinDes.HeroFAQSection.faqs.2.answer'),
//     },
//     {
//       id: t('NewSimfinDes.HeroFAQSection.faqs.3.id'),
//       question: t('NewSimfinDes.HeroFAQSection.faqs.3.question'),
//       answer: t('NewSimfinDes.HeroFAQSection.faqs.3.answer'),
//     },
//     {
//       id: t('NewSimfinDes.HeroFAQSection.faqs.4.id'),
//       question: t('NewSimfinDes.HeroFAQSection.faqs.4.question'),
//       answer: t('NewSimfinDes.HeroFAQSection.faqs.4.answer'),
//     },
//     {
//       id: t('NewSimfinDes.HeroFAQSection.faqs.5.id'),
//       question: t('NewSimfinDes.HeroFAQSection.faqs.5.question'),
//       answer: t('NewSimfinDes.HeroFAQSection.faqs.5.answer'),
//     },
//   ];

//   return <FAQ faqs={faqs} title={title} />;
// };

// export default FAQSection;


'use client';

import React from 'react';
import FAQ from '@/components/common/FAQ';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

const FAQSection = () => {
  const title = 'Frequently asked questions';

  const faqs: FAQItem[] = [
    {
      id: 'faq-1',
      question: 'After getting an eSIM, do I need to turn anything on?',
      answer:
        'No, your eSIM will activate automatically when you reach your destination. Just make sure your device supports eSIM and that you’ve installed the profile before traveling.',
    },
    {
      id: 'faq-2',
      question: 'Does Simfinity detect when I arrive at my destination?',
      answer:
        'Yes! Simfinity automatically detects your arrival and activates your data plan as soon as you land.',
    },
    {
      id: 'faq-3',
      question: 'Do I keep my phone number with a Simfinity eSIM?',
      answer:
        'Yes, you keep your original phone number. Simfinity eSIMs are data-only, so your physical SIM stays active for calls and SMS.',
    },
    {
      id: 'faq-4',
      question: 'What’s the best eSIM for international travel?',
      answer:
        'Simfinity offers affordable, reliable eSIM plans in 200+ destinations with instant activation and no roaming surprises.',
    },
    {
      id: 'faq-5',
      question: 'What is a tourist eSIM?',
      answer:
        'A tourist eSIM is a digital SIM designed for travelers, allowing you to get mobile data abroad without buying a physical SIM card.',
    },
    {
      id: 'faq-6',
      question: 'How long does it take to activate my eSIM?',
      answer:
        'Activation is instant. Once installed, your plan activates automatically when you arrive at your destination.',
    },
  ];

  return <FAQ title={title} faqs={faqs} />;
};

export default FAQSection;
