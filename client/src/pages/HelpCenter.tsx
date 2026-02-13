import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  Search,
  ChevronDown,
  ChevronUp,
  PlayCircle,
  CreditCard,
  Wrench,
  HelpCircle,
  Mail,
  MessageSquare,
  Plus,
  Minus,
} from 'lucide-react';
import { useSettingByKey } from '@/hooks/useSettings';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';

interface Article {
  title: string;
  content: string;
}

interface Category {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  accentColor: string;
  borderColor: string;
  bgColor: string;
  articles: Article[];
}

const categories: Category[] = [
  {
    id: 'getting-started',
    title: 'Getting Started with Simfinity',
    description: 'Learn the basics of eSIM technology and how to get connected.',
    icon: <PlayCircle className="h-6 w-6" />,
    accentColor: 'text-green-600',
    borderColor: 'border-l-green-500',
    bgColor: 'bg-green-50',
    articles: [
      {
        title: 'What is an eSIM and how does it work?',
        content:
          'An eSIM (embedded SIM) is a digital SIM built into your device. Unlike physical SIM cards, eSIMs can be activated remotely. Simply download a data plan, scan a QR code, and connect instantly.',
      },
      {
        title: 'How do I install the eSIM on iOS?',
        content:
          'Go to Settings > Cellular > Add eSIM > Use QR Code. Scan the QR code from your Simfinity account. Toggle on Data Roaming and select the eSIM as your data line.',
      },
      {
        title: 'How do I install the eSIM on Android?',
        content:
          'Go to Settings > Network & Internet > SIMs > Add eSIM. Scan the QR code from your Simfinity account. Enable Data Roaming in mobile network settings.',
      },
      {
        title: 'Which devices support eSIM?',
        content:
          'Most modern smartphones support eSIM including iPhone XR and newer, Samsung Galaxy S20 and newer, Google Pixel 3 and newer, and many other devices. Check our Supported Devices page for a full list.',
      },
      {
        title: 'How do I activate my eSIM?',
        content:
          "After purchasing a plan, you'll receive a QR code via email and in your account. Scan it with your device's camera or eSIM settings. Your eSIM will activate when you arrive at your destination.",
      },
    ],
  },
  {
    id: 'plans-payments',
    title: 'Plans and Payments',
    description: 'Information about pricing, payment methods, and billing.',
    icon: <CreditCard className="h-6 w-6" />,
    accentColor: 'text-blue-600',
    borderColor: 'border-l-blue-500',
    bgColor: 'bg-blue-50',
    articles: [
      {
        title: 'What payment methods are accepted?',
        content:
          'We accept Visa, Mastercard, American Express, PayPal, Apple Pay, Google Pay, and other local payment methods depending on your region.',
      },
      {
        title: 'Can I get a refund?',
        content:
          "Yes, you can request a refund if your eSIM hasn't been activated. Once activated, refunds are handled on a case-by-case basis. Contact support for assistance.",
      },
      {
        title: 'How do I top up my data plan?',
        content:
          'Open the Simfinity app, go to your active eSIM, and tap "Top Up." Choose a new data package and confirm. The new data will be added to your existing plan.',
      },
      {
        title: 'Do plans auto-renew?',
        content:
          'No, our plans do not auto-renew. When your data or validity period expires, you can manually purchase a new plan or top up.',
      },
      {
        title: 'How do I check my remaining data?',
        content:
          'Open the Simfinity app and view your active eSIM dashboard. It shows remaining data, days left, and usage statistics in real-time.',
      },
    ],
  },
  {
    id: 'troubleshooting',
    title: 'Troubleshooting',
    description: 'Solutions for common issues and technical problems.',
    icon: <Wrench className="h-6 w-6" />,
    accentColor: 'text-orange-600',
    borderColor: 'border-l-orange-500',
    bgColor: 'bg-orange-50',
    articles: [
      {
        title: "My eSIM isn't connecting to the network",
        content:
          "Ensure Data Roaming is enabled, restart your device, check that the eSIM is selected as your data line, and verify you're in a supported coverage area.",
      },
      {
        title: "I can't scan the QR code",
        content:
          'Make sure your camera is focused and the QR code is displayed clearly. Try adjusting brightness or distance. You can also enter the activation code manually in your eSIM settings.',
      },
      {
        title: 'Slow internet speeds',
        content:
          'Try toggling airplane mode on and off, switching between 4G/5G, or moving to an area with better coverage. Network speeds depend on local carrier infrastructure.',
      },
      {
        title: 'How to remove an eSIM',
        content:
          'Go to Settings > Cellular (iOS) or Network (Android) > Select the eSIM > Remove eSIM. Note: removing an eSIM is permanent and any remaining data will be lost.',
      },
      {
        title: 'eSIM not showing in settings',
        content:
          'Verify your device supports eSIM, check if your carrier has eSIM restrictions, restart your device, and try reinstalling the eSIM profile.',
      },
    ],
  },
  {
    id: 'faq',
    title: 'FAQ',
    description: 'Answers to the most frequently asked questions.',
    icon: <HelpCircle className="h-6 w-6" />,
    accentColor: 'text-purple-600',
    borderColor: 'border-l-purple-500',
    bgColor: 'bg-purple-50',
    articles: [
      {
        title: 'Can I use eSIM and physical SIM at the same time?',
        content:
          'Yes! Most eSIM-compatible devices support Dual SIM (one physical + one eSIM). You can use your regular number for calls and the eSIM for data.',
      },
      {
        title: 'Do I need Wi-Fi to install an eSIM?',
        content:
          'Yes, you need an internet connection (Wi-Fi or mobile data) to download and install the eSIM profile. We recommend installing before your trip.',
      },
      {
        title: 'Can I share my eSIM data with others?',
        content:
          "The eSIM data plan is tied to your device and cannot be directly shared. However, you can use your phone's hotspot feature to share internet with other devices.",
      },
      {
        title: 'What happens when my data runs out?',
        content:
          'Your internet connection will stop working but your eSIM remains installed. You can purchase a top-up or a new plan to continue using data.',
      },
      {
        title: 'Is my personal data safe?',
        content:
          'Yes. We use industry-standard encryption and never share your personal information with third parties. Your data is protected under our comprehensive privacy policy.',
      },
    ],
  },
];

export default function HelpCenter() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [expandedArticles, setExpandedArticles] = useState<Set<string>>(new Set());
  const siteName = useSettingByKey('site_name');

  const toggleArticle = (articleKey: string) => {
    setExpandedArticles((prev) => {
      const next = new Set(prev);
      if (next.has(articleKey)) {
        next.delete(articleKey);
      } else {
        next.add(articleKey);
      }
      return next;
    });
  };

  const handleCategoryClick = (categoryId: string) => {
    setSelectedCategory((prev) => (prev === categoryId ? null : categoryId));
  };

  const filteredCategories = categories
    .map((category) => ({
      ...category,
      articles: category.articles.filter(
        (article) =>
          article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          article.content.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    }))
    .filter((category) => category.articles.length > 0);

  const displayedCategories = searchQuery
    ? filteredCategories
    : selectedCategory
      ? categories.filter((c) => c.id === selectedCategory)
      : categories;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Helmet>
        <title>Help Center | {siteName || 'Simfinity'}</title>
        <meta
          name="description"
          content="Get help with your eSIM. Find answers about installation, plans, payments, troubleshooting, and more."
        />
      </Helmet>

      <section
        className="relative overflow-hidden"
        style={{
          background: 'linear-gradient(180deg, #f0f9f1 0%, #ffffff 100%)',
        }}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
              How can we help you?
            </h1>
            <p className="text-lg text-gray-500 mb-8">
              Search our knowledge base or browse categories below
            </p>
            <div className="max-w-xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="search"
                  placeholder="Search for answers..."
                  className="w-full pl-12 pr-4 h-14 text-base rounded-xl border border-gray-200 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-[#2c7338]/30 focus:border-[#2c7338] transition-all"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {!searchQuery && (
        <section className="py-12 md:py-16 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => handleCategoryClick(category.id)}
                    className={`group text-left p-6 rounded-xl border-l-4 ${category.borderColor} bg-white border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 ${
                      selectedCategory === category.id
                        ? 'ring-2 ring-[#2c7338]/20 shadow-md'
                        : ''
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className={`flex-shrink-0 w-12 h-12 rounded-lg ${category.bgColor} flex items-center justify-center ${category.accentColor}`}
                      >
                        {category.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-[#2c7338] transition-colors">
                          {category.title}
                        </h3>
                        <p className="text-sm text-gray-500">{category.description}</p>
                        <span className="inline-flex items-center gap-1 mt-2 text-sm font-medium text-[#2c7338]">
                          {selectedCategory === category.id ? (
                            <>
                              Hide articles <ChevronUp className="h-4 w-4" />
                            </>
                          ) : (
                            <>
                              View articles <ChevronDown className="h-4 w-4" />
                            </>
                          )}
                        </span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      <section className="py-12 md:py-16 bg-slate-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto space-y-8">
            {displayedCategories.map((category) => (
              <div key={category.id}>
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className={`w-8 h-8 rounded-lg ${category.bgColor} flex items-center justify-center ${category.accentColor}`}
                  >
                    {category.icon}
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900">{category.title}</h2>
                  <span className="text-sm text-gray-400">
                    {category.articles.length} articles
                  </span>
                </div>
                <div className="space-y-2">
                  {category.articles.map((article, idx) => {
                    const articleKey = `${category.id}-${idx}`;
                    const isExpanded = expandedArticles.has(articleKey);
                    return (
                      <div
                        key={articleKey}
                        className="bg-white rounded-lg border border-gray-100 overflow-hidden"
                      >
                        <button
                          onClick={() => toggleArticle(articleKey)}
                          className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-gray-50 transition-colors"
                        >
                          <span className="font-medium text-gray-900 pr-4">
                            {article.title}
                          </span>
                          {isExpanded ? (
                            <Minus className="h-5 w-5 text-[#2c7338] flex-shrink-0" />
                          ) : (
                            <Plus className="h-5 w-5 text-gray-400 flex-shrink-0" />
                          )}
                        </button>
                        {isExpanded && (
                          <div className="px-6 pb-4 text-gray-600 leading-relaxed border-t border-gray-50">
                            <p className="pt-3">{article.content}</p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
            {searchQuery && displayedCategories.length === 0 && (
              <div className="text-center py-12">
                <HelpCircle className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-lg text-gray-500">
                  No articles found matching "{searchQuery}"
                </p>
                <p className="text-sm text-gray-400 mt-2">
                  Try different keywords or browse the categories above
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
              Still need help?
            </h2>
            <p className="text-gray-500 mb-8">
              Our support team is ready to assist you with any questions
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
              <div className="p-6 rounded-xl border border-gray-100 bg-slate-50 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-4">
                  <Mail className="h-6 w-6 text-[#2c7338]" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">Email Support</h3>
                <a
                  href="mailto:support@simfinity.com"
                  className="text-[#2c7338] hover:underline text-sm"
                >
                  support@simfinity.com
                </a>
              </div>
              <div className="p-6 rounded-xl border border-gray-100 bg-slate-50 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-4">
                  <MessageSquare className="h-6 w-6 text-[#2c7338]" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">Live Chat</h3>
                <p className="text-sm text-gray-500">Available 24/7</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
