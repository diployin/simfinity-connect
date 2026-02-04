'use client';

import React, { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import DestinationCardSmall from '@/components/cards/DestinationCard';
import { Sparkles, Search } from 'lucide-react';

export interface Region {
  id: string;
  airaloId: string | null;
  slug: string;
  name: string;
  image: string | null;
  countries: string[];
  active: boolean;
  createdAt: string;
  updatedAt: string;
  minPrice: string;
  minDataAmount: string;
  minValidity: number;
  packageCount: number;
  currency: string;
}

interface AllRegionsSectionProps {
  limit?: number;
  currency?: string;
  convertPrice?: (price: number) => number;
}

const AllRegionsSection: React.FC<AllRegionsSectionProps> = ({ limit, convertPrice }) => {
  const [search, setSearch] = useState('');

  /* =========================
     API
  ========================= */
  const {
    data = [],
    isLoading,
    isError,
  } = useQuery<Region[]>({
    queryKey: ['/api/regions/with-pricing'],
  });

  /* =========================
     FILTER + FORMAT
  ========================= */
  const regions = useMemo(() => {
    const filtered = data
      .filter((r) => r.active)
      .filter((r) => r.name?.toLowerCase() !== 'global')
      .filter((r) => r.name.toLowerCase().includes(search.toLowerCase()));

    const sliced = limit ? filtered.slice(0, limit) : filtered;

    return sliced.map((region) => {
      const price = region.minPrice ? parseFloat(region.minPrice) : 0;

      return {
        id: Number(region.id),
        name: region.name,
        slug: region.slug,
        image: region.image || undefined,
        startPrice: convertPrice ? convertPrice(price) : price,
        additionalInfo: `${region.countries?.length || 0} countries`,
        type: 'region' as const,
      };
    });
  }, [data, search, limit, convertPrice]);

  const totalRegions = data.filter((r) => r.active && r.name?.toLowerCase() !== 'global').length;

  /* =========================
     STATES
  ========================= */
  if (isLoading) {
    return <div className="py-12 text-center text-gray-500">Loading regions...</div>;
  }

  if (isError) {
    return <div className="py-12 text-center text-red-500">Failed to load regions</div>;
  }

  /* =========================
     UI
  ========================= */
  return (
    <section className="w-full py-12">
      <div className="container mx-auto max-w-7xl px-4 mt-32">
        {/* ===== HEADER ===== */}
        <div className="mb-10 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-purple-100 px-4 py-2 text-sm font-medium text-purple-700">
            <Sparkles className="h-4 w-4" />
            Regional Plans
          </div>

          <h2 className="text-3xl font-bold">Browse Regions</h2>

          <p className="mt-2 text-gray-600">
            One eSIM plan covering multiple countries in a region
          </p>
        </div>

        {/* ===== TOP BAR ===== */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          {/* Count */}
          <div className="rounded-xl bg-white px-5 py-3 shadow border text-sm font-semibold">
            Total Regions: {totalRegions}
          </div>

          {/* Search */}
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

            <input
              type="text"
              placeholder="Search region"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border bg-white py-3 pl-9 pr-4 shadow-sm outline-none focus:ring-2 focus:ring-black"
            />
          </div>
        </div>

        <p className="mb-6 text-sm text-gray-500">Showing {regions.length} regions</p>

        {/* ===== GRID ===== */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {regions.map((r, i) => (
            <DestinationCardSmall
              key={r.id}
              {...r}
              index={i}
              onClick={(slug) => (window.location.href = `/region/${slug}`)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default AllRegionsSection;
