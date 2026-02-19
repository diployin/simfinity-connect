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
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Helmet } from 'react-helmet-async';
import { useSettingByKey } from '@/hooks/useSettings';
import { useLocation } from 'wouter';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function AboutUs() {
  const siteName = useSettingByKey('platform_name');
  const [, navigate] = useLocation();

  const whatWeOffer = [
    {
      icon: Globe2,
      title: 'Global Coverage',
      description: "Global eSIM data plans across multiple countries and regions.",
    },
    {
      icon: Zap,
      title: 'Instant Delivery',
      description: "Instant eSIM delivery directly after purchase.",
    },
    {
      icon: Wifi,
      title: 'Easy Activation',
      description: "Fast and easy QR-based activation.",
    },
    {
      icon: Lock,
      title: 'Secure Payments',
      description: "Secure and encrypted payment systems.",
    },
    {
      icon: Headphones,
      title: '24/7 Support',
      description: "Reliable customer support whenever you need it.",
    },
  ];

  const whySimfinity = [
    { text: "100% digital experience", icon: Smartphone },
    { text: "Transparent pricing", icon: CreditCard },
    { text: "Quick activation process", icon: Zap },
    { text: "Flexible data options", icon: Layers },
    { text: "Strong network partnerships", icon: Globe2 },
    { text: "Secure and trusted platform", icon: Shield },
  ];

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Helmet>
        <title>{`About Us - ${siteName} | Your Travel Connectivity Partner`}</title>
        <meta
          name="description"
          content={`Learn about ${siteName} — redefining global connectivity with seamless, digital-first eSIM solutions.`}
        />
      </Helmet>

      {/* Hero Section */}
      <section className="py-20 md:py-28 lg:py-36 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
            About <span style={{ color: '#2c7338' }}>Us</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-900 font-medium max-w-3xl mx-auto leading-relaxed mb-6">
            At Simfinity, we are redefining global connectivity with seamless, digital-first eSIM solutions designed for the modern world.
          </p>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed">
            In today’s fast-moving, borderless environment, staying connected should be simple, reliable, and affordable. Whether you’re traveling internationally, managing a remote business, or working across multiple countries, uninterrupted internet access is essential. Simfinity was created to remove the traditional barriers of mobile connectivity and replace them with a smarter, faster, and fully digital experience.
          </p>
        </div>
      </section>

      {/* Who We Are Section (replaces Why we built) */}
      <section className="py-16 md:py-24 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Who We Are
              </h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  Simfinity is a forward-thinking telecommunications brand focused on delivering advanced eSIM technology to customers worldwide. We combine telecom expertise with strong digital infrastructure to ensure secure transactions, instant activation, and dependable global coverage.
                </p>
                <p>
                  Our approach is built around innovation, simplicity, and customer trust. Every service we offer is designed to eliminate complexity and provide a smooth user experience from purchase to activation.
                </p>
              </div>
            </div>
            <div className="bg-slate-100 rounded-2xl aspect-[4/3] flex items-center justify-center overflow-hidden shadow-lg border border-gray-100">
              <img
                src="/images/about/Voices_crew1.png"
                alt="Simfinity Team"
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
              How to Set Up an eSIM
            </h2>
            <p className="text-gray-500 text-lg max-w-2xl mx-auto">
              Get connected in minutes with our simple setup process.
            </p>
          </div>

          <Tabs defaultValue="iphone" className="w-full">
            <div className="flex justify-center mb-12">
              <TabsList className="grid w-full max-w-md grid-cols-1 h-auto p-1 bg-slate-100 rounded-full">
                <TabsTrigger
                  value="iphone"
                  className="rounded-full py-3 text-base font-medium data-[state=active]:bg-[#2c7338] data-[state=active]:text-white transition-all"
                >
                  On iPhone
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
                      alt="Scan QR Code"
                      className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-8 text-center flex flex-col items-center flex-grow">
                    <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-[#2c7338] transition-colors">Scan QR Code</h3>
                    <p className="text-gray-500 leading-relaxed max-w-xs mx-auto text-lg">
                      Go to Settings &gt; Cellular &gt; Add eSIM and scan the QR code provided in your email.
                    </p>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="group bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden hover:shadow-xl hover:border-green-200 transition-all duration-300 flex flex-col h-full">
                  <div className="w-full bg-slate-50 flex items-center justify-center">
                    <img
                      src="/images/about/2.png"
                      alt="Activate eSIM"
                      className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-8 text-center flex flex-col items-center flex-grow">
                    <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-[#2c7338] transition-colors">Activate eSIM</h3>
                    <p className="text-gray-500 leading-relaxed max-w-xs mx-auto text-lg">
                      Follow the on-screen prompts to label your new plan (e.g., "Travel") and continue.
                    </p>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="group bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden hover:shadow-xl hover:border-green-200 transition-all duration-300 flex flex-col h-full">
                  <div className="w-full bg-slate-50 flex items-center justify-center">
                    <img
                      src="/images/about/3.png"
                      alt="Connect"
                      className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-8 text-center flex flex-col items-center flex-grow">
                    <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-[#2c7338] transition-colors">Connect</h3>
                    <p className="text-gray-500 leading-relaxed max-w-xs mx-auto text-lg">
                      Turn on "Data Roaming" for your new eSIM line to start browsing instantly.
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
              What We Offer
            </h2>
            <p className="text-gray-500 text-lg max-w-2xl mx-auto">
              We focus on making connectivity effortless — no physical SIM cards, no shipping delays, no roaming complications.
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
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">Our Mission</h2>
              <p className="text-gray-600 text-lg leading-relaxed">
                Our mission is to simplify global mobile connectivity by offering secure, affordable, and instantly accessible eSIM solutions that empower individuals and businesses to stay connected anywhere in the world.
              </p>
            </div>

            {/* Vision */}
            <div className="bg-slate-50 rounded-2xl p-10 border border-gray-100 hover:shadow-md transition-all duration-300">
              <div className="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center mb-6">
                <Globe2 className="w-8 h-8 text-[#2c7338]" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">Our Vision</h2>
              <p className="text-gray-600 text-lg leading-relaxed">
                We envision a future where global communication has no limits. A world where travelers never worry about roaming fees, professionals work without disruption, and digital connectivity is accessible to everyone instantly and effortlessly.
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
              Why Simfinity
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
              Simfinity in Action
            </h2>
            <p className="text-gray-500 text-lg max-w-2xl mx-auto">
              Connecting people, places, and experiences around the globe.
            </p>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="group overflow-hidden rounded-2xl shadow-lg border border-gray-100 aspect-[16/9] md:aspect-auto md:h-80">
                <img
                  src="/images/about/promotion-1.jpeg"
                  alt="Global Connectivity"
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="group overflow-hidden rounded-2xl shadow-lg border border-gray-100 aspect-[16/9] md:aspect-auto md:h-80">
                <img
                  src="/images/about/promotion-2.jpeg"
                  alt="Seamless Experience"
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="group overflow-hidden rounded-2xl shadow-lg border border-gray-100 aspect-[4/3] md:aspect-auto md:h-64">
                <img
                  src="/images/about/promotion-3.jpeg"
                  alt="Travel Smart"
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="group overflow-hidden rounded-2xl shadow-lg border border-gray-100 aspect-[4/3] md:aspect-auto md:h-64">
                <img
                  src="/images/about/promotion-4.jpeg"
                  alt="Digital Freedom"
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="group overflow-hidden rounded-2xl shadow-lg border border-gray-100 aspect-[4/3] md:aspect-auto md:h-64">
                <img
                  src="/images/about/promotion-5.jpeg"
                  alt="Stay Connected"
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
              Stay connected. Stay global. Stay Simfinity.
            </h2>
            <p className="text-green-100 text-lg md:text-xl max-w-2xl mx-auto mb-8 font-medium">
              At Simfinity, we don’t just provide eSIMs. we provide freedom to connect without boundaries.
            </p>
            <Button
              onClick={() => navigate('/destinations')}
              size="lg"
              className="bg-white hover:bg-gray-100 text-gray-900 font-semibold px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Get Connected
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

export default AboutUs;
