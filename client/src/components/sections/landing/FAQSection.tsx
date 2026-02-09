'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import FAQ from '@/components/common/FAQ';

interface Faq {
  id: string;
  question: string;
  answer: string;
}

interface FaqCategory {
  id: string;
  name: string;
  faqs: Faq[];
}

const FAQSection = () => {
  const title = 'Frequently asked questions';

  const { data, isLoading, isError } = useQuery({
    queryKey: ['/api/faqs/public'],
    queryFn: async () => {
      const response = await fetch('/api/faqs/public');
      if (!response.ok) {
        throw new Error('Failed to fetch FAQs');
      }
      const result = await response.json();
      return result.data as FaqCategory[];
    },
  });

  // 🔹 Flatten all categories into a single FAQ list
  const faqs: Faq[] = data?.flatMap((category) => category.faqs) ?? [];

  console.log(faqs);

  // 🔹 Loading state
  if (isLoading) {
    return <div className="py-10 text-center text-muted-foreground">Loading FAQs...</div>;
  }

  // 🔹 Error state
  if (isError) {
    return (
      <div className="py-10 text-center text-red-500">
        Failed to load FAQs. Please try again later.
      </div>
    );
  }

  // 🔹 Empty state
  if (!faqs.length) {
    return <div className="py-10 text-center text-muted-foreground">No FAQs available.</div>;
  }

  return <FAQ title={title} faqs={faqs} />;
};

export default FAQSection;
