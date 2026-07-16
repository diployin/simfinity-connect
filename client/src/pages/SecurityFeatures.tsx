import {
  Shield,
  Lock,
  Eye,
  Server,
  Key,
  Fingerprint,
  ArrowRight,
  CheckCircle2,
  Globe2,
  Wifi,
} from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { useSettingByKey } from '@/hooks/useSettings';
import { useLocation } from 'wouter';
import { useTranslation } from '@/contexts/TranslationContext';

export default function SecurityFeatures() {
  const siteName = useSettingByKey('platform_name') || 'Voltey';
  const [, navigate] = useLocation();
  const { t } = useTranslation();

  const features = [
    { icon: Lock, title: t('security.featEncryptionTitle', 'End-to-End Encryption'), desc: t('security.featEncryptionDesc', 'All data transmitted through your eSIM connection is encrypted using industry-standard protocols.'), color: 'from-blue-500 to-blue-600' },
    { icon: Shield, title: t('security.featDpnTitle', 'DPN Protection'), desc: t('security.featDpnDesc', 'Built-in Decentralized Private Network keeps your browsing private on any network.'), color: 'from-purple-500 to-purple-600' },
    { icon: Fingerprint, title: t('security.featBiometricTitle', 'Biometric Authentication'), desc: t('security.featBiometricDesc', 'Secure your account with fingerprint or face recognition on supported devices.'), color: 'from-rose-500 to-rose-600' },
    { icon: Eye, title: t('security.featNoLogTitle', 'No-Log Policy'), desc: t('security.featNoLogDesc', 'We never track, store, or share your browsing activity or personal data.'), color: 'from-amber-500 to-amber-600' },
    { icon: Server, title: t('security.featInfraTitle', 'Secure Infrastructure'), desc: t('security.featInfraDesc', 'Our servers are hosted in Tier-4 data centers with 24/7 monitoring and redundancy.'), color: 'from-cyan-500 to-cyan-600' },
    { icon: Key, title: t('security.featEsimTitle', 'Secure eSIM Profiles'), desc: t('security.featEsimDesc', 'eSIM profiles are cryptographically protected and can\'t be cloned or intercepted.'), color: 'from-emerald-500 to-emerald-600' },
  ];

  const protections = [
    t('security.protect1', 'Protection on public WiFi networks'),
    t('security.protect2', 'DNS leak prevention'),
    t('security.protect3', 'Automatic kill switch for data protection'),
    t('security.protect4', 'Remote device lock and wipe capability'),
    t('security.protect5', 'Fraud detection and prevention'),
    t('security.protect6', 'PCI DSS compliant payment processing'),
    t('security.protect7', 'GDPR compliant data handling'),
    t('security.protect8', 'Regular third-party security audits'),
  ];

  return (
    <>
      <Helmet>
        <title>{t('security.pageTitle', 'Security Features — {{siteName}}', { siteName })}</title>
        <meta name="description" content={t('security.pageMeta', '{{siteName}} keeps your data safe with end-to-end encryption, DPN protection, and enterprise-grade security.', { siteName })} />
      </Helmet>

      <div className="min-h-screen bg-background dark:bg-gray-950 text-black dark:text-white">
        <section className="relative pt-24 pb-20 md:pt-32 md:pb-28 overflow-hidden bg-[#f8fafc] dark:bg-slate-950">
          <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
            <div className="absolute top-0 right-0 w-1/3 h-full bg-primary/5 transform skew-x-12 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-blue-500/5 rounded-full blur-[120px] -translate-x-1/2 translate-y-1/2" />
          </div>
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 relative z-10 text-center">
            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white dark:bg-slate-900 shadow-sm border border-slate-100 dark:border-slate-800 text-primary text-sm font-bold mb-8">
              <Shield className="w-4 h-4" />
              <span className="font-bold">{t('security.heroLabel', 'Security First')}</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-[1.1] mb-6 text-slate-900 dark:text-white tracking-tight">
              {t('security.heroTitlePrefix', 'Travel safely with')}{' '}
              <span className="bg-gradient-to-r from-primary-light to-primary bg-clip-text text-transparent">{t('security.heroTitleHighlight', 'enterprise-grade security')}</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
              {t('security.heroSubtitle', 'Your privacy matters. {{siteName}} uses cutting-edge security measures to protect your data, identity, and browsing activity wherever you travel.', { siteName })}
            </p>
            <button onClick={() => navigate('/destinations')} className="h-14 px-10 rounded-2xl bg-primary text-white font-bold text-lg hover:bg-primary-dark transition-all shadow-xl shadow-primary/20 active:scale-[0.98]">
              {t('security.getProtectedBtn', 'Get Protected')} <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </section>

        <section className="py-16 md:py-24 bg-background dark:bg-gray-950 dark:text-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">{t('security.builtInTitle', 'Security built in, not bolted on')}</h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">{t('security.builtInSubtitle', 'Every layer of {{siteName}} is designed with your security in mind.', { siteName })}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((f) => (
                <div key={f.title} className="bg-card rounded-2xl p-8 border border-border dark:bg-gray-800 dark:text-gray-100">
                  <div className="w-12 h-12 flex items-center justify-center mb-5">
                    <f.icon className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-2">{f.title}</h3>
                  <p className="text-muted-foreground">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-10 md:py-14 bg-background dark:bg-gray-950 dark:text-gray-100">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">{t('security.checklistTitle', 'Complete protection checklist')}</h2>
                <p className="text-muted-foreground text-lg mb-8">
                  {t('security.checklistSubtitle', 'From the moment you activate your eSIM, multiple layers of security protect your connection.')}
                </p>
              </div>
              <div className="py-3 px-0">
                <ul className="space-y-2">
                  {protections.map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24 bg-background dark:bg-gray-950 dark:text-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="rounded-3xl bg-hero-gradient p-8 md:p-16 text-center relative overflow-hidden">
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-10 right-10 w-64 h-64 bg-primary/20 rounded-full blur-3xl" />
              </div>
              <div className="relative z-10">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">{t('security.ctaTitle', 'Browse with confidence')}</h2>
                <p className="text-white/80 text-lg mb-8 max-w-2xl mx-auto">{t('security.ctaSubtitle', 'Stay protected on any network, in any country. Your security is our priority.')}</p>
                <button onClick={() => navigate('/destinations')} className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-white text-primary-dark font-bold text-lg hover:bg-slate-100 transition-colors">
                  {t('security.browsePlansBtn', 'Browse Plans')} <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}