import { Button } from '@/components/ui/button';
import { useSettingByKey } from '@/hooks/useSettings';
import { Globe, XCircle } from 'lucide-react';
import { useLocation } from 'wouter';

export function SubscriptionBanner() {
  const siteName = useSettingByKey('platform_name');
  const [, setLocation] = useLocation();
  return (
    <section className="w-full py-8 md:py-12 relative">
      <div className="containers">
        {/* 🎨 GRADIENT BACKGROUND - Theme Aware */}
        <div className="overflow-hidden lg:overflow-visible rounded-3xl bg-gradient-to-br from-primary/10 via-primary/5 to-accent/10 dark:from-primary/20 dark:via-primary/10 dark:to-accent/20 border border-border">
          <div className="grid lg:grid-cols-[400px_1fr] gap-6 lg:gap-8 items-center p-6 md:p-8 lg:p-10 relative bg-card rounded-3xl ">
            {/* ============================================
                LEFT - IMAGE with Overflow Effect
                ============================================ */}
            <div className="relative w-full lg:absolute lg:h-[600px] lg:bottom-0 lg:left-0 lg:w-auto">
              <img
                src="/images/h1_dark.png"
                alt=" Plans"
                className="w-full h-auto lg:h-full lg:w-auto object-contain max-w-full lg:max-w-none dark:opacity-90"
              />
            </div>

            {/* Spacer for mobile */}
            <div className="hidden lg:block lg:max-w-[400px]"></div>

            {/* ============================================
                RIGHT - CONTENT (Theme-aware)
                ============================================ */}
            <div className="space-y-4 lg:space-y-5 relative z-10">
              {/* Logo/Badge */}
              <div className="inline-block">
                <span className="text-xl md:text-2xl font-bold text-foreground">
                  +{siteName} <span className="text-primary">Plans</span>
                </span>
              </div>

              {/* Heading - Uses foreground color */}
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground leading-tight">
                Abroad for 30+ days?
              </h2>

              {/* Subheading */}
              <p className="text-lg md:text-xl text-foreground font-medium">
                Subscribe and save money overseas!
              </p>

              {/* Description - Muted text for body */}
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                Our <span className="font-semibold text-foreground">monthly and yearly</span> plans
                get you connected anywhere in the world as long as you want. Get started for just{' '}
                <span className="font-bold text-primary">$49.90/month</span>
                —plan big, <span className="font-semibold text-foreground">spend less,</span> and
                travel with peace of mind.
              </p>

              {/* CTA Button - Primary Color */}
              <div className="pt-2 w-full text-center md:text-start">
                <Button
                  onClick={() => {
                    setLocation('/destinations');
                  }}
                  size="lg"
                  className="bg-primary-gradient text-white hover:bg-primary/90  font-semibold px-6 py-3 rounded-xl  shadow-lg hover:shadow-primary/50 transition-all hover:scale-105 active:scale-95 w-fit"
                >
                  Check plans
                </Button>
              </div>

              {/* Features - Subtle colors */}
              <div className="flex flex-wrap items-center gap-4 pt-2 text-xs md:text-sm text-muted-foreground">
                <div className="flex items-center gap-1.5  transition-colors">
                  <Globe className="w-4 h-4 text-primary" />
                  <span className="font-medium">160 destinations</span>
                </div>
                <span className="text-border">|</span>
                <div className="flex items-center gap-1.5  transition-colors">
                  <XCircle className="w-4 h-4 text-primary" />
                  <span className="font-medium">Cancel anytime</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
