'use client';

import React, { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import DestinationCardSmall from '@/components/cards/DestinationCard';
import { Sparkles, Search } from 'lucide-react';

export interface Destination {
  id: string;
  airaloId: string | null;
  slug: string;
  name: string;
  countryCode: string;
  flagEmoji: string | null;
  image: string | null;
  active: boolean;
  minPrice: string;
  minDataAmount: string;
  minValidity: number;
  packageCount: number;
  currency: string;
}

interface AllCountriesSectionProps {
  limit?: number;
}

const AllCountriesSection: React.FC<AllCountriesSectionProps> = ({ limit }) => {
  const [search, setSearch] = useState('');

  /* =========================
     API CALL
  ========================= */
  const {
    data = [],
    isLoading,
    isError,
  } = useQuery<Destination[]>({
    queryKey: ['/api/destinations/with-pricing'],
  });

  /* =========================
     FILTER + FORMAT
  ========================= */
  const countries = useMemo(() => {
    const filtered = data
      .filter((d) => d.active)
      .filter((d) => d.name.toLowerCase().includes(search.toLowerCase()));

    const sliced = limit ? filtered.slice(0, limit) : filtered;

    return sliced.map((dest) => ({
      id: Number(dest.id),
      name: dest.name,
      slug: dest.slug,
      countryCode: dest.countryCode,
      image: dest.image || undefined,
      startPrice: dest.minPrice ? parseFloat(dest.minPrice) : 0,
      type: 'country' as const,
    }));
  }, [data, limit, search]);

  const totalCountries = data.filter((d) => d.active).length;

  /* =========================
     STATES
  ========================= */
  if (isLoading) {
    return <div className="py-12 text-center text-gray-500">Loading destinations...</div>;
  }

  if (isError) {
    return <div className="py-12 text-center text-red-500">Failed to load destinations</div>;
  }

  /* =========================
     UI
  ========================= */
  return (
    <section className="w-full py-12">
      <div className="container mx-auto max-w-7xl px-4 mt-32">
        {/* ===== HEADER ===== */}
        <div className="mb-12 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-blue-100 px-4 py-2 text-sm font-medium text-blue-700">
            <Sparkles className="h-4 w-4" />
            Global Coverage
          </div>

          <h1 className="mb-6 text-4xl font-medium text-gray-900 md:text-5xl">All Country Plans</h1>

          <p className="mx-auto mb-8 max-w-3xl text-lg text-gray-600">
            Find the best data plans worldwide and connect instantly with our premium eSIM
            solutions.
          </p>
        </div>

        {/* ===== TOP BAR (COUNT + SEARCH) ===== */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          {/* Count Badge */}
          <div className="rounded-xl bg-white px-5 py-3 shadow border text-sm font-semibold">
            Total Countries: {totalCountries}
          </div>

          {/* Search */}
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

            <input
              type="text"
              placeholder="Search for country"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border bg-white py-3 pl-9 pr-4 shadow-sm outline-none focus:ring-2 focus:ring-black"
            />
          </div>
        </div>

        {/* Showing count */}
        <p className="mb-6 text-sm text-gray-500">Showing {countries.length} countries</p>

        {/* ===== GRID ===== */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {countries.map((c, i) => (
            <DestinationCardSmall
              key={c.id}
              {...c}
              startPrice={c.startPrice}
              index={i}
              onClick={(slug) => (window.location.href = `/destination/${slug}`)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default AllCountriesSection;
