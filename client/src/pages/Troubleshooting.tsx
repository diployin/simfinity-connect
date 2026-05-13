import {
    Wrench,
    WifiOff,
    Scan,
    Smartphone,
    MessageCircle,
    HelpCircle,
    AlertCircle,
    CheckCircle2,
    ChevronRight,
    ShieldAlert,
    Signal,
    LifeBuoy
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Helmet } from 'react-helmet-async';
import { useSettingByKey } from '@/hooks/useSettings';
import { useLocation } from 'wouter';
import { useTranslation } from 'react-i18next';

export function Troubleshooting() {
    const { t } = useTranslation();
    const siteName = useSettingByKey('platform_name') || 'Voltey';
    const [, navigate] = useLocation();

    const commonIssues = [
        {
            icon: WifiOff,
            title: t('troubleshooting.issues.noData.title'),
            description: t('troubleshooting.issues.noData.description'),
            solutions: t('troubleshooting.issues.noData.solutions', { returnObjects: true, siteName }) as string[],
            color: 'bg-amber-50',
            iconColor: 'text-amber-600'
        },
        {
            icon: Scan,
            title: t('troubleshooting.issues.qrScan.title'),
            description: t('troubleshooting.issues.qrScan.description'),
            solutions: t('troubleshooting.issues.qrScan.solutions', { returnObjects: true }) as string[],
            color: 'bg-blue-50',
            iconColor: 'text-blue-600'
        },
        {
            icon: Signal,
            title: t('troubleshooting.issues.slowSpeed.title'),
            description: t('troubleshooting.issues.slowSpeed.description'),
            solutions: t('troubleshooting.issues.slowSpeed.solutions', { returnObjects: true }) as string[],
            color: 'bg-green-50',
            iconColor: 'text-green-600'
        },
        {
            icon: ShieldAlert,
            title: t('troubleshooting.issues.activationError.title'),
            description: t('troubleshooting.issues.activationError.description'),
            solutions: t('troubleshooting.issues.activationError.solutions', { returnObjects: true }) as string[],
            color: 'bg-red-50',
            iconColor: 'text-red-600'
        }
    ];

    return (
        <div className="min-h-screen bg-white flex flex-col">
            <Helmet>
                <title>{`${t('troubleshooting.title')} - ${siteName} | Help & Support`}</title>
                <meta
                    name="description"
                    content={`Need help with your ${siteName} eSIM? Find solutions for common connectivity, activation, and performance issues.`}
                />
            </Helmet>

            {/* Hero Section */}
            <section className="py-20 md:py-28 bg-slate-900 text-white overflow-hidden relative">
                <div className="absolute top-0 right-0 w-1/2 h-full opacity-10">
                    <Wrench className="w-96 h-96 -mr-20 -mt-20 transform rotate-12" />
                </div>
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="max-w-3xl">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-white/80 text-sm font-medium mb-6 backdrop-blur-sm border border-white/10">
                            <LifeBuoy className="w-4 h-4" />
                            {t('troubleshooting.supportCenter')}
                        </div>
                        <h1 className="text-4xl md:text-6xl font-bold mb-6">
                            {t('troubleshooting.heroTitle').split('?')[0]} <span className="text-green-400">{t('troubleshooting.heroTitle').split('?')[1] || '?'}</span><br />
                            {t('troubleshooting.heroSubtitle')}
                        </h1>
                        <p className="text-xl text-slate-400 leading-relaxed mb-8">
                            {t('troubleshooting.heroDesc')}
                        </p>
                    </div>
                </div>
            </section>

            {/* Common Issues Grid */}
            <section className="py-24 bg-white -mt-12 relative z-20">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {commonIssues.map((issue, index) => (
                            <div
                                key={index}
                                className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-slate-200 transition-all duration-300 group"
                            >
                                <div className={`w-16 h-16 rounded-2xl ${issue.color} ${issue.iconColor} flex items-center justify-center mb-8 group-hover:scale-110 transition-transform`}>
                                    <issue.icon className="w-8 h-8" />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-4">{issue.title}</h3>
                                <p className="text-gray-500 mb-8 leading-relaxed">
                                    {issue.description}
                                </p>
                                <div className="space-y-4">
                                    {Array.isArray(issue.solutions) && issue.solutions.map((solution, sIndex) => (
                                        <div key={sIndex} className="flex gap-4 items-start">
                                            <div className="w-6 h-6 rounded-full bg-slate-50 flex items-center justify-center flex-shrink-0 mt-0.5 border border-slate-100">
                                                <span className="text-xs font-bold text-slate-400">{sIndex + 1}</span>
                                            </div>
                                            <p className="text-gray-700 font-medium text-sm leading-relaxed">{solution}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Manual Installation Section */}
            <section className="py-24 bg-slate-50">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-slate-900 rounded-[3rem] p-8 md:p-16 text-white overflow-hidden relative">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/10 rounded-full blur-3xl" />
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                            <div>
                                <h2 className="text-3xl md:text-4xl font-bold mb-6">{t('troubleshooting.manualInstallation.title')}</h2>
                                <p className="text-slate-400 mb-8 leading-relaxed">
                                    {t('troubleshooting.manualInstallation.description')}
                                </p>
                                <div className="space-y-4">
                                    <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                                        <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">{t('troubleshooting.manualInstallation.smdp')}</h4>
                                        <p className="text-lg font-mono text-green-400">{t('troubleshooting.manualInstallation.smdpDesc')}</p>
                                    </div>
                                    <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                                        <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">{t('troubleshooting.manualInstallation.activationCode')}</h4>
                                        <p className="text-lg font-mono text-green-400">{t('troubleshooting.manualInstallation.activationCodeDesc')}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="relative">
                                <div className="bg-gradient-to-br from-green-500/20 to-blue-500/20 aspect-square rounded-[2rem] flex items-center justify-center border border-white/10">
                                    <div className="text-center p-8">
                                        <Smartphone className="w-24 h-24 text-white/20 mx-auto mb-6" />
                                        <p className="text-xl font-medium">{t('troubleshooting.manualInstallation.instructions')}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Still Stuck? Section */}
            <section className="py-24">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-50 text-[#2c7338] mb-8">
                        <MessageCircle className="w-10 h-10" />
                    </div>
                    <h2 className="text-4xl font-bold text-gray-900 mb-6">{t('troubleshooting.stillStuck.title')}</h2>
                    <p className="text-xl text-gray-500 mb-10 leading-relaxed">
                        {t('troubleshooting.stillStuck.description')}
                    </p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <Button
                            onClick={() => navigate('/contact-support')}
                            size="lg"
                            className="bg-[#2c7338] hover:bg-[#235d2d] text-white px-10 h-16 rounded-2xl text-lg font-bold shadow-xl shadow-green-900/10 transition-all hover:scale-105"
                        >
                            {t('troubleshooting.stillStuck.contactSupport')}
                            <ChevronRight className="ml-2 h-5 w-5" />
                        </Button>
                        <Button
                            onClick={() => navigate('/help-center')}
                            variant="outline"
                            size="lg"
                            className="border-slate-200 hover:bg-slate-50 px-10 h-16 rounded-2xl text-lg font-bold transition-all"
                        >
                            {t('troubleshooting.stillStuck.browseFaq')}
                        </Button>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default Troubleshooting;