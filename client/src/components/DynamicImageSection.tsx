// components/sections/DynamicImageSection.tsx
'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { CheckCircle, ArrowRight } from 'lucide-react';
import ThemeButton from './ThemeButton';

// Types
export type ContentItem = {
  id: string;
  text: string;
  icon?: React.ReactNode;
};

export type ButtonConfig = {
  text: string;
  onClick: () => void;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
};

export interface DynamicImageSectionProps {
  // Layout
  imagePosition?: 'left' | 'right';
  imageSrc: string;
  imageAlt: string;

  // Content
  title: string;
  description: string;

  // Dynamic Content Type
  contentType: 'list' | 'buttons' | 'text';

  // Content based on type
  listItems?: ContentItem[];
  buttons?: ButtonConfig[];
  additionalText?: string;

  // Styling
  className?: string;
  imageClassName?: string;
  contentClassName?: string;
  showDivider?: boolean;
  reverseOnMobile?: boolean;
}

const DynamicImageSection: React.FC<DynamicImageSectionProps> = ({
  imagePosition = 'left',
  imageSrc,
  imageAlt,
  title,
  description,
  contentType,
  listItems = [],
  buttons = [],
  additionalText = '',
  className = '',
  imageClassName = '',
  contentClassName = '',
  showDivider = false,
  reverseOnMobile = true,
}) => {
  // Determine grid order based on image position
  const isImageLeft = imagePosition === 'left';

  const renderContent = () => {
    switch (contentType) {
      case 'list':
        return (
          <ul className="space-y-3 mt-6">
            {listItems.map((item) => (
              <li key={item.id} className="flex items-start gap-3">
                {item.icon || (
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                )}
                <span className="text-gray-700">{item.text}</span>
              </li>
            ))}
          </ul>
        );

      case 'buttons':
        return (
          <div className="flex flex-wrap gap-4 mt-6">
            {buttons.map((button, index) => (
              <ThemeButton
                key={index}
                onClick={button.onClick}
                variant={button.variant || 'default'}
                size={button.size || 'md'}
                icon={button.icon}
                className="min-w-[140px]"
              >
                {button.text}
              </ThemeButton>
            ))}
          </div>
        );

      case 'text':
        return (
          <div className="mt-6">
            <p className="text-gray-700 whitespace-pre-line">{additionalText}</p>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <section className={cn('py-12 md:py-20', showDivider && 'border-t border-gray-100', className)}>
      <div className="container mx-auto px-4">
        <div
          className={cn(
            'grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center',
            reverseOnMobile && 'flex flex-col-reverse lg:grid',
            isImageLeft
              ? reverseOnMobile
                ? 'lg:grid-cols-2'
                : 'lg:grid-cols-2'
              : reverseOnMobile
                ? 'lg:grid-cols-2 lg:grid-flow-dense'
                : 'lg:grid-cols-2 lg:grid-flow-dense',
          )}
        >
          {/* Image Column */}
          <div className={cn('order-1', isImageLeft ? 'lg:order-1' : 'lg:order-2', imageClassName)}>
            <div className="relative rounded-2xl overflow-hidden shadow-xl">
              <img
                src={imageSrc}
                alt={imageAlt}
                className="w-full h-auto object-cover"
                loading="lazy"
              />
              {/* Optional overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />
            </div>
          </div>

          {/* Content Column */}
          <div
            className={cn('order-2', isImageLeft ? 'lg:order-2' : 'lg:order-1', contentClassName)}
          >
            <div className="max-w-lg mx-auto lg:mx-0">
              {/* Title */}
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 leading-tight">
                {title}
              </h2>

              {/* Description */}
              <p className="text-lg md:text-xl text-gray-600 mb-6">{description}</p>

              {/* Dynamic Content */}
              {renderContent()}

              {/* Additional text for any type */}
              {additionalText && contentType !== 'text' && (
                <p className="mt-6 text-gray-600">{additionalText}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DynamicImageSection;
