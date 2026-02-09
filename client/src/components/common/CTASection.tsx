import React from 'react';
import { Link, useLocation } from 'wouter';
import ThemeButton from '../ThemeButton';

// ============================================
// TypeScript Interfaces
// ============================================

interface ButtonProps {
  text: string;
  href: string;
  variant?: 'default' | 'outline' | 'ghost' | 'outline_dark';
}

interface CTASectionProps {
  // Content Props
  heading: string;
  description: string;
  button?: ButtonProps;

  // Layout Props
  contentAlignment?: 'center' | 'start' | 'end';

  // Styling Props
  backgroundColor?: string;
  textColor?: string;
  descriptionColor?: string;

  // Container Props
  containerClassName?: string;
  innerClassName?: string;
}

// ============================================
// Main Component
// ============================================

const CTASection: React.FC<CTASectionProps> = ({
  heading,
  description,
  button,
  contentAlignment = 'center',
  backgroundColor = 'bg-primary',
  textColor = 'text-gray-900',
  descriptionColor = 'text-gray-600',
  containerClassName = '',
  innerClassName = '',
}) => {
  const [, navigate] = useLocation();
  // Alignment classes
  const alignmentClasses = {
    center: 'items-center text-center',
    start: 'items-start text-left',
    end: 'items-end text-right',
  };

  // Button variant styles

  return (
    <section className={`py-8 md:py-16   ${containerClassName}`}>
      <div className="containers mx-auto max-w-7xl   ">
        <div
          className={`py-16 px-10 ${backgroundColor} flex flex-col ${alignmentClasses[contentAlignment]} justify-center rounded-3xl  ${innerClassName}`}
        >
          {/* Heading */}
          <h2
            className={`text-3xl sm:text-4xl lg:text-4.5xl font-medium lg:max-w-xl ${textColor} leading-tight`}
          >
            {heading}
          </h2>

          {/* Description */}
          <p
            className={`text-base sm:text-base  ${descriptionColor} leading-relaxed py-4 max-w-2xl`}
          >
            {description}
          </p>

          {/* Optional Button */}
          {button && (
            <div className=" flex justify-center md:text-start ">
              <ThemeButton variant={button.variant} onClick={() => navigate(button.href)}>
                {button.text}
              </ThemeButton>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default CTASection;
