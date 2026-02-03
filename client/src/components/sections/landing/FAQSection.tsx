'use client';

import React from 'react';

import { useTranslation } from '@/contexts/TranslationContext';
import FAQ from '@/components/common/FAQ';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

const FAQSection = () => {
  const { t } = useTranslation();

  // Get title from translation
  const title = t('NewSimfinDes.HeroFAQSection.title');

  // Get FAQs data - manually create array from JSON
  const faqs: FAQItem[] = [
    {
      id: t('NewSimfinDes.HeroFAQSection.faqs.0.id'),
      question: t('NewSimfinDes.HeroFAQSection.faqs.0.question'),
      answer: t('NewSimfinDes.HeroFAQSection.faqs.0.answer'),
    },
    {
      id: t('NewSimfinDes.HeroFAQSection.faqs.1.id'),
      question: t('NewSimfinDes.HeroFAQSection.faqs.1.question'),
      answer: t('NewSimfinDes.HeroFAQSection.faqs.1.answer'),
    },
    {
      id: t('NewSimfinDes.HeroFAQSection.faqs.2.id'),
      question: t('NewSimfinDes.HeroFAQSection.faqs.2.question'),
      answer: t('NewSimfinDes.HeroFAQSection.faqs.2.answer'),
    },
    {
      id: t('NewSimfinDes.HeroFAQSection.faqs.3.id'),
      question: t('NewSimfinDes.HeroFAQSection.faqs.3.question'),
      answer: t('NewSimfinDes.HeroFAQSection.faqs.3.answer'),
    },
    {
      id: t('NewSimfinDes.HeroFAQSection.faqs.4.id'),
      question: t('NewSimfinDes.HeroFAQSection.faqs.4.question'),
      answer: t('NewSimfinDes.HeroFAQSection.faqs.4.answer'),
    },
    {
      id: t('NewSimfinDes.HeroFAQSection.faqs.5.id'),
      question: t('NewSimfinDes.HeroFAQSection.faqs.5.question'),
      answer: t('NewSimfinDes.HeroFAQSection.faqs.5.answer'),
    },
  ];

  return <FAQ faqs={faqs} title={title} />;
};

export default FAQSection;
