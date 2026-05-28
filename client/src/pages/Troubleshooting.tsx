import {
  Wrench,
  WifiOff,
  Scan,
  Smartphone,
  MessageCircle,
  HelpCircle,
  AlertCircle,
  CheckCircle2,
  ChevronRight,
  ShieldAlert,
  Signal,
  LifeBuoy
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Helmet } from 'react-helmet-async';
import { useSettingByKey } from '@/hooks/useSettings';
import { useLocation } from 'wouter';

export function Troubleshooting() {
  const siteName = useSettingByKey('platform_name') || 'Voltey';
  const [, navigate] = useLocation();

  const commonIssues = [
    {
      icon: WifiOff,
      title: 'No Data Connection',
      description: 'You’ve installed the eSIM but can’t access the internet.',
      solutions: [
        'Ensure "Data Roaming" is toggled ON for the Voltey eSIM.',
        'Check that the Voltey eSIM is selected as the primary data line.',
        'Restart your device to refresh the network connection.',
        'Wait up to 5 minutes for the eSIM to register with the local network.'
      ],
      color: 'bg-amber-50',
      iconColor: 'text-amber-600'
    },
    {
      icon: Scan,
      title: 'QR Code Won’t Scan',
      description: 'The camera doesn’t recognize the QR code or shows an error.',
      solutions: [
        'Ensure you are scanning via the device "Cellular" settings, not the camera app.',
        'Increase screen brightness on the device displaying the QR code.',
        'Check your internet connection; activation requires Wi-Fi.',
        'Manually enter the SM-DP+ Address and Activation Code provided.'
      ],
      color: 'bg-blue-50',
      iconColor: 'text-blue-600'
    },
    {
      icon: Signal,
      title: 'Slow Connection Speeds',
      description: 'Data is working but feels slower than expected.',
      solutions: [
        'Check if you are in a low-coverage area (elevators, basements, remote regions).',
        'Toggle Airplane Mode ON and OFF to re-establish a cleaner signal.',
        'Ensure you haven’t reached your daily high-speed data limit.',
        'Disable background app refresh for non-essential applications.'
      ],
      color: 'bg-green-50',
      iconColor: 'text-green-600'
    },
    {
      icon: ShieldAlert,
      title: 'Activation Error',
      description: 'The device displays "Unable to Activate" or "SIM Not Supported".',
      solutions: [
        'Verify your device is carrier-unlocked (ESIMs only work on unlocked phones).',
        'Check if the eSIM has already been installed on another device (one-time use).',
        'Ensure your device software is up to date.',
        'Confirm your device supports eSIM technology.'
      ],
      color: 'bg-red-50',
      iconColor: 'text-red-600'
    }
  ];

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Helmet>
        <title>{`Troubleshooting - ${siteName} | Help & Support`}</title>
        <meta
          name="description"
          content={`Need help with your ${siteName} eSIM? Find solutions for common connectivity, activation, and performance issues.`}
        />
      </Helmet>

      {/* Hero Section */}
      <section className="py-20 md:py-28 bg-slate-900 text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-1/2 h-full opacity-10">
          <Wrench className="w-96 h-96 -mr-20 -mt-20 transform rotate-12" />
        </div>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-white/80 text-sm font-medium mb-6 backdrop-blur-sm border border-white/10">
              <LifeBuoy className="w-4 h-4" />
              Support Center
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold mb-6">
              Having <span className="text-green-400">Trouble?</span><br />
              Let’s fix it together.
            </h1>
            <p className="text-xl text-slate-400 leading-relaxed mb-8">
              Most eSIM issues can be resolved in under 2 minutes by following our simple troubleshooting guides. Choose the issue you’re facing below.
            </p>
          </div>
        </div>
      </section>

      {/* Common Issues Grid */}
      <section className="py-24 bg-white -mt-12 relative z-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {commonIssues.map((issue, index) => (
              <div 
                key={index} 
                className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-slate-200 transition-all duration-300 group"
              >
                <div className={`w-16 h-16 rounded-2xl ${issue.color} ${issue.iconColor} flex items-center justify-center mb-8 group-hover:scale-110 transition-transform`}>
                  <issue.icon className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{issue.title}</h3>
                <p className="text-gray-500 mb-8 leading-relaxed">
                  {issue.description}
                </p>
                <div className="space-y-4">
                  {issue.solutions.map((solution, sIndex) => (
                    <div key={sIndex} className="flex gap-4 items-start">
                      <div className="w-6 h-6 rounded-full bg-slate-50 flex items-center justify-center flex-shrink-0 mt-0.5 border border-slate-100">
                        <span className="text-xs font-bold text-slate-400">{sIndex + 1}</span>
                      </div>
                      <p className="text-gray-700 font-medium text-sm leading-relaxed">{solution}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Manual Installation Section */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-slate-900 rounded-[3rem] p-8 md:p-16 text-white overflow-hidden relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/10 rounded-full blur-3xl" />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold mb-6">Manual Installation</h2>
                <p className="text-slate-400 mb-8 leading-relaxed">
                  If the QR code fails to scan, you can manually enter the details into your phone's settings. You'll find these details in your confirmation email.
                </p>
                <div className="space-y-4">
                  <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                    <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">SM-DP+ Address</h4>
                    <p className="text-lg font-mono text-green-400">Provided in your order email</p>
                  </div>
                  <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                    <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">Activation Code</h4>
                    <p className="text-lg font-mono text-green-400">Unique code for your eSIM</p>
                  </div>
                </div>
              </div>
              <div className="relative">
                <div className="bg-gradient-to-br from-green-500/20 to-blue-500/20 aspect-square rounded-[2rem] flex items-center justify-center border border-white/10">
                  <div className="text-center p-8">
                    <Smartphone className="w-24 h-24 text-white/20 mx-auto mb-6" />
                    <p className="text-xl font-medium">Follow instructions on your device carefully.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Still Stuck? Section */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-50 text-[var(--primary)] mb-8">
            <MessageCircle className="w-10 h-10" />
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-6">Still stuck? We're here for you.</h2>
          <p className="text-xl text-gray-500 mb-10 leading-relaxed">
            If our guides haven’t solved your problem, our technical support team is available 24/7 to help you get back online.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button 
               onClick={() => navigate('/contact-support')}
              size="lg" 
              className="bg-[var(--primary)] hover:bg-[#235d2d] text-white px-10 h-16 rounded-2xl text-lg font-bold shadow-xl shadow-green-900/10 transition-all hover:scale-105"
            >
              Contact Support
              <ChevronRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
               onClick={() => navigate('/help-center')}
              variant="outline"
              size="lg" 
              className="border-slate-200 hover:bg-slate-50 px-10 h-16 rounded-2xl text-lg font-bold transition-all"
            >
              Browse FAQ
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Troubleshooting;
