import {
  DollarSign,
  TrendingUp,
  BarChart3,
  Globe2,
  Link2,
  Users,
  ArrowRight,
  CheckCircle2,
  Percent,
} from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { useSettingByKey } from '@/hooks/useSettings';
import { useTranslation } from '@/contexts/TranslationContext';

export default function BecomeAffiliate() {
  const siteName = useSettingByKey('platform_name') || 'Simfinity';
  const { t } = useTranslation();

  const benefits = [
    { icon: Percent, title: t('affiliate.benefit1Title', 'Competitive Commissions'), desc: t('affiliate.benefit1Desc', 'Earn up to 30% commission on every sale made through your referral link.'), color: 'from-blue-500 to-blue-600' },
    { icon: BarChart3, title: t('affiliate.benefit2Title', 'Real-time Dashboard'), desc: t('affiliate.benefit2Desc', 'Track clicks, conversions, and earnings in real-time through your affiliate dashboard.'), color: 'from-purple-500 to-purple-600' },
    { icon: Globe2, title: t('affiliate.benefit3Title', 'Global Market'), desc: t('affiliate.benefit3Desc', 'Promote to a worldwide audience — travelers everywhere need eSIM connectivity.'), color: 'from-amber-500 to-amber-600' },
    { icon: Link2, title: t('affiliate.benefit4Title', 'Custom Links'), desc: t('affiliate.benefit4Desc', 'Get unique tracking links and promotional materials to share with your audience.'), color: 'from-rose-500 to-rose-600' },
    { icon: DollarSign, title: t('affiliate.benefit5Title', 'Monthly Payouts'), desc: t('affiliate.benefit5Desc', 'Reliable monthly payouts via bank transfer, PayPal, or crypto.'), color: 'from-emerald-500 to-emerald-600' },
    { icon: TrendingUp, title: t('affiliate.benefit6Title', 'Lifetime Tracking'), desc: t('affiliate.benefit6Desc', 'Earn commissions on all future purchases from customers you refer — not just the first one.'), color: 'from-cyan-500 to-cyan-600' },
  ];

  const steps = [
    { num: '1', title: t('affiliate.step1Title', 'Apply'), desc: t('affiliate.step1Desc', 'Fill out a quick application to join our affiliate program.') },
    { num: '2', title: t('affiliate.step2Title', 'Promote'), desc: t('affiliate.step2Desc', 'Share your unique affiliate links through your website, blog, or social media.') },
    { num: '3', title: t('affiliate.step3Title', 'Earn'), desc: t('affiliate.step3Desc', 'Earn commissions every time someone makes a purchase through your link.') },
  ];

  return (
    <>
      <Helmet>
        <title>{t('affiliate.pageTitle', 'Become an Affiliate — {{siteName}}', { siteName })}</title>
        <meta name="description" content={t('affiliate.pageMeta', 'Join the {{siteName}} affiliate program and earn up to 30% commission promoting eSIM plans to travelers worldwide.', { siteName })} />
      </Helmet>

      <div className="min-h-screen bg-background">
        <section className="relative overflow-hidden bg-hero-gradient text-white">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-20 right-20 w-72 h-72 bg-primary/20 rounded-full blur-3xl" />
            <div className="absolute bottom-10 left-10 w-96 h-96 bg-primary-light/10 rounded-full blur-3xl" />
          </div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 relative z-10 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/15 backdrop-blur-sm mb-6">
              <TrendingUp className="w-4 h-4 text-white" />
              <span className="text-sm font-medium text-white">{t('affiliate.tagLabel', 'Affiliate Program')}</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              {t('affiliate.heroTitlePrefix', 'Earn money promoting')}{' '}
              <span className="bg-gradient-to-r from-primary-light to-white bg-clip-text text-transparent">{t('affiliate.heroTitleHighlight', 'travel connectivity')}</span>
            </h1>
            <p className="text-lg md:text-xl text-white/80 mb-8 max-w-2xl mx-auto">
              {t('affiliate.heroSubtitle', 'Join our affiliate program and earn up to 30% commission on every eSIM sale. Turn your audience into revenue.')}
            </p>
            <button className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-white text-primary-dark font-semibold text-lg hover:bg-slate-100 transition-colors">
              {t('affiliate.applyNowBtn', 'Apply Now')} <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </section>

        <section className="py-16 md:py-24 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">{t('affiliate.whyPartner', 'Why partner with {{siteName}}?', { siteName })}</h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">{t('affiliate.whyPartnerDesc', 'We give you the tools and support to succeed.')}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {benefits.map((b) => (
                <div key={b.title} className="bg-card rounded-2xl p-8 border border-border">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${b.color} flex items-center justify-center mb-5`}>
                    <b.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-2">{b.title}</h3>
                  <p className="text-muted-foreground">{b.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24 bg-muted/30">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">{t('affiliate.howItWorksTitle', 'How it works')}</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {steps.map((step) => (
                <div key={step.num} className="bg-card rounded-2xl p-8 border border-border text-center">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center mx-auto mb-6">
                    <span className="text-2xl font-bold text-white">{step.num}</span>
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-3">{step.title}</h3>
                  <p className="text-muted-foreground">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24 bg-background">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">{t('affiliate.whoCanJoinTitle', 'Who can become an affiliate?')}</h2>
            <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">{t('affiliate.whoCanJoinDesc', 'Our program is open to content creators, bloggers, influencers, travel agencies, and anyone with an audience interested in travel.')}</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { icon: Users, label: t('affiliate.audienceInfluencers', 'Influencers') },
                { icon: Globe2, label: t('affiliate.audienceBloggers', 'Travel Bloggers') },
                { icon: BarChart3, label: t('affiliate.audienceMarketers', 'Marketers') },
                { icon: Link2, label: t('affiliate.audienceAgencies', 'Agencies') },
              ].map((item) => (
                <div key={item.label} className="bg-card rounded-xl p-6 border border-border">
                  <item.icon className="w-8 h-8 text-primary mx-auto mb-3" />
                  <p className="font-medium text-foreground">{item.label}</p>
                </div>
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
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">{t('affiliate.ctaTitle', 'Ready to start earning?')}</h2>
                <p className="text-white/80 text-lg mb-8 max-w-2xl mx-auto">{t('affiliate.ctaDesc', 'Apply today and start earning commissions within days.')}</p>
                <button className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-white text-primary-dark font-bold text-lg hover:bg-slate-100 transition-colors">
                  {t('affiliate.applyNowBtn', 'Apply Now')} <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
