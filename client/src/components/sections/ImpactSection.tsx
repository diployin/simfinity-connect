import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sprout, Info, ArrowRight, Leaf } from 'lucide-react';
import { Link } from 'wouter';
import { useTranslation } from '@/contexts/TranslationContext';

export function ImpactSection() {
    const { t } = useTranslation();
    const [isHovered, setIsHovered] = useState(false);

    return (
        <section className="py-10 sm:py-12 bg-background dark:bg-gray-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                <motion.div
                    className="
                        relative
                        w-full
                        min-h-[420px]
                        sm:min-h-[500px]
                        md:min-h-[550px]
                        rounded-3xl
                        overflow-hidden
                        cursor-pointer
                        group
                        shadow-2xl
                    "
                    onHoverStart={() => setIsHovered(true)}
                    onHoverEnd={() => setIsHovered(false)}
                    onClick={() => setIsHovered(!isHovered)}
                >

                    {/* Background Image */}
                    <motion.div
                        className="absolute inset-0 bg-cover bg-top sm:bg-center"
                        style={{
                            backgroundImage: "url('/images/Plant A (1).jpg')"
                        }}
                        animate={{
                            scale: isHovered ? 1.05 : 1
                        }}
                        transition={{
                            duration: 0.7,
                            ease: 'easeOut'
                        }}
                    />

                    {/* Dark Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/60 to-black/20" />

                    {/* Left Top Icon */}
                    <div className="absolute top-4 sm:top-6 left-4 sm:left-6 z-10">
                        <div className="bg-green-500/90 backdrop-blur-md p-2.5 sm:p-3 rounded-xl text-white shadow-lg shadow-green-900/20">
                            <Sprout className="w-5 h-5 sm:w-6 sm:h-6" />
                        </div>
                    </div>

                    {/* Right Top Icon */}
                    <div className="absolute top-4 sm:top-6 right-4 sm:right-6 z-10">
                        <motion.div
                            className="bg-white/10 backdrop-blur-md p-2.5 sm:p-3 rounded-full text-white ring-1 ring-white/20"
                            animate={{
                                backgroundColor: isHovered
                                    ? 'rgba(255,255,255,0.2)'
                                    : 'rgba(255,255,255,0.1)',
                                scale: isHovered ? 1.08 : 1
                            }}
                            transition={{
                                duration: 0.3
                            }}
                        >
                            <Info className="w-5 h-5 sm:w-6 sm:h-6" />
                        </motion.div>
                    </div>

                    {/* Content Container */}
                    <div className="absolute inset-0 flex items-end justify-center sm:justify-end p-5 sm:p-8 md:p-12">

                        <motion.div
                            initial={false}
                            animate={{
                                y: isHovered ? 0 : 20
                            }}
                            transition={{
                                duration: 0.4
                            }}
                            className="w-full max-w-3xl text-center sm:text-right text-white"
                        >

                            {/* Badge */}
                            <div className="mb-3 sm:mb-4 flex justify-center sm:justify-end">
                                <span className="
                                    inline-flex
                                    items-center
                                    px-3
                                    py-1
                                    rounded-full
                                    bg-green-500/20
                                    text-green-300
                                    text-[10px]
                                    sm:text-xs
                                    font-bold
                                    uppercase
                                    tracking-wider
                                    backdrop-blur-sm
                                    border
                                    border-green-500/30
                                ">
                                    {t(
                                        'website.home.impact.overline',
                                        'Every Connection Counts'
                                    )}
                                </span>
                            </div>

                            {/* Heading */}
                            <h2 className="
                                text-2xl
                                sm:text-4xl
                                md:text-5xl
                                font-bold
                                leading-tight
                                mb-4
                                text-white
                                drop-shadow-lg
                            ">
                                {t(
                                    'website.home.impact.title',
                                    'Travel That Gives Back'
                                )}
                            </h2>

                            {/* Expandable Content */}
                            <motion.div
                                initial={{
                                    height: 0,
                                    opacity: 0
                                }}
                                animate={{
                                    height: isHovered ? 'auto' : 0,
                                    opacity: isHovered ? 1 : 0
                                }}
                                transition={{
                                    duration: 0.4,
                                    ease: 'easeInOut'
                                }}
                                className="overflow-hidden"
                            >

                                <div className="
                                    space-y-4
                                    text-gray-200
                                    text-sm
                                    sm:text-base
                                    md:text-lg
                                    leading-relaxed
                                    pt-2
                                ">

                                    {/* Description */}
                                    <p className="
                                        flex
                                        items-center
                                        justify-center
                                        sm:justify-end
                                        gap-2
                                        sm:gap-3
                                        flex-wrap
                                    ">
                                        <span>
                                            {t(
                                                'website.home.impact.description1',
                                                'Every eSIM activated plants one tree.'
                                            )}
                                        </span>

                                        <Leaf className="
                                            w-4
                                            h-4
                                            sm:w-5
                                            sm:h-5
                                            text-green-400
                                            shrink-0
                                        " />
                                    </p>

                                    {/* Second Description */}
                                    <p className="text-gray-300">
                                        {t(
                                            'website.home.impact.description2',
                                            'Your connectivity creates real environmental impact.'
                                        )}
                                    </p>

                                    {/* Condition */}
                                    <div className="flex justify-center sm:justify-end">
                                        <div className="
                                            border-r-0
                                            sm:border-r-2
                                            border-green-500/50
                                            sm:pr-3
                                            max-w-xl
                                        ">
                                            <p className="
                                                text-xs
                                                sm:text-sm
                                                text-gray-400
                                                italic
                                            ">
                                                {t(
                                                    'website.home.impact.condition',
                                                    'A tree is planted for every order of $10 or more.'
                                                )}
                                            </p>
                                        </div>
                                    </div>

                                    {/* CTA Button */}
                                    <div className="
                                        pt-4
                                        sm:pt-6
                                        flex
                                        justify-center
                                        sm:justify-end
                                    ">
                                        <Link href="/login">
                                            <button
                                                className="
                                                    group
                                                    inline-flex
                                                    items-center
                                                    justify-center
                                                    gap-2
                                                    px-5
                                                    sm:px-8
                                                    py-3
                                                    sm:py-4
                                                    rounded-full
                                                    bg-white
                                                    text-green-950
                                                    font-bold
                                                    text-sm
                                                    sm:text-base
                                                    hover:bg-green-50
                                                    transition-all
                                                    duration-300
                                                    shadow-[0_0_20px_rgba(255,255,255,0.3)]
                                                    hover:shadow-[0_0_30px_rgba(255,255,255,0.4)]
                                                    hover:-translate-y-1
                                                    w-full
                                                    sm:w-auto
                                                "
                                            >
                                                {t(
                                                    'website.home.impact.cta',
                                                    'Join the movement'
                                                )}

                                                <ArrowRight className="
                                                    w-4
                                                    h-4
                                                    sm:w-5
                                                    sm:h-5
                                                    transition-transform
                                                    group-hover:translate-x-1
                                                " />
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