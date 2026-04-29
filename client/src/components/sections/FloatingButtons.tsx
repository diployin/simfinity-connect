'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { MessageCircle, ArrowUp } from 'lucide-react';
import { useTranslation } from '@/contexts/TranslationContext';

export function FloatingButtons() {
  const [showBackToTop, setShowBackToTop] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 400);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="fixed bottom-24 right-4 z-40 flex flex-col gap-3 md:bottom-6">
      <Button
        size="icon"
        variant="default"
        className="rounded-full shadow-lg w-12 h-12"
        onClick={() => window.open('/account/support', '_self')}
        data-testid="button-live-chat"
        aria-label={t('website.home.floating.chat', 'Open live chat')}
      >
        <MessageCircle className="w-5 h-5" />
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-background" />
      </Button>

      {showBackToTop && (
        <Button
          size="icon"
          variant="outline"
          className="rounded-full shadow-lg w-12 h-12 bg-card"
          onClick={scrollToTop}
          data-testid="button-back-to-top"
          aria-label={t('website.home.floating.top', 'Back to top')}
        >
          <ArrowUp className="w-5 h-5" />
        </Button>
      )}
    </div>
  );
}
