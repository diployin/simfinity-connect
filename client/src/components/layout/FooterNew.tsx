'use client';

import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { useSettingByKey } from '@/hooks/useSettings';
import { Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { SettingsState } from '@/redux/slice/settingsSlice';
import { PageApiResponse } from '@/types/types';
import { FaInstagram, FaFacebookF, FaYoutube, FaLinkedinIn } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import { SiVisa, SiMastercard, SiApplepay, SiGooglepay } from 'react-icons/si';

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

const FooterNew = () => {
  const logo = useSettingByKey('logo');
  const siteName = useSettingByKey('platform_name');

  // OLD APIs - same as first footer
  const { data: allDestinations = [], isLoading: loadingDestinations } = useQuery<Destination[]>({
    queryKey: ['/api/destinations/with-pricing'],
  });

  const { data: settings } = useQuery<SettingsState>({
    queryKey: ['/api/public/settings'],
  });

  const { data: pages } = useQuery<PageApiResponse>({
    queryKey: ['/api/pages'],
    queryFn: async () => {
      const res = await fetch('/api/pages');
      return res.json();
    },
  });

  // Safe social links - EXACT same from old footer
  const getSocialUrl = (socialValue?: string | string[]) => {
    if (!socialValue) return '#';
    return Array.isArray(socialValue) ? socialValue[0] || '#' : socialValue;
  };

  const socialLinks = [
    { icon: FaInstagram, href: getSocialUrl(settings?.social_instagram), label: 'Instagram' },
    { icon: FaFacebookF, href: getSocialUrl(settings?.social_facebook), label: 'Facebook' },
    { icon: FaYoutube, href: getSocialUrl(settings?.social_youtube), label: 'YouTube' },
    { icon: FaLinkedinIn, href: getSocialUrl(settings?.social_linkedin), label: 'LinkedIn' },
    { icon: FaXTwitter, href: getSocialUrl(settings?.social_twitter), label: 'Twitter' },
  ];

  const destinationPlan = allDestinations.slice(0, 6);

  return (
    <footer className="w-full border-t border-gray-200 bg-white">
      <div className="containers py-12 sm:py-16 lg:py-20">
        {/* Top Section - Logo + Description + App Buttons */}
        <div className="mb-12">
          <div className="flex flex-col items-start gap-6 lg:flex-row lg:items-center">
            {/* Logo & Description - EXACT same */}
            <div className="flex-1">
              <Link href="/" className="inline-block mb-4">
                <div className="flex items-center flex-col gap-2">
                  <div className="h-16 w-40 rounded-lg flex items-center justify-center bg-gray-100 border">
                    {logo ? (
                      <img
                        src={logo}
                        alt="Platform Logo"
                        className="h-full w-full object-contain rounded"
                      />
                    ) : (
                      <span className="text-gray-900 text-lg font-semibold">
                        {settings?.site_name?.charAt(0) ?? 'E'}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
              <p className="text-sm text-gray-600 leading-relaxed">
                Your ultimate travel connectivity partner that offers secure eSIMs and SIM cards in
                175+ countries at affordable rates. Perfect for global tourists, students, and
                travelers.
              </p>
            </div>

            {/* App Download Buttons */}
            <div className="flex flex-wrap gap-3">
              <Link href="#" target="_blank">
                <img
                  src="/images/app-store.svg"
                  alt="Download on App Store"
                  className="h-10 w-auto"
                />
              </Link>
              <Link href="#" target="_blank">
                <img
                  src="/images/google-play.svg"
                  alt="Get it on Google Play"
                  className="h-10 w-auto"
                />
              </Link>
            </div>
          </div>
        </div>

        {/* Main Footer Links Grid - EXACT same structure */}
        <div className="mb-12 grid grid-cols-2 gap-8 md:grid-cols-3 lg:grid-cols-5 lg:gap-12">
          {/* 1. {siteName} Global - EXACT same links */}
          <div>
            <h3 className="mb-4 text-base font-semibold text-gray-900">{siteName} Global</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/what-is-esim"
                  className="block text-sm text-gray-600 hover:text-gray-900 font-normal transition-colors hover:underline"
                >
                  What is an eSIM
                </Link>
              </li>
              <li>
                <Link
                  href="/about-us"
                  className="block text-sm text-gray-600 hover:text-gray-900 font-normal transition-colors hover:underline"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="block text-sm text-gray-600 hover:text-gray-900 font-normal transition-colors hover:underline"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  href="/destinations"
                  className="block text-sm text-gray-600 hover:text-gray-900 font-normal transition-colors hover:underline"
                >
                  Destinations
                </Link>
              </li>
            </ul>
          </div>

          {/* 2. Top Destinations - DYNAMIC from API */}
          <div>
            <h3 className="mb-4 text-base font-semibold text-gray-900">Top Destinations</h3>
            <ul className="space-y-3">
              {loadingDestinations
                ? Array.from({ length: 6 }).map((_, idx) => (
                    <li key={`skeleton-${idx}`}>
                      <Skeleton className="h-4 w-32 rounded-md" />
                    </li>
                  ))
                : destinationPlan.map((item) => (
                    <li key={item.id}>
                      <Link
                        href={`/destination/${item.slug}`}
                        className="block text-sm text-gray-600 hover:text-gray-900 font-normal transition-colors hover:underline"
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
            </ul>
          </div>

          {/* 3. Resources - EXACT same links */}
          <div>
            <h3 className="mb-4 text-base font-semibold text-gray-900">Resources</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/blog"
                  className="block text-sm text-gray-600 hover:text-gray-900 font-normal transition-colors hover:underline"
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  href="/faq"
                  className="block text-sm text-gray-600 hover:text-gray-900 font-normal transition-colors hover:underline"
                >
                  FAQ's
                </Link>
              </li>
              <li>
                <Link
                  href="/account/support"
                  className="block text-sm text-gray-600 hover:text-gray-900 font-normal transition-colors hover:underline"
                >
                  Support Ticket
                </Link>
              </li>
            </ul>
          </div>

          {/* 4. Pages - DYNAMIC from API */}
          <div>
            <h3 className="mb-4 text-base font-semibold text-gray-900">Pages</h3>
            <ul className="space-y-3">
              {pages?.data?.map((link) => (
                <li key={link.id}>
                  <Link
                    href={`/pages/${link.slug}`}
                    className="block text-sm text-gray-600 hover:text-gray-900 font-normal transition-colors hover:underline"
                  >
                    {link.title?.charAt(0).toUpperCase() + link.title?.slice(1)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* 5. Social Links - EXACT same from old footer */}
          <div>
            <h3 className="mb-4 text-base font-semibold text-gray-900">Follow Us</h3>
            <div className="flex flex-wrap gap-3 pt-2">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group h-10 w-10 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 hover:border-gray-300 hover:shadow-md flex items-center justify-center text-gray-500 transition-all duration-200 hover:scale-105"
                >
                  <social.icon className="h-5 w-5 group-hover:text-gray-900 transition-colors" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Section - EXACT same */}
        <div className="border-t border-gray-200 pt-8">
          <div className="flex flex-col items-center justify-between gap-6 lg:flex-row">
            {/* Copyright and Legal Links */}
            <div className="flex flex-col items-center gap-4 text-sm text-gray-600 sm:flex-row">
              <span className="font-normal">
                © 2026 {settings?.site_name || 'eSIM Global'}. All rights reserved.
              </span>
              <div className="flex items-center gap-4">
                <Link
                  href="/privacy-policy"
                  className="font-normal transition-colors hover:text-gray-900"
                >
                  Privacy Policy
                </Link>
                <Link
                  href="/terms-and-conditions"
                  className="font-normal transition-colors hover:text-gray-900"
                >
                  Terms & Conditions
                </Link>
              </div>
            </div>

            {/* Payment Methods - EXACT same icons */}
            <div className="flex flex-wrap items-center justify-center gap-2 lg:justify-end">
              <SiVisa className="h-8 w-12 text-gray-600 hover:text-gray-900 transition-colors" />
              <SiMastercard className="h-8 w-8 text-gray-600 hover:text-gray-900 transition-colors" />
              <SiApplepay className="h-6 w-10 text-gray-600 hover:text-gray-900 transition-colors" />
              <SiGooglepay className="h-6 w-12 text-gray-600 hover:text-gray-900 transition-colors" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterNew;
