import {
  GraduationCap,
  Globe2,
  Percent,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Plane,
  BookOpen,
} from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { useSettingByKey } from '@/hooks/useSettings';
import { useLocation } from 'wouter';

export default function StudentDiscount() {
  const siteName = useSettingByKey('platform_name') || 'Simfinity';
  const [, navigate] = useLocation();

  return (
    <>
      <Helmet>
        <title>Student Discount — {siteName}</title>
        <meta name="description" content={`Students get 15% off all ${siteName} eSIM plans. Stay connected while studying or traveling abroad for less.`} />
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
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/15 backdrop-blur-sm mb-6">
                  <GraduationCap className="w-4 h-4 text-primary-light" />
                  <span className="text-sm font-medium text-primary-light">Student Program</span>
                </div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                  <span className="bg-gradient-to-r from-primary-light to-white bg-clip-text text-transparent">15% off</span>{' '}
                  for students
                </h1>
                <p className="text-lg md:text-xl text-white/80 mb-8">
                  Whether you're studying abroad, backpacking between semesters, or heading home for the holidays — stay connected for less with our student discount.
                </p>
                <button onClick={() => navigate('/destinations')} className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-white text-primary-dark font-semibold text-lg hover:bg-slate-100 transition-colors">
                  Verify Student Status <ArrowRight className="w-5 h-5" />
                </button>
              </div>
              <div className="flex justify-center">
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8 text-center max-w-sm">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center mx-auto mb-6">
                    <Percent className="w-10 h-10 text-white" />
                  </div>
                  <p className="text-5xl font-bold text-white mb-2">15%</p>
                  <p className="text-xl text-primary-light font-semibold mb-4">Student Discount</p>
                  <p className="text-slate-400 text-sm">Valid on all eSIM plans with a verified student email</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Perfect for student travelers</h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">Stay connected wherever your studies take you.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { icon: BookOpen, title: 'Study Abroad', desc: 'Affordable data for semester programs anywhere in the world.', color: 'from-blue-500 to-blue-600' },
                { icon: Plane, title: 'Gap Year Travel', desc: 'Backpack through Europe, Asia, or anywhere — always stay connected.', color: 'from-purple-500 to-purple-600' },
                { icon: Globe2, title: 'International Students', desc: 'Keep in touch with family back home without roaming charges.', color: 'from-amber-500 to-amber-600' },
                { icon: Sparkles, title: 'Group Trips', desc: 'Coordinate with classmates on group trips with affordable data plans.', color: 'from-rose-500 to-rose-600' },
              ].map((item) => (
                <div key={item.title} className="bg-card rounded-2xl p-6 border border-border text-center">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center mx-auto mb-4`}>
                    <item.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-foreground mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24 bg-muted/30">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">How to get your discount</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { num: '1', title: 'Sign Up', desc: 'Create your account using your .edu or university email address.', color: 'from-blue-500 to-blue-600' },
                { num: '2', title: 'Verify', desc: 'We\'ll verify your student status — usually instant with a .edu email.', color: 'from-purple-500 to-purple-600' },
                { num: '3', title: 'Save 15%', desc: 'Your discount is automatically applied to all eSIM purchases.', color: 'from-amber-500 to-amber-600' },
              ].map((step) => (
                <div key={step.num} className="bg-card rounded-2xl p-8 border border-border text-center">
                  <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${step.color} flex items-center justify-center mx-auto mb-6`}>
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
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="rounded-3xl bg-hero-gradient p-8 md:p-16 text-center relative overflow-hidden">
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-10 right-10 w-64 h-64 bg-primary/20 rounded-full blur-3xl" />
              </div>
              <div className="relative z-10">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Ready to save on your next trip?</h2>
                <p className="text-white/80 text-lg mb-8 max-w-2xl mx-auto">Sign up with your student email and get 15% off every eSIM plan — no code needed.</p>
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
