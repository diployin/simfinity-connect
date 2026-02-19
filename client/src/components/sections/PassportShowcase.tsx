import { Link } from 'wouter';
import {
  Shield,
  Zap,
  Bot,
  TreePine,
  Globe,
  BatteryFull,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

export function PassportShowcase() {
  const features = [
    {
      icon: Shield,
      title: 'Secure Connectivity',
      desc: 'Built-in DPN & encrypted browsing',
      color: 'from-emerald-500 to-green-600',
      bg: 'bg-emerald-50 dark:bg-emerald-950/30',
    },
    {
      icon: Bot,
      title: 'AI Concierge',
      desc: 'Book flights, hotels & more',
      color: 'from-blue-500 to-indigo-600',
      bg: 'bg-blue-50 dark:bg-blue-950/30',
    },
    {
      icon: BatteryFull,
      title: '5000mAh Power Bank',
      desc: 'Built-in backup battery',
      color: 'from-amber-500 to-orange-600',
      bg: 'bg-amber-50 dark:bg-amber-950/30',
    },
    {
      icon: TreePine,
      title: 'Plant a Tree',
      desc: 'Every eSIM plants one tree',
      color: 'from-green-500 to-teal-600',
      bg: 'bg-green-50 dark:bg-green-950/30',
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-slate-950 to-slate-900 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#2c7338]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-[#2c7338]/8 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-[#2c7338]/20 to-[#3d9a4d]/20 border border-[#2c7338]/30 mb-6">
              <Sparkles className="w-4 h-4 text-[#3d9a4d]" />
              <span className="text-sm font-medium text-[#3d9a4d]">Pre-Book Now — Limited First Batch</span>
            </div>

            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight mb-4">
              Simfinity{' '}
              <span className="bg-gradient-to-r from-[#3d9a4d] to-[#2c7338] bg-clip-text text-transparent">
                Passport
              </span>
            </h2>

            <p className="text-lg md:text-xl text-slate-300 leading-relaxed mb-6">
              The world's first AI-powered global travel connectivity device. Secure browsing, built-in power, and an AI concierge — all in one.
            </p>

            <div className="flex items-center gap-3 mb-8">
              <div className="flex items-center gap-1.5 text-slate-400 text-sm">
                <Globe className="w-4 h-4 text-[#3d9a4d]" />
                <span>190+ Countries</span>
              </div>
              <div className="w-1 h-1 rounded-full bg-slate-600" />
              <div className="flex items-center gap-1.5 text-slate-400 text-sm">
                <Zap className="w-4 h-4 text-amber-400" />
                <span>5000mAh Battery</span>
              </div>
              <div className="w-1 h-1 rounded-full bg-slate-600" />
              <div className="flex items-center gap-1.5 text-slate-400 text-sm">
                <Shield className="w-4 h-4 text-blue-400" />
                <span>DPN Protected</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-8">
              {features.map((f) => (
                <div
                  key={f.title}
                  className={`${f.bg} rounded-xl p-4 border border-white/5`}
                >
                  <div className={`inline-flex p-2 rounded-lg bg-gradient-to-br ${f.color} mb-2`}>
                    <f.icon className="w-4 h-4 text-white" />
                  </div>
                  <h3 className="text-sm font-semibold text-white mb-0.5">{f.title}</h3>
                  <p className="text-xs text-slate-400">{f.desc}</p>
                </div>
              ))}
            </div>

            <Link href="/destinations?tab=passport">
              <button className="group inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-[#2c7338] to-[#3d9a4d] text-white font-semibold text-lg shadow-lg shadow-[#2c7338]/25 hover:shadow-xl hover:shadow-[#2c7338]/30 transition-all hover:scale-[1.02]">
                Reserve Your Device
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>
          </div>

          <div className="relative flex items-center justify-center">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-72 h-72 md:w-96 md:h-96 rounded-full bg-gradient-to-br from-[#2c7338]/20 to-transparent blur-2xl" />
            </div>

            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-[#2c7338]/20 via-[#3d9a4d]/10 to-[#2c7338]/20 rounded-3xl blur-xl" />
              <img
                src="/images/passport-device.png"
                alt="Simfinity Passport Device"
                className="relative w-full max-w-sm md:max-w-md rounded-2xl"
              />
            </div>

            <div className="absolute top-8 right-4 md:right-8 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl px-4 py-3 animate-float">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span className="text-sm font-medium text-white">Connected</span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">190+ countries ready</p>
            </div>

            <div className="absolute bottom-8 left-4 md:left-8 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl px-4 py-3 animate-float-delayed">
              <div className="flex items-center gap-2">
                <TreePine className="w-4 h-4 text-green-400" />
                <span className="text-sm font-medium text-white">1 eSIM = 1 Tree</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
        .animate-float-delayed {
          animation: float-delayed 5s ease-in-out infinite 1s;
        }
      `}</style>
    </section>
  );
}
