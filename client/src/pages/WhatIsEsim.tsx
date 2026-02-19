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

export default function WhatIsEsim() {
  const siteName = useSettingByKey('platform_name') || 'Simfinity';
  const [, navigate] = useLocation();

  const benefits = [
    { icon: Zap, title: 'Instant Setup', desc: 'No need to visit a store or wait for delivery. Download and activate in minutes.', color: 'from-amber-500 to-amber-600' },
    { icon: Globe2, title: 'Global Coverage', desc: 'Connect in 200+ destinations worldwide without swapping SIM cards.', color: 'from-blue-500 to-blue-600' },
    { icon: Layers, title: 'Multiple Profiles', desc: 'Store several eSIM profiles on one device — perfect for frequent travelers.', color: 'from-purple-500 to-purple-600' },
    { icon: Shield, title: 'More Secure', desc: 'eSIMs can\'t be physically removed, stolen, or lost. Built-in security.', color: 'from-rose-500 to-rose-600' },
    { icon: RefreshCw, title: 'Eco-Friendly', desc: 'No plastic SIM cards, no packaging waste. Better for the planet.', color: 'from-emerald-500 to-emerald-600' },
    { icon: Wifi, title: 'Dual SIM', desc: 'Keep your regular number active while using an eSIM for data abroad.', color: 'from-cyan-500 to-cyan-600' },
  ];

  const faqs = [
    { q: 'What exactly is an eSIM?', a: 'An eSIM (embedded SIM) is a digital SIM built into your device. Instead of inserting a physical SIM card, you download a data plan digitally. It works just like a regular SIM but without the physical card.' },
    { q: 'How is an eSIM different from a physical SIM?', a: 'A physical SIM is a small card you insert into your phone. An eSIM is embedded in your device and can be programmed with different carrier profiles digitally. You can switch plans without swapping cards.' },
    { q: 'Does my phone support eSIM?', a: 'Most phones released after 2018 support eSIM, including iPhone XR and later, Samsung Galaxy S20 and later, Google Pixel 3 and later, and many more. Check our Supported Devices page for a full list.' },
    { q: 'Can I keep my regular phone number with an eSIM?', a: 'Yes! You can use your eSIM for data while keeping your physical SIM for calls and texts with your regular number. This dual-SIM setup is perfect for travelers.' },
    { q: 'How do I install an eSIM?', a: 'It\'s simple: purchase an eSIM plan, scan the QR code provided, and follow your phone\'s setup instructions. Most installations take under 5 minutes.' },
    { q: 'Is an eSIM as reliable as a physical SIM?', a: 'Yes, eSIMs use the same cellular networks as physical SIMs. The only difference is how the SIM profile is delivered — digitally instead of on a physical card.' },
  ];

  return (
    <>
      <Helmet>
        <title>What is an eSIM? — {siteName}</title>
        <meta name="description" content="Learn what an eSIM is, how it works, and why it's the future of mobile connectivity for travelers." />
      </Helmet>

      <div className="min-h-screen bg-background">
        <section className="relative overflow-hidden bg-hero-gradient text-white">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-20 right-20 w-72 h-72 bg-primary/20 rounded-full blur-3xl" />
            <div className="absolute bottom-10 left-10 w-96 h-96 bg-primary-light/10 rounded-full blur-3xl" />
          </div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                  What is an{' '}
                  <span className="bg-gradient-to-r from-primary-light to-white bg-clip-text text-transparent">eSIM?</span>
                </h1>
                <p className="text-lg md:text-xl text-white/80 mb-8">
                  An eSIM is a digital SIM embedded in your device. It lets you connect to mobile networks without a physical SIM card — just download a plan and go.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <button onClick={() => navigate('/destinations')} className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-white text-primary-dark font-semibold text-lg hover:bg-slate-100 transition-colors">
                    Browse eSIM Plans <ArrowRight className="w-5 h-5" />
                  </button>
                  <button onClick={() => navigate('/supported-devices')} className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl border border-white/20 text-white font-semibold text-lg hover:bg-white/10 transition-colors">
                    Check Compatibility
                  </button>
                </div>
              </div>
              <div className="flex justify-center">
                <div className="relative">
                  <div className="w-64 h-64 md:w-72 md:h-72 bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl flex items-center justify-center">
                    <Smartphone className="w-24 h-24 text-primary-light" />
                  </div>
                  <div className="absolute -top-4 -right-4 bg-primary/20 backdrop-blur-sm border border-primary/30 rounded-xl px-4 py-2 flex items-center gap-2">
                    <Wifi className="w-4 h-4 text-primary-light" />
                    <span className="text-sm font-medium text-primary-light">Connected</span>
                  </div>
                  <div className="absolute -bottom-4 -left-4 bg-primary/20 backdrop-blur-sm border border-primary/30 rounded-xl px-4 py-2 flex items-center gap-2">
                    <Globe2 className="w-4 h-4 text-primary-light" />
                    <span className="text-sm font-medium text-primary-light">200+ countries</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">How does an eSIM work?</h2>
                <div className="space-y-6">
                  {[
                    { step: '1', text: 'Your device has a tiny chip built in that acts as a SIM card.' },
                    { step: '2', text: 'Instead of inserting a physical card, you download a carrier profile digitally.' },
                    { step: '3', text: 'The eSIM profile connects you to local networks in your destination.' },
                    { step: '4', text: 'You can store multiple profiles and switch between them anytime.' },
                  ].map((item) => (
                    <div key={item.step} className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary-light flex items-center justify-center flex-shrink-0">
                        <span className="text-sm font-bold text-white">{item.step}</span>
                      </div>
                      <p className="text-foreground text-lg pt-1.5">{item.text}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-muted/50 rounded-2xl p-8 border border-border">
                <h3 className="text-xl font-bold text-foreground mb-6 text-center">eSIM vs Physical SIM</h3>
                <div className="space-y-4">
                  {[
                    { feature: 'Setup time', esim: 'Minutes', sim: 'Hours/Days' },
                    { feature: 'Store visit', esim: 'Not needed', sim: 'Required' },
                    { feature: 'Multiple plans', esim: 'Yes, digital', sim: 'Need multiple cards' },
                    { feature: 'Can be lost', esim: 'No', sim: 'Yes' },
                    { feature: 'Eco-friendly', esim: 'Yes', sim: 'Plastic waste' },
                    { feature: 'Dual SIM', esim: 'Built-in', sim: 'Extra slot needed' },
                  ].map((row) => (
                    <div key={row.feature} className="grid grid-cols-3 gap-4 text-sm py-3 border-b border-border last:border-b-0">
                      <span className="font-medium text-foreground">{row.feature}</span>
                      <span className="text-primary font-medium">{row.esim}</span>
                      <span className="text-muted-foreground">{row.sim}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24 bg-muted/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Benefits of using an eSIM</h2>
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

        <section className="py-16 md:py-24 bg-background">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground text-center mb-12">Frequently asked questions</h2>
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
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Ready to try an eSIM?</h2>
                <p className="text-white/80 text-lg mb-8 max-w-2xl mx-auto">Browse our affordable plans and get connected in minutes — no physical SIM card needed.</p>
                <button onClick={() => navigate('/destinations')} className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-white text-primary-dark font-bold text-lg hover:bg-slate-100 transition-colors">
                  Browse Plans <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
