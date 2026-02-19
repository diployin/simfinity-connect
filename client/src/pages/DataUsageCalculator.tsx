import { useState } from 'react';
import {
  Calculator,
  Globe2,
  ArrowRight,
  Mail,
  Video,
  Music,
  MapPin,
  MessageSquare,
  Camera,
  Wifi,
} from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { useSettingByKey } from '@/hooks/useSettings';
import { useLocation } from 'wouter';

export default function DataUsageCalculator() {
  const siteName = useSettingByKey('platform_name') || 'Simfinity';
  const [, navigate] = useLocation();

  const [days, setDays] = useState(7);
  const [activities, setActivities] = useState({
    email: 2,
    social: 3,
    maps: 1,
    video: 1,
    music: 1,
    videoCalls: 0,
    photos: 1,
    messaging: 2,
  });

  const usagePerHour: Record<string, number> = {
    email: 0.01,
    social: 0.15,
    maps: 0.06,
    video: 1.5,
    music: 0.07,
    videoCalls: 1.0,
    photos: 0.05,
    messaging: 0.01,
  };

  const totalDaily = Object.entries(activities).reduce(
    (sum, [key, hours]) => sum + hours * (usagePerHour[key] || 0),
    0
  );
  const totalTrip = totalDaily * days;

  const getRecommendation = () => {
    if (totalTrip <= 1) return { plan: '1 GB', tier: 'Light' };
    if (totalTrip <= 3) return { plan: '3 GB', tier: 'Standard' };
    if (totalTrip <= 5) return { plan: '5 GB', tier: 'Active' };
    if (totalTrip <= 10) return { plan: '10 GB', tier: 'Heavy' };
    return { plan: '20 GB+', tier: 'Power User' };
  };

  const recommendation = getRecommendation();

  const activityList = [
    { key: 'email', icon: Mail, label: 'Email & Browsing', unit: 'hrs/day', color: 'text-blue-500' },
    { key: 'social', icon: Camera, label: 'Social Media', unit: 'hrs/day', color: 'text-rose-500' },
    { key: 'maps', icon: MapPin, label: 'Maps & Navigation', unit: 'hrs/day', color: 'text-amber-500' },
    { key: 'video', icon: Video, label: 'Video Streaming', unit: 'hrs/day', color: 'text-purple-500' },
    { key: 'music', icon: Music, label: 'Music Streaming', unit: 'hrs/day', color: 'text-emerald-500' },
    { key: 'videoCalls', icon: MessageSquare, label: 'Video Calls', unit: 'hrs/day', color: 'text-cyan-500' },
  ];

  return (
    <>
      <Helmet>
        <title>Data Usage Calculator — {siteName}</title>
        <meta name="description" content="Calculate how much eSIM data you need for your trip. Estimate usage based on your daily activities." />
      </Helmet>

      <div className="min-h-screen bg-background">
        <section className="relative overflow-hidden bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900 text-white">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-20 right-20 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl" />
            <div className="absolute bottom-10 left-10 w-96 h-96 bg-purple-500/8 rounded-full blur-3xl" />
          </div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 relative z-10 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/15 backdrop-blur-sm mb-6">
              <Calculator className="w-4 h-4 text-indigo-300" />
              <span className="text-sm font-medium text-indigo-200">Plan Calculator</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              How much data do you{' '}
              <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">need?</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-300 mb-4 max-w-2xl mx-auto">
              Use our calculator to estimate your data needs and find the perfect plan for your trip.
            </p>
          </div>
        </section>

        <section className="py-16 md:py-24 bg-background">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 bg-card rounded-2xl border border-border p-8">
                <h2 className="text-2xl font-bold text-foreground mb-6">Your daily usage</h2>

                <div className="mb-8">
                  <label className="block text-sm font-medium text-foreground mb-2">Trip duration: {days} days</label>
                  <input
                    type="range"
                    min="1"
                    max="30"
                    value={days}
                    onChange={(e) => setDays(Number(e.target.value))}
                    className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-[#2c7338]"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>1 day</span>
                    <span>30 days</span>
                  </div>
                </div>

                <div className="space-y-6">
                  {activityList.map((activity) => (
                    <div key={activity.key}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <activity.icon className={`w-5 h-5 ${activity.color}`} />
                          <span className="text-sm font-medium text-foreground">{activity.label}</span>
                        </div>
                        <span className="text-sm text-muted-foreground">{(activities as any)[activity.key]} {activity.unit}</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="8"
                        step="0.5"
                        value={(activities as any)[activity.key]}
                        onChange={(e) => setActivities({ ...activities, [activity.key]: Number(e.target.value) })}
                        className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-[#2c7338]"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-gradient-to-br from-[#2c7338] to-[#1e5427] rounded-2xl p-8 text-white text-center">
                  <h3 className="text-lg font-semibold mb-2">Estimated usage</h3>
                  <p className="text-4xl font-bold mb-1">{totalTrip.toFixed(1)} GB</p>
                  <p className="text-green-200 text-sm mb-4">for {days} days</p>
                  <div className="border-t border-white/20 pt-4 mt-4">
                    <p className="text-sm text-green-200 mb-1">Recommended plan</p>
                    <p className="text-2xl font-bold">{recommendation.plan}</p>
                    <p className="text-green-200 text-sm">{recommendation.tier} Traveler</p>
                  </div>
                </div>

                <div className="bg-card rounded-2xl border border-border p-6 text-center">
                  <p className="text-sm text-muted-foreground mb-1">Daily average</p>
                  <p className="text-2xl font-bold text-foreground">{totalDaily.toFixed(2)} GB/day</p>
                </div>

                <button
                  onClick={() => navigate('/destinations')}
                  className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-gradient-to-r from-[#2c7338] to-[#3d9a4d] text-white font-semibold text-lg hover:opacity-90 transition-opacity"
                >
                  Find Plans <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24 bg-muted/30">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-foreground text-center mb-12">Data usage reference</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { activity: '1 hour of web browsing', data: '~60 MB' },
                { activity: '1 hour of social media', data: '~150 MB' },
                { activity: '1 hour of maps/navigation', data: '~60 MB' },
                { activity: '1 hour of music streaming', data: '~70 MB' },
                { activity: '1 hour of SD video streaming', data: '~700 MB' },
                { activity: '1 hour of HD video streaming', data: '~1.5 GB' },
                { activity: '1 hour of video calls', data: '~1 GB' },
                { activity: '100 emails (no attachments)', data: '~10 MB' },
              ].map((item) => (
                <div key={item.activity} className="bg-card rounded-xl border border-border p-4 flex items-center justify-between">
                  <span className="text-foreground text-sm">{item.activity}</span>
                  <span className="font-semibold text-foreground text-sm">{item.data}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
