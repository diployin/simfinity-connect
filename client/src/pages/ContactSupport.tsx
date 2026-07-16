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
import { useTranslation } from '@/contexts/TranslationContext';
import { motion } from 'framer-motion';
import { TawkToWidget } from '@/components/TawkToWidget';

// Animation variants
const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
};

const fadeInLeft = {
    hidden: { opacity: 0, x: -30 },
    visible: { opacity: 1, x: 0 }
};

const fadeInRight = {
    hidden: { opacity: 0, x: 30 },
    visible: { opacity: 1, x: 0 }
};

const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

export function ContactSupport() {
    const { t } = useTranslation();
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

    // Auto-open live chat widget on hash or query param trigger
    useState(() => {
        const queryParams = new URLSearchParams(window.location.search);
        if (queryParams.get('openChat') === 'true' || window.location.hash === '#chat') {
            const win = window as any;
            const interval = setInterval(() => {
                if (win.Tawk_API && typeof win.Tawk_API.maximize === 'function') {
                    win.Tawk_API.maximize();
                    clearInterval(interval);
                }
            }, 500);
            setTimeout(() => clearInterval(interval), 10000);
        }
    });

    const handleChannelClick = (channel: any) => {
        if (channel.link) {
            window.location.href = channel.link;
        } else if (channel.title === t('contactSupport.channels.liveChat.title', 'Live Chat')) {
            const win = window as any;
            if (win.Tawk_API && typeof win.Tawk_API.maximize === 'function') {
                win.Tawk_API.maximize();
            } else {
                toast({
                    title: t('contactSupport.toasts.liveChatLoading', 'Connecting...'),
                    description: t('contactSupport.toasts.liveChatLoadingDesc', 'Please wait while we load our real-time support widget.'),
                });
                let attempts = 0;
                const interval = setInterval(() => {
                    attempts++;
                    if (win.Tawk_API && typeof win.Tawk_API.maximize === 'function') {
                        win.Tawk_API.maximize();
                        clearInterval(interval);
                    } else if (attempts > 10) {
                        clearInterval(interval);
                        toast({
                            title: t('contactSupport.toasts.liveChatError', 'Support Widget Offline'),
                            description: t('contactSupport.toasts.liveChatErrorDesc', 'The live support widget is taking longer than expected. Please refresh or try again in a moment.'),
                            variant: 'destructive'
                        });
                    }
                }, 500);
            }
        } else if (channel.title === t('contactSupport.channels.prioritySupport.title', 'Priority Support')) {
            const contactSection = document.getElementById('contact-form-section');
            if (contactSection) {
                contactSection.scrollIntoView({ behavior: 'smooth' });
            } else {
                window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
            }
        }
    };

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
                    title: t('contactSupport.toasts.success', 'Message Sent Successfully!'),
                    description: t('contactSupport.toasts.successDesc', 'Our team will get back to you within 24 hours.'),
                });
            } else {
                throw new Error(data.message || 'Failed to send message');
            }
        } catch (error: any) {
            toast({
                title: t('contactSupport.toasts.error', 'Something went wrong'),
                description: error.message || t('contactSupport.toasts.errorDesc', 'Please try again later or contact us directly via email.'),
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
            title: t('contactSupport.channels.liveChat.title', 'Live Chat'),
            description: t('contactSupport.channels.liveChat.description', 'Get instant answers from our support team in real-time.'),
            action: t('contactSupport.channels.liveChat.action', 'Start Chat'),
            status: t('contactSupport.channels.liveChat.status', 'Available 24/7'),
            color: 'text-green-600 dark:text-green-400',
            bgColor: 'bg-green-50 dark:bg-green-900/20'
        },
        {
            icon: Mail,
            title: t('contactSupport.channels.emailSupport.title', 'Email Support'),
            description: t('contactSupport.channels.emailSupport.description', 'Send us a message and we\'ll respond within 24 hours.'),
            action: supportEmail,
            link: `mailto:${supportEmail}`,
            status: t('contactSupport.channels.emailSupport.status', '24h Response'),
            color: 'text-blue-600 dark:text-blue-400',
            bgColor: 'bg-blue-50 dark:bg-blue-900/20'
        },
        {
            icon: Headphones,
            title: t('contactSupport.channels.prioritySupport.title', 'Priority Support'),
            description: t('contactSupport.channels.prioritySupport.description', 'For enterprise and premium customers with urgent issues.'),
            action: t('contactSupport.channels.prioritySupport.action', 'Request Priority'),
            status: t('contactSupport.channels.prioritySupport.status', 'Priority Access'),
            color: 'text-purple-600 dark:text-purple-400',
            bgColor: 'bg-purple-50 dark:bg-purple-900/20'
        }
    ];

    const socialLinks = [
        { Icon: Twitter, url: twitterUrl },
        { Icon: Facebook, url: facebookUrl },
        { Icon: Instagram, url: instagramUrl },
        { Icon: Linkedin, url: linkedinUrl }
    ].filter(link => link.url !== '#');

    return (
        <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 flex flex-col transition-colors duration-300">
            <Helmet>
                <title>{t('contactSupport.title', 'Contact Support')} - {siteName} | 24/7 Global Help</title>
                <meta
                    name="description"
                    content={t('contactSupport.metaDescription', `Get 24/7 support for your ${siteName} eSIM. Reach out via live chat, email, or priority support channels for instant connectivity assistance.`)}
                />
                <meta property="og:title" content={`${t('contactSupport.title', 'Contact Support')} - ${siteName}`} />
                <meta property="og:description" content={t('contactSupport.metaDescription', `Get 24/7 support for your ${siteName} eSIM. Reach out via live chat, email, or priority support channels for instant connectivity assistance.`)} />
                <meta property="og:type" content="website" />
                <meta name="twitter:card" content="summary_large_image" />
            </Helmet>

            {/* Hero Section */}
            <section className="relative pt-24 pb-48 overflow-hidden bg-gradient-to-b from-gray-50 to-white dark:from-gray-900/50 dark:to-gray-950 transition-colors duration-300">
                <div className="absolute top-0 left-0 w-full h-full">
                    <div className="absolute top-0 right-0 w-1/3 h-full bg-green-500/5 dark:bg-green-500/10 transform skew-x-12 translate-x-1/2" />
                    <div className="absolute bottom-0 left-0 w-1/4 h-1/2 bg-blue-500/5 dark:bg-blue-500/10 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2" />
                </div>

                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={fadeInUp}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700 text-green-600 dark:text-green-400 text-sm font-bold mb-8">
                            <Clock className="w-4 h-4" />
                            {t('contactSupport.humanSupport', '24/7 Human Support')}
                        </div>
                        <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 dark:text-white mb-6 tracking-tight">
                            {t('contactSupport.heroTitle', 'We\'re Here to Help')}
                        </h1>
                        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
                            {t('contactSupport.heroSubtitle', 'Get instant support for your connectivity needs. Our team is available 24/7 to assist you.')}
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Support Channels */}
            <section className="py-24 bg-white dark:bg-gray-950 -mt-24 relative z-20">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        className="grid grid-cols-1 md:grid-cols-3 gap-8"
                        variants={staggerContainer}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-50px" }}
                    >
                        {supportChannels.map((channel, index) => (
                            <motion.div
                                key={index}
                                variants={fadeInUp}
                                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                                onClick={() => handleChannelClick(channel)}
                                className="bg-white dark:bg-gray-800 rounded-[2.5rem] p-8 border border-gray-100 dark:border-gray-700 shadow-xl shadow-gray-200/40 dark:shadow-gray-950/40 hover:shadow-2xl transition-all duration-300 group flex flex-col h-full cursor-pointer select-none"
                            >
                                <div className={`${channel.color} mb-6 group-hover:scale-110 transition-transform`}>
                                    <channel.icon className="w-8 h-8" />
                                </div>
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">{channel.title}</h3>
                                    <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-400 border border-gray-100 dark:border-gray-600">
                                        {channel.status}
                                    </span>
                                </div>
                                <p className="text-gray-600 dark:text-gray-400 mb-8 flex-grow">
                                    {channel.description}
                                </p>
                                <div className="flex items-center justify-between w-full p-4 rounded-xl bg-gray-50 dark:bg-gray-700 group-hover:bg-gray-100 dark:group-hover:bg-gray-600 text-gray-900 dark:text-white font-bold transition-all group/btn">
                                    {channel.action}
                                    <ArrowRight className="w-5 h-5 text-green-600 dark:text-green-400 group-hover/btn:translate-x-1 transition-transform" />
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Contact Form & Info */}
            <section className="py-24 bg-gray-50 dark:bg-gray-900/50 transition-colors duration-300">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
                        {/* Form */}
                        <motion.div
                            className="bg-white dark:bg-gray-800 rounded-[3rem] p-8 md:p-12 shadow-xl border border-gray-100 dark:border-gray-700"
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={fadeInLeft}
                        >
                            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">{t('contactSupport.form.title', 'Send us a Message')}</h2>
                            {submitted ? (
                                <div className="py-12 text-center">
                                    <div className="w-20 h-20 rounded-full bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 flex items-center justify-center mx-auto mb-6">
                                        <CheckCircle2 className="w-10 h-10" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{t('contactSupport.form.successTitle', 'Message Sent!')}</h3>
                                    <p className="text-gray-600 dark:text-gray-400">{t('contactSupport.form.successDesc', 'Thank you for reaching out. Our team will respond within 24 hours.')}</p>
                                    <Button
                                        variant="outline"
                                        className="mt-8 rounded-xl border-green-600 dark:border-green-400 text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20"
                                        onClick={() => setSubmitted(false)}
                                    >
                                        {t('contactSupport.form.sendAnother', 'Send Another Message')}
                                    </Button>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">{t('contactSupport.form.name', 'Full Name')}</label>
                                            <Input
                                                id="name"
                                                value={formData.name}
                                                onChange={handleChange}
                                                placeholder={t('contactSupport.form.namePlaceholder', 'John Doe')}
                                                className="h-14 rounded-xl border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-green-500 focus:border-green-500 dark:focus:ring-green-400 dark:focus:border-green-400"
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">{t('contactSupport.form.email', 'Email Address')}</label>
                                            <Input
                                                id="email"
                                                type="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                placeholder={t('contactSupport.form.emailPlaceholder', 'john@example.com')}
                                                className="h-14 rounded-xl border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-green-500 focus:border-green-500 dark:focus:ring-green-400 dark:focus:border-green-400"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">{t('contactSupport.form.subject', 'Subject')}</label>
                                        <Input
                                            id="subject"
                                            value={formData.subject}
                                            onChange={handleChange}
                                            placeholder={t('contactSupport.form.subjectPlaceholder', 'Need help with my eSIM...')}
                                            className="h-14 rounded-xl border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-green-500 focus:border-green-500 dark:focus:ring-green-400 dark:focus:border-green-400"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">{t('contactSupport.form.message', 'Message')}</label>
                                        <Textarea
                                            id="message"
                                            value={formData.message}
                                            onChange={handleChange}
                                            placeholder={t('contactSupport.form.messagePlaceholder', 'Please describe your issue in detail...')}
                                            className="min-h-[150px] rounded-xl border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-green-500 focus:border-green-500 dark:focus:ring-green-400 dark:focus:border-green-400"
                                            required
                                        />
                                    </div>
                                    <Button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full bg-green-600 hover:bg-green-700 dark:bg-green-600 dark:hover:bg-green-700 h-16 rounded-xl text-lg font-bold shadow-lg shadow-green-900/10 transition-colors"
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                                {t('contactSupport.form.sending', 'Sending...')}
                                            </>
                                        ) : (
                                            <>
                                                {t('contactSupport.form.submit', 'Send Message')}
                                                <Send className="ml-2 h-5 w-5" />
                                            </>
                                        )}
                                    </Button>
                                </form>
                            )}
                        </motion.div>

                        {/* Info */}
                        <motion.div
                            className="lg:py-12"
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={fadeInRight}
                        >
                            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-10">{t('contactSupport.info.globalPresence', 'Our Global Presence')}</h2>
                            <div className="space-y-12">
                                <div className="flex gap-6">
                                    <div className="w-12 h-12 rounded-xl bg-white dark:bg-gray-800 shadow-sm flex items-center justify-center flex-shrink-0 border border-gray-100 dark:border-gray-700">
                                        <MapPin className="w-6 h-6 text-green-600 dark:text-green-400" />
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{t('contactSupport.info.headquarters', 'Global Headquarters')}</h4>
                                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed whitespace-pre-line">
                                            {supportAddress}
                                        </p>
                                    </div>
                                </div>

                                {supportPhone && (
                                    <div className="flex gap-6">
                                        <div className="w-12 h-12 rounded-xl bg-white dark:bg-gray-800 shadow-sm flex items-center justify-center flex-shrink-0 border border-gray-100 dark:border-gray-700">
                                            <Phone className="w-6 h-6 text-green-600 dark:text-green-400" />
                                        </div>
                                        <div>
                                            <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{t('contactSupport.info.phoneSupport', 'Phone Support')}</h4>
                                            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                                                {supportPhone}
                                            </p>
                                        </div>
                                    </div>
                                )}

                                <div className="flex gap-6">
                                    <div className="w-12 h-12 rounded-xl bg-white dark:bg-gray-800 shadow-sm flex items-center justify-center flex-shrink-0 border border-gray-100 dark:border-gray-700">
                                        <Globe className="w-6 h-6 text-green-600 dark:text-green-400" />
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{t('contactSupport.info.globalNetwork', 'Global Network Coverage')}</h4>
                                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                                            {t('contactSupport.info.globalNetworkDesc', 'Our support team operates across multiple time zones to ensure 24/7 availability.')}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {socialLinks.length > 0 && (
                                <div className="mt-16 pt-16 border-t border-gray-200 dark:border-gray-700">
                                    <h4 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-6">{t('contactSupport.info.connectWithUs', 'Connect With Us')}</h4>
                                    <div className="flex gap-4">
                                        {socialLinks.map((link, i) => (
                                            <a
                                                key={i}
                                                href={link.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="w-12 h-12 rounded-full bg-white dark:bg-gray-800 shadow-sm flex items-center justify-center hover:bg-green-600 dark:hover:bg-green-600 hover:text-white transition-all border border-gray-100 dark:border-gray-700 text-gray-600 dark:text-gray-400"
                                            >
                                                <link.Icon className="w-5 h-5" />
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Final CTA */}
            <section className="py-24 bg-white dark:bg-gray-950 transition-colors duration-300">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        className="rounded-[3rem] bg-gradient-to-br from-gray-900 to-gray-800 dark:from-gray-900 dark:to-gray-800 p-12 md:p-20 text-center relative overflow-hidden"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={fadeInUp}
                        whileHover={{ scale: 1.02 }}
                        transition={{ duration: 0.3 }}
                    >
                        <div className="absolute top-0 left-0 w-full h-full opacity-30">
                            <div className="absolute top-0 left-0 w-64 h-64 bg-green-600 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2" />
                            <div className="absolute bottom-0 right-0 w-64 h-64 bg-blue-600 rounded-full blur-[120px] translate-x-1/2 translate-y-1/2" />
                        </div>
                        <div className="relative z-10">
                            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">{t('contactSupport.cta.title', 'Ready to Get Started?')}</h2>
                            <p className="text-gray-300 text-xl max-w-2xl mx-auto mb-10">
                                {t('contactSupport.cta.subtitle', 'Explore our global eSIM plans and stay connected wherever you go.', { siteName })}
                            </p>
                            <Button
                                onClick={() => window.location.href = '/destinations'}
                                className="bg-white hover:bg-gray-100 text-gray-900 h-16 px-10 rounded-2xl text-lg font-bold transition-colors"
                            >
                                {t('contactSupport.cta.action', 'Explore Destinations')}
                                <ArrowRight className="ml-2 h-5 w-5" />
                            </Button>
                        </div>
                    </motion.div>
                </div>
            </section>
            <TawkToWidget />
        </div>
    );
}

export default ContactSupport;