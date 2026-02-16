import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { useTranslation } from '@/contexts/TranslationContext';
import { useQuery } from '@tanstack/react-query';

interface Faq {
  id: string;
  question: string;
  answer: string;
  categoryId: string;
  position: number;
}

interface FaqCategory {
  id: string;
  name: string;
  slug: string;
  faqs: Faq[];
}

export function FAQWithSupport() {
  const { t } = useTranslation();

  const { data: categories, isLoading } = useQuery({
    queryKey: ['/api/faqs/public'],
    queryFn: async () => {
      const response = await fetch('/api/faqs/public');
      if (!response.ok) throw new Error('Failed to fetch FAQs');
      const result = await response.json();
      return result.data as FaqCategory[];
    },
  });

  if (isLoading) {
    return (
      <section className="py-16 md:py-24 bg-white dark:bg-zinc-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              {t('website.home.faq.title', 'Frequently Asked Questions')}
            </h2>
            <div className="animate-pulse space-y-4 max-w-3xl mx-auto">
              <div className="h-12 bg-zinc-100 dark:bg-zinc-800 rounded-xl" />
              <div className="h-12 bg-zinc-100 dark:bg-zinc-800 rounded-xl" />
              <div className="h-12 bg-zinc-100 dark:bg-zinc-800 rounded-xl" />
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Flatten FAQs for display if just a list, or show grouped. 
  // Given the previous design was a simple list, displaying grouped might be better if there are many.
  // Converting to a flat list for now to match the "FAQ section" look, or we can render categories.
  // Let's render categories if there are multiple, otherwise just the FAQs.

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

        <div className="max-w-3xl mx-auto mb-16 space-y-8">
          {categories?.map((category) => (
            <div key={category.id} className="space-y-4">
              {categories.length > 1 && (
                <h3 className="text-xl font-semibold text-foreground">{category.name}</h3>
              )}
              <Accordion type="single" collapsible className="space-y-3">
                {category.faqs.map((faq, index) => (
                  <AccordionItem
                    key={faq.id}
                    value={`item-${category.id}-${index}`}
                    className="border border-zinc-100 dark:border-zinc-800 rounded-xl px-6 bg-white dark:bg-zinc-900"
                    data-testid={`faq-item-${index}`}
                  >
                    <AccordionTrigger className="text-left font-semibold text-foreground hover:no-underline py-5">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground pb-5">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          ))}

          {(!categories || categories.length === 0) && (
            <p className="text-center text-muted-foreground">No FAQs available at the moment.</p>
          )}
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
