import {
  Smartphone,
  Wifi,
  Globe2,
  Zap,
  Shield,
  CheckCircle2,
  ArrowRight,
  Layers,
  RefreshCw,
  Plane,
} from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { useSettingByKey } from '@/hooks/useSettings';
import { useLocation } from 'wouter';
import { useTranslation } from '@/contexts/TranslationContext';

export default function WhatIsEsim() {
  const siteName = useSettingByKey('platform_name') || 'Voltey';
  const [, navigate] = useLocation();
    const { t } = useTranslation();

 const benefits = [
    { icon: Zap, title: t('website.whatIsEsim.benefitSetupTitle', 'Instant Setup'), desc: t('website.whatIsEsim.benefitSetupDesc', 'No need to visit a store or wait for delivery. Download and activate in minutes.'), color: 'from-amber-500 to-amber-600' },
    { icon: Globe2, title: t('website.whatIsEsim.benefitGlobalTitle', 'Global Coverage'), desc: t('website.whatIsEsim.benefitGlobalDesc', 'Connect in 200+ destinations worldwide without swapping SIM cards.'), color: 'from-blue-500 to-blue-600' },
    { icon: Layers, title: t('website.whatIsEsim.benefitProfilesTitle', 'Multiple Profiles'), desc: t('website.whatIsEsim.benefitProfilesDesc', 'Store several eSIM profiles on one device — perfect for frequent travelers.'), color: 'from-purple-500 to-purple-600' },
    { icon: Shield, title: t('website.whatIsEsim.benefitSecureTitle', 'More Secure'), desc: t('website.whatIsEsim.benefitSecureDesc', 'eSIMs can\'t be physically removed, stolen, or lost. Built-in security.'), color: 'from-rose-500 to-rose-600' },
    { icon: RefreshCw, title: t('website.whatIsEsim.benefitEcoTitle', 'Eco-Friendly'), desc: t('website.whatIsEsim.benefitEcoDesc', 'No plastic SIM cards, no packaging waste. Better for the planet.'), color: 'from-emerald-500 to-emerald-600' },
    { icon: Wifi, title: t('website.whatIsEsim.benefitDualTitle', 'Dual SIM'), desc: t('website.whatIsEsim.benefitDualDesc', 'Keep your regular number active while using an eSIM for data abroad.'), color: 'from-cyan-500 to-cyan-600' },
  ];

  const faqs = [
    { q: t('website.whatIsEsim.faq1Q', 'What exactly is an eSIM?'), a: t('website.whatIsEsim.faq1A', 'An eSIM (embedded SIM) is a digital SIM built into your device. Instead of inserting a physical SIM card, you download a data plan digitally. It works just like a regular SIM but without the physical card.') },
    { q: t('website.whatIsEsim.faq2Q', 'How is an eSIM different from a physical SIM?'), a: t('website.whatIsEsim.faq2A', 'A physical SIM is a small card you insert into your phone. An eSIM is embedded in your device and can be programmed with different carrier profiles digitally. You can switch plans without swapping cards.') },
    { q: t('website.whatIsEsim.faq3Q', 'Does my phone support eSIM?'), a: t('website.whatIsEsim.faq3A', 'Most phones released after 2018 support eSIM, including iPhone XR and later, Samsung Galaxy S20 and later, Google Pixel 3 and later, and many more. Check our Supported Devices page for a full list.') },
    { q: t('website.whatIsEsim.faq4Q', 'Can I keep my regular phone number with an eSIM?'), a: t('website.whatIsEsim.faq4A', 'Yes! You can use your eSIM for data while keeping your physical SIM for calls and texts with your regular number. This dual-SIM setup is perfect for travelers.') },
    { q: t('website.whatIsEsim.faq5Q', 'How do I install an eSIM?'), a: t('website.whatIsEsim.faq5A', 'It\'s simple: purchase an eSIM plan, scan the QR code provided, and follow your phone\'s setup instructions. Most installations take under 5 minutes.') },
    { q: t('website.whatIsEsim.faq6Q', 'Is an eSIM as reliable as a physical SIM?'), a: t('website.whatIsEsim.faq6A', 'Yes, eSIMs use the same cellular networks as physical SIMs. The only difference is how the SIM profile is delivered — digitally instead of on a physical card.') },
  ];

  return (
    <>
      <Helmet>
               <title>{t('website.whatIsEsim.pageTitle', 'What is an eSIM? — {{siteName}}', { siteName })}</title>
        <meta name="description" content={t('website.whatIsEsim.pageMeta', 'Learn what an eSIM is, how it works, and why it\'s the future of mobile connectivity for travelers.')} />
      </Helmet>

      <div className="min-h-screen bg-background">
        <section className="relative pt-20 md:pt-32 pb-24 md:pb-40 overflow-hidden bg-[#f8fafc] dark:bg-slate-950">
          <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
            <div className="absolute top-0 right-0 w-1/3 h-full bg-primary/5 transform skew-x-12 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-blue-500/5 rounded-full blur-[120px] -translate-x-1/2 translate-y-1/2" />
          </div>
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
              <div className="text-center lg:text-left">
                <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white dark:bg-slate-900 shadow-sm border border-slate-100 dark:border-slate-800 text-primary text-sm font-bold mb-8">
                  <Smartphone className="w-4 h-4" />
                  eSIM Technology
                </div>
                <h1 className="h1-fluid text-slate-900 dark:text-white mb-8 tracking-tight font-extrabold leading-[1.1]">
                  {t('website.whatIsEsim.heroTitlePrefix', 'What is an')}{' '}
                  <span className="bg-gradient-to-r from-primary-light to-white bg-clip-text text-transparent">{t('website.whatIsEsim.heroTitleHighlight', 'eSIM?')}</span>
                </h1>
                <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 leading-relaxed mb-10 max-w-2xl mx-auto lg:mx-0">
                 {t('website.whatIsEsim.heroSubtitle', 'An eSIM is a digital SIM embedded in your device. It lets you connect to mobile networks without a physical SIM card — just download a plan and go.')}
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <button onClick={() => navigate('/destinations')} className="h-14 px-10 rounded-2xl bg-primary text-white font-bold text-lg hover:bg-primary-dark transition-all shadow-xl shadow-primary/20 active:scale-[0.98]">
                   {t('website.whatIsEsim.browsePlansBtn', 'Browse eSIM Plans')} <ArrowRight className="w-5 h-5" />
                  </button>
                  <button onClick={() => navigate('/supported-devices')} className="h-14 px-10 rounded-2xl bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 text-slate-700 dark:text-slate-200 font-bold text-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-all shadow-sm active:scale-[0.98]">
                     {t('website.whatIsEsim.checkCompatBtn', 'Check Compatibility')}
                  </button>
                </div>
              </div>
              <div className="flex justify-center lg:justify-end relative">
                <div className="relative group">
                  <div className="w-64 h-64 md:w-80 md:h-80 bg-white dark:bg-slate-900 shadow-2xl border border-slate-100 dark:border-slate-800 rounded-[3rem] flex items-center justify-center rotate-3 group-hover:rotate-0 transition-transform duration-500">
                    <Smartphone className="w-24 h-24 md:w-32 md:h-32 text-primary" />
                  </div>
                  <div className="absolute -top-6 -right-6 bg-white dark:bg-slate-800 shadow-xl border border-slate-100 dark:border-slate-700 rounded-2xl px-5 py-3 flex items-center gap-3 animate-bounce">
                    <Wifi className="w-5 h-5 text-green-500" />
                    <span className="text-sm font-medium text-white">{t('website.whatIsEsim.badgeConnected', 'Connected')}</span>
                  </div>
                  <div className="absolute -bottom-6 -left-6 bg-white dark:bg-slate-800 shadow-xl border border-slate-100 dark:border-slate-700 rounded-2xl px-5 py-3 flex items-center gap-3">
                    <Globe2 className="w-5 h-5 text-primary" />
                  <span className="text-sm font-medium text-white">{t('website.whatIsEsim.badgeCountries', '200+ countries')}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 md:py-32 bg-background">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
              <div className="order-2 lg:order-1">
               <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">{t('website.whatIsEsim.howWorksTitle', 'How does an eSIM work?')}</h2>
                <div className="space-y-8">
                     {[
                    { step: '1', text: t('website.whatIsEsim.howWorksStep1', 'Your device has a tiny chip built in that acts as a SIM card.') },
                    { step: '2', text: t('website.whatIsEsim.howWorksStep2', 'Instead of inserting a physical card, you download a carrier profile digitally.') },
                    { step: '3', text: t('website.whatIsEsim.howWorksStep3', 'The eSIM profile connects you to local networks in your destination.') },
                    { step: '4', text: t('website.whatIsEsim.howWorksStep4', 'You can store multiple profiles and switch between them anytime.') },
                  ].map((item) => (
                    <div key={item.step} className="flex items-start gap-6 group">
                      <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center flex-shrink-0 font-bold text-lg group-hover:bg-primary group-hover:text-white transition-all">
                        {item.step}
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-foreground mb-1">{item.title}</h4>
                        <p className="text-muted-foreground leading-relaxed">{item.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="order-1 lg:order-2 bg-slate-50 dark:bg-slate-900/50 rounded-[2.5rem] p-8 md:p-12 border border-slate-100 dark:border-slate-800 shadow-inner">
                <h3 className="text-2xl font-bold text-foreground mb-8 text-center tracking-tight">{t('website.whatIsEsim.vsTitle', 'eSIM vs Physical SIM')}</h3>
                <div className="responsive-table-container border-none bg-transparent overflow-x-auto">
                  <div className="min-w-[320px]">
                    {/* Header Row */}
                    <div className="grid grid-cols-3 gap-2 md:gap-6 text-[10px] sm:text-sm md:text-base py-3 border-b-2 border-slate-200 dark:border-slate-700 mb-2 px-1">
                      <span className="font-extrabold text-foreground uppercase tracking-wider">{t('website.whatIsEsim.feature', 'Feature')}</span>
                      <span className="font-extrabold text-primary uppercase tracking-wider">eSIM</span>
                      <span className="font-extrabold text-muted-foreground uppercase tracking-wider">Physical SIM</span>
                    </div>
                    {/* Data Rows */}
                    <div className="space-y-1">
                    {[
                      { feature: t('website.whatIsEsim.vsSetupTime', 'Setup time'), esim: t('website.whatIsEsim.valMinutes', 'Minutes'), sim: t('website.whatIsEsim.valHoursDays', 'Hours/Days') },
                      { feature: t('website.whatIsEsim.vsStoreVisit', 'Store visit'), esim: t('website.whatIsEsim.valNotNeeded', 'Not needed'), sim: t('website.whatIsEsim.valRequired', 'Required') },
                      { feature: t('website.whatIsEsim.vsMultiplePlans', 'Multiple plans'), esim: t('website.whatIsEsim.valDigital', 'Yes, digital'), sim: t('website.whatIsEsim.valMultipleCards', 'Need multiple cards') },
                      { feature: t('website.whatIsEsim.vsLost', 'Can be lost'), esim: t('website.whatIsEsim.valNo', 'No'), sim: t('website.whatIsEsim.valYes', 'Yes') },
                      { feature: t('website.whatIsEsim.vsEcoFriendly', 'Eco-friendly'), esim: t('website.whatIsEsim.valYes', 'Yes'), sim: t('website.whatIsEsim.valPlasticWaste', 'Plastic waste') },
                      { feature: t('website.whatIsEsim.vsDualSim', 'Dual SIM'), esim: t('website.whatIsEsim.valBuiltIn', 'Built-in'), sim: t('website.whatIsEsim.valExtraSlot', 'Extra slot needed') },
                    ].map((row) => (
                        <div key={row.feature} className="grid grid-cols-3 gap-2 md:gap-6 text-xs sm:text-sm md:text-base py-3 border-b border-slate-200/60 dark:border-slate-800 last:border-none hover:bg-slate-100/50 dark:hover:bg-slate-800/50 transition-colors rounded-lg px-1">
                          <span className="font-bold text-foreground flex items-center pr-2">{row.feature}</span>
                          <span className="text-primary font-bold flex items-center pr-2">{row.esim}</span>
                          <span className="text-muted-foreground font-medium flex items-center">{row.sim}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 md:py-32 bg-slate-50 dark:bg-slate-900/30">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
            <div className="text-center mb-16 md:mb-24">
              <h2 className="h2-fluid font-bold text-foreground mb-6 tracking-tight">{t('website.whatIsEsim.benefitsTitle', 'Benefits of using an eSIM')}</h2>
              {/* <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Everything you need for a stress-free travel connection.</p> */}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {benefits.map((b) => (
                <div key={b.title} className="bg-card dark:bg-slate-900 rounded-[2rem] p-10 border border-border shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${b.color} flex items-center justify-center mb-8 shadow-lg group-hover:scale-110 transition-transform`}>
                    <b.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-4">{b.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{b.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24 bg-background">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground text-center mb-12">{t('website.whatIsEsim.faqTitle', 'Frequently asked questions')}</h2>
            <div className="space-y-4">
              {faqs.map((faq, i) => (
                <details key={i} className="group bg-card rounded-xl border border-border overflow-hidden">
                  <summary className="flex items-center justify-between p-6 cursor-pointer list-none">
                    <h3 className="font-semibold text-foreground pr-4">{faq.q}</h3>
                    <ArrowRight className="w-5 h-5 text-muted-foreground flex-shrink-0 transition-transform group-open:rotate-90" />
                  </summary>
                  <div className="px-6 pb-6 pt-0">
                    <p className="text-muted-foreground">{faq.a}</p>
                  </div>
                </details>
              ))}
            </div>
          </div>
        </section>

          <section className="py-16 md:py-24 bg-muted/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="rounded-3xl bg-hero-gradient p-8 md:p-16 text-center relative overflow-hidden">
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-10 right-10 w-64 h-64 bg-primary/20 rounded-full blur-3xl" />
              </div>
              <div className="relative z-10">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">{t('website.whatIsEsim.ctaTitle', 'Ready to try an eSIM?')}</h2>
                <p className="text-white/80 text-lg mb-8 max-w-2xl mx-auto">{t('website.whatIsEsim.ctaDesc', 'Browse our affordable plans and get connected in minutes — no physical SIM card needed.')}</p>
                <button onClick={() => navigate('/destinations')} className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-white text-primary-dark font-bold text-lg hover:bg-slate-100 transition-colors">
                  {t('website.whatIsEsim.ctaBtn', 'Browse Plans')} <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
