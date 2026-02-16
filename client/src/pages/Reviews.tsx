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

  const reasons = [
    {
      icon: DollarSign,
      title: 'Affordable plans',
      description:
        'Choose from hundreds of plans in over 200 countries — all at the best prices. Save every time, wherever you travel.',
    },
    {
      icon: RefreshCw,
      title: 'eSIM top-ups',
      description:
        'If your eSIM expires, top up your account and use the same eSIM. Data added automatically once current plan expires.',
    },
    {
      icon: Globe,
      title: 'One eSIM for all countries',
      description:
        'Instead of getting a new eSIM every time you travel, use the same eSIM for any country.',
    },
    {
      icon: MessageCircle,
      title: '24/7 chat support',
      description:
        'Check out the FAQ and Help Center, or contact support via email or live chat for help.',
    },
  ];

  const reviews = [
    {
      quote:
        'An affordable, easy-to-use, and sustainable eSIM service that gives reliable mobile connections from anywhere.',
      reviewer: 'Travel Magazine',
      source: 'Press',
      stars: 0,
    },
    {
      quote:
        'Easy, cheap and fast. Easy setup, super fast speed. Cheap, great coverage and helpful assistance.',
      reviewer: 'Jorge A.',
      source: 'Trustpilot',
      stars: 5,
    },
    {
      quote:
        'I can set it up at home, activate when ready, and boom! Internet on my phone when traveling. A must!',
      reviewer: 'Travel Blogger',
      source: 'User',
      stars: 0,
    },
    {
      quote:
        'Simple to buy and easy to install. Takes care of everything abroad. I love it.',
      reviewer: 'Sarah K.',
      source: 'User',
      stars: 0,
    },
    {
      quote:
        'Used across 3 countries already. Took 1 min to buy and activate. Way better than roaming.',
      reviewer: 'Domas R.',
      source: 'Trustpilot',
      stars: 5,
    },
    {
      quote:
        'Comprehensive coverage and affordable prices. Activating is straightforward — download, choose plan, surf.',
      reviewer: 'Tech Review Site',
      source: 'Tech Press',
      stars: 0,
    },
  ];

  const comparisonFeatures = [
    { feature: 'One eSIM for all destinations', values: [true, false, false, false] },
    { feature: '24/7 live chat support', values: [true, true, true, false] },
    { feature: 'Refunds', values: [true, true, true, true] },
    { feature: 'Security features', values: [true, false, false, false] },
    { feature: 'Data usage alerts', values: [true, false, false, false] },
    { feature: 'Global & regional plans', values: [true, true, true, false] },
  ];

  const providers = [siteName, 'Provider A', 'Provider B', 'Provider C'];

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Helmet>
        <title>{`${siteName} Review and Rating — Should You Get It?`}</title>
        <meta
          name="description"
          content={`Read reviews and ratings for ${siteName}. An affordable eSIM service for global travelers with coverage in 200+ countries.`}
        />
      </Helmet>

      {/* Hero Section */}
      <section className="py-16 md:py-24 lg:py-32 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight mb-4">
                {siteName} review and rating: Should you get it?
              </h1>
              <p className="text-lg md:text-xl text-gray-500 mb-8">
                An affordable eSIM service for global travelers
              </p>
              <Link href="/destinations">
                <span className="inline-flex items-center gap-2 text-[#2c7338] font-semibold text-lg hover:underline cursor-pointer">
                  View All Plans
                  <ArrowRight className="w-5 h-5" />
                </span>
              </Link>
            </div>
            <div className="bg-slate-100 rounded-2xl aspect-[4/3] flex flex-col items-center justify-center gap-4">
              <div className="flex gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="w-10 h-10 md:w-12 md:h-12 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <span className="text-gray-400 font-medium text-lg">4.8 / 5 Rating</span>
            </div>
          </div>
        </div>
      </section>

      {/* Reasons to buy */}
      <section className="py-16 md:py-24 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-10">
            Reasons to buy
          </h2>
          <div className="flex gap-6 overflow-x-auto pb-4 md:pb-0 md:grid md:grid-cols-2 md:overflow-visible scrollbar-hide">
            {reasons.map((reason, index) => (
              <div
                key={index}
                className="min-w-[280px] md:min-w-0 bg-white rounded-2xl p-8 border border-gray-100 hover:border-green-200 hover:shadow-md transition-all duration-300"
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-5"
                  style={{ backgroundColor: 'rgba(44, 115, 56, 0.1)' }}
                >
                  <reason.icon className="w-6 h-6 text-[#2c7338]" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{reason.title}</h3>
                <p className="text-gray-500 leading-relaxed">{reason.description}</p>
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
                <Quote className="w-8 h-8 text-[#2c7338] mb-4 opacity-40" />
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
      <section className="py-16 md:py-24 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-10">
            How does {siteName} compare with other eSIM providers?
          </h2>
          <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white">
            <table className="w-full min-w-[600px]">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left text-sm font-semibold text-gray-500 px-6 py-4">
                    Feature
                  </th>
                  {providers.map((provider, index) => (
                    <th
                      key={provider}
                      className={`text-center text-sm font-semibold px-6 py-4 ${index === 0
                          ? 'text-[#2c7338] bg-green-50'
                          : 'text-gray-500'
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
                    className={rowIndex < comparisonFeatures.length - 1 ? 'border-b border-gray-100' : ''}
                  >
                    <td className="text-sm text-gray-700 font-medium px-6 py-4">
                      {row.feature}
                    </td>
                    {row.values.map((value, colIndex) => (
                      <td
                        key={colIndex}
                        className={`text-center px-6 py-4 ${colIndex === 0 ? 'bg-green-50' : ''
                          }`}
                      >
                        {value ? (
                          <Check className="w-5 h-5 text-[#2c7338] mx-auto" />
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
            style={{ background: 'linear-gradient(135deg, #2c7338, #3a9c4d, #2c7338)' }}
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
              Choose the best eSIM plan for your stay
            </h2>
            <p className="text-green-100 text-lg md:text-xl max-w-2xl mx-auto mb-8">
              Browse plans for 200+ destinations and stay connected wherever you go.
            </p>
            <Link href="/destinations">
              <Button
                size="lg"
                className="bg-white hover:bg-gray-100 text-gray-900 font-semibold px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                View All Destinations
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
