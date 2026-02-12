'use client';

import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'wouter';
import { useTranslation } from '@/contexts/TranslationContext';
import ThemeButton from '@/components/ThemeButton';
import FAQSection from '@/components/sections/landing/FAQSection';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store/store';

const EsimForBusiness = () => {
  const { t } = useTranslation();
  const [, navigate] = useLocation();

  const { isExpanded } = useSelector((state: RootState) => state.topNavbar);
  const isTopBarVisible = !isExpanded;

  // Feature cards data
  const features = [
    {
      title: "Global coverage",
      description: "Get fast, reliable data in more than 200 destinations.",
      image: "/images/esim-business/business-worldwide-coverage.png",
      className: "md:col-span-1 bg-white hover:shadow-lg transition-all duration-300"
    },
    {
      title: "Automatic activation",
      description: "eSIMs activate as soon as users reach their destination, or 30 days after purchase.",
      image: "/images/esim-business/business-seamless-connectivity-data-limit.png",
      className: "md:col-span-1 bg-white hover:shadow-lg transition-all duration-300"
    },
    {
      title: "Usage analytics",
      description: "By tracking data use, you can optimize spending and make sure your team stays online.",
      image: "/images/esim-business/business-tailored-solutions.png",
      className: "md:col-span-1 bg-white hover:shadow-lg transition-all duration-300"
    },
    {
      title: "QR code activation",
      description: "Team members get online using just a QR code — no app required!",
      className: "md:col-span-1 bg-white hover:shadow-lg transition-all duration-300",
      icon: (
        <svg className="w-8 h-8 mb-4 text-gray-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v1m6 11h2m-6 0h-2v4h2v-4zM5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
        </svg>
      )
    },
    {
      title: "Predictable pricing",
      description: "Budgeting is easier with transparent plan costs for teams of any size.",
      image: "/images/esim-business/business-no-roaming-fees.png",
      className: "md:col-span-1 bg-white hover:shadow-lg transition-all duration-300"
    },
    {
      title: "Easy payment",
      description: "Buy multiple plans with one purchase and view invoices through the dashboard.",
      className: "md:col-span-1 bg-white hover:shadow-lg transition-all duration-300",
      icon: (
        <svg className="w-8 h-8 mb-4 text-gray-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
        </svg>
      )
    }
  ];

  const steps = [
    {
      number: "1",
      title: "Add team members",
      description: "Start by adding team members to your organization and assigning plans."
    },
    {
      number: "2",
      title: "Purchase plans quickly",
      description: "Choose country, regional, or global plans and buy instantly."
    },
    {
      number: "3",
      title: "Monitor data usage",
      description: "Once a user has activated an eSIM plan with a QR code, you can track usage and renew plans remotely."
    }
  ];

  return (
    <main className={isTopBarVisible
      ? 'mt-28 md:mt-0'
      : 'mt-24 md:mt-0'}>

      <Helmet>
        <title>eSIM for Business | Simfinity</title>
      </Helmet>

      {/* Hero Section */}
      <section className="pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 order-2 lg:order-1">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-medium tracking-tight text-gray-900 leading-[1.1]">
              Manage all your team's eSIM plans from one dashboard
            </h1>
            <p className="text-lg text-gray-600 font-thin leading-relaxed max-w-lg">
              Buy and monitor eSIM plans from an easy-to-use dashboard. Assign plans, track usage, and add data as needed, so your team stays connected wherever they go.
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <ThemeButton
                onClick={() => navigate('/login')}
                className="px-8 py-3.5 rounded-full text-base font-medium bg-black text-white border-none hover:bg-gray-800 transition-all duration-300 shadow-none ring-0 focus:ring-0"
              >
                Log In
              </ThemeButton>
              <ThemeButton
                onClick={() => navigate('/contact')}
                variant="outline"
                className="px-8 py-3.5 rounded-full text-base font-medium bg-white text-black border border-gray-200 hover:bg-gray-50 transition-all duration-300 shadow-none"
              >
                Contact Sales
              </ThemeButton>
            </div>
          </div>
          <div className="relative order-1 lg:order-2 h-[400px] lg:h-[600px] w-full">
            <div className="absolute inset-0 from-gray-100 to-gray-50 rounded-[2rem] overflow-hidden">
              <img
                src="/images/esim-business/bussiness_hero.png"
                alt="Business Dashboard"
                className="w-full h-full object-contain p-4 md:p-8"
              />
            </div>
          </div>
        </div>
      </section>


      {/* Testimonial */}
      <section className="py-8 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl p-10 shadow-sm border border-gray-100">
          <div className="flex flex-col gap-6">
            <svg className="w-5 h-5 text-black" fill="currentColor" viewBox="0 0 24 24">
              <path d="M14.017 21L14.017 18C14.017 16.8954 14.9124 16 16.017 16H19.017C19.5693 16 20.017 15.5523 20.017 15V9C20.017 8.44772 19.5693 8 19.017 8H15.017C14.4647 8 14.017 8.44772 14.017 9V11C14.017 11.5523 13.5693 12 13.017 12H12.017V5H22.017V15C22.017 18.3137 19.3307 21 16.017 21H14.017ZM5.0166 21L5.0166 18C5.0166 16.8954 5.91203 16 7.0166 16H10.0166C10.5689 16 11.0166 15.5523 11.0166 15V9C11.0166 8.44772 10.5689 8 10.0166 8H6.0166C5.46432 8 5.0166 8.44772 5.0166 9V11C5.0166 11.5523 4.56889 12 4.0166 12H3.0166V5H13.0166V15C13.0166 18.3137 10.3303 21 7.0166 21H5.0166Z" />
            </svg>
            <p className="text-sm font-thin text-gray-600 leading-relaxed">
              At Lonely Planet, we're always looking to support travelers as they plan their next trip and recognize that staying connected is one of the necessities of being on the road. That's why we recommend Simfinity as our eSIM partner. Simfinity is an affordable, easy-to-use, and sustainable eSIM service that gives reliable mobile and internet connections from anywhere in the world.
            </p>
            <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
              <span className="font-medium text-blue-600 text-md flex items-center gap-2">
                lonely planet
              </span>
            </div>
          </div>
        </div>
      </section>


      {/* Why Businesses Choose Simfinity */}
      <section className="pt-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <h2 className="text-3xl sm:text-4xl font-medium text-gray-900 mb-16">Why businesses choose Simfinity</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:auto-rows-[minmax(0,1fr)]">

          {/* Column 1 */}
          <div className="flex flex-col gap-6">
            <div className="rounded-2xl p-8 border border-gray-100 bg-white hover:shadow-lg transition-all duration-300">
              <div className="w-12 h-12 mb-6 rounded-lg bg-gray-50 flex items-center justify-center">
                <svg className="w-6 h-6 text-gray-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-3">Global coverage</h3>
              <p className="text-base text-gray-600 font-thin leading-relaxed">Get fast, reliable data in more than 200 destinations.</p>
            </div>

            <div className="rounded-2xl p-8 border border-gray-100 bg-white hover:shadow-lg transition-all duration-300">
              <div className="w-12 h-12 mb-6 rounded-lg bg-gray-50 flex items-center justify-center">
                <svg className="w-6 h-6 text-gray-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-3">Automatic activation</h3>
              <p className="text-base text-gray-600 font-thin leading-relaxed">eSIMs activate as soon as users reach their destination, or 30 days after purchase.</p>
            </div>

            <div className="hidden md:block rounded-2xl overflow-hidden h-[200px] border border-gray-100">
              <img src="/images/esim-business/business-form.png" alt="Laptop" className="w-full h-full object-cover" />
            </div>
          </div>

          {/* Column 2 */}
          <div className="flex flex-col gap-6">
            <div className="hidden md:block rounded-2xl overflow-hidden h-[450px] lg:h-auto lg:flex-1 border border-gray-100 bg-black relative">
              <img src="/images/esim-business/business-worldwide-coverage.png" alt="Map" className="w-full h-full object-cover opacity-80" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent p-8 flex flex-col justify-end">
                <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 inline-flex items-center gap-2 w-fit mb-4">
                  <span className="text-white font-bold">200+</span>
                  <div className="flex -space-x-2">
                    <div className="w-6 h-6 rounded-full bg-red-500 border border-white"></div>
                    <div className="w-6 h-6 rounded-full bg-blue-500 border border-white"></div>
                    <div className="w-6 h-6 rounded-full bg-green-500 border border-white"></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-2xl p-8 border border-gray-100 bg-white hover:shadow-lg transition-all duration-300">
              <div className="w-12 h-12 mb-6 rounded-lg bg-gray-50 flex items-center justify-center">
                <svg className="w-6 h-6 text-gray-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-3">Predictable pricing</h3>
              <p className="text-base text-gray-600 font-thin leading-relaxed">Budgeting is easier with transparent plan costs for teams of any size.</p>
            </div>
          </div>

          {/* Column 3 */}
          <div className="flex flex-col gap-6">
            <div className="rounded-2xl p-8 border border-gray-100 bg-white hover:shadow-lg transition-all duration-300">
              <div className="w-12 h-12 mb-6 rounded-lg bg-gray-50 flex items-center justify-center">
                <svg className="w-6 h-6 text-gray-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-3">Usage analytics</h3>
              <p className="text-base text-gray-600 font-thin leading-relaxed">By tracking data use, you can optimize spending and make sure your team stays online.</p>
            </div>

            <div className="rounded-2xl p-8 border border-gray-100 bg-white hover:shadow-lg transition-all duration-300">
              <div className="w-12 h-12 mb-6 rounded-lg bg-gray-50 flex items-center justify-center">
                <svg className="w-6 h-6 text-gray-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v1m6 11h2m-6 0h-2v4h2v-4zM5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                </svg>
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-3">QR code activation</h3>
              <p className="text-base text-gray-600 font-thin leading-relaxed">Team members get online using just a QR code — no app required!</p>
            </div>

            <div className="hidden md:block rounded-2xl overflow-hidden h-[200px] border border-gray-100 bg-black">
              <img src="/images/esim-business/business-seamless-connectivity-data-limit.png" alt="Dark UI" className="w-full h-full object-cover" />
            </div>
          </div>

          {/* Column 4 */}
          <div className="flex flex-col gap-6">
            <div className="hidden md:block rounded-2xl overflow-hidden h-[450px] lg:h-auto lg:flex-1 border border-gray-100 bg-gray-100">
              <img src="/images/esim-business/business-tailored-solutions.png" alt="Traveler" className="w-full h-full object-cover" />
            </div>

            <div className="rounded-2xl p-8 border border-gray-100 bg-white hover:shadow-lg transition-all duration-300">
              <div className="w-12 h-12 mb-6 rounded-lg bg-gray-50 flex items-center justify-center">
                <svg className="w-6 h-6 text-gray-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-3">Easy payment</h3>
              <p className="text-base text-gray-600 font-thin leading-relaxed">Buy multiple plans with one purchase and view invoices through the dashboard.</p>
            </div>
          </div>

        </div>
      </section>

      {/* Get Started Steps */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto rounded-[3rem] my-10">
        <div className="mb-16">
          <h2 className="text-3xl sm:text-4xl font-medium text-gray-900 max-w-xl leading-tight">
            Get started with your Simfinity business dashboard
          </h2>
          <p className="mt-6 text-lg text-gray-600 font-thin max-w-2xl leading-relaxed">
            The Simfinity business dashboard gives your company full control over team connectivity, from adding team members to assigning and managing eSIMs across the workforce.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, idx) => (
            <div key={idx} className=" bg-gray-100 rounded-2xl p-8 shadow-sm border border-gray-100 h-full">
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-sm font-bold text-gray-900 mb-6">
                {step.number}
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-4">{step.title}</h3>
              <p className="text-base text-gray-600 font-thin leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>
      </section>


      {/* Product Family Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <h2 className="text-3xl sm:text-4xl font-medium text-gray-900 mb-12">Our product family</h2>

        <div className="relative">
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-6">
              {[
                { name: "NordVPN", logo: "/images/Product-NordProtect.svg", color: "text-blue-600" },
                { name: "NordLayer", logo: "/images/Product-NordVPN.svg", color: "text-green-600" },
                { name: "NordPass", logo: "/images/Product-NordPass.svg", color: "text-teal-600" },
                { name: "NordLocker", logo: "/images/Product-NordLocker.svg", color: "text-indigo-600" },
                { name: "NordLocker", logo: "/images/Product-NordStellar.svg", color: "text-indigo-600" },
                { name: "NordLocker", logo: "/images/Product-NordLayer.svg", color: "text-indigo-600" },
              ].map((product, idx) => (
                <CarouselItem key={idx} className="pl-6 md:basis-1/2 lg:basis-1/4">
                  <div className="bg-gray-50 rounded-3xl p-6 hover:bg-gray-100 transition-colors flex flex-col items-start gap-6 h-full">
                    <div className="h-10 md:h-8 w-auto">
                      <img src={product.logo} alt={product.name} className="h-full w-auto object-contain" />
                    </div>

                    <button className="px-6 py-2.5 rounded-full border border-gray-300 text-sm font-medium text-gray-900 hover:border-gray-900 transition-colors bg-white w-full sm:w-auto">
                      Visit Product Page
                    </button>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>

            {/* Navigation Arrows */}
            <div className="flex justify-end gap-2 mt-4 px-2">
              <CarouselPrevious className="!static !translate-y-0 h-11 w-11 rounded-full border border-gray-200 bg-white hover:bg-gray-50 hover:border-gray-300 transition-all text-gray-900 shadow-sm" />
              <CarouselNext className="!static !translate-y-0 h-11 w-11 rounded-full border border-gray-200 bg-white hover:bg-gray-50 hover:border-gray-300 transition-all text-gray-900 shadow-sm" />
            </div>
          </Carousel>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="relative py-24 px-4 sm:px-6 lg:px-8 mt-12 bg-gray-900 overflow-hidden">
        {/* Background Image Container */}
        <div className="absolute inset-0 z-0">
          <div className="w-full h-full bg-black/60 absolute z-10"></div>
          <img src="/images/Banner.png" alt="Travel Background" className="w-full h-full object-cover opacity-80" />
        </div>

        <div className="relative z-10 container mx-auto text-center max-w-3xl">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-medium text-white mb-6">
            Ready to get your team connected?
          </h2>
          <p className="text-lg text-gray-300 font-thin mb-10 max-w-2xl mx-auto">
            Log in to explore the Simfinity business dashboard, or chat with our sales team to get the right quote for your business.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <ThemeButton
              onClick={() => navigate('/login')}
              className="px-10 py-4 rounded-full text-base font-bold bg-white text-black border-none hover:bg-gray-100 transition-all duration-300 shadow-none"
            >
              Log In
            </ThemeButton>
            <ThemeButton
              onClick={() => navigate('/contact')}
              className="px-10 py-4 rounded-full text-base font-bold bg-transparent text-white border-2 border-white hover:bg-white/10 transition-all duration-300"
            >
              Contact Sales
            </ThemeButton>
          </div>
        </div>
      </section>

      <FAQSection />
    </main>
  );
};

export default EsimForBusiness;
