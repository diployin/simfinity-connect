import React from 'react';
import { Link } from 'wouter';

// ============================================
// TypeScript Interfaces
// ============================================

interface ButtonProps {
  text: string;
  href: string;
  variant?: 'black' | 'white' | 'yellow';
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
  // Alignment classes
  const alignmentClasses = {
    center: 'items-center text-center',
    start: 'items-start text-left',
    end: 'items-end text-right',
  };

  // Button variant styles
  const getButtonStyles = (variant: 'black' | 'white' | 'yellow' = 'black'): string => {
    const variants = {
      black: 'bg-black hover:bg-gray-900 text-white border-black',
      white: 'hover:bg-black hover:text-white text-black',
      yellow: 'bg-themeYellow hover:bg-themeYellowHover text-black border-yellow-600',
    };

    return variants[variant];
  };

  return (
    <section className={`py-8 md:py-16 px-4 sm:px-6 lg:px-8  ${containerClassName}`}>
      <div className="containers mx-auto max-w-7xl">
        <div
          className={`py-16 px-4 sm:px-6 lg:px-8 ${backgroundColor} flex flex-col ${alignmentClasses[contentAlignment]} justify-center rounded-4xl  ${innerClassName}`}
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
            <div>
              <Link
                href={button.href}
                className={`inline-block ${getButtonStyles(button.variant)} border px-8 py-3.5 rounded-full font-medium text-base transition-colors duration-200`}
              >
                {button.text}
              </Link>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default CTASection;
