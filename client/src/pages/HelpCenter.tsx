import { useState, useEffect, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { useQuery } from '@tanstack/react-query';
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
import { Link, useLocation } from 'wouter';

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

interface Article {
  id: string;
  title: string;
  content: string;
}

interface UICategory {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  accentColor: string;
  borderColor: string;
  bgColor: string;
  articles: Article[];
}

const CATEGORY_STYLES = [
  {
    icon: PlayCircle,
    accentColor: 'text-green-600',
    borderColor: 'border-l-green-500',
    bgColor: 'bg-green-50',
    hoverRing: 'ring-[#2c7338]/20',
  },
  {
    icon: CreditCard,
    accentColor: 'text-blue-600',
    borderColor: 'border-l-blue-500',
    bgColor: 'bg-blue-50',
    hoverRing: 'ring-blue-600/20',
  },
  {
    icon: Wrench,
    accentColor: 'text-orange-600',
    borderColor: 'border-l-orange-500',
    bgColor: 'bg-orange-50',
    hoverRing: 'ring-orange-600/20',
  },
  {
    icon: HelpCircle,
    accentColor: 'text-purple-600',
    borderColor: 'border-l-purple-500',
    bgColor: 'bg-purple-50',
    hoverRing: 'ring-purple-600/20',
  },
];

export default function HelpCenter() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [expandedArticles, setExpandedArticles] = useState<Set<string>>(new Set());
  const siteName = useSettingByKey('platform_name');
  const email = useSettingByKey('email');
  const [location] = useLocation();

  const { data: apiCategories, isLoading } = useQuery({
    queryKey: ['/api/faqs/public'],
    queryFn: async () => {
      const response = await fetch('/api/faqs/public');
      if (!response.ok) throw new Error('Failed to fetch FAQs');
      const result = await response.json();
      return result.data as FaqCategory[];
    },
  });

  const categories: UICategory[] = useMemo(() => {
    if (!apiCategories) return [];

    return apiCategories.map((cat, index) => {
      const styleIndex = index % CATEGORY_STYLES.length;
      const style = CATEGORY_STYLES[styleIndex];
      const Icon = style.icon;

      return {
        id: cat.id,
        title: cat.name,
        description: `Everything you need to know about ${cat.name}`,
        icon: <Icon className="h-6 w-6" />,
        accentColor: style.accentColor,
        borderColor: style.borderColor,
        bgColor: style.bgColor,
        articles: cat.faqs.map((f) => ({
          id: f.id,
          title: f.question,
          content: f.answer,
        })),
      };
    });
  }, [apiCategories]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const cat = params.get('category');
    if (cat && categories.some((c) => c.id === cat)) {
      setSelectedCategory(cat);
    }
  }, [location, categories]);

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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Helmet>
          <title>Help Center | {siteName || 'Simfinity'}</title>
        </Helmet>
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
        </div>
      </div>
    );
  }

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
                {categories.map((category, index) => {
                  const styleIndex = index % CATEGORY_STYLES.length;
                  const hoverStyle = CATEGORY_STYLES[styleIndex].hoverRing;

                  return (
                    <button
                      key={category.id}
                      onClick={() => handleCategoryClick(category.id)}
                      className={`group text-left p-6 rounded-xl border-l-4 ${category.borderColor} bg-white border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 ${selectedCategory === category.id
                        ? `ring-2 ${hoverStyle} shadow-md`
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
                  )
                })}
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
                    const articleKey = `${category.id}-${article.id}`;
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
                  href={`mailto:${email || 'support@simfinity.tel'}`}
                  className="text-[#2c7338] hover:underline text-sm"
                >
                  {email || 'support@simfinity.tel'}
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
