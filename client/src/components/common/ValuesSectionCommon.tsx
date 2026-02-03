'use client';

import { useTranslation } from '@/contexts/TranslationContext';
import React from 'react';

import { FaGlobeAmericas } from 'react-icons/fa';
import { FaCompass, FaHeart, FaLightbulb, FaRocket, FaSeedling } from 'react-icons/fa6';

interface ValueItem {
  id: number;
  title: string;
  description: string;
}

interface ValuesConfig {
  title: string;
  subtitle: string;
  backgroundColor: string;
  textColor: string;
  theme: 'light' | 'dark';
  iconSize: number;
  descriptionTextColor: string;
  iconColor: string;
  buttonBorderColor: string;
  buttonHoverBgColor: string;
  buttonHoverTextColor: string;
  gridCols: number;
  values: ValueItem[];
}

interface ValuesSectionCommonProps {
  config: ValuesConfig;
}

const ValuesSectionCommon: React.FC<ValuesSectionCommonProps> = ({ config }) => {
  const { t } = useTranslation();

  // ✅ Map icons based on id
  const iconMap: Record<number, React.ReactNode> = {
    1: <FaGlobeAmericas size={config.iconSize} />,
    2: <FaLightbulb size={config.iconSize} />,
    3: <FaHeart size={config.iconSize} />,
    4: <FaSeedling size={config.iconSize} />,
    5: <FaCompass size={config.iconSize} />,
    6: <FaRocket size={config.iconSize} />,
  };

  // ✅ Get translated values with fallback to config
  const translatedTitle = t('NewSimfinDes.SingleCountryPlan.ValuesSectionCommon.title', {
    defaultValue: config.title,
  });
  const translatedSubtitle = t('NewSimfinDes.SingleCountryPlan.ValuesSectionCommon.subtitle', {
    defaultValue: config.subtitle,
  });

  // ✅ Get translated values array
  const translatedValues: ValueItem[] = config.values.map((value) => ({
    id: value.id,
    title: t(`NewSimfinDes.SingleCountryPlan.ValuesSectionCommon.values.${value.id - 1}.title`, {
      defaultValue: value.title,
    }),
    description: t(
      `NewSimfinDes.SingleCountryPlan.ValuesSectionCommon.values.${value.id - 1}.description`,
      {
        defaultValue: value.description,
      },
    ),
  }));

  const gridColsClass =
    {
      1: 'grid-cols-1',
      2: 'grid-cols-1 md:grid-cols-2',
      3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
      4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
    }[config.gridCols] || 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';

  return (
    <section className={`w-full py-12 lg:py-20 ${config.backgroundColor}`}>
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-16 text-center">
          <h2
            className={`mb-4 text-3xl leading-tight font-bold sm:text-4xl lg:text-5xl ${config.textColor}`}
          >
            {translatedTitle}
          </h2>
          <p
            className={`mx-auto max-w-3xl text-base leading-relaxed sm:text-lg ${config.descriptionTextColor}`}
          >
            {translatedSubtitle}
          </p>
        </div>

        {/* Values Grid */}
        <div className={`grid gap-8 md:gap-10 lg:gap-12 ${gridColsClass}`}>
          {translatedValues.map((value) => (
            <div
              key={value.id}
              className={`flex flex-col items-start space-y-4 rounded-2xl border ${
                config.theme === 'light'
                  ? `${config.buttonBorderColor} border-opacity-20 p-8`
                  : 'border-gray-700 p-8'
              } transition-all duration-300 hover:shadow-xl`}
            >
              {/* Icon */}
              <div className={`${config.iconColor}`}>{iconMap[value.id]}</div>

              {/* Title */}
              <h3 className={`text-xl leading-tight font-semibold sm:text-2xl ${config.textColor}`}>
                {value.title}
              </h3>

              {/* Description */}
              <p className={`text-base leading-relaxed ${config.descriptionTextColor}`}>
                {value.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ValuesSectionCommon;
