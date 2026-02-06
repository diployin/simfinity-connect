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
import { useTranslation } from '@/contexts/TranslationContext'; // ✅ added

export interface Destination {
  id: string;
  slug: string;
  name: string;
}

const FooterNew = () => {
  const { t } = useTranslation(); // ✅ added

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

  // Social links translated
  const getSocialUrl = (socialValue?: string | string[]) => {
    if (!socialValue) return '#';
    return Array.isArray(socialValue) ? socialValue[0] || '#' : socialValue;
  };

  const socialLinks = [
    {
      icon: FaInstagram,
      href: getSocialUrl(settings?.social_instagram),
      label: t('website.footer.social.instagram'),
    },
    {
      icon: FaFacebookF,
      href: getSocialUrl(settings?.social_facebook),
      label: t('website.footer.social.facebook'),
    },
    {
      icon: FaYoutube,
      href: getSocialUrl(settings?.social_youtube),
      label: t('website.footer.social.youtube'),
    },
    {
      icon: FaLinkedinIn,
      href: getSocialUrl(settings?.social_linkedin),
      label: t('website.footer.social.linkedin'),
    },
    {
      icon: FaXTwitter,
      href: getSocialUrl(settings?.social_twitter),
      label: t('website.footer.social.twitter'),
    },
  ];

  const destinationPlan = allDestinations.slice(0, 6);

  return (
    <footer className="w-full border-t border-gray-200 bg-white">
      <div className="containers py-12 sm:py-16 lg:py-20">
        {/* Top Section */}
        <div className="mb-12">
          <div className="flex flex-col items-start gap-6 lg:flex-row lg:items-center">
            {/* Logo + Description */}
            <div className="flex-1">
              <Link href="/" className="inline-block mb-4">
                <div className="h-16 w-40 rounded-lg flex items-center justify-center bg-gray-100 border">
                  {logo ? (
                    <img src={logo} className="h-full w-full object-contain rounded" />
                  ) : (
                    <span className="text-gray-900 text-lg font-semibold">
                      {settings?.site_name?.charAt(0) ?? 'E'}
                    </span>
                  )}
                </div>
              </Link>

              {/* ✅ Description translated */}
              <p className="text-sm text-gray-600 leading-relaxed">
                {t('website.footer.description')}
              </p>
            </div>

            {/* App Buttons */}
            <div className="flex flex-wrap gap-3">
              <Link href="#">
                <img src="/images/app-store.svg" className="h-10" />
              </Link>
              <Link href="#">
                <img src="/images/google-play.svg" className="h-10" />
              </Link>
            </div>
          </div>
        </div>

        {/* Links Grid */}
        <div className="mb-12 grid grid-cols-2 gap-8 md:grid-cols-3 lg:grid-cols-5 lg:gap-12">
          {/* Global */}
          <div>
            <h3 className="mb-4 text-base font-semibold text-gray-900">
              {t('website.footer.global', { siteName })}
            </h3>

            <ul className="space-y-3">
              <li>
                <Link href="/what-is-esim">{t('website.footer.whatIsEsim')}</Link>
              </li>
              <li>
                <Link href="/about-us">{t('website.footer.aboutUs')}</Link>
              </li>
              <li>
                <Link href="/contact">{t('website.footer.contactUs')}</Link>
              </li>
              <li>
                <Link href="/destinations">{t('website.footer.destinations')}</Link>
              </li>
            </ul>
          </div>

          {/* Top Destinations */}
          <div>
            <h3 className="mb-4 text-base font-semibold text-gray-900">
              {t('website.footer.topDestinations')}
            </h3>

            <ul className="space-y-3">
              {loadingDestinations
                ? Array.from({ length: 6 }).map((_, idx) => (
                    <Skeleton key={idx} className="h-4 w-32" />
                  ))
                : destinationPlan.map((item) => (
                    <li key={item.id}>
                      <Link href={`/destination/${item.slug}`}>{item.name}</Link>
                    </li>
                  ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="mb-4 text-base font-semibold text-gray-900">
              {t('website.footer.resources')}
            </h3>

            <ul className="space-y-3">
              <li>
                <Link href="/blog">{t('website.footer.blog')}</Link>
              </li>
              <li>
                <Link href="/faq">{t('website.footer.faq')}</Link>
              </li>
              <li>
                <Link href="/account/support">{t('website.footer.supportticket')}</Link>
              </li>
            </ul>
          </div>

          {/* Pages */}
          <div>
            <h3 className="mb-4 text-base font-semibold text-gray-900">
              {t('website.footer.pages')}
            </h3>

            <ul className="space-y-3">
              {pages?.data?.map((link) => (
                <li key={link.id}>
                  <Link href={`/pages/${link.slug}`}>{link.title}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="mb-4 text-base font-semibold text-gray-900">
              {t('website.footer.followus')}
            </h3>

            <div className="flex flex-wrap gap-3 pt-2">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-10 w-10 flex items-center justify-center border rounded-xl"
                >
                  <social.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-gray-200 pt-8 text-center text-sm text-gray-600">
          {t('website.footer.copyrightt', {
            siteName: settings?.site_name || 'eSIM Global',
          })}
        </div>
      </div>
    </footer>
  );
};

export default FooterNew;
