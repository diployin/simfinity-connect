'use client';

import React, { useEffect, useRef, useState } from 'react';

import { Button } from './ui/button';
import Autoplay from 'embla-carousel-autoplay';
import useEmblaCarousel from 'embla-carousel-react';
import { ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'wouter';
import { cn } from '@/lib/utils';

interface MegaMenuItem {
  label: string;
  href: string;
  icon?: React.ReactNode;
  description?: string;
  badge?: string;
}

interface SliderItem {
  id: number;
  title: string;
  description: string;
  image: string;
  href: string;
}

interface MegaMenuColumn {
  title: string;
  items: MegaMenuItem[];
}

interface MegaMenuConfig {
  columns: MegaMenuColumn[];
  slider?: {
    title: string;
    items: SliderItem[];
  };
}

interface MegaMenuDropdownProps {
  label: string;
  badge?: string;
  config: MegaMenuConfig;
  onOpenChange?: (isOpen: boolean) => void;
}

const MegaMenuDropdown: React.FC<MegaMenuDropdownProps> = ({
  label,
  badge,
  config,
  onOpenChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const autoplayRef = useRef(Autoplay({ delay: 4000, stopOnInteraction: true }));

  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: 'start' }, [
    autoplayRef.current,
  ]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Outside click handler
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        onOpenChange?.(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onOpenChange]);

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
        onOpenChange?.(false);
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onOpenChange]);

  // Embla carousel handlers
  useEffect(() => {
    if (!emblaApi) return;

    const onSelect = () => {
      setSelectedIndex(emblaApi.selectedScrollSnap());
    };

    emblaApi.on('select', onSelect);
    onSelect();

    return () => {
      emblaApi.off('select', onSelect);
    };
  }, [emblaApi]);

  const handleToggle = () => {
    const newState = !isOpen;
    setIsOpen(newState);
    onOpenChange?.(newState);
  };

  const scrollPrev = () => emblaApi?.scrollPrev();
  const scrollNext = () => emblaApi?.scrollNext();
  const scrollTo = (index: number) => emblaApi?.scrollTo(index);

  const closeMenu = () => {
    setIsOpen(false);
    onOpenChange?.(false);
  };

  return (
    <div ref={menuRef} className="relative hidden lg:block">
      {/* Trigger Button */}
      <button
        type="button"
        onClick={handleToggle}
        className={cn('flex items-center gap-1 py-2 text-sm font-medium  transition-colors ')}
      >
        {label}
        {badge && (
          <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-700">
            {badge}
          </span>
        )}
        <ChevronDown
          className={`h-4 w-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Full Width Mega Menu Dropdown */}
      {isOpen && (
        <>
          {/* Overlay with Blur Background */}
          <div className="fixed inset-0 z-40" onClick={closeMenu} />

          {/* Mega Menu */}
          <div className="fixed top-[69px] right-0 left-0 z-50">
            <div className="mx-auto">
              <div className="over overflow-hidden border border-gray-200 shadow-2xl backdrop-blur-2xl">
                <div className="grid grid-cols-12 gap-0">
                  {/* Left Side - Menu Items */}
                  <div
                    className={`${config.slider ? 'col-span-8' : 'col-span-12'} bg-white px-8 py-10`}
                  >
                    <div className="grid grid-cols-2 gap-x-12 gap-y-8">
                      {config.columns.map((column, colIndex) => (
                        <div key={colIndex} className="space-y-5">
                          {/* Column Title */}
                          <h4 className="text-xs font-semibold tracking-wider text-gray-500 uppercase">
                            {/* {column.title} */}
                          </h4>

                          {/* Column Items */}
                          <ul className="space-y-2">
                            {column.items.map((item, itemIndex) => (
                              <li key={itemIndex}>
                                <Link
                                  href={item.href}
                                  className="group flex items-start gap-3 rounded-lg p-3 transition-all hover:bg-gray-50"
                                  onClick={closeMenu}
                                >
                                  {/* Icon */}
                                  {item.icon && (
                                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-yellow-400 text-black transition-transform group-hover:scale-110">
                                      {item.icon}
                                    </div>
                                  )}

                                  {/* Content */}
                                  <div className="flex-1 pt-0.5">
                                    <div className="flex items-center gap-2">
                                      <span className="text-sm font-semibold text-gray-900 group-hover:text-gray-700">
                                        {item.label}
                                      </span>
                                      {item.badge && (
                                        <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-700">
                                          {item.badge}
                                        </span>
                                      )}
                                    </div>
                                    {item.description && (
                                      <p className="mt-1 text-xs leading-relaxed text-gray-500">
                                        {item.description}
                                      </p>
                                    )}
                                  </div>
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Right Side - Slider */}
                  {config.slider && (
                    <div className="b col-span-4 bg-white/85 px-6 py-10">
                      <div className="flex h-full flex-col">
                        <h4 className="mb-6 text-sm font-semibold text-gray-700">
                          {config.slider.title}
                        </h4>

                        {/* Custom Carousel */}
                        <div className="relative flex-1">
                          <div className="overflow-hidden" ref={emblaRef}>
                            <div className="flex">
                              {config.slider.items.map((slide) => (
                                <div key={slide.id} className="min-w-0 flex-[0_0_100%]">
                                  <Link
                                    href={slide.href}
                                    className="block px-2"
                                    onClick={closeMenu}
                                  >
                                    <div className="overflow-hidden rounded-2xl bg-white shadow-sm transition-all hover:shadow-md">
                                      {/* Image */}
                                      <div className="relative h-56 w-full overflow-hidden">
                                        <img
                                          src={slide.image}
                                          alt={slide.title}
                                          className="object-cover transition-transform duration-300 hover:scale-105"
                                        />
                                      </div>

                                      {/* Content */}
                                      <div className="p-5">
                                        <h5 className="mb-2 text-lg font-semibold text-gray-900">
                                          {slide.title}
                                        </h5>
                                        <p className="text-sm leading-relaxed text-gray-600">
                                          {slide.description}
                                        </p>
                                      </div>
                                    </div>
                                  </Link>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Navigation Buttons */}
                          <div className="mt-6 flex items-center justify-center gap-3">
                            {/* Pagination Dots */}
                            <div className="flex gap-2">
                              {config.slider.items.map((_, index) => (
                                <button
                                  key={index}
                                  onClick={() => scrollTo(index)}
                                  className={`h-2 w-2 rounded-full transition-all ${
                                    index === selectedIndex
                                      ? 'w-6 bg-gray-700'
                                      : 'bg-gray-300 hover:bg-gray-400'
                                  }`}
                                  aria-label={`Go to slide ${index + 1}`}
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Bottom Section */}
                <div className="flex w-full items-center justify-between border-t border-gray-200 bg-gray-50 px-8 py-4">
                  <Link
                    href="/esim-supported-devices"
                    className="flex items-center gap-2 text-sm font-medium text-gray-900 hover:text-gray-600"
                    onClick={closeMenu}
                  >
                    <span className="flex h-5 w-5 items-center justify-center rounded-full border border-gray-400 text-xs">
                      ?{' '}
                    </span>
                    Is Your Device eSIM Compatible?
                  </Link>
                  <Button>Download Soon</Button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default MegaMenuDropdown;
