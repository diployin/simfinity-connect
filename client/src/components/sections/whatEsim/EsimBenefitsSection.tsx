'use client';

import React, { useState } from 'react';

import { FileText, Phone, RotateCcw, Shield, Users, Wallet } from 'lucide-react';
import { useTranslation } from '@/contexts/TranslationContext';

interface BenefitItem {
  id: number;
  iconType: string;
  title: string;
  description: string;
}

interface TabContent {
  id: number;
  label: string;
  heading: string;
  subheading: string;
  items: BenefitItem[];
}

const EsimBenefitsSection = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<number>(0);

  // Icon mapping by type
  const iconMap: Record<string, React.ReactNode> = {
    Wallet: <Wallet className="h-8 w-8" />,
    Users: <Users className="h-8 w-8" />,
    Document: <FileText className="h-8 w-8" />,
    Phone: <Phone className="h-8 w-8" />,
    Shield: <Shield className="h-8 w-8" />,
    Recycle: <RotateCcw className="h-8 w-8" />,
  };

  // Get tabs data from translation
  const tabsData: TabContent[] = [
    {
      id: 0,
      label: t('website.NewSimfinDes.what_is_esim.WhatIsEsim.EsimBenefitsSection.tabs.0.label'),
      heading: t('website.NewSimfinDes.what_is_esim.WhatIsEsim.EsimBenefitsSection.tabs.0.heading'),
      subheading: t('website.NewSimfinDes.what_is_esim.WhatIsEsim.EsimBenefitsSection.tabs.0.subheading'),
      items: [
        {
          id: 1,
          iconType: t(
            'website.NewSimfinDes.what_is_esim.WhatIsEsim.EsimBenefitsSection.tabs.0.items.0.iconType',
          ),
          title: t('website.NewSimfinDes.what_is_esim.WhatIsEsim.EsimBenefitsSection.tabs.0.items.0.title'),
          description: t(
            'website.NewSimfinDes.what_is_esim.WhatIsEsim.EsimBenefitsSection.tabs.0.items.0.description',
          ),
        },
        {
          id: 2,
          iconType: t(
            'website.NewSimfinDes.what_is_esim.WhatIsEsim.EsimBenefitsSection.tabs.0.items.1.iconType',
          ),
          title: t('website.NewSimfinDes.what_is_esim.WhatIsEsim.EsimBenefitsSection.tabs.0.items.1.title'),
          description: t(
            'website.NewSimfinDes.what_is_esim.WhatIsEsim.EsimBenefitsSection.tabs.0.items.1.description',
          ),
        },
        {
          id: 3,
          iconType: t(
            'website.NewSimfinDes.what_is_esim.WhatIsEsim.EsimBenefitsSection.tabs.0.items.2.iconType',
          ),
          title: t('website.NewSimfinDes.what_is_esim.WhatIsEsim.EsimBenefitsSection.tabs.0.items.2.title'),
          description: t(
            'website.NewSimfinDes.what_is_esim.WhatIsEsim.EsimBenefitsSection.tabs.0.items.2.description',
          ),
        },
        {
          id: 4,
          iconType: t(
            'website.NewSimfinDes.what_is_esim.WhatIsEsim.EsimBenefitsSection.tabs.0.items.3.iconType',
          ),
          title: t('website.NewSimfinDes.what_is_esim.WhatIsEsim.EsimBenefitsSection.tabs.0.items.3.title'),
          description: t(
            'website.NewSimfinDes.what_is_esim.WhatIsEsim.EsimBenefitsSection.tabs.0.items.3.description',
          ),
        },
        {
          id: 5,
          iconType: t(
            'website.NewSimfinDes.what_is_esim.WhatIsEsim.EsimBenefitsSection.tabs.0.items.4.iconType',
          ),
          title: t('website.NewSimfinDes.what_is_esim.WhatIsEsim.EsimBenefitsSection.tabs.0.items.4.title'),
          description: t(
            'website.NewSimfinDes.what_is_esim.WhatIsEsim.EsimBenefitsSection.tabs.0.items.4.description',
          ),
        },
        {
          id: 6,
          iconType: t(
            'website.NewSimfinDes.what_is_esim.WhatIsEsim.EsimBenefitsSection.tabs.0.items.5.iconType',
          ),
          title: t('website.NewSimfinDes.what_is_esim.WhatIsEsim.EsimBenefitsSection.tabs.0.items.5.title'),
          description: t(
            'website.NewSimfinDes.what_is_esim.WhatIsEsim.EsimBenefitsSection.tabs.0.items.5.description',
          ),
        },
      ],
    },
    {
      id: 1,
      label: t('website.NewSimfinDes.what_is_esim.WhatIsEsim.EsimBenefitsSection.tabs.1.label'),
      heading: t('website.NewSimfinDes.what_is_esim.WhatIsEsim.EsimBenefitsSection.tabs.1.heading'),
      subheading: t('website.NewSimfinDes.what_is_esim.WhatIsEsim.EsimBenefitsSection.tabs.1.subheading'),
      items: [
        {
          id: 1,
          iconType: t(
            'website.NewSimfinDes.what_is_esim.WhatIsEsim.EsimBenefitsSection.tabs.1.items.0.iconType',
          ),
          title: t('website.NewSimfinDes.what_is_esim.WhatIsEsim.EsimBenefitsSection.tabs.1.items.0.title'),
          description: t(
            'website.NewSimfinDes.what_is_esim.WhatIsEsim.EsimBenefitsSection.tabs.1.items.0.description',
          ),
        },
        {
          id: 2,
          iconType: t(
            'website.NewSimfinDes.what_is_esim.WhatIsEsim.EsimBenefitsSection.tabs.1.items.1.iconType',
          ),
          title: t('website.NewSimfinDes.what_is_esim.WhatIsEsim.EsimBenefitsSection.tabs.1.items.1.title'),
          description: t(
            'website.NewSimfinDes.what_is_esim.WhatIsEsim.EsimBenefitsSection.tabs.1.items.1.description',
          ),
        },
        {
          id: 3,
          iconType: t(
            'website.NewSimfinDes.what_is_esim.WhatIsEsim.EsimBenefitsSection.tabs.1.items.2.iconType',
          ),
          title: t('website.NewSimfinDes.what_is_esim.WhatIsEsim.EsimBenefitsSection.tabs.1.items.2.title'),
          description: t(
            'website.NewSimfinDes.what_is_esim.WhatIsEsim.EsimBenefitsSection.tabs.1.items.2.description',
          ),
        },
      ],
    },
  ];

  return (
    <section className="w-full bg-white py-8 md:py-16">
      <div className="containers m-auto">
        {/* Tab Buttons */}
        <div className="mb-8 flex w-fit flex-wrap justify-center gap-3 rounded-3xl border p-1 md:justify-start">
          {tabsData.map((tab: TabContent, index: number) => (
            <button
              key={index}
              onClick={() => setActiveTab(index)}
              className={`rounded-full px-6 py-1 text-base font-medium transition-all duration-200 ${
                activeTab === index ? 'bg-black text-white' : 'bg-white text-gray-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Active Tab Content */}
        <div className="animate-fadeIn">
          {/* Heading */}
          <h2 className="lg:text-4.5xl mb-4 text-center text-3xl leading-tight font-medium text-black sm:text-4xl md:text-start">
            {tabsData[activeTab].heading}
          </h2>

          {/* Subheading */}
          <p className="mb-12 text-center text-base text-gray-600 sm:text-base md:text-start">
            {tabsData[activeTab].subheading}
          </p>

          {/* Benefits Grid */}
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 lg:gap-x-12 lg:gap-y-16">
            {tabsData[activeTab].items.map((item: BenefitItem, index: number) => (
              <div key={index} className="space-y-4">
                {/* Icon */}
                <div className="text-gray-900">
                  {iconMap[item.iconType] || <Wallet className="h-8 w-8" />}
                </div>

                {/* Title */}
                <h3 className="text-xl leading-tight font-medium text-black sm:text-xl">
                  {item.title}
                </h3>

                {/* Description */}
                <p className="text-base leading-relaxed text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default EsimBenefitsSection;
