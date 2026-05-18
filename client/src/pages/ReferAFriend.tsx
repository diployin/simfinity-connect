import {
  Gift,
  Users,
  Share2,
  DollarSign,
  ArrowRight,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { useSettingByKey } from '@/hooks/useSettings';
import { useLocation } from 'wouter';

export default function ReferAFriend() {
  const siteName = useSettingByKey('platform_name') || 'Voltey';
  const [, navigate] = useLocation();

  const steps = [
    { num: '1', icon: Users, title: 'Find your referral code', desc: `Open your ${siteName} account and find your unique referral code in the Credits section.`, color: 'from-primary to-primary-dark' },
    { num: '2', icon: Share2, title: 'Share it with friends', desc: 'Send your code to friends via text, email, or social media. The more you share, the more you earn.', color: 'from-purple-500 to-purple-600' },
    { num: '3', icon: DollarSign, title: 'Give $5, get $5', desc: `Anyone using your referral code gets a $5 discount, while you earn $5 in ${siteName} credit.`, color: 'from-emerald-500 to-emerald-600' },
  ];

  const faqs = [
    { q: `Does ${siteName} have a referral program?`, a: `Yes! ${siteName} has a referral program where you can refer others to try our service. People joining with your referral code get a $5 discount on their first eSIM, while you receive $5 in credit.` },
    { q: `How can I use ${siteName} for free?`, a: `For every person you refer, you earn $5 in credit. Refer enough friends and you can use ${siteName} for free!` },
    { q: 'Can I get a discount for referring a friend?', a: `Yes! With our Refer a Friend program, every successful referral gives you a $5 bonus and a $5 discount for your friend.` },
    { q: 'How does the referral program work?', a: `Every ${siteName} user gets a referral code. When a friend uses your code to create an account, they get $5 off their first purchase and you get $5 in credit.` },
  ];

  return (
    <>
      <Helmet>
        <title>Refer a Friend — {siteName}</title>
        <meta name="description" content={`Refer a friend to ${siteName} and you'll both get $5! Share your referral code and earn credits.`} />
      </Helmet>

      <div className="min-h-screen bg-background">
        <section className="relative pt-24 pb-32 overflow-hidden bg-[#f8fafc]">
          <div className="absolute top-0 left-0 w-full h-full">
            <div className="absolute top-0 right-0 w-1/3 h-full bg-[var(--primary)]/5 transform skew-x-12 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-1/4 h-1/2 bg-blue-500/5 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2" />
          </div>
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white shadow-sm border border-slate-100 text-[var(--primary)] text-sm font-bold mb-8">
                  <Gift className="w-4 h-4" />
                  Referral Program
                </div>
                <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 mb-6 tracking-tight">
                  Refer a friend, and you'll both get <span className="text-[var(--primary)]">$5!</span>
                </h1>
                <p className="text-xl text-slate-600 leading-relaxed mb-8">
                  Each referral earns you $5 in {siteName} credits while your friends get a $5 discount on their first plan. Sharing pays off — literally.
                </p>
                <button onClick={() => navigate('/account/referrals')} className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-[var(--primary)] text-white font-semibold text-lg hover:bg-[#235d2d] transition-all shadow-lg shadow-green-900/10">
                  Start Referring <ArrowRight className="w-5 h-5" />
                </button>
              </div>
              <div className="flex justify-center lg:justify-end">
                <div className="relative">
                  <div className="w-64 h-64 md:w-80 md:h-80 rounded-full bg-[var(--primary)]/5 flex items-center justify-center border border-slate-100/50 shadow-inner">
                    <div className="w-48 h-48 md:w-60 md:h-60 rounded-full bg-blue-500/5 flex items-center justify-center">
                      <Gift className="w-20 h-20 md:w-28 md:h-28 text-[var(--primary)]" />
                    </div>
                  </div>
                  <div className="absolute -top-4 -right-4 bg-white shadow-lg border border-slate-100 rounded-2xl px-5 py-3">
                    <span className="text-2xl font-extrabold text-[var(--primary)]">+$5</span>
                  </div>
                  <div className="absolute -bottom-4 -left-4 bg-white shadow-lg border border-slate-100 rounded-2xl px-5 py-3">
                    <span className="text-2xl font-extrabold text-[var(--primary)]">+$5</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">How it works</h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">Earn credits in three simple steps.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {steps.map((step) => (
                <div key={step.num} className="bg-card rounded-2xl p-8 border border-border text-center">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center mx-auto mb-6`}>
                    <step.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-3">{step.title}</h3>
                  <p className="text-muted-foreground">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24 bg-muted/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">Why {siteName}?</h2>
                <p className="text-muted-foreground text-lg mb-8">
                  {siteName} is a global eSIM service that offers affordable, reliable connectivity in 200+ destinations. Now you and your friends can earn credits — simply join our referral program.
                </p>
                <ul className="space-y-4">
                  {[
                    'Affordable eSIM plans in 200+ destinations',
                    'Easy setup — no physical SIM card needed',
                    'Instant activation upon arrival',
                    'Trusted by thousands of travelers worldwide',
                    'No contracts or hidden fees',
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-card rounded-2xl border border-border p-8 text-center">
                <Sparkles className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-foreground mb-2">Start earning today</h3>
                <p className="text-muted-foreground mb-6">Sign up and share your code to start getting rewards.</p>
                <button onClick={() => navigate('/account/referrals')} className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-primary to-primary-dark text-white font-semibold text-lg hover:opacity-90 transition-opacity w-full justify-center">
                  Get Your Referral Code <ArrowRight className="w-5 h-5" />
                </button>
              </div>
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
      </div>
    </>
  );
}
