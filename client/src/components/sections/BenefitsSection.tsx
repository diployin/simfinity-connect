import { Link } from 'wouter';
import { Check, Smartphone, Shield, Globe, CreditCard, Leaf } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/contexts/TranslationContext';

export function BenefitsSection() {
  const { t } = useTranslation();

  const benefits = [
    {
      icon: Smartphone,
      titleKey: 'website.home.benefits.convenience.title',
      descKey: 'website.home.benefits.convenience.description',
      titleFallback: 'Convenience',
      descFallback:
        'Activate a new plan anytime without visiting a store or waiting for a physical SIM card.',
    },
    {
      icon: Shield,
      titleKey: 'website.home.benefits.security.title',
      descKey: 'website.home.benefits.security.description',
      titleFallback: 'Security',
      descFallback:
        'eSIMs stay locked to your device, so if your phone is lost or stolen, your data remains protected.',
    },
    {
      icon: Globe,
      titleKey: 'website.home.benefits.flexibility.title',
      descKey: 'website.home.benefits.flexibility.description',
      titleFallback: 'Flexibility',
      descFallback:
        'Keep multiple data plans on one device and switch networks easily while traveling abroad.',
    },
    {
      icon: CreditCard,
      titleKey: 'website.home.benefits.noRoaming.title',
      descKey: 'website.home.benefits.noRoaming.description',
      titleFallback: 'No roaming fees',
      descFallback:
        'Use local data at affordable rates wherever you go, with no unexpected charges.',
    },
    {
      icon: Leaf,
      titleKey: 'website.home.benefits.sustainability.title',
      descKey: 'website.home.benefits.sustainability.description',
      titleFallback: 'Sustainability',
      descFallback: 'Reduce plastic waste and avoid damage from traditional SIM cards or slots.',
    },
  ];

  return (
    <section className="py-20 md:py-28 bg-zinc-50 dark:bg-slate-900/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16 md:mb-20">
          <h2 className="text-4xl md:text-5xl lg:text-5xl font-bold text-foreground mb-4">
            {t('website.home.benefits.title', 'Why choose us?')}
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            {t('website.home.benefits.subtitle', 'Stay connected while traveling')}
          </p>
        </div>

        {/* Cards Grid - Horizontal scroll on mobile, 3-column grid on desktop */}
        <div className="flex md:hidden overflow-x-auto gap-4 pb-4 snap-x snap-mandatory scrollbar-hide -mx-4 px-4" style={{ scrollBehavior: 'smooth' }}>
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <div
                key={index}
                className="flex-shrink-0 w-72 snap-start bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700 hover:shadow-md hover:-translate-y-1 transition-all duration-300 ease-out"
                data-testid={`benefit-item-${index}`}
              >
                <div className="mb-5">
                  <div className="h-14 w-14 rounded-full bg-teal-50 dark:bg-teal-900/30 flex items-center justify-center flex-shrink-0">
                    <Icon className="h-7 w-7 text-teal-600 dark:text-teal-400" />
                  </div>
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2">
                  {t(benefit.titleKey, benefit.titleFallback)}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {t(benefit.descKey, benefit.descFallback)}
                </p>
              </div>
            );
          })}
        </div>

        {/* Desktop Grid View - 3 columns */}
        <div className="hidden md:grid md:grid-cols-3 gap-8 lg:gap-10 mb-16">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <div
                key={index}
                className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-sm border border-slate-100 dark:border-slate-700 hover:shadow-lg hover:-translate-y-2 transition-all duration-300 ease-out"
                data-testid={`benefit-item-${index}`}
              >
                <div className="mb-6">
                  <div className="h-16 w-16 rounded-full bg-teal-50 dark:bg-teal-900/30 flex items-center justify-center flex-shrink-0">
                    <Icon className="h-8 w-8 text-teal-600 dark:text-teal-400" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">
                  {t(benefit.titleKey, benefit.titleFallback)}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {t(benefit.descKey, benefit.descFallback)}
                </p>
              </div>
            );
          })}
        </div>

        {/* CTA Button */}
        <div className="text-center">
          <Link href="/destinations">
            <Button
              className="bg-primary-gradient text-white rounded-full px-8 py-2 text-base font-semibold hover:opacity-95 transition-opacity"
              data-testid="button-view-destinations"
            >
              {t('website.home.benefits.cta', 'View All Destinations')}
            </Button>
          </Link>
        </div>
      </div>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </section>
  );
}
