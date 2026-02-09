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
          label: t('DownloadEsimPage.setupIphoneLabel'),
          title: t('DownloadEsimPage.setupIphoneTitle'),
          steps: [
            {
              number: '1',
              stepTitle: t('DownloadEsimPage.setupIphoneStep1Title'),
              description: t('DownloadEsimPage.setupIphoneStep1Desc'),
              image: '/images/setupStep/step1.png',
            },
            {
              number: '2',
              stepTitle: t('DownloadEsimPage.setupIphoneStep2Title'),
              description: t('DownloadEsimPage.setupIphoneStep2Desc'),
              image: '/images/setupStep/step2.png',
            },
            {
              number: '3',
              stepTitle: t('DownloadEsimPage.setupIphoneStep3Title'),
              description: t('DownloadEsimPage.setupIphoneStep3Desc'),
              image: '/images/setupStep/step3.png',
            },
          ],
          instructions: {
            heading: t('DownloadEsimPage.setupIphoneManualHeading'),
            steps: [
              t('DownloadEsimPage.setupIphoneManualStep1'),
              t('DownloadEsimPage.setupIphoneManualStep2'),
              t('DownloadEsimPage.setupIphoneManualStep3'),
              t('DownloadEsimPage.setupIphoneManualStep4'),
            ],
          },
        },
        {
          label: t('DownloadEsimPage.setupAndroidLabel'),
          title: t('DownloadEsimPage.setupAndroidTitle'),
          steps: [
            {
              number: '1',
              stepTitle: t('DownloadEsimPage.setupAndroidStep1Title'),
              description: t('DownloadEsimPage.setupAndroidStep1Desc'),
              image: '/images/setupStep/step1.png',
            },
            {
              number: '2',
              stepTitle: t('DownloadEsimPage.setupAndroidStep2Title'),
              description: t('DownloadEsimPage.setupAndroidStep2Desc'),
              image: '/images/setupStep/step2.png',
            },
            {
              number: '3',
              stepTitle: t('DownloadEsimPage.setupAndroidStep3Title'),
              description: t('DownloadEsimPage.setupAndroidStep3Desc'),
              image: '/images/setupStep/step3.png',
            },
          ],
          instructions: {
            heading: t('DownloadEsimPage.setupAndroidManualHeading'),
            steps: [
              t('DownloadEsimPage.setupAndroidManualStep1'),
              t('DownloadEsimPage.setupAndroidManualStep2'),
              t('DownloadEsimPage.setupAndroidManualStep3'),
              t('DownloadEsimPage.setupAndroidManualStep4'),
            ],
          },
        },
      ],
      FAQData: {
        title: t('DownloadEsimPage.faqTitle'),
        faqs: [
          {
            id: 'faq-1',
            question: t('DownloadEsimPage.faq1Question'),
            answer: t('DownloadEsimPage.faq1Answer'),
          },
          {
            id: 'faq-2',
            question: t('DownloadEsimPage.faq2Question'),
            answer: t('DownloadEsimPage.faq2Answer'),
          },
          {
            id: 'faq-3',
            question: t('DownloadEsimPage.faq3Question'),
            answer: t('DownloadEsimPage.faq3Answer'),
          },
          {
            id: 'faq-4',
            question: t('DownloadEsimPage.faq4Question'),
            answer: t('DownloadEsimPage.faq4Answer'),
          },
          {
            id: 'faq-5',
            question: t('DownloadEsimPage.faq5Question'),
            answer: t('DownloadEsimPage.faq5Answer'),
          },
          {
            id: 'faq-6',
            question: t('DownloadEsimPage.faq6Question'),
            answer: t('DownloadEsimPage.faq6Answer'),
          },
          {
            id: 'faq-7',
            question: t('DownloadEsimPage.faq7Question'),
            answer: t('DownloadEsimPage.faq7Answer'),
          },
          {
            id: 'faq-8',
            question: t('DownloadEsimPage.faq8Question'),
            answer: t('DownloadEsimPage.faq8Answer'),
          },
        ],
      },
    },
    Security_Features: {
      heroSec: {
        title: t('website.NewSimfinDes.Security_Features.heroSec.title'),
        des: t('website.NewSimfinDes.Security_Features.heroSec.description'),
      },
      Safe_travels: {
        title: t('website.NewSimfinDes.Security_Features.Safe_travels.title'),
        description: t('website.NewSimfinDes.Security_Features.Safe_travels.description'),
      },

      Left_rightImage: {
        virtualLocation: {
          subtitle: t(
            'website.NewSimfinDes.Security_Features.Left_rightImage.virtualLocation.subtitle',
          ),
          title: t('website.NewSimfinDes.Security_Features.Left_rightImage.virtualLocation.title'),
          description: t(
            'website.NewSimfinDes.Security_Features.Left_rightImage.virtualLocation.description',
          ),
          benefits: [
            {
              text: t(
                'website.NewSimfinDes.Security_Features.Left_rightImage.virtualLocation.benefits.0.text',
              ),
            },
            {
              text: t(
                'website.NewSimfinDes.Security_Features.Left_rightImage.virtualLocation.benefits.1.text',
              ),
            },
            {
              text: t(
                'website.NewSimfinDes.Security_Features.Left_rightImage.virtualLocation.benefits.2.text',
              ),
            },
          ],
          imageSrc: '/images/features/sf-virtual-location.webp',
          imageAlt: t(
            'website.NewSimfinDes.Security_Features.Left_rightImage.virtualLocation.imageAlt',
          ),
          imagePosition: 'left',
        },
        adBlocker: {
          subtitle: t('website.NewSimfinDes.Security_Features.Left_rightImage.adBlocker.subtitle'),
          title: t('website.NewSimfinDes.Security_Features.Left_rightImage.adBlocker.title'),
          description: t(
            'website.NewSimfinDes.Security_Features.Left_rightImage.adBlocker.description',
          ),
          benefits: [
            {
              text: t(
                'website.NewSimfinDes.Security_Features.Left_rightImage.adBlocker.benefits.0.text',
              ),
            },
            {
              text: t(
                'website.NewSimfinDes.Security_Features.Left_rightImage.adBlocker.benefits.1.text',
              ),
            },
            {
              text: t(
                'website.NewSimfinDes.Security_Features.Left_rightImage.adBlocker.benefits.2.text',
              ),
            },
          ],
          imageSrc: '/images/features/sf-ad-blocker-lp.webp',
          imageAlt: t('website.NewSimfinDes.Security_Features.Left_rightImage.adBlocker.imageAlt'),
          imagePosition: 'right',
        },
        webProtection: {
          subtitle: t(
            'website.NewSimfinDes.Security_Features.Left_rightImage.webProtection.subtitle',
          ),
          title: t('website.NewSimfinDes.Security_Features.Left_rightImage.webProtection.title'),
          description: t(
            'website.NewSimfinDes.Security_Features.Left_rightImage.webProtection.description',
          ),
          benefits: [
            {
              text: t(
                'website.NewSimfinDes.Security_Features.Left_rightImage.webProtection.benefits.0.text',
              ),
            },
            {
              text: t(
                'website.NewSimfinDes.Security_Features.Left_rightImage.webProtection.benefits.1.text',
              ),
            },
            {
              text: t(
                'website.NewSimfinDes.Security_Features.Left_rightImage.webProtection.benefits.2.text',
              ),
            },
          ],
          imageSrc: '/images/features/sf-web-protection-lp.webp',
          imageAlt: t(
            'website.NewSimfinDes.Security_Features.Left_rightImage.webProtection.imageAlt',
          ),
          imagePosition: 'left',
        },
        support24x7: {
          heading: t('website.NewSimfinDes.Security_Features.Left_rightImage.support24x7.heading'),
          description: t(
            'website.NewSimfinDes.Security_Features.Left_rightImage.support24x7.description',
          ),
          button: {
            text: t(
              'website.NewSimfinDes.Security_Features.Left_rightImage.support24x7.button.text',
            ),
            href: t(
              'website.NewSimfinDes.Security_Features.Left_rightImage.support24x7.button.href',
            ),
            variant: 'white',
          },
          contentAlignment: 'start',
          backgroundColor: 'bg-[#f7f7f8]',
          textColor: 'text-gray-900',
        },
      },
      valuesConfig: {
        title: t('website.NewSimfinDes.Security_Features.SecurityFeaturesValues.title'),
        subtitle: t('website.NewSimfinDes.SingleCountryPlan.ValuesSectionCommon.subtitle'),
        backgroundColor: 'bg-black',
        textColor: 'text-white',
        theme: 'dark' as const,
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
            title: t(
              'website.NewSimfinDes.Security_Features.SecurityFeaturesValues.values.0.title',
            ),
            description: t(
              'website.NewSimfinDes.Security_Features.SecurityFeaturesValues.values.0.description',
            ),
          },
          {
            id: 2,
            iconComponent: <FaSimCard />,
            title: t(
              'website.NewSimfinDes.Security_Features.SecurityFeaturesValues.values.1.title',
            ),
            description: t(
              'website.NewSimfinDes.Security_Features.SecurityFeaturesValues.values.1.description',
            ),
          },
          {
            id: 3,
            iconComponent: <GrStatusGood />,
            title: t(
              'website.NewSimfinDes.Security_Features.SecurityFeaturesValues.values.2.title',
            ),
            description: t(
              'website.NewSimfinDes.Security_Features.SecurityFeaturesValues.values.2.description',
            ),
          },
          {
            id: 4,
            iconComponent: <FaSeedling />,
            title: t(
              'website.NewSimfinDes.Security_Features.SecurityFeaturesValues.values.3.title',
            ),
            description: t(
              'website.NewSimfinDes.Security_Features.SecurityFeaturesValues.values.3.description',
            ),
          },
          {
            id: 5,
            iconComponent: <FaCompass />,
            title: t(
              'website.NewSimfinDes.Security_Features.SecurityFeaturesValues.values.4.title',
            ),
            description: t(
              'website.NewSimfinDes.Security_Features.SecurityFeaturesValues.values.4.description',
            ),
          },
          {
            id: 6,
            iconComponent: <FaRocket />,
            title: t(
              'website.NewSimfinDes.Security_Features.SecurityFeaturesValues.values.5.title',
            ),
            description: t(
              'website.NewSimfinDes.Security_Features.SecurityFeaturesValues.values.5.description',
            ),
          },
        ],
      },
      SecurityFeatures: {
        FAQData: {
          title: t('website.NewSimfinDes.Security_Features.SecurityFeatures.FAQData.title'),
          faqs: [
            {
              id: 'faq-1',
              question: t(
                'website.NewSimfinDes.Security_Features.SecurityFeatures.FAQData.faqs.0.question',
              ),
              answer: t(
                'website.NewSimfinDes.Security_Features.SecurityFeatures.FAQData.faqs.0.answer',
              ),
            },
            {
              id: 'faq-2',
              question: t(
                'website.NewSimfinDes.Security_Features.SecurityFeatures.FAQData.faqs.1.question',
              ),
              answer: t(
                'website.NewSimfinDes.Security_Features.SecurityFeatures.FAQData.faqs.1.answer',
              ),
            },
            {
              id: 'faq-3',
              question: t(
                'website.NewSimfinDes.Security_Features.SecurityFeatures.FAQData.faqs.2.question',
              ),
              answer: t(
                'website.NewSimfinDes.Security_Features.SecurityFeatures.FAQData.faqs.2.answer',
              ),
            },
            {
              id: 'faq-4',
              question: t(
                'website.NewSimfinDes.Security_Features.SecurityFeatures.FAQData.faqs.3.question',
              ),
              answer: t(
                'website.NewSimfinDes.Security_Features.SecurityFeatures.FAQData.faqs.3.answer',
              ),
            },
            {
              id: 'faq-5',
              question: t(
                'website.NewSimfinDes.Security_Features.SecurityFeatures.FAQData.faqs.4.question',
              ),
              answer: t(
                'website.NewSimfinDes.Security_Features.SecurityFeatures.FAQData.faqs.4.answer',
              ),
            },
            {
              id: 'faq-6',
              question: t(
                'website.NewSimfinDes.Security_Features.SecurityFeatures.FAQData.faqs.5.question',
              ),
              answer: t(
                'website.NewSimfinDes.Security_Features.SecurityFeatures.FAQData.faqs.5.answer',
              ),
            },
            {
              id: 'faq-7',
              question: t(
                'website.NewSimfinDes.Security_Features.SecurityFeatures.FAQData.faqs.6.question',
              ),
              answer: t(
                'website.NewSimfinDes.Security_Features.SecurityFeatures.FAQData.faqs.6.answer',
              ),
            },
            {
              id: 'faq-8',
              question: t(
                'website.NewSimfinDes.Security_Features.SecurityFeatures.FAQData.faqs.7.question',
              ),
              answer: t(
                'website.NewSimfinDes.Security_Features.SecurityFeatures.FAQData.faqs.7.answer',
              ),
            },
          ],
        },
      },
    },
    WhatIsEsim: {
      setUpEsim: [
        {
          label: t('website.website.NewSimfinDes.what_is_esim.WhatIsEsim.setUpEsim.0.label'),
          title: t('website.website.NewSimfinDes.what_is_esim.WhatIsEsim.setUpEsim.0.title'),
          steps: [
            {
              number: '1',
              stepTitle: t(
                'website.NewSimfinDes.what_is_esim.WhatIsEsim.setUpEsim.0.steps.0.stepTitle',
              ),
              description: t(
                'website.NewSimfinDes.what_is_esim.WhatIsEsim.setUpEsim.0.steps.0.description',
              ),
              image: '/images/setupStep/step1.png',
            },
            {
              number: '2',
              stepTitle: t(
                'website.NewSimfinDes.what_is_esim.WhatIsEsim.setUpEsim.0.steps.1.stepTitle',
              ),
              description: t(
                'website.NewSimfinDes.what_is_esim.WhatIsEsim.setUpEsim.0.steps.1.description',
              ),
              // image: '/images/2-step.svg'
              image: '/images/setupStep/step2.png',
            },
            {
              number: '3',
              stepTitle: t(
                'website.NewSimfinDes.what_is_esim.WhatIsEsim.setUpEsim.0.steps.2.stepTitle',
              ),
              description: t(
                'website.NewSimfinDes.what_is_esim.WhatIsEsim.setUpEsim.0.steps.2.description',
              ),
              // image: '/images/3-step.svg'
              image: '/images/setupStep/step3.png',
            },
          ],
          instructions: {
            heading: t(
              'website.website.NewSimfinDes.what_is_esim.WhatIsEsim.setUpEsim.0.instructions.heading',
            ),
            steps: [
              t('website.NewSimfinDes.what_is_esim.WhatIsEsim.setUpEsim.0.instructions.steps.0'),
              t('website.NewSimfinDes.what_is_esim.WhatIsEsim.setUpEsim.0.instructions.steps.1'),
              t('website.NewSimfinDes.what_is_esim.WhatIsEsim.setUpEsim.0.instructions.steps.2'),
              t('website.NewSimfinDes.what_is_esim.WhatIsEsim.setUpEsim.0.instructions.steps.3'),
            ],
          },
        },
        {
          label: t('website.NewSimfinDes.what_is_esim.WhatIsEsim.setUpEsim.1.label'),
          title: t('website.NewSimfinDes.what_is_esim.WhatIsEsim.setUpEsim.1.title'),
          steps: [
            {
              number: '1',
              stepTitle: t(
                'website.NewSimfinDes.what_is_esim.WhatIsEsim.setUpEsim.1.steps.0.stepTitle',
              ),
              description: t(
                'website.NewSimfinDes.what_is_esim.WhatIsEsim.setUpEsim.1.steps.0.description',
              ),
              // image: '/images/whatEsim/card-choose-data-plan.svg'
              image: '/images/setupStep/step1.png',
            },
            {
              number: '2',
              stepTitle: t(
                'website.NewSimfinDes.what_is_esim.WhatIsEsim.setUpEsim.1.steps.1.stepTitle',
              ),
              description: t(
                'website.NewSimfinDes.what_is_esim.WhatIsEsim.setUpEsim.1.steps.1.description',
              ),
              // image: '/images/whatEsim/card-setup-instructions.svg'
              image: '/images/setupStep/step2.png',
            },
            {
              number: '3',
              stepTitle: t(
                'website.NewSimfinDes.what_is_esim.WhatIsEsim.setUpEsim.1.steps.2.stepTitle',
              ),
              description: t(
                'website.NewSimfinDes.what_is_esim.WhatIsEsim.setUpEsim.1.steps.2.description',
              ),
              // image: '/images/whatEsim/card-activate-plan.svg'
              image: '/images/setupStep/step3.png',
            },
          ],
          instructions: {
            heading: t(
              'website.NewSimfinDes.what_is_esim.WhatIsEsim.setUpEsim.1.instructions.heading',
            ),
            steps: [
              t('website.NewSimfinDes.what_is_esim.WhatIsEsim.setUpEsim.1.instructions.steps.0'),
              t('website.NewSimfinDes.what_is_esim.WhatIsEsim.setUpEsim.1.instructions.steps.1'),
              t('website.NewSimfinDes.what_is_esim.WhatIsEsim.setUpEsim.1.instructions.steps.2'),
              t('website.NewSimfinDes.what_is_esim.WhatIsEsim.setUpEsim.1.instructions.steps.3'),
            ],
          },
        },
        {
          label: t('website.NewSimfinDes.what_is_esim.WhatIsEsim.setUpEsim.2.label'),
          title: t('website.NewSimfinDes.what_is_esim.WhatIsEsim.setUpEsim.2.title'),
          steps: [
            {
              number: '1',
              stepTitle: t(
                'website.NewSimfinDes.what_is_esim.WhatIsEsim.setUpEsim.2.steps.0.stepTitle',
              ),
              description: t(
                'website.NewSimfinDes.what_is_esim.WhatIsEsim.setUpEsim.2.steps.0.description',
              ),
            },
            {
              number: '2',
              stepTitle: t(
                'website.NewSimfinDes.what_is_esim.WhatIsEsim.setUpEsim.2.steps.1.stepTitle',
              ),
              description: t(
                'website.NewSimfinDes.what_is_esim.WhatIsEsim.setUpEsim.2.steps.1.description',
              ),
            },
            {
              number: '3',
              stepTitle: t(
                'website.NewSimfinDes.what_is_esim.WhatIsEsim.setUpEsim.2.steps.2.stepTitle',
              ),
              description: t(
                'website.NewSimfinDes.what_is_esim.WhatIsEsim.setUpEsim.2.steps.2.description',
              ),
            },
          ],
        },
      ],
      FAQData: {
        title: t('website.NewSimfinDes.what_is_esim.WhatIsEsim.FAQData.title'),
        faqs: [
          {
            id: 'faq-1',
            question: t('website.NewSimfinDes.what_is_esim.WhatIsEsim.FAQData.faqs.0.question'),
            answer: t('website.NewSimfinDes.what_is_esim.WhatIsEsim.FAQData.faqs.0.answer'),
          },
          {
            id: 'faq-2',
            question: t('website.NewSimfinDes.what_is_esim.WhatIsEsim.FAQData.faqs.1.question'),
            answer: t('website.NewSimfinDes.what_is_esim.WhatIsEsim.FAQData.faqs.1.answer'),
          },
          {
            id: 'faq-3',
            question: t('website.NewSimfinDes.what_is_esim.WhatIsEsim.FAQData.faqs.2.question'),
            answer: t('website.NewSimfinDes.what_is_esim.WhatIsEsim.FAQData.faqs.2.answer'),
          },
          {
            id: 'faq-4',
            question: t('website.NewSimfinDes.what_is_esim.WhatIsEsim.FAQData.faqs.3.question'),
            answer: t('website.NewSimfinDes.what_is_esim.WhatIsEsim.FAQData.faqs.3.answer'),
          },
          {
            id: 'faq-5',
            question: t('website.NewSimfinDes.what_is_esim.WhatIsEsim.FAQData.faqs.4.question'),
            answer: t('website.NewSimfinDes.what_is_esim.WhatIsEsim.FAQData.faqs.4.answer'),
          },
          {
            id: 'faq-6',
            question: t('website.NewSimfinDes.what_is_esim.WhatIsEsim.FAQData.faqs.5.question'),
            answer: t('website.NewSimfinDes.what_is_esim.WhatIsEsim.FAQData.faqs.5.answer'),
          },
          {
            id: 'faq-7',
            question: t('website.NewSimfinDes.what_is_esim.WhatIsEsim.FAQData.faqs.6.question'),
            answer: t('website.NewSimfinDes.what_is_esim.WhatIsEsim.FAQData.faqs.6.answer'),
          },
          {
            id: 'faq-8',
            question: t('website.NewSimfinDes.what_is_esim.WhatIsEsim.FAQData.faqs.7.question'),
            answer: t('website.NewSimfinDes.what_is_esim.WhatIsEsim.FAQData.faqs.7.answer'),
          },
          {
            id: 'faq-9',
            question: t('website.NewSimfinDes.what_is_esim.WhatIsEsim.FAQData.faqs.8.question'),
            answer: t('website.NewSimfinDes.what_is_esim.WhatIsEsim.FAQData.faqs.8.answer'),
          },
          {
            id: 'faq-10',
            question: t('website.NewSimfinDes.what_is_esim.WhatIsEsim.FAQData.faqs.9.question'),
            answer: t('website.NewSimfinDes.what_is_esim.WhatIsEsim.FAQData.faqs.9.answer'),
          },
        ],
      },
    },
    //

    NavbarData: {
      productMegaMenuConfig: {
        columns: [
          {
            title: t('website.headerlinks.ProductColumnTitle'),

            items: [
              {
                label: t('website.headerlinks.ProductFeature1Title'),
                description: t('website.headerlinks.ProductFeature1Desc'),
                href: '/all-destinations',
                icon: <MdModeStandby className="h4 w-4" />,
                disabled: true,
                badge: 'coming soon',
              },
              {
                label: t('website.headerlinks.ProductFeature4Title'),
                description: t('website.headerlinks.ProductFeature4Desc'),
                href: '/security',
                icon: <GoPackage className="h4 w-4" />,
              },
              {
                label: t('website.headerlinks.ProductFeature2Title'),
                description: t('website.headerlinks.ProductFeature2Desc'),
                href: '',
                icon: <GoPackage className="h4 w-4" />,
                isExternalUrl: 'https://simfinity.dev',
              },
              {
                label: t('website.headerlinks.ProductFeature3Title'),
                description: t('website.headerlinks.ProductFeature3Desc'),
                href: '/supported-devices',
                icon: <BiWorld className="h4 w-4" />,
              },
            ],
          },

          {
            title: t('website.headerlinks.SupportColumnTitle'),
            items: [
              {
                label: t('website.headerlinks.ProductTool1Title'),
                description: t('website.headerlinks.ProductTool1Desc'),
                href: '/privacy-policy',
                icon: <MdOutlinePrivacyTip className="h4 w-4" />,
              },
              {
                label: t('website.headerlinks.ProductTool2Title'),
                description: t('website.headerlinks.ProductTool2Desc'),
                href: '/destinations',
                icon: <MdOutlinePolicy className="h4 w-4" />,
              },
            ],
          },
        ],
        slider: {
          title: t('website.headerlinks.ProductSliderTitle'),
          items: [
            {
              id: 1,
              title: t('website.headerlinks.ProductSlider1Title'),
              description: t('website.headerlinks.ProductSlider1Description'),
              image: '/images/menu-images/mega-menu-explore1.png',
              href: '/ultra-plan',
            },
            {
              id: 2,
              title: t('website.headerlinks.ProductSlider2Title'),
              description: t('website.headerlinks.ProductSlider2Description'),
              image: '/images/menu-images/mega-menu-explore2.png',
              href: '/security-features',
            },
            {
              id: 3,
              title: t('website.headerlinks.ProductSlider3Title'),
              description: t('website.headerlinks.ProductSlider3Description'),
              image: '/images/menu-images/mega-menu-explore3.png',
              href: '/security-features',
            },
          ],
        },
        bottomLink: {
          label: 'What is an eSIM?',
          herf: '/what-is-esim',
        },
      },
      rouceMegaMenuConfig: {
        columns: [
          {
            title: t('website.headerlinks.ResourceGetStartedTitle'),

            items: [
              {
                label: t('website.headerlinks.Resource1Title'),
                description: t('website.headerlinks.Resource1Desc'),
                badge: t('website.headerlinks.ResourceBadgeNew'),
                href: '/what-is-esim',
                icon: <MdOutlineSimCard className="h4 w-4" />,
              },
              {
                label: t('website.headerlinks.Resource4Title'),
                description: t('website.headerlinks.Resource5Desc'),
                href: '/blog',
                icon: <MdOutlineSupportAgent className="h4 w-4" />,
              },
              {
                label: t('website.headerlinks.Resource2Title'),
                description: t('website.headerlinks.Resource2Desc'),
                badge: t('website.headerlinks.ResourceBadgeGuide'),
                href: '/about-us',
                icon: <TbDeviceUnknown className="h4 w-4" />,
              },
            ],
          },

          {
            title: t('website.headerlinks.ResourceSupportTitle'),

            items: [
              {
                label: t('website.headerlinks.Resource3Title'),
                description: t('website.headerlinks.Resource3Desc'),
                href: '/affiliate-program',
                icon: <FaShield className="h4 w-4" />,
                // disabled: true,
              },
              {
                label: t('website.headerlinks.Resource6Title'),
                description: t('website.headerlinks.Resource6Desc'),
                href: '/blog',
                icon: <RiBloggerFill className="h4 w-4" />,
                disabled: true,
                badge: 'coming soon',
              },
              // {
              //   label: t('website.headerlinks.Resource5Title'),
              //   description: t('website.headerlinks.Resource5Desc'),
              //   href: '/download-esim-app',
              //   icon: <IoMdDownload  className="h4 w-4" />,
              //   disabled: true,
              // },
            ],
          },
        ],
        slider: {
          title: t('website.headerlinks.ProductSliderTitle'),
          items: [
            {
              id: 1,
              title: t('website.headerlinks.ResourceSlider1Title'),
              description: t('website.headerlinks.ResourceSlider1Description'),
              image: '/images/menu-images/mega-menu-explore1.png',
              href: '/ultra-plan',
            },
            {
              id: 2,
              title: t('website.headerlinks.ResourceSlider2Title'),
              description: t('website.headerlinks.ResourceSlider2Description'),
              image: '/images/menu-images/mega-menu-explore2.png',
              href: '/security-features',
            },
            {
              id: 3,
              title: t('website.headerlinks.ResourceSlider3Title'),
              description: t('website.headerlinks.ResourceSlider3Description'),
              image: '/images/menu-images/mega-menu-explore3.png',
              href: '/security-features',
            },
          ],
        },
        bottomLink: {
          label: 'Is Your Devices eSim Compataible?',
          herf: '/supported-devices',
        },
      },

      offersMegaMenuConfig: {
        see_pack: t('website.headerlinks.OfferSeePack'),
        label: t('website.headerlinks.OfferMenuLabel'),
        badge: t('website.headerlinks.OfferMenuBadge'),

        columns: [
          {
            title: t('website.headerlinks.OfferColumnTitle'),

            items: [
              {
                label: t('website.headerlinks.Offer1Title'),
                description: t('website.headerlinks.Offer1Desc'),
                href: '/referral',
                icon: <Gift className="h4 w-4" />,
                badge: t('website.headerlinks.OfferBadgeHot'),
                // disabled: true,
              },
              {
                label: t('website.headerlinks.Offer2Title'),
                description: t('website.headerlinks.Offer2Desc'),
                href: '/referral',
                icon: <GraduationCap className="h4 w-4" />,
                badge: t('website.headerlinks.OfferBadgeNew'),
                // disabled: true,
              },
              {
                label: t('website.headerlinks.Offer3Title'),
                description: t('website.headerlinks.Offer3Desc'),
                href: '/referral',
                icon: <Tag className="h4 w-4" />,
                // disabled: true,
              },
            ],
          },
        ],

        slider: {
          title: t('website.headerlinks.ProductSliderTitle'),
          items: [
            {
              id: 1,
              title: t('website.headerlinks.ProductSlider1Title'),
              description: t('website.headerlinks.ProductSlider1Description'),
              image: '/images/menu-images/mega-menu-explore1.png',
              href: '/ultra-plan',
            },
            {
              id: 2,
              title: t('website.headerlinks.ProductSlider2Title'),
              description: t('website.headerlinks.ProductSlider2Description'),
              image: '/images/menu-images/mega-menu-explore2.png',
              href: '/security-features',
            },
            {
              id: 3,
              title: t('website.headerlinks.ProductSlider3Title'),
              description: t('website.headerlinks.ProductSlider3Description'),
              image: '/images/menu-images/mega-menu-explore3.png',
              href: '/security-features',
            },
          ],
        },
        bottomLink: {
          label: 'How to Install eSIM?',
          herf: '/download-esim-app',
        },
      },
      helpMegaMenuConfig: {
        label: t('website.headerlinks.HelpLabel'),
        badge: t('website.headerlinks.HelpBadge'),

        columns: [
          {
            title: t('website.headerlinks.HelpLabel'),
            items: [
              {
                label: t('website.headerlinks.Help1Title'),
                description: t('website.headerlinks.Help1Desc'),
                href: '/destinations',
                icon: <BookOpen className="h4 w-4" />,
                badge: 'New',
              },
              {
                label: t('website.headerlinks.Help2Title'),
                description: t('website.headerlinks.Help2Desc'),
                href: '/help-center',
                icon: <LifeBuoy className="h4 w-4" />,
                disabled: true,
              },
              {
                label: t('website.headerlinks.Help3Title'),
                description: t('website.headerlinks.Help3Desc'),
                href: '/troubleshooting',
                icon: <Wrench className="h4 w-4" />,
                disabled: true,
              },
            ],
          },

          {
            title: t('website.headerlinks.HelpColumnSupportTitle'),
            items: [
              {
                label: t('website.headerlinks.Help4Title'),
                description: t('website.headerlinks.Help4Desc'),
                href: '/faq',
                icon: <HelpCircle className="h4 w-4" />,
              },
            ],
          },
        ],

        slider: {
          title: t('website.headerlinks.ProductSliderTitle'),
          items: [
            {
              id: 1,
              title: t('website.headerlinks.ProductSlider1Title'),
              description: t('website.headerlinks.ProductSlider1Description'),
              image: '/images/menu-images/mega-menu-explore1.png',
              href: '/ultra-plan',
            },
            {
              id: 2,
              title: t('website.headerlinks.ProductSlider2Title'),
              description: t('website.headerlinks.ProductSlider2Description'),
              image: '/images/menu-images/mega-menu-explore2.png',
              href: '/security-features',
            },
            {
              id: 3,
              title: t('website.headerlinks.ProductSlider3Title'),
              description: t('website.headerlinks.ProductSlider3Description'),
              image: '/images/menu-images/mega-menu-explore3.png',
              href: '/security-features',
            },
          ],
        },
        bottomLink: {
          label: 'What is an eSIM?',
          herf: '/what-is-esim',
        },
      },
    },
  };
  return staticData;
};

export default useStaticData;
