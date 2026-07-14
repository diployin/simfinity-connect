'use client';

import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'wouter';
import { cn } from '@/lib/utils';
import {
  Menu,
  Globe,
  User,
  ShoppingBag,
  ChevronDown,
  ChevronRight,
  BookOpen,
  FileText,
  Headphones,
  MessageCircle,
  X,
  Search,
  Smartphone,
  Wifi,
  MapPin,
  HelpCircle,
  Compass,
  Wrench,
  Star,
  Package,
  Zap,
  Shield,
  Briefcase,
  Users,
  Check,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { ThemeToggle } from '@/components/ThemeToggle';
import { CurrencySelector } from '@/components/CurrencySelector';
import { useUser } from '@/hooks/use-user';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from '@/contexts/TranslationContext';
import ReactCountryFlag from 'react-country-flag';
import { NotificationBell } from '../NotificationBell';
import { useQuery } from '@tanstack/react-query';
import { useSettingByKey } from '@/hooks/useSettings';
import { useTheme } from '@/contexts/ThemeContext';

export function SiteHeader() {
  const { isAuthenticated, isLoading, user, refetchUser } = useUser();
  const { toast } = useToast();
  const { languages, languageCode, setLanguage, t, language } = useTranslation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [resourcesOpen, setResourcesOpen] = useState(false);
  const [pagesOpen, setPagesOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [productsOpen, setProductsOpen] = useState(false);
  const [languageOpen, setLanguageOpen] = useState(false);
  const [, setLocation] = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);

  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const menuTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const { theme } = useTheme();
  const logo = useSettingByKey('logo');
  const whiteLogo = useSettingByKey('white_logo');
  const currentLogo = theme === 'dark' ? (whiteLogo || logo) : logo;

  const { data: navlinks } = useQuery({
    queryKey: ['/api/pages'],
    queryFn: async () => {
      const res = await apiRequest('GET', '/api/pages');
      return res.json();
    },
  });
  const { data: settings } = useQuery({
    queryKey: ['/api/public/settings'],
  });

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    try {
      await apiRequest('POST', '/api/auth/logout', {});
      queryClient.setQueryData(['/api/auth/me'], null);
      refetchUser();
      toast({ title: 'Success', description: 'Logged out successfully' });
      setLocation('/');
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to logout', variant: 'destructive' });
    }
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
    setResourcesOpen(false);
    setPagesOpen(false);
    setHelpOpen(false);
    setProductsOpen(false);
    setLanguageOpen(false);
  };

  const handleMenuEnter = (menuName: string) => {
    if (menuTimeoutRef.current) {
      clearTimeout(menuTimeoutRef.current);
      menuTimeoutRef.current = null;
    }
    setActiveMenu(menuName);
  };

  const handleMenuLeave = () => {
    menuTimeoutRef.current = setTimeout(() => {
      setActiveMenu(null);
    }, 150);
  };

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        isScrolled
          ? 'bg-white/95 dark:bg-gray-950/95 backdrop-blur-md shadow-sm border-b border-gray-100 dark:border-gray-800'
          : 'bg-white/50 dark:bg-gray-950/50 backdrop-blur-sm'
      )}
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="flex h-16 md:h-[72px] items-center justify-between">
          {currentLogo ? (
            <Link href="/" data-testid="link-home" className="flex-shrink-0">
              <img src={currentLogo} alt="" className="h-8" />
            </Link>
          ) : (
            <Link href="/" data-testid="link-home" className="flex-shrink-0">
              <div className="flex items-center gap-2 cursor-pointer transition-all duration-200 hover:opacity-80">
                <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-primary-second flex items-center justify-center shadow-lg shadow-primary/20">
                  <Globe className="h-4 w-4 text-white" />
                </div>
                <span className="font-bold text-lg text-gray-900 dark:text-white">
                  Vol<span className="bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent">tey</span>
                </span>
              </div>
            </Link>
          )}

          <nav className="hidden xl:flex items-center gap-1" data-testid="nav-main">
            <div
              className="relative"
              onMouseEnter={() => handleMenuEnter('how-it-works')}
              onMouseLeave={handleMenuLeave}
            >
              <span className="px-4 py-2 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary-light transition-all cursor-pointer flex items-center gap-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-900">
                {t('website.nav.howItWorks', 'How It Works')}
                <ChevronDown className={cn('h-3.5 w-3.5 text-gray-400 transition-transform duration-200', activeMenu === 'how-it-works' && 'rotate-180')} />
              </span>

              <div className={cn(
                'absolute top-full left-0 pt-2 transition-all duration-200 origin-top-left',
                activeMenu === 'how-it-works' ? 'opacity-100 visible translate-y-0 scale-100' : 'opacity-0 invisible -translate-y-2 scale-95'
              )}>
                <div className="w-[280px] bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-xl p-2 overflow-hidden">
                  <Link href="/what-is-esim" onClick={() => setActiveMenu(null)}>
                    <div className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-50 dark:hover:bg-gray-800 transition-colors cursor-pointer group">
                      <div className="w-8 h-8 rounded-lg bg-primary/5 dark:bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Smartphone className="h-4 w-4 text-primary" />
                      </div>
                      <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">{t('website.nav.whatIsEsim', 'What is an eSIM')}</span>
                    </div>
                  </Link>
                  <Link href="/supported-devices" onClick={() => setActiveMenu(null)}>
                    <div className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-50 dark:hover:bg-gray-800 transition-colors cursor-pointer group">
                      <div className="w-8 h-8 rounded-lg bg-primary/5 dark:bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Smartphone className="h-4 w-4 text-primary" />
                      </div>
                      <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">{t('website.nav.supportedDevices', 'Supported Devices')}</span>
                    </div>
                  </Link>
                  <Link href="/data-usage-calculator" onClick={() => setActiveMenu(null)}>
                    <div className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-50 dark:hover:bg-gray-800 transition-colors cursor-pointer group">
                      <div className="w-8 h-8 rounded-lg bg-primary/5 dark:bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Zap className="h-4 w-4 text-primary" />
                      </div>
                      <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">{t('website.nav.dataCalculator', 'Data Usage Calculator')}</span>
                    </div>
                  </Link>
                  <Link href="/security-features" onClick={() => setActiveMenu(null)}>
                    <div className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-50 dark:hover:bg-gray-800 transition-colors cursor-pointer group">
                      <div className="w-8 h-8 rounded-lg bg-primary/5 dark:bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Shield className="h-4 w-4 text-primary" />
                      </div>
                      <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">{t('website.nav.security', 'Security Features')}</span>
                    </div>
                  </Link>
                </div>
              </div>
            </div>

            <div
              className="relative"
              onMouseEnter={() => handleMenuEnter('resources')}
              onMouseLeave={handleMenuLeave}
            >
              <span className="px-4 py-2 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary-light transition-all cursor-pointer flex items-center gap-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-900">
                {t('website.nav.resources', 'Resources')}
                <ChevronDown className={cn('h-3.5 w-3.5 text-gray-400 transition-transform duration-200', activeMenu === 'resources' && 'rotate-180')} />
              </span>

              <div className={cn(
                'absolute top-full left-0 pt-2 transition-all duration-200 origin-top-left',
                activeMenu === 'resources' ? 'opacity-100 visible translate-y-0 scale-100' : 'opacity-0 invisible -translate-y-2 scale-95'
              )}>
                <div className="w-[240px] bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-xl p-2">
                  <Link href="/blog" onClick={() => setActiveMenu(null)}>
                    <div className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-50 dark:hover:bg-gray-800 transition-colors cursor-pointer group">
                      <div className="w-8 h-8 rounded-lg bg-primary/5 dark:bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <BookOpen className="h-4 w-4 text-primary" />
                      </div>
                      <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">{t('website.nav.blog', 'Blog')}</span>
                    </div>
                  </Link>
                  <Link href="/reviews" onClick={() => setActiveMenu(null)}>
                    <div className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-50 dark:hover:bg-gray-800 transition-colors cursor-pointer group">
                      <div className="w-8 h-8 rounded-lg bg-primary/5 dark:bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <MessageCircle className="h-4 w-4 text-primary" />
                      </div>
                      <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">{t('website.nav.reviews', 'Reviews')}</span>
                    </div>
                  </Link>
                  <Link href="/getting-started" onClick={() => setActiveMenu(null)}>
                    <div className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-50 dark:hover:bg-gray-800 transition-colors cursor-pointer group">
                      <div className="w-8 h-8 rounded-lg bg-primary/5 dark:bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Compass className="h-4 w-4 text-primary" />
                      </div>
                      <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">{t('website.nav.gettingStarted', 'Getting Started')}</span>
                    </div>
                  </Link>
                  <Link href="/help-center?category=faq" onClick={() => setActiveMenu(null)}>
                    <div className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-50 dark:hover:bg-gray-800 transition-colors cursor-pointer group">
                      <div className="w-8 h-8 rounded-lg bg-primary/5 dark:bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <HelpCircle className="h-4 w-4 text-primary" />
                      </div>
                      <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">{t('website.nav.faqs', 'FAQ')}</span>
                    </div>
                  </Link>
                </div>
              </div>
            </div>

            <div
              className="relative"
              onMouseEnter={() => handleMenuEnter('company')}
              onMouseLeave={handleMenuLeave}
            >
              <span className="px-4 py-2 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary-light transition-all cursor-pointer flex items-center gap-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-900">
                {t('website.nav.company', 'Company')}
                <ChevronDown className={cn('h-3.5 w-3.5 text-gray-400 transition-transform duration-200', activeMenu === 'company' && 'rotate-180')} />
              </span>

              <div className={cn(
                'absolute top-full left-0 pt-2 transition-all duration-200 origin-top-left',
                activeMenu === 'company' ? 'opacity-100 visible translate-y-0 scale-100' : 'opacity-0 invisible -translate-y-2 scale-95'
              )}>
                <div className="w-[240px] bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-xl p-2">
                  <Link href="/about-us" onClick={() => setActiveMenu(null)}>
                    <div className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-50 dark:hover:bg-gray-800 transition-colors cursor-pointer group">
                      <div className="w-8 h-8 rounded-lg bg-primary/5 dark:bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Star className="h-4 w-4 text-primary" />
                      </div>
                      <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">{t('website.nav.about', 'About Us')}</span>
                    </div>
                  </Link>
                  <Link href="/careers" onClick={() => setActiveMenu(null)}>
                    <div className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-50 dark:hover:bg-gray-800 transition-colors cursor-pointer group">
                      <div className="w-8 h-8 rounded-lg bg-primary/5 dark:bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Briefcase className="h-4 w-4 text-primary" />
                      </div>
                      <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">{t('website.nav.careers', 'Careers')}</span>
                    </div>
                  </Link>
                  <Link href="/refer-a-friend" onClick={() => setActiveMenu(null)}>
                    <div className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-50 dark:hover:bg-gray-800 transition-colors cursor-pointer group">
                      <div className="w-8 h-8 rounded-lg bg-primary/5 dark:bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Users className="h-4 w-4 text-primary" />
                      </div>
                      <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">{t('website.nav.refer', 'Refer a Friend')}</span>
                    </div>
                  </Link>
                  <Link href="/business" onClick={() => setActiveMenu(null)}>
                    <div className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-50 dark:hover:bg-gray-800 transition-colors cursor-pointer group">
                      <div className="w-8 h-8 rounded-lg bg-primary/5 dark:bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Globe className="h-4 w-4 text-primary" />
                      </div>
                      <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">{t('website.nav.business', 'Business')}</span>
                    </div>
                  </Link>
                </div>
              </div>
            </div>

            <div
              className="relative"
              onMouseEnter={() => handleMenuEnter('help')}
              onMouseLeave={handleMenuLeave}
            >
              <span className="px-4 py-2 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary-light transition-all cursor-pointer flex items-center gap-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-900">
                {t('website.nav.help', 'Help')}
                <ChevronDown className={cn('h-3.5 w-3.5 text-gray-400 transition-transform duration-200', activeMenu === 'help' && 'rotate-180')} />
              </span>

              <div className={cn(
                'absolute top-full left-0 pt-2 transition-all duration-200 origin-top-left',
                activeMenu === 'help' ? 'opacity-100 visible translate-y-0 scale-100' : 'opacity-0 invisible -translate-y-2 scale-95'
              )}>
                <div className="w-[280px] bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-xl p-2">
                  <Link href="/help-center" onClick={() => setActiveMenu(null)}>
                    <div className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-50 dark:hover:bg-gray-800 transition-colors cursor-pointer group">
                      <div className="w-8 h-8 rounded-lg bg-primary/5 dark:bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <HelpCircle className="h-4 w-4 text-primary" />
                      </div>
                      <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">{t('website.nav.helpCenter', 'Help Center')}</span>
                    </div>
                  </Link>
                  <Link href="/contact-support" onClick={() => setActiveMenu(null)}>
                    <div className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-50 dark:hover:bg-gray-800 transition-colors cursor-pointer group">
                      <div className="w-8 h-8 rounded-lg bg-primary/5 dark:bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Headphones className="h-4 w-4 text-primary" />
                      </div>
                      <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">{t('website.nav.contactSupport', 'Contact Support')}</span>
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          </nav>

          <div className="flex items-center gap-2 md:gap-3 flex-shrink-0">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <span className="hidden md:flex items-center gap-2 rounded-full px-4 py-2 border border-gray-200 dark:border-gray-800 hover:border-primary/30 dark:hover:border-primary/40 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm transition-all cursor-pointer shadow-sm">
                  <ReactCountryFlag
                    countryCode={language?.flagCode || 'US'}
                    svg
                    style={{ width: '18px', height: '14px', borderRadius: '2px' }}
                  />
                  <span className="text-sm font-bold text-gray-700 dark:text-gray-200">
                    {languageCode.toUpperCase()}
                  </span>
                  <ChevronDown className="h-3 w-3 text-gray-400" />
                </span>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-56 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-2xl rounded-2xl p-1 mt-2"
              >
                <div className="px-4 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100 dark:border-gray-800 mb-1">
                  {t('common.button.selectLanguage', 'Select Language')}
                </div>
                {languages.map((lang) => {
                  const active = languageCode === lang.code;
                  return (
                    <DropdownMenuItem
                      key={lang.code}
                      onClick={() => setLanguage(lang.code)}
                      className={cn(
                        'flex items-center justify-between cursor-pointer rounded-xl px-3 py-2.5 transition-all',
                        active ? 'bg-primary/10 dark:bg-primary/20 text-primary-second dark:text-primary-light' : 'hover:bg-slate-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300',
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <ReactCountryFlag
                          countryCode={lang.flagCode}
                          svg
                          style={{ width: '22px', height: '16px', borderRadius: '2px' }}
                        />
                        <div>
                          <div className="font-bold text-sm">
                            {lang.nativeName}
                          </div>
                          <div className="text-[10px] opacity-70 font-medium">{lang.name}</div>
                        </div>
                      </div>
                      {active && <Check className="h-4 w-4 text-primary" />}
                    </DropdownMenuItem>
                  );
                })}
              </DropdownMenuContent>
            </DropdownMenu>

            <div className="hidden sm:flex items-center gap-2">
              <CurrencySelector />
              <ThemeToggle />
            </div>

            <Link href="/destinations">
              <span className="hidden md:flex items-center gap-2 text-sm font-bold bg-primary-gradient hover:bg-primary-gradient-hover text-white rounded-full px-6 py-2.5 transition-all shadow-lg shadow-primary/20 hover:shadow-primary/30 hover:scale-[1.02] active:scale-[0.98] whitespace-nowrap">
                <Search className="h-4 w-4" />
                {t('website.nav.seePacks', 'Destinations')}
              </span>
            </Link>

            {!isLoading && !isAuthenticated && (
              <Link href="/login">
                <span className="hidden md:flex text-sm font-bold text-gray-700 dark:text-gray-200 rounded-full px-5 py-2.5 border border-gray-200 dark:border-gray-800 hover:border-primary/30 dark:hover:border-primary/40 hover:bg-slate-50 dark:hover:bg-gray-800 transition-all gap-2 items-center whitespace-nowrap shadow-sm">
                  <User className="h-4 w-4 text-primary" />
                  {t('website.nav.signIn', 'Sign In')}
                </span>
              </Link>
            )}

            {!isLoading && isAuthenticated && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <span className="hidden md:block rounded-full p-0.5 border-2 border-transparent hover:border-primary/30 transition-all cursor-pointer">
                    <div className="h-9 w-9 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center border border-primary/20 dark:border-primary/30 overflow-hidden shadow-inner">
                      {user?.imagePath ? (
                        <img src={user.imagePath.startsWith('http') ? user.imagePath : `/${user.imagePath}`} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <User className="h-5 w-5 text-primary dark:text-primary-light" />
                      )}
                    </div>
                  </span>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-64 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-2xl rounded-2xl p-1 mt-2"
                >
                  <div className="px-4 py-4 border-b border-gray-100 dark:border-gray-800 mb-1">
                    <p className="text-sm font-bold text-gray-900 dark:text-white leading-tight">
                      {user?.name || 'User'}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5">{user?.email}</p>
                  </div>
                  <DropdownMenuItem asChild>
                    <Link
                      href="/account/profile"
                      className="cursor-pointer flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-gray-700 dark:text-gray-200 hover:bg-slate-50 dark:hover:bg-gray-800 transition-colors"
                    >
                      <User className="h-4 w-4 text-primary" />{t('website.nav.profile', 'Profile')}</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link
                      href="/account/orders"
                      className="cursor-pointer flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-gray-700 dark:text-gray-200 hover:bg-slate-50 dark:hover:bg-gray-800 transition-colors"
                    >
                      <ShoppingBag className="h-4 w-4 text-primary" />{t('website.nav.myOrders', 'My Orders')}</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-gray-100 dark:border-gray-800" />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="text-red-600 dark:text-red-400 focus:text-red-600 dark:focus:text-red-400 cursor-pointer rounded-xl px-4 py-3 text-sm font-bold hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                  >{t('website.nav.signOut', 'Sign Out')}</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <button className="xl:hidden p-2.5 bg-gray-100/80 dark:bg-gray-800/80 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-xl transition-all active:scale-95 shadow-sm">
                  <Menu className="h-5 w-5 text-gray-700 dark:text-gray-200" />
                </button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="w-[85vw] sm:w-85 p-0 bg-white dark:bg-gray-950 overflow-y-auto border-l border-gray-100 dark:border-gray-800 [&>button]:hidden shadow-2xl"
              >
                <SheetHeader className="border-b border-gray-100 dark:border-gray-800 p-6 flex flex-row items-center justify-between bg-white dark:bg-gray-950 sticky top-0 z-20 backdrop-blur-md bg-opacity-95 dark:bg-opacity-95">
                  <SheetTitle className="text-gray-900 dark:text-white text-xl font-black tracking-tight">{t('website.nav.menu', 'Menu')}</SheetTitle>
                  <button onClick={closeMobileMenu} className="p-2 bg-slate-100 dark:bg-gray-800 hover:bg-slate-200 dark:hover:bg-gray-700 rounded-xl transition-all active:scale-90">
                    <X className="h-5 w-5 text-gray-500 dark:text-gray-300" />
                  </button>
                </SheetHeader>

                <nav className="flex flex-col p-6 pb-24 space-y-1">
                  {isAuthenticated && (
                    <div className="mb-6 pb-6 border-b border-gray-100 dark:border-gray-800">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="h-12 w-12 rounded-2xl bg-primary/10 dark:bg-primary/20 flex items-center justify-center border border-primary/10 dark:border-primary/20 shadow-inner">
                          {user?.imagePath ? (
                            <img src={user.imagePath.startsWith('http') ? user.imagePath : `/${user.imagePath}`} alt="" className="w-full h-full object-cover rounded-2xl" />
                          ) : (
                            <User className="h-6 w-6 text-primary dark:text-primary-light" />
                          )}
                        </div>
                        <div>
                          <p className="text-base font-bold text-gray-900 dark:text-white leading-tight">{user?.name || 'User'}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{user?.email}</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <Link href="/account/profile" onClick={closeMobileMenu}>
                          <span className="flex items-center justify-center gap-2 py-3 px-3 text-sm font-bold text-gray-700 dark:text-gray-300 bg-slate-50 dark:bg-gray-900 hover:bg-primary/5 dark:hover:bg-primary/10 rounded-xl transition-all border border-transparent hover:border-primary/20">{t('website.nav.profile', 'Profile')}</span>
                        </Link>
                        <Link href="/account/orders" onClick={closeMobileMenu}>
                          <span className="flex items-center justify-center gap-2 py-3 px-3 text-sm font-bold text-gray-700 dark:text-gray-300 bg-slate-50 dark:bg-gray-900 hover:bg-primary/5 dark:hover:bg-primary/10 rounded-xl transition-all border border-transparent hover:border-primary/20">{t('website.nav.myOrders', 'Orders')}</span>
                        </Link>
                      </div>
                    </div>
                  )}

                  <div className="space-y-1.5">
                    <button
                      onClick={() => setResourcesOpen(!resourcesOpen)}
                      className="w-full flex items-center justify-between py-3.5 px-4 text-[15px] font-bold text-gray-800 dark:text-gray-200 hover:bg-slate-50 dark:hover:bg-gray-900 rounded-xl transition-all group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-primary/10 dark:bg-primary/20 flex items-center justify-center">
                          <Zap className="h-4 w-4 text-primary" />
                        </div>
                        {t('website.nav.howItWorks', 'How It Works')}
                      </div>
                      <ChevronRight className={cn('h-4 w-4 text-gray-400 transition-transform duration-300', resourcesOpen && 'rotate-90')} />
                    </button>
                    {resourcesOpen && (
                      <div className="ml-6 space-y-1 border-l-2 border-primary/20 pl-4 py-1">
                        <Link href="/what-is-esim" onClick={closeMobileMenu}>
                          <span className="flex items-center gap-3 py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary-light transition-all">{t('website.nav.whatIsEsim', 'What is an eSIM')}</span>
                        </Link>
                        <Link href="/supported-devices" onClick={closeMobileMenu}>
                          <span className="flex items-center gap-3 py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary-light transition-all">{t('website.nav.supportedDevices', 'Supported Devices')}</span>
                        </Link>
                        <Link href="/data-usage-calculator" onClick={closeMobileMenu}>
                          <span className="flex items-center gap-3 py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary-light transition-all">{t('website.nav.dataCalculator', 'Usage Calculator')}</span>
                        </Link>
                        <Link href="/security-features" onClick={closeMobileMenu}>
                          <span className="flex items-center gap-3 py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary-light transition-all">{t('website.nav.security', 'Security Features')}</span>
                        </Link>
                      </div>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <button
                      onClick={() => setPagesOpen(!pagesOpen)}
                      className="w-full flex items-center justify-between py-3.5 px-4 text-[15px] font-bold text-gray-800 dark:text-gray-200 hover:bg-slate-50 dark:hover:bg-gray-900 rounded-xl transition-all group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
                          <BookOpen className="h-4 w-4 text-blue-500" />
                        </div>
                        {t('website.nav.resources', 'Resources')}
                      </div>
                      <ChevronRight className={cn('h-4 w-4 text-gray-400 transition-transform duration-300', pagesOpen && 'rotate-90')} />
                    </button>
                    {pagesOpen && (
                      <div className="ml-6 space-y-1 border-l-2 border-blue-200 dark:border-blue-900 pl-4 py-1">
                        <Link href="/blog" onClick={closeMobileMenu}>
                          <span className="flex items-center gap-3 py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400 hover:text-blue-500 transition-all">{t('website.nav.blog', 'Blog')}</span>
                        </Link>
                        <Link href="/reviews" onClick={closeMobileMenu}>
                          <span className="flex items-center gap-3 py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400 hover:text-blue-500 transition-all">{t('website.nav.reviews', 'Reviews')}</span>
                        </Link>
                        <Link href="/getting-started" onClick={closeMobileMenu}>
                          <span className="flex items-center gap-3 py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400 hover:text-blue-500 transition-all">{t('website.nav.gettingStarted', 'Getting Started')}</span>
                        </Link>
                        <Link href="/help-center?category=faq" onClick={closeMobileMenu}>
                          <span className="flex items-center gap-3 py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400 hover:text-blue-500 transition-all">{t('website.nav.faqs', 'FAQ')}</span>
                        </Link>
                      </div>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <button
                      onClick={() => setHelpOpen(!helpOpen)}
                      className="w-full flex items-center justify-between py-3.5 px-4 text-[15px] font-bold text-gray-800 dark:text-gray-200 hover:bg-slate-50 dark:hover:bg-gray-900 rounded-xl transition-all group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-green-50 dark:bg-green-900/20 flex items-center justify-center">
                          <Star className="h-4 w-4 text-green-500" />
                        </div>
                        {t('website.nav.company', 'Company')}
                      </div>
                      <ChevronRight className={cn('h-4 w-4 text-gray-400 transition-transform duration-300', helpOpen && 'rotate-90')} />
                    </button>
                    {helpOpen && (
                      <div className="ml-6 space-y-1 border-l-2 border-green-200 dark:border-green-900 pl-4 py-1">
                        <Link href="/about-us" onClick={closeMobileMenu}>
                          <span className="flex items-center gap-3 py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400 hover:text-green-500 transition-all">{t('website.nav.about', 'About Us')}</span>
                        </Link>
                        <Link href="/careers" onClick={closeMobileMenu}>
                          <span className="flex items-center gap-3 py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400 hover:text-green-500 transition-all">{t('website.nav.careers', 'Careers')}</span>
                        </Link>
                        <Link href="/refer-a-friend" onClick={closeMobileMenu}>
                          <span className="flex items-center gap-3 py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400 hover:text-green-500 transition-all">{t('website.nav.refer', 'Refer a Friend')}</span>
                        </Link>
                        <Link href="/business" onClick={closeMobileMenu}>
                          <span className="flex items-center gap-3 py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400 hover:text-green-500 transition-all">{t('website.nav.business', 'Business')}</span>
                        </Link>
                      </div>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <button
                      onClick={() => setLanguageOpen(!languageOpen)}
                      className="w-full flex items-center justify-between py-3.5 px-4 text-[15px] font-bold text-gray-800 dark:text-gray-200 hover:bg-slate-50 dark:hover:bg-gray-900 rounded-xl transition-all group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center">
                          <HelpCircle className="h-4 w-4 text-amber-500" />
                        </div>
                        {t('website.nav.help', 'Help')}
                      </div>
                      <ChevronRight className={cn('h-4 w-4 text-gray-400 transition-transform duration-300', languageOpen && 'rotate-90')} />
                    </button>
                    {languageOpen && (
                      <div className="ml-6 space-y-1 border-l-2 border-amber-200 dark:border-amber-900 pl-4 py-1">
                        <Link href="/help-center" onClick={closeMobileMenu}>
                          <span className="flex items-center gap-3 py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400 hover:text-amber-500 transition-all">{t('website.nav.helpCenter', 'Help Center')}</span>
                        </Link>
                        <Link href="/contact-support" onClick={closeMobileMenu}>
                          <span className="flex items-center gap-3 py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400 hover:text-amber-500 transition-all">{t('website.nav.contactSupport', 'Contact Support')}</span>
                        </Link>
                      </div>
                    )}
                  </div>

                  <div className="pt-6">
                    <Link href="/destinations" onClick={closeMobileMenu}>
                      <span className="flex items-center justify-center gap-2 w-full bg-primary-gradient hover:bg-primary-gradient-hover text-white text-[15px] font-bold py-4 px-6 rounded-2xl shadow-xl shadow-primary/25 transition-all active:scale-[0.98]">
                        <Search className="h-4 w-4" />
                        {t('website.nav.seePacks', 'Explore Destinations')}
                      </span>
                    </Link>
                  </div>

                  <div className="pt-8 mt-4 border-t border-gray-100 dark:border-gray-800 space-y-5">
                    <p className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] px-4">{t('website.nav.settings', 'Settings')}</p>

                    <div>
                      <button
                        onClick={() => setLanguageOpen(!languageOpen)}
                        className="w-full flex items-center justify-between py-3 px-4 text-[14px] font-bold text-gray-700 dark:text-gray-200 bg-slate-50/80 dark:bg-gray-900/80 rounded-xl transition-all"
                      >
                        <div className="flex items-center gap-3">
                          <Globe className="h-4 w-4 text-primary" />
                          {t('common.button.selectLanguage', 'Language')}
                        </div>
                        <div className="flex items-center gap-2">
                          <ReactCountryFlag countryCode={language?.flagCode || 'US'} svg style={{ width: '18px', height: '13px' }} />
                          <span className="text-xs font-bold text-primary">{languageCode.toUpperCase()}</span>
                          <ChevronRight className={cn('h-4 w-4 text-gray-400 transition-transform duration-300', languageOpen && 'rotate-90')} />
                        </div>
                      </button>
                      {languageOpen && (
                        <div className="ml-4 mt-3 space-y-1 border-l-2 border-primary/20 pl-4 max-h-64 overflow-y-auto">
                          {languages.map((lang) => (
                            <button
                              key={lang.code}
                              onClick={() => { setLanguage(lang.code); setLanguageOpen(false); }}
                              className={cn(
                                'w-full flex items-center justify-between py-3 px-4 text-sm font-semibold rounded-xl transition-all',
                                languageCode === lang.code ? 'bg-primary text-white shadow-md' : 'text-gray-600 dark:text-gray-400 hover:bg-slate-50 dark:hover:bg-gray-800'
                              )}
                            >
                              <div className="flex items-center gap-3">
                                <ReactCountryFlag countryCode={lang.flagCode} svg style={{ width: '20px', height: '15px' }} />
                                <span>{lang.nativeName}</span>
                              </div>
                              {languageCode === lang.code && <Check className="h-4 w-4" />}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between px-4 py-1">
                      <span className="text-[14px] font-bold text-gray-700 dark:text-gray-200">{t('website.nav.theme', 'Theme Mode')}</span>
                      <ThemeToggle />
                    </div>
                    <div className="flex items-center justify-between px-4 py-1">
                      <span className="text-[14px] font-bold text-gray-700 dark:text-gray-200">{t('website.nav.currency', 'Currency')}</span>
                      <CurrencySelector />
                    </div>
                  </div>

                  {!isAuthenticated && (
                    <div className="pt-8 mt-4 border-t border-gray-100 dark:border-gray-800">
                      <Link href="/login" onClick={closeMobileMenu}>
                        <span className="flex items-center justify-center gap-2 w-full border-2 border-gray-200 dark:border-gray-800 text-[15px] font-bold text-gray-700 dark:text-gray-200 py-4 px-6 rounded-2xl hover:bg-slate-50 dark:hover:bg-gray-800 transition-all shadow-sm">
                          <User className="h-4 w-4 text-primary" />
                          {t('website.nav.signIn', 'Sign In to Your Account')}
                        </span>
                      </Link>
                    </div>
                  )}

                  {isAuthenticated && (
                    <div className="pt-8 mt-4 border-t border-gray-100 dark:border-gray-800">
                      <button
                        onClick={() => { handleLogout(); closeMobileMenu(); }}
                        className="w-full text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 text-[15px] font-bold py-4 px-6 rounded-2xl transition-all border border-transparent hover:border-red-200 dark:hover:border-red-900/50"
                      >{t('website.nav.signOut', 'Sign Out')}</button>
                    </div>
                  )}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div >
    </header>
  );
}

export default SiteHeader;
