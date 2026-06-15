import { Link } from 'wouter';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import useEmblaCarousel from 'embla-carousel-react';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from '@/contexts/TranslationContext';
import { useSettingByKey } from '@/hooks/useSettings';
import { useQuery } from '@tanstack/react-query';

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${i < rating ? 'fill-amber-400 text-amber-400' : 'fill-gray-200 text-gray-200'
            }`}
        />
      ))}
    </div>
  );
}

interface Testimonial {
  name: string;
  handle: string;
  rating: number;
  content: string;
  initials: string;
}

function TestimonialCard({ testimonial, index }: { testimonial: Testimonial; index: number }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div
      className="mb-4 bg-white dark:bg-zinc-800 rounded-2xl p-6 shadow-sm border border-zinc-100 dark:border-zinc-700/50 flex flex-col h-[280px] w-full"
      data-testid={`testimonial-card-${index}`}
    >
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-bold text-zinc-900 dark:text-zinc-100 text-sm truncate">{testimonial?.name}</h4>
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <span className="text-emerald-500">
            <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
          </span>
          <span className="text-xs font-semibold text-zinc-600 dark:text-zinc-400">Trustpilot</span>
        </div>
      </div>

      <div className={`flex-1 ${isExpanded ? 'overflow-y-auto' : 'overflow-hidden'} pr-2 scrollbar-thin`}>
        <p className={`text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed mb-4 ${!isExpanded ? 'line-clamp-[8]' : ''}`}>
          {testimonial?.content}
        </p>
      </div>

      <div className="mt-auto pt-4 border-t border-zinc-100 dark:border-zinc-700">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-xs font-medium text-emerald-600 dark:text-emerald-400 hover:underline mb-3 block"
        >
          {isExpanded ? 'Read Less' : 'Read More'}
        </button>
        <div className="flex items-center gap-1.5">
          <span className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">{testimonial?.rating}</span>
          <StarRating rating={testimonial?.rating} />
        </div>
      </div>
    </div>
  );
}

function FeaturedQuoteCard({ testimonial, siteName }: { testimonial: Testimonial; siteName: string | undefined }) {
  const { t } = useTranslation();

  return (
    <div className="mb-4 bg-white dark:bg-zinc-800 rounded-2xl p-6 shadow-sm border border-zinc-100 dark:border-zinc-700/50 flex flex-col h-[280px] w-full">
      <div className="text-4xl font-serif text-primary/30 dark:text-primary/40 leading-none mb-3">&ldquo;</div>
      <div className="flex-1 overflow-y-auto pr-2 scrollbar-thin">
        <p className="text-sm md:text-base font-medium text-zinc-800 dark:text-zinc-100 leading-relaxed mb-4">
          {t(
            'website.home.testimonials.featuredQuote',
            `${siteName} makes staying connected abroad effortless. Fast setup, reliable coverage, and no hidden fees — exactly what every traveler needs.`,
          )}
        </p>
      </div>
      <div className="mt-auto pt-4 border-t border-zinc-100 dark:border-zinc-700">
        <span className="text-xs font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
          {t('website.home.testimonials.partnerName', 'Lonely Planet')}
        </span>
      </div>
    </div>
  );
}

function PressCard({ siteName }: { siteName: string | undefined }) {
  const { t } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="mb-4 bg-white dark:bg-zinc-800 rounded-2xl p-6 shadow-sm border border-zinc-100 dark:border-zinc-700/50 flex flex-col h-[280px] w-full">
      <div className="flex items-center gap-1.5 mb-3 flex-shrink-0">
        <svg viewBox="0 0 24 24" className="h-4 w-4 text-red-500 fill-current">
          <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
        </svg>
        <span className="text-xs font-semibold text-zinc-600 dark:text-zinc-400">YouTube</span>
      </div>
      <div className={`flex-1 ${isExpanded ? 'overflow-y-auto' : 'overflow-hidden'} pr-2 scrollbar-thin`}>
        <p className={`text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed ${!isExpanded ? 'line-clamp-6' : ''}`}>
          {t(
            'website.home.testimonials.pressQuote',
            `"One of the best eSIM services for international travelers — easy setup, great coverage, and competitive pricing."`,
          )}
        </p>
      </div>
      <div className="mt-auto pt-4 border-t border-zinc-100 dark:border-zinc-700">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-xs font-medium text-emerald-600 dark:text-emerald-400 hover:underline mb-2 block"
        >
          {isExpanded ? 'Read Less' : 'Read More'}
        </button>
        <p className="text-xs text-zinc-400 dark:text-zinc-500 font-medium">
          {t('website.home.testimonials.pressSource', 'Tech Travel Review')}
        </p>
      </div>
    </div>
  );
}

export function TravelerTestimonials() {
  const { t } = useTranslation();
  const siteName = useSettingByKey('platform_name');
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: 'start',
    slidesToScroll: 1,
  });
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  // Fetch approved reviews from backend
  const { data: publicReviewsResponse } = useQuery<any>({
    queryKey: ['/api/reviews/public'],
  });

  const dbReviews = publicReviewsResponse?.reviews || [];

  const staticTestimonials: Testimonial[] = [
    {
      name: 'Marcus W.',
      handle: 'Travel Blog Contributor',
      rating: 5,
      content: t(
        'website.home.testimonials.t1',
        `I tried ${siteName} on a recent trip and it just worked without any fuss. Setup took a couple of minutes and I had data as soon as I landed. It’s the kind of thing you don’t think about once it’s running, which is exactly what you want.`,
      ),
      initials: 'MW',
    },
    {
      name: 'Priya S.',
      handle: 'Trustpilot',
      rating: 5,
      content: t(
        'website.home.testimonials.t2',
        "I’m not very techy, so I was expecting this to be annoying to set up, but it was actually really straightforward. No swapping SIM cards or dealing with roaming charges. Used it across a few countries in Europe and didn’t run into any issues.",
      ),
      initials: 'PS',
    },
    {
      name: 'James M.',
      handle: 'Trustpilot',
      rating: 5,
      content: t(
        'website.home.testimonials.t3',
        "The QR code came through instantly and activation was quick. Coverage was solid in most places I visited, even outside the main cities. Speeds dipped a bit in rural areas, but overall it did the job well.",
      ),
      initials: 'JM',
    },
    {
      name: 'Emma Thompson',
      handle: '@emmathompson',
      rating: 4,
      content: t(
        'website.home.testimonials.t5',
        `I've tried other eSIMs before, but ${siteName} was by far the easiest to activate. Customer support helped me within minutes when I had a question.`,
      ),
      initials: 'ET',
    },
    {
      name: 'Luca Rossi',
      handle: '@lucarossi',
      rating: 5,
      content: t(
        'website.home.testimonials.t6',
        "I used it across France, Belgium, and Italy with one single plan. The signal was strong, and I didn't have to worry about extra charges.",
      ),
      initials: 'LR',
    },
  ];

  const dbTestimonials: Testimonial[] = dbReviews.map((r: any) => {
    const userName = r.manualCustomerName || r.user?.name || 'Verified Traveler';
    const destinationName = r.package?.destination?.name || '';
    const destinationFlag = r.package?.destination?.flagEmoji || '';
    const packageName = r.manualPackageName || r.package?.title || 'eSIM Plan';

    return {
      name: userName,
      handle: destinationName ? `${packageName} (${destinationName} ${destinationFlag})` : packageName,
      rating: r.rating,
      content: r.comment,
      initials: userName
        .split(' ')
        .map((n: string) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2) || 'VT',
    };
  });

  const displayTestimonials = dbTestimonials.length > 0 ? dbTestimonials : staticTestimonials;

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);
    return () => {
      emblaApi.off('select', onSelect);
      emblaApi.off('reInit', onSelect);
    };
  }, [emblaApi, onSelect]);

  return (
    <section className="py-16 md:py-24 bg-zinc-50 dark:bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 md:mb-14">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-zinc-900 dark:text-zinc-100 mb-3">
            {t('website.home.testimonials.title', `${siteName} reviews from travelers`)}
          </h2>
          <p className="text-base md:text-lg text-zinc-500 dark:text-zinc-400 max-w-2xl mx-auto">
            {t(
              'website.home.testimonials.subtitle',
              `Check out what fellow travelers are saying about ${siteName}!`,
            )}
          </p>
        </div>

        <div className="md:hidden">
          <div className="flex items-center justify-end gap-2 mb-4">
            <Button
              size="icon"
              variant="outline"
              onClick={scrollPrev}
              disabled={!canScrollPrev}
              className="rounded-full h-8 w-8"
              data-testid="button-testimonial-prev"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant="outline"
              onClick={scrollNext}
              disabled={!canScrollNext}
              className="rounded-full h-8 w-8"
              data-testid="button-testimonial-next"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex gap-4">
              {displayTestimonials.map((testimonial, index) => (
                <div key={index} className="flex-shrink-0 w-[85%]">
                  <TestimonialCard testimonial={testimonial} index={index} />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="hidden md:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {displayTestimonials[1] && <TestimonialCard testimonial={displayTestimonials[1]} index={1} />}
          {displayTestimonials[2] && <TestimonialCard testimonial={displayTestimonials[2]} index={2} />}

          <FeaturedQuoteCard testimonial={displayTestimonials[0] || staticTestimonials[0]} siteName={siteName} />

          {displayTestimonials[3] && <TestimonialCard testimonial={displayTestimonials[3]} index={3} />}
          <PressCard siteName={siteName} />

          {displayTestimonials[4] && <TestimonialCard testimonial={displayTestimonials[4]} index={4} />}
          {displayTestimonials[5] && <TestimonialCard testimonial={displayTestimonials[5]} index={5} />}

          {/* Render any additional reviews dynamically */}
          {displayTestimonials.slice(6).map((testimonial, index) => (
            <TestimonialCard key={index + 6} testimonial={testimonial} index={index + 6} />
          ))}
        </div>

        <div className="text-center mt-10">
          <Link href="/destinations">
            <Button
              variant="outline"
              className="rounded-full px-6"
              data-testid="button-view-all-destinations"
            >
              {t('website.home.testimonials.viewAll', 'View all destinations')}
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}