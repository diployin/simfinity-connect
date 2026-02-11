'use client';

import React from 'react';
import { ChevronRightIcon, Globe } from 'lucide-react';
import ReactCountryFlag from 'react-country-flag';
import { useCurrency } from '@/contexts/CurrencyContext';

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
  isfrom?: boolean;
  isname?: boolean;
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

  const { currency, currencies } = useCurrency();

  const getCurrencySymbol = (currencyCode: string) => {
    return currencies.find((c) => c.code === currencyCode)?.symbol || '$';
  };

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
      className="group cursor-pointer flex items-center justify-between p-3 sm:p-4 md:p-5 border border-gray-200 shadow-sm rounded-xl sm:rounded-2xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 animate-in fade-in slide-in-from-bottom-4 bg-[#F7F7F8] w-full"
    >
      <div className="flex items-center gap-2 sm:gap-3 md:gap-4 min-w-0">
        <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center overflow-hidden rounded-full bg-white shadow-sm flex-shrink-0">
          {renderIcon()}
        </div>
        <div className="text-left min-w-0">
          <h3 className="text-sm sm:text-base md:text-lg font-bold text-black truncate leading-tight">
            {name}
          </h3>
          <p className="text-[10px] sm:text-xs md:text-sm text-gray-500 font-medium whitespace-nowrap overflow-hidden text-ellipsis">
            From {getCurrencySymbol(currency)}
            <span className="font-bold text-primary">
              {startPrice.toFixed(2)}
            </span>
            {additionalInfo && <span className="hidden xs:inline"> • {additionalInfo}</span>}
          </p>
        </div>
      </div>

      <ChevronRightIcon className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 group-hover:text-black transition-colors flex-shrink-0 ml-1" />
    </button>
  );
};

export default DestinationCardSmall;
