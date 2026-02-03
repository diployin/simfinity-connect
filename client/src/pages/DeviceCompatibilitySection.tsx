'use client';

import React, { ReactNode, useMemo, useState } from 'react';

import { usePublicApiHandler } from '@/lib/apiHandler/usePublicApiHandler';

import { Globe, Laptop, Smartphone, Tablet, Watch } from 'lucide-react';

interface Device {
  model: string;
  os: string;
  brand: string;
  name: string;
}

interface ApiResponse {
  success: boolean;
  data: Device[];
}

interface DeviceModel {
  name: string;
  model: string;
}

interface DeviceBrand {
  id: string;
  brand: string;
  models: DeviceModel[];
}

interface DeviceCategory {
  id: string;
  name: string;
  icon: ReactNode;
  brands: DeviceBrand[];
}

interface UsePublicApiHandlerResult<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

// Props interface
interface DeviceCompatibilitySectionProps {
  apiUrl?: string;
}

const DeviceCompatibilitySection: React.FC<DeviceCompatibilitySectionProps> = ({
  apiUrl = '/deviceCompatible',
}) => {
  const [activeTab, setActiveTab] = useState<string>('smartphones');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [openAccordions, setOpenAccordions] = useState<Set<string>>(new Set());

  // API call using your custom hook
  const {
    data: deviceApiData,
    isLoading,
    error,
  } = usePublicApiHandler<ApiResponse>({
    url: apiUrl,
  });

  // ============================================
  // Helper Functions (Pure Functions)
  // ============================================

  const getDeviceCategory = (os: string, brand: string): string => {
    const brandLower = brand.toLowerCase();
    const osLower = os.toLowerCase();

    if (brandLower.includes('watch') || osLower.includes('watch')) return 'smartwatches';
    if (brandLower.includes('ipad') || brandLower.includes('tab') || brandLower.includes('tablet'))
      return 'tablets';
    if (
      brandLower.includes('laptop') ||
      brandLower.includes('surface') ||
      brandLower.includes('thinkpad')
    )
      return 'laptops';

    return 'smartphones';
  };

  const normalizeBrandName = (brand: string): string => {
    const brandLower = brand.toLowerCase();

    const brandMap: Record<string, string> = {
      apple: 'Apple',
      iphone: 'Apple',
      samsung: 'Samsung',
      google: 'Google',
      pixel: 'Google',
      xiaomi: 'Xiaomi',
      mi: 'Xiaomi',
      oneplus: 'OnePlus',
      oppo: 'OPPO',
      vivo: 'Vivo',
      huawei: 'Huawei',
      motorola: 'Motorola',
      moto: 'Motorola',
      nokia: 'Nokia',
      sony: 'Sony',
      lg: 'LG',
    };

    for (const [key, value] of Object.entries(brandMap)) {
      if (brandLower.includes(key)) return value;
    }

    return brand.charAt(0).toUpperCase() + brand.slice(1).toLowerCase();
  };

  const getCategoryIcon = (category: string): React.ReactNode => {
    const iconProps = { className: 'h-6 w-6', strokeWidth: 2 };

    const icons: Record<string, React.ReactNode> = {
      smartphones: <Smartphone {...iconProps} />,
      smartwatches: <Watch {...iconProps} />,
      tablets: <Tablet {...iconProps} />,
      laptops: <Laptop {...iconProps} />,
    };

    return icons[category] ?? <Smartphone {...iconProps} />;
  };

  // ============================================
  // Data Transformation (Memoized)
  // ============================================

  const deviceCategories = useMemo((): DeviceCategory[] => {
    if (!deviceApiData?.success || !deviceApiData?.data || deviceApiData.data.length === 0) {
      return [];
    }

    const categoryGroups: Record<string, Record<string, Device[]>> = {};

    deviceApiData.data.forEach((device) => {
      const category = getDeviceCategory(device.os, device.brand);
      const normalizedBrand = normalizeBrandName(device.brand);

      if (!categoryGroups[category]) {
        categoryGroups[category] = {};
      }
      if (!categoryGroups[category][normalizedBrand]) {
        categoryGroups[category][normalizedBrand] = [];
      }
      categoryGroups[category][normalizedBrand].push(device);
    });

    const categories = Object.entries(categoryGroups).map(([categoryId, brands]) => {
      const categoryName = categoryId.charAt(0).toUpperCase() + categoryId.slice(1);

      const brandData: DeviceBrand[] = Object.entries(brands).map(([brandName, devices]) => ({
        id: `${categoryId}-${brandName.toLowerCase().replace(/\s+/g, '-')}`,
        brand: brandName,
        models: devices.map((device) => ({
          name: device.name,
          model: device.model,
        })),
      }));

      return {
        id: categoryId,
        name: categoryName,
        icon: getCategoryIcon(categoryId),
        brands: brandData.toSorted((a, b) => a.brand.localeCompare(b.brand)),
      };
    });

    const categoryOrder = ['smartphones', 'tablets', 'smartwatches', 'laptops'];

    return categories.sort((a, b) => {
      const indexA = categoryOrder.indexOf(a.id);
      const indexB = categoryOrder.indexOf(b.id);

      return (indexA === -1 ? 999 : indexA) - (indexB === -1 ? 999 : indexB);
    });
  }, [deviceApiData]);

  // Filter devices based on search and active tab
  const filteredData = useMemo((): DeviceCategory | null => {
    const currentCategory = deviceCategories.find((cat) => cat.id === activeTab);
    if (!currentCategory) return null;

    if (!searchQuery.trim()) return currentCategory;

    const lowerQuery = searchQuery.toLowerCase();

    return {
      ...currentCategory,
      brands: currentCategory.brands
        .map((brand) => ({
          ...brand,
          models: brand.models.filter(
            (model) =>
              model.name.toLowerCase().includes(lowerQuery) ||
              model.model.toLowerCase().includes(lowerQuery) ||
              brand.brand.toLowerCase().includes(lowerQuery),
          ),
        }))
        .filter((brand) => brand.models.length > 0),
    };
  }, [activeTab, searchQuery, deviceCategories]);

  // ============================================
  // Event Handlers
  // ============================================

  const toggleAccordion = (brandId: string): void => {
    setOpenAccordions((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(brandId)) {
        newSet.delete(brandId);
      } else {
        newSet.add(brandId);
      }

      return newSet;
    });
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setSearchQuery(e.target.value);
  };

  const clearSearch = (): void => {
    setSearchQuery('');
  };

  const handleTabChange = (tabId: string): void => {
    setActiveTab(tabId);
  };

  // ============================================
  // Utility Functions
  // ============================================

  const getTotalDevices = (category: DeviceCategory): number => {
    return category.brands.reduce((total, brand) => total + brand.models.length, 0);
  };

  const getResultCount = (): number => {
    if (!filteredData) return 0;

    return getTotalDevices(filteredData);
  };

  // ============================================
  // Loading State
  // ============================================

  if (isLoading) {
    return (
      <section className="w-full bg-gray-50 py-16 sm:py-20 lg:py-24">
        <div className="containers mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex min-h-[400px] flex-col items-center justify-center">
            <div className="mb-4 h-16 w-16 animate-spin rounded-full border-b-4 border-black"></div>
            <p className="text-lg text-gray-600">Loading compatible devices...</p>
          </div>
        </div>
      </section>
    );
  }

  // ============================================
  // Error State
  // ============================================

  if (error || !deviceApiData?.success) {
    return (
      <section className="w-full bg-gray-50 py-16 sm:py-20 lg:py-24">
        <div className="containers mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex min-h-[400px] flex-col items-center justify-center">
            <div className="max-w-md rounded-2xl bg-white p-8 text-center shadow-xl">
              <div className="mb-4 text-6xl">⚠️</div>
              <h2 className="mb-2 text-2xl font-bold text-gray-900">Unable to Load Devices</h2>
              <p className="mb-6 text-gray-600">
                We couldn&apos;t fetch the device compatibility data. Please try again later.
              </p>
              <button
                onClick={() => window.location.reload()}
                className="rounded-full bg-black px-6 py-3 text-white transition-colors hover:bg-gray-800"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // ============================================
  // No Data State
  // ============================================

  if (!deviceApiData?.data || deviceCategories.length === 0) {
    return (
      <section className="w-full bg-gray-50 py-16 sm:py-20 lg:py-24">
        <div className="containers mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex min-h-[400px] flex-col items-center justify-center">
            <div className="mb-4 text-6xl">📱</div>
            <h2 className="mb-2 text-2xl font-bold text-gray-900">No Devices Available</h2>
            <p className="text-gray-600">Device data is currently unavailable.</p>
          </div>
        </div>
      </section>
    );
  }

  // ============================================
  // Main Render
  // ============================================

  return (
    <section className="w-full bg-gray-50 py-16 sm:py-20 lg:py-24">
      <div className="containers mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="mb-12 text-center">
          <h1 className="mb-6 text-4xl font-medium text-gray-900 sm:text-5xl lg:text-5xl">
            Devices that support eSIMs
          </h1>

          <p className="mx-auto mb-8 max-w-2xl text-base text-gray-600 sm:text-lg">
            Only devices that are carrier-unlocked and support eSIM technology can use Simfinity.
          </p>

          {/* Search Bar */}
          <div className="relative mx-auto max-w-lg">
            <div className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 transform text-gray-400">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search for device"
              value={searchQuery}
              onChange={handleSearchChange}
              className="h-14 w-full rounded-full border border-gray-300 bg-white py-3 pr-12 pl-12 text-base shadow-sm transition-colors focus:border-gray-400 focus:ring-2 focus:ring-gray-200 focus:outline-none"
            />
            {searchQuery && (
              <button
                onClick={clearSearch}
                className="absolute top-1/2 right-4 -translate-y-1/2 transform text-gray-400 transition-colors hover:text-gray-600"
                aria-label="Clear search"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>
      <div className="bg-white py-16">
        <div className="containers mx-auto">
          {/* Tab Buttons */}
          <div className="mb-12 flex w-fit flex-wrap justify-center gap-3 rounded-3xl border p-1 md:justify-start">
            {deviceCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => handleTabChange(category.id)}
                className={`rounded-full px-6 py-1 text-sm font-medium transition-all duration-200 md:text-base ${
                  activeTab === category.id ? 'bg-black text-white' : 'bg-white text-gray-700'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>

          {/* Content Area */}
          {filteredData && (
            <div className="animate-fadeIn">
              {/* Category Header */}
              <div className="mb-8 text-start">
                <div className="bg-themeYellow mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg">
                  <span className="text-3xl" aria-hidden="true" aria-label={filteredData.name}>
                    {filteredData.icon}
                  </span>
                </div>
                <h2 className="text-2.5xl mb-2 font-semibold text-black sm:text-4xl">
                  {filteredData.name}
                </h2>
                <p className="pt-2 text-gray-600">
                  Simfinity is available on most {filteredData.name.toLowerCase()}:
                  {searchQuery && (
                    <span className="mt-2 block text-sm">
                      Showing {getResultCount()} result{getResultCount() !== 1 ? 's' : ''} for
                      &quot;{searchQuery}&quot;
                    </span>
                  )}
                </p>
              </div>

              {/* Device Accordions */}
              {filteredData.brands.length > 0 ? (
                <div className="mx-auto max-w-4xl">
                  {filteredData.brands.map((brand) => {
                    const isOpen = openAccordions.has(brand.id);

                    return (
                      <div key={brand.id} className="overflow-hidden border-b">
                        {/* Accordion Header */}
                        <button
                          onClick={() => toggleAccordion(brand.id)}
                          className="t flex w-full items-center justify-between py-5 text-left"
                          aria-expanded={isOpen}
                          aria-controls={`accordion-content-${brand.id}`}
                        >
                          <div className="flex items-center gap-4">
                            <div>
                              <span className="block text-xl font-medium text-gray-900">
                                {brand.brand}
                              </span>
                              {/* <span className="text-sm text-gray-500">
                              {brand.models.length} compatible {brand.models.length === 1 ? 'model' : 'models'}
                            </span> */}
                            </div>
                          </div>
                          <svg
                            className={`h-5 w-5 text-gray-500 transition-transform duration-200 ${
                              isOpen ? 'rotate-180' : ''
                            }`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 9l-7 7-7-7"
                            />
                          </svg>
                        </button>

                        {/* Accordion Content */}
                        {isOpen && (
                          <div
                            id={`accordion-content-${brand.id}`}
                            className="border-t border-gray-200 px-6 py-6"
                          >
                            <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                              {brand.models.map((model, index) => (
                                <li
                                  key={`${model.model}-${index}`}
                                  className="flex items-start gap-3 rounded-lg bg-white p-3 shadow-sm"
                                >
                                  <svg
                                    className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-500"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M5 13l4 4L19 7"
                                    />
                                  </svg>
                                  <div className="min-w-0 flex-1">
                                    <span className="block truncate text-sm font-medium text-gray-900">
                                      {model.name}
                                    </span>
                                    <span className="block truncate text-xs text-gray-500">
                                      {model.model}
                                    </span>
                                  </div>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="py-16 text-center">
                  <span className="mb-4 block text-6xl" aria-hidden="true">
                    🔍
                  </span>
                  <span className="sr-only">No results found</span>
                  <h3 className="mb-2 text-lg font-medium text-gray-900">No devices found</h3>
                  <p className="mb-4 text-gray-600">
                    Try a different search term or check another category
                  </p>
                  <button
                    onClick={clearSearch}
                    className="rounded-full border border-gray-300 bg-white px-6 py-2 text-gray-700 transition-colors hover:border-gray-400 hover:bg-gray-50"
                  >
                    Clear search
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default DeviceCompatibilitySection;
