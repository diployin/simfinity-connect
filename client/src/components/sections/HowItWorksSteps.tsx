import { Check, Signal } from 'lucide-react';
import ReactCountryFlag from 'react-country-flag';
import { useTranslation } from '@/contexts/TranslationContext';
import { useSettingByKey } from '@/hooks/useSettings';

function PlanSelectionMockup() {
  const { t } = useTranslation();

  return (
    <div className="bg-white dark:bg-slate-800/50 rounded-xl p-4 mt-6 border border-slate-200 dark:border-slate-700">
      <div className="space-y-2.5">
        <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg">
          <div className="h-4 w-4 rounded-full border-2 border-slate-300 dark:border-slate-500" />
          <div className="flex-1 flex items-center justify-between">
            <div className="h-2.5 w-20 bg-slate-200 dark:bg-slate-600 rounded" />
            <div className="h-2.5 w-12 bg-slate-200 dark:bg-slate-600 rounded" />
          </div>
        </div>

        <div className="flex items-center gap-3 p-3 bg-white dark:bg-slate-700/30 rounded-lg border-2 border-[#2c7338]/40 dark:border-[#3d9a4d]/30">
          <div className="h-4 w-4 rounded-full bg-[#2c7338] flex items-center justify-center">
            <div className="h-1.5 w-1.5 rounded-full bg-white" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-foreground">3 GB</p>
            <p className="text-xs text-muted-foreground">
              {t('website.home.howItWorks.mockup.days', '30 days')}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg">
          <div className="h-4 w-4 rounded-full border-2 border-slate-300 dark:border-slate-500" />
          <div className="flex-1 flex items-center justify-between">
            <div className="h-2.5 w-16 bg-slate-200 dark:bg-slate-600 rounded" />
            <div className="h-2.5 w-10 bg-slate-200 dark:bg-slate-600 rounded" />
          </div>
        </div>
      </div>
    </div>
  );
}

function InstallEsimMockup() {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col items-center justify-center mt-6">
      <div className="bg-white dark:bg-slate-800/50 rounded-xl p-6 border border-slate-200 dark:border-slate-700 w-full">
        <div className="flex flex-col items-center py-4">
          <div className="h-16 w-16 rounded-full bg-[#fef3c7] flex items-center justify-center mb-3">
            <Check className="h-8 w-8 text-[#b8860b] stroke-[2.5]" />
          </div>
          <p className="text-sm font-medium text-foreground">
            {t('website.home.howItWorks.mockup.esimInstalled', 'eSIM installed')}
          </p>
        </div>
      </div>
    </div>
  );
}

function UsageDashboardMockup() {
  const { t } = useTranslation();
  return (
    <div className="bg-white dark:bg-slate-800/50 rounded-xl p-4 mt-6 border border-slate-200 dark:border-slate-700">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <ReactCountryFlag
            countryCode="TH"
            svg
            style={{ width: '1.5em', height: '1.5em' }}
            className="rounded-sm"
          />
          <span className="font-semibold text-sm text-foreground">
            {t('website.home.howItWorks.mockup.country', 'Thailand')}
          </span>
        </div>
        <span className="text-xs font-medium text-[#2c7338] bg-[#f0f9f1] dark:bg-[#194520]/30 px-2 py-0.5 rounded-full">
          {t('website.home.howItWorks.mockup.active', 'Active')}
        </span>
      </div>

      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-xs text-muted-foreground">
            {t('website.home.howItWorks.mockup.remainingData', 'Remaining data')}
          </span>
          <span className="text-sm font-semibold text-foreground">5 / 5 GB</span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-xs text-muted-foreground">
            {t('website.home.howItWorks.mockup.expiresIn', 'Expires in')}
          </span>
          <span className="text-sm font-semibold text-foreground">
            {t('website.home.howItWorks.mockup.expiryTime', '29 days, 7 hours')}
          </span>
        </div>
      </div>

      <div className="mt-3 space-y-2">
        <div className="h-2.5 w-full bg-slate-100 dark:bg-slate-600 rounded" />
        <div className="h-2.5 w-3/4 bg-slate-100 dark:bg-slate-600 rounded" />
      </div>
    </div>
  );
}

export function HowItWorksSteps() {
  const { t } = useTranslation();
  const siteName = useSettingByKey('platform_name') || 'Simfinity';

  const steps = [
    {
      number: '1',
      titleKey: 'website.home.howItWorks.step1.title',
      descKey: 'website.home.howItWorks.step1.description',
      titleFallback: `Choose a ${siteName} data plan for your trip`,
      descFallback: 'Select your destination and pick your travel eSIM data plan.',
      mockup: PlanSelectionMockup,
    },
    {
      number: '2',
      titleKey: 'website.home.howItWorks.step2.title',
      descKey: 'website.home.howItWorks.step2.description',
      titleFallback: `Download ${siteName} and set up your eSIM`,
      descFallback: 'Set up the eSIM on your device by following the instructions in the app.',
      mockup: InstallEsimMockup,
    },
    {
      number: '3',
      titleKey: 'website.home.howItWorks.step3.title',
      descKey: 'website.home.howItWorks.step3.description',
      titleFallback: 'Enjoy staying connected!',
      descFallback: 'Your plan will activate when you reach your destination or 30 days after purchase.',
      mockup: UsageDashboardMockup,
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-white dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12 md:mb-16">
          <p className="text-sm text-[#2c7338] dark:text-[#3d9a4d] font-medium mb-3">
            {t('website.home.howItWorks.label', `How to use the ${siteName} eSIM service`)}
          </p>
          <h2 className="text-3xl md:text-4xl lg:text-[42px] font-bold text-foreground leading-tight mb-4">
            {t('website.home.howItWorks.title', `How does ${siteName} work?`)}
          </h2>
          <p className="text-base text-muted-foreground">
            {t('website.home.howItWorks.subtitle', `Don't have the ${siteName} eSIM app yet? Download it from the App Store or Google Play.`)}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map((item, index) => (
            <div
              key={index}
              data-testid={`step-card-${index}`}
              className="bg-slate-50 dark:bg-slate-800/40 rounded-2xl p-6 md:p-8 flex flex-col"
            >
              <div className="h-10 w-10 rounded-lg bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 flex items-center justify-center mb-5">
                <span className="text-base font-bold text-foreground">{item.number}</span>
              </div>

              <h3 className="font-bold text-lg md:text-xl text-foreground mb-2 leading-snug">
                {t(item.titleKey, item.titleFallback)}
              </h3>

              <p className="text-sm text-muted-foreground leading-relaxed mb-2">
                {t(item.descKey, item.descFallback)}
              </p>

              <div className="mt-auto">
                <item.mockup />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
