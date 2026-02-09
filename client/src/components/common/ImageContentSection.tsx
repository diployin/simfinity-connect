import React from 'react';
import { Link, useLocation } from 'wouter';
import ThemeButton from '../ThemeButton';

// ============================================
// TypeScript Interfaces
// ============================================

interface ButtonProps {
  text: string;
  href: string;
  variant?: 'primary' | 'secondary';
}

interface ImageContentSectionProps {
  // Content Props
  title: string;
  description: string;
  button?: ButtonProps;

  // Image Props
  imageSrc: string;
  imageAlt: string;

  // Layout Props
  imagePosition?: 'left' | 'right';
  backgroundColor?: string;

  // Optional Props
  titleClassName?: string;
  descriptionClassName?: string;
  containerClassName?: string;
}

const ImageContentSection: React.FC<ImageContentSectionProps> = ({
  title,
  description,
  button,
  imageSrc,
  imageAlt,
  imagePosition = 'right',
  backgroundColor = 'bg-white',
  titleClassName = '',
  descriptionClassName = '',
  containerClassName = '',
}) => {
  // Determine order based on image position
  const imageOrder = imagePosition === 'left' ? 'order-1 lg:order-1' : 'order-2 lg:order-2';
  const contentOrder = imagePosition === 'left' ? 'order-2 lg:order-2' : 'order-1 lg:order-1';

  const [, navigate] = useLocation();

  return (
    <section className={`px-4 py-16 sm:px-6 lg:px-8 ${backgroundColor}`}>
      <div className={`containers mx-auto ${containerClassName}`}>
        <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-12">
          {/* Image Section */}
          <div className={imageOrder}>
            <div className="relative h-[400px] overflow-hidden rounded-[2rem] sm:h-[500px] lg:h-[550px]">
              <img
                src={imageSrc}
                alt={imageAlt}
                className="object-contain"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </div>

          {/* Content Section */}
          <div className={`${contentOrder} space-y-6`}>
            {/* Title */}
            <h2
              className={`lg:text-4.5xl max-w-lg text-3xl leading-tight font-medium text-gray-900 sm:text-4xl text-center md:text-start ${titleClassName}`}
            >
              {title}
            </h2>

            {/* Description */}
            <p
              className={`text-base leading-relaxed text-gray-600 sm:text-base text-center md:text-start ${descriptionClassName}`}
            >
              {description}
            </p>

            {/* Optional Button */}
            {button && (
              <div className=" flex justify-center md:justify-start">
                {/* <Link
                  href={button.href}
                  className={`inline-block rounded-full px-8 py-3.5 text-base font-medium transition-colors duration-200 ${
                    button.variant === 'secondary'
                      ? 'border border-gray-900 bg-gray-900 text-white hover:bg-gray-800'
                      : 'bg-themeYellow hover:bg-themeYellowHover border border-yellow-600 text-black'
                  }`}
                >
                  {button.text}
                </Link> */}

                <ThemeButton variant="outline" onClick={() => navigate('button.href')}>
                  {button.text}
                </ThemeButton>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ImageContentSection;
