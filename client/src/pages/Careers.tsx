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

export default function Careers() {
  const siteName = useSettingByKey('platform_name') || 'Simfinity';

  const perks = [
    { icon: Globe2, title: 'Remote First', desc: 'Work from anywhere in the world — we believe great work happens everywhere.', color: 'from-primary to-primary-dark' },
    { icon: Heart, title: 'Health & Wellness', desc: 'Comprehensive health insurance, mental health support, and wellness stipend.', color: 'from-rose-500 to-rose-600' },
    { icon: GraduationCap, title: 'Learning Budget', desc: '$2,000/year for courses, conferences, and professional development.', color: 'from-purple-500 to-purple-600' },
    { icon: Coffee, title: 'Flexible Hours', desc: 'We focus on outcomes, not hours. Work when you\'re most productive.', color: 'from-amber-500 to-amber-600' },
    { icon: Zap, title: 'Latest Tech', desc: 'Top-of-the-line equipment and tools to do your best work.', color: 'from-cyan-500 to-cyan-600' },
    { icon: Users, title: 'Team Retreats', desc: 'Annual team gatherings in exciting destinations around the globe.', color: 'from-emerald-500 to-emerald-600' },
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
        <title>Careers — {siteName}</title>
        <meta name="description" content={`Join ${siteName} and help connect the world. Explore open positions and build the future of travel connectivity.`} />
      </Helmet>

      <div className="min-h-screen bg-background">
        <section className="relative overflow-hidden bg-hero-gradient text-white">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-20 right-20 w-72 h-72 bg-primary/20 rounded-full blur-3xl" />
            <div className="absolute bottom-10 left-10 w-96 h-96 bg-primary-light/10 rounded-full blur-3xl" />
          </div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 relative z-10 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/15 backdrop-blur-sm mb-6">
              <Sparkles className="w-4 h-4 text-white" />
              <span className="text-sm font-medium text-white">We're hiring</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              Build the future of{' '}
              <span className="bg-gradient-to-r from-primary-light to-white bg-clip-text text-transparent">global connectivity</span>
            </h1>
            <p className="text-lg md:text-xl text-white/80 mb-8 max-w-2xl mx-auto">
              Join a passionate team making travel connectivity effortless for millions of people worldwide.
            </p>
            <a href="#openings" className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-white text-primary-dark font-semibold text-lg hover:bg-slate-100 transition-colors">
              View Open Positions
              <ArrowRight className="w-5 h-5" />
            </a>
          </div>
        </section>

        <section className="py-16 md:py-24 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Why work at {siteName}?</h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">We believe happy teams build great products. Here's what we offer.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {perks.map((perk) => (
                <div key={perk.title} className="bg-card rounded-2xl p-8 border border-border">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${perk.color} flex items-center justify-center mb-5`}>
                    <perk.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-2">{perk.title}</h3>
                  <p className="text-muted-foreground">{perk.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="openings" className="py-16 md:py-24 bg-muted/30">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Open Positions</h2>
              <p className="text-muted-foreground text-lg">Find your place on our team. All roles are remote-friendly.</p>
            </div>
            <div className="space-y-4">
              {openings.map((job) => (
                <div key={job.title} className="bg-card rounded-xl border border-border p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-primary dark:hover:border-primary transition-colors">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">{job.title}</h3>
                    <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1"><Briefcase className="w-4 h-4" />{job.department}</span>
                      <span className="flex items-center gap-1"><MapPin className="w-4 h-4" />{job.location}</span>
                      <span className="flex items-center gap-1"><Clock className="w-4 h-4" />{job.type}</span>
                    </div>
                  </div>
                  <button className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-gradient-to-r from-primary to-primary-dark text-white font-medium text-sm hover:opacity-90 transition-opacity whitespace-nowrap">
                    Apply Now <ArrowRight className="w-4 h-4" />
                  </button>
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
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Don't see the right role?</h2>
                <p className="text-white/80 text-lg mb-8 max-w-2xl mx-auto">We're always looking for talented people. Send us your resume and we'll keep you in mind for future openings.</p>
                <button className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-white text-primary-dark font-bold text-lg hover:bg-slate-100 transition-colors">
                  Send Your Resume <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
