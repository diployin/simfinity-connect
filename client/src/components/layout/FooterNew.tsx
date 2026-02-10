'use client';

import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { useSettingByKey } from '@/hooks/useSettings';
import { Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { SettingsState } from '@/redux/slice/settingsSlice';
import { PageApiResponse } from '@/types/types';
import { FaInstagram, FaFacebookF, FaYoutube, FaLinkedinIn, FaReddit } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import { SiVisa, SiMastercard, SiApplepay, SiGooglepay, SiDiscover, SiJcb } from 'react-icons/si';
import { useTranslation } from '@/contexts/TranslationContext';

export interface Destination {
  id: string;
  slug: string;
  name: string;
}

const FooterNew = () => {
  const { t } = useTranslation();

  const logo = useSettingByKey('logo');
  const siteName = useSettingByKey('platform_name');

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

  // Get social URLs
  const getSocialUrl = (socialValue?: string | string[]) => {
    if (!socialValue) return '#';
    return Array.isArray(socialValue) ? socialValue[0] || '#' : socialValue;
  };

  // Social links with icons - updated to match Saily design
  const socialLinks = [
    {
      icon: FaFacebookF,
      href: getSocialUrl(settings?.social_facebook),
      label: t('website.footer.social.facebook'),
    },
    {
      icon: FaXTwitter,
      href: getSocialUrl(settings?.social_twitter),
      label: t('website.footer.social.twitter'),
    },
    {
      icon: FaLinkedinIn,
      href: getSocialUrl(settings?.social_linkedin),
      label: t('website.footer.social.linkedin'),
    },
    {
      icon: FaYoutube,
      href: getSocialUrl(settings?.social_youtube),
      label: t('website.footer.social.youtube'),
    },
    {
      icon: FaInstagram,
      href: getSocialUrl(settings?.social_instagram),
      label: t('website.footer.social.instagram'),
    },
  ];

  // Payment methods - matching Saily design
  const paymentMethods = [
    { icon: SiApplepay, label: 'Apple Pay' },
    { icon: SiGooglepay, label: 'Google Pay' },
    { icon: SiVisa, label: 'Visa' },
    { icon: SiMastercard, label: 'Mastercard' },
    { icon: SiDiscover, label: 'Discover' },
  ];

  // Show more destinations (10-12 instead of 6)
  const popularDestinations = allDestinations.slice(0, 7);

  return (
    <footer className="w-full border-t border-gray-200 bg-white">
      {/* Top Section - Logo and App Buttons */}
      <div className="border-b border-gray-200">
        <div className="containers py-8 sm:py-10">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="inline-block">
              <div className="h-14 w-36 flex items-center justify-center">
                {logo ? (
                  <img src={logo} className="h-full w-full object-contain" alt={siteName} />
                ) : (
                  <span className="text-gray-900 text-2xl font-bold">
                    {siteName?.charAt(0) ?? 'E'}
                  </span>
                )}
              </div>
            </Link>

            {/* App Store Buttons */}
            <div className="flex gap-3">
              <Link href="#">
                <img src="/images/app-store.svg" alt="App Store" className="h-10" />
              </Link>
              <Link href="#">
                <img src="/images/google-play.svg" alt="Google Play" className="h-10" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - 5 Column Grid */}
      <div className="containers py-12 sm:py-16 lg:py-20">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-3 lg:grid-cols-5 lg:gap-12">
          {/* Column 1: Popular Destinations */}
          <div>
            <h3 className="mb-6 text-base font-semibold text-gray-900">
              {t('website.footer.topDestinations')}
            </h3>

            <ul className="space-y-3">
              {loadingDestinations
                ? Array.from({ length: 6 }).map((_, idx) => (
                  <li key={idx}>
                    <Skeleton className="h-4 w-24" />
                  </li>
                ))
                : popularDestinations.map((item) => (
                  <li key={item.id}>
                    <Link
                      href={`/destination/${item.slug}`}
                      className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
            </ul>
          </div>

          {/* Column 2: Saily */}
          <div>
            <h3 className="mb-6 text-base font-semibold text-gray-900">
              {siteName || t('website.footer.saily')}
            </h3>

            <ul className="space-y-3">
              <li>
                <Link
                  href="/#"
                  className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                >
                  {t('website.footer.business')}
                </Link>
              </li>
              <li>
                <Link
                  href="/about-us"
                  className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                >
                  {t('website.footer.aboutUs')}
                </Link>
              </li>
              <li>
                <Link
                  href="/#"
                  className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                >
                  {t('website.footer.careers')}
                </Link>
              </li>
              <li>
                <Link
                  href="/refer-a-friend"
                  className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                >
                  {t('website.footer.referFriend')}
                </Link>
              </li>
              <li>
                <Link
                  href="/affiliate-program"
                  className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                >
                  {t('website.footer.becomeAffiliate')}
                </Link>
              </li>
              <li>
                <Link
                  href="/refer-a-friend"
                  className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                >
                  {t('website.footer.studentDiscount')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: eSIM */}
          <div>
            <h3 className="mb-6 text-base font-semibold text-gray-900">
              {t('website.footer.esim')}
            </h3>

            <ul className="space-y-3">
              <li>
                <Link
                  href="/what-is-esim"
                  className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                >
                  {t('website.footer.whatIsEsim')}
                </Link>
              </li>
              <li>
                <Link
                  href="/supported-devices"
                  className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                >
                  {t('website.footer.supportedDevices')}
                </Link>
              </li>
              <li>
                <Link
                  href="/download-esim-app"
                  className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                >
                  {t('website.footer.downloadApp')}
                </Link>
              </li>
              <li>
                <Link
                  href="/security"
                  className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                >
                  {t('website.footer.securityFeatures')}
                </Link>
              </li>
              <li>
                <Link
                  href="/#"
                  className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                >
                  {t('website.footer.dataCalculator')}
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                >
                  {t('website.footer.blog')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Help */}
          <div>
            <h3 className="mb-6 text-base font-semibold text-gray-900">
              {t('website.footer.help')}
            </h3>

            <ul className="space-y-3">
              <li>
                <Link
                  href="/#"
                  className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                >
                  {t('website.footer.helpCenter')}
                </Link>
              </li>
              <li>
                <Link
                  href="/#"
                  className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                >
                  {t('website.footer.gettingStarted')}
                </Link>
              </li>
              <li>
                <Link
                  href="/destination"
                  className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                >
                  {t('website.footer.plansPayments')}
                </Link>
              </li>
              <li>
                <Link
                  href="/#"
                  className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                >
                  {t('website.footer.troubleshooting')}
                </Link>
              </li>
              <li>
                <Link
                  href="/faq"
                  className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                >
                  {t('website.footer.faq')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 5: Follow Us */}
          <div className="flex flex-col">
            <h3 className="mb-4 text-base font-semibold text-gray-900 text-center sm:text-left">
              {t("website.footer.followus")}
            </h3>

            <div
              className="
      flex justify-center gap-4
      sm:flex-col sm:items-start sm:gap-3
    "
            >
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="
          flex items-center justify-center
          h-10 w-10 sm:w-auto sm:h-auto
          rounded-full sm:rounded-none
          text-gray-600 hover:text-gray-900
          transition-colors
        "
                >
                  <social.icon className="h-5 w-5" />
                  <span className="hidden sm:inline ml-2 text-sm">
                    {social.label}
                  </span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section - Copyright and Payment Methods */}
      <div className="border-t border-gray-200 bg-gray-50">
        <div className="containers py-8 sm:py-10">
          <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
            {/* Left: Copyright and Links */}
            <div className="flex flex-col items-center gap-4 sm:items-start sm:flex-row sm:gap-6">
              <p className="text-xs sm:text-sm text-gray-600">
                {t('website.footer.copyrighttt', { year: new Date().getFullYear(), siteName })}
              </p>
              <div className="flex gap-4 text-xs sm:text-sm">
                <Link
                  href="/privacy-policy"
                  className="text-gray-600 hover:text-gray-900 transition-colors underline"
                >
                  {t('website.footer.payment.privacyPolicy')}
                </Link>
                <Link
                  href="/terms-of-service"
                  className="text-gray-600 hover:text-gray-900 transition-colors underline"
                >
                  {t('website.footer.payment.termsOfService')}
                </Link>
                <Link
                  href="/#"
                  className="text-gray-600 hover:text-gray-900 transition-colors underline"
                >
                  {t('website.footer.payment.cookiePreference')}
                </Link>
              </div>
            </div>

            {/* Right: Payment Methods */}
            <div className="flex items-center gap-3 flex-wrap justify-center sm:justify-end">
              {paymentMethods.map((method) => (
                <div
                  key={method.label}
                  className="h-8 w-12 flex items-center justify-center rounded border border-gray-200 bg-white hover:border-gray-300 transition-colors"
                  title={method.label}
                >
                  <method.icon className="h-8 w-8 text-gray-700" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterNew;
