import { Gift } from 'lucide-react';
import { Link } from 'wouter';
import { useTranslation } from '@/contexts/TranslationContext';
import { useSettingByKey } from '@/hooks/useSettings';

export function ReferAndEarn() {
  const { t } = useTranslation();
  const siteName = useSettingByKey('platform_name') || 'Simfinity';

  return (
    <section className="py-10 md:py-12 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-blue-50 via-blue-100/50 to-blue-50 dark:from-card dark:via-card/80 dark:to-card">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
            <div className="p-8 md:p-12 lg:p-16 flex flex-col justify-center">
              <div className="mb-4">
                <div className="inline-flex items-center justify-center h-12 w-12 rounded-xl bg-green-100 dark:bg-amber-900/30">
                  <Gift className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
              </div>

              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground leading-tight mb-4">
                {t('website.home.referral.title', "Refer a friend, and you'll both get $5!")}
              </h2>

              <p className="text-sm md:text-base text-muted-foreground leading-relaxed mb-6">
                {t('website.home.referral.description', `Invite your friends to use ${siteName} and get $5 in ${siteName} credits while they get a $5 discount!`)}
              </p>

              <div>
                <Link href="/account/referral">
                  <button className="inline-flex items-center px-6 py-3 rounded-full border-2 border-foreground text-foreground text-sm font-semibold hover:bg-foreground hover:text-background transition-all duration-200">
                    {t('website.home.referral.cta', 'Learn More')}
                  </button>
                </Link>
              </div>
            </div>

            <div className="relative hidden md:block">
              <img
                src="/images/refer-friends.png"
                alt="Refer a friend"
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-blue-50/80 dark:from-card/80 to-transparent w-1/4" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
