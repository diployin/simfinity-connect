'use client';

import React from 'react';

import { CheckCircle, Globe, Phone, Signal, Smartphone, Trash2 } from 'lucide-react';
import { useTranslation } from '@/contexts/TranslationContext';

interface ComparisonRow {
  id: number;
  iconType: string;
  feature: string;
  esim: string;
  sim: string;
}

const EsimVsSimComparison = () => {
  const { t } = useTranslation();

  // Icon mapping by type
  const iconMap: Record<string, React.ReactNode> = {
    Phone: <Phone className="h-6 w-6" />,
    Globe: <Globe className="h-6 w-6" />,
    Trash: <Trash2 className="h-6 w-6" />,
    CheckCircle: <CheckCircle className="h-6 w-6" />,
    Smartphone: <Smartphone className="h-6 w-6" />,
    Signal: <Signal className="h-6 w-6" />,
  };

  // Get heading and description from translation
  const heading = t('NewSimfinDes.what_is_esim.WhatIsEsim.EsimVsSimComparison.heading');
  const description = t('NewSimfinDes.what_is_esim.WhatIsEsim.EsimVsSimComparison.description');
  const footerNote = t('NewSimfinDes.what_is_esim.WhatIsEsim.EsimVsSimComparison.footerNote');

  // Get comparison data
  const comparisonData: ComparisonRow[] = [
    {
      id: 1,
      iconType: t('NewSimfinDes.what_is_esim.WhatIsEsim.EsimVsSimComparison.rows.0.iconType'),
      feature: t('NewSimfinDes.what_is_esim.WhatIsEsim.EsimVsSimComparison.rows.0.feature'),
      esim: t('NewSimfinDes.what_is_esim.WhatIsEsim.EsimVsSimComparison.rows.0.esim'),
      sim: t('NewSimfinDes.what_is_esim.WhatIsEsim.EsimVsSimComparison.rows.0.sim'),
    },
    {
      id: 2,
      iconType: t('NewSimfinDes.what_is_esim.WhatIsEsim.EsimVsSimComparison.rows.1.iconType'),
      feature: t('NewSimfinDes.what_is_esim.WhatIsEsim.EsimVsSimComparison.rows.1.feature'),
      esim: t('NewSimfinDes.what_is_esim.WhatIsEsim.EsimVsSimComparison.rows.1.esim'),
      sim: t('NewSimfinDes.what_is_esim.WhatIsEsim.EsimVsSimComparison.rows.1.sim'),
    },
    {
      id: 3,
      iconType: t('NewSimfinDes.what_is_esim.WhatIsEsim.EsimVsSimComparison.rows.2.iconType'),
      feature: t('NewSimfinDes.what_is_esim.WhatIsEsim.EsimVsSimComparison.rows.2.feature'),
      esim: t('NewSimfinDes.what_is_esim.WhatIsEsim.EsimVsSimComparison.rows.2.esim'),
      sim: t('NewSimfinDes.what_is_esim.WhatIsEsim.EsimVsSimComparison.rows.2.sim'),
    },
    {
      id: 4,
      iconType: t('NewSimfinDes.what_is_esim.WhatIsEsim.EsimVsSimComparison.rows.3.iconType'),
      feature: t('NewSimfinDes.what_is_esim.WhatIsEsim.EsimVsSimComparison.rows.3.feature'),
      esim: t('NewSimfinDes.what_is_esim.WhatIsEsim.EsimVsSimComparison.rows.3.esim'),
      sim: t('NewSimfinDes.what_is_esim.WhatIsEsim.EsimVsSimComparison.rows.3.sim'),
    },
    {
      id: 5,
      iconType: t('NewSimfinDes.what_is_esim.WhatIsEsim.EsimVsSimComparison.rows.4.iconType'),
      feature: t('NewSimfinDes.what_is_esim.WhatIsEsim.EsimVsSimComparison.rows.4.feature'),
      esim: t('NewSimfinDes.what_is_esim.WhatIsEsim.EsimVsSimComparison.rows.4.esim'),
      sim: t('NewSimfinDes.what_is_esim.WhatIsEsim.EsimVsSimComparison.rows.4.sim'),
    },
    {
      id: 6,
      iconType: t('NewSimfinDes.what_is_esim.WhatIsEsim.EsimVsSimComparison.rows.5.iconType'),
      feature: t('NewSimfinDes.what_is_esim.WhatIsEsim.EsimVsSimComparison.rows.5.feature'),
      esim: t('NewSimfinDes.what_is_esim.WhatIsEsim.EsimVsSimComparison.rows.5.esim'),
      sim: t('NewSimfinDes.what_is_esim.WhatIsEsim.EsimVsSimComparison.rows.5.sim'),
    },
  ];

  return (
    <section className="w-full bg-white py-8 md:py-16">
      <div className="containers">
        <div className="py-4">
          <h2 className="lg:text-4.5xl w-full text-3xl leading-tight font-medium text-gray-900 sm:text-4xl lg:max-w-2xl">
            {heading}
          </h2>

          <p className="w-full py-4 text-base leading-relaxed text-gray-600 sm:text-base lg:max-w-4xl">
            {description}
          </p>
        </div>

        {/* Desktop Table View */}
        <div className="hidden overflow-hidden rounded-3xl border border-gray-200 md:block">
          <table className="w-full">
            {/* Table Header */}
            <thead>
              <tr className="border-b border-gray-200">
                <th className="w-1/4 px-6 py-6 text-left font-medium text-gray-500"></th>
                <th className="w-[37.5%] px-6 py-6 text-center text-lg font-medium text-gray-700">
                  {t('EsimVsSimComparison.tableHeaders.esim')}
                </th>
                <th className="w-[37.5%] px-6 py-6 text-center text-lg font-medium text-gray-700">
                  {t('EsimVsSimComparison.tableHeaders.sim')}
                </th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody>
              {comparisonData.map((row: ComparisonRow, index: number) => (
                <tr
                  key={index}
                  className={`${
                    index % 2 === 0 ? 'bg-gray-50' : 'bg-white'
                  } border-b border-gray-200 last:border-b-0`}
                >
                  {/* Feature Column with Icon */}
                  <td className="px-6 py-6">
                    <div className="flex items-center gap-3">
                      <div className="flex-shrink-0 text-gray-900">
                        {iconMap[row.iconType] || <Phone className="h-6 w-6" />}
                      </div>
                      <span className="text-base font-medium text-gray-900">{row.feature}</span>
                    </div>
                  </td>

                  {/* eSIM Column */}
                  <td className="px-6 py-6 text-center text-base text-gray-700">{row.esim}</td>

                  {/* SIM Column */}
                  <td className="px-6 py-6 text-center text-base text-gray-700">{row.sim}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="space-y-6 md:hidden">
          {comparisonData.map((row: ComparisonRow, index: number) => (
            <div
              key={index}
              className="overflow-hidden rounded-2xl border border-gray-200 bg-white"
            >
              {/* Feature Header */}
              <div className="border-b border-gray-200 bg-gray-50 px-5 py-4">
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0 text-gray-900">
                    {iconMap[row.iconType] || <Phone className="h-6 w-6" />}
                  </div>
                  <h3 className="text-base font-semibold text-gray-900">{row.feature}</h3>
                </div>
              </div>

              {/* eSIM Section */}
              <div className="border-b border-gray-200 px-5 py-4">
                <div className="mb-2 text-sm font-medium text-gray-500">
                  {t('EsimVsSimComparison.tableHeaders.esim')}
                </div>
                <div className="text-base text-gray-900">{row.esim}</div>
              </div>

              {/* SIM Section */}
              <div className="px-5 py-4">
                <div className="mb-2 text-sm font-medium text-gray-500">
                  {t('EsimVsSimComparison.tableHeaders.sim')}
                </div>
                <div className="text-base text-gray-900">{row.sim}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer Note */}
        <div className="mt-8 text-sm leading-relaxed text-gray-600">{footerNote}</div>
      </div>
    </section>
  );
};

export default EsimVsSimComparison;
