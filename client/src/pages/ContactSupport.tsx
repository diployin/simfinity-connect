import {
  Mail,
  MessageSquare,
  Clock,
  Globe,
  Phone,
  ArrowRight,
  Headphones,
  CheckCircle2,
  Twitter,
  Facebook,
  Instagram,
  Linkedin,
  MapPin,
  Send,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Helmet } from 'react-helmet-async';
import { useSettingByKey } from '@/hooks/useSettings';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';

export function ContactSupport() {
  const { toast } = useToast();
  
  // Dynamic Settings
  const siteName = useSettingByKey('platform_name') || 'Voltey';
  const supportEmail = useSettingByKey('email') || 'support@voltey.com';
  const supportPhone = useSettingByKey('phone') || '';
  const supportAddress = useSettingByKey('address') || '123 Digital Nomad Plaza, Suite 400, Innovation District, Voltey City, VC 56789';
  
  // Social Links
  const facebookUrl = useSettingByKey('facebook_url') || '#';
  const instagramUrl = useSettingByKey('instagram_url') || '#';
  const twitterUrl = useSettingByKey('twitter_url') || '#';
  const linkedinUrl = useSettingByKey('linkedin_url') || '#';

  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await apiRequest('POST', '/api/contact', formData);
      const data = await response.json();
      
      if (data.success) {
        setSubmitted(true);
        setFormData({ name: '', email: '', subject: '', message: '' });
        toast({
          title: "Message Sent",
          description: "We've received your request and will get back to you soon.",
        });
      } else {
        throw new Error(data.message || 'Failed to send message');
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to send message. Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const supportChannels = [
    {
      icon: MessageSquare,
      title: 'Live Chat',
      description: 'The fastest way to get help. Speak with our experts instantly.',
      action: 'Start Chat',
      status: 'Online',
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      icon: Mail,
      title: 'Email Support',
      description: 'Send us your questions and we’ll respond within 12 hours.',
      action: supportEmail,
      link: `mailto:${supportEmail}`,
      status: '24/7 Monitoring',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      icon: Headphones,
      title: 'Priority Support',
      description: 'Available for our Enterprise and Global plan customers.',
      action: 'Open Ticket',
      status: 'High Priority',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    }
  ];

  const socialLinks = [
    { Icon: Twitter, url: twitterUrl },
    { Icon: Facebook, url: facebookUrl },
    { Icon: Instagram, url: instagramUrl },
    { Icon: Linkedin, url: linkedinUrl }
  ].filter(link => link.url !== '#');

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Helmet>
        <title>{`Contact Support - ${siteName} | We're Here to Help`}</title>
        <meta
          name="description"
          content={`Get in touch with the ${siteName} support team. We offer 24/7 assistance for all your eSIM and global connectivity needs.`}
        />
      </Helmet>

      {/* Hero Section */}
      <section className="relative pt-24 pb-48 overflow-hidden bg-[#f8fafc]">
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-0 right-0 w-1/3 h-full bg-[var(--primary)]/5 transform skew-x-12 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-1/4 h-1/2 bg-blue-500/5 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2" />
        </div>
        
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white shadow-sm border border-slate-100 text-[var(--primary)] text-sm font-bold mb-8">
            <Clock className="w-4 h-4" />
            24/7 Human Support
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-extrabold text-slate-900 mb-6 tracking-tight">
            How can we <span className="text-[var(--primary)]">help you?</span>
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Our global support team is distributed across time zones to ensure you’re never left without a connection.
          </p>
        </div>
      </section>

      {/* Support Channels */}
      <section className="py-24 bg-white -mt-24 relative z-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {supportChannels.map((channel, index) => (
              <div 
                key={index} 
                className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-xl shadow-slate-200/40 hover:shadow-2xl transition-all duration-300 group flex flex-col h-full"
              >
                <div className={`w-14 h-14 rounded-2xl ${channel.bgColor} ${channel.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <channel.icon className="w-7 h-7" />
                </div>
                <div className="flex items-center justify-between mb-4">
                   <h3 className="text-xl font-bold text-slate-900">{channel.title}</h3>
                   <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded bg-slate-50 text-slate-400 border border-slate-100">
                    {channel.status}
                   </span>
                </div>
                <p className="text-slate-500 mb-8 flex-grow">
                  {channel.description}
                </p>
                {channel.link ? (
                  <a 
                    href={channel.link}
                    className="flex items-center justify-between w-full p-4 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-900 font-bold transition-colors group/btn"
                  >
                    {channel.action}
                    <ArrowRight className="w-5 h-5 text-[var(--primary)] group-hover/btn:translate-x-1 transition-transform" />
                  </a>
                ) : (
                   <button 
                    className="flex items-center justify-between w-full p-4 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-900 font-bold transition-colors group/btn"
                  >
                    {channel.action}
                    <ArrowRight className="w-5 h-5 text-[var(--primary)] group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
            {/* Form */}
            <div className="bg-white rounded-[3rem] p-8 md:p-12 shadow-xl border border-slate-100">
              <h2 className="text-3xl font-bold text-slate-900 mb-8">Send us a Message</h2>
              {submitted ? (
                <div className="py-12 text-center">
                  <div className="w-20 h-20 rounded-full bg-green-50 text-green-600 flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">Message Received!</h3>
                  <p className="text-slate-500">We’ve received your request and our team will get back to you shortly.</p>
                  <Button 
                    variant="outline" 
                    className="mt-8 rounded-xl border-[var(--primary)] text-[var(--primary)] hover:bg-green-50"
                    onClick={() => setSubmitted(false)}
                  >
                    Send another message
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700 ml-1">Full Name</label>
                      <Input 
                        id="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="John Doe" 
                        className="h-14 rounded-xl border-slate-200 focus:ring-[var(--primary)] focus:border-[var(--primary)]" 
                        required 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700 ml-1">Email Address</label>
                      <Input 
                        id="email"
                        type="email" 
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="john@example.com" 
                        className="h-14 rounded-xl border-slate-200 focus:ring-[var(--primary)] focus:border-[var(--primary)]" 
                        required 
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 ml-1">Subject</label>
                    <Input 
                      id="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="How can we help?" 
                      className="h-14 rounded-xl border-slate-200 focus:ring-[var(--primary)] focus:border-[var(--primary)]" 
                      required 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 ml-1">Message</label>
                    <Textarea 
                      id="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Tell us more about your inquiry..." 
                      className="min-h-[150px] rounded-xl border-slate-200 focus:ring-[var(--primary)] focus:border-[var(--primary)]" 
                      required 
                    />
                  </div>
                  <Button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full bg-[var(--primary)] hover:bg-[#235d2d] h-16 rounded-xl text-lg font-bold shadow-lg shadow-green-900/10"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        Send Message
                        <Send className="ml-2 h-5 w-5" />
                      </>
                    )}
                  </Button>
                </form>
              )}
            </div>

            {/* Info */}
            <div className="lg:py-12">
              <h2 className="text-3xl font-bold text-slate-900 mb-10">Global Presence</h2>
              <div className="space-y-12">
                <div className="flex gap-6">
                  <div className="w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center flex-shrink-0 border border-slate-100">
                    <MapPin className="w-6 h-6 text-[var(--primary)]" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-slate-900 mb-2">Corporate Headquarters</h4>
                    <p className="text-slate-500 leading-relaxed whitespace-pre-line">
                      {supportAddress}
                    </p>
                  </div>
                </div>

                {supportPhone && (
                  <div className="flex gap-6">
                    <div className="w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center flex-shrink-0 border border-slate-100">
                      <Phone className="w-6 h-6 text-[var(--primary)]" />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-slate-900 mb-2">Phone Support</h4>
                      <p className="text-slate-500 leading-relaxed">
                        {supportPhone}
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex gap-6">
                  <div className="w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center flex-shrink-0 border border-slate-100">
                    <Globe className="w-6 h-6 text-[var(--primary)]" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-slate-900 mb-2">Global Network</h4>
                    <p className="text-slate-500 leading-relaxed">
                      With local support teams in North America, Europe, and Asia-Pacific, we provide localized assistance across all continents.
                    </p>
                  </div>
                </div>
              </div>

              {socialLinks.length > 0 && (
                <div className="mt-16 pt-16 border-t border-slate-200">
                  <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6">Connect with us</h4>
                  <div className="flex gap-4">
                    {socialLinks.map((link, i) => (
                      <a 
                        key={i} 
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center hover:bg-[var(--primary)] hover:text-white transition-all border border-slate-100 text-slate-600"
                      >
                        <link.Icon className="w-5 h-5" />
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="rounded-[3rem] bg-slate-900 p-12 md:p-20 text-center relative overflow-hidden">
             <div className="absolute top-0 left-0 w-full h-full opacity-30">
               <div className="absolute top-0 left-0 w-64 h-64 bg-[var(--primary)] rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2" />
               <div className="absolute bottom-0 right-0 w-64 h-64 bg-blue-600 rounded-full blur-[120px] translate-x-1/2 translate-y-1/2" />
             </div>
             <div className="relative z-10">
               <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold text-white mb-6">Join the global connectivity revolution</h2>
               <p className="text-slate-400 text-xl max-w-2xl mx-auto mb-10">Experience the world without roaming fees. Your journey starts with {siteName}.</p>
               <Button 
                onClick={() => window.location.href='/destinations'}
                className="bg-white hover:bg-slate-100 text-slate-900 h-16 px-10 rounded-2xl text-lg font-bold"
               >
                 Explore Data Plans
               </Button>
             </div>
           </div>
        </div>
      </section>
    </div>
  );
}

export default ContactSupport;
