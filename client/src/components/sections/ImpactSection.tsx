import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sprout, Info, ArrowRight, Leaf } from 'lucide-react';
import { Link } from 'wouter';
import { useTranslation } from '@/contexts/TranslationContext';

export function ImpactSection() {
    const { t } = useTranslation();
    const [isHovered, setIsHovered] = useState(false);

    return (
        <section className="py-12 bg-background">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    className="relative w-full h-[500px] rounded-3xl overflow-hidden cursor-pointer group shadow-2xl"
                    onHoverStart={() => setIsHovered(true)}
                    onHoverEnd={() => setIsHovered(false)}
                    onClick={() => setIsHovered(!isHovered)}
                >
                    {/* Background Image with Parallax Effect */}
                    <motion.div
                        className="absolute inset-0 bg-cover bg-center"
                        style={{ backgroundImage: "url('/images/Plant A (1).jpg')" }}
                        animate={{ scale: isHovered ? 1.05 : 1 }}
                        transition={{ duration: 0.7, ease: "easeOut" }}
                    />

                    {/* Gradient Overlay for Readability */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-black/10 transition-opacity duration-500" />

                    {/* Top Icons */}
                    <div className="absolute top-6 left-6 z-10">
                        <div className="bg-green-500/90 backdrop-blur-md p-3 rounded-xl text-white shadow-lg shadow-green-900/20">
                            <Sprout className="w-6 h-6" />
                        </div>
                    </div>

                    <div className="absolute top-6 right-6 z-10">
                        <motion.div
                            className="bg-white/10 backdrop-blur-md p-3 rounded-full text-white ring-1 ring-white/20"
                            animate={{
                                backgroundColor: isHovered ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.1)",
                                scale: isHovered ? 1.1 : 1
                            }}
                        >
                            <Info className="w-6 h-6" />
                        </motion.div>
                    </div>

                    {/* Content Container */}
                    <div className="absolute inset-x-0 bottom-0 p-8 md:p-12 text-white flex flex-col justify-end items-end text-right h-full pointer-events-none">
                        <motion.div
                            initial={false}
                            animate={{ y: isHovered ? 0 : 20 }}
                            transition={{ duration: 0.4 }}
                            className="pointer-events-auto"
                        >
                            <div className="mb-3">
                                <span className="inline-flex items-center px-3 py-1 rounded-full bg-green-500/20 text-green-300 text-xs font-bold uppercase tracking-wider backdrop-blur-sm border border-green-500/30">
                                    {t('website.home.impact.overline', 'Every Connection Counts')}
                                </span>
                            </div>

                            <h2 className="text-3xl md:text-5xl font-bold leading-tight mb-4 text-white drop-shadow-lg max-w-3xl">
                                {t('website.home.impact.title', 'Travel That Gives Back')}
                            </h2>

                            {/* Expandable Details */}
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{
                                    height: isHovered ? 'auto' : 0,
                                    opacity: isHovered ? 1 : 0
                                }}
                                transition={{ duration: 0.4, ease: "easeInOut" }}
                                className="overflow-hidden"
                            >
                                <div className="space-y-4 text-gray-200 text-lg leading-relaxed max-w-2xl pt-2 pb-2 ml-auto">
                                    <p className="flex items-center gap-3 justify-end">
                                        <span>{t('website.home.impact.description1', 'Every eSIM activated plants one tree.')}</span>
                                        <Leaf className="w-5 h-5 text-green-400 shrink-0" />
                                    </p>
                                    <p className="text-gray-300">
                                        {t('website.home.impact.description2', 'Your connectivity creates real environmental impact.')}
                                    </p>

                                    <div className="flex items-start justify-end gap-3 pr-3 border-r-2 border-green-500/50 my-4">
                                        <p className="text-sm text-gray-400 italic">
                                            {t('website.home.impact.condition', 'A tree is planted for every order of $10 or more.')}
                                        </p>
                                    </div>

                                    <div className="pt-6 flex justify-end">
                                        <Link href="/login">
                                            <button className="group inline-flex items-center gap-2 px-8 py-4 rounded-full bg-white text-green-950 font-bold text-base hover:bg-green-50 transition-all duration-300 shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.4)] hover:-translate-y-1">
                                                {t('website.home.impact.cta', 'Join the movement')}
                                                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                                            </button>
                                        </Link>
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
