// components/ui/YellowButton.tsx
import React from 'react';
import { cn } from '@/lib/utils';

interface YellowButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  fullWidth?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  responsive?: boolean;
}

const ThemeButton: React.FC<YellowButtonProps> = ({
  children,
  onClick,
  variant = 'default',
  size = 'md',
  fullWidth = false,
  loading = false,
  icon,
  iconPosition = 'right',
  className,
  disabled,
  responsive = true,
  ...props
}) => {
  // Base responsive styles
  const baseStyles = cn(
    // Mobile first approach
    'inline-flex items-center justify-center border border-red-200',
    'rounded-full transition-all duration-200 focus:outline-none',
    'focus:ring-2 focus:ring-offset-2 focus:ring-yellow-400',
    'disabled:opacity-50 disabled:cursor-not-allowed',
    // Responsive typography
    'text-xs md:text-sm lg:text-base',
    // Touch target size for mobile (minimum 44px for accessibility)
    'min-h-[44px] md:min-h-auto',
    // Responsive hover effects
    'hover:transform hover:scale-[1.02] active:scale-[0.98]',
    // Responsive transitions
    'transition-all duration-200 ease-in-out',
    // Responsive spacing
    'px-3 py-2.5 md:px-4 md:py-3 lg:px-6 lg:py-3',
    // Responsive shadow
    'shadow-sm hover:shadow-md active:shadow-sm',
  );

  const variants = {
    default: cn('bg-primary hover:bg-primary/90 active:bg-primary text-white', 'border-green-800'),
    outline: cn(
      'bg-transparent border border-black text-black',
      'hover:bg-black hover:text-white hover:border-black',
      'active:bg-primary/90',
    ),
    ghost: cn('bg-transparent text-black hover:bg-[#FFEB3B]/10', 'border-transparent'),
  };

  // Responsive sizes - using breakpoints for different screen sizes
  const responsiveSizes = {
    sm: cn('px-3 py-1.5 md:px-4 md:py-2', 'text-xs md:text-sm', 'rounded-lg md:rounded-full'),
    md: cn(
      'px-4 py-2.5 md:px-5 md:py-3 lg:px-6 lg:py-3',
      'text-sm md:text-base',
      'rounded-lg md:rounded-full',
    ),
    lg: cn(
      'px-5 py-3 md:px-6 md:py-4 lg:px-8 lg:py-4',
      'text-base md:text-lg',
      'rounded-lg md:rounded-full',
    ),
    xl: cn(
      'px-6 py-4 md:px-8 md:py-5 lg:px-10 lg:py-6',
      'text-lg md:text-xl',
      'rounded-lg md:rounded-full',
    ),
  };

  // Fixed sizes (non-responsive)
  const fixedSizes = {
    sm: 'px-4 py-2 text-sm rounded-full',
    md: 'px-6 py-3 text-base rounded-full',
    lg: 'px-8 py-4 text-lg rounded-full',
    xl: 'px-10 py-5 text-xl rounded-full',
  };

  // Choose between responsive or fixed sizing
  const sizeStyles = responsive ? responsiveSizes[size] : fixedSizes[size];

  // Responsive full width behavior
  const fullWidthStyles = cn(
    fullWidth && 'w-full',
    // On mobile, buttons can be block level for better tap targets
    fullWidth && 'sm:w-full md:w-full',
  );

  // Responsive icon sizing
  const iconSizeClass = cn(
    'w-4 h-4 md:w-5 md:h-5', // Responsive icon sizing
    size === 'lg' && 'w-5 h-5 md:w-6 md:h-6',
    size === 'xl' && 'w-6 h-6 md:w-7 md:h-7',
  );

  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={cn(
        baseStyles,
        variants[variant],
        sizeStyles,
        fullWidthStyles,
        // Additional responsive classes
        responsive && 'flex flex-col sm:flex-row items-center justify-center',
        className,
      )}
      // Add aria attributes for better accessibility on touch devices
      aria-busy={loading}
      aria-disabled={disabled || loading}
      {...props}
    >
      <span className="flex items-center justify-center gap-2">
        {loading && (
          <svg
            className={cn('animate-spin', iconSizeClass)}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}

        {!loading && icon && iconPosition === 'left' && (
          <span className={cn('flex-shrink-0', iconSizeClass)}>{icon}</span>
        )}

        {/* Responsive text container */}
        <span
          className={cn(
            'whitespace-nowrap',
            // Responsive text sizing
            responsive && 'text-center sm:text-left',
          )}
        >
          {children}
        </span>

        {!loading && icon && iconPosition === 'right' && (
          <span className={cn('flex-shrink-0', iconSizeClass)}>{icon}</span>
        )}
      </span>
    </button>
  );
};

export default ThemeButton;
