'use client';

import { useState, useEffect } from 'react';
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
import { GiFastBackwardButton } from 'react-icons/gi';
import { TfiGift } from 'react-icons/tfi';

export function SiteHeader() {
  const { isAuthenticated, isLoading, user, refetchUser } = useUser();
  const { toast } = useToast();
  const { languages, languageCode, setLanguage, t, language } = useTranslation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [resourcesOpen, setResourcesOpen] = useState(false);
  const [pagesOpen, setPagesOpen] = useState(false);
  const [languageOpen, setLanguageOpen] = useState(false);
  const [, setLocation] = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);

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
    setLanguageOpen(false);
  };

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        isScrolled
          ? 'bg-white/95 dark:bg-gray-950/95 backdrop-blur-md shadow-sm border-b border-gray-100 dark:border-gray-800'
          : 'bg-transparent'
      )}
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="flex h-16 md:h-[72px] items-center justify-between">
          {logo ? (
            <Link href="/" data-testid="link-home" className="flex-shrink-0">
              <img src={logo} alt="" className="h-7" />
            </Link>
          ) : (
            <Link href="/" data-testid="link-home" className="flex-shrink-0">
              <div className="flex items-center gap-2 cursor-pointer transition-all duration-200 hover:opacity-80">
                <div className="h-8 w-8 rounded-lg bg-teal-500 flex items-center justify-center">
                  <Globe className="h-4 w-4 text-white" />
                </div>
                <span className="font-bold text-lg text-gray-900 dark:text-white">
                  eSIM<span className="text-teal-500">Connect</span>
                </span>
              </div>
            </Link>
          )}

          <nav className="hidden xl:flex items-center gap-1" data-testid="nav-main">
            <Link href="/what-is-esim">
              <span className="px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors cursor-pointer">
                {t('website.nav.whatIsEsim', 'What is an eSIM')}
              </span>
            </Link>

            <Link href="/about-us">
              <span className="px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors cursor-pointer">
                {t('website.nav.about', 'About Us')}
              </span>
            </Link>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <span className="px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors cursor-pointer flex items-center gap-1 group">
                  {t('website.nav.resources', 'Resources')}
                  <ChevronDown className="h-3.5 w-3.5 text-gray-500 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                </span>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="start"
                className="w-52 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-lg rounded-xl p-1"
              >
                <DropdownMenuItem asChild>
                  <Link
                    href="/account/support"
                    className="flex items-center gap-2.5 cursor-pointer rounded-lg px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    <Headphones className="h-4 w-4 text-gray-500" />
                    {t('website.nav.helpCenter', 'Help Center')}
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link
                    href="/blog"
                    className="flex items-center gap-2.5 cursor-pointer rounded-lg px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    <BookOpen className="h-4 w-4 text-gray-500" />
                    {t('website.nav.blog', 'Blog')}
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link
                    href="/faq"
                    className="flex items-center gap-2.5 cursor-pointer rounded-lg px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    <MessageCircle className="h-4 w-4 text-gray-500" />
                    {t('website.nav.faqs', 'FAQs')}
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <span className="px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors cursor-pointer flex items-center gap-1 group">
                  {t('website.nav.pages', 'Pages')}
                  <ChevronDown className="h-3.5 w-3.5 text-gray-500 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                </span>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="start"
                className="w-52 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-lg rounded-xl p-1"
              >
                {navlinks?.data?.map((page: any) => (
                  <DropdownMenuItem key={page.id} asChild>
                    <Link
                      href={`/pages/${page.slug}`}
                      className="flex items-center gap-2.5 cursor-pointer rounded-lg px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                    >
                      <FileText className="h-4 w-4 text-gray-500" />
                      {page.title}
                    </Link>
                  </DropdownMenuItem>
                ))}
                {navlinks?.data?.length === 0 && (
                  <DropdownMenuItem disabled className="text-sm text-gray-400">No pages available</DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            <Link href="/supported-devices">
              <span className="px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors cursor-pointer">
                {t('website.nav.supportedDevices', 'Supported Devices')}
              </span>
            </Link>
          </nav>

          <div className="flex items-center gap-2 md:gap-3 flex-shrink-0">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <span className="hidden md:flex items-center gap-2 rounded-full px-3 py-2 border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm transition-all cursor-pointer">
                  <ReactCountryFlag
                    countryCode={language?.flagCode || 'US'}
                    svg
                    style={{ width: '16px', height: '12px' }}
                  />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {languageCode.toUpperCase()}
                  </span>
                  <ChevronDown className="h-3 w-3 text-gray-500" />
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
                        active ? 'bg-teal-50 dark:bg-teal-900/20' : 'hover:bg-gray-50 dark:hover:bg-gray-800',
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <ReactCountryFlag
                          countryCode={lang.flagCode}
                          svg
                          style={{ width: '20px', height: '15px' }}
                        />
                        <div>
                          <div className={cn('font-medium text-sm', active ? 'text-teal-700 dark:text-teal-400' : 'text-gray-700 dark:text-gray-300')}>
                            {lang.nativeName}
                          </div>
                          <div className="text-xs text-gray-500">{lang.name}</div>
                        </div>
                      </div>

                      {active && <div className="h-2 w-2 rounded-full bg-teal-500" />}
                    </DropdownMenuItem>
                  );
                })}
              </DropdownMenuContent>
            </DropdownMenu>

            <div>
              <NotificationBell />
            </div>
            <div className="hidden sm:block">
              <CurrencySelector />
            </div>
            <div className="hidden sm:block">
              <ThemeToggle />
            </div>

            <Link href="/destinations">
              <span className="hidden md:flex items-center gap-2 text-sm font-semibold bg-teal-500 hover:bg-teal-600 text-white rounded-full px-5 py-2.5 transition-colors shadow-sm hover:shadow-md whitespace-nowrap">
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
                    <div className="h-8 w-8 rounded-full bg-teal-100 dark:bg-teal-900/40 flex items-center justify-center">
                      <User className="h-4 w-4 text-teal-600 dark:text-teal-400" />
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
                <button className="xl:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
                  <Menu className="h-5 w-5 text-gray-700 dark:text-gray-300" />
                </button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="w-[85vw] sm:w-80 p-0 bg-white dark:bg-gray-950 overflow-y-auto"
              >
                <SheetHeader className="border-b border-gray-100 dark:border-gray-800 p-5 flex flex-row items-center justify-between">
                  <SheetTitle className="text-gray-900 dark:text-white text-lg">
                    Menu
                  </SheetTitle>
                  <button
                    onClick={closeMobileMenu}
                    className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors"
                  >
                    <X className="h-5 w-5 text-gray-500" />
                  </button>
                </SheetHeader>

                <nav className="flex flex-col p-5 space-y-1">
                  {isAuthenticated && (
                    <div className="mb-4 pb-4 border-b border-gray-100 dark:border-gray-800">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="h-10 w-10 rounded-full bg-teal-100 dark:bg-teal-900/40 flex items-center justify-center">
                          <User className="h-5 w-5 text-teal-600 dark:text-teal-400" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {user?.name || 'User'}
                          </p>
                          <p className="text-xs text-gray-500">{user?.email}</p>
                        </div>
                      </div>
                      <div className="flex flex-col gap-1">
                        <Link href="/account/profile" onClick={closeMobileMenu}>
                          <span className="block py-2 px-3 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-all">
                            Profile
                          </span>
                        </Link>
                        <Link href="/account/orders" onClick={closeMobileMenu}>
                          <span className="block py-2 px-3 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-all">
                            My Orders
                          </span>
                        </Link>
                      </div>
                    </div>
                  )}

                  <Link href="/what-is-esim" onClick={closeMobileMenu}>
                    <span className="block py-2.5 px-3 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-all">
                      {t('website.nav.whatIsEsim', 'What is an eSIM')}
                    </span>
                  </Link>

                  <Link href="/about-us" onClick={closeMobileMenu}>
                    <span className="block py-2.5 px-3 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-all">
                      {t('website.nav.about', 'About Us')}
                    </span>
                  </Link>

                  <div className="space-y-1">
                    <button
                      onClick={() => setResourcesOpen(!resourcesOpen)}
                      className="w-full flex items-center justify-between py-2.5 px-3 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-all"
                    >
                      {t('website.nav.resources', 'Resources')}
                      <ChevronRight
                        className={cn(
                          'h-4 w-4 text-gray-400 transition-transform duration-200',
                          resourcesOpen && 'rotate-90'
                        )}
                      />
                    </button>
                    {resourcesOpen && (
                      <div className="ml-4 space-y-1 border-l-2 border-teal-500/30 pl-3">
                        <Link href="/account/support" onClick={closeMobileMenu}>
                          <span className="flex items-center gap-2 py-2 px-3 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-all">
                            <Headphones className="h-4 w-4" />
                            {t('website.nav.helpCenter', 'Help Center')}
                          </span>
                        </Link>
                        <Link href="/blog" onClick={closeMobileMenu}>
                          <span className="flex items-center gap-2 py-2 px-3 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-all">
                            <BookOpen className="h-4 w-4" />
                            {t('website.nav.blog', 'Blog')}
                          </span>
                        </Link>
                        <Link href="/faq" onClick={closeMobileMenu}>
                          <span className="flex items-center gap-2 py-2 px-3 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-all">
                            <MessageCircle className="h-4 w-4" />
                            {t('website.nav.faqs', 'FAQs')}
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
                        Pages
                        <ChevronRight
                          className={cn(
                            'h-4 w-4 text-gray-400 transition-transform duration-200',
                            pagesOpen && 'rotate-90'
                          )}
                        />
                      </button>
                      {pagesOpen && (
                        <div className="ml-4 space-y-1 border-l-2 border-teal-500/30 pl-3">
                          {navlinks.data.map((page: any) => (
                            <Link
                              key={page.id}
                              href={`/pages/${page.slug}`}
                              onClick={closeMobileMenu}
                            >
                              <span className="flex items-center gap-2 py-2 px-3 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-all">
                                <FileText className="h-4 w-4" />
                                {page.title}
                              </span>
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  <Link href="/supported-devices" onClick={closeMobileMenu}>
                    <span className="block py-2.5 px-3 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-all">
                      {t('website.nav.supportedDevices', 'Supported Devices')}
                    </span>
                  </Link>

                  <div className="pt-4">
                    <Link href="/destinations" onClick={closeMobileMenu}>
                      <span className="flex items-center justify-center gap-2 w-full bg-teal-500 hover:bg-teal-600 text-white text-sm font-semibold py-3 px-4 rounded-full shadow-sm transition-all text-center">
                        <Search className="h-4 w-4" />
                        {t('website.nav.seePacks', 'Destinations')}
                      </span>
                    </Link>
                  </div>

                  <div className="pt-4 mt-4 border-t border-gray-100 dark:border-gray-800 space-y-3">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wider px-3">
                      Settings
                    </p>

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
                          <ReactCountryFlag
                            countryCode={language?.flagCode || 'US'}
                            svg
                            style={{ width: '16px', height: '12px' }}
                          />
                          <span className="text-xs text-gray-600 dark:text-gray-400">
                            {languageCode.toUpperCase()}
                          </span>
                          <ChevronRight
                            className={cn(
                              'h-4 w-4 text-gray-400 transition-transform duration-200',
                              languageOpen && 'rotate-90'
                            )}
                          />
                        </div>
                      </button>
                      {languageOpen && (
                        <div className="ml-4 mt-2 space-y-1 border-l-2 border-teal-500/30 pl-3 max-h-60 overflow-y-auto">
                          {languages.map((lang) => (
                            <button
                              key={lang.code}
                              onClick={() => {
                                setLanguage(lang.code);
                                setLanguageOpen(false);
                              }}
                              className={cn(
                                'w-full flex items-center justify-between py-2 px-3 text-sm rounded-lg transition-all',
                                languageCode === lang.code
                                  ? 'bg-teal-500 text-white'
                                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                              )}
                            >
                              <div className="flex items-center gap-2">
                                <ReactCountryFlag
                                  countryCode={lang.flagCode}
                                  svg
                                  style={{ width: '18px', height: '13px' }}
                                />
                                <span>{lang.nativeName}</span>
                              </div>
                              {languageCode === lang.code && (
                                <div className="h-2 w-2 rounded-full bg-white" />
                              )}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between px-3 py-2">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Theme
                      </span>
                      <ThemeToggle />
                    </div>
                    <div className="flex items-center justify-between px-3 py-2">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Currency
                      </span>
                      <CurrencySelector />
                    </div>
                    <div className="flex items-center justify-between px-3 py-2">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Notifications
                      </span>
                      <NotificationBell />
                    </div>
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
                        onClick={() => {
                          handleLogout();
                          closeMobileMenu();
                        }}
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
      </div>
    </header>
  );
}

export default SiteHeader;
