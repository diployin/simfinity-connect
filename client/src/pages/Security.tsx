import { RootState } from '@/redux/store/store';
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useSelector } from 'react-redux';

const features = [
    {
        tag: 'IP PRIVACY',
        title: 'Change your digital location with a tap',
        description:
            'Route your traffic through servers in 115+ countries. Mask your real IP address to browse more privately and access your home content from anywhere.',
        bullets: [
            'Choose from 115+ virtual locations.',
            'Mask your real IP address.',
            'Access your favorite content anywhere.',
        ],
        img: '/images/security_hero_premium_1770810831045.png',
        reverse: false,
    },
    {
        tag: 'AD BLOCKER',
        title: 'Stop annoying ads and save your data',
        description:
            'Block intrusive advertisements and trackers before they reach your device. Save up to 28% of your mobile data and enjoy a smoother browsing experience.',
        bullets: [
            'Browse without distractions.',
            'Save up to 28% of mobile data.',
            'Increase browsing speed.'
        ],
        img: '/images/security_hero_shield_phone_premium_1770810803937.png',
        reverse: true,
    },
    {
        tag: 'WEB PROTECTION',
        title: 'Guard against malicious websites',
        description:
            'Simfinity checks every site you visit against a global database of threats. Block phishing attempts and malicious domains automatically.',
        bullets: [
            'Block dangerous websites.',
            'Limit online trackers.',
            'Browse with peace of mind.'
        ],
        img: '/images/security_hero_illustration_v1_1770810852628.png',
        reverse: false,
    },
];

const SecurityPage: React.FC = () => {

    const { isExpanded } = useSelector((state: RootState) => state.topNavbar);
    const isTopBarVisible = !isExpanded;

    return (
        <>
            <Helmet>
                <title>Security features | Simfinity</title>
                <meta
                    name="description"
                    content="Stay connected wherever you go and protect your browsing with built-in security features."
                />
            </Helmet>
            <main className={isTopBarVisible
                ? 'mt-28 md:mt-0'
                : 'mt-24 md:mt-0'}>
                <div className="min-h-screen bg-white">
                    <div className="container mx-auto px-4  sm:py-32 max-w-6xl">
                        {/* 🔥 SECTION 1: HERO */}
                        <section className="text-center mb-24 sm:mb-40">
                            <div className="max-w-4xl mx-auto px-4">
                                <h1 className="text-3xl md:text-5xl font-medium text-gray-900 leading-[1.1] tracking-tight mb-8">
                                    Security features that <br className="hidden sm:block" /> go where you go
                                </h1>
                                <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed mb-12 font-thin">
                                    Enjoy safer, more private browsing on any trip with a built-in ad blocker and web protection.
                                </p>

                                <div className="relative mx-auto max-w-3xl">
                                    <div className="absolute inset-0 bg-primary/10 rounded-[4rem] blur-[80px] -z-10 opacity-60" />
                                    <img
                                        src="/images/security_hero_illustration_v1_1770810852628.png"
                                        alt="Security Hero"
                                        className="w-full h-auto object-contain rounded-[2.5rem] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.1)] transition-transform duration-1000 hover:scale-[1.01]"
                                    />
                                </div>
                            </div>
                        </section>

                        {/* 🔥 SECTION 2: INTRO BLOCK */}
                        <section className="max-w-5xl mx-auto py-24 px-4 border-t border-gray-100 grid md:grid-cols-2 gap-12 lg:gap-24 items-start">
                            <div className="space-y-4">
                                <p className="text-sm font-medium text-gray-400 uppercase tracking-widest">WHY PRIVACY MATTERS</p>
                                <h2 className="text-2xl md:text-3xl lg:text-2.5 font-medium text-gray-900 leading-tight">
                                    Enjoy a safer <br /> browsing experience
                                </h2>
                            </div>
                            <p className="text-base md:text-lg text-gray-600 leading-relaxed pt-2 md:pt-14 font-thin">
                                Your eSIM should do more than just connect you. Simfinity protects your digital life automatically, so you can focus on the journey ahead without worrying about online threats or intrusive tracking.
                            </p>
                        </section>

                        {/* FEATURE SECTIONS */}
                        <section className="space-y-32 md:space-y-48 py-24 sm:py-32">
                            {features.map((f, i) => (
                                <div
                                    key={i}
                                    className={`flex flex-col md:flex-row gap-16 md:gap-24 items-center ${f.reverse ? 'md:flex-row-reverse' : ''}`}
                                >
                                    {/* Image side */}
                                    <div className="flex-1 w-full">
                                        <div className="relative aspect-square sm:aspect-[4/3] rounded-[2.5rem] overflow-hidden bg-gray-50 flex items-center justify-center p-8 sm:p-12 shadow-sm border border-gray-100">
                                            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-50" />
                                            <img
                                                src={f.img}
                                                alt={f.title}
                                                className="relative z-10 w-full h-full object-contain rounded-2xl transition-transform duration-500 hover:scale-105"
                                            />
                                        </div>
                                    </div>

                                    {/* Content side */}
                                    <div className="flex-1 max-w-xl">
                                        <div className="flex items-center gap-2 text-sm font-medium text-gray-400 uppercase tracking-[0.1em] mb-6">
                                            <span className="h-1.5 w-1.5 rounded-full bg-gray-400" /> {f.tag}
                                        </div>

                                        <h3 className="text-2xl md:text-3xl font-medium text-gray-900 mb-6 leading-tight">
                                            {f.title}
                                        </h3>

                                        <p className="text-base text-gray-600 mb-8 leading-relaxed font-thin">
                                            {f.description}
                                        </p>

                                        <ul className="space-y-4">
                                            {f.bullets.map((b, j) => (
                                                <li key={j} className="flex items-start gap-4 text-gray-700 group">
                                                    <div className="mt-1 flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center transition-colors group-hover:bg-primary/20">
                                                        <svg className="w-3.5 h-3.5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                                                        </svg>
                                                    </div>
                                                    <span className="text-base font-thin text-gray-600">{b}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            ))}
                        </section>

                        {/* 🔥 SECTION 6: BOTTOM CALL TO ACTION */}
                        <section className="max-w-5xl mx-auto text-center py-10 sm:py-28 px-6 sm:px-12 bg-gray-50 rounded-[3rem] border border-gray-100">
                            <div className="space-y-8">
                                <p className="text-sm font-medium text-gray-400 uppercase tracking-[0.2em]">GET STARTED</p>
                                <h3 className="text-2xl md:text-2.5 font-medium text-gray-900 leading-tight tracking-tight">
                                    Stay connected <br className="sm:hidden" /> wherever you go
                                </h3>
                                <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed font-thin">
                                    Download the Simfinity app and start your journey with protected, high-speed data in over 200 destinations.
                                </p>
                                <div className="pt-8">
                                    <button className="bg-gray-900 text-white text-lg font-semibold py-5 px-12 rounded-[1.25rem] hover:bg-black transition-all shadow-xl hover:shadow-2xl active:scale-[0.98] duration-300">
                                        Get Started with Simfinity
                                    </button>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
            </main>

        </>
    );
};

export default SecurityPage;
