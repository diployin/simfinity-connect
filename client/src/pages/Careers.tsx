import {
  Briefcase,
  MapPin,
  Clock,
  Globe2,
  Heart,
  Zap,
  Users,
  GraduationCap,
  Coffee,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { useSettingByKey } from '@/hooks/useSettings';
import { useTranslation } from '@/contexts/TranslationContext';

export default function Careers() {
  const siteName = useSettingByKey('platform_name') || 'Voltey';
  const { t } = useTranslation();

  const perks = [
    { icon: Globe2, title: t('careers.perkRemoteTitle', 'Remote First'), desc: t('careers.perkRemoteDesc', 'Work from anywhere in the world — we believe great work happens everywhere.'), color: 'from-primary to-primary-dark' },
    { icon: Heart, title: t('careers.perkHealthTitle', 'Health & Wellness'), desc: t('careers.perkHealthDesc', 'Comprehensive health insurance, mental health support, and wellness stipend.'), color: 'from-rose-500 to-rose-600' },
    { icon: GraduationCap, title: t('careers.perkLearningTitle', 'Learning Budget'), desc: t('careers.perkLearningDesc', '$2,000/year for courses, conferences, and professional development.'), color: 'from-purple-500 to-purple-600' },
    { icon: Coffee, title: t('careers.perkHoursTitle', 'Flexible Hours'), desc: t('careers.perkHoursDesc', 'We focus on outcomes, not hours. Work when you\'re most productive.'), color: 'from-amber-500 to-amber-600' },
    { icon: Zap, title: t('careers.perkTechTitle', 'Latest Tech'), desc: t('careers.perkTechDesc', 'Top-of-the-line equipment and tools to do your best work.'), color: 'from-cyan-500 to-cyan-600' },
    { icon: Users, title: t('careers.perkRetreatsTitle', 'Team Retreats'), desc: t('careers.perkRetreatsDesc', 'Annual team gatherings in exciting destinations around the globe.'), color: 'from-emerald-500 to-emerald-600' },
  ];

  const openings = [
    { title: 'Senior Full-Stack Engineer', department: 'Engineering', location: 'Remote', type: 'Full-time' },
    { title: 'Product Designer', department: 'Design', location: 'Remote', type: 'Full-time' },
    { title: 'Mobile Developer (React Native)', department: 'Engineering', location: 'Remote', type: 'Full-time' },
    { title: 'Growth Marketing Manager', department: 'Marketing', location: 'Remote / London', type: 'Full-time' },
    { title: 'Customer Success Lead', department: 'Support', location: 'Remote', type: 'Full-time' },
    { title: 'DevOps Engineer', department: 'Engineering', location: 'Remote', type: 'Full-time' },
    { title: 'Content Writer', department: 'Marketing', location: 'Remote', type: 'Part-time' },
    { title: 'Partnerships Manager', department: 'Business', location: 'Remote / Dubai', type: 'Full-time' },
  ];

  return (
    <>
      <Helmet>
        <title>{t('careers.pageTitle', 'Careers — {{siteName}}', { siteName })}</title>
        <meta name="description" content={t('careers.pageMeta', 'Join {{siteName}} and help connect the world. Explore open positions and build the future of travel connectivity.', { siteName })} />
      </Helmet>

      <div className="min-h-screen bg-background dark:bg-gray-950 dark:text-gray-100 transition-colors duration-300">
        <section className="relative pt-24 pb-20 md:pt-32 md:pb-28 overflow-hidden bg-[#f8fafc] dark:bg-slate-950">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-20 right-20 w-72 h-72 bg-primary/20 rounded-full blur-3xl" />
            <div className="absolute bottom-10 left-10 w-96 h-96 bg-primary-light/10 rounded-full blur-3xl" />
          </div>
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 relative z-10 text-center">
            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white dark:bg-slate-900 shadow-sm border border-slate-100 dark:border-slate-800 text-primary text-sm font-bold mb-8">
              <Sparkles className="w-4 h-4" />
              <span className="font-bold">{t('careers.weAreHiring', 'We\'re hiring')}</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-[1.1] mb-6 text-slate-900 dark:text-white tracking-tight">
              {t('careers.heroTitlePrefix', 'Build the future of')}{' '}
              <span className="bg-gradient-to-r from-primary-light to-primary bg-clip-text text-transparent">{t('careers.heroTitleHighlight', 'global connectivity')}</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
              {t('careers.heroSubtitle', 'Join a passionate team making travel connectivity effortless for millions of people worldwide.')}
            </p>
            <a href="#openings" className="h-14 px-10 rounded-2xl bg-primary text-white font-bold text-lg hover:bg-primary-dark transition-all shadow-xl shadow-primary/20 active:scale-[0.98] inline-flex items-center gap-2">
              {t('careers.viewOpenings', 'View Open Positions')}
              <ArrowRight className="w-5 h-5" />
            </a>
          </div>
        </section>

        <section className="py-16 md:py-24 bg-background dark:bg-gray-950">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground dark:text-white mb-4">{t('careers.whyWorkHere', 'Why work at {{siteName}}?', { siteName })}</h2>
              <p className="text-muted-foreground dark:text-gray-400 text-lg max-w-2xl mx-auto">{t('careers.whySubtitle', 'We believe happy teams build great products. Here\'s what we offer.')}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {perks.map((perk) => (
                <div key={perk.title} className="bg-white dark:bg-gray-900 rounded-2xl p-8 border border-border dark:border-gray-800 shadow-sm">
                  <div className="w-12 h-12 flex items-center justify-center mb-5">
                    <perk.icon className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground dark:text-white mb-2">{perk.title}</h3>
                  <p className="text-muted-foreground dark:text-gray-400">{perk.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="openings" className="py-16 md:py-24 bg-slate-50 dark:bg-gray-900/50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground dark:text-white mb-4">{t('careers.openingsTitle', 'Open Positions')}</h2>
              <p className="text-muted-foreground dark:text-gray-400 text-lg">{t('careers.openingsSubtitle', 'Find your place on our team. All roles are remote-friendly.')}</p>
            </div>
            <div className="space-y-4">
              {openings.map((job) => (
                <div key={job.title} className="bg-white dark:bg-gray-900 rounded-xl border border-border dark:border-gray-800 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-primary dark:hover:border-primary transition-all duration-300 shadow-sm hover:shadow-md">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground dark:text-white">{job.title}</h3>
                    <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-muted-foreground dark:text-gray-400">
                      <span className="flex items-center gap-1"><Briefcase className="w-4 h-4" />{job.department}</span>
                      <span className="flex items-center gap-1"><MapPin className="w-4 h-4" />{job.location}</span>
                      <span className="flex items-center gap-1"><Clock className="w-4 h-4" />{job.type}</span>
                    </div>
                  </div>
                  <button className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-gradient-to-r from-primary to-primary-dark text-white font-medium text-sm hover:opacity-90 transition-opacity whitespace-nowrap shadow-md">
                    {t('careers.applyNow', 'Apply Now')} <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24 bg-background dark:bg-gray-950">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="rounded-3xl bg-hero-gradient p-8 md:p-16 text-center relative overflow-hidden">
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-10 right-10 w-64 h-64 bg-primary/20 rounded-full blur-3xl" />
              </div>
              <div className="relative z-10">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">{t('careers.noRoleTitle', 'Don\'t see the right role?')}</h2>
                <p className="text-white/80 text-lg mb-8 max-w-2xl mx-auto">{t('careers.noRoleDesc', 'We\'re always looking for talented people. Send us your resume and we\'ll keep you in mind for future openings.')}</p>
                <button className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-white text-primary-dark font-bold text-lg hover:bg-slate-100 transition-colors">
                  {t('careers.sendResume', 'Send Your Resume')} <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}