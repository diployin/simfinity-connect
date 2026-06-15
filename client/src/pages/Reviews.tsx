import {
  Star,
  Check,
  X,
  ArrowRight,
  DollarSign,
  RefreshCw,
  Globe,
  MessageCircle,
  Quote,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Helmet } from 'react-helmet-async';
import { useSettingByKey } from '@/hooks/useSettings';
import { Link } from 'wouter';
import { useTranslation } from '@/contexts/TranslationContext';

function StarRating({ count = 5 }: { count?: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: count }).map((_, i) => (
        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
      ))}
    </div>
  );
}

export function Reviews() {
  const siteName = useSettingByKey('platform_name') || 'Simfinity';
  const { t } = useTranslation();

  const reasons = [
    {
      icon: DollarSign,
      title: t('website.reviews.reason1Title', 'Affordable plans'),
      description:
        t('website.reviews.reason1Desc', 'Choose from hundreds of plans in over 200 countries — all at the best prices. Save every time, wherever you travel.'),
    },
    {
      icon: RefreshCw,
      title: t('website.reviews.reason2Title', 'eSIM top-ups'),
      description:
        t('website.reviews.reason2Desc', 'If your eSIM expires, top up your account and use the same eSIM. Data added automatically once current plan expires.'),
    },
    {
      icon: Globe,
      title: t('website.reviews.reason3Title', 'One eSIM for all countries'),
      description:
        t('website.reviews.reason3Desc', 'Instead of getting a new eSIM every time you travel, use the same eSIM for any country.'),
    },
    {
      icon: MessageCircle,
      title: t('website.reviews.reason4Title', '24/7 chat support'),
      description:
        t('website.reviews.reason4Desc', 'Check out the FAQ and Help Center, or contact support via email or live chat for help.'),
    },
  ];

  const reviews = [
    {
      quote: t('website.reviews.review1Quote', 'An affordable, easy-to-use, and sustainable eSIM service that gives reliable mobile connections from anywhere.'),
      reviewer: t('website.reviews.review1Author', 'Travel Magazine'),
      source: t('website.reviews.review1Source', 'Press'),
      stars: 0,
    },
    {
      quote: t('website.reviews.review2Quote', 'Easy, cheap and fast. Easy setup, super fast speed. Cheap, great coverage and helpful assistance.'),
      reviewer: t('website.reviews.review2Author', 'Jorge A.'),
      source: t('website.reviews.review2Source', 'Trustpilot'),
      stars: 5,
    },
    {
      quote: t('website.reviews.review3Quote', 'I can set it up at home, activate when ready, and boom! Internet on my phone when traveling. A must!'),
      reviewer: t('website.reviews.review3Author', 'Travel Blogger'),
      source: t('website.reviews.review3Source', 'User'),
      stars: 0,
    },
    {
      quote: t('website.reviews.review4Quote', 'Simple to buy and easy to install. Takes care of everything abroad. I love it.'),
      reviewer: t('website.reviews.review4Author', 'Sarah K.'),
      source: t('website.reviews.review4Source', 'User'),
      stars: 0,
    },
    {
      quote: t('website.reviews.review5Quote', 'Used across 3 countries already. Took 1 min to buy and activate. Way better than roaming.'),
      reviewer: t('website.reviews.review5Author', 'Domas R.'),
      source: t('website.reviews.review5Source', 'Trustpilot'),
      stars: 5,
    },
    {
      quote: t('website.reviews.review6Quote', 'Comprehensive coverage and affordable prices. Activating is straightforward — download, choose plan, surf.'),
      reviewer: t('website.reviews.review6Author', 'Tech Review Site'),
      source: t('website.reviews.review6Source', 'Tech Press'),
      stars: 0,
    },
  ];

  const comparisonFeatures = [
    { feature: t('website.reviews.compFeat1', 'One eSIM for all destinations'), values: [true, false, false, false] },
    { feature: t('website.reviews.compFeat2', '24/7 live chat support'), values: [true, true, true, false] },
    { feature: t('website.reviews.compFeat3', 'Refunds'), values: [true, true, true, true] },
    { feature: t('website.reviews.compFeat4', 'Security features'), values: [true, false, false, false] },
    { feature: t('website.reviews.compFeat5', 'Data usage alerts'), values: [true, false, false, false] },
    { feature: t('website.reviews.compFeat6', 'Global & regional plans'), values: [true, true, true, false] },
  ];

  const providersList = [siteName, t('website.reviews.providerA', 'Provider A'), t('website.reviews.providerB', 'Provider B'), t('website.reviews.providerC', 'Provider C')];


  return (
    <div className="min-h-screen bg-background dark:bg-gray-950 dark:text-gray-100 flex flex-col transition-colors duration-300">
      <Helmet>
        <title>{t('website.reviews.pageTitle', '{{siteName}} Review and Rating — Should You Get It?', { siteName })}</title>
        <meta
          name="description"
          content={t('website.reviews.pageMeta', 'Read reviews and ratings for {{siteName}}. An affordable eSIM service for global travelers with coverage in 200+ countries.', { siteName })}
        />
      </Helmet>

      {/* Hero Section */}
      <section className="py-16 md:py-24 lg:py-32 bg-white dark:bg-gray-950">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white leading-tight mb-4">
                {t('website.reviews.heroTitle', '{{siteName}} review and rating: Should you get it?', { siteName })}
              </h1>
              <p className="text-lg md:text-xl text-gray-500 dark:text-gray-400 mb-8">
                {t('website.reviews.heroSubtitle', 'An affordable eSIM service for global travelers')}
              </p>
              <Link href="/destinations">
                <span className="inline-flex items-center gap-2 text-[var(--primary)] font-semibold text-lg hover:underline cursor-pointer">
                  {t('website.reviews.viewAllPlans', 'View All Plans')}
                  <ArrowRight className="w-5 h-5" />
                </span>
              </Link>
            </div>
            <div className="bg-slate-100 dark:bg-gray-900 rounded-2xl aspect-[4/3] flex flex-col items-center justify-center gap-4 border border-slate-200 dark:border-gray-800">
              <div className="flex gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="w-10 h-10 md:w-12 md:h-12 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <span className="text-gray-500 dark:text-gray-400 font-medium text-lg">{t('website.reviews.ratingLabel', '4.8 / 5 Rating')}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Reasons to buy */}
      <section className="py-16 md:py-24 bg-background dark:bg-gray-950">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-10 text-gray-900 dark:text-white">
            {t('website.reviews.reasonsToBuy', 'Reasons to buy')}
          </h2>
          <div className="flex gap-6 overflow-x-auto pb-4 md:pb-0 md:grid md:grid-cols-2 md:overflow-visible scrollbar-hide">
            {reasons.map((reason, index) => (
              <div
                key={index}
                className="min-w-[280px] md:min-w-0 bg-white dark:bg-gray-900 rounded-2xl p-8 border border-gray-100 dark:border-gray-800 hover:border-green-200 dark:hover:border-primary/30 hover:shadow-md transition-all duration-300"
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 bg-primary/10 dark:bg-primary/20"
                >
                  <reason.icon className="w-6 h-6 text-[var(--primary)]" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{reason.title}</h3>
                <p className="text-gray-500 dark:text-gray-400 leading-relaxed">{reason.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What do customers say */}
      {/* <section className="py-16 md:py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-10">
            What do customers say
          </h2>
          <div className="flex gap-6 overflow-x-auto pb-4 md:pb-0 md:grid md:grid-cols-2 lg:grid-cols-3 md:overflow-visible scrollbar-hide">
            {reviews.map((review, index) => (
              <div
                key={index}
                className="min-w-[300px] md:min-w-0 bg-slate-50 rounded-2xl p-8 border border-gray-100 hover:shadow-md transition-all duration-300 flex flex-col"
              >
                <Quote className="w-8 h-8 text-[var(--primary)] mb-4 opacity-40" />
                <p className="text-gray-700 leading-relaxed mb-6 flex-1">
                  "{review.quote}"
                </p>
                {review.stars > 0 && (
                  <div className="mb-3">
                    <StarRating count={review.stars} />
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-gray-900">{review.reviewer}</span>
                  <span
                    className="text-xs font-medium px-3 py-1 rounded-full"
                    style={{
                      backgroundColor:
                        review.source === 'Trustpilot'
                          ? 'rgba(0, 182, 122, 0.1)'
                          : review.source === 'Press' || review.source === 'Tech Press'
                            ? 'rgba(59, 130, 246, 0.1)'
                            : 'rgba(107, 114, 128, 0.1)',
                      color:
                        review.source === 'Trustpilot'
                          ? '#00b67a'
                          : review.source === 'Press' || review.source === 'Tech Press'
                            ? '#3b82f6'
                            : '#6b7280',
                    }}
                  >
                    {review.source}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section> */}

      {/* Comparison Table */}
      <section className="py-16 md:py-24 bg-slate-50 dark:bg-gray-900/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-10">
            {t('website.reviews.comparisonTitle', 'How does {{siteName}} compare with other eSIM providers?', { siteName })}
          </h2>
          <div className="overflow-x-auto rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
            <table className="w-full min-w-[600px]">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-800">
                  <th className="text-left text-sm font-semibold text-gray-500 dark:text-gray-400 px-6 py-4">
                    {t('website.reviews.featureColumn', 'Feature')}
                  </th>
                  {providersList.map((provider, index) => (
                    <th
                      key={provider + index}
                      className={`text-center text-sm font-semibold px-6 py-4 ${index === 0
                        ? 'text-[var(--primary)] bg-green-50 dark:bg-gray-900'
                        : 'text-gray-500 dark:text-gray-400'
                        }`}
                    >
                      {provider}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {comparisonFeatures.map((row, rowIndex) => (
                  <tr
                    key={rowIndex}
                    className={rowIndex < comparisonFeatures.length - 1 ? 'border-b border-gray-100 dark:border-gray-800' : ''}
                  >
                    <td className="text-sm text-gray-700 dark:text-gray-300 font-medium px-6 py-4">
                      {row.feature}
                    </td>
                    {row.values.map((value, colIndex) => (
                      <td
                        key={colIndex}
                        className={`text-center px-6 py-4 ${colIndex === 0 ? 'bg-green-50 dark:bg-gray-900' : ''
                          }`}
                      >
                        {value ? (
                          <Check className="w-5 h-5 text-[var(--primary)] mx-auto" />
                        ) : (
                          <X className="w-5 h-5 text-red-400 mx-auto" />
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className="rounded-3xl px-8 py-16 md:px-16 md:py-20 text-center"
            style={{ background: 'linear-gradient(135deg, var(--primary), #3a9c4d, var(--primary))' }}
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
              {t('website.reviews.ctaTitle', 'Choose the best eSIM plan for your stay')}
            </h2>
            <p className="text-green-100 text-lg md:text-xl max-w-2xl mx-auto mb-8">
              {t('website.reviews.ctaDesc', 'Browse plans for 200+ destinations and stay connected wherever you go.')}
            </p>
            <Link href="/destinations">
              <Button
                size="lg"
                className="bg-white hover:bg-gray-100 text-gray-900 font-semibold px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                {t('website.reviews.viewAllDestinations', 'View All Destinations')}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Reviews;