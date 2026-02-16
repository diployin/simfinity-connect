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

  const logo = useSettingByKey('logo');

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
          : 'bg-[#e8f5e9]/80 dark:bg-gray-900/80 backdrop-blur-sm'
      )}
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="flex h-16 md:h-[72px] items-center justify-between">
          {logo ? (
            <Link href="/" data-testid="link-home" className="flex-shrink-0">
              <img src={logo} alt="" className="h-12" />
            </Link>
          ) : (
            <Link href="/" data-testid="link-home" className="flex-shrink-0">
              <div className="flex items-center gap-2 cursor-pointer transition-all duration-200 hover:opacity-80">
                <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-[#2c7338] to-[#1e5427] flex items-center justify-center">
                  <Globe className="h-4 w-4 text-white" />
                </div>
                <span className="font-bold text-lg text-gray-900 dark:text-white">
                  Sim<span className="bg-gradient-to-r from-[#2c7338] to-[#3d9a4d] bg-clip-text text-transparent">finity</span>
                </span>
              </div>
            </Link>
          )}

          <nav className="hidden xl:flex items-center gap-0.5" data-testid="nav-main">
            <div
              className="relative"
              onMouseEnter={() => handleMenuEnter('products')}
              onMouseLeave={handleMenuLeave}
            >
              <span className="px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors cursor-pointer flex items-center gap-1">
                {t('website.nav.products', 'Products')}
                <ChevronDown className={cn('h-3.5 w-3.5 text-gray-400 transition-transform duration-200', activeMenu === 'products' && 'rotate-180')} />
              </span>

              <div className={cn(
                'absolute top-full left-1/2 -translate-x-1/2 pt-2 transition-all duration-200',
                activeMenu === 'products' ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'
              )}>
                <div className="w-[520px] bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-xl p-5">
                  <div className="grid grid-cols-2 gap-3">
                    <Link href="/destinations" onClick={() => setActiveMenu(null)}>
                      <div className="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors group cursor-pointer">
                        <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-[#f0f9f1] dark:bg-[#194520]/30 flex items-center justify-center group-hover:bg-[#dcf0de] dark:group-hover:bg-[#194520]/50 transition-colors">
                          <Globe className="h-5 w-5 text-[#2c7338] dark:text-[#3d9a4d]" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900 dark:text-white mb-0.5">{t('website.nav.localEsim', 'Local eSIMs')}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{t('website.nav.localEsimDesc', 'Country-specific data plans')}</p>
                        </div>
                      </div>
                    </Link>
                    <Link href="/destinations?tab=regions" onClick={() => setActiveMenu(null)}>
                      <div className="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors group cursor-pointer">
                        <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center group-hover:bg-blue-100 dark:group-hover:bg-blue-900/50 transition-colors">
                          <MapPin className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900 dark:text-white mb-0.5">{t('website.nav.regionalEsim', 'Regional eSIMs')}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{t('website.nav.regionalEsimDesc', 'Multi-country regional plans')}</p>
                        </div>
                      </div>
                    </Link>
                    <Link href="/destinations?tab=global" onClick={() => setActiveMenu(null)}>
                      <div className="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors group cursor-pointer">
                        <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-900/30 flex items-center justify-center group-hover:bg-purple-100 dark:group-hover:bg-purple-900/50 transition-colors">
                          <Wifi className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900 dark:text-white mb-0.5">{t('website.nav.globalEsim', 'Global eSIMs')}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{t('website.nav.globalEsimDesc', 'Worldwide coverage plans')}</p>
                        </div>
                      </div>
                    </Link>
                    <Link href="/destinations" onClick={() => setActiveMenu(null)}>
                      <div className="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors group cursor-pointer">
                        <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-900/30 flex items-center justify-center group-hover:bg-amber-100 dark:group-hover:bg-amber-900/50 transition-colors">
                          <Package className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900 dark:text-white mb-0.5">{t('website.nav.allPlans', 'All Plans')}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{t('website.nav.allPlansDesc', 'Browse all available plans')}</p>
                        </div>
                      </div>
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            <div
              className="relative"
              onMouseEnter={() => handleMenuEnter('resources')}
              onMouseLeave={handleMenuLeave}
            >
              <span className="px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors cursor-pointer flex items-center gap-1">
                {t('website.nav.resources', 'Resources')}
                <ChevronDown className={cn('h-3.5 w-3.5 text-gray-400 transition-transform duration-200', activeMenu === 'resources' && 'rotate-180')} />
              </span>

              <div className={cn(
                'absolute top-full left-1/2 -translate-x-1/2 pt-2 transition-all duration-200',
                activeMenu === 'resources' ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'
              )}>
                <div className="w-[280px] bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-xl p-2">
                  <Link href="/what-is-esim" onClick={() => setActiveMenu(null)}>
                    <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer">
                      <Smartphone className="h-4 w-4 text-[#2c7338]" />
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('website.nav.whatIsEsim', 'What is an eSIM')}</span>
                    </div>
                  </Link>
                  <Link href="/about-us" onClick={() => setActiveMenu(null)}>
                    <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer">
                      <Star className="h-4 w-4 text-amber-500" />
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('website.nav.about', 'About Us')}</span>
                    </div>
                  </Link>
                  <Link href="/reviews" onClick={() => setActiveMenu(null)}>
                    <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer">
                      <MessageCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('website.nav.reviews', 'Reviews')}</span>
                    </div>
                  </Link>
                  <Link href="/blog" onClick={() => setActiveMenu(null)}>
                    <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer">
                      <BookOpen className="h-4 w-4 text-blue-500" />
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('website.nav.blog', 'Blog')}</span>
                    </div>
                  </Link>
                  <Link href="/supported-devices" onClick={() => setActiveMenu(null)}>
                    <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer">
                      <Smartphone className="h-4 w-4 text-purple-500" />
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('website.nav.supportedDevices', 'Supported Devices')}</span>
                    </div>
                  </Link>
                </div>
              </div>
            </div>

            {navlinks?.data && navlinks.data.length > 0 && (
              <div
                className="relative"
                onMouseEnter={() => handleMenuEnter('pages')}
                onMouseLeave={handleMenuLeave}
              >
                <span className="px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors cursor-pointer flex items-center gap-1">
                  {t('website.nav.pages', 'Pages')}
                  <ChevronDown className={cn('h-3.5 w-3.5 text-gray-400 transition-transform duration-200', activeMenu === 'pages' && 'rotate-180')} />
                </span>

                <div className={cn(
                  'absolute top-full left-1/2 -translate-x-1/2 pt-2 transition-all duration-200',
                  activeMenu === 'pages' ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'
                )}>
                  <div className="w-[240px] bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-xl p-2">
                    {navlinks.data.map((page: any) => (
                      <Link key={page.id} href={`/pages/${page.slug}`} onClick={() => setActiveMenu(null)}>
                        <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer">
                          <FileText className="h-4 w-4 text-gray-400" />
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{page.title}</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div
              className="relative"
              onMouseEnter={() => handleMenuEnter('help')}
              onMouseLeave={handleMenuLeave}
            >
              <span className="px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors cursor-pointer flex items-center gap-1">
                {t('website.nav.help', 'Help')}
                <ChevronDown className={cn('h-3.5 w-3.5 text-gray-400 transition-transform duration-200', activeMenu === 'help' && 'rotate-180')} />
              </span>

              <div className={cn(
                'absolute top-full left-1/2 -translate-x-1/2 pt-2 transition-all duration-200',
                activeMenu === 'help' ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'
              )}>
                <div className="w-[280px] bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-xl p-2">
                  <Link href="/help-center?category=faq" onClick={() => setActiveMenu(null)}>
                    <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer">
                      <HelpCircle className="h-4 w-4 text-[#2c7338]" />
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('website.nav.faqs', 'FAQs')}</span>
                    </div>
                  </Link>
                  <Link href="/help-center?category=getting-started" onClick={() => setActiveMenu(null)}>
                    <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer">
                      <Compass className="h-4 w-4 text-blue-500" />
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('website.nav.gettingStarted', 'Getting Started')}</span>
                    </div>
                  </Link>
                  <Link href="/help-center?category=troubleshooting" onClick={() => setActiveMenu(null)}>
                    <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer">
                      <Wrench className="h-4 w-4 text-amber-500" />
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('website.nav.troubleshooting', 'Troubleshooting')}</span>
                    </div>
                  </Link>
                  <div className="mx-2 my-1 border-t border-gray-100 dark:border-gray-800" />
                  <Link href="/help-center?category=plans-payments" onClick={() => setActiveMenu(null)}>
                    <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer">
                      <Headphones className="h-4 w-4 text-purple-500" />
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('website.nav.helpCenter', 'Contact Support')}</span>
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          </nav>

          <div className="flex items-center gap-2 md:gap-3 flex-shrink-0">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <span className="hidden md:flex items-center gap-2 rounded-full px-3 py-2 border border-gray-200/80 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm transition-all cursor-pointer">
                  <ReactCountryFlag
                    countryCode={language?.flagCode || 'US'}
                    svg
                    style={{ width: '16px', height: '12px' }}
                  />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {languageCode.toUpperCase()}
                  </span>
                  <ChevronDown className="h-3 w-3 text-gray-400" />
                </span>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-56 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-lg rounded-xl p-1"
              >
                <div className="px-3 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('common.button.selectLanguage', 'Select Language')}
                </div>
                {languages.map((lang) => {
                  const active = languageCode === lang.code;
                  return (
                    <DropdownMenuItem
                      key={lang.code}
                      onClick={() => setLanguage(lang.code)}
                      className={cn(
                        'flex items-center justify-between cursor-pointer rounded-lg',
                        active ? 'bg-[#f0f9f1] dark:bg-[#194520]/20' : 'hover:bg-gray-50 dark:hover:bg-gray-800',
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <ReactCountryFlag
                          countryCode={lang.flagCode}
                          svg
                          style={{ width: '20px', height: '15px' }}
                        />
                        <div>
                          <div className={cn('font-medium text-sm', active ? 'text-[#1e5427] dark:text-[#3d9a4d]' : 'text-gray-700 dark:text-gray-300')}>
                            {lang.nativeName}
                          </div>
                          <div className="text-xs text-gray-500">{lang.name}</div>
                        </div>
                      </div>
                      {active && <div className="h-2 w-2 rounded-full bg-[#2c7338]" />}
                    </DropdownMenuItem>
                  );
                })}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* <div>
              <NotificationBell />
            </div> */}
            <div className="hidden sm:block">
              <CurrencySelector />
            </div>
            <div className="hidden sm:block">
              <ThemeToggle />
            </div>

            <Link href="/destinations">
              <span className="hidden md:flex items-center gap-2 text-sm font-semibold bg-gradient-to-r from-[#2c7338] to-[#3d9a4d] hover:from-[#1e5427] hover:to-[#2c7338] text-white rounded-full px-5 py-2.5 transition-colors shadow-sm hover:shadow-md whitespace-nowrap">
                <Search className="h-3.5 w-3.5" />
                {t('website.nav.seePacks', 'Destinations')}
              </span>
            </Link>

            {!isLoading && !isAuthenticated && (
              <Link href="/login">
                <span className="hidden md:flex text-sm font-medium text-gray-700 dark:text-gray-300 rounded-full px-4 py-2.5 border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all gap-2 items-center whitespace-nowrap">
                  <User className="h-4 w-4" />
                  {t('website.nav.signIn', 'Sign In')}
                </span>
              </Link>
            )}

            {!isLoading && isAuthenticated && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <span className="hidden md:block rounded-full p-1 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all cursor-pointer">
                    <div className="h-8 w-8 rounded-full bg-[#dcf0de] dark:bg-[#194520]/40 flex items-center justify-center">
                      <User className="h-4 w-4 text-[#2c7338] dark:text-[#3d9a4d]" />
                    </div>
                  </span>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-56 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-lg rounded-xl p-1"
                >
                  <div className="px-3 py-2.5 border-b border-gray-100 dark:border-gray-800">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {user?.name || 'User'}
                    </p>
                    <p className="text-xs text-gray-500">{user?.email}</p>
                  </div>
                  <DropdownMenuItem asChild>
                    <Link
                      href="/account/profile"
                      className="cursor-pointer flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                    >
                      <User className="h-4 w-4" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link
                      href="/account/orders"
                      className="cursor-pointer flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                    >
                      <ShoppingBag className="h-4 w-4" />
                      My Orders
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-gray-100 dark:bg-gray-800" />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="text-red-600 dark:text-red-400 focus:text-red-600 dark:focus:text-red-400 cursor-pointer rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20"
                  >
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <button className="xl:hidden p-2 hover:bg-white/50 dark:hover:bg-gray-800 rounded-lg transition-colors">
                  <Menu className="h-5 w-5 text-gray-700 dark:text-gray-300" />
                </button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="w-[85vw] sm:w-80 p-0 bg-white dark:bg-gray-950 overflow-y-auto [&>button]:hidden"
              >
                <SheetHeader className="border-b border-gray-100 dark:border-gray-800 p-5 flex flex-row items-center justify-between">
                  <SheetTitle className="text-gray-900 dark:text-white text-lg">Menu</SheetTitle>
                  <button onClick={closeMobileMenu} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors">
                    <X className="h-5 w-5 text-gray-500" />
                  </button>
                </SheetHeader>

                <nav className="flex flex-col p-5 space-y-1">
                  {isAuthenticated && (
                    <div className="mb-4 pb-4 border-b border-gray-100 dark:border-gray-800">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="h-10 w-10 rounded-full bg-[#dcf0de] dark:bg-[#194520]/40 flex items-center justify-center">
                          <User className="h-5 w-5 text-[#2c7338] dark:text-[#3d9a4d]" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">{user?.name || 'User'}</p>
                          <p className="text-xs text-gray-500">{user?.email}</p>
                        </div>
                      </div>
                      <div className="flex flex-col gap-1">
                        <Link href="/account/profile" onClick={closeMobileMenu}>
                          <span className="block py-2 px-3 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-all">Profile</span>
                        </Link>
                        <Link href="/account/orders" onClick={closeMobileMenu}>
                          <span className="block py-2 px-3 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-all">My Orders</span>
                        </Link>
                      </div>
                    </div>
                  )}

                  <div className="space-y-1">
                    <button
                      onClick={() => setProductsOpen(!productsOpen)}
                      className="w-full flex items-center justify-between py-2.5 px-3 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-all"
                    >
                      {t('website.nav.products', 'Products')}
                      <ChevronRight className={cn('h-4 w-4 text-gray-400 transition-transform duration-200', productsOpen && 'rotate-90')} />
                    </button>
                    {productsOpen && (
                      <div className="ml-3 space-y-1 border-l-2 border-[#2c7338]/30 pl-3">
                        <Link href="/destinations" onClick={closeMobileMenu}>
                          <span className="flex items-center gap-2 py-2 px-3 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-all">
                            <Globe className="h-4 w-4 text-[#2c7338]" />
                            {t('website.nav.localEsim', 'Local eSIMs')}
                          </span>
                        </Link>
                        <Link href="/destinations?tab=regions" onClick={closeMobileMenu}>
                          <span className="flex items-center gap-2 py-2 px-3 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-all">
                            <MapPin className="h-4 w-4 text-blue-500" />
                            {t('website.nav.regionalEsim', 'Regional eSIMs')}
                          </span>
                        </Link>
                        <Link href="/destinations?tab=global" onClick={closeMobileMenu}>
                          <span className="flex items-center gap-2 py-2 px-3 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-all">
                            <Wifi className="h-4 w-4 text-purple-500" />
                            {t('website.nav.globalEsim', 'Global eSIMs')}
                          </span>
                        </Link>
                      </div>
                    )}
                  </div>

                  <div className="space-y-1">
                    <button
                      onClick={() => setResourcesOpen(!resourcesOpen)}
                      className="w-full flex items-center justify-between py-2.5 px-3 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-all"
                    >
                      {t('website.nav.resources', 'Resources')}
                      <ChevronRight className={cn('h-4 w-4 text-gray-400 transition-transform duration-200', resourcesOpen && 'rotate-90')} />
                    </button>
                    {resourcesOpen && (
                      <div className="ml-3 space-y-1 border-l-2 border-[#2c7338]/30 pl-3">
                        <Link href="/what-is-esim" onClick={closeMobileMenu}>
                          <span className="flex items-center gap-2 py-2 px-3 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-all">
                            <Smartphone className="h-4 w-4" />
                            {t('website.nav.whatIsEsim', 'What is an eSIM')}
                          </span>
                        </Link>
                        <Link href="/about-us" onClick={closeMobileMenu}>
                          <span className="flex items-center gap-2 py-2 px-3 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-all">
                            <Star className="h-4 w-4" />
                            {t('website.nav.about', 'About Us')}
                          </span>
                        </Link>
                        <Link href="/reviews" onClick={closeMobileMenu}>
                          <span className="flex items-center gap-2 py-2 px-3 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-all">
                            <MessageCircle className="h-4 w-4" />
                            {t('website.nav.reviews', 'Reviews')}
                          </span>
                        </Link>
                        <Link href="/blog" onClick={closeMobileMenu}>
                          <span className="flex items-center gap-2 py-2 px-3 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-all">
                            <BookOpen className="h-4 w-4" />
                            {t('website.nav.blog', 'Blog')}
                          </span>
                        </Link>
                        <Link href="/supported-devices" onClick={closeMobileMenu}>
                          <span className="flex items-center gap-2 py-2 px-3 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-all">
                            <Smartphone className="h-4 w-4" />
                            {t('website.nav.supportedDevices', 'Supported Devices')}
                          </span>
                        </Link>
                      </div>
                    )}
                  </div>

                  {navlinks?.data && navlinks.data.length > 0 && (
                    <div className="space-y-1">
                      <button
                        onClick={() => setPagesOpen(!pagesOpen)}
                        className="w-full flex items-center justify-between py-2.5 px-3 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-all"
                      >
                        {t('website.nav.pages', 'Pages')}
                        <ChevronRight className={cn('h-4 w-4 text-gray-400 transition-transform duration-200', pagesOpen && 'rotate-90')} />
                      </button>
                      {pagesOpen && (
                        <div className="ml-3 space-y-1 border-l-2 border-[#2c7338]/30 pl-3">
                          {navlinks.data.map((page: any) => (
                            <Link key={page.id} href={`/pages/${page.slug}`} onClick={closeMobileMenu}>
                              <span className="flex items-center gap-2 py-2 px-3 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-all">
                                <FileText className="h-4 w-4" />
                                {page.title}
                              </span>
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                  <div className="space-y-1">
                    <button
                      onClick={() => setHelpOpen(!helpOpen)}
                      className="w-full flex items-center justify-between py-2.5 px-3 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-all"
                    >
                      {t('website.nav.help', 'Help')}
                      <ChevronRight className={cn('h-4 w-4 text-gray-400 transition-transform duration-200', helpOpen && 'rotate-90')} />
                    </button>
                    {helpOpen && (
                      <div className="ml-3 space-y-1 border-l-2 border-[#2c7338]/30 pl-3">
                        <Link href="/help-center?category=faq" onClick={closeMobileMenu}>
                          <span className="flex items-center gap-2 py-2 px-3 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-all">
                            <HelpCircle className="h-4 w-4" />
                            {t('website.nav.faqs', 'FAQs')}
                          </span>
                        </Link>
                        <Link href="/help-center?category=getting-started" onClick={closeMobileMenu}>
                          <span className="flex items-center gap-2 py-2 px-3 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-all">
                            <Compass className="h-4 w-4" />
                            {t('website.nav.gettingStarted', 'Getting Started')}
                          </span>
                        </Link>
                        <Link href="/help-center?category=troubleshooting" onClick={closeMobileMenu}>
                          <span className="flex items-center gap-2 py-2 px-3 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-all">
                            <Wrench className="h-4 w-4" />
                            {t('website.nav.troubleshooting', 'Troubleshooting')}
                          </span>
                        </Link>
                        <Link href="/help-center?category=plans-payments" onClick={closeMobileMenu}>
                          <span className="flex items-center gap-2 py-2 px-3 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-all">
                            <Headphones className="h-4 w-4 text-purple-500" />
                            {t('website.nav.helpCenter', 'Contact Support')}
                          </span>
                        </Link>
                      </div>
                    )}
                  </div>

                  <div className="pt-4">
                    <Link href="/destinations" onClick={closeMobileMenu}>
                      <span className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-[#2c7338] to-[#3d9a4d] hover:from-[#1e5427] hover:to-[#2c7338] text-white text-sm font-semibold py-3 px-4 rounded-full shadow-sm transition-all text-center">
                        <Search className="h-4 w-4" />
                        {t('website.nav.seePacks', 'Destinations')}
                      </span>
                    </Link>
                  </div>

                  <div className="pt-4 mt-4 border-t border-gray-100 dark:border-gray-800 space-y-3">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wider px-3">Settings</p>

                    <div>
                      <button
                        onClick={() => setLanguageOpen(!languageOpen)}
                        className="w-full flex items-center justify-between py-2.5 px-3 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-all"
                      >
                        <div className="flex items-center gap-2">
                          <Globe className="h-4 w-4" />
                          {t('common.button.selectLanguage', 'Language')}
                        </div>
                        <div className="flex items-center gap-2">
                          <ReactCountryFlag countryCode={language?.flagCode || 'US'} svg style={{ width: '16px', height: '12px' }} />
                          <span className="text-xs text-gray-600 dark:text-gray-400">{languageCode.toUpperCase()}</span>
                          <ChevronRight className={cn('h-4 w-4 text-gray-400 transition-transform duration-200', languageOpen && 'rotate-90')} />
                        </div>
                      </button>
                      {languageOpen && (
                        <div className="ml-3 mt-2 space-y-1 border-l-2 border-[#2c7338]/30 pl-3 max-h-60 overflow-y-auto">
                          {languages.map((lang) => (
                            <button
                              key={lang.code}
                              onClick={() => { setLanguage(lang.code); setLanguageOpen(false); }}
                              className={cn(
                                'w-full flex items-center justify-between py-2 px-3 text-sm rounded-lg transition-all',
                                languageCode === lang.code ? 'bg-gradient-to-r from-[#2c7338] to-[#3d9a4d] text-white' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                              )}
                            >
                              <div className="flex items-center gap-2">
                                <ReactCountryFlag countryCode={lang.flagCode} svg style={{ width: '18px', height: '13px' }} />
                                <span>{lang.nativeName}</span>
                              </div>
                              {languageCode === lang.code && <div className="h-2 w-2 rounded-full bg-white" />}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between px-3 py-2">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Theme</span>
                      <ThemeToggle />
                    </div>
                    <div className="flex items-center justify-between px-3 py-2">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Currency</span>
                      <CurrencySelector />
                    </div>
                    {/* <div className="flex items-center justify-between px-3 py-2">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Notifications</span>
                      <NotificationBell />
                    </div> */}
                  </div>

                  {!isAuthenticated && (
                    <div className="pt-4 mt-4 border-t border-gray-100 dark:border-gray-800">
                      <Link href="/login" onClick={closeMobileMenu}>
                        <span className="flex items-center justify-center gap-2 w-full border border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-700 dark:text-gray-300 py-2.5 px-4 rounded-full hover:bg-gray-50 dark:hover:bg-gray-800 transition-all">
                          <User className="h-4 w-4" />
                          {t('website.nav.signIn', 'Sign In')}
                        </span>
                      </Link>
                    </div>
                  )}

                  {isAuthenticated && (
                    <div className="pt-4 mt-4 border-t border-gray-100 dark:border-gray-800">
                      <button
                        onClick={() => { handleLogout(); closeMobileMenu(); }}
                        className="w-full text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 text-sm font-medium py-2.5 px-4 rounded-full transition-all"
                      >
                        Sign Out
                      </button>
                    </div>
                  )}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div >
    </header >
  );
}

export default SiteHeader;
