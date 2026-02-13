import { useSettingByKey } from '@/hooks/useSettings';
import { SettingsState } from '@/redux/slice/settingsSlice';
import { PageApiResponse } from '@/types/types';
import { apiRequest } from '@/lib/queryClient';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';
import { useTranslation } from '@/contexts/TranslationContext';

export function NewFooter() {
  const { t } = useTranslation();

  const { data: settings } = useQuery<SettingsState>({
    queryKey: ['/api/public/settings'],
  });

  const { data: allDestinations = [] } = useQuery<any[]>({
    queryKey: ['/api/destinations/with-pricing'],
  });

  const { data: pages } = useQuery<PageApiResponse>({
    queryKey: ['/api/pages'],
    queryFn: async () => {
      const res = await apiRequest('GET', '/api/pages');
      return res.json();
    },
  });

  const getSocialUrl = (socialValue?: string | string[]) => {
    if (!socialValue) return '#';
    return Array.isArray(socialValue) ? socialValue[0] || '#' : socialValue;
  };

  const topDestinations = allDestinations.slice(0, 10);
  const siteName = useSettingByKey('platform_name') || 'Simfinity';

  return (
    <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-10 gap-4">
          <Link href="/">
            <span className="text-2xl font-bold text-foreground tracking-tight">
              <span>Sim</span>
              <span className="text-[#2c7338]">finity</span>
            </span>
          </Link>

          <div className="flex gap-3">
            <a href="#" className="inline-block" aria-label="Download on App Store">
              <div className="bg-black text-white rounded-lg px-3 py-1.5 flex items-center gap-1.5 hover:bg-gray-800 transition-colors">
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                </svg>
                <div>
                  <div className="text-[8px] leading-none">Download on the</div>
                  <div className="text-xs font-semibold leading-tight">App Store</div>
                </div>
              </div>
            </a>
            <a href="#" className="inline-block" aria-label="Get it on Google Play">
              <div className="bg-black text-white rounded-lg px-3 py-1.5 flex items-center gap-1.5 hover:bg-gray-800 transition-colors">
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 0 1-.61-.92V2.734a1 1 0 0 1 .609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.199l2.302 2.302a1 1 0 0 1 0 1.38l-2.302 2.302L15.196 12l2.502-2.492zM5.864 2.658L16.8 8.99l-2.302 2.302L5.864 2.658z"/>
                </svg>
                <div>
                  <div className="text-[8px] leading-none">GET IT ON</div>
                  <div className="text-xs font-semibold leading-tight">Google Play</div>
                </div>
              </div>
            </a>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-8 mb-12">
          <div>
            <h3 className="text-sm font-bold text-foreground mb-4">Popular Destinations</h3>
            <ul className="space-y-2.5">
              {topDestinations.length > 0 ? (
                topDestinations.map((dest: any) => (
                  <li key={dest.id}>
                    <Link href={`/destination/${dest.slug}`}>
                      <span className="text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                        {dest.name}
                      </span>
                    </Link>
                  </li>
                ))
              ) : (
                <>
                  {['Mexico', 'Switzerland', 'India', 'United States', 'Costa Rica', 'Austria', 'Saudi Arabia', 'Thailand', 'South Africa', 'Vietnam'].map((name) => (
                    <li key={name}>
                      <Link href="/destinations">
                        <span className="text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer">{name}</span>
                      </Link>
                    </li>
                  ))}
                </>
              )}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-bold text-foreground mb-4">{siteName}</h3>
            <ul className="space-y-2.5">
              {[
                { label: 'Business', href: '/business' },
                { label: 'About Us', href: '/about-us' },
                { label: 'Careers', href: '/careers' },
                { label: 'Refer a Friend', href: '/account/referral' },
                { label: 'Become an Affiliate', href: '/affiliate' },
                { label: 'Student Discount', href: '/student-discount' },
              ].map((link) => (
                <li key={link.label}>
                  <Link href={link.href}>
                    <span className="text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer">{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-bold text-foreground mb-4">eSIM</h3>
            <ul className="space-y-2.5">
              {[
                { label: 'What is an eSIM', href: '/what-is-esim' },
                { label: 'Supported Devices', href: '/supported-devices' },
                { label: 'Download App', href: '#download' },
                { label: 'Security Features', href: '/security' },
                { label: 'Data Usage Calculator', href: '/calculator' },
                { label: 'Blog', href: '/blog' },
              ].map((link) => (
                <li key={link.label}>
                  <Link href={link.href}>
                    <span className="text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer">{link.label}</span>
                  </Link>
                </li>
              ))}
              {pages?.data?.map((page) => (
                <li key={page.id}>
                  <Link href={`/pages/${page.slug}`}>
                    <span className="text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                      {page.title?.charAt(0).toUpperCase() + page.title?.slice(1)}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-bold text-foreground mb-4">Help</h3>
            <ul className="space-y-2.5">
              {[
                { label: 'Help Center', href: '/help-center' },
                { label: 'Getting Started', href: '/help-center?category=getting-started' },
                { label: 'Plans & Payments', href: '/help-center?category=plans-payments' },
                { label: 'Troubleshooting', href: '/help-center?category=troubleshooting' },
                { label: 'FAQ', href: '/help-center?category=faq' },
                { label: 'Reviews', href: '/reviews' },
              ].map((link) => (
                <li key={link.label}>
                  <Link href={link.href}>
                    <span className="text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer">{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-bold text-foreground mb-4">Follow Us</h3>
            <ul className="space-y-2.5">
              {[
                { label: 'Facebook', icon: 'facebook', href: getSocialUrl(settings?.social_facebook) },
                { label: 'Twitter (now X)', icon: 'twitter', href: getSocialUrl(settings?.social_twitter) },
                { label: 'LinkedIn', icon: 'linkedin', href: getSocialUrl(settings?.social_linkedin) },
                { label: 'YouTube', icon: 'youtube', href: getSocialUrl(settings?.social_youtube) },
                { label: 'Instagram', icon: 'instagram', href: getSocialUrl(settings?.social_instagram) },
                { label: 'Reddit', icon: 'reddit', href: '#' },
              ].map((social) => (
                <li key={social.label}>
                  <a
                    href={social.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <SocialIcon name={social.icon} />
                    {social.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-200 dark:border-slate-700 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
            <span>2026 {siteName}. All rights reserved.</span>
            <Link href="/privacy-policy">
              <span className="underline hover:text-foreground cursor-pointer">Privacy Policy</span>
            </Link>
            <Link href="/terms-of-service">
              <span className="underline hover:text-foreground cursor-pointer">Terms of Service</span>
            </Link>
            <Link href="/cookie-policy">
              <span className="underline hover:text-foreground cursor-pointer">Cookie Preference</span>
            </Link>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {['Apple Pay', 'Google Pay', 'Visa', 'Mastercard', 'Amex', 'Discover', 'UnionPay', 'JCB'].map((method) => (
              <div
                key={method}
                className="h-6 px-2 bg-slate-100 dark:bg-slate-800 rounded flex items-center justify-center"
              >
                <span className="text-[9px] font-semibold text-muted-foreground">{method}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

function SocialIcon({ name }: { name: string }) {
  const iconClass = "h-4 w-4";
  switch (name) {
    case 'facebook':
      return (
        <svg className={iconClass} viewBox="0 0 24 24" fill="currentColor">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
      );
    case 'twitter':
      return (
        <svg className={iconClass} viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
      );
    case 'linkedin':
      return (
        <svg className={iconClass} viewBox="0 0 24 24" fill="currentColor">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
        </svg>
      );
    case 'youtube':
      return (
        <svg className={iconClass} viewBox="0 0 24 24" fill="currentColor">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
        </svg>
      );
    case 'instagram':
      return (
        <svg className={iconClass} viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 1 0 0-12.324zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405a1.441 1.441 0 1 1-2.882 0 1.441 1.441 0 0 1 2.882 0z"/>
        </svg>
      );
    case 'reddit':
      return (
        <svg className={iconClass} viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z"/>
        </svg>
      );
    default:
      return null;
  }
}

export default NewFooter;
