import {
  Globe2,
  Users,
  BarChart3,
  CreditCard,
  QrCode,
  Zap,
  Shield,
  ChevronRight,
  CheckCircle2,
  Building2,
  Briefcase,
  Plane,
  ArrowRight,
} from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { useSettingByKey } from '@/hooks/useSettings';
import { useLocation } from 'wouter';

export default function Business() {
  const siteName = useSettingByKey('platform_name') || 'Simfinity';
  const [, navigate] = useLocation();

  const features = [
    {
      icon: Globe2,
      title: 'Global Coverage',
      desc: 'Get fast, reliable data in more than 200+ destinations worldwide.',
      color: 'from-primary to-primary-dark',
      bgLight: 'from-primary/5 to-primary/10',
      bgDark: 'dark:from-primary/20 dark:to-primary/10',
    },
    {
      icon: Zap,
      title: 'Automatic Activation',
      desc: 'eSIMs activate as soon as your team reaches their destination — zero setup needed.',
      color: 'from-amber-500 to-amber-600',
      bgLight: 'from-amber-50 to-amber-100',
      bgDark: 'dark:from-amber-950/30 dark:to-amber-900/20',
    },
    {
      icon: CreditCard,
      title: 'Predictable Pricing',
      desc: 'Budgeting is easier with transparent plan costs for teams of any size.',
      color: 'from-emerald-500 to-emerald-600',
      bgLight: 'from-emerald-50 to-emerald-100',
      bgDark: 'dark:from-emerald-950/30 dark:to-emerald-900/20',
    },
    {
      icon: BarChart3,
      title: 'Usage Analytics',
      desc: 'Track data use, optimize spending, and make sure your team stays online.',
      color: 'from-purple-500 to-purple-600',
      bgLight: 'from-purple-50 to-purple-100',
      bgDark: 'dark:from-purple-950/30 dark:to-purple-900/20',
    },
    {
      icon: QrCode,
      title: 'QR Code Activation',
      desc: 'Team members get online using just a QR code — no app required!',
      color: 'from-rose-500 to-rose-600',
      bgLight: 'from-rose-50 to-rose-100',
      bgDark: 'dark:from-rose-950/30 dark:to-rose-900/20',
    },
    {
      icon: Shield,
      title: 'Easy Payment',
      desc: 'Buy multiple plans with one purchase and view invoices through the dashboard.',
      color: 'from-cyan-500 to-cyan-600',
      bgLight: 'from-cyan-50 to-cyan-100',
      bgDark: 'dark:from-cyan-950/30 dark:to-cyan-900/20',
    },
  ];

  const steps = [
    {
      num: '1',
      title: 'Add Team Members',
      desc: 'Start by adding team members to your organization and assigning plans.',
      icon: Users,
      color: 'from-primary to-primary-dark',
    },
    {
      num: '2',
      title: 'Purchase Plans Quickly',
      desc: 'Choose country, regional, or global plans and buy instantly.',
      icon: CreditCard,
      color: 'from-purple-500 to-purple-600',
    },
    {
      num: '3',
      title: 'Monitor Data Usage',
      desc: 'Once a user has activated an eSIM, you can track usage and renew plans remotely.',
      icon: BarChart3,
      color: 'from-amber-500 to-amber-600',
    },
  ];

  const faqs = [
    {
      q: 'What is the difference between an eSIM and a SIM card for business?',
      a: 'For business users, eSIMs are easier to set up and manage. They allow business travelers to stay connected while retaining their original phone number and avoiding roaming fees. Unlike physical SIM cards, eSIMs are impossible to break, steal, or lose.',
    },
    {
      q: `What countries does ${siteName} business eSIM cover?`,
      a: `${siteName} offers mobile data plans in 200+ destinations for both individual clients and business users. You can see all destinations on our website or the ${siteName} app.`,
    },
    {
      q: 'How do I use an eSIM for business?',
      a: `After you register, your team members install the eSIM profile on their phones and add the data plan they need. It will activate automatically when they reach their destination. You can assign multiple data plans whenever needed.`,
    },
    {
      q: 'How can I add more data to my business eSIM plan?',
      a: 'You can easily top up data directly from the business dashboard, or contact your dedicated account manager for bulk upgrades.',
    },
    {
      q: 'Can I share data through a hotspot?',
      a: 'Yes! You can create a hotspot on your smartphone and connect your laptop to it. You can also set up an eSIM on laptops that support eSIMs for direct internet access.',
    },
    {
      q: 'Can I use SIM and eSIM cards simultaneously?',
      a: 'Yes. Phones that support eSIM technology allow you to keep your physical SIM card and use an eSIM profile simultaneously. You can switch between the two or have both active.',
    },
  ];

  return (
    <>
      <Helmet>
        <title>eSIM for Business — {siteName}</title>
        <meta name="description" content={`Manage all your team's eSIM plans from one dashboard. ${siteName} for Business offers global coverage, usage analytics, and predictable pricing.`} />
      </Helmet>

      <div className="min-h-screen bg-background">
        {/* Hero */}
        <section className="relative overflow-hidden bg-hero-gradient text-white">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-20 right-20 w-72 h-72 bg-primary/20 rounded-full blur-3xl" />
            <div className="absolute bottom-10 left-10 w-96 h-96 bg-primary-light/10 rounded-full blur-3xl" />
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 relative z-10">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/15 backdrop-blur-sm mb-6">
                <Building2 className="w-4 h-4 text-white" />
                <span className="text-sm font-medium text-white">{siteName} for Business</span>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                Manage all your team's eSIM plans from{' '}
                <span className="bg-gradient-to-r from-primary-light to-white bg-clip-text text-transparent">one dashboard</span>
              </h1>

              <p className="text-lg md:text-xl text-white/80 mb-8 max-w-2xl">
                Buy and monitor eSIM plans from an easy-to-use dashboard. Assign plans, track usage, and add data as needed, so your team stays connected wherever they go.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => navigate('/destinations')}
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-white text-primary-dark font-semibold text-lg hover:bg-slate-100 transition-colors"
                >
                  Get Started
                  <ArrowRight className="w-5 h-5" />
                </button>
                <button className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl border border-white/20 text-white font-semibold text-lg hover:bg-white/10 transition-colors">
                  Contact Sales
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Why businesses choose us */}
        <section className="py-16 md:py-24 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Why businesses choose {siteName}
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Everything your team needs to stay connected, managed from one place.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((f) => (
                <div key={f.title} className={`rounded-2xl bg-gradient-to-br ${f.bgLight} ${f.bgDark} p-8 border border-border/50`}>
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

        {/* How it works */}
        <section className="py-16 md:py-24 bg-muted/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Get started with your {siteName} business dashboard
              </h2>
              <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
                The business dashboard gives your company full control over team connectivity — from adding team members to assigning and managing eSIMs across the workforce.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {steps.map((step) => (
                <div key={step.num} className="relative bg-card rounded-2xl p-8 border border-border text-center">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center mx-auto mb-6`}>
                    <span className="text-2xl font-bold text-white">{step.num}</span>
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-3">{step.title}</h3>
                  <p className="text-muted-foreground">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits strip */}
        <section className="py-16 md:py-20 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                  Built for teams that travel
                </h2>
                <p className="text-muted-foreground text-lg mb-8">
                  Whether your team is flying to a conference, visiting remote offices, or working from anywhere — {siteName} Business keeps everyone connected without the hassle of local SIM cards or expensive roaming.
                </p>
                <ul className="space-y-4">
                  {[
                    'No contracts or hidden fees — pay only for what you use',
                    'Centralized billing with downloadable invoices',
                    'Instant provisioning — no waiting for physical cards',
                    'Dedicated account manager for enterprise plans',
                    'Bulk discounts for large teams',
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: Briefcase, label: 'Corporate Travel', value: '500+ Teams', color: 'from-primary to-primary-dark' },
                  { icon: Globe2, label: 'Destinations', value: '200+', color: 'from-purple-500 to-purple-600' },
                  { icon: Plane, label: 'Trips Powered', value: '50K+', color: 'from-amber-500 to-amber-600' },
                  { icon: Users, label: 'Business Users', value: '10K+', color: 'from-rose-500 to-rose-600' },
                ].map((stat) => (
                  <div key={stat.label} className="bg-card rounded-2xl p-6 border border-border text-center">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mx-auto mb-3`}>
                      <stat.icon className="w-6 h-6 text-white" />
                    </div>
                    <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-16 md:py-24 bg-muted/30">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground text-center mb-12">
              Frequently asked questions
            </h2>

            <div className="space-y-4">
              {faqs.map((faq, i) => (
                <details key={i} className="group bg-card rounded-xl border border-border overflow-hidden">
                  <summary className="flex items-center justify-between p-6 cursor-pointer list-none">
                    <h3 className="font-semibold text-foreground pr-4">{faq.q}</h3>
                    <ChevronRight className="w-5 h-5 text-muted-foreground flex-shrink-0 transition-transform group-open:rotate-90" />
                  </summary>
                  <div className="px-6 pb-6 pt-0">
                    <p className="text-muted-foreground">{faq.a}</p>
                  </div>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 md:py-24 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="rounded-3xl bg-hero-gradient p-8 md:p-16 text-center relative overflow-hidden">
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-10 right-10 w-64 h-64 bg-primary/20 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-10 w-48 h-48 bg-primary-light/10 rounded-full blur-3xl" />
              </div>

              <div className="relative z-10">
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
                  Ready to get your team connected?
                </h2>
                <p className="text-white/80 text-lg mb-8 max-w-2xl mx-auto">
                  Explore the {siteName} business dashboard, or chat with our sales team to get the right quote for your business.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <button
                    onClick={() => navigate('/destinations')}
                    className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-white text-primary-dark font-bold text-lg shadow-lg hover:shadow-xl transition-all hover:scale-[1.02]"
                  >
                    Get Started
                    <ArrowRight className="w-5 h-5" />
                  </button>
                  <button className="inline-flex items-center gap-2 px-8 py-4 rounded-xl border border-white/20 text-white font-semibold text-lg hover:bg-white/10 transition-colors">
                    Contact Sales
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
