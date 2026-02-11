import { useTranslation } from '@/contexts/TranslationContext';
import React from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import Autoplay from 'embla-carousel-autoplay';

interface Step {
  id: number;
  title: string;
  description: string;
  image: string;
}

const HowDoesItWorkSection = () => {
  const { t } = useTranslation();

  const autoplayPlugin = React.useRef(
    Autoplay({ delay: 4000, stopOnInteraction: false })
  );

  const steps: Step[] = [
    {
      id: 1,
      title: t('website.NewSimfinDes.NewSimfinWorkDes.card1.title'),
      description: t('website.NewSimfinDes.NewSimfinWorkDes.card1.des'),
      image: '/images/setupStep/Better value for every trip 2.png',
    },
    {
      id: 2,
      title: t('website.NewSimfinDes.NewSimfinWorkDes.card2.title'),
      description: t('website.NewSimfinDes.NewSimfinWorkDes.card2.des'),
      image: '/images/setupStep/Coverage that reaches further.png',
    },
    {
      id: 3,
      title: t('website.NewSimfinDes.NewSimfinWorkDes.card3.title'),
      description: t('website.NewSimfinDes.NewSimfinWorkDes.card3.des'),
      image: '/images/setupStep/Designed for real travelers.png',
    },
  ];

  return (
    <section className="w-full bg-white py-12 sm:py-20 lg:py-24 overflow-hidden">
      <div className="containers">
        {/* Header */}
        <div className="mb-12 sm:mb-20 flex flex-col items-start text-start max-w-4xl">
          <p className="mb-3 text-sm font-medium text-gray-400 sm:text-base uppercase tracking-wider">
            {t('website.NewSimfinDes.NewSimfinWorkDes.subTitle')}
          </p>

          <h2 className="mb-6 text-3xl sm:text-4xl lg:text-2.5 font-medium leading-tight text-gray-900 tracking-tight">
            {t('website.NewSimfinDes.NewSimfinWorkDes.title')}
          </h2>

          <p className="text-base font-thin leading-relaxed text-gray-600 sm:text-lg">
            {t('website.NewSimfinDes.NewSimfinWorkDes.des')}
          </p>
        </div>

        {/* Mobile Carousel - Swipe navigation without images */}
        <div className="block md:hidden">
          <Carousel
            plugins={[autoplayPlugin.current]}
            className="w-full"
            opts={{
              align: "start",
              loop: true,
            }}
          >
            <CarouselContent className="-ml-4 pb-12">
              {steps.map((step) => (
                <CarouselItem key={step.id} className="pl-4 basis-[85%]">
                  <div className="p-1">
                    <div className="flex flex-col space-y-5 p-7 rounded-[2rem] bg-slate-50 border border-gray-100 dark:border-gray-800 shadow-sm min-h-[220px]">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white text-lg font-bold shadow-md shadow-primary/20">
                        {step.id}
                      </div>

                      <div className="space-y-3">
                        <h3 className="text-xl font-bold text-gray-900 tracking-tight">{step.title}</h3>
                        <p className="text-sm leading-relaxed text-gray-600 font-medium">{step.description}</p>
                      </div>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>

            {/* Carousel Navigation */}
            <div className="flex justify-center gap-4 mt-2">
              <CarouselPrevious className="h-11 w-11 rounded-full bg-white border-primary/20 shadow-lg static translate-y-0" />
              <CarouselNext className="h-11 w-11 rounded-full bg-white border-primary/20 shadow-lg static translate-y-0" />
            </div>
          </Carousel>
        </div>

        {/* Desktop Grid - With Images */}
        <div className="hidden md:grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {steps.map((step) => (
            <div key={step.id} className="group flex flex-col overflow-hidden rounded-[2.5rem] bg-slate-50 border border-transparent hover:border-primary/20 transition-all duration-500 hover:shadow-2xl">
              <div className="flex-1 space-y-5 p-10 sm:p-8">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white text-lg font-bold shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform">
                  {step.id}
                </div>

                <div className="space-y-3">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight leading-snug">{step.title}</h3>
                  <p className="text-base leading-relaxed text-gray-600 dark:text-gray-400 font-medium">{step.description}</p>
                </div>
              </div>

              <div className="relative flex h-[280px] items-center justify-center overflow-hidden">
                <img
                  src={step.image}
                  alt={step.title}
                  className="object-contain h-full w-full p-4 transform group-hover:scale-105 transition-transform duration-700"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowDoesItWorkSection;
