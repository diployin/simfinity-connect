import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useTranslation } from '@/contexts/TranslationContext';

interface FAQSectionProps {
  limit?: number;
  showTitle?: boolean;
}

export function FAQSection({ limit, showTitle = true }: FAQSectionProps) {
  const { t } = useTranslation();

  const faqs = [
    {
      question: t('website.faq.q1', "What is an eSIM?"),
      answer: t('website.faq.a1', "An eSIM (embedded SIM) is a digital SIM that allows you to activate a cellular plan without using a physical SIM card. It's built into your device and can be programmed with different carrier profiles, making it perfect for travelers."),
    },
    {
      question: t('website.faq.q2', "How do I install an eSIM?"),
      answer: t('website.faq.a2', "After purchase, you'll receive a QR code via email. Simply go to your phone's settings, select 'Add eSIM' or 'Add Cellular Plan', and scan the QR code. The eSIM will be installed in seconds."),
    },
    {
      question: t('website.faq.q3', "Is my device compatible with eSIM?"),
      answer: t('website.faq.a3', "Most modern smartphones support eSIM, including iPhone XS and newer, Samsung Galaxy S20 and newer, Google Pixel 3 and newer, and many other devices. Check our compatibility page for a full list."),
    },
    {
      question: t('website.faq.q4', "Can I keep my WhatsApp number?"),
      answer: t('website.faq.a4', "Yes! The eSIM provides data connectivity only. Your original phone number and WhatsApp will continue to work as before. You can use both SIMs simultaneously."),
    },
    {
      question: t('website.faq.q5', "When does my data plan start?"),
      answer: t('website.faq.a5', "Your data plan activates when you first connect to a mobile network in your destination country. You can install the eSIM before you travel, and it will start working when you arrive."),
    },
    {
      question: t('website.faq.q6', "What happens if I run out of data?"),
      answer: t('website.faq.a6', "You can easily top up your data through our app or website. Additional data packages are available for purchase at any time, and they're added to your existing eSIM instantly."),
    },
  ];

  const displayFaqs = limit ? faqs.slice(0, limit) : faqs;

  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {showTitle && (
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {t('website.faq.sectionTitle', 'Frequently Asked Questions')}
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {t('website.faq.sectionSubtitle', 'Everything you need to know about Simfinity')}
            </p>
          </div>
        )}

        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            {displayFaqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="border rounded-xl px-6 bg-card"
                data-testid={`faq-item-${index}`}
              >
                <AccordionTrigger className="text-left font-semibold hover:no-underline">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
