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

      <div className="min-h-screen bg-background">
        <section className="relative overflow-hidden bg-hero-gradient text-white">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-20 right-20 w-72 h-72 bg-primary/20 rounded-full blur-3xl" />
            <div className="absolute bottom-10 left-10 w-96 h-96 bg-primary-light/10 rounded-full blur-3xl" />
          </div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 relative z-10 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/15 backdrop-blur-sm mb-6">
              <Shield className="w-4 h-4 text-white" />
              <span className="text-sm font-medium text-white">{t('security.heroLabel', 'Security First')}</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              {t('security.heroTitlePrefix', 'Travel safely with')}{' '}
              <span className="bg-gradient-to-r from-primary-light to-white bg-clip-text text-transparent">{t('security.heroTitleHighlight', 'enterprise-grade security')}</span>
            </h1>
            <p className="text-lg md:text-xl text-white/80 mb-8 max-w-2xl mx-auto">
              {t('security.heroSubtitle', 'Your privacy matters. {{siteName}} uses cutting-edge security measures to protect your data, identity, and browsing activity wherever you travel.', { siteName })}
            </p>
            <button onClick={() => navigate('/destinations')} className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-white text-primary-dark font-semibold text-lg hover:bg-slate-100 transition-colors">
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
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${f.color} flex items-center justify-center mb-5`}>
                    <f.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-2">{f.title}</h3>
                  <p className="text-muted-foreground">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24 bg-background dark:bg-gray-950 dark:text-gray-100">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">{t('security.checklistTitle', 'Complete protection checklist')}</h2>
                <p className="text-muted-foreground text-lg mb-8">
                  {t('security.checklistSubtitle', 'From the moment you activate your eSIM, multiple layers of security protect your connection.')}
                </p>
              </div>
              <div className="bg-card rounded-2xl p-8 border border-border dark:bg-gray-800 dark:text-gray-100">
                <ul className="space-y-4">
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