import {
  Smartphone,
  Star,
  Shield,
  Zap,
  Globe2,
  ArrowRight,
  CheckCircle2,
  Download,
} from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { useSettingByKey } from '@/hooks/useSettings';

export default function DownloadApp() {
  const siteName = useSettingByKey('platform_name') || 'Simfinity';

  const features = [
    { icon: Globe2, title: 'Browse 200+ Destinations', desc: 'Find the perfect data plan for any country or region.', color: 'from-blue-500 to-blue-600' },
    { icon: Zap, title: 'Instant Activation', desc: 'Purchase and activate your eSIM in minutes — right from the app.', color: 'from-amber-500 to-amber-600' },
    { icon: Shield, title: 'Secure & Private', desc: 'Your data and payments are protected with enterprise-grade encryption.', color: 'from-emerald-500 to-emerald-600' },
    { icon: Star, title: 'Manage Plans Easily', desc: 'View usage, top up data, and switch between plans seamlessly.', color: 'from-purple-500 to-purple-600' },
  ];

  return (
    <>
      <Helmet>
        <title>Download the App — {siteName}</title>
        <meta name="description" content={`Download the ${siteName} app to browse eSIM plans, manage your data, and stay connected worldwide.`} />
      </Helmet>

      <div className="min-h-screen bg-background">
        <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-20 right-20 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl" />
            <div className="absolute bottom-10 left-10 w-96 h-96 bg-purple-500/8 rounded-full blur-3xl" />
          </div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/15 backdrop-blur-sm mb-6">
                  <Download className="w-4 h-4 text-blue-300" />
                  <span className="text-sm font-medium text-blue-200">Download App</span>
                </div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                  Get the {siteName}{' '}
                  <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">app</span>
                </h1>
                <p className="text-lg md:text-xl text-slate-300 mb-8">
                  Browse plans, activate eSIMs, and manage your data — all from your phone. Available on iOS and Android.
                </p>
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} className="w-5 h-5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span className="text-slate-300">4.7 rating</span>
                  <span className="text-slate-500">|</span>
                  <span className="text-slate-300">97K+ reviews</span>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <a href="#" className="inline-flex items-center gap-3 px-6 py-3 rounded-xl bg-white text-slate-900 font-medium hover:bg-slate-100 transition-colors">
                    <svg className="w-7 h-7" viewBox="0 0 24 24" fill="currentColor"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>
                    <div className="text-left">
                      <p className="text-xs text-slate-500">Download on the</p>
                      <p className="text-sm font-semibold">App Store</p>
                    </div>
                  </a>
                  <a href="#" className="inline-flex items-center gap-3 px-6 py-3 rounded-xl bg-white text-slate-900 font-medium hover:bg-slate-100 transition-colors">
                    <svg className="w-7 h-7" viewBox="0 0 24 24" fill="currentColor"><path d="M3 20.5v-17c0-.59.34-1.11.84-1.35L13.69 12l-9.85 9.85c-.5-.24-.84-.76-.84-1.35m13.81-5.38L6.05 21.34l8.49-8.49 2.27 2.27m3.35-4.31c.34.27.56.69.56 1.19s-.22.92-.56 1.19l-1.97 1.13-2.5-2.5 2.5-2.5 1.97 1.49M6.05 2.66l10.76 6.22-2.27 2.27-8.49-8.49z"/></svg>
                    <div className="text-left">
                      <p className="text-xs text-slate-500">Get it on</p>
                      <p className="text-sm font-semibold">Google Play</p>
                    </div>
                  </a>
                </div>
              </div>
              <div className="flex justify-center">
                <div className="relative">
                  <div className="w-64 h-96 bg-white/5 backdrop-blur-sm border border-white/10 rounded-[2.5rem] flex items-center justify-center">
                    <Smartphone className="w-20 h-20 text-blue-300" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Everything in one app</h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">Manage your global connectivity from your pocket.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((f) => (
                <div key={f.title} className="bg-card rounded-2xl p-6 border border-border text-center">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${f.color} flex items-center justify-center mx-auto mb-4`}>
                    <f.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-foreground mb-2">{f.title}</h3>
                  <p className="text-sm text-muted-foreground">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24 bg-muted/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="rounded-3xl bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 p-8 md:p-16 text-center relative overflow-hidden">
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-10 right-10 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl" />
              </div>
              <div className="relative z-10">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Get connected in minutes</h2>
                <p className="text-slate-300 text-lg mb-8 max-w-2xl mx-auto">Download the app, choose a plan, and you're online — it's that simple.</p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <a href="#" className="inline-flex items-center gap-3 px-6 py-3 rounded-xl bg-white text-slate-900 font-medium hover:bg-slate-100 transition-colors">
                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>
                    App Store
                  </a>
                  <a href="#" className="inline-flex items-center gap-3 px-6 py-3 rounded-xl bg-white text-slate-900 font-medium hover:bg-slate-100 transition-colors">
                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor"><path d="M3 20.5v-17c0-.59.34-1.11.84-1.35L13.69 12l-9.85 9.85c-.5-.24-.84-.76-.84-1.35m13.81-5.38L6.05 21.34l8.49-8.49 2.27 2.27m3.35-4.31c.34.27.56.69.56 1.19s-.22.92-.56 1.19l-1.97 1.13-2.5-2.5 2.5-2.5 1.97 1.49M6.05 2.66l10.76 6.22-2.27 2.27-8.49-8.49z"/></svg>
                    Google Play
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
