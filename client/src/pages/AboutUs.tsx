import {
  ArrowRight,
  Globe2,
  Shield,
  Zap,
  Users,
  Heart,
  Compass,
  Lightbulb,
  Sparkles,
  TrendingUp,
  Quote,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Helmet } from 'react-helmet-async';
import { useSettingByKey } from '@/hooks/useSettings';
import { useLocation } from 'wouter';

export function AboutUs() {
  const siteName = useSettingByKey('platform_name');
  const [, navigate] = useLocation();

  const mediaBrands = ['Lonely Planet', 'National Geographic', 'Forbes', 'CNN', 'PCMag', 'TechRadar'];

  const values = [
    {
      icon: Compass,
      title: 'Wander freely',
      description: "We're replacing plastic SIM cards with an easy and eco-friendly solution that works in 200+ destinations.",
    },
    {
      icon: Sparkles,
      title: 'Keep it simple',
      description: "No tech jargon. No clutter. We built an eSIM app that's clean, intuitive, and easy to navigate.",
    },
    {
      icon: Heart,
      title: 'Prioritize humans',
      description: 'We care about people, not just rigid processes. Every team member and user is treated with empathy and respect.',
    },
    {
      icon: TrendingUp,
      title: 'Always improve',
      description: "We don't chase perfection — we chase progress. We believe that small wins make big shifts.",
    },
    {
      icon: Globe2,
      title: 'Think like a traveler',
      description: `We stay curious, flexible, and open to the unknown, just like the explorers we built ${siteName} for.`,
    },
    {
      icon: Lightbulb,
      title: 'Make it matter',
      description: "We're here to make a difference, so we focus on what truly matters — our users, team, and the world around us.",
    },
  ];

  const timeline = [
    {
      year: '2023',
      title: 'Where it all began',
      description: 'Started with a shared idea — ditch plastic SIM cards and simplify mobile connectivity.',
    },
    {
      year: 'March 2024',
      title: 'The first launch',
      description: 'First eSIM plans covering 160+ countries with instant mobile access.',
    },
    {
      year: 'December 2024',
      title: 'Prioritizing security',
      description: 'Added built-in security features for safer browsing while traveling.',
    },
    {
      year: 'February 2025',
      title: 'Connecting the world',
      description: 'Expanded coverage to 200+ destinations, reached more users.',
    },
    {
      year: '2025',
      title: 'The journey continues',
      description: 'Focused on expanding coverage, improving the experience.',
    },
  ];

  const quotes = [
    {
      text: "We believe that staying connected while traveling should be effortless, affordable, and completely digital. That's the future we're building.",
      name: 'Alex Rivera',
      title: 'CEO',
    },
    {
      text: "Every feature we ship, every plan we design — travelers are at the heart of everything. We don't just build products, we enable adventures.",
      name: 'Sarah Chen',
      title: 'Head of Product',
    },
    {
      text: "What drives me is knowing that the work we do impacts people daily. We're not just marketing a product — we're solving real problems for real travelers.",
      name: 'James Okafor',
      title: 'Marketing Lead',
    },
  ];

  const lifeCards = [
    {
      title: 'Growth opportunities',
      description: 'We support your growth with learning opportunities, real responsibilities, and chances to lead.',
      large: true,
    },
    {
      title: 'Work-life balance',
      description: "Work from anywhere! We're a borderless team connected by trust, not time zones.",
      large: true,
    },
    {
      title: 'Culture and community',
      description: 'We prioritize people and celebrate wins, milestones, and contributions.',
      large: false,
    },
    {
      title: 'Autonomy and ownership',
      description: 'We trust you to lead, experiment, and bring your ideas to life.',
      large: false,
    },
    {
      title: 'Curiosity-driven work',
      description: "We encourage curiosity. Questions aren't simply welcome — they're how we build.",
      large: false,
    },
  ];

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Helmet>
        <title>{`About Us - ${siteName} | Your Travel Connectivity Partner`}</title>
        <meta
          name="description"
          content={`Learn about ${siteName} — the team building the future of travel connectivity with eSIM technology. No plastic, no borders, just seamless connection in 200+ destinations.`}
        />
      </Helmet>

      {/* Hero Section */}
      <section className="py-20 md:py-28 lg:py-36 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
            Meet the people behind{' '}
            <span style={{ color: '#2c7338' }}>{siteName}</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed">
            We're a passionate team of travelers, engineers, and dreamers building the eSIM app that keeps you connected — anywhere in the world.
          </p>
        </div>
      </section>

      {/* Why we built section */}
      <section className="py-16 md:py-24 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Why we built {siteName}
              </h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  We believe that exploring the world should come without barriers. Yet for too long, staying connected abroad has meant dealing with plastic SIM cards, confusing plans, and overpriced roaming fees.
                </p>
                <p>
                  So we set out to change that. {siteName} was born from a simple idea: digital connectivity should be as borderless as the travelers who need it. No plastic. No hassle. No borders.
                </p>
                <p>
                  Today, we serve travelers in 200+ destinations with instant eSIM plans that activate in seconds — helping people focus on what matters most: the journey itself.
                </p>
              </div>
            </div>
            <div className="bg-slate-100 rounded-2xl aspect-[4/3] flex items-center justify-center">
              <Globe2 className="w-20 h-20 text-slate-300" />
            </div>
          </div>
        </div>
      </section>

      {/* They talk about us */}
      <section className="py-12 md:py-16 bg-white border-y border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-center text-sm font-semibold text-gray-400 uppercase tracking-wider mb-8">
            They talk about us
          </h3>
          <div className="flex flex-wrap justify-center items-center gap-6 md:gap-10">
            {mediaBrands.map((brand) => (
              <span
                key={brand}
                className="text-gray-400 font-semibold text-lg md:text-xl tracking-wide hover:text-gray-600 transition-colors duration-200"
              >
                {brand}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* The values that guide us */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              The values that guide us
            </h2>
            <p className="text-gray-500 text-lg max-w-2xl mx-auto">
              These principles shape how we build, how we work, and how we connect with the world.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {values.map((value, index) => (
              <div
                key={index}
                className="group bg-slate-50 rounded-2xl p-8 border border-gray-100 hover:border-green-200 hover:shadow-md transition-all duration-300"
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-5"
                  style={{ backgroundColor: 'rgba(44, 115, 56, 0.1)' }}
                >
                  <value.icon className="w-6 h-6" style={{ color: '#2c7338' }} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{value.title}</h3>
                <p className="text-gray-500 leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* The tale timeline */}
      <section className="py-16 md:py-24 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              The {siteName} tale
            </h2>
            <p className="text-gray-500 text-lg max-w-xl mx-auto">
              From a shared idea to a global eSIM platform — here's how we got here.
            </p>
          </div>
          <div className="relative">
            <div className="absolute left-6 md:left-8 top-0 bottom-0 w-0.5 bg-gray-200" />
            <div className="space-y-10">
              {timeline.map((item, index) => (
                <div key={index} className="relative flex gap-6 md:gap-8">
                  <div className="relative z-10 flex-shrink-0">
                    <div
                      className="w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md"
                      style={{ background: 'linear-gradient(135deg, #2c7338, #3a9c4d)' }}
                    >
                      {index + 1}
                    </div>
                  </div>
                  <div className="pb-2 flex-1">
                    <span
                      className="inline-block text-xs font-bold px-3 py-1 rounded-full mb-2"
                      style={{ backgroundColor: 'rgba(44, 115, 56, 0.1)', color: '#2c7338' }}
                    >
                      {item.year}
                    </span>
                    <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">{item.title}</h3>
                    <p className="text-gray-500 leading-relaxed">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team quotes section */}
      <section className="py-16 md:py-24 bg-gray-900">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Voices of the {siteName} crew
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {quotes.map((quote, index) => (
              <div
                key={index}
                className="bg-gray-800 rounded-2xl p-8 border border-gray-700 hover:border-gray-600 transition-colors duration-300"
              >
                <Quote className="w-8 h-8 text-green-500 mb-4 opacity-60" />
                <p className="text-gray-300 text-lg leading-relaxed mb-6">
                  "{quote.text}"
                </p>
                <div>
                  <p className="text-white font-semibold">{quote.name}</p>
                  <p className="text-gray-500 text-sm">{quote.title}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Life at section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Life at {siteName}
            </h2>
            <p className="text-gray-500 text-lg max-w-2xl mx-auto">
              A workplace where curiosity thrives and every voice matters.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {lifeCards.map((card, index) => (
              <div
                key={index}
                className={`bg-slate-50 rounded-2xl p-8 border border-gray-100 hover:shadow-md transition-all duration-300 ${
                  card.large && index < 2 ? 'lg:col-span-1 md:col-span-1' : ''
                } ${index < 2 ? 'md:row-span-1' : ''}`}
                style={index < 2 ? { minHeight: '220px' } : {}}
              >
                <h3 className="text-xl font-bold text-gray-900 mb-3">{card.title}</h3>
                <p className="text-gray-500 leading-relaxed">{card.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className="rounded-3xl px-8 py-16 md:px-16 md:py-20 text-center"
            style={{ background: 'linear-gradient(135deg, #2c7338, #3a9c4d, #2c7338)' }}
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
              Always connected. Always on course.
            </h2>
            <p className="text-green-100 text-lg md:text-xl max-w-2xl mx-auto mb-8">
              Join a team of passionate travelers shaping the future of mobile connectivity.
            </p>
            <Button
              onClick={() => navigate('/contact')}
              size="lg"
              className="bg-white hover:bg-gray-100 text-gray-900 font-semibold px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Explore Careers
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

export default AboutUs;
