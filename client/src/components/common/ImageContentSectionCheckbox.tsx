import React from 'react';

// ============================================
// TypeScript Interfaces
// ============================================

interface BenefitItem {
  text: string;
}

interface ImageContentSectionCheckboxProps {
  // Content Props
  subtitle?: string;
  subtitleIcon?: React.ReactNode; // ✅ NEW - React icon prop
  title: string;
  description: string;
  benefits: BenefitItem[];

  // Image Props
  imageSrc: string;
  imageAlt: string;

  // Layout Props
  imagePosition?: 'left' | 'right';

  // Styling Props
  backgroundColor?: string;
  titleClassName?: string;
  descriptionClassName?: string;
}

// ============================================
// Main Component
// ============================================

const ImageContentSectionCheckbox: React.FC<ImageContentSectionCheckboxProps> = ({
  subtitle = 'Virtual location',
  subtitleIcon, // ✅ NEW
  title,
  description,
  benefits,
  imageSrc,
  imageAlt,
  imagePosition = 'left',
  backgroundColor = 'bg-white',
  titleClassName = '',
  descriptionClassName = '',
}) => {
  // Determine order based on image position
  const imageOrder = imagePosition === 'left' ? 'order-1 lg:order-1' : 'order-2 lg:order-2';
  const contentOrder = imagePosition === 'left' ? 'order-2 lg:order-2' : 'order-1 lg:order-1';

  return (
    <section className={`w-full py-8 md:py-16 ${backgroundColor}`}>
      <div className="containers mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-12">
          {/* Image Section */}
          <div className={`${imageOrder} relative`}>
            <div className="relative flex h-[400px] w-full items-center justify-center sm:h-[500px] lg:h-[600px]">
              <img src={imageSrc} alt={imageAlt}  className="object-contain" />
            </div>
          </div>

          {/* Content Section */}
          <div className={`${contentOrder} space-y-6 sm:space-y-8`}>
            {/* Subtitle with Icon */}
            <div className="flex w-fit items-center gap-2 rounded-3xl bg-gray-100 px-2 py-1">
              {/* ✅ Use passed icon OR default SVG */}
              {subtitleIcon ? (
                <div className="h-5 w-5 text-gray-600">{subtitleIcon}</div>
              ) : (
                <svg
                  className="h-5 w-5 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              )}
              <span className="text-xs font-medium text-gray-600">{subtitle}</span>
            </div>

            {/* Title */}
            <h2
              className={`lg:text-4.5xl text-3xl leading-tight font-medium text-gray-900 sm:text-4xl ${titleClassName}`}
            >
              {title}
            </h2>

            {/* Description */}
            <p
              className={`text-base leading-relaxed text-gray-600 sm:text-base ${descriptionClassName}`}
            >
              {description}
            </p>

            {/* Benefits with Checkmarks */}
            <div className="space-y-2 sm:space-y-3">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-start gap-3 sm:gap-4">
                  <svg
                    className="mt-0.5 h-6 w-6 flex-shrink-0 text-green-500 sm:h-6 sm:w-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span className="text-base leading-relaxed font-medium text-gray-900 sm:text-base">
                    {benefit.text}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ImageContentSectionCheckbox;
