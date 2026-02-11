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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
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

  // Get social URLs
  const getSocialUrl = (socialValue?: string | string[]) => {
    if (!socialValue) return '#';
    return Array.isArray(socialValue) ? socialValue[0] || '#' : socialValue;
  };

  // Social links with icons
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

  // Payment methods
  const paymentMethods = [
    { icon: SiApplepay, label: 'Apple Pay' },
    { icon: SiGooglepay, label: 'Google Pay' },
    { icon: SiVisa, label: 'Visa' },
    { icon: SiMastercard, label: 'Mastercard' },
    { icon: SiApplepay, label: 'American Express' }, // Placeholder for Amex if not in Si
    { icon: SiDiscover, label: 'Discover' }
  ];

  const popularDestinations = allDestinations.slice(0, 7);

  const NavigationLinks = ({ column }: { column: string }) => {
    switch (column) {
      case 'destinations':
        return (
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
        );
      case 'saily':
        return (
          <ul className="space-y-3">
            <li><Link href="/#" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">{t('website.footer.business')}</Link></li>
            <li><Link href="/about-us" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">{t('website.footer.aboutUs')}</Link></li>
            <li><Link href="/#" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">{t('website.footer.careers')}</Link></li>
            <li><Link href="/refer-a-friend" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">{t('website.footer.referFriend')}</Link></li>
            <li><Link href="/affiliate-program" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">{t('website.footer.becomeAffiliate')}</Link></li>
            <li><Link href="/refer-a-friend" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">{t('website.footer.studentDiscount')}</Link></li>
          </ul>
        );
      case 'esim':
        return (
          <ul className="space-y-3">
            <li><Link href="/what-is-esim" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">{t('website.footer.whatIsEsim')}</Link></li>
            <li><Link href="/supported-devices" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">{t('website.footer.supportedDevices')}</Link></li>
            <li><Link href="/download-esim-app" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">{t('website.footer.downloadApp')}</Link></li>
            <li><Link href="/security" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">{t('website.footer.securityFeatures')}</Link></li>
            <li><Link href="/#" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">{t('website.footer.dataCalculator')}</Link></li>
            <li><Link href="/blog" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">{t('website.footer.blog')}</Link></li>
          </ul>
        );
      case 'help':
        return (
          <ul className="space-y-3">
            <li><Link href="/#" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">{t('website.footer.helpCenter')}</Link></li>
            <li><Link href="/#" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">{t('website.footer.gettingStarted')}</Link></li>
            <li><Link href="/destination" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">{t('website.footer.plansPayments')}</Link></li>
            <li><Link href="/#" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">{t('website.footer.troubleshooting')}</Link></li>
            <li><Link href="/faq" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">{t('website.footer.faq')}</Link></li>
          </ul>
        );
      case 'follow':
        return (
          <div className="flex flex-col gap-3">
            {socialLinks.map((social) => (
              <a key={social.label} href={social.href} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors">
                <social.icon className="h-4 w-4" />
                <span>{social.label}</span>
              </a>
            ))}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <footer className="w-full bg-white border-t border-gray-100">
      <div className="containers">
        {/* Logo and App Buttons Section */}
        <div className="py-8 md:py-10 border-b border-gray-100">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 md:gap-4">
            <Link href="/" className="inline-block">
              <div className="h-12 w-40 md:h-16 md:w-52">
                {logo ? (
                  <img src={logo} className="h-full w-auto object-contain" alt={siteName} />
                ) : (
                  <span className="text-gray-900 text-3xl md:text-5xl font-black lowercase tracking-tighter">
                    {siteName || 'simfinity'}
                  </span>
                )}
              </div>
            </Link>

            <div className="flex gap-3">
              <Link href="#">
                <img src="/images/app-store.svg" alt="App Store" className="h-10 md:h-12" />
              </Link>
              <Link href="#">
                <img src="/images/google-play.svg" alt="Google Play" className="h-10 md:h-12" />
              </Link>
            </div>
          </div>
        </div>

        {/* Navigation Content */}
        <div className="py-8 md:py-12">
          {/* Desktop Grid Layout */}
          <div className="hidden md:grid md:grid-cols-3 lg:grid-cols-5 gap-6 lg:gap-8">
            <div>
              <h3 className="mb-4 text-xs font-bold uppercase tracking-wider text-gray-900">{t('website.footer.topDestinations')}</h3>
              <NavigationLinks column="destinations" />
            </div>
            <div>
              <h3 className="mb-4 text-xs font-bold uppercase tracking-wider text-gray-900">{siteName || t('website.footer.saily')}</h3>
              <NavigationLinks column="saily" />
            </div>
            <div>
              <h3 className="mb-4 text-xs font-bold uppercase tracking-wider text-gray-900">{t('website.footer.esim')}</h3>
              <NavigationLinks column="esim" />
            </div>
            <div>
              <h3 className="mb-4 text-xs font-bold uppercase tracking-wider text-gray-900">{t('website.footer.help')}</h3>
              <NavigationLinks column="help" />
            </div>
            <div className="lg:col-span-1">
              <h3 className="mb-4 text-xs font-bold uppercase tracking-wider text-gray-900">{t("website.footer.followus")}</h3>
              <div className="flex flex-wrap gap-3">
                {socialLinks.map((social) => (
                  <a key={social.label} href={social.href} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center h-8 w-8 rounded-full bg-gray-50 text-gray-600 hover:text-gray-900 transition-colors">
                    <social.icon className="h-4 w-4" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Mobile Accordion Layout */}
          <div className="md:hidden">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="destinations" className="border-b border-gray-100">
                <AccordionTrigger className="text-base font-bold py-5 hover:no-underline">{t('website.footer.topDestinations')}</AccordionTrigger>
                <AccordionContent className="pb-5">
                  <NavigationLinks column="destinations" />
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="saily" className="border-b border-gray-100">
                <AccordionTrigger className="text-base font-bold py-5 hover:no-underline">{siteName || t('website.footer.saily')}</AccordionTrigger>
                <AccordionContent className="pb-5">
                  <NavigationLinks column="saily" />
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="esim" className="border-b border-gray-100">
                <AccordionTrigger className="text-base font-bold py-5 hover:no-underline">{t('website.footer.esim')}</AccordionTrigger>
                <AccordionContent className="pb-5">
                  <NavigationLinks column="esim" />
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="help" className="border-b border-gray-100">
                <AccordionTrigger className="text-base font-bold py-5 hover:no-underline">{t('website.footer.help')}</AccordionTrigger>
                <AccordionContent className="pb-5">
                  <NavigationLinks column="help" />
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="follow" className="border-b border-gray-100">
                <AccordionTrigger className="text-base font-bold py-5 hover:no-underline">{t("website.footer.followus")}</AccordionTrigger>
                <AccordionContent className="pb-5">
                  <div className="flex flex-wrap gap-4">
                    {socialLinks.map((social) => (
                      <a key={social.label} href={social.href} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center h-10 w-10 rounded-full bg-gray-50 text-gray-600 hover:text-gray-900 transition-colors">
                        <social.icon className="h-5 w-5" />
                      </a>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>

        {/* Payment and Legal Section */}
        <div className="py-6 border-t border-gray-100">
          <div className="flex flex-col gap-6">
            {/* Payment Icons */}
            <div className="flex flex-wrap items-center gap-1.5">
              {paymentMethods.map((method, idx) => (
                <div key={idx} className="h-8 w-14 md:h-10 md:w-18 flex items-center justify-center rounded-md border border-gray-100 bg-white shadow-sm" title={method.label}>
                  <method.icon className="h-6 w-10 md:h-8 md:w-14 text-gray-700" />
                </div>
              ))}
            </div>

            {/* Legal and Copyright */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between items-start gap-4">
              <p className="text-[12px] md:text-xs font-semibold text-gray-400 whitespace-nowrap">
                {t('website.footer.copyrightt', {
                  year: new Date().getFullYear(),
                  siteName: siteName || 'Simfinity'
                })}
              </p>

              <div className="flex flex-wrap gap-x-6 gap-y-2">
                <Link href="/privacy-policy" className="text-[12px] md:text-xs font-medium text-gray-400 hover:text-gray-900 transition-colors underline decoration-gray-200 underline-offset-4">
                  {t('website.footer.payment.privacyPolicy')}
                </Link>
                <Link href="/terms-of-service" className="text-[12px] md:text-xs font-medium text-gray-400 hover:text-gray-900 transition-colors underline decoration-gray-200 underline-offset-4">
                  {t('website.footer.payment.termsOfService')}
                </Link>
                <Link href="/#" className="text-[12px] md:text-xs font-medium text-gray-400 hover:text-gray-900 transition-colors underline decoration-gray-200 underline-offset-4">
                  {t('website.footer.payment.cookiePreference')}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterNew;
