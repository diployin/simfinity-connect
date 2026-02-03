'use client';

import React, { useMemo } from 'react';

import { Check, X } from 'lucide-react';
import { useTranslation } from '@/contexts/TranslationContext';

interface ComparisonRow {
  label: string;
  description?: string;
  saily: string | boolean;
  competitors: (string | boolean)[];
}

interface ComparisonTableProps {
  title?: string;
  mainBrandName?: string;
  mainBrandImage?: string;
  mainBrandBg?: string;
  competitorNames?: string[];
  competitorImages?: string[];
  rows?: ComparisonRow[];
  ctaButtonText?: string;
  onCTAClick?: () => void;
}

const ComparisonTableCommon: React.FC<ComparisonTableProps> = ({
  title = 'Simfinity vs. other eSIM services',
  mainBrandName = 'Simfinity',
  mainBrandImage = '/images/brands/simfinity-white-logo.png',
  mainBrandBg = 'bg-black',
  competitorNames = ['Airalo', 'Holafly', 'Nomad', 'Ubigi'],
  competitorImages = [
    '/images/compatiter-logo/airalo-logo.svg',
    '/images/compatiter-logo/holafly-logo.svg',
    '/images/compatiter-logo/nomad-logo.svg',
    '/images/compatiter-logo/ubigi-logo.webp',
  ],
  rows,
  ctaButtonText = 'View Plans',
  onCTAClick = () => {},
}) => {
  const { t } = useTranslation();

  // ✅ Use translated data if available, fallback to defaults
  const translatedTitle = 'Simfinity vs. other eSIM services';
  const translatedMainBrandName = 'dfjdjf';
  const translatedCtaButtonText = 'aerwr';

  // ✅ Default rows if not provided
  const defaultRows: ComparisonRow[] = [
    {
      label: 'One eSIM for supported destinations',
      description: '',
      saily: true,
      competitors: [false, false, false, true],
    },
    {
      label: '24/7 live chat support',
      description: '',
      saily: true,
      competitors: [true, true, true, false],
    },
    {
      label: 'Refunds',
      description: '',
      saily: true,
      competitors: [true, true, true, true],
    },
    {
      label: 'Security features',
      description: '',
      saily: true,
      competitors: [false, false, false, false],
    },
    {
      label: 'Virtual locations',
      description: '',
      saily: '115+',
      competitors: ['0', '0', '0', '0'],
    },
    {
      label: 'Blocks malicious URLs',
      description: '',
      saily: true,
      competitors: [false, false, false, false],
    },
    {
      label: 'Data saver (ad blocker)',
      description: '',
      saily: true,
      competitors: [false, false, false, false],
    },
  ];

  // ✅ Get translated rows
  const translatedRows = useMemo(() => {
    const finalRows = defaultRows;
    return finalRows.map((row, idx) => ({
      ...row,
      label: t(`NewSimfinDes.SingleCountryPlan.ComparisonTableCommon.rows.${idx}.label`, {
        defaultValue: row.label,
      }),
      description: t(
        `NewSimfinDes.SingleCountryPlan.ComparisonTableCommon.rows.${idx}.description`,
        {
          defaultValue: row.description || '',
        },
      ),
    }));
  }, [rows, t]);

  // Icon components
  const CheckIcon = () => <Check className="h-5 w-5 text-green-500" />;
  const XIcon = () => <X className="h-5 w-5 text-gray-400" />;

  const ValueCell = (value: string | boolean) => {
    if (typeof value === 'boolean') {
      return value ? <CheckIcon /> : <XIcon />;
    }
    return <span className="font-semibold text-gray-900">{value}</span>;
  };

  return (
    <section className="w-full bg-white py-16 lg:py-20">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Title */}
        <h2 className="mb-12 text-3xl leading-tight font-medium text-gray-900 sm:text-4xl lg:text-4xl">
          {translatedTitle}
        </h2>

        {/* Table Wrapper - Scrollable on mobile */}
        <div className="overflow-x-auto rounded-2xl">
          <table className="w-full">
            {/* Table Header */}
            <thead>
              <tr className="border-b border-gray-200">
                {/* First column - Features */}
                <th className="bg-white px-4 py-4 text-left sm:px-6">
                  <span className="text-sm font-semibold text-gray-900" />
                </th>

                {/* Main Brand Column */}
                <th
                  className={`${mainBrandBg} rounded-tl-3xl rounded-tr-3xl px-4 py-6 text-center sm:px-6`}
                >
                  <div className="flex flex-col items-center gap-3">
                    {mainBrandImage ? (
                      <div className="relative h-8 w-20">
                        <img
                          src={mainBrandImage}
                          alt={translatedMainBrandName}
                          className="object-contain"
                        />
                      </div>
                    ) : (
                      <span className="text-sm font-bold text-white sm:text-base">
                        {translatedMainBrandName}
                      </span>
                    )}
                  </div>
                </th>

                {/* Competitor Columns */}
                {competitorNames.map((name, idx) => (
                  <th key={idx} className="border-l border-gray-200 px-4 py-6 text-center sm:px-6">
                    <div className="flex flex-col items-center gap-3">
                      {competitorImages[idx] ? (
                        <div className="relative h-10 w-16 sm:w-20">
                          <img src={competitorImages[idx]} alt={name} className="object-contain" />
                        </div>
                      ) : (
                        <span className="text-xs font-semibold text-gray-900 sm:text-sm">
                          {name}
                        </span>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>

            {/* Table Body */}
            <tbody>
              {translatedRows.map((row, rowIdx) => (
                <tr
                  key={rowIdx}
                  className="border-b border-gray-200 transition-colors hover:bg-gray-50"
                >
                  {/* Feature Label */}
                  <td className="bg-white px-4 py-5 text-left sm:px-6">
                    <div className="flex flex-col gap-1">
                      <span className="text-sm font-medium text-gray-900 sm:text-base">
                        {row.label}
                      </span>
                      {row.description && (
                        <span className="text-xs text-gray-600 sm:text-sm">{row.description}</span>
                      )}
                    </div>
                  </td>

                  {/* Simfinity Value */}
                  <td className={`${mainBrandBg} px-4 py-5 text-center sm:px-6`}>
                    <div className="flex justify-center">{ValueCell(row.saily)}</div>
                  </td>

                  {/* Competitor Values */}
                  {row.competitors.map((value, colIdx) => (
                    <td
                      key={colIdx}
                      className="border-l border-gray-200 px-4 py-5 text-center sm:px-6"
                    >
                      <div className="flex justify-center">{ValueCell(value)}</div>
                    </td>
                  ))}
                </tr>
              ))}

              {/* CTA Row */}
              <tr>
                <td className="bg-white px-4 py-6 sm:px-6" />
                <td
                  className={`${mainBrandBg} rounded-br-3xl rounded-bl-3xl px-4 py-6 text-center sm:px-6`}
                >
                  <button
                    onClick={onCTAClick}
                    className="bg-themeYellow hover:bg-themeYellowHover inline-block rounded-full px-6 py-3 text-sm font-semibold text-black transition-all duration-300 hover:shadow-lg sm:text-base"
                  >
                    {translatedCtaButtonText}
                  </button>
                </td>
                {competitorNames.map((_, idx) => (
                  <td key={idx} className="border-l border-gray-200 px-4 py-6 sm:px-6" />
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export default ComparisonTableCommon;
