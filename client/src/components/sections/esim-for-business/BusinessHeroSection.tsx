'use client';

import React from 'react';

import Image from 'next/image';
import Link from 'next/link';

import { useTranslation } from '@/contexts/LanguageContext';

import { MessageCircleQuestion, RefreshCw, Wallet } from 'lucide-react';

const BusinessHeroSection = () => {
    const { t } = useTranslation();
    const features = [
        {
            icon: <Wallet className='h-8 w-8' />,
            title: t('NewSimfinDes.esim_for_business.BusinessSection.whyChooseSection.features.0.title'),
            description: t('NewSimfinDes.esim_for_business.BusinessSection.whyChooseSection.features.0.description')
        },
        {
            icon: <RefreshCw className='h-8 w-8' />,
            title: t('NewSimfinDes.esim_for_business.BusinessSection.whyChooseSection.features.1.title'),
            description: t('NewSimfinDes.esim_for_business.BusinessSection.whyChooseSection.features.1.description')
        },
        {
            icon: <MessageCircleQuestion className='h-8 w-8' />,
            title: t('NewSimfinDes.esim_for_business.BusinessSection.whyChooseSection.features.2.title'),
            description: t('NewSimfinDes.esim_for_business.BusinessSection.whyChooseSection.features.2.description')
        }
    ];

    return (
        <>
            <section className='overflow-hidden bg-white py-8 md:py-16 lg:py-20'>
                <div className='containers'>
                    <div className='grid grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-12'>
                        {/* Left Side - Content */}
                        <div className='space-y-6 text-center md:text-start lg:space-y-8'>
                            <h1 className='text-3xl leading-tight font-medium text-black sm:text-4xl lg:text-5xl'>
                                {t('NewSimfinDes.esim_for_business.BusinessSection.heroSection.title')}
                            </h1>

                            <p className='max-w-xl text-base leading-relaxed text-gray-600 lg:text-base'>
                                {t('NewSimfinDes.esim_for_business.BusinessSection.heroSection.description')}
                            </p>

                            <Link
                                href='/contact'
                                className='inline-block rounded-full bg-black px-6 py-3 text-sm font-medium text-white transition-colors duration-300 hover:bg-gray-800 sm:px-8 sm:py-4 sm:text-base'>
                                {t('NewSimfinDes.esim_for_business.BusinessSection.heroSection.ctaButton')}
                            </Link>
                        </div>

                        {/* Right Side - Image */}
                        <div className='relative w-full'>
                            {/* Background Image */}
                            <div className='relative h-[350px] w-full overflow-hidden rounded-2xl sm:h-[450px] lg:h-[570px] lg:rounded-3xl'>
                                {/* src='/images/esim-business/saily-business-hero-employee-dashboard.webp' */}
                                <Image
                                    src='/images/esim-business/bussiness_hero.png'
                                    // src='https://placehold.co/600x800.png'
                                    alt='Business person using phone'
                                    fill
                                    className='object-cover'
                                    priority
                                    sizes='(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 600px'
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <section className='px-4 py-10 sm:px-6 lg:px-8'>
                <div className='containers mx-auto'>
                    {/* Heading Section */}
                    <div className='mb-12 text-center md:text-start'>
                        <h2 className='lg:text-4.5xl mb-4 max-w-2xl text-3xl font-medium text-gray-900 sm:text-4xl'>
                            {t('NewSimfinDes.esim_for_business.BusinessSection.whyChooseSection.heading')}
                        </h2>
                        <p className='max-w-3xl text-base text-gray-600 sm:text-base'>
                            {t('NewSimfinDes.esim_for_business.BusinessSection.whyChooseSection.subheading')}
                        </p>
                    </div>

                    {/* Features Grid */}
                    <div className='grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 lg:gap-12'>
                        {features.map((feature, index) => (
                            <div key={index} className='space-y-4'>
                                {/* Icon */}
                                <div className='text-gray-900'>{feature.icon}</div>

                                {/* Title */}
                                <h3 className='text-xl font-semibold text-gray-900'>{feature.title}</h3>

                                {/* Description */}
                                <p className='text-base leading-relaxed text-gray-600'>{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
            <section className='bg-white px-4 py-8 sm:px-6 md:py-16 lg:px-8'>
                <div className='containers mx-auto'>
                    <div className='mb-12 text-center md:text-start'>
                        <h2 className='lg:text-4.5xl mb-4 max-w-2xl text-3xl font-medium text-gray-900 sm:text-4xl'>
                            {t('NewSimfinDes.esim_for_business.BusinessSection.benefitsSection.heading')}
                        </h2>
                        <p className='max-w-3xl text-base text-gray-600 sm:text-sm'>
                            {' '}
                            {t('NewSimfinDes.esim_for_business.BusinessSection.benefitsSection.subheading')}
                        </p>
                    </div>
                    <div className='grid grid-cols-1 items-center gap-8 rounded-3xl bg-[#f7f7f8] lg:grid-cols-2 lg:gap-12'>
                        {/* Left Side - Image */}
                        <div className='order-2 lg:order-1'>
                            <div className='relative h-[500px] overflow-hidden rounded-[2rem] sm:h-[600px] lg:h-[600px]'>
                                {/* src='/images/esim-business/saily-business-tailored-solutions.webp' // Your image path */}
                                <Image
                                    src='/images/esim-business/business-tailored-solutions.png'
                                    // src='https://placehold.co/600x800.png' // Your image path
                                    alt='Business professional using mobile and laptop'
                                    fill
                                    className='object-cover'
                                    sizes='(max-width: 1024px) 100vw, 50vw'
                                    priority
                                />
                            </div>
                        </div>

                        {/* Right Side - Content */}
                        <div className='order-1 space-y-6 lg:order-2'>
                            <h2 className='max-w-lg p-4 text-3xl leading-tight font-medium text-gray-900 sm:text-4xl lg:text-3xl'>
                                {t(
                                    'NewSimfinDes.esim_for_business.BusinessSection.benefitsSection.tailoredSolutions.title'
                                )}
                            </h2>

                            <p className='sm:text-bse text-base leading-relaxed text-black'>
                                {t(
                                    'NewSimfinDes.esim_for_business.BusinessSection.benefitsSection.tailoredSolutions.description'
                                )}
                            </p>

                            <div className='pt-4'>
                                <Link
                                    href='/contact'
                                    className='inline-block rounded-full bg-black px-8 py-3.5 text-base font-medium text-white transition-colors duration-200 hover:bg-gray-800'>
                                    {t(
                                        'NewSimfinDes.esim_for_business.BusinessSection.benefitsSection.tailoredSolutions.ctaButton'
                                    )}
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <section className='bg-gray-50 py-8 md:py-16 lg:py-20'>
                <div className='containers'>
                    <div className='grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-8'>
                        {/* Left Card - Text Top, Image Bottom */}
                        <div className='flex flex-col overflow-hidden rounded-3xl bg-black text-white'>
                            {/* Text Section - Top */}
                            <div className='space-y-4 p-8 lg:p-10'>
                                <h2 className='text-3xl leading-tight font-medium lg:text-3xl'>
                                    {t('NewSimfinDes.esim_for_business.BusinessSection.coverageSection.leftCard.title')}
                                </h2>
                                <p className='text-base leading-relaxed text-white lg:text-base'>
                                    {t(
                                        'NewSimfinDes.esim_for_business.BusinessSection.coverageSection.leftCard.description'
                                    )}
                                </p>
                            </div>

                            {/* Image Section - Bottom */}
                            <div className='relative min-h-[350px] flex-1 lg:min-h-[500px]'>
                                {/* src='/images/esim-business/saily-business-worldwide-coverage.webp' */}
                                <Image
                                    src='/images/esim-business/business-worldwide-coverage.png'
                                    // src='https://placehold.co/600x600.png'
                                    alt='Business man using phone'
                                    fill
                                    className='rounded-2xl object-cover'
                                />
                            </div>
                        </div>

                        {/* Right Card - Image Top, Text Bottom */}
                        <div className='flex flex-col overflow-hidden rounded-3xl border border-gray-100 bg-white p-6 shadow-sm'>
                            {/* Image Section - Top */}
                            <div className='relative h-[350px] lg:h-[500px]'>
                                <Image
                                    src='/images/esim-business/business-seamless-connectivity-data-limit.png'
                                    alt='Business woman using phone'
                                    fill
                                    className='rounded-3xl object-cover'
                                />
                            </div>

                            {/* Text Section - Bottom */}
                            <div className='space-y-4 p-8 lg:p-10'>
                                <h2 className='text-3xl leading-tight font-medium text-black lg:text-4xl'>
                                    {t(
                                        'NewSimfinDes.esim_for_business.BusinessSection.coverageSection.rightCard.title'
                                    )}
                                </h2>
                                <p className='text-base leading-relaxed text-black lg:text-base'>
                                    {t(
                                        'NewSimfinDes.esim_for_business.BusinessSection.coverageSection.rightCard.description'
                                    )}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <section className='bg-white px-4 py-8 sm:px-6 md:py-16 lg:px-8'>
                <div className='containers mx-auto'>
                    <div className='grid grid-cols-1 items-center gap-8 rounded-3xl bg-[#f7f7f8] lg:grid-cols-2 lg:gap-12'>
                        {/* Left Side - Image */}
                        <div className='order-2 lg:order-2'>
                            <div className='relative h-[500px] overflow-hidden rounded-[2rem] sm:h-[600px] lg:h-[600px]'>
                                <Image
                                    src='/images/esim-business/business-no-roaming-fees.png' // Your image path
                                    alt='Business professional using mobile and laptop'
                                    fill
                                    className='object-cover'
                                    sizes='(max-width: 1024px) 100vw, 50vw'
                                    priority
                                />
                            </div>
                        </div>

                        {/* Right Side - Content */}
                        <div className='order-1 space-y-6 pl-14 lg:order-1'>
                            <h2 className='max-w-lg pt-3 text-3xl leading-tight font-medium text-gray-900 sm:text-4xl lg:text-3xl'>
                                {t('NewSimfinDes.esim_for_business.BusinessSection.noRoamingFeesSection.title')}
                            </h2>

                            <p className='sm:text-bse text-base leading-relaxed text-black'>
                                {t('NewSimfinDes.esim_for_business.BusinessSection.noRoamingFeesSection.description')}
                            </p>

                            <div className='pt-4'>
                                <Link
                                    href='/contact'
                                    className='inline-block rounded-full bg-black px-8 py-3.5 text-base font-medium text-white transition-colors duration-200 hover:bg-gray-800'>
                                    {t('NewSimfinDes.esim_for_business.BusinessSection.noRoamingFeesSection.ctaButton')}
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default BusinessHeroSection;
