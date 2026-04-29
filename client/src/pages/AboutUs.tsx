import {
  ArrowRight,
  Globe2,
  Shield,
  Zap,
  CheckCircle2,
  Smartphone,
  Wifi,
  CreditCard,
  Layers,
  Lock,
  Headphones,
  Network,
  ShieldCheck,
  Leaf,
  Flag,
  Cpu,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from '@/contexts/TranslationContext';
import { useLocation } from 'wouter';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function AboutUs() {
  const { t } = useTranslation();
  const [, navigate] = useLocation();

  const whatWeOffer = [
    {
      icon: Globe2,
      title: t('about.offer.f1.title', 'Global Coverage Across 200+ Destinations'),
      description: t('about.offer.f1.desc', "Global eSIM data plans across multiple countries and regions."),
    },
    {
      icon: Zap,
      title: t('about.offer.f2.title', 'Instant eSIM Delivery'),
      description: t('about.offer.f2.desc', "Instant eSIM delivery directly after purchase."),
    },
    {
      icon: Wifi,
      title: t('about.offer.f3.title', 'Fast & Simple Activation'),
      description: t('about.offer.f3.desc', "Fast and easy QR-based activation."),
    },
    {
      icon: Lock,
      title: t('about.offer.f4.title', 'Secure Payment Processing'),
      description: t('about.offer.f4.desc', "Secure and encrypted payment systems."),
    },
    {
      icon: Headphones,
      title: t('about.offer.f5.title', '24/7 Customer Support'),
      description: t('about.offer.f5.desc', "Reliable customer support whenever you need it."),
    },
  ];

  const whySimfinity = [
    { text: t('about.why.f1', "100% Digital Experience"), icon: Smartphone },
    { text: t('about.why.f2', "Transparent Pricing"), icon: CreditCard },
    { text: t('about.why.f3', "Fast Activation"), icon: Zap },
    { text: t('about.why.f4', "Flexible Data Options"), icon: Layers },
    { text: t('about.why.f5', "Strong Network Partnerships"), icon: Network },
    { text: t('about.why.f6', "Secure Platform"), icon: ShieldCheck },
    { text: t('about.why.f7', "Eco-Friendly Initiative"), icon: Leaf },
    { text: t('about.why.f8', "French-Based Brand"), icon: Flag },
    { text: t('about.why.f9', "Powered by {{siteName}} Technology", { siteName: t('platform_name', 'Simfinity') }), icon: Cpu },
  ];

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Helmet>
        <title>{String(t('about.pageTitle', 'About Us - {{siteName}} | Your Travel Connectivity Partner', { siteName: t('platform_name', 'Simfinity') }))}</title>
        <meta
          name="description"
          content={String(t('about.metaDescription', 'Learn about {{siteName}} — redefining global connectivity with seamless, digital-first eSIM solutions.', { siteName: t('platform_name', 'Simfinity') }))}
        />
      </Helmet>

      {/* Hero Section */}
      <section className="py-20 md:py-28 lg:py-36 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
            {t('about.heroTitle', 'About')} <span style={{ color: '#2c7338' }}>{t('about.heroGreeting', 'Us')} {t('platform_name', 'Simfinity')}</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-900 font-medium max-w-3xl mx-auto leading-relaxed mb-6">
            {t('about.heroSubtitle', 'Connecting France to the world — simply, instantly, and globally.')}
          </p>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed">
            {t('about.heroDescription', "At {{siteName}}, we believe staying connected should be effortless — no matter where life takes you. Whether you're traveling for adventure, business, or new opportunities, we make sure your connection is always ready. Founded in 2026 and led by Vanessa, Founder & CEO, {{siteName}} brings powerful global eSIM technology to the French market — combining innovation with a local, user-first approach designed for modern travelers.", { siteName: t('platform_name', 'Simfinity') })}
          </p>
        </div>
      </section>

      {/* Who We Are Section (replaces Why we built) */}
      <section className="py-16 md:py-24 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                {t('about.whoWeAre.title', 'Who We Are')}
              </h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  {t('about.whoWeAre.p1', "{{siteName}} is a next-generation connectivity brand built for global mobility. We provide fast, secure, and flexible eSIM solutions that remove the traditional barriers of mobile connectivity.", { siteName: t('platform_name', 'Simfinity') })}
                </p>
                <p>
                  {t('about.whoWeAre.p2', 'Make connectivity easy, accessible, and reliable for everyone — everywhere.')}
                </p>
              </div>
            </div>
            <div className="bg-slate-100 rounded-2xl aspect-[4/3] flex items-center justify-center overflow-hidden shadow-lg border border-gray-100">
              <img
                src="/images/about/Voices_crew1.png"
                alt={String(t('platform_name', 'Simfinity')) + " Team"}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* How to Set Up an eSIM (New Section) */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {t('about.setup.title', 'How to Set Up Your eSIM')}
            </h2>
            <p className="text-gray-500 text-lg max-w-2xl mx-auto">
              {t('about.setup.subtitle', 'Get connected in just a few simple steps.')}
            </p>
          </div>

          <Tabs defaultValue="iphone" className="w-full">
            <div className="flex justify-center mb-12">
              <TabsList className="grid w-full max-w-md grid-cols-1 h-auto p-1 bg-slate-100 rounded-full">
                <TabsTrigger
                  value="iphone"
                  className="rounded-full py-3 text-base font-medium data-[state=active]:bg-[#2c7338] data-[state=active]:text-white transition-all"
                >
                  {t('about.setup.onIphone', 'On iPhone')}
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="iphone" className="mt-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
                {/* Step 1 */}
                <div className="group bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden hover:shadow-xl hover:border-green-200 transition-all duration-300 flex flex-col h-full">
                  <div className="w-full bg-slate-50 flex items-center justify-center">
                    <img
                      src="/images/about/1.png"
                      alt={String(t('about.setup.step1.title', 'Scan QR Code'))}
                      className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-8 text-center flex flex-col items-center flex-grow">
                    <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-[#2c7338] transition-colors">{t('about.setup.step1.title', 'Scan QR Code')}</h3>
                    <p className="text-gray-500 leading-relaxed max-w-xs mx-auto text-lg">
                      {t('about.setup.step1.desc', 'Open your phone settings and scan the QR code sent to your email.')}
                    </p>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="group bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden hover:shadow-xl hover:border-green-200 transition-all duration-300 flex flex-col h-full">
                  <div className="w-full bg-slate-50 flex items-center justify-center">
                    <img
                      src="/images/about/2.png"
                      alt={String(t('about.setup.step2.title', 'Activate eSIM'))}
                      className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-8 text-center flex flex-col items-center flex-grow">
                    <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-[#2c7338] transition-colors">{t('about.setup.step2.title', 'Activate eSIM')}</h3>
                    <p className="text-gray-500 leading-relaxed max-w-xs mx-auto text-lg">
                      {t('about.setup.step2.desc', 'Follow the simple on-screen instructions to install your eSIM.')}                    </p>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="group bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden hover:shadow-xl hover:border-green-200 transition-all duration-300 flex flex-col h-full">
                  <div className="w-full bg-slate-50 flex items-center justify-center">
                    <img
                      src="/images/about/3.png"
                      alt={String(t('about.setup.step3.title', 'Connect'))}
                      className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-8 text-center flex flex-col items-center flex-grow">
                    <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-[#2c7338] transition-colors">{t('about.setup.step3.title', 'Connect')}</h3>
                    <p className="text-gray-500 leading-relaxed max-w-xs mx-auto text-lg">
                      {t('about.setup.step3.desc', 'Enable data roaming and start using your mobile data right away.')}
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* What We Offer (replaces Values) */}
      <section className="py-16 md:py-24 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {t('about.offer.title', 'What We Offer')}
            </h2>
            <p className="text-gray-500 text-lg max-w-2xl mx-auto">
              {t('about.offer.subtitle', 'Modern connectivity designed for today’s global lifestyle.')}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {whatWeOffer.map((item, index) => (
              <div
                key={index}
                className="group bg-white rounded-2xl p-8 border border-gray-100 hover:border-green-200 hover:shadow-md transition-all duration-300"
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-5"
                  style={{ backgroundColor: 'rgba(44, 115, 56, 0.1)' }}
                >
                  <item.icon className="w-6 h-6" style={{ color: '#2c7338' }} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-500 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Vision (New Grid Section) */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Mission */}
            <div className="bg-slate-50 rounded-2xl p-10 border border-gray-100 hover:shadow-md transition-all duration-300">
              <div className="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center mb-6">
                <CheckCircle2 className="w-8 h-8 text-[#2c7338]" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">{t('about.mission.title', 'Our Mission')}</h2>
              <p className="text-gray-600 text-lg leading-relaxed">
                {t('about.mission.desc', 'To make global connectivity simple, reliable, and accessible for everyone — wherever they go.')}              </p>
            </div>

            {/* Vision */}
            <div className="bg-slate-50 rounded-2xl p-10 border border-gray-100 hover:shadow-md transition-all duration-300">
              <div className="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center mb-6">
                <Globe2 className="w-8 h-8 text-[#2c7338]" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">{t('about.vision.title', 'Our Vision')}</h2>
              <p className="text-gray-600 text-lg leading-relaxed">
                {t('about.vision.desc', 'To create a world where staying connected across borders is effortless, instant, and available to all.')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Simfinity (Grid of small cards) */}
      <section className="py-16 md:py-24 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {t('about.why.title', 'Why {{siteName}}', { siteName: t('platform_name', 'Simfinity') })}
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {whySimfinity.map((item, index) => (
              <div
                key={index}
                className="group bg-white rounded-xl p-6 border border-gray-200 hover:border-green-200 hover:shadow-sm transition-all duration-300 flex items-center gap-4"
              >
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: 'rgba(44, 115, 56, 0.1)' }}
                >
                  <item.icon className="w-5 h-5" style={{ color: '#2c7338' }} />
                </div>
                <span className="text-lg font-bold text-gray-900">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Visual Gallery */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {t('about.gallery.title', '{{siteName}} in Action', { siteName: t('platform_name', 'Simfinity') })}
            </h2>
            <p className="text-gray-500 text-lg max-w-2xl mx-auto">
              {t('about.gallery.subtitle', 'From local moments to global adventures — we connect people everywhere.')}
            </p>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="group overflow-hidden rounded-2xl shadow-lg border border-gray-100 aspect-[16/9] md:aspect-auto md:h-80">
                <img
                  src="/images/about/promotion-1.jpeg"
                  alt={String(t('about.gallery.img1Alt', 'Global Connectivity'))}
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="group overflow-hidden rounded-2xl shadow-lg border border-gray-100 aspect-[16/9] md:aspect-auto md:h-80">
                <img
                  src="/images/about/promotion-2.jpeg"
                  alt={String(t('about.gallery.img2Alt', 'Seamless Experience'))}
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="group overflow-hidden rounded-2xl shadow-lg border border-gray-100 aspect-[4/3] md:aspect-auto md:h-64">
                <img
                  src="/images/about/promotion-3.jpeg"
                  alt={String(t('about.gallery.img3Alt', 'Travel Smart'))}
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="group overflow-hidden rounded-2xl shadow-lg border border-gray-100 aspect-[4/3] md:aspect-auto md:h-64">
                <img
                  src="/images/about/promotion-4.jpeg"
                  alt={String(t('about.gallery.img4Alt', 'Digital Freedom'))}
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="group overflow-hidden rounded-2xl shadow-lg border border-gray-100 aspect-[4/3] md:aspect-auto md:h-64">
                <img
                  src="/images/about/promotion-5.jpeg"
                  alt={String(t('about.gallery.img5Alt', 'Stay Connected'))}
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className="rounded-3xl px-8 py-16 md:px-16 md:py-20 text-center shadow-xl"
            style={{ background: 'linear-gradient(135deg, #2c7338, #3a9c4d, #2c7338)' }}
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
              {t('about.cta.title', 'Stay Connected. Explore Freely. Choose {{siteName}}', { siteName: t('platform_name', 'Simfinity') })}
            </h2>
            <p className="text-green-100 text-lg md:text-xl max-w-2xl mx-auto mb-8 font-medium">
              {t('about.cta.subtitle', 'Your journey deserves seamless connectivity — start today.')}
            </p>
            <Button
              onClick={() => navigate('/destinations')}
              size="lg"
              className="bg-white hover:bg-gray-100 text-gray-900 font-semibold px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              {t('about.cta.button', 'Get Connected')}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

export default AboutUs;
