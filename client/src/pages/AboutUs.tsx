import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import {
  Users,
  Target,
  Globe,
  ShieldCheck,
  Award,
  TrendingUp,
  Zap,
  CheckCircle2,
  LucideIcon
} from 'lucide-react';
import { useTranslation } from '@/contexts/TranslationContext';
import { useSettingByKey } from '@/hooks/useSettings';
import { Link } from 'wouter'

interface ValueProp {
  icon: LucideIcon;
  title: string;
  description: string;
  color: string;
}

interface StatProp {
  label: string;
  value: string;
  suffix?: string;
}

export default function AboutUs() {
  const { t } = useTranslation();
  const siteName = useSettingByKey('platform_name') || 'Voltey';

  const stats: StatProp[] = [
    { label: t('about.stats.countries', 'Countries Covered'), value: '200', suffix: '+' },
    { label: t('about.stats.users', 'Happy Travelers'), value: '1', suffix: 'M+' },
    { label: t('about.stats.support', 'Support Response'), value: '2', suffix: 'min' },
    { label: t('about.stats.availability', 'Service Uptime'), value: '99.9', suffix: '%' },
  ];

  const values: ValueProp[] = [
    {
      icon: Globe,
      title: t('about.values.connectivity', 'Universal Connectivity'),
      description: t('about.values.connectivityDesc', 'We believe everyone deserves seamless, affordable access to the internet, no matter where their journey takes them.'),
      color: 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400',
    },
    {
      icon: ShieldCheck,
      title: t('about.values.security', 'Security First'),
      description: t('about.values.securityDesc', 'Your data and privacy are paramount. We use enterprise-grade encryption to ensure your digital footprint stays yours.'),
      color: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400',
    },
    {
      icon: Zap,
      title: t('about.values.simplicity', 'Radical Simplicity'),
      description: t('about.values.simplicityDesc', 'Technology should work for you, not the other way around. Our 1-minute setup process defines everything we do.'),
      color: 'bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400',
    },
    {
      icon: Award,
      title: t('about.values.quality', 'Premium Quality'),
      description: t('about.values.qualityDesc', 'We partner with the world\'s leading carriers to guarantee high-speed 5G/4G connectivity in every corner of the globe.'),
      color: 'bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400',
    },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 transition-colors duration-300">
      <Helmet>
        <title>{t('about.pageTitle', 'About Us | {{name}}', { name: siteName })}</title>
        <meta name="description" content={t('about.metaDesc', 'Learn about our mission to revolutionize global connectivity through innovative eSIM technology.')} />
      </Helmet>

      {/* Hero Section */}
      <section className="relative pt-24 pb-16 md:pt-32 md:pb-24 overflow-hidden bg-slate-50 dark:bg-gray-900/50">
        <div className="absolute inset-0 z-0 opacity-30 dark:opacity-20 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-6 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-6">
              <Target className="w-3.5 h-3.5" />
              {t('about.hero.badge', 'Our Mission')}
            </span>
            <h1 className="text-4xl md:text-6xl font-black text-gray-900 dark:text-white mb-6 leading-[1.1]">
              {t('about.hero.title', 'Connecting the World,')} <br />
              <span className="text-primary">{t('about.hero.titleAccent', 'One eSIM at a Time')}</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
              {t('about.hero.description', 'Born from a passion for travel and technology, we\'re on a mission to eliminate roaming fees and make global connectivity accessible to everyone, everywhere.')}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 border-y border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-950">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="text-center"
              >
                <div className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white mb-1">
                  {stat.value}{stat.suffix}
                </div>
                <div className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 md:py-32 bg-white dark:bg-gray-950">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="aspect-square rounded-3xl overflow-hidden shadow-2xl">
                <img
                  src="/images/about-story.webp"
                  alt="Our Story"
                  className="w-full h-full object-cover"
                  onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80' }}
                />
              </div>
              <div className="absolute -bottom-8 -right-8 w-48 h-48 bg-primary rounded-3xl -z-10 hidden md:block" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white leading-tight">
                {t('about.story.title', 'The Story Behind Voltey')}
              </h2>
              <div className="space-y-6 text-gray-600 dark:text-gray-400 text-lg leading-relaxed">
                <p>
                  {t('about.story.p1', 'It started with a frustrating trip to Tokyo. Our founders spent three hours in a queue just to get a local SIM card that didn\'t even work the next day. We knew there had to be a better way.')}
                </p>
                <p>
                  {t('about.story.p2', 'We built this platform to be the service we wish we had: instant, reliable, and completely transparent. Today, we power connectivity for digital nomads, business travelers, and families across seven continents.')}
                </p>
                <ul className="space-y-4 pt-4">
                  {[
                    t('about.story.point1', '100% Digital infrastructure'),
                    t('about.story.point2', 'No hidden fees or physical hardware'),
                    t('about.story.point3', 'Carbon-neutral operations goal by 2027')
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                      <span className="font-medium text-gray-900 dark:text-gray-200">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 md:py-32 bg-slate-50 dark:bg-gray-900/30">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {t('about.values.title', 'Our Core Values')}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              {t('about.values.subtitle', 'The principles that guide our product development and customer relationships every single day.')}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -5 }}
                className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 transition-all"
              >
                <div className="w-12 h-12 flex items-center justify-center mb-6">
                  <value.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                  {value.title}
                </h3>
                <p className="text-gray-500 dark:text-gray-400 leading-relaxed">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Join Mission */}
      <section className="py-20 md:py-32 bg-white dark:bg-gray-950">
        <div className="container mx-auto px-6 text-center">
          <div className="max-w-4xl mx-auto bg-primary rounded-[3rem] p-10 md:p-20 text-white relative overflow-hidden shadow-2xl shadow-primary/20">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl" />
            <div className="relative z-10">
              <h2 className="text-3xl md:text-5xl font-black mb-8 leading-tight">
                {t('about.cta.title', 'Ready to Join the Wireless Revolution?')}
              </h2>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/destinations" className="w-full sm:w-auto">
                  <button className="w-full sm:w-auto px-10 py-4 bg-white text-primary font-bold rounded-full hover:bg-gray-100 transition-colors shadow-xl">
                    {t('about.cta.primary', 'Explore Destinations')}
                  </button>
                </Link>
                <Link href="/careers" className="w-full sm:w-auto">
                  <button className="w-full sm:w-auto px-10 py-4 bg-transparent border-2 border-white/30 text-white font-bold rounded-full hover:bg-white/10 transition-colors">
                    {t('about.cta.secondary', 'View Careers')}
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
