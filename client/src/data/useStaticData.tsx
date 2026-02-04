import { useTranslation } from '@/contexts/TranslationContext';
import React from 'react';

import {
  BookOpen,
  BrainCog,
  Gift,
  GraduationCap,
  HelpCircle,
  LifeBuoy,
  Sprout,
  Star,
  Tag,
  Wrench,
} from 'lucide-react';
import { BiWorld } from 'react-icons/bi';
import { BsGlobeEuropeAfrica, BsPassport } from 'react-icons/bs';
import { CiSearch } from 'react-icons/ci';
import {
  FaBuilding,
  FaCalculator,
  FaCompass,
  FaMobile,
  FaRegBuilding,
  FaRocket,
  FaSeedling,
  FaShield,
  FaSimCard,
} from 'react-icons/fa6';
import { GoPackage } from 'react-icons/go';
import { GrStatusGood } from 'react-icons/gr';
import { IoMdDownload } from 'react-icons/io';
import {
  MdAttachMoney,
  MdDataSaverOff,
  MdModeStandby,
  MdOutlinePolicy,
  MdOutlinePrivacyTip,
  MdOutlineSimCard,
  MdOutlineSupportAgent,
} from 'react-icons/md';
import { RiBloggerFill } from 'react-icons/ri';
import { TbDeviceUnknown } from 'react-icons/tb';

const useStaticData = () => {
  const { t } = useTranslation();
  const staticData = {
    heroSecData: {
      title: 'Affordable eSIM data for international travel',
      image: '/images/New_hero.png',
    },
    HowWorksteps: [
      {
        number: 1,
        title: 'Choose a Plan',
        description: 'Pick the data plan you need for your trip.',
        image: '/images/hwo-work-step/Group3.png',
      },
      {
        number: 2,
        title: 'Scan & Activate',
        description: 'Receive a QR code, scan it, and your eSIM is instantly installed.',
        image: '/images/hwo-work-step/Group4.png',
      },
      {
        number: 3,
        title: 'Start Browsing',
        description: 'Your plan activates automatically when you land, no SIM swapping needed.',
        image: '/images/hwo-work-step/Frame_3.png',
      },
    ],
    WhyChoosefeatures: [
      {
        icon: '/images/why-choose/w1.png',
        title: 'Retain your WhatsApp number',
        description: 'You will only get mobile data and keep your original phone number.',
      },
      {
        icon: '/images/why-choose/w2.png',
        title: 'Flexible Data Plans',
        description:
          'Only traveling for a week? Skip the monthly plan—grab a 7-day pack and get just the data you need!',
      },
      {
        icon: '/images/why-choose/w3.png',
        title: 'Purchase Once, Top Up Anytime',
        description:
          'Out of data but need more right away? Top up anytime with extra GB—no need to extend your plan!',
      },
      {
        icon: '/images/why-choose/w4.png',
        title: 'Avoid high roaming charges',
        description:
          'Choose an eSIM plan tailored to your needs, connect with local carriers, and take charge of your bills!',
      },
    ],
    BuilderFeatures: {
      secTitle: 'How to Buy & Use eSIM',
      secData: [
        {
          title: 'Choose Your eSIM Plan',
          subtitle: 'Find the perfect plan for your journey',
          rightSec: [
            {
              image: {
                src: '/images/timeline/setup1.png',
                alt: 'Choose eSIM plan',
              },
              detils: [
                'Select your destination country or region',
                'Choose from flexible data plans for short or long trips',
                'Clear pricing with no hidden charges',
                'Works with all eSIM-compatible devices',
              ],
              buttonInfo: {
                title: 'Explore Plans',
                herf: '#plans',
              },
            },
          ],
        },

        {
          title: 'Complete Secure Payment',
          subtitle: 'Fast and safe checkout process',
          rightSec: [
            {
              image: {
                src: '/images/timeline/setup2.png',
                alt: 'Secure payment for eSIM',
              },
              detils: [
                'Pay using debit card, credit card, UPI, or wallets',
                '100% secure and encrypted transactions',
                'Instant order confirmation after payment',
                'No physical SIM or delivery required',
              ],
              buttonInfo: {
                title: 'Proceed to Payment',
                herf: '#payment',
              },
            },
          ],
        },

        {
          title: 'Receive Your eSIM Instantly',
          subtitle: 'No waiting, no shipping',
          rightSec: [
            {
              image: {
                src: '/images/timeline/setup3.png',
                alt: 'Instant eSIM delivery',
              },
              detils: [
                'Receive your eSIM QR code instantly after purchase',
                'Access eSIM details via email and dashboard',
                'Includes manual installation instructions',
                'Ready to install anytime before your trip',
              ],
              buttonInfo: {
                title: 'View eSIM Details',
                herf: '#esim-details',
              },
            },
          ],
        },

        {
          title: 'Install eSIM on Your Device',
          subtitle: 'Setup in just a few minutes',
          rightSec: [
            {
              image: {
                src: '/images/timeline/setup4.png',
                alt: 'Install eSIM on device',
              },
              detils: [
                'Scan the QR code using your smartphone',
                'Follow simple on-screen installation steps',
                'Takes less than 2 minutes to complete',
                'Wi-Fi connection required during installation',
              ],
              buttonInfo: {
                title: 'Installation Guide',
                herf: '#installation',
              },
            },
          ],
        },

        {
          title: 'Activate & Start Using',
          subtitle: 'Stay connected wherever you travel',
          rightSec: [
            {
              image: {
                src: '/images/timeline/setup5.png',
                alt: 'Activate and use eSIM',
              },
              detils: [
                'Automatic activation on arrival at destination',
                'Enjoy high-speed mobile data instantly',
                'No roaming charges or SIM swapping',
                'Reliable connectivity across multiple networks',
              ],
              buttonInfo: {
                title: 'Start Using eSIM',
                herf: '#activate',
              },
            },
          ],
        },
      ],
    },
    DowonloadEsim: {
      setupTabs: [
        {
          label: t('NewSimfinDes.download_esim_app.DowonloadEsim.setupTabs.0.label'),
          title: t('NewSimfinDes.download_esim_app.DowonloadEsim.setupTabs.0.title'),
          steps: [
            {
              number: '1',
              stepTitle: t(
                'NewSimfinDes.download_esim_app.DowonloadEsim.setupTabs.0.steps.0.stepTitle',
              ),
              description: t(
                'NewSimfinDes.download_esim_app.DowonloadEsim.setupTabs.0.steps.0.description',
              ),
              // image: '/images/download-app/card-choose-data-plan (1).svg'
              image: '/images/setupStep/step1.png',
            },
            {
              number: '2',
              stepTitle: t(
                'NewSimfinDes.download_esim_app.DowonloadEsim.setupTabs.0.steps.1.stepTitle',
              ),
              description: t(
                'NewSimfinDes.download_esim_app.DowonloadEsim.setupTabs.0.steps.1.description',
              ),
              // image: '/images/whatEsim/card-setup-instructions.svg'
              image: '/images/setupStep/step2.png',
            },
            {
              number: '3',
              stepTitle: t(
                'NewSimfinDes.download_esim_app.DowonloadEsim.setupTabs.0.steps.2.stepTitle',
              ),
              description: t(
                'NewSimfinDes.download_esim_app.DowonloadEsim.setupTabs.0.steps.2.description',
              ),
              // image: '/images/whatEsim/card-activate-plan.svg'
              image: '/images/setupStep/step3.png',
            },
          ],
          instructions: {
            heading: t(
              'NewSimfinDes.download_esim_app.DowonloadEsim.setupTabs.0.instructions.heading',
            ),
            steps: [
              t('NewSimfinDes.download_esim_app.DowonloadEsim.setupTabs.0.instructions.steps.0'),
              t('NewSimfinDes.download_esim_app.DowonloadEsim.setupTabs.0.instructions.steps.1'),
              t('NewSimfinDes.download_esim_app.DowonloadEsim.setupTabs.0.instructions.steps.2'),
              t('NewSimfinDes.download_esim_app.DowonloadEsim.setupTabs.0.instructions.steps.3'),
            ],
          },
        },
        {
          label: t('NewSimfinDes.download_esim_app.DowonloadEsim.setupTabs.1.label'),
          title: t('NewSimfinDes.download_esim_app.DowonloadEsim.setupTabs.1.title'),
          steps: [
            {
              number: '1',
              stepTitle: t(
                'NewSimfinDes.download_esim_app.DowonloadEsim.setupTabs.1.steps.0.stepTitle',
              ),
              description: t(
                'NewSimfinDes.download_esim_app.DowonloadEsim.setupTabs.1.steps.0.description',
              ),
              // image: '/images/download-app/card-choose-data-plan (1).svg'
              image: '/images/setupStep/step1.png',
            },
            {
              number: '2',
              stepTitle: t(
                'NewSimfinDes.download_esim_app.DowonloadEsim.setupTabs.1.steps.1.stepTitle',
              ),
              description: t(
                'NewSimfinDes.download_esim_app.DowonloadEsim.setupTabs.1.steps.1.description',
              ),
              // image: '/images/download-app/card-download-esim-app.svg'
              image: '/images/setupStep/step2.png',
            },
            {
              number: '3',
              stepTitle: t(
                'NewSimfinDes.download_esim_app.DowonloadEsim.setupTabs.1.steps.2.stepTitle',
              ),
              description: t(
                'NewSimfinDes.download_esim_app.DowonloadEsim.setupTabs.1.steps.2.description',
              ),
              // image: '/images/whatEsim/card-activate-plan.svg'
              image: '/images/setupStep/step3.png',
            },
          ],
          instructions: {
            heading: t(
              'NewSimfinDes.download_esim_app.DowonloadEsim.setupTabs.1.instructions.heading',
            ),
            steps: [
              t('NewSimfinDes.download_esim_app.DowonloadEsim.setupTabs.1.instructions.steps.0'),
              t('NewSimfinDes.download_esim_app.DowonloadEsim.setupTabs.1.instructions.steps.1'),
              t('NewSimfinDes.download_esim_app.DowonloadEsim.setupTabs.1.instructions.steps.2'),
              t('NewSimfinDes.download_esim_app.DowonloadEsim.setupTabs.1.instructions.steps.3'),
            ],
          },
        },
      ],
      FAQData: {
        title: t('NewSimfinDes.download_esim_app.DowonloadEsim.FAQData.title'),
        faqs: [
          {
            id: 'faq-1',
            question: t('NewSimfinDes.download_esim_app.DowonloadEsim.FAQData.faqs.0.question'),
            answer: t('NewSimfinDes.download_esim_app.DowonloadEsim.FAQData.faqs.0.answer'),
          },
          {
            id: 'faq-2',
            question: t('NewSimfinDes.download_esim_app.DowonloadEsim.FAQData.faqs.1.question'),
            answer: t('NewSimfinDes.download_esim_app.DowonloadEsim.FAQData.faqs.1.answer'),
          },
          {
            id: 'faq-3',
            question: t('NewSimfinDes.download_esim_app.DowonloadEsim.FAQData.faqs.2.question'),
            answer: t('NewSimfinDes.download_esim_app.DowonloadEsim.FAQData.faqs.2.answer'),
          },
          {
            id: 'faq-4',
            question: t('NewSimfinDes.download_esim_app.DowonloadEsim.FAQData.faqs.3.question'),
            answer: t('NewSimfinDes.download_esim_app.DowonloadEsim.FAQData.faqs.3.answer'),
          },
          {
            id: 'faq-5',
            question: t('NewSimfinDes.download_esim_app.DowonloadEsim.FAQData.faqs.4.question'),
            answer: t('NewSimfinDes.download_esim_app.DowonloadEsim.FAQData.faqs.4.answer'),
          },
          {
            id: 'faq-6',
            question: t('NewSimfinDes.download_esim_app.DowonloadEsim.FAQData.faqs.5.question'),
            answer: t('NewSimfinDes.download_esim_app.DowonloadEsim.FAQData.faqs.5.answer'),
          },
          {
            id: 'faq-7',
            question: t('NewSimfinDes.download_esim_app.DowonloadEsim.FAQData.faqs.6.question'),
            answer: t('NewSimfinDes.download_esim_app.DowonloadEsim.FAQData.faqs.6.answer'),
          },
          {
            id: 'faq-8',
            question: t('NewSimfinDes.download_esim_app.DowonloadEsim.FAQData.faqs.7.question'),
            answer: t('NewSimfinDes.download_esim_app.DowonloadEsim.FAQData.faqs.7.answer'),
          },
        ],
      },
    },
    Security_Features: {
      heroSec: {
        title: t('NewSimfinDes.Security_Features.heroSec.title'),
        des: t('NewSimfinDes.Security_Features.heroSec.description'),
      },
      Safe_travels: {
        title: t('NewSimfinDes.Security_Features.Safe_travels.title'),
        description: t('NewSimfinDes.Security_Features.Safe_travels.description'),
      },

      Left_rightImage: {
        virtualLocation: {
          subtitle: t('NewSimfinDes.Security_Features.Left_rightImage.virtualLocation.subtitle'),
          title: t('NewSimfinDes.Security_Features.Left_rightImage.virtualLocation.title'),
          description: t(
            'NewSimfinDes.Security_Features.Left_rightImage.virtualLocation.description',
          ),
          benefits: [
            {
              text: t(
                'NewSimfinDes.Security_Features.Left_rightImage.virtualLocation.benefits.0.text',
              ),
            },
            {
              text: t(
                'NewSimfinDes.Security_Features.Left_rightImage.virtualLocation.benefits.1.text',
              ),
            },
            {
              text: t(
                'NewSimfinDes.Security_Features.Left_rightImage.virtualLocation.benefits.2.text',
              ),
            },
          ],
          imageSrc: '/images/features/sf-virtual-location.webp',
          imageAlt: t('NewSimfinDes.Security_Features.Left_rightImage.virtualLocation.imageAlt'),
          imagePosition: 'left',
        },
        adBlocker: {
          subtitle: t('NewSimfinDes.Security_Features.Left_rightImage.adBlocker.subtitle'),
          title: t('NewSimfinDes.Security_Features.Left_rightImage.adBlocker.title'),
          description: t('NewSimfinDes.Security_Features.Left_rightImage.adBlocker.description'),
          benefits: [
            {
              text: t('NewSimfinDes.Security_Features.Left_rightImage.adBlocker.benefits.0.text'),
            },
            {
              text: t('NewSimfinDes.Security_Features.Left_rightImage.adBlocker.benefits.1.text'),
            },
            {
              text: t('NewSimfinDes.Security_Features.Left_rightImage.adBlocker.benefits.2.text'),
            },
          ],
          imageSrc: '/images/features/sf-ad-blocker-lp.webp',
          imageAlt: t('NewSimfinDes.Security_Features.Left_rightImage.adBlocker.imageAlt'),
          imagePosition: 'right',
        },
        webProtection: {
          subtitle: t('NewSimfinDes.Security_Features.Left_rightImage.webProtection.subtitle'),
          title: t('NewSimfinDes.Security_Features.Left_rightImage.webProtection.title'),
          description: t(
            'NewSimfinDes.Security_Features.Left_rightImage.webProtection.description',
          ),
          benefits: [
            {
              text: t(
                'NewSimfinDes.Security_Features.Left_rightImage.webProtection.benefits.0.text',
              ),
            },
            {
              text: t(
                'NewSimfinDes.Security_Features.Left_rightImage.webProtection.benefits.1.text',
              ),
            },
            {
              text: t(
                'NewSimfinDes.Security_Features.Left_rightImage.webProtection.benefits.2.text',
              ),
            },
          ],
          imageSrc: '/images/features/sf-web-protection-lp.webp',
          imageAlt: t('NewSimfinDes.Security_Features.Left_rightImage.webProtection.imageAlt'),
          imagePosition: 'left',
        },
        support24x7: {
          heading: t('NewSimfinDes.Security_Features.Left_rightImage.support24x7.heading'),
          description: t('NewSimfinDes.Security_Features.Left_rightImage.support24x7.description'),
          button: {
            text: t('NewSimfinDes.Security_Features.Left_rightImage.support24x7.button.text'),
            href: t('NewSimfinDes.Security_Features.Left_rightImage.support24x7.button.href'),
            variant: 'white',
          },
          contentAlignment: 'start',
          backgroundColor: 'bg-[#f7f7f8]',
          textColor: 'text-gray-900',
        },
      },
      valuesConfig: {
        title: t('NewSimfinDes.Security_Features.SecurityFeaturesValues.title'),
        subtitle: t('NewSimfinDes.SingleCountryPlan.ValuesSectionCommon.subtitle'),
        backgroundColor: 'bg-black',
        textColor: 'text-white',
        theme: 'light' as const,
        iconSize: 35,
        descriptionTextColor: 'text-gray-300',
        iconColor: 'text-themeYellow',
        buttonBorderColor: 'border-white',
        buttonHoverBgColor: 'hover:bg-white',
        buttonHoverTextColor: 'hover:text-black',
        gridCols: 3,
        values: [
          {
            id: 1,
            iconComponent: <CiSearch />,
            title: t('NewSimfinDes.Security_Features.SecurityFeaturesValues.values.0.title'),
            description: t(
              'NewSimfinDes.Security_Features.SecurityFeaturesValues.values.0.description',
            ),
          },
          {
            id: 2,
            iconComponent: <FaSimCard />,
            title: t('NewSimfinDes.Security_Features.SecurityFeaturesValues.values.1.title'),
            description: t(
              'NewSimfinDes.Security_Features.SecurityFeaturesValues.values.1.description',
            ),
          },
          {
            id: 3,
            iconComponent: <GrStatusGood />,
            title: t('NewSimfinDes.Security_Features.SecurityFeaturesValues.values.2.title'),
            description: t(
              'NewSimfinDes.Security_Features.SecurityFeaturesValues.values.2.description',
            ),
          },
          {
            id: 4,
            iconComponent: <FaSeedling />,
            title: t('NewSimfinDes.Security_Features.SecurityFeaturesValues.values.3.title'),
            description: t(
              'NewSimfinDes.Security_Features.SecurityFeaturesValues.values.3.description',
            ),
          },
          {
            id: 5,
            iconComponent: <FaCompass />,
            title: t('NewSimfinDes.Security_Features.SecurityFeaturesValues.values.4.title'),
            description: t(
              'NewSimfinDes.Security_Features.SecurityFeaturesValues.values.4.description',
            ),
          },
          {
            id: 6,
            iconComponent: <FaRocket />,
            title: t('NewSimfinDes.Security_Features.SecurityFeaturesValues.values.5.title'),
            description: t(
              'NewSimfinDes.Security_Features.SecurityFeaturesValues.values.5.description',
            ),
          },
        ],
      },
      SecurityFeatures: {
        FAQData: {
          title: t('NewSimfinDes.Security_Features.SecurityFeatures.FAQData.title'),
          faqs: [
            {
              id: 'faq-1',
              question: t(
                'NewSimfinDes.Security_Features.SecurityFeatures.FAQData.faqs.0.question',
              ),
              answer: t('NewSimfinDes.Security_Features.SecurityFeatures.FAQData.faqs.0.answer'),
            },
            {
              id: 'faq-2',
              question: t(
                'NewSimfinDes.Security_Features.SecurityFeatures.FAQData.faqs.1.question',
              ),
              answer: t('NewSimfinDes.Security_Features.SecurityFeatures.FAQData.faqs.1.answer'),
            },
            {
              id: 'faq-3',
              question: t(
                'NewSimfinDes.Security_Features.SecurityFeatures.FAQData.faqs.2.question',
              ),
              answer: t('NewSimfinDes.Security_Features.SecurityFeatures.FAQData.faqs.2.answer'),
            },
            {
              id: 'faq-4',
              question: t(
                'NewSimfinDes.Security_Features.SecurityFeatures.FAQData.faqs.3.question',
              ),
              answer: t('NewSimfinDes.Security_Features.SecurityFeatures.FAQData.faqs.3.answer'),
            },
            {
              id: 'faq-5',
              question: t(
                'NewSimfinDes.Security_Features.SecurityFeatures.FAQData.faqs.4.question',
              ),
              answer: t('NewSimfinDes.Security_Features.SecurityFeatures.FAQData.faqs.4.answer'),
            },
            {
              id: 'faq-6',
              question: t(
                'NewSimfinDes.Security_Features.SecurityFeatures.FAQData.faqs.5.question',
              ),
              answer: t('NewSimfinDes.Security_Features.SecurityFeatures.FAQData.faqs.5.answer'),
            },
            {
              id: 'faq-7',
              question: t(
                'NewSimfinDes.Security_Features.SecurityFeatures.FAQData.faqs.6.question',
              ),
              answer: t('NewSimfinDes.Security_Features.SecurityFeatures.FAQData.faqs.6.answer'),
            },
            {
              id: 'faq-8',
              question: t(
                'NewSimfinDes.Security_Features.SecurityFeatures.FAQData.faqs.7.question',
              ),
              answer: t('NewSimfinDes.Security_Features.SecurityFeatures.FAQData.faqs.7.answer'),
            },
          ],
        },
      },
    },
    WhatIsEsim: {
      setUpEsim: [
        {
          label: t('NewSimfinDes.what_is_esim.WhatIsEsim.setUpEsim.0.label'),
          title: t('NewSimfinDes.what_is_esim.WhatIsEsim.setUpEsim.0.title'),
          steps: [
            {
              number: '1',
              stepTitle: t('NewSimfinDes.what_is_esim.WhatIsEsim.setUpEsim.0.steps.0.stepTitle'),
              description: t(
                'NewSimfinDes.what_is_esim.WhatIsEsim.setUpEsim.0.steps.0.description',
              ),
              image: '/images/setupStep/step1.png',
            },
            {
              number: '2',
              stepTitle: t('NewSimfinDes.what_is_esim.WhatIsEsim.setUpEsim.0.steps.1.stepTitle'),
              description: t(
                'NewSimfinDes.what_is_esim.WhatIsEsim.setUpEsim.0.steps.1.description',
              ),
              // image: '/images/2-step.svg'
              image: '/images/setupStep/step2.png',
            },
            {
              number: '3',
              stepTitle: t('NewSimfinDes.what_is_esim.WhatIsEsim.setUpEsim.0.steps.2.stepTitle'),
              description: t(
                'NewSimfinDes.what_is_esim.WhatIsEsim.setUpEsim.0.steps.2.description',
              ),
              // image: '/images/3-step.svg'
              image: '/images/setupStep/step3.png',
            },
          ],
          instructions: {
            heading: t('NewSimfinDes.what_is_esim.WhatIsEsim.setUpEsim.0.instructions.heading'),
            steps: [
              t('NewSimfinDes.what_is_esim.WhatIsEsim.setUpEsim.0.instructions.steps.0'),
              t('NewSimfinDes.what_is_esim.WhatIsEsim.setUpEsim.0.instructions.steps.1'),
              t('NewSimfinDes.what_is_esim.WhatIsEsim.setUpEsim.0.instructions.steps.2'),
              t('NewSimfinDes.what_is_esim.WhatIsEsim.setUpEsim.0.instructions.steps.3'),
            ],
          },
        },
        {
          label: t('NewSimfinDes.what_is_esim.WhatIsEsim.setUpEsim.1.label'),
          title: t('NewSimfinDes.what_is_esim.WhatIsEsim.setUpEsim.1.title'),
          steps: [
            {
              number: '1',
              stepTitle: t('NewSimfinDes.what_is_esim.WhatIsEsim.setUpEsim.1.steps.0.stepTitle'),
              description: t(
                'NewSimfinDes.what_is_esim.WhatIsEsim.setUpEsim.1.steps.0.description',
              ),
              // image: '/images/whatEsim/card-choose-data-plan.svg'
              image: '/images/setupStep/step1.png',
            },
            {
              number: '2',
              stepTitle: t('NewSimfinDes.what_is_esim.WhatIsEsim.setUpEsim.1.steps.1.stepTitle'),
              description: t(
                'NewSimfinDes.what_is_esim.WhatIsEsim.setUpEsim.1.steps.1.description',
              ),
              // image: '/images/whatEsim/card-setup-instructions.svg'
              image: '/images/setupStep/step2.png',
            },
            {
              number: '3',
              stepTitle: t('NewSimfinDes.what_is_esim.WhatIsEsim.setUpEsim.1.steps.2.stepTitle'),
              description: t(
                'NewSimfinDes.what_is_esim.WhatIsEsim.setUpEsim.1.steps.2.description',
              ),
              // image: '/images/whatEsim/card-activate-plan.svg'
              image: '/images/setupStep/step3.png',
            },
          ],
          instructions: {
            heading: t('NewSimfinDes.what_is_esim.WhatIsEsim.setUpEsim.1.instructions.heading'),
            steps: [
              t('NewSimfinDes.what_is_esim.WhatIsEsim.setUpEsim.1.instructions.steps.0'),
              t('NewSimfinDes.what_is_esim.WhatIsEsim.setUpEsim.1.instructions.steps.1'),
              t('NewSimfinDes.what_is_esim.WhatIsEsim.setUpEsim.1.instructions.steps.2'),
              t('NewSimfinDes.what_is_esim.WhatIsEsim.setUpEsim.1.instructions.steps.3'),
            ],
          },
        },
        {
          label: t('NewSimfinDes.what_is_esim.WhatIsEsim.setUpEsim.2.label'),
          title: t('NewSimfinDes.what_is_esim.WhatIsEsim.setUpEsim.2.title'),
          steps: [
            {
              number: '1',
              stepTitle: t('NewSimfinDes.what_is_esim.WhatIsEsim.setUpEsim.2.steps.0.stepTitle'),
              description: t(
                'NewSimfinDes.what_is_esim.WhatIsEsim.setUpEsim.2.steps.0.description',
              ),
            },
            {
              number: '2',
              stepTitle: t('NewSimfinDes.what_is_esim.WhatIsEsim.setUpEsim.2.steps.1.stepTitle'),
              description: t(
                'NewSimfinDes.what_is_esim.WhatIsEsim.setUpEsim.2.steps.1.description',
              ),
            },
            {
              number: '3',
              stepTitle: t('NewSimfinDes.what_is_esim.WhatIsEsim.setUpEsim.2.steps.2.stepTitle'),
              description: t(
                'NewSimfinDes.what_is_esim.WhatIsEsim.setUpEsim.2.steps.2.description',
              ),
            },
          ],
        },
      ],
      FAQData: {
        title: t('NewSimfinDes.what_is_esim.WhatIsEsim.FAQData.title'),
        faqs: [
          {
            id: 'faq-1',
            question: t('NewSimfinDes.what_is_esim.WhatIsEsim.FAQData.faqs.0.question'),
            answer: t('NewSimfinDes.what_is_esim.WhatIsEsim.FAQData.faqs.0.answer'),
          },
          {
            id: 'faq-2',
            question: t('NewSimfinDes.what_is_esim.WhatIsEsim.FAQData.faqs.1.question'),
            answer: t('NewSimfinDes.what_is_esim.WhatIsEsim.FAQData.faqs.1.answer'),
          },
          {
            id: 'faq-3',
            question: t('NewSimfinDes.what_is_esim.WhatIsEsim.FAQData.faqs.2.question'),
            answer: t('NewSimfinDes.what_is_esim.WhatIsEsim.FAQData.faqs.2.answer'),
          },
          {
            id: 'faq-4',
            question: t('NewSimfinDes.what_is_esim.WhatIsEsim.FAQData.faqs.3.question'),
            answer: t('NewSimfinDes.what_is_esim.WhatIsEsim.FAQData.faqs.3.answer'),
          },
          {
            id: 'faq-5',
            question: t('NewSimfinDes.what_is_esim.WhatIsEsim.FAQData.faqs.4.question'),
            answer: t('NewSimfinDes.what_is_esim.WhatIsEsim.FAQData.faqs.4.answer'),
          },
          {
            id: 'faq-6',
            question: t('NewSimfinDes.what_is_esim.WhatIsEsim.FAQData.faqs.5.question'),
            answer: t('NewSimfinDes.what_is_esim.WhatIsEsim.FAQData.faqs.5.answer'),
          },
          {
            id: 'faq-7',
            question: t('NewSimfinDes.what_is_esim.WhatIsEsim.FAQData.faqs.6.question'),
            answer: t('NewSimfinDes.what_is_esim.WhatIsEsim.FAQData.faqs.6.answer'),
          },
          {
            id: 'faq-8',
            question: t('NewSimfinDes.what_is_esim.WhatIsEsim.FAQData.faqs.7.question'),
            answer: t('NewSimfinDes.what_is_esim.WhatIsEsim.FAQData.faqs.7.answer'),
          },
          {
            id: 'faq-9',
            question: t('NewSimfinDes.what_is_esim.WhatIsEsim.FAQData.faqs.8.question'),
            answer: t('NewSimfinDes.what_is_esim.WhatIsEsim.FAQData.faqs.8.answer'),
          },
          {
            id: 'faq-10',
            question: t('NewSimfinDes.what_is_esim.WhatIsEsim.FAQData.faqs.9.question'),
            answer: t('NewSimfinDes.what_is_esim.WhatIsEsim.FAQData.faqs.9.answer'),
          },
        ],
      },
    },
    NavbarData: {
      rouceMegaMenuConfig: {
        columns: [
          {
            title: 'Get Started',
            items: [
              {
                label: 'What is an eSIM?',
                href: '/what-is-esim',
                icon: <MdOutlineSimCard className="h-5 w-5" />,
                description: 'Learn everything about eSIM technology and how it works',
                badge: 'New',
              },
              {
                label: 'How It Works',
                href: '/about-us',
                icon: <TbDeviceUnknown className="h-5 w-5" />,
                description: 'Step-by-step guide to setup your first eSIM',
                badge: 'Guide',
              },
              {
                label: 'Security Features',
                href: '/security-features',
                icon: <FaShield className="h-5 w-5" />,
                description: 'Advanced encryption and privacy protection',
              },
              {
                label: 'For Business',
                href: '/esim-for-business',
                icon: <FaBuilding className="h-5 w-5" />,
                description: 'Enterprise solutions for teams and companies',
              },
            ],
          },
          {
            title: 'Support & Resources',
            items: [
              {
                label: 'Supported Devices',
                href: '/esim-supported-devices',
                icon: <MdOutlineSupportAgent className="h-5 w-5" />,
                description: 'Check if your device supports eSIM technology',
              },
              {
                label: 'Download App',
                href: '/download-esim-app',
                icon: <IoMdDownload className="h-5 w-5" />,
                description: 'Get our mobile app for easy eSIM management',
              },
              {
                label: 'Blog & Guides',
                href: '/blog',
                icon: <RiBloggerFill className="h-5 w-5" />,
                description: 'Travel tips, tech guides and latest updates',
              },
              {
                label: 'Careers',
                href: '/career',
                icon: <Sprout className="h-5 w-5" />,
                description: 'Join our team and build the future of connectivity',
              },
              {
                label: 'Customer Reviews',
                href: '/review',
                icon: <Star className="h-5 w-5" />,
                description: 'Read what travelers say about our service',
              },
            ],
          },
        ],
        slider: {
          title: 'Explore Popular Destinations',
          items: [
            {
              id: 1,
              title: 'Unlimited Europe',
              description: 'Stay connected across 40+ countries with unlimited data',
              image: '/images/menu-images/mega-menu-explore1.png',
              href: '/ultra-plan',
            },
            {
              id: 2,
              title: 'Asia Explorer',
              description: 'Perfect plan for Southeast Asia adventures',
              image: '/images/menu-images/mega-menu-explore2.png',
              href: '/security-features',
            },
            {
              id: 3,
              title: 'USA & Canada',
              description: 'High-speed data across North America',
              image: '/images/menu-images/mega-menu-explore3.png',
              href: '/security-features',
            },
          ],
        },
      },

      productMegaMenuConfig: {
        columns: [
          {
            title: t('NewSimfinDes.NavbarData.productMegaMenuConfig.columns.0.title'),
            items: [
              {
                label: t('NewSimfinDes.NavbarData.productMegaMenuConfig.columns.0.items.0.label'),
                href: '/all-destinations',
                description: t(
                  'NewSimfinDes.NavbarData.productMegaMenuConfig.columns.0.items.0.description',
                ),
                icon: <MdModeStandby className="h-5 w-5" />,
              },
              {
                label: t('NewSimfinDes.NavbarData.productMegaMenuConfig.columns.0.items.1.label'),
                href: '/all-packages',
                description: t(
                  'NewSimfinDes.NavbarData.productMegaMenuConfig.columns.0.items.1.description',
                ),
                icon: <GoPackage className="h-5 w-5" />,
              },
              {
                label: t('NewSimfinDes.NavbarData.productMegaMenuConfig.columns.0.items.2.label'),
                href: '/country-plan',
                description: t(
                  'NewSimfinDes.NavbarData.productMegaMenuConfig.columns.0.items.2.description',
                ),
                icon: <BiWorld className="h-5 w-5" />,
              },
              {
                label: t('NewSimfinDes.NavbarData.productMegaMenuConfig.columns.0.items.3.label'),
                href: '/region-plan',
                description: t(
                  'NewSimfinDes.NavbarData.productMegaMenuConfig.columns.0.items.3.description',
                ),
                icon: <BsGlobeEuropeAfrica className="h-5 w-5" />,
              },
              {
                label: t('NewSimfinDes.NavbarData.productMegaMenuConfig.columns.0.items.4.label'),
                href: '/region-plan',
                description: t(
                  'NewSimfinDes.NavbarData.productMegaMenuConfig.columns.0.items.4.description',
                ),
                icon: <BsPassport className="h-5 w-5" />,
              },
              {
                label: t('NewSimfinDes.NavbarData.productMegaMenuConfig.columns.0.items.5.label'),
                href: '/region-plan',
                description: t(
                  'NewSimfinDes.NavbarData.productMegaMenuConfig.columns.0.items.5.description',
                ),
                icon: <FaRegBuilding className="h-5 w-5" />,
              },
              {
                label: t('NewSimfinDes.NavbarData.productMegaMenuConfig.columns.0.items.6.label'),
                href: '/region-plan',
                description: t(
                  'NewSimfinDes.NavbarData.productMegaMenuConfig.columns.0.items.6.description',
                ),
                icon: <BrainCog className="h-5 w-5" />,
              },
            ],
          },
          {
            title: t('NewSimfinDes.NavbarData.productMegaMenuConfig.columns.1.title'),
            items: [
              {
                label: t('NewSimfinDes.NavbarData.productMegaMenuConfig.columns.1.items.0.label'),
                href: '/privacy-policy',
                description: t(
                  'NewSimfinDes.NavbarData.productMegaMenuConfig.columns.1.items.0.description',
                ),
                icon: <MdOutlinePrivacyTip className="h-5 w-5" />,
              },
              {
                label: t('NewSimfinDes.NavbarData.productMegaMenuConfig.columns.1.items.1.label'),
                href: '/terms-and-conditions',
                description: t(
                  'NewSimfinDes.NavbarData.productMegaMenuConfig.columns.1.items.1.description',
                ),
                icon: <MdOutlinePolicy className="h-5 w-5" />,
              },
              {
                label: t('NewSimfinDes.NavbarData.productMegaMenuConfig.columns.1.items.2.label'),
                href: '/terms-and-conditions',
                description: t(
                  'NewSimfinDes.NavbarData.productMegaMenuConfig.columns.1.items.2.description',
                ),
                icon: <MdDataSaverOff className="h-5 w-5" />,
              },
              {
                label: t('NewSimfinDes.NavbarData.productMegaMenuConfig.columns.1.items.3.label'),
                href: '/terms-and-conditions',
                description: t(
                  'NewSimfinDes.NavbarData.productMegaMenuConfig.columns.1.items.3.description',
                ),
                icon: <MdAttachMoney className="h-5 w-5" />,
              },
            ],
          },
        ],
        slider: {
          title: t('NewSimfinDes.NavbarData.productMegaMenuConfig.slider.title'),
          items: [
            {
              id: 1,
              title: t('NewSimfinDes.NavbarData.rourceMegaMenuConfig.slider.items.0.title'),
              description: t(
                'NewSimfinDes.NavbarData.rourceMegaMenuConfig.slider.items.0.description',
              ),
              image: '/images/menu-images/mega-menu-explore1.png',
              // image: 'https://placehold.co/800x800.png',
              href: '/ultra-plan',
            },
            {
              id: 2,
              title: t('NewSimfinDes.NavbarData.rourceMegaMenuConfig.slider.items.1.title'),
              description: t(
                'NewSimfinDes.NavbarData.rourceMegaMenuConfig.slider.items.1.description',
              ),
              image: '/images/menu-images/mega-menu-explore2.png',
              // image: 'https://placehold.co/800x800.png',
              href: '/security-features',
            },
            {
              id: 3,
              title: t('NewSimfinDes.NavbarData.rourceMegaMenuConfig.slider.items.2.title'),
              description: t(
                'NewSimfinDes.NavbarData.rourceMegaMenuConfig.slider.items.2.description',
              ),
              image: '/images/menu-images/mega-menu-explore3.png',
              // image: 'https://placehold.co/800x800.png',
              href: '/security-features',
            },
          ],
        },
      },
      offersMegaMenuConfig: {
        see_pack: t('NewSimfinDes.NavbarData.offersMegaMenuConfig.see_pack'),
        label: t('NewSimfinDes.NavbarData.offersMegaMenuConfig.label'),
        badge: t('NewSimfinDes.NavbarData.offersMegaMenuConfig.badge'),
        columns: [
          {
            title: t('NewSimfinDes.NavbarData.offersMegaMenuConfig.columns.0.title'),
            items: [
              {
                label: t('NewSimfinDes.NavbarData.offersMegaMenuConfig.columns.0.items.0.label'),
                href: '/refer-friend',
                description: t(
                  'NewSimfinDes.NavbarData.offersMegaMenuConfig.columns.0.items.0.description',
                ),
                icon: <Gift className="h-5 w-5" />,
                badge: 'Hot',
              },
              {
                label: t('NewSimfinDes.NavbarData.offersMegaMenuConfig.columns.0.items.1.label'),
                href: '/student-offer',
                description: t(
                  'NewSimfinDes.NavbarData.offersMegaMenuConfig.columns.0.items.1.description',
                ),
                icon: <GraduationCap className="h-5 w-5" />,
                badge: 'New',
              },
              {
                label: t('NewSimfinDes.NavbarData.offersMegaMenuConfig.columns.0.items.2.label'),
                href: '/deals-rewards',
                description: t(
                  'NewSimfinDes.NavbarData.offersMegaMenuConfig.columns.0.items.2.description',
                ),
                icon: <Tag className="h-5 w-5" />,
              },
            ],
          },
        ],
        slider: {
          title: t('NewSimfinDes.NavbarData.rourceMegaMenuConfig.slider.title'),
          items: [
            {
              id: 1,
              title: t('NewSimfinDes.NavbarData.rourceMegaMenuConfig.slider.items.0.title'),
              description: t(
                'NewSimfinDes.NavbarData.rourceMegaMenuConfig.slider.items.0.description',
              ),
              image: '/images/menu-images/mega-menu-explore1.png',
              // image: 'https://placehold.co/800x800.png',
              href: '/ultra-plan',
            },
            {
              id: 2,
              title: t('NewSimfinDes.NavbarData.rourceMegaMenuConfig.slider.items.1.title'),
              description: t(
                'NewSimfinDes.NavbarData.rourceMegaMenuConfig.slider.items.1.description',
              ),
              image: '/images/menu-images/mega-menu-explore2.png',
              // image: 'https://placehold.co/800x800.png',
              href: '/security-features',
            },
            {
              id: 3,
              title: t('NewSimfinDes.NavbarData.rourceMegaMenuConfig.slider.items.2.title'),
              description: t(
                'NewSimfinDes.NavbarData.rourceMegaMenuConfig.slider.items.2.description',
              ),
              image: '/images/menu-images/mega-menu-explore3.png',
              // image: 'https://placehold.co/800x800.png',
              href: '/security-features',
            },
          ],
        },
      },
      helpMegaMenuConfig: {
        label: t('NewSimfinDes.NavbarData.helpMegaMenuConfig.label'),
        badge: t('NewSimfinDes.NavbarData.helpMegaMenuConfig.badge'),
        columns: [
          {
            title: t('NewSimfinDes.NavbarData.helpMegaMenuConfig.columns.0.title'),
            items: [
              {
                label: t('NewSimfinDes.NavbarData.helpMegaMenuConfig.columns.0.items.0.label'),
                href: '/getting-started',
                description: t(
                  'NewSimfinDes.NavbarData.helpMegaMenuConfig.columns.0.items.0.description',
                ),
                icon: <BookOpen className="h-5 w-5" />,
                badge: 'New',
              },
              {
                label: t('NewSimfinDes.NavbarData.helpMegaMenuConfig.columns.0.items.1.label'),
                href: '/help-center',
                description: t(
                  'NewSimfinDes.NavbarData.helpMegaMenuConfig.columns.0.items.1.description',
                ),
                icon: <LifeBuoy className="h-5 w-5" />,
              },
              {
                label: t('NewSimfinDes.NavbarData.helpMegaMenuConfig.columns.0.items.2.label'),
                href: '/troubleshooting',
                description: t(
                  'NewSimfinDes.NavbarData.helpMegaMenuConfig.columns.0.items.2.description',
                ),
                icon: <Wrench className="h-5 w-5" />,
              },
            ],
          },
          {
            title: t('NewSimfinDes.NavbarData.helpMegaMenuConfig.columns.1.title'),
            items: [
              {
                label: t('NewSimfinDes.NavbarData.helpMegaMenuConfig.columns.1.items.0.label'),
                href: '/faq',
                description: t(
                  'NewSimfinDes.NavbarData.helpMegaMenuConfig.columns.1.items.0.description',
                ),
                icon: <HelpCircle className="h-5 w-5" />,
              },
            ],
          },
        ],
        slider: {
          title: t('NewSimfinDes.NavbarData.rourceMegaMenuConfig.slider.title'),
          items: [
            {
              id: 1,
              title: t('NewSimfinDes.NavbarData.rourceMegaMenuConfig.slider.items.0.title'),
              description: t(
                'NewSimfinDes.NavbarData.rourceMegaMenuConfig.slider.items.0.description',
              ),
              image: '/images/menu-images/mega-menu-explore1.png',
              // image: 'https://placehold.co/800x800.png',
              href: '/ultra-plan',
            },
            {
              id: 2,
              title: t('NewSimfinDes.NavbarData.rourceMegaMenuConfig.slider.items.1.title'),
              description: t(
                'NewSimfinDes.NavbarData.rourceMegaMenuConfig.slider.items.1.description',
              ),
              image: '/images/menu-images/mega-menu-explore2.png',
              // image: 'https://placehold.co/800x800.png',
              href: '/security-features',
            },
            {
              id: 3,
              title: t('NewSimfinDes.NavbarData.rourceMegaMenuConfig.slider.items.2.title'),
              description: t(
                'NewSimfinDes.NavbarData.rourceMegaMenuConfig.slider.items.2.description',
              ),
              image: '/images/menu-images/mega-menu-explore3.png',
              // image: 'https://placehold.co/800x800.png',
              href: '/security-features',
            },
          ],
        },
      },
    },
  };
  return staticData;
};

export default useStaticData;
