import {
    Smartphone,
    CreditCard,
    Zap,
    CheckCircle2,
    ArrowRight,
    Wifi,
    Globe2,
    ShieldCheck,
    Download,
    Settings,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Helmet } from 'react-helmet-async';
import { useSettingByKey } from '@/hooks/useSettings';
import { useLocation } from 'wouter';
import { useTranslation } from '@/contexts/TranslationContext';

export function GettingStarted() {
    const { t } = useTranslation();
    const siteName = useSettingByKey('platform_name') || 'Voltey';
    const [, navigate] = useLocation();

    const steps = [
        {
            icon: Globe2,
            title: t('gettingStarted.steps.step1.title', 'Choose your destination'),
            description: t('gettingStarted.steps.step1.description', "Search for your destination country or region and find the perfect data plan for your trip."),
            image: '/images/about/promotion-1.jpeg'
        },
        {
            icon: CreditCard,
            title: t('gettingStarted.steps.step2.title', 'Purchase your plan'),
            description: t('gettingStarted.steps.step2.description', 'Select your data package, checkout securely, and receive your eSIM instantly via email.'),
            image: '/images/about/promotion-2.jpeg'
        },
        {
            icon: Download,
            title: t('gettingStarted.steps.step3.title', 'Install the eSIM'),
            description: t('gettingStarted.steps.step3.description', 'Scan the QR code provided in your email or on the {{siteName}} dashboard to easily install your eSIM.', { siteName }),
            image: '/images/about/promotion-3.jpeg'
        },
        {
            icon: Zap,
            title: t('gettingStarted.steps.step4.title', 'Activate and connect'),
            description: t('gettingStarted.steps.step4.description', 'Turn on data roaming for your new eSIM when you arrive at your destination and get connected instantly.'),
            image: '/images/about/promotion-4.jpeg'
        }
    ];

    return (
        <div className="min-h-screen bg-white dark:bg-background flex flex-col">
            <Helmet>
                <title>{`${t('gettingStarted.title', 'Getting Started')} - ${siteName} | Seamless Global Connectivity`}</title>
                <meta
                    name="description"
                    content={`New to ${siteName}? Learn how to set up your eSIM in 4 simple steps and stay connected globally.`}
                />
            </Helmet>

            {/* Hero Section */}
            <section className="relative py-20 md:py-32 overflow-hidden bg-slate-50 dark:bg-background">
                <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-96 h-96 bg-green-100 dark:bg-green-900/20 rounded-full blur-3xl opacity-50" />
                <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/4 w-96 h-96 bg-blue-100 dark:bg-blue-900/20 rounded-full blur-3xl opacity-50" />

                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                    <div className="text-center">
                        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-gray-100 mb-6 tracking-tight">
                            {t('gettingStarted.heroTitle', 'Ready to get connected?').split('?')[0]} <span className="text-[var(--primary)]">{t('gettingStarted.heroTitle', 'Ready to get connected?').split('?')[1] || '?'}</span>
                        </h1>
                        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed mb-10">
                            {t('gettingStarted.heroSubtitle', 'New to {{siteName}}? Learn how to set up your eSIM in 4 simple steps and stay connected globally.', { siteName })}
                        </p>
                        <div className="flex flex-wrap justify-center gap-4">
                            <Button
                                onClick={() => navigate('/destinations')}
                                size="lg"
                                className="bg-[var(--primary)] hover:bg-[#235d2d] text-white px-8 h-14 rounded-xl text-lg font-semibold shadow-lg shadow-green-900/10 transition-all hover:scale-105"
                            >
                                {t('gettingStarted.findPlan', 'Find a Plan')}
                                <ArrowRight className="ml-2 h-5 w-5" />
                            </Button>
                            <Button
                                variant="outline"
                                onClick={() => navigate('/compatible-devices')}
                                size="lg"
                                className="border-gray-200 dark:border-gray-800 hover:bg-white dark:hover:bg-slate-900 hover:border-[var(--primary)] hover:text-[var(--primary)] dark:text-gray-200 px-8 h-14 rounded-xl text-lg font-semibold transition-all"
                            >
                                {t('gettingStarted.checkCompatibility', 'Check Device Compatibility')}
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Steps Section */}
            <section className="py-24 bg-white dark:bg-background">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="space-y-32">
                        {steps.map((step, index) => (
                            <div
                                key={index}
                                className={`flex flex-col lg:items-center gap-12 lg:gap-20 ${index % 2 === 1 ? 'lg:flex-row-reverse' : 'lg:flex-row'
                                    }`}
                            >
                                <div className="flex-1">
                                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-green-50 dark:bg-green-900/20 text-[var(--primary)] mb-8">
                                        <step.icon className="w-8 h-8" />
                                    </div>
                                    <div className="inline-block ml-4 text-sm font-bold text-[var(--primary)] tracking-widest uppercase mb-8">
                                        {t('gettingStarted.stepLabel', 'STEP')} 0{index + 1}
                                    </div>
                                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-6 leading-tight">
                                        {step.title}
                                    </h2>
                                    <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed mb-8">
                                        {step.description}
                                    </p>
                                    <ul className="space-y-4">
                                        <li className="flex items-start gap-3">
                                            <CheckCircle2 className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" />
                                            <span className="text-gray-700 dark:text-gray-300">{t('gettingStarted.features.digitalDelivery', 'Instant digital delivery')}</span>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <CheckCircle2 className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" />
                                            <span className="text-gray-700 dark:text-gray-300">{t('gettingStarted.features.noSwapping', 'No physical SIM swapping required')}</span>
                                        </li>
                                    </ul>
                                </div>
                                <div className="flex-1">
                                    <div className="relative group">
                                        <div className="absolute -inset-4 bg-gradient-to-tr from-green-100 to-blue-100 dark:from-green-900/30 dark:to-blue-900/30 rounded-[2.5rem] opacity-50 blur-2xl group-hover:opacity-75 transition-opacity" />
                                        <div className="relative aspect-[4/3] rounded-[2rem] overflow-hidden shadow-2xl border border-gray-100 dark:border-gray-800 bg-slate-100 dark:bg-slate-900">
                                            <img
                                                src={step.image}
                                                alt={step.title}
                                                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Activation Guide Mini Section */}
            <section className="py-24 bg-slate-50 dark:bg-background">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-card rounded-[3rem] p-8 md:p-16 shadow-xl shadow-green-900/5 dark:shadow-none border border-gray-100 dark:border-gray-800">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                            <div>
                                <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6">{t('gettingStarted.activationGuide.title', 'Quick Activation Guide')}</h2>
                                <p className="text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
                                    {t('gettingStarted.activationGuide.subtitle', 'Activating your eSIM is incredibly quick and easy. Follow the standard steps for your specific device.')}
                                </p>
                                <div className="space-y-6">
                                    <div className="flex gap-4 p-4 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors border border-transparent hover:border-gray-100 dark:hover:border-gray-800">
                                        <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center flex-shrink-0">
                                            <Smartphone className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-1">{t('gettingStarted.activationGuide.ios', 'iOS Devices')}</h3>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">{t('gettingStarted.activationGuide.iosSteps', 'Go to Settings > Cellular > Add eSIM > Scan QR Code.')}</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-4 p-4 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors border border-transparent hover:border-gray-100 dark:hover:border-gray-800">
                                        <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center flex-shrink-0">
                                            <Settings className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-1">{t('gettingStarted.activationGuide.android', 'Android Devices')}</h3>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">{t('gettingStarted.activationGuide.androidSteps', 'Go to Settings > Network & Internet > SIMs > Add SIM > Download an eSIM instead.')}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-4">
                                    <div className="h-48 bg-green-50 dark:bg-green-900/20 rounded-3xl flex items-center justify-center p-6 text-center border border-green-100 dark:border-green-900/30">
                                        <div>
                                            <Wifi className="w-8 h-8 text-[var(--primary)] mx-auto mb-3" />
                                            <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{t('gettingStarted.activationGuide.wifiRequired', 'Wi-Fi connection required for initial setup')}</p>
                                        </div>
                                    </div>
                                    <div className="h-64 bg-slate-100 dark:bg-slate-800 rounded-3xl overflow-hidden">
                                        <img src="/images/about/promotion-5.jpeg" className="w-full h-full object-cover" alt="Connectivity" />
                                    </div>
                                </div>
                                <div className="space-y-4 pt-8">
                                    <div className="h-64 bg-slate-100 dark:bg-slate-800 rounded-3xl overflow-hidden">
                                        <img src="/images/about/promotion-2.jpeg" className="w-full h-full object-cover" alt="Setup" />
                                    </div>
                                    <div className="h-48 bg-blue-50 dark:bg-blue-900/20 rounded-3xl flex items-center justify-center p-6 text-center border border-blue-100 dark:border-blue-900/30">
                                        <div>
                                            <ShieldCheck className="w-8 h-8 text-blue-600 dark:text-blue-400 mx-auto mb-3" />
                                            <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{t('gettingStarted.activationGuide.roamingOn', 'Ensure Data Roaming is turned ON for the eSIM')}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 dark:bg-background">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-6">{t('gettingStarted.cta.title', 'Ready for your next adventure?')}</h2>
                    <p className="text-xl text-gray-500 dark:text-gray-400 mb-10">{t('gettingStarted.cta.subtitle', 'Get a {{siteName}} eSIM and stay connected wherever you go.', { siteName })}</p>
                    <Button
                        onClick={() => navigate('/destinations')}
                        size="lg"
                        className="bg-[var(--primary)] hover:bg-[#235d2d] text-white px-10 h-16 rounded-2xl text-xl font-bold shadow-xl shadow-green-900/20 transition-all hover:scale-105"
                    >
                        {t('gettingStarted.cta.action', 'Browse Destinations')}
                        <ArrowRight className="ml-2 h-6 w-6" />
                    </Button>
                </div>
            </section>
        </div>
    );
}

export default GettingStarted;