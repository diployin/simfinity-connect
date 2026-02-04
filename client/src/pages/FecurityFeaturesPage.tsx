'use client';

import React from 'react';

import CTASection from '@/components/common/CTASection';
import FAQ from '@/components/common/FAQ';
import ImageContentSectionCheckbox from '@/components/common/ImageContentSectionCheckbox';
import ValuesSectionCommon from '@/components/common/ValuesSectionCommon';
import SecurityHeroSection from '@/components/sections/features/SecurityHeroSection';
import DownloadAppSection from '@/components/sections/landing/DownloadAppSection';

import { Globe } from 'lucide-react';
import { MdOutlineBlock, MdOutlinePrivacyTip } from 'react-icons/md';
import useStaticData from '@/data/useStaticData';

const FecurityFeaturesPage = () => {
  const staticData = useStaticData();

  return (
    <>
      <SecurityHeroSection />
      <section className="w-full bg-white py-8 sm:pt-10 lg:py-12">
        <div className="containers mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-16">
            {/* Left Column - Title */}
            <div>
              <h2 className="lg:text-4.5xl text-center text-4xl leading-tight font-medium text-gray-900 sm:text-5xl md:text-start">
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
      <ValuesSectionCommon config={staticData.Security_Features.valuesConfig} />
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
      <FAQ faqs={staticData.Security_Features.SecurityFeatures.FAQData.faqs} />
    </>
  );
};

export default FecurityFeaturesPage;
