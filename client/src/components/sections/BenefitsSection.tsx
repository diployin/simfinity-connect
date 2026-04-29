import { useTranslation } from '@/contexts/TranslationContext';
import { useSettingByKey } from '@/hooks/useSettings';

export function BenefitsSection() {
  const { t } = useTranslation();
  const siteName = useSettingByKey('platform_name') || 'Simfinity';

  const benefits = [
    {
      icon: (
        <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2L2 7l10 5 10-5-10-5z" />
          <path d="M2 17l10 5 10-5" />
          <path d="M2 12l10 5 10-5" />
        </svg>
      ),
      titleKey: 'website.home.benefits.internationalPlans.title',
      descKey: 'website.home.benefits.internationalPlans.description',
      titleFallback: 'Global Data Plans',
      descFallback: `Flexible options designed for every type of traveler and every journey.`,
    },
    {
      icon: (
        <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
          <polyline points="22 4 12 14.01 9 11.01" />
        </svg>
      ),
      titleKey: 'website.home.benefits.easyToUse.title',
      descKey: 'website.home.benefits.easyToUse.description',
      titleFallback: 'Quick & Easy Setup',
      descFallback: `Activate your eSIM in minutes — no technical steps, no waiting.`,
    },
    {
      icon: (
        <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
          <line x1="8" y1="21" x2="16" y2="21" />
          <line x1="12" y1="17" x2="12" y2="21" />
        </svg>
      ),
      titleKey: 'website.home.benefits.noRoaming.title',
      descKey: 'website.home.benefits.noRoaming.description',
      titleFallback: 'No Roaming Shock',
      descFallback: 'Clear pricing with zero hidden charges.',
    },
    {
      icon: (
        <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
          <line x1="12" y1="18" x2="12" y2="18" />
        </svg>
      ),
      titleKey: 'website.home.benefits.oneEsim.title',
      descKey: 'website.home.benefits.oneEsim.description',
      titleFallback: 'One eSIM, Endless Travel',
      descFallback: `Use one eSIM for multiple destinations — just switch plans anytime.`,
    },
    {
      icon: (
        <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
      ),
      titleKey: 'website.home.benefits.usageAlerts.title',
      descKey: 'website.home.benefits.usageAlerts.description',
      titleFallback: 'Smart Usage Alerts',
      descFallback: "Stay in control with real-time data notifications.",
    },
    {
      icon: (
        <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="2" y1="12" x2="22" y2="12" />
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        </svg>
      ),
      titleKey: 'website.home.benefits.globalRegional.title',
      descKey: 'website.home.benefits.globalRegional.description',
      titleFallback: 'Regional & Worldwide Coverage',
      descFallback: 'Perfect for multi-country trips without switching networks.',
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12 md:mb-16">
          <p className="text-sm text-[#2c7338] dark:text-[#3d9a4d] font-medium mb-3">
            {t('website.home.benefits.label', `Why ${siteName}?`, { siteName })}
          </p>
          <h2 className="text-3xl md:text-4xl lg:text-[42px] font-bold text-foreground leading-tight">
            {t('website.home.benefits.title', 'Travel Smart. Stay Online. Go Anywhere.')}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-10 md:gap-y-14">
          {benefits.map((benefit, index) => (
            <div key={index} data-testid={`benefit-item-${index}`}>
              <div className="text-muted-foreground mb-4">
                {benefit.icon}
              </div>
              <h3 className="text-lg font-bold text-foreground mb-2">
                {t(benefit.titleKey, benefit.titleFallback)}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {t(benefit.descKey, benefit.descFallback)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
