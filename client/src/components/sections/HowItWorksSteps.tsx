import { Link } from 'wouter';
import { Check, Signal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import ReactCountryFlag from 'react-country-flag';
import { useTranslation } from '@/contexts/TranslationContext';
import { useSettingByKey } from '@/hooks/useSettings';

function PlanSelectionMockup() {
  const { t } = useTranslation();

  return (
    <div className="bg-white dark:bg-slate-800/50 rounded-lg p-4 mt-4 border border-border/20">
      <div className="space-y-2.5">
        <div className="flex items-center gap-3 p-2.5 bg-slate-50 dark:bg-slate-700/30 rounded-md">
          <div className="h-3 w-3 rounded-full border-1.5 border-slate-300 dark:border-slate-500" />
          <div className="flex-1">
            <div className="h-2.5 w-24 bg-slate-200 dark:bg-slate-600 rounded" />
          </div>
        </div>

        <div className="flex items-center gap-3 p-2.5 bg-slate-50 dark:bg-slate-700/30 rounded-md border-1.5 border-primary/40 dark:border-primary/30">
          <div className="h-3 w-3 rounded-full bg-primary flex items-center justify-center">
            <Check className="h-1.5 w-1.5 text-white" />
          </div>
          <div className="flex-1">
            <p className="text-xs font-semibold text-foreground">3GB</p>
            <p className="text-[10px] text-muted-foreground">
              {t('website.home.howItWorks.mockup.days', '30days')}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-2.5 bg-slate-50 dark:bg-slate-700/30 rounded-md">
          <div className="h-3 w-3 rounded-full border-1.5 border-slate-300 dark:border-slate-500" />
          <div className="flex-1">
            <div className="h-2.5 w-20 bg-slate-200 dark:bg-slate-600 rounded" />
          </div>
        </div>
      </div>
    </div>
  );
}

function EnableEsimMockup() {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col items-center justify-center mt-4 mb-2">
      <div className="h-20 w-20 rounded-full bg-primary/10 dark:bg-primary/5 flex items-center justify-center">
        <div className="h-16 w-16 rounded-full bg-primary flex items-center justify-center">
          <Check className="h-8 w-8 text-white stroke-[2.5]" />
        </div>
      </div>
      <p className="mt-3 text-xs font-medium text-muted-foreground">
        {t('website.home.howItWorks.mockup.enableEsim', 'Enable eSIM')}
      </p>
    </div>
  );
}

function UsageDashboardMockup() {
  const { t } = useTranslation();
  return (
    <div className="bg-white dark:bg-slate-800/50 rounded-lg p-4 mt-4 border border-border/20">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <ReactCountryFlag
            countryCode="US"
            svg
            style={{ width: '1.25em', height: '1.25em' }}
            className="rounded-sm"
          />
          <span className="font-medium text-xs text-foreground">
            {t('website.home.howItWorks.mockup.country', 'United States')}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <Signal className="h-3 w-3 text-primary" />
          <Badge className="bg-green-500/80 hover:bg-green-500/80 text-white text-[9px] px-1 py-0">
            {t('website.home.howItWorks.mockup.active', 'Active')}
          </Badge>
        </div>
      </div>

      <div className="space-y-2.5">
        <div className="flex justify-between items-center">
          <span className="text-[10px] text-muted-foreground">
            {t('website.home.howItWorks.mockup.remainingData', 'Remaining data')}
          </span>
          <span className="text-xs font-semibold text-foreground">3/3GB</span>
        </div>

        <div className="h-1 w-full bg-slate-100 dark:bg-slate-700/40 rounded-full overflow-hidden">
          <div className="h-full w-full bg-primary rounded-full" />
        </div>

        <div className="flex justify-between items-center">
          <span className="text-[10px] text-muted-foreground">
            {t('website.home.howItWorks.mockup.expiresIn', 'Expires in')}
          </span>
          <span className="text-xs font-semibold text-foreground">
            {t('website.home.howItWorks.mockup.expiryTime', '29 Days, 7 Hours')}
          </span>
        </div>
      </div>
    </div>
  );
}

export function HowItWorksSteps() {
  const { t } = useTranslation();
  const siteName = useSettingByKey('platform_name');

  const steps = [
    {
      stepKey: 'website.home.howItWorks.step1.label',
      titleKey: 'website.home.howItWorks.step1.title',
      descKey: 'website.home.howItWorks.step1.description',
      stepFallback: 'Step 1',
      titleFallback: 'Choose a data plan for your trip',
      descFallback: 'Find the best eSIM plan tailored to your destination.',
      mockup: PlanSelectionMockup,
    },
    {
      stepKey: 'website.home.howItWorks.step2.label',
      titleKey: 'website.home.howItWorks.step2.title',
      descKey: 'website.home.howItWorks.step2.description',
      stepFallback: 'Step 2',
      titleFallback: 'Scan the QR code to activate',
      descFallback: 'Instantly install and set up your eSIM in seconds.',
      mockup: EnableEsimMockup,
    },
    {
      stepKey: 'website.home.howItWorks.step3.label',
      titleKey: 'website.home.howItWorks.step3.title',
      descKey: 'website.home.howItWorks.step3.description',
      stepFallback: 'Step 3',
      titleFallback: 'Enjoy fast 4G/5G data abroad',
      descFallback: 'Stay connected anywhere with reliable high-speed internet.',
      mockup: UsageDashboardMockup,
    },
  ];

  return (
    <section className="py-20 md:py-32 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16 md:mb-24">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
            {t('website.home.howItWorks.title', `How does ${siteName} work?`)}
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            {t('website.home.howItWorks.subtitle', "Don't have the app yet? Get started in 3 simple steps.")}
          </p>
        </div>

        {/* Steps Container */}
        <div className="mb-20 md:mb-28">
          <div className="relative">
            {/* Decorative connecting line for desktop */}
            <div className="hidden md:block absolute top-12 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
            
            {/* Steps Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8">
              {steps.map((item, index) => (
                <div key={index} data-testid={`step-card-${index}`} className="flex flex-col relative">
                  {/* Step Content */}
                  <div className="flex flex-col items-center text-center flex-1">
                    {/* Step Number Circle */}
                    <div className="flex items-center justify-center h-20 w-20 rounded-full bg-primary/10 dark:bg-primary/5 mb-6 relative z-10 bg-background">
                      <span className="text-4xl md:text-5xl font-bold text-primary">
                        {index + 1}
                      </span>
                    </div>

                    {/* Step Title */}
                    <h3 className="font-bold text-xl md:text-2xl text-foreground mb-4">
                      {t(item.titleKey, item.titleFallback)}
                    </h3>

                    {/* Step Description */}
                    <p className="text-base text-muted-foreground mb-8 leading-relaxed">
                      {t(item.descKey, item.descFallback)}
                    </p>
                  </div>

                  {/* Mockup Component */}
                  <div className="mt-auto bg-slate-50 dark:bg-slate-800/30 rounded-xl p-6 md:p-8">
                    <item.mockup />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA Button */}
        <div className="flex justify-center">
          <Link href="/destinations">
            <Button
              size="lg"
              className="bg-primary hover:bg-primary/90 text-white rounded-full px-12 py-6 text-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl"
              data-testid="button-get-started"
            >
              {t('website.home.howItWorks.cta', 'Get started now')}
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
