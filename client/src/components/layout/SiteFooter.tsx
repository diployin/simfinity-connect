// import { useSettingByKey } from '@/hooks/useSettings';
// import { apiRequest } from '@/lib/queryClient';
// import { SettingsState } from '@/redux/slice/settingsSlice';
// import { AdminPlatformSettings, PageApiResponse } from '@/types/types';
// import { useQuery } from '@tanstack/react-query';
// import { FaInstagram, FaFacebookF, FaYoutube, FaLinkedinIn } from 'react-icons/fa';
// import { FaXTwitter } from 'react-icons/fa6';
// import { SiVisa, SiMastercard, SiApplepay, SiGooglepay } from 'react-icons/si';
// import { Link } from 'wouter';

// export function NewFooter() {
//   const { data: settings } = useQuery<SettingsState>({
//     queryKey: ['/api/public/settings'],
//   });

//   const { data: allDestinations = [] } = useQuery({
//     queryKey: ['/api/destinations/with-pricing'],
//   });

//   const destinationPlan = allDestinations.slice(0, 6);

//   const siteName = useSettingByKey('platform_name');
//   const logo = useSettingByKey('logo');

//   const { data: pages } = useQuery<PageApiResponse>({
//     queryKey: ['/api/pages'],
//     queryFn: async () => {
//       const res = await apiRequest('GET', '/api/pages');
//       return res.json();
//     },
//   });

//   // Safe social links with array/string handling
//   const getSocialUrl = (socialValue?: string | string[]) => {
//     if (!socialValue) return '#';
//     return Array.isArray(socialValue) ? socialValue[0] || '#' : socialValue;
//   };

//   const socialLinks = [
//     { icon: FaInstagram, href: getSocialUrl(settings?.social_instagram), label: 'Instagram' },
//     { icon: FaFacebookF, href: getSocialUrl(settings?.social_facebook), label: 'Facebook' },
//     { icon: FaYoutube, href: getSocialUrl(settings?.social_youtube), label: 'YouTube' },
//     { icon: FaLinkedinIn, href: getSocialUrl(settings?.social_linkedin), label: 'LinkedIn' },
//     { icon: FaXTwitter, href: getSocialUrl(settings?.social_twitter), label: 'Twitter' },
//   ];

//   return (
//     <footer className=" bg-gray-900 py-12 md:py-16 border-t border-border">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         {/* Main Footer Content */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12 mb-12">
//           {/* Logo & Description */}
//           <div className="lg:col-span-1">
//             <a href="/" className="inline-block mb-4">
//               <div className="flex items-center flex-col gap-2">
//                 <div className="h-16 w-40 rounded-lg flex items-center justify-center bg-card border">
//                   {logo ? (
//                     <img
//                       src={logo}
//                       alt="Platform Logo"
//                       className="h-full w-full object-contain rounded"
//                     />
//                   ) : (
//                     <span className="text-foreground text-lg font-semibold">
//                       {settings?.site_name?.charAt(0) ?? 'E'}
//                     </span>
//                   )}
//                 </div>
//               </div>
//             </a>
//             <p className="text-sm text-gray-400 font-base leading-relaxed mb-6">
//               Your ultimate travel connectivity partner that offers secure eSIMs and SIM cards in
//               175+ countries at affordable rates. Perfect for global tourists, students, and
//               travelers.
//             </p>
//             {/* App Store Badges */}
//             <div className="flex flex-col sm:flex-row gap-3">
//               <a href="#" className="inline-block" aria-label="Download on App Store">
//                 <img
//                   src="/images/stores/AppStore_new.png"
//                   alt="Download on App Store"
//                   className="h-10"
//                 />
//               </a>
//               <a href="#" className="inline-block" aria-label="Get it on Google Play">
//                 <img
//                   src="/images/stores/PlayStore.png"
//                   alt="Get it on Google Play"
//                   className="h-10"
//                 />
//               </a>
//             </div>
//           </div>

//           {/* Purchase */}
//           <div>
//             <h3 className="text-base font-semibold text-primary mb-4">{siteName} Global</h3>
//             <ul className="space-y-2.5">
//               <li>
//                 <a
//                   href="/what-is-esim"
//                   className="text-sm text-gray-400 hover:text-primary font-base transition hover:underline"
//                 >
//                   What is an eSIM
//                 </a>
//               </li>
//               <li>
//                 <a
//                   href="/about-us"
//                   className="text-sm text-gray-400 hover:text-primary font-base transition hover:underline"
//                 >
//                   About Us
//                 </a>
//               </li>
//               <li>
//                 <a
//                   href="/contact"
//                   className="text-sm text-gray-400 hover:text-primary font-base transition hover:underline"
//                 >
//                   Contact Us
//                 </a>
//               </li>
//               <li>
//                 <a
//                   href="/destinations"
//                   className="text-sm text-gray-400 hover:text-primary font-base transition hover:underline"
//                 >
//                   Destinations
//                 </a>
//               </li>
//             </ul>
//           </div>

//           {/* Top Destinations */}
//           <div>
//             <h3 className="text-base font-semibold text-primary mb-4">Top Destinations</h3>
//             <ul className="space-y-2.5">
//               {destinationPlan?.map((item) => (
//                 <li key={item.id}>
//                   <a
//                     href={`/destination/${item.slug}`}
//                     className="text-sm text-gray-400 hover:text-primary font-base transition hover:underline"
//                   >
//                     {item.name}
//                   </a>
//                 </li>
//               ))}
//             </ul>
//           </div>

//           <div>
//             <h3 className="text-base font-semibold text-primary mb-4">Resources</h3>
//             <ul className="space-y-2.5">
//               <li>
//                 <a
//                   href="/blog"
//                   className="text-sm text-gray-400 hover:text-primary font-base transition hover:underline"
//                 >
//                   Blog
//                 </a>
//               </li>

//               <li>
//                 <a
//                   href="/faq"
//                   className="text-sm text-gray-400 hover:text-primary font-base transition hover:underline"
//                 >
//                   FAQ's
//                 </a>
//               </li>
//               <li>
//                 <a
//                   href="/account/support"
//                   className="text-sm text-gray-400 hover:text-primary font-base transition hover:underline"
//                 >
//                   Support Ticket
//                 </a>
//               </li>
//             </ul>
//           </div>

//           <div>
//             <h3 className="text-base font-semibold text-primary mb-4">Pages</h3>
//             <ul className="space-y-2.5">
//               {pages?.data?.map((link) => (
//                 <li key={link.id}>
//                   <Link href={`/pages/${link.slug}`}>
//                     <span className="text-sm text-gray-400 hover:text-primary font-base transition hover:underline">
//                       {link.title?.charAt(0).toUpperCase() + link.title?.slice(1)}
//                     </span>
//                   </Link>
//                 </li>
//               ))}
//             </ul>
//           </div>
//         </div>

//         {/* Bottom Section */}
//         <div className="flex flex-wrap items-center justify-between gap-6 mb-6 border-t border-border pt-8">
//           {/* Payment icons - left */}
//           <div className="flex items-center gap-4 flex-shrink-0">
//             <SiVisa className="h-8 w-12 text-gray-400" />
//             <SiMastercard className="h-8 w-8 text-gray-400" />
//             <SiApplepay className="h-6 w-10 text-gray-400" />
//             <SiGooglepay className="h-6 w-12 text-gray-400" />
//           </div>

//           {/* Social icons - right */}
//           <div className="flex items-center gap-3 flex-shrink-0">
//             {socialLinks.map((social) => (
//               <a
//                 key={social.label}
//                 href={social.href}
//                 aria-label={social.label}
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 data-testid={`footer-social-${social.label.toLowerCase()}`}
//                 className="group h-10 w-10 rounded-xl border border-border bg-card hover:bg-background/80 hover:border-border hover:shadow-md flex items-center justify-center text-gray-400 transition-all duration-200 hover:scale-105"
//               >
//                 <social.icon className="h-5 w-5 group-hover:text-foreground transition-colors" />
//               </a>
//             ))}
//           </div>
//         </div>

//         {/* Copyright */}
//         <div className="text-center pt-6">
//           <p className="text-xs text-gray-400">
//             © 2026 {settings?.site_name || 'eSIM Global'}. All rights reserved.
//           </p>
//         </div>
//       </div>
//     </footer>
//   );
// }

// export default NewFooter;






import { useSettingByKey } from '@/hooks/useSettings';
import { apiRequest } from '@/lib/queryClient';
import { SettingsState } from '@/redux/slice/settingsSlice';
import { PageApiResponse } from '@/types/types';
import { useQuery } from '@tanstack/react-query';
import { FaInstagram, FaFacebookF, FaYoutube, FaLinkedinIn } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import { SiVisa, SiMastercard, SiApplepay, SiGooglepay } from 'react-icons/si';
import { Link } from 'wouter';
import { useTranslation } from '@/contexts/TranslationContext'; // ✅ added

export function NewFooter() {
  const { t } = useTranslation(); // ✅ added

  const { data: settings } = useQuery<SettingsState>({
    queryKey: ['/api/public/settings'],
  });

  const { data: allDestinations = [] } = useQuery({
    queryKey: ['/api/destinations/with-pricing'],
  });

  const destinationPlan = allDestinations.slice(0, 6);

  const siteName = useSettingByKey('platform_name');
  const logo = useSettingByKey('logo');

  const { data: pages } = useQuery<PageApiResponse>({
    queryKey: ['/api/pages'],
    queryFn: async () => {
      const res = await apiRequest('GET', '/api/pages');
      return res.json();
    },
  });

  // Safe social links
  const getSocialUrl = (socialValue?: string | string[]) => {
    if (!socialValue) return '#';
    return Array.isArray(socialValue) ? socialValue[0] || '#' : socialValue;
  };

  // ✅ Translated social labels
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

  return (
    <footer className="bg-gray-900 py-12 md:py-16 border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Main Footer */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12 mb-12">

          {/* Logo & Description */}
          <div className="lg:col-span-1">
            <a href="/" className="inline-block mb-4">
              <div className="flex items-center flex-col gap-2">
                <div className="h-16 w-40 rounded-lg flex items-center justify-center bg-card border">
                  {logo ? (
                    <img
                      src={logo}
                      alt="Platform Logo"
                      className="h-full w-full object-contain rounded"
                    />
                  ) : (
                    <span className="text-foreground text-lg font-semibold">
                      {settings?.site_name?.charAt(0) ?? 'E'}
                    </span>
                  )}
                </div>
              </div>
            </a>

            {/* ✅ Description translated */}
            <p className="text-sm text-gray-400 font-base leading-relaxed mb-6">
              {t('website.footer.description')}
            </p>

            {/* Stores */}
            <div className="flex flex-col sm:flex-row gap-3">
              <a href="#" className="inline-block">
                <img src="/images/stores/AppStore_new.png" className="h-10" />
              </a>
              <a href="#" className="inline-block">
                <img src="/images/stores/PlayStore.png" className="h-10" />
              </a>
            </div>
          </div>

          {/* Purchase */}
          <div>
            <h3 className="text-base font-semibold text-primary mb-4">
              {t('website.footer.global', { siteName })}
            </h3>

            <ul className="space-y-2.5">
              <li>
                <a href="/what-is-esim" className="footer-link">
                  {t('website.footer.whatIsEsim')}
                </a>
              </li>
              <li>
                <a href="/about-us" className="footer-link">
                  {t('website.footer.aboutUs')}
                </a>
              </li>
              <li>
                <a href="/contact" className="footer-link">
                  {t('website.footer.contactUs')}
                </a>
              </li>
              <li>
                <a href="/destinations" className="footer-link">
                  {t('website.footer.destinations')}
                </a>
              </li>
            </ul>
          </div>

          {/* Top Destinations */}
          <div>
            <h3 className="text-base font-semibold text-primary mb-4">
              {t('website.footer.topDestinations')}
            </h3>

            <ul className="space-y-2.5">
              {destinationPlan?.map((item) => (
                <li key={item.id}>
                  <a href={`/destination/${item.slug}`} className="footer-link">
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-base font-semibold text-primary mb-4">
              {t('website.footer.resources')}
            </h3>

            <ul className="space-y-2.5">
              <li>
                <a href="/blog" className="footer-link">
                  {t('website.footer.blog')}
                </a>
              </li>
              <li>
                <a href="/faq" className="footer-link">
                  {t('website.footer.faq')}
                </a>
              </li>
              <li>
                <a href="/account/support" className="footer-link">
                  {t('website.footer.supportticket')}
                </a>
              </li>
            </ul>
          </div>

          {/* Pages */}
          <div>
            <h3 className="text-base font-semibold text-primary mb-4">
              {t('website.footer.pages')}
            </h3>

            <ul className="space-y-2.5">
              {pages?.data?.map((link) => (
                <li key={link.id}>
                  <Link href={`/pages/${link.slug}`}>
                    <span className="footer-link">
                      {link.title}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="flex flex-wrap items-center justify-between gap-6 mb-6 border-t border-border pt-8">

          {/* Payments */}
          <div className="flex items-center gap-4">
            <SiVisa className="h-8 w-12 text-gray-400" />
            <SiMastercard className="h-8 w-8 text-gray-400" />
            <SiApplepay className="h-6 w-10 text-gray-400" />
            <SiGooglepay className="h-6 w-12 text-gray-400" />
          </div>

          {/* Social */}
          <div className="flex items-center gap-3">
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                aria-label={social.label}
                target="_blank"
                rel="noopener noreferrer"
                className="group h-10 w-10 rounded-xl border border-border bg-card flex items-center justify-center text-gray-400"
              >
                <social.icon className="h-5 w-5" />
              </a>
            ))}
          </div>
        </div>

        {/* Copyright */}
        <div className="text-center pt-6">
          <p className="text-xs text-gray-400">
            {t('website.footer.copyrightt', {
              siteName: settings?.site_name || 'eSIM Global',
            })}
          </p>
        </div>
      </div>
    </footer>
  );
}

export default NewFooter;

