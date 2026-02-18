import { Sprout } from 'lucide-react';
import { Link } from 'wouter';
import { useTranslation } from '@/contexts/TranslationContext';
import { useSettingByKey } from '@/hooks/useSettings';

export function ImpactSection() {
    const { t } = useTranslation();
    const siteName = useSettingByKey('platform_name') || 'Simfinity';

    return (
        <section className="py-12 md:py-20 bg-background">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-green-50 via-green-100/50 to-green-50 dark:from-card dark:via-card/80 dark:to-card">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
                        <div className="p-8 md:p-12 lg:p-16 flex flex-col justify-center">
                            <div className="mb-4">
                                <div className="inline-flex items-center justify-center h-12 w-12 rounded-xl bg-green-100 dark:bg-green-900/30">
                                    <Sprout className="h-6 w-6 text-green-600 dark:text-green-400" />
                                </div>
                            </div>

                            <div className="mb-2">
                                <span className="text-sm font-semibold text-green-600 dark:text-green-400 tracking-wide uppercase">
                                    {t('website.home.impact.overline', 'Everything. From one ecosystem.')}
                                </span>
                            </div>

                            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground leading-tight mb-4">
                                {t('website.home.impact.title', 'Travel That Gives Back')}
                            </h2>

                            <div className="space-y-4 text-sm md:text-base text-muted-foreground leading-relaxed mb-6">
                                <p>
                                    {t('website.home.impact.description1', 'Every eSIM activated plants one tree.')}
                                </p>
                                <p>
                                    {t('website.home.impact.description2', 'Your connectivity creates real environmental impact.')}
                                </p>
                                <p>
                                    {t('website.home.impact.condition', 'A tree is planted for every order of $10 or more.')}
                                </p>
                                <div className="pt-2">
                                    <p className="font-medium text-foreground">
                                        {t('website.home.impact.ai_access', 'Early users unlock priority AI access.')}
                                    </p>
                                </div>
                            </div>

                            <div>
                                <Link href="/login">
                                    <button className="inline-flex items-center px-6 py-3 rounded-full border-2 border-foreground text-foreground text-sm font-semibold hover:bg-foreground hover:text-background transition-all duration-200">
                                        {t('website.home.impact.cta', 'Join the movement from day one')}
                                    </button>
                                </Link>
                            </div>
                        </div>

                        <div className="relative hidden md:block">
                            <img
                                src="/images/person-holding-plant-their-hands-word-tree-is-background.jpg.jpeg"
                                alt="Person holding plant"
                                className="w-full h-full object-cover"
                                loading="lazy"
                            />
                            <div className="absolute inset-0 bg-gradient-to-r from-green-50/80 dark:from-card/80 to-transparent w-1/4" />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
