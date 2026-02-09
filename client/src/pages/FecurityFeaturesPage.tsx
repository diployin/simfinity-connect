'use client';

import React from 'react';

import CTASection from '@/components/common/CTASection';
import FAQ from '@/components/common/FAQ';
import ImageContentSectionCheckbox from '@/components/common/ImageContentSectionCheckbox';
import ValuesSectionCommon from '@/components/common/ValuesSectionCommon';
import SecurityHeroSection from '@/components/sections/features/SecurityHeroSection';
import DownloadAppSection from '@/components/sections/landing/DownloadAppSection';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Globe } from 'lucide-react';
import { MdOutlineBlock, MdOutlinePrivacyTip } from 'react-icons/md';
import useStaticData from '@/data/useStaticData';
import {
  FaGlobeAmericas,
  FaLightbulb,
  FaHeart,
  FaSeedling,
  FaCompass,
  FaRocket,
} from 'react-icons/fa';
import { useTranslation } from '@/contexts/TranslationContext';
interface Value {
  id: number;
  iconType: string;
  title: string;
  description: string;
}

const FecurityFeaturesPage = () => {
  const staticData = useStaticData();
  const { t } = useTranslation();

  const iconMap: Record<string, React.ReactNode> = {
    GlobeAmericas: <FaGlobeAmericas className="text-themeYellow h-8 w-8" />,
    Lightbulb: <FaLightbulb className="text-themeYellow h-8 w-8" />,
    Heart: <FaHeart className="text-themeYellow h-8 w-8" />,
    Seedling: <FaSeedling className="text-themeYellow h-8 w-8" />,
    Compass: <FaCompass className="text-themeYellow h-8 w-8" />,
    Rocket: <FaRocket className="text-themeYellow h-8 w-8" />,
  };

  // Get values data from translation
  const values: Value[] = [
    {
      id: 1,
      iconType: t('website.NewSimfinDes.about_us.ValuesSection.values.0.iconType'),
      title: t('website.NewSimfinDes.about_us.ValuesSection.values.0.title'),
      description: t('website.NewSimfinDes.about_us.ValuesSection.values.0.description'),
    },
    {
      id: 2,
      iconType: t('website.NewSimfinDes.about_us.ValuesSection.values.1.iconType'),
      title: t('website.NewSimfinDes.about_us.ValuesSection.values.1.title'),
      description: t('website.NewSimfinDes.about_us.ValuesSection.values.1.description'),
    },
    {
      id: 3,
      iconType: t('website.NewSimfinDes.about_us.ValuesSection.values.2.iconType'),
      title: t('website.NewSimfinDes.about_us.ValuesSection.values.2.title'),
      description: t('website.NewSimfinDes.about_us.ValuesSection.values.2.description'),
    },
    {
      id: 4,
      iconType: t('website.NewSimfinDes.about_us.ValuesSection.values.3.iconType'),
      title: t('website.NewSimfinDes.about_us.ValuesSection.values.3.title'),
      description: t('website.NewSimfinDes.about_us.ValuesSection.values.3.description'),
    },
    {
      id: 5,
      iconType: t('website.NewSimfinDes.about_us.ValuesSection.values.4.iconType'),
      title: t('website.NewSimfinDes.about_us.ValuesSection.values.4.title'),
      description: t('website.NewSimfinDes.about_us.ValuesSection.values.4.description'),
    },
    {
      id: 6,
      iconType: t('website.NewSimfinDes.about_us.ValuesSection.values.5.iconType'),
      title: t('website.NewSimfinDes.about_us.ValuesSection.values.5.title'),
      description: t('website.NewSimfinDes.about_us.ValuesSection.values.5.description'),
    },
  ];

  return (
    <>
      <SecurityHeroSection />
      <section className="w-full bg-white py-8 sm:pt-10 lg:py-12">
        <div className="containers mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-16">
            {/* Left Column - Title */}
            <div>
              <h2 className="lg:text-4.5xl text-3xl leading-tight font-medium text-gray-900 sm:text-4xl">
                {staticData.Security_Features.Safe_travels.title}
              </h2>
            </div>

            {/* Right Column - Description */}
            <div>
              <p className="text-center text-base leading-relaxed text-gray-600 sm:text-base md:text-start">
                {staticData.Security_Features.Safe_travels.description}
              </p>
            </div>
          </div>
        </div>
      </section>
      <ImageContentSectionCheckbox
        subtitle={staticData.Security_Features.Left_rightImage.virtualLocation.subtitle}
        subtitleIcon={<Globe className="h-4 w-4" />}
        title={staticData.Security_Features.Left_rightImage.virtualLocation.title}
        description={staticData.Security_Features.Left_rightImage.virtualLocation.description}
        benefits={staticData.Security_Features.Left_rightImage.virtualLocation.benefits}
        // imageSrc='/images/features/sf-virtual-location.webp'
        imageSrc="/images/features/Changing_our_location_ffortless.png"
        imageAlt="Virtual location globe"
      />
      <ImageContentSectionCheckbox
        subtitle={staticData.Security_Features.Left_rightImage.adBlocker.subtitle}
        subtitleIcon={<MdOutlineBlock className="h-4 w-4" />}
        title={staticData.Security_Features.Left_rightImage.adBlocker.title}
        description={staticData.Security_Features.Left_rightImage.adBlocker.description}
        benefits={staticData.Security_Features.Left_rightImage.adBlocker.benefits}
        // imageSrc='/images/features/sf-ad-blocker-lp.webp'
        imageSrc="/images/features/Don’t let online threats ruin your trip.png"
        imageAlt="Virtual location"
        imagePosition="right"
      />
      <ImageContentSectionCheckbox
        subtitle={staticData.Security_Features.Left_rightImage.webProtection.subtitle}
        subtitleIcon={<MdOutlinePrivacyTip className="h-4 w-4" />}
        title={staticData.Security_Features.Left_rightImage.webProtection.title}
        description={staticData.Security_Features.Left_rightImage.webProtection.description}
        benefits={staticData.Security_Features.Left_rightImage.webProtection.benefits}
        // imageSrc='/images/features/sf-web-protection-lp.webp'
        imageSrc="/images/features/More blocked ads, more relaxed browsing.png"
        imageAlt="Virtual protection "
        imagePosition="left"
      />
      {/* <ValuesSectionCommon config={staticData.Security_Features.valuesConfig} /> */}

      <section className="bg-white py-16 text-black md:py-20">
        <div className="containers">
          {/* Header */}
          <div className="mb-12 md:mb-16">
            <h2 className="text-center text-3xl font-medium text-black sm:text-4xl lg:text-left lg:text-4.5xl">
              {t('website.NewSimfinDes.about_us.ValuesSection.heading')}
            </h2>
          </div>

          {/* Desktop Grid View */}
          <div className="hidden grid-cols-1 gap-8 md:grid md:grid-cols-2 lg:grid-cols-3">
            {values.map((value) => (
              <div key={value.id} className="flex flex-col gap-4">
                <div className="flex h-10 w-10 items-center justify-center">
                  {iconMap[value.iconType] || (
                    <FaGlobeAmericas className="h-8 w-8 text-themeYellow" />
                  )}
                </div>
                <h3 className="text-xl font-medium text-black">{value.title}</h3>
                <p className="text-base leading-relaxed text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>

          {/* Mobile Carousel View */}
          <div className="block lg:hidden">
            <Carousel
              opts={{
                align: 'start',
                loop: true,
              }}
              className="w-full"
            >
              <CarouselContent className="-ml-4">
                {values.map((value) => (
                  <CarouselItem key={value.id} className="pl-4 sm:basis-1/2">
                    <div className="flex h-full flex-col gap-4 p-6">
                      <div className="flex h-10 w-10 items-center justify-center">
                        {iconMap[value.iconType] || (
                          <FaGlobeAmericas className="h-8 w-8 text-themeYellow" />
                        )}
                      </div>
                      <h3 className="text-xl font-medium text-black">{value.title}</h3>
                      <p className="text-base leading-relaxed text-gray-600">{value.description}</p>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>

              {/* Navigation Buttons - Right aligned with space between */}
              <div className="mt-8 flex items-center justify-around">
                {/* Left side empty for alignment */}

                {/* Navigation buttons */}
                <div className="flex gap-4">
                  <CarouselPrevious className="static h-12 w-12 translate-y-0 rounded-full border border-gray-300 bg-white text-black shadow-md transition-all hover:bg-gray-50 hover:shadow-lg [&_svg]:h-6 [&_svg]:w-6" />
                  <CarouselNext className="static h-12 w-12 translate-y-0 rounded-full border border-gray-300 bg-white text-black shadow-md transition-all hover:bg-gray-50 hover:shadow-lg [&_svg]:h-6 [&_svg]:w-6" />
                </div>
              </div>
            </Carousel>
          </div>
        </div>
      </section>

      <DownloadAppSection />
      <CTASection
        heading={staticData.Security_Features.Left_rightImage.support24x7.heading}
        description={staticData.Security_Features.Left_rightImage.webProtection.description}
        button={{
          text: staticData.Security_Features.Left_rightImage.support24x7.button.text,
          href: '/signup',
          variant: 'white',
        }}
        contentAlignment="start"
        backgroundColor=" bg-[#f7f7f8]"
        textColor="text-gray-900"
      />
      {/* <FAQ faqs={staticData.Security_Features.SecurityFeatures.FAQData.faqs} /> */}
    </>
  );
};

export default FecurityFeaturesPage;
