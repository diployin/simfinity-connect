'use client';

import React from 'react';
import { ChevronRightIcon, Globe } from 'lucide-react';
import ReactCountryFlag from 'react-country-flag';

interface DestinationCardProps {
  id: number;
  name: string;
  slug: string;
  image?: string;
  countryCode?: string;
  startPrice: number;
  fallbackIcon?: string;
  additionalInfo?: string;
  onClick: (slug: string) => void;
  index?: number;
  type?: 'country' | 'region' | 'global';
  isfrom: boolean;
  isname: boolean;
}

const DestinationCardSmall: React.FC<DestinationCardProps> = ({
  name,
  slug,
  image,
  countryCode,
  startPrice,
  fallbackIcon = '🌍',
  additionalInfo,
  onClick,
  index = 0,
  type = 'country',
}) => {
  // Render icon based on priority: image -> country flag -> fallback
  const renderIcon = () => {
    // Helper function to check if value is valid (not null, undefined, or empty string)
    const isValidValue = (value: string | null | undefined): boolean => {
      return value != null && value.trim() !== '';
    };

    // Priority 1: If image URL exists and is valid, use it
    if (isValidValue(image)) {
      return (
        <img
          src={image!}
          alt={`${name} destination`}
          className="h-full w-full object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.style.display = 'none';
            const parent = target.parentElement;
            if (parent) {
              parent.innerHTML = `<span class="text-2xl">${fallbackIcon}</span>`;
            }
          }}
        />
      );
    }

    if (isValidValue(countryCode)) {
      return (
        <ReactCountryFlag
          countryCode={countryCode!}
          svg
          style={{
            width: '48px',
            height: '48px',
            objectFit: 'cover',
            borderRadius: '50%',
          }}
        />
      );
    }

    // Priority 3: For global/region without specific flag, show Globe icon
    if (type === 'global') {
      return <Globe className="h-6 w-6 text-gray-500" />;
    }

    // Priority 4: Fallback emoji
    return <span className="text-2xl">{fallbackIcon}</span>;
  };

  return (
    <button
      type="button"
      onClick={() => onClick(slug)}
      style={{
        animationDelay: `${index * 50}ms`,
      }}
      className="group cursor-pointer flex items-center justify-between p-5  border border-gray-200   shadow-sm sm:w-auto rounded-2xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 animate-in fade-in slide-in-from-bottom-4 bg-[#F7F7F8]"
    >
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-white shadow-sm flex-shrink-0">
          {renderIcon()}
        </div>
        <div className="text-left">
          <h3 className="text-base sm:text-lg font-semibold text-black">{name}</h3>
          <p className="text-sm text-gray-500 font-normal">
            From US${startPrice.toFixed(2)}
            {additionalInfo && ` • ${additionalInfo}`}
          </p>
        </div>
      </div>

      <ChevronRightIcon className="h-5 w-5 text-gray-400 group-hover:text-black transition-colors flex-shrink-0" />
    </button>
  );
};

export default DestinationCardSmall;
