import React from 'react';
import ThemeButton from './ThemeButton';
import { MdImportantDevices, MdOutlineSecurity } from 'react-icons/md';
import { FaCheck } from 'react-icons/fa6';
import { IoCheckmarkCircleOutline } from 'react-icons/io5';
import { useTranslation } from '@/contexts/TranslationContext';
import { CheckCircle, CreditCard, Globe } from 'lucide-react';
import { useLocation } from 'wouter';
import useStaticData from '@/data/useStaticData';
import FAQ from './common/FAQ';

const UltraPlanHero: React.FC = () => {
  const { t } = useTranslation();
  const staticData = useStaticData();
  const [, navigate] = useLocation();
  const perks = [
    {
      icon: 'fa-seat-airline fa-sharp fa-regular',
      title: 'Airport lounge access',
      description: 'Relax in airport lounges in selected airports.',
    },
    {
      icon: 'fa-rocket-launch fa-sharp fa-regular',
      title: 'Fast-track service',
      description: 'Skip the lines at security and check-in.',
    },
    {
      icon: 'fa-kit fa-sharp-regular-plane-departure-clock',
      title: 'Delayed flight benefit',
      description: 'Delayed for 2+ hours? Relax in an airport lounge without using a pass.',
    },
    {
      icon: 'fa-taxi fa-sharp fa-regular',
      title: 'US$5 Uber voucher',
      description: 'Save US$5 on an Uber ride each month.',
    },
    {
      icon: 'fa-gift fa-sharp fa-regular',
      title: 'Premium online security tools',
      description: '',
      note: 'NordVPN, NordPass, NordLocker, Incogni.',
    },
    {
      icon: 'fa-headset fa-sharp fa-regular',
      title: 'Priority support',
      description: 'Get fast, expert support whenever you need it.',
    },
    {
      icon: 'fa-globe fa-sharp fa-regular',
      title: 'Virtual location',
      description: 'Change your virtual location in seconds.',
    },
    {
      icon: 'fa-ban fa-sharp fa-regular',
      title: 'Ad blocker',
      description: 'Make annoying ads disappear.',
    },
    {
      icon: 'fa-shield-keyhole fa-sharp fa-regular',
      title: 'Web protection',
      description: 'Block malicious sites and limit trackers.',
    },
    {
      icon: 'fa-wallet fa-sharp fa-regular',
      title: '8% cashback in Saily credits',
      description: 'Earn 8% back on purchases as credits.',
    },
    {
      icon: 'fa-clock fa-sharp fa-regular',
      title: 'More perks coming soon',
      description: 'Stay tuned for additional exciting travel benefits.',
      comingSoon: true,
    },
  ];

  return (
    <>
      <section className="relative pt-[150px]">
        {/* Background with video */}
        <div className="absolute bottom-0 -top-[56px] lg:-top-[72px] w-full flex flex-col items-center overflow-hidden bg-dark">
          <div className="relative h-full min-w-[1600px]">
            {/* Static image background */}
            <img
              id="hero-ultra-bg"
              alt=""
              loading="eager"
              width="1090"
              height="794"
              decoding="async"
              className="/images/ultra-horizon-top-still-min.webp"
              srcSet="/images/ultra-horizon-top-still-min.webp"
            />

            {/* Video background */}
            <video
              autoPlay
              loop
              playsInline
              className="absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-700 pointer-events-none opacity-100"
            >
              <source
                src="https://sb.nordcdn.com/m/7b914d61996a7a23/original/saily-ultra-horizon-top-animated.mp4"
                type="video/mp4"
              />
            </video>
          </div>
        </div>

        {/* Main content */}
        <div
          data-section="hero-ultra"
          data-testid="  "
          className="relative scroll-mt-20 xl:scroll-mt-24"
        >
          <div className="py-16 pt-8 sm:pt-16 containers">
            <div className="mx-4 sm:mx-auto">
              <div className="container mx-auto">
                <div className="flex flex-col lg:flex-row gap-8 md:gap-16">
                  {/* Left column */}
                  <div className="flex flex-col gap-8 justify-between">
                    {/* Mobile-only image */}
                    <div className="sm:hidden relative">
                      <img
                        id="hero-ultra-3dtext"
                        alt=""
                        loading="eager"
                        width="288"
                        height="183"
                        decoding="async"
                        className="w-full h-full"
                        src="/images/ultra_plan_image.webp"
                        srcSet="/images/ultra_plan_image.webp"
                      />
                    </div>

                    <div>
                      <h1
                        className="heading-2xl text-white text-5xl  mb-8 scroll-mt-20 xl:scroll-mt-24"
                        id="ultraPlanHeroTitle"
                      >
                        Saily Ultra: Your all-in-one premium travel plan
                      </h1>
                      <div className="h-full w-full flex group/stack flex-col gap-y-8">
                        <div>
                          <p className="body-md text-gray-200 scroll-mt-20 xl:scroll-mt-24" id="">
                            Travel smarter with Saily Ultra. Enjoy unlimited international eSIM
                            data, 8% cashback in Saily credits, and exclusive extras like a NordVPN
                            subscription and premium support.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right column - Plan details */}
                  <div className="p-4 sm:p-8 md:min-w-[552px] backdrop-blur-[49px] bg-[rgba(255,255,255,0.01)] rounded-3xl  border border-[rgba(255,255,255,0.32)]">
                    <div className="flex flex-col gap-8">
                      {/* Plan price section */}
                      <div className="flex flex-col sm:flex-row">
                        <div className="mr-8 flex items-center">
                          <span className="text-center whitespace-nowrap rounded-full inline-block border border-primary border-md text-primary py-1.5 px-4 body-sm lg:body-md h-fit">
                            Ultra plan
                          </span>
                        </div>
                        <div className="max-sm:mt-4 py-0.5 sm:pl-8">
                          <span
                            className="text-3xl text-white scroll-mt-20 xl:scroll-mt-24"
                            data-testid="ultra-plan-price"
                          >
                            US$59.99<span className="text-gray-400 text-xs">/mo</span>
                          </span>
                          <p className="text-xs text-gray-400 mt-1 scroll-mt-20 xl:scroll-mt-24">
                            All taxes and fees included
                          </p>
                        </div>
                      </div>

                      {/* Desktop buttons */}
                      <div className="max-sm:hidden flex flex-col gap-3">
                        <div className="flex flex-col gap-3">
                          <div className="flex gap-4 flex-wrap">
                            <ThemeButton onClick={() => console.log('hellow')}>
                              Get the Ultra Plan
                            </ThemeButton>
                            <ThemeButton
                              icon={<MdImportantDevices />}
                              iconPosition="left"
                              variant="outline_dark"
                              onClick={() => console.log('hellow')}
                            >
                              Get the Ultra Plan
                            </ThemeButton>
                          </div>
                          <div className="h-full w-full flex group/stack flex-row gap-x-1 max-sm:justify-center">
                            <MdOutlineSecurity className=" text-gray-400" />
                            <div className="flex">
                              <p
                                className="text-xs text-gray-400 scroll-mt-20 xl:scroll-mt-24"
                                id=""
                              >
                                Secure payment guaranteed
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Data benefits */}
                    <div className="mt-6 md:mt-8 p-4 flex flex-col gap-3 rounded-xl  border border-[rgba(255,255,255,0.32)]">
                      <div className="flex items-center gap-2">
                        <FaCheck className=" text-yellow-500" />
                        <p className="body-sm text-white scroll-mt-20 xl:scroll-mt-24">
                          30 GB of high-speed data monthly
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <FaCheck className=" text-yellow-500" />
                        <p className="body-sm text-white scroll-mt-20 xl:scroll-mt-24">
                          Unlimited data at up to 1 Mbps
                        </p>
                      </div>
                    </div>

                    {/* Perks section */}
                    <div className="mt-4 flex flex-col gap-4">
                      <p className="body-sm-medium text-gray-400 scroll-mt-20 xl:scroll-mt-24">
                        Plus:
                      </p>

                      {/* Perk items */}
                      {perks.map((perk, index) => (
                        <div key={index} className="flex gap-4 justify-between">
                          <div className="flex gap-2 sm:gap-4 flex-col sm:flex-row">
                            <div className="flex gap-3">
                              <div className="w-8 h-8 rounded-full border-md border-yellow-500 flex justify-center items-center">
                                <IoCheckmarkCircleOutline className=" h-5 w-5 text-yellow-500" />
                              </div>
                            </div>
                            <div>
                              <p className="text-sm text-white scroll-mt-20 xl:scroll-mt-24">
                                {perk.title}
                              </p>
                              <p className="text-xs text-white scroll-mt-20 xl:scroll-mt-24" id="">
                                {perk.description}
                              </p>
                              {perk.note && (
                                <div className="mt-2">
                                  <div className="h-full w-full flex group/stack flex-col justify-start gap-y-4">
                                    <div>
                                      <div className="h-full w-full flex group/stack flex-row items-center gap-x-2">
                                        <div>
                                          <div>
                                            <picture>
                                              <img
                                                alt="product icons"
                                                loading="lazy"
                                                width="56"
                                                height="20"
                                                decoding="async"
                                                src="https://sb.nordcdn.com/m/16e64eede33bd071/original/product-icons.svg"
                                              />
                                            </picture>
                                          </div>
                                        </div>
                                        <div>
                                          <p
                                            className="text-white/90 text-xs scroll-mt-20 xl:scroll-mt-24"
                                            id=""
                                          >
                                            {perk.note}
                                          </p>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                          {perk.comingSoon && (
                            <div className="hidden sm:flex items-center">
                              <span className="text-center whitespace-nowrap rounded-full inline-block border border-[rgba(255,255,255,0.32)] text-white py-1 px-3 text-xs h-fit">
                                Coming soon
                              </span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile bottom sticky CTA */}
        <div
          className="fixed bottom-0 left-0 z-50 w-full p-4
  bg-dark/70 backdrop-blur-lg
   border-neutral-700
  transition-opacity sm:hidden opacity-100"
        >
          <div className="flex flex-col gap-3">
            <div className="flex gap-4 justify-center flex-wrap">
              <ThemeButton onClick={() => console.log('hellow')}>Get the Ultra Plan</ThemeButton>
              <ThemeButton
                icon={<MdImportantDevices />}
                iconPosition="left"
                variant="outline_dark"
                onClick={() => console.log('hellow')}
              >
                Get the Ultra Plan
              </ThemeButton>
            </div>
            <div className="h-full w-full flex group/stack flex-row gap-x-1 max-sm:justify-center">
              <MdOutlineSecurity className=" text-gray-400" />
              <div className="flex">
                <p className="text-xs text-gray-400 scroll-mt-20 xl:scroll-mt-24" id="">
                  Secure payment guaranteed
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="overflow-hidden bg-black  py-10 md:py-24 lg:py-32 ">
        <div className="containers relative z-10">
          <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-12">
            {/* Left Side - Text Content */}
            <div className="space-y-6 text-center md:text-start order-2  lg:order-1 ">
              <h2 className="text-2.5 leading-tight font-medium text-white">Why Saily?</h2>

              <p className="text-base leading-relaxed text-white/70 sm:text-medium">
                Saily is a global eSIM service from Nord Security, one of the most trusted companies
                in the world. A user-friendly app, innovative features, and affordable eSIM prices
                in 200+ destinations — everything the modern traveler enjoys.
              </p>
            </div>

            {/* Right Side - Image */}
            <div className="relative h-[400px] w-full lg:h-[500px] order-1 lg:order-2">
              <div className="relative h-full w-full overflow-hidden rounded-3xl">
                <img
                  src="/images/about/Voices_crew1.png"
                  alt="People enjoying an event together"
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="overflow-hidden bg-black  py-10 md:py-24 lg:py-32 ">
        <div className="containers relative z-10">
          <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-12">
            {/* Left Side - Text Content */}
            <div className="space-y-6 text-center md:text-start order-1  lg:order-2 ">
              <h2 className="text-2.5 leading-tight font-medium text-white">Why Saily?</h2>

              <p className="text-base leading-relaxed text-white/70 sm:text-medium">
                Saily is a global eSIM service from Nord Security, one of the most trusted companies
                in the world. A user-friendly app, innovative features, and affordable eSIM prices
                in 200+ destinations — everything the modern traveler enjoys.
              </p>

              <ThemeButton variant="outline_dark" onClick={() => console.log('hellow')}>
                See All Destination
              </ThemeButton>
            </div>

            {/* Right Side - Image */}
            <div className="relative h-[400px] w-full lg:h-[500px] order-2 lg:order-1">
              <div className="relative h-full w-full overflow-hidden rounded-3xl">
                <img
                  src="/images/about/Voices_crew1.png"
                  alt="People enjoying an event together"
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="bg-black py-8 md:py-16">
        <div className="containers mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-12">
            <h2 className="lg:text-4.5xl mb-4 text-3xl font-medium text-white">
              {t('DownloadEsimPage.benefitsHeading')}
            </h2>

            <p className="text-base text-gray-100">{t('DownloadEsimPage.benefitsSubheading')}</p>
          </div>

          {/* Benefits Grid */}
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 lg:gap-12">
            <div className="space-y-4">
              <CheckCircle className="h-10 w-10 text-primary" strokeWidth={1.5} />
              <h3 className="text-xl font-medium text-gray-100">
                {t('DownloadEsimPage.benefit1Title')}
              </h3>
              <p className="text-gray-400">{t('DownloadEsimPage.benefit1Desc')}</p>
            </div>

            <div className="space-y-4">
              <CreditCard className="h-10 w-10 text-primary" strokeWidth={1.5} />
              <h3 className="text-xl font-medium text-gray-100">
                {t('DownloadEsimPage.benefit2Title')}
              </h3>
              <p className="text-gray-400">{t('DownloadEsimPage.benefit2Desc')}</p>
            </div>

            <div className="space-y-4">
              <Globe className="h-10 w-10 text-primary" strokeWidth={1.5} />
              <h3 className="text-xl font-medium text-gray-100">
                {t('DownloadEsimPage.benefit3Title')}
              </h3>
              <p className="text-gray-400">{t('DownloadEsimPage.benefit3Desc')}</p>
            </div>
            <div className="space-y-4">
              <Globe className="h-10 w-10 text-primary" strokeWidth={1.5} />
              <h3 className="text-xl font-medium text-gray-100">
                {t('DownloadEsimPage.benefit3Title')}
              </h3>
              <p className="text-gray-400">{t('DownloadEsimPage.benefit3Desc')}</p>
            </div>
            <div className="space-y-4">
              <Globe className="h-10 w-10 text-primary" strokeWidth={1.5} />
              <h3 className="text-xl font-medium text-gray-100">
                {t('DownloadEsimPage.benefit3Title')}
              </h3>
              <p className="text-gray-400">{t('DownloadEsimPage.benefit3Desc')}</p>
            </div>
            <div className="space-y-4">
              <Globe className="h-10 w-10 text-primary" strokeWidth={1.5} />
              <h3 className="text-xl font-medium text-gray-100">
                {t('DownloadEsimPage.benefit3Title')}
              </h3>
              <p className="text-gray-400">{t('DownloadEsimPage.benefit3Desc')}</p>
            </div>
          </div>
        </div>
      </section>
      <section className="w-full py-20 bg-black">
        <div className="mx-auto max-w-7xl px-4">
          {/* Header */}
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-2.5 leading-tight font-medium text-white">How to get started?</h2>

              <p className="text-base leading-relaxed text-gray-400 sm:text-medium pt-5">
                Join Simfinity’s affiliate program, promote Simfinity, and earn 15% with every new
                user.
              </p>
            </div>
          </div>

          {/* Steps */}
          <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-3">
            {[
              {
                step: '1',
                title: 'Register',
                desc: 'Tell us a little about yourself, and wait for your application to be reviewed.',
              },
              {
                step: '2',
                title: 'Meet your dedicated partnership manager',
                desc: "They'll share tracking links and answer your questions.",
              },
              {
                step: '3',
                title: 'Start earning',
                desc: 'Create content, promote Simfinity, and start earning.',
              },
            ].map((item) => (
              <div key={item.step} className="rounded-2xl bg-gray-800 p-8">
                <div className="mb-6 flex h-10 w-10 items-center justify-center rounded-full bg-white text-sm font-semibold text-black">
                  {item.step}
                </div>

                <h3 className="text-xl font-medium text-white">{item.title}</h3>

                <p className="mt-3 text-gray-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <FAQ bgColor="bg-black" faqs={staticData.DowonloadEsim.FAQData.faqs} />
    </>
  );
};

// Perks data array

export default UltraPlanHero;
