'use client';

import { useTranslation } from '@/contexts/TranslationContext';
import React, { useMemo, useState } from 'react';

interface ContentItem {
  title?: string;
  description: string;
}

interface FeatureTab {
  id: string;
  label: string;
  content: ContentItem[];
}

interface KeyFeaturesTabsProps {
  title?: string;
  tabs?: FeatureTab[];
  defaultTab?: string;
  countryName?: string | undefined | null;
  regionFlagName?: string | undefined | null;
  forWhoom?: 'country' | 'region';
}

const KeyFeaturesTabsSection: React.FC<KeyFeaturesTabsProps> = ({
  title = 'Key features',
  countryName = 'Unknown',
  regionFlagName = 'Unknown',
  forWhoom = 'country',
  tabs,
  defaultTab = 'features',
}) => {
  const [activeTab, setActiveTab] = useState<string>(defaultTab);
  const { t } = useTranslation();
  const safeCountryName = countryName || 'Unknown';

  // Generate tabs based on forWhoom prop with translations
  const generatedTabs = useMemo((): FeatureTab[] => {
    if (forWhoom === 'country') {
      return [
        {
          id: 'features',
          label: t('website.NewSimfinDes.SingleCountryPlan.KeyFeaturesTabsSection.tab1.label'),
          content: [
            {
              description: t(
                'website.NewSimfinDes.SingleCountryPlan.KeyFeaturesTabsSection.tab1.content.0.des1',
              ),
            },
            {
              description: t(
                'website.NewSimfinDes.SingleCountryPlan.KeyFeaturesTabsSection.tab1.content.1.des1',
                {
                  countryName: safeCountryName,
                },
              ),
            },
            {
              description: t(
                'website.NewSimfinDes.SingleCountryPlan.KeyFeaturesTabsSection.tab1.content.2.des1',
              ),
            },
          ],
        },
        {
          id: 'description',
          label: t('website.NewSimfinDes.SingleCountryPlan.KeyFeaturesTabsSection.tab2.label'),
          content: [
            {
              description: t(
                'website.NewSimfinDes.SingleCountryPlan.KeyFeaturesTabsSection.tab2.content.0.des1',
                {
                  countryName: safeCountryName,
                },
              ),
            },
            {
              description: t(
                'website.NewSimfinDes.SingleCountryPlan.KeyFeaturesTabsSection.tab2.content.1.des1',
              ),
            },
            {
              description: t(
                'website.NewSimfinDes.SingleCountryPlan.KeyFeaturesTabsSection.tab2.content.2.des1',
              ),
            },
          ],
        },
        {
          id: 'technical',
          label: t('website.NewSimfinDes.SingleCountryPlan.KeyFeaturesTabsSection.tab3.label'),
          content: [
            {
              title: t(
                'website.NewSimfinDes.SingleCountryPlan.KeyFeaturesTabsSection.tab3.content.0.title',
              ),
              description: t(
                'website.NewSimfinDes.SingleCountryPlan.KeyFeaturesTabsSection.tab3.content.0.des1',
              ),
            },
            {
              title: t(
                'website.NewSimfinDes.SingleCountryPlan.KeyFeaturesTabsSection.tab3.content.1.title',
              ),
              description: t(
                'website.NewSimfinDes.SingleCountryPlan.KeyFeaturesTabsSection.tab3.content.1.des1',
                {
                  countryName: safeCountryName,
                },
              ),
            },
            {
              title: t(
                'website.NewSimfinDes.SingleCountryPlan.KeyFeaturesTabsSection.tab3.content.2.title',
              ),
              description: t(
                'website.NewSimfinDes.SingleCountryPlan.KeyFeaturesTabsSection.tab3.content.2.des1',
              ),
            },
            {
              title: t(
                'website.NewSimfinDes.SingleCountryPlan.KeyFeaturesTabsSection.tab3.content.3.title',
              ),
              description: t(
                'website.NewSimfinDes.SingleCountryPlan.KeyFeaturesTabsSection.tab3.content.3.des1',
              ),
            },
            {
              title: t(
                'website.NewSimfinDes.SingleCountryPlan.KeyFeaturesTabsSection.tab3.content.4.title',
              ),
              description: t(
                'website.NewSimfinDes.SingleCountryPlan.KeyFeaturesTabsSection.tab3.content.4.des1',
              ),
            },
            {
              title: t(
                'website.NewSimfinDes.SingleCountryPlan.KeyFeaturesTabsSection.tab3.content.5.title',
              ),
              description: t(
                'website.NewSimfinDes.SingleCountryPlan.KeyFeaturesTabsSection.tab3.content.5.des1',
              ),
            },
            {
              title: t(
                'website.NewSimfinDes.SingleCountryPlan.KeyFeaturesTabsSection.tab3.content.6.title',
              ),
              description: t(
                'website.NewSimfinDes.SingleCountryPlan.KeyFeaturesTabsSection.tab3.content.6.des1',
              ),
            },
            {
              title: t(
                'website.NewSimfinDes.SingleCountryPlan.KeyFeaturesTabsSection.tab3.content.7.title',
              ),
              description: t(
                'website.NewSimfinDes.SingleCountryPlan.KeyFeaturesTabsSection.tab3.content.7.des1',
              ),
            },
            {
              title: t(
                'website.NewSimfinDes.SingleCountryPlan.KeyFeaturesTabsSection.tab3.content.8.title',
              ),
              description: t(
                'website.NewSimfinDes.SingleCountryPlan.KeyFeaturesTabsSection.tab3.content.8.des1',
                {
                  countryName: safeCountryName,
                },
              ),
            },
          ],
        },
      ];
    }

    // Region tabs
    return [
      {
        id: 'features',
        label: t('website.NewSimfinDes.SingleCountryPlan.KeyFeaturesTabsSection.region.tab1.label'),
        content: [
          {
            description: t(
              'website.NewSimfinDes.SingleCountryPlan.KeyFeaturesTabsSection.region.tab1.content.0.des1',
            ),
          },
          {
            description: t(
              'website.NewSimfinDes.SingleCountryPlan.KeyFeaturesTabsSection.region.tab1.content.1.des1',
              {
                countryName: safeCountryName,
              },
            ),
          },
          {
            description: t(
              'website.NewSimfinDes.SingleCountryPlan.KeyFeaturesTabsSection.region.tab1.content.2.des1',
            ),
          },
          {
            description: t(
              'website.NewSimfinDes.SingleCountryPlan.KeyFeaturesTabsSection.region.tab1.content.3.des1',
            ),
          },
        ],
      },
      {
        id: 'description',
        label: t('website.NewSimfinDes.SingleCountryPlan.KeyFeaturesTabsSection.region.tab2.label'),
        content: [
          {
            description: t(
              'website.NewSimfinDes.SingleCountryPlan.KeyFeaturesTabsSection.region.tab2.content.0.des1',
              {
                countryName: safeCountryName,
              },
            ),
          },
          {
            description: t(
              'website.NewSimfinDes.SingleCountryPlan.KeyFeaturesTabsSection.region.tab2.content.1.des1',
            ),
          },
          {
            description: t(
              'website.NewSimfinDes.SingleCountryPlan.KeyFeaturesTabsSection.region.tab2.content.2.des1',
            ),
          },
          {
            description: t(
              'website.NewSimfinDes.SingleCountryPlan.KeyFeaturesTabsSection.region.tab2.content.3.des1',
            ),
          },
        ],
      },
      {
        id: 'technical',
        label: t('website.NewSimfinDes.SingleCountryPlan.KeyFeaturesTabsSection.region.tab3.label'),
        content: [
          {
            title: t(
              'website.NewSimfinDes.SingleCountryPlan.KeyFeaturesTabsSection.region.tab3.content.0.title',
            ),
            description: t(
              'website.NewSimfinDes.SingleCountryPlan.KeyFeaturesTabsSection.region.tab3.content.0.des1',
            ),
          },
          {
            title: t(
              'website.NewSimfinDes.SingleCountryPlan.KeyFeaturesTabsSection.region.tab3.content.1.title',
            ),
            description: t(
              'website.NewSimfinDes.SingleCountryPlan.KeyFeaturesTabsSection.region.tab3.content.1.des1',
              {
                countryName: safeCountryName,
              },
            ),
          },
          {
            title: t(
              'website.NewSimfinDes.SingleCountryPlan.KeyFeaturesTabsSection.region.tab3.content.2.title',
            ),
            description: t(
              'website.NewSimfinDes.SingleCountryPlan.KeyFeaturesTabsSection.region.tab3.content.2.des1',
              {
                countryName: safeCountryName,
              },
            ),
          },
          {
            title: t(
              'website.NewSimfinDes.SingleCountryPlan.KeyFeaturesTabsSection.region.tab3.content.3.title',
            ),
            description: t(
              'website.NewSimfinDes.SingleCountryPlan.KeyFeaturesTabsSection.region.tab3.content.3.des1',
            ),
          },
          {
            title: t(
              'website.NewSimfinDes.SingleCountryPlan.KeyFeaturesTabsSection.region.tab3.content.4.title',
            ),
            description: t(
              'website.NewSimfinDes.SingleCountryPlan.KeyFeaturesTabsSection.region.tab3.content.4.des1',
            ),
          },
          {
            title: t(
              'website.NewSimfinDes.SingleCountryPlan.KeyFeaturesTabsSection.region.tab3.content.5.title',
            ),
            description: t(
              'website.NewSimfinDes.SingleCountryPlan.KeyFeaturesTabsSection.region.tab3.content.5.des1',
            ),
          },
          {
            title: t(
              'website.NewSimfinDes.SingleCountryPlan.KeyFeaturesTabsSection.region.tab3.content.6.title',
            ),
            description: t(
              'website.NewSimfinDes.SingleCountryPlan.KeyFeaturesTabsSection.region.tab3.content.6.des1',
            ),
          },
          {
            title: t(
              'website.NewSimfinDes.SingleCountryPlan.KeyFeaturesTabsSection.region.tab3.content.7.title',
            ),
            description: t(
              'website.NewSimfinDes.SingleCountryPlan.KeyFeaturesTabsSection.region.tab3.content.7.des1',
            ),
          },
          {
            title: t(
              'website.NewSimfinDes.SingleCountryPlan.KeyFeaturesTabsSection.region.tab3.content.8.title',
            ),
            description: t(
              'website.NewSimfinDes.SingleCountryPlan.KeyFeaturesTabsSection.region.tab3.content.8.des1',
            ),
          },
          {
            title: t(
              'website.NewSimfinDes.SingleCountryPlan.KeyFeaturesTabsSection.region.tab3.content.9.title',
            ),
            description: t(
              'website.NewSimfinDes.SingleCountryPlan.KeyFeaturesTabsSection.region.tab3.content.9.des1',
              {
                countryName: safeCountryName,
              },
            ),
          },
        ],
      },
    ];
  }, [countryName, forWhoom, t]);

  const finalTabs = tabs || generatedTabs;
  const currentTab = finalTabs.find((tab) => tab.id === activeTab);

  return (
    <section className="w-full bg-white py-12 lg:py-16">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-5">
          <div className="lg:col-span-2" />

          <div className="space-y-8 lg:col-span-3">
            {/* Tabs Navigation */}
            <div className="flex w-fit flex-wrap items-center gap-2 rounded-full border bg-gray-100 p-1 sm:gap-0 sm:bg-transparent">
              {finalTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
                    activeTab === tab.id ? 'bg-black text-white' : 'text-gray-700 hover:text-black'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            {currentTab && (
              <div className="space-y-4">
                <ul className="space-y-4">
                  {currentTab.content.map((item, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-gray-900" />
                      <div className="flex-1">
                        {item.title && (
                          <span className="font-semibold text-gray-900">{item.title}: </span>
                        )}
                        <span className="text-base leading-relaxed text-gray-700">
                          {item.description}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default KeyFeaturesTabsSection;
