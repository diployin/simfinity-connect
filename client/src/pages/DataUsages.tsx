'use client';

import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from '@/contexts/TranslationContext';
import {
  Smartphone,
  Clapperboard,
  Music,
  Navigation,
  Globe,
  Mail,
  Video,
  Download,
  RotateCcw,
  Check,
  Laptop,
  UserCog
} from 'lucide-react';
import ThemeButton from '@/components/ThemeButton';
import FAQSection from '@/components/sections/landing/FAQSection';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store/store';

// Activity Data Consumption (MB per hour)
const ACTIVITY_RATES = {
  social: 150,
  video2k: 1024, // 1 GB
  video1080: 1024, // 1 GB (Based on screenshot)
  music: 100,
  navigation: 10,
  web: 50,
  email: 4,
};

// Preset Profiles
const PRESETS = {
  casual: {
    social: 2,
    video2k: 0,
    video1080: 0.5,
    music: 1,
    navigation: 0,
    web: 1,
    email: 0.5,
  },
  remote: {
    social: 1,
    video2k: 0,
    video1080: 0,
    music: 2,
    navigation: 0,
    web: 4,
    email: 2,
  },
  custom: {
    social: 0,
    video2k: 0,
    video1080: 0,
    music: 0,
    navigation: 0,
    web: 0,
    email: 0,
  },
};

const DataUsages = () => {
  const { t } = useTranslation();
  const [profile, setProfile] = useState<'casual' | 'remote' | 'custom'>('custom');
  const { isExpanded } = useSelector((state: RootState) => state.topNavbar);
  const isTopBarVisible = !isExpanded;
  const [usage, setUsage] = useState({
    social: 0, // hours
    video2k: 0,
    video1080: 0,
    music: 0,
    navigation: 0,
    web: 0,
    email: 0,
  });

  const [totalDataGB, setTotalDataGB] = useState(0);

  // Update usage when profile changes
  useEffect(() => {
    if (profile !== 'custom') {
      setUsage(PRESETS[profile]);
    }
  }, [profile]);

  // Calculate Total
  useEffect(() => {
    const totalMBPerDay =
      usage.social * ACTIVITY_RATES.social +
      usage.video2k * ACTIVITY_RATES.video2k +
      usage.video1080 * ACTIVITY_RATES.video1080 +
      usage.music * ACTIVITY_RATES.music +
      usage.navigation * ACTIVITY_RATES.navigation +
      usage.web * ACTIVITY_RATES.web +
      usage.email * ACTIVITY_RATES.email;

    const totalGBPerMonth = (totalMBPerDay * 30) / 1024;
    setTotalDataGB(parseFloat(totalGBPerMonth.toFixed(1)));
  }, [usage]);

  const handleTimeChange = (activity: keyof typeof usage, hours: number) => {
    setUsage(prev => ({ ...prev, [activity]: hours }));
    setIsCustom(true);
  };

  const setIsCustom = (isCustom: boolean) => {
    if (isCustom && profile !== 'custom') setProfile('custom');
  }

  const TimeSelector = ({ activity, label, icon: Icon, subLabel }: { activity: keyof typeof usage, label: string, subLabel?: string, icon: any }) => (
    <div className="py-6 border-b border-gray-100 last:border-0">
      <div className="flex items-start gap-4 mb-4">
        <div className="p-2 bg-gray-50 rounded-lg text-gray-900">
          <Icon size={20} />
        </div>
        <div>
          <h4 className="font-medium text-gray-900 text-base">{label}</h4>
          {subLabel && <p className="text-sm text-gray-500 font-thin">{subLabel}</p>}
        </div>
      </div>

      <div className="flex flex-wrap gap-3 items-center">
        {[0.5, 1, 2, 3].map((h) => (
          <button
            key={h}
            onClick={() => handleTimeChange(activity, h)}
            className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${usage[activity] === h
              ? 'bg-black text-white border-black'
              : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'
              }`}
          >
            {h} h
          </button>
        ))}
        <div className="flex items-center gap-2 ml-2">
          <span className="text-sm text-gray-500">or</span>
          <div className="relative">
            <input
              type="number"
              min="0"
              max="24"
              value={usage[activity]}
              onChange={(e) => handleTimeChange(activity, parseFloat(e.target.value) || 0)}
              className="w-20 pl-4 pr-8 py-2 rounded-lg border border-gray-200 text-sm font-medium focus:outline-none focus:ring-1 focus:ring-black"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">h/day</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <main className={isTopBarVisible
      ? 'mt-28 md:mt-0'
      : 'mt-24 md:mt-0'}>
      <Helmet>
        <title>Data Usage Calculator | Simfinity</title>
      </Helmet>

      {/* Hero / Calculator Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="containers mx-auto max-w-7xl">
          <div className="text-center mb-12">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-medium text-gray-900 mb-4">Data usage calculator</h1>
            <p className="text-lg text-gray-600 font-thin max-w-2xl mx-auto">
              Not sure how much mobile data you'll need on your trip? Our mobile data usage calculator can help! Pick what activities you do on the internet and for how long, and we'll estimate it for you.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Calculator Left Side */}
            <div className="lg:col-span-8 bg-white rounded-3xl p-6 sm:p-10 shadow-sm h-fit">
              <h2 className="text-2xl font-medium text-gray-900 mb-6">Estimate your data usage in hours</h2>
              <p className="text-gray-600 font-thin mb-8">Ever wondered how much data you scroll away every day? Use our calculator to find out!</p>

              <div className="mb-10">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Pick a profile that matches your habits</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <button
                    onClick={() => setProfile('casual')}
                    className={`flex flex-col rounded-2xl border text-left transition-all overflow-hidden h-full ${profile === 'casual' ? 'border-2 border-black ring-0' : 'border-gray-200 hover:border-gray-300'}`}
                  >
                    <div className="h-40 w-full bg-gray-100">
                      <img src="/images/boy_usePhone.png" alt="Casual browser" className="w-full h-full object-cover" />
                    </div>
                    <div className="p-6 bg-white flex flex-col gap-3 flex-1 w-full">
                      <Globe className="w-6 h-6 text-black" />
                      <div>
                        <h4 className="text-lg font-medium text-gray-900 mb-1">Casual browser</h4>
                        <p className="text-sm text-gray-500 font-thin leading-relaxed">Browsing, chatting, checking email</p>
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={() => setProfile('remote')}
                    className={`flex flex-col rounded-2xl border text-left transition-all overflow-hidden h-full ${profile === 'remote' ? 'border-2 border-black ring-0' : 'border-gray-200 hover:border-gray-300'}`}
                  >
                    <div className="h-40 w-full bg-gray-100">
                      <img src="/images/business-worldwide-coverage.png" alt="Remote worker" className="w-full h-full object-cover" />
                    </div>
                    <div className="p-6 bg-white flex flex-col gap-3 flex-1 w-full">
                      <Laptop className="w-6 h-6 text-black" />
                      <div>
                        <h4 className="text-lg font-medium text-gray-900 mb-1">Remote worker</h4>
                        <p className="text-sm text-gray-500 font-thin leading-relaxed">Making calls, checking email, browsing</p>
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={() => setProfile('custom')}
                    className={`flex flex-col rounded-2xl border text-left transition-all overflow-hidden h-full ${profile === 'custom' ? 'border-2 border-black ring-0' : 'border-gray-200 hover:border-gray-300'}`}
                  >
                    <div className="h-40 w-full bg-gray-100">
                      <img src="/images/Coverage that reaches further.png" alt="Personalized" className="w-full h-full object-cover" />
                    </div>
                    <div className="p-6 bg-white flex flex-col gap-3 flex-1 w-full">
                      <UserCog className="w-6 h-6 text-black" />
                      <div>
                        <h4 className="text-lg font-medium text-gray-900 mb-1">Personalized</h4>
                        <p className="text-sm text-gray-500 font-thin leading-relaxed">Custom setup</p>
                      </div>
                    </div>
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-medium text-gray-900 mb-6">Select how much time you spend on each activity per day</h3>

                <TimeSelector
                  activity="social"
                  label="Social media"
                  subLabel="Instagram, Facebook, LinkedIn, X (Twitter)"
                  icon={Smartphone}
                />
                <TimeSelector
                  activity="video2k"
                  label="Quad HD video (1440p at 60 FPS)"
                  subLabel="YouTube, Netflix"
                  icon={Clapperboard}
                />
                <TimeSelector
                  activity="video1080"
                  label="Full HD video (1080p at 60 FPS)"
                  subLabel="TikTok, Instagram reels, YouTube Shorts"
                  icon={Video}
                />
                <TimeSelector
                  activity="music"
                  label="Music"
                  subLabel="Spotify, Apple Music, YouTube Music"
                  icon={Music}
                />
                <TimeSelector
                  activity="navigation"
                  label="Navigation"
                  subLabel="Google Maps, Apple Maps, Waze"
                  icon={Navigation}
                />
                <TimeSelector
                  activity="web"
                  label="Web browsing"
                  subLabel="News, online shopping"
                  icon={Globe}
                />
                <TimeSelector
                  activity="email"
                  label="Emails and messaging"
                  subLabel="Gmail, WhatsApp, Messenger"
                  icon={Mail}
                />
              </div>
            </div>

            {/* Calculator Right Side (Sticky) */}
            <div className="lg:col-span-4">
              <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm lg:sticky lg:top-32">
                <h3 className="text-xl font-medium text-gray-900 mb-6">Your estimated data usage</h3>

                <div className="flex flex-col items-center justify-center mb-8 relative">
                  <div className="w-48 h-48 rounded-full border-[12px] border-blue-500 border-t-yellow-400 border-r-purple-400 flex items-center justify-center">
                    <div className="text-center">
                      <p className="text-xs text-gray-500 uppercase tracking-widest font-medium mb-1">MONTHLY</p>
                      <p className="text-4xl font-medium text-gray-900">{totalDataGB} GB</p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 justify-center mb-8">
                  <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-400"></span><span className="text-[10px] text-gray-500 uppercase">Social Media</span></div>
                  <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-yellow-400"></span><span className="text-[10px] text-gray-500 uppercase">Music</span></div>
                  <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-purple-400"></span><span className="text-[10px] text-gray-500 uppercase">Video</span></div>
                </div>

                <div className="space-y-4">
                  <label className="block text-sm font-medium text-gray-700">Where do you need data?</label>
                  <div className="relative">
                    <input type="text" placeholder="e.g. Japan" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black" />
                    <Globe className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-gray-100">
                  <h4 className="text-sm font-medium text-gray-900 mb-4">Suggested data plans</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 rounded-xl border border-gray-100 bg-gray-50">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center">🇮🇳</div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">India</p>
                          <p className="text-xs text-gray-500">US$38.99</p>
                        </div>
                      </div>
                      <span className="text-sm font-medium text-gray-900">20 GB</span>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-xl border border-gray-100 bg-gray-50">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">🌏</div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">Global</p>
                          <p className="text-xs text-gray-500">US$66.99</p>
                        </div>
                      </div>
                      <span className="text-sm font-medium text-gray-900">20 GB</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setProfile('custom')}
                  className="w-full mt-6 py-3 flex items-center justify-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 border border-gray-200 rounded-full hover:bg-gray-50 transition-all"
                >
                  <RotateCcw size={16} /> Reset Calculator
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Info Section 1: What is mobile data usage? */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="order-2 lg:order-1 space-y-6">
            <h2 className="text-3xl sm:text-4xl font-medium text-gray-900">What is mobile data usage?</h2>
            <div className="space-y-4 text-base text-gray-600 font-thin leading-relaxed">
              <p>Mobile data usage is how much internet you're burning through when you're not connected to Wi-Fi. It's the cellular data your phone pulls from network towers instead of your home router. Every scroll through Instagram, GPS search for the nearest cafe, or video call home eats into your mobile data allowance.</p>
              <p>For travelers, it's pretty important since you're often relying on cellular data networks instead of Wi-Fi connections.</p>
            </div>
          </div>
          <div className="order-1 lg:order-2">
            <div className="relative rounded-[2.5rem] overflow-hidden bg-yellow-400 h-[400px]">
              {/* Placeholder Background Design matching Simfinity */}
              <div className="absolute top-0 right-0 p-8 z-10">
                <div className="bg-white rounded-2xl p-3 shadow-lg">
                  <Smartphone className="w-8 h-8 text-black" />
                </div>
              </div>
              <img src="/images/boy_usePhone.png" alt="Using mobile data" className="w-full h-full object-cover mix-blend-multiply opacity-90" />
            </div>
          </div>
        </div>
      </section>

      {/* Info Section 2: How to calculate data usage */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="order-1">
            <div className="relative rounded-[2.5rem] overflow-hidden bg-gray-100 h-[400px]">
              <img src="/images/Coverage that reaches further.png" alt="Calculate Data Usage" className="w-full h-full object-cover" />
              <div className="absolute bottom-8 left-8 bg-white/90 backdrop-blur-sm p-4 rounded-xl shadow-lg max-w-[200px]">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-lg">5 GB</span>
                  <div className="w-4 h-4 rounded-full border-2 border-yellow-400"></div>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-yellow-400 to-yellow-300 w-[70%]"></div>
                </div>
                <p className="text-xs text-gray-500 mt-2">valid for 30 days</p>
              </div>
            </div>
          </div>
          <div className="order-2 space-y-6">
            <h2 className="text-3xl sm:text-4xl font-medium text-gray-900">How to calculate data usage</h2>
            <div className="space-y-4 text-base text-gray-600 font-thin leading-relaxed">
              <p>Figuring out how much data you'll actually need doesn't have to be guesswork. Our data usage calculator takes the mystery out of planning by showing you exactly what your digital habits cost in terms of mobile data.</p>
              <p>Pick a preset profile that matches your usage style or select "Personalized" to input exactly how much time you spend daily on different activities like social media, streaming, or navigation. The calculator will show your estimated monthly data usage and give you an approximate idea of what plan size actually makes sense for your trip.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Data Calculation Table */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <h2 className="text-3xl sm:text-4xl font-medium text-gray-900 mb-6">How we calculate your data usage</h2>
        <p className="text-gray-600 font-thin mb-12">How do we figure out how much data you'll need? It all comes down to what you do online! Here's a peek at how much data common internet activities typically use per hour:</p>

        <div className="space-y-4">
          <div className="flex justify-between items-center py-4 border-b border-gray-100 text-sm font-medium text-gray-500 uppercase tracking-wider">
            <span>Activity</span>
            <span>Data per hour</span>
          </div>

          {[
            { label: 'Using social media', icon: Smartphone, consumption: '150 MB' },
            { label: 'Streaming movies in 2K (1440p at 60 FPS)', icon: Video, consumption: '1 GB' },
            { label: 'Streaming movies in full HD (1080p at 60 FPS)', icon: Clapperboard, consumption: '1 GB' },
            { label: 'Streaming music', icon: Music, consumption: '100 MB' },
            { label: 'Standard navigation', icon: Navigation, consumption: '10 MB' },
            { label: 'Browsing the web', icon: Globe, consumption: '50 MB' },
            { label: 'Messaging / Email', icon: Mail, consumption: '4 MB' },
            { label: 'Making HD video calls', icon: Video, consumption: '1 GB' },
            { label: 'Updating an app', icon: Download, consumption: '300 MB' },
          ].map((item, idx) => (
            <div key={idx} className="flex justify-between items-center py-6 border-b border-gray-100 last:border-0 group hover:bg-gray-50 px-2 rounded-lg transition-colors">
              <div className="flex items-center gap-4">
                <div className="text-gray-900">
                  <item.icon size={20} strokeWidth={1.5} />
                </div>
                <span className="text-gray-900 font-medium">{item.label}</span>
              </div>
              <span className="text-gray-900 font-medium">{item.consumption}</span>
            </div>
          ))}
        </div>
      </section>

      <FAQSection />
    </main>
  );
};

export default DataUsages;
