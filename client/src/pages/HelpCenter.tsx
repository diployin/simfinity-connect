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
import { useTranslation } from '@/contexts/TranslationContext';

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
import { cn } from '@/lib/utils';

// Helper for safe icon rendering
const SafeIcon = ({ icon: Icon, className }: { icon: any, className?: string }) => {
  return Icon ? <Icon className={cn("h-6 w-6", className)} /> : <div className={cn("h-6 w-6 bg-gray-200 rounded-full", className)} />;
};

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
  hoverRing: string;
}

const CATEGORY_STYLES = [
  {
    icon: PlayCircle,
    accentColor: 'text-green-600 dark:text-green-400',
    borderColor: 'border-l-green-500',
    bgColor: 'bg-green-50 dark:bg-green-950/30',
    hoverRing: 'ring-green-500/20',
  },
  {
    icon: CreditCard,
    accentColor: 'text-blue-600 dark:text-blue-400',
    borderColor: 'border-l-blue-500',
    bgColor: 'bg-blue-50 dark:bg-blue-950/30',
    hoverRing: 'ring-blue-500/20',
  },
  {
    icon: Wrench,
    accentColor: 'text-orange-600 dark:text-orange-400',
    borderColor: 'border-l-orange-500',
    bgColor: 'bg-orange-50 dark:bg-orange-950/30',
    hoverRing: 'ring-orange-500/20',
  },
  {
    icon: HelpCircle,
    accentColor: 'text-purple-600 dark:text-purple-400',
    borderColor: 'border-l-purple-500',
    bgColor: 'bg-purple-50 dark:bg-purple-950/30',
    hoverRing: 'ring-purple-500/20',
  },
];

export default function HelpCenter() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [expandedArticles, setExpandedArticles] = useState<Set<string>>(new Set());
  const siteName = useSettingByKey('platform_name');
  const email = useSettingByKey('email');
  const [location] = useLocation();
  const { t } = useTranslation();

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
      const style = CATEGORY_STYLES[index % CATEGORY_STYLES.length];
      const Icon = style.icon;

      return {
        id: cat.id,
        title: cat.name,
        description: t('website.help.categoryDesc', 'Everything you need to know about {{name}}', { name: cat.name }),
        icon: <Icon className="h-6 w-6" />,
        accentColor: style.accentColor,
        borderColor: style.borderColor,
        bgColor: style.bgColor,
        hoverRing: style.hoverRing,
      };
    });
  }, [apiCategories]);

  const toggleArticle = (articleKey: string) => {
    setExpandedArticles((prev) => {
      const next = new Set(prev);
      if (next.has(articleKey)) next.delete(articleKey);
      else next.add(articleKey);
      return next;
    });
  };

  const displayedCategories = useMemo(() => {
    if (!apiCategories) return [];
    let filtered = apiCategories;
    if (searchQuery) {
      filtered = apiCategories.map(cat => ({
        ...cat,
        faqs: cat.faqs.filter(f =>
          f.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
          f.answer.toLowerCase().includes(searchQuery.toLowerCase())
        )
      })).filter(cat => cat.faqs.length > 0);
    } else if (selectedCategory) {
      filtered = apiCategories.filter(cat => cat.id === selectedCategory);
    }
    return filtered;
  }, [apiCategories, searchQuery, selectedCategory]);

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      <Helmet>
        <title>{t('website.help.pageTitle', 'Help Center | {{name}}', { name: siteName || 'Voltey' })}</title>
      </Helmet>

      {/* Hero Section */}
      <section className="relative pt-24 pb-16 px-4 text-center">
        <h1 className="text-3xl md:text-5xl font-bold mb-4 leading-tight">
          {t('website.help.heading', 'How can we help you?')}
        </h1>
        <p className="text-slate-600 dark:text-slate-400 mb-8 max-w-lg mx-auto">
          {t('website.help.subheading', 'Search our knowledge base or browse categories below')}
        </p>
        <div className="max-w-md mx-auto relative">
          <Search className="absolute left-3 top-3.5 h-5 w-5 text-slate-400" />
          <input
            type="search"
            placeholder={String(t('website.help.searchPlaceholder', 'Search for answers...'))}
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-primary/20 outline-none"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </section>

      {/* Categories / Content */}
      <section className="flex-1 container mx-auto px-4 pb-16">
        {!searchQuery && !selectedCategory && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
            {categories.map((cat, idx) => {
              const style = CATEGORY_STYLES[idx % CATEGORY_STYLES.length];
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className="p-4 rounded-xl border-l-4 border-l-primary bg-white dark:bg-slate-900 shadow-sm text-left flex items-start gap-4 hover:shadow-md transition-shadow"
                >
                  <div className={cn("p-3 rounded-lg", style.bgColor, style.accentColor)}>
                    {cat.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold">{cat.title}</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-1">{cat.description}</p>
                  </div>
                </button>
              );
            })}
          </div>
        )}

        <div className="space-y-6">
          {displayedCategories.map((cat) => (
            <div key={cat.id}>
              <h2 className="text-xl font-semibold mb-4">{cat.name}</h2>
              <div className="space-y-2">
                {cat.faqs.map((faq) => {
                  const key = `${cat.id}-${faq.id}`;
                  const isExpanded = expandedArticles.has(key);
                  return (
                    <div key={key} className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800">
                      <button
                        onClick={() => toggleArticle(key)}
                        className="w-full p-4 flex justify-between items-center text-left"
                      >
                        <span className="font-medium pr-4">{faq.question}</span>
                        {isExpanded ? <Minus className="h-4 w-4 shrink-0" /> : <Plus className="h-4 w-4 shrink-0" />}
                      </button>
                      {isExpanded && (
                        <div className="px-4 pb-4 text-slate-600 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800 pt-2">
                          {faq.answer}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}