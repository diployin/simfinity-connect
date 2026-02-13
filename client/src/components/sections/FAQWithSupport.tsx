import { Link } from 'wouter';
import { MessageCircle, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { useTranslation } from '@/contexts/TranslationContext';
import { useSettingByKey } from '@/hooks/useSettings';

export function FAQWithSupport() {
  const { t } = useTranslation();
  const siteName = useSettingByKey('platform_name');

  const faqs = [
    {
      questionKey: 'website.home.faq.q1.question',
      answerKey: 'website.home.faq.q1.answer',
      questionFallback: 'What is an eSIM and how does it work?',
      answerFallback:
        'An eSIM is a built-in digital SIM that lets you activate a mobile data plan without a physical card. Just choose a plan, scan a QR code, and connect instantly when you travel.',
    },
    {
      questionKey: 'website.home.faq.q2.question',
      answerKey: 'website.home.faq.q2.answer',
      questionFallback: 'How do I set up my eSIM on my phone?',
      answerFallback:
        "After purchase, you'll receive an email with a QR code. Open your phone's settings, scan the code, and follow the quick setup guide to start using data.",
    },
    {
      questionKey: 'website.home.faq.q3.question',
      answerKey: 'website.home.faq.q3.answer',
      questionFallback: 'Can I use my physical SIM and eSIM together?',
      answerFallback:
        'Yes. You can keep your regular SIM for calls and SMS while using your eSIM for data during international travel.',
    },
    {
      questionKey: 'website.home.faq.q4.question',
      answerKey: 'website.home.faq.q4.answer',
      questionFallback: `Where does ${siteName} work? `,
      answerFallback:
        'Our data plans cover over 200 destinations across Europe, Asia, the Americas, and more — giving you high-speed internet without roaming fees.',
    },
    {
      questionKey: 'website.home.faq.q5.question',
      answerKey: 'website.home.faq.q5.answer',
      questionFallback: 'Can I top up or reuse my plan?',
      answerFallback:
        'Yes. Some plans let you add more data or extend your validity directly from your account dashboard, so you can stay connected without buying a new QR code.',
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-white dark:bg-zinc-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            {t('website.home.faq.title', 'Frequently Asked Questions')}
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {t('website.home.faq.subtitle', 'Find answers to common questions about eSIMs and how we can help you stay connected while traveling')}
          </p>
        </div>

        <div className="max-w-3xl mx-auto mb-16">
          <Accordion type="single" collapsible className="space-y-3">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="border border-zinc-100 dark:border-zinc-800 rounded-xl px-6 bg-white dark:bg-zinc-900"
                data-testid={`faq-item-${index}`}
              >
                <AccordionTrigger className="text-left font-semibold text-foreground hover:no-underline py-5">
                  {t(faq.questionKey, faq.questionFallback)}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-5">
                  {t(faq.answerKey, faq.answerFallback)}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        <div className="max-w-3xl mx-auto text-center">
          <h3 className="text-xl font-semibold text-foreground mb-2">
            {t('website.home.faq.support.title', 'Still have questions?')}
          </h3>
          <p className="text-muted-foreground mb-6">
            {t(
              'website.home.faq.support.description',
              "Can't find what you're looking for? Our support team is available 24/7 by email or chat to guide you through setup and troubleshooting.",
            )}
          </p>
          <Link href="/account/support">
            <Button
              variant="outline"
              className="rounded-full border-[#3d9a4d] dark:border-[#1e5427] text-foreground hover:bg-zinc-100 dark:hover:bg-zinc-800"
              data-testid="button-help-center"
            >
              {t('website.home.faq.support.button', 'Visit Help Center')}
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
