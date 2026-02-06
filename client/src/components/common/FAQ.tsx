import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { useTranslation } from '@/contexts/TranslationContext';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

interface FAQSectionProps {
  titleKey?: string;
  subtitleKey?: string;
  bgColor?: string;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl';
  showBorder?: boolean;
  className?: string;
  title?: string;
  faqs: FAQItem[];
}

const FAQ: React.FC<FAQSectionProps> = ({
  titleKey = 'website.NewSimfinDes.download_esim_app.DowonloadEsim.FAQData.title',
  subtitleKey,
  bgColor = 'bg-white',
  maxWidth = '3xl',
  showBorder = true,
  className = '',
  faqs,
}) => {
  const { t } = useTranslation();

  const title = titleKey ? t(titleKey) : '';
  const subtitle = subtitleKey ? t(subtitleKey) : undefined;

  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '3xl': 'max-w-3xl',
    '4xl': 'max-w-4xl',
  };

  if (!faqs || faqs.length === 0) {
    return null;
  }

  return (
    <section className={`w-full ${bgColor} py-8 sm:py-20 md:py-16 lg:py-16 ${className}`}>
      <div className="containers">
        {/* Header */}
        <div className="mb-6 text-center sm:mb-10">
          <h2 className="lg:text-4.5xl mx-auto mb-4 max-w-2xl text-center text-3xl leading-tight font-medium text-black sm:text-4xl">
            {title}
          </h2>

          {subtitle && (
            <p className="mx-auto max-w-2xl text-base text-gray-600 sm:text-lg">
              {subtitle}
            </p>
          )}
        </div>

        {/* FAQ Accordion */}
        <div className={`${maxWidthClasses[maxWidth]} mx-auto`}>
          <Accordion type="single" collapsible className="w-full space-y-4">
            {faqs.map((faq) => (
              <AccordionItem
                key={faq.id}
                value={faq.id}
                className={`bg-white ${showBorder ? 'border border-gray-200' : ''
                  } rounded-2xl px-6 data-[state=open]:shadow-sm sm:px-8`}
              >
                <AccordionTrigger className="cursor-pointer py-6 text-left text-base font-medium text-black hover:no-underline sm:text-xl">
                  {faq.question}
                </AccordionTrigger>

                <AccordionContent className="pb-6 text-sm leading-relaxed font-normal text-gray-600 sm:text-base">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
