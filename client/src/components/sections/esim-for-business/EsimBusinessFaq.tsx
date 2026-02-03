'use client';

import React from 'react';

import FAQ from '@/components/common/FAQ';
import { useTranslation } from '@/contexts/LanguageContext';

const EsimBusinessFaq = () => {
    const { t } = useTranslation();

    const title = t('NewSimfinDes.esim_for_business.BusinessSection.FAQSection.title');

    const faqs = [
        {
            id: 'faq-1',
            question: t('NewSimfinDes.esim_for_business.BusinessSection.FAQSection.faqs.0.question'),
            answer: t('NewSimfinDes.esim_for_business.BusinessSection.FAQSection.faqs.0.answer')
        },
        {
            id: 'faq-2',
            question: t('NewSimfinDes.esim_for_business.BusinessSection.FAQSection.faqs.1.question'),
            answer: t('NewSimfinDes.esim_for_business.BusinessSection.FAQSection.faqs.1.answer')
        },
        {
            id: 'faq-3',
            question: t('NewSimfinDes.esim_for_business.BusinessSection.FAQSection.faqs.2.question'),
            answer: t('NewSimfinDes.esim_for_business.BusinessSection.FAQSection.faqs.2.answer')
        },
        {
            id: 'faq-4',
            question: t('NewSimfinDes.esim_for_business.BusinessSection.FAQSection.faqs.3.question'),
            answer: t('NewSimfinDes.esim_for_business.BusinessSection.FAQSection.faqs.3.answer')
        },
        {
            id: 'faq-5',
            question: t('NewSimfinDes.esim_for_business.BusinessSection.FAQSection.faqs.4.question'),
            answer: t('NewSimfinDes.esim_for_business.BusinessSection.FAQSection.faqs.4.answer')
        },

        {
            id: 'faq-6',
            question: t('NewSimfinDes.esim_for_business.BusinessSection.FAQSection.faqs.5.question'),
            answer: t('NewSimfinDes.esim_for_business.BusinessSection.FAQSection.faqs.5.answer')
        }
    ];

    return <FAQ faqs={faqs} title={title} />;
};

export default EsimBusinessFaq;
