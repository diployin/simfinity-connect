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
  X,
  Package,
  Bell,
  Search,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { CurrencySelector } from '@/components/CurrencySelector';
import { useUser } from '@/hooks/use-user';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from '@/contexts/TranslationContext';
import ReactCountryFlag from 'react-country-flag';
import { NotificationBell } from '../NotificationBell';
import { useQuery } from '@tanstack/react-query';
import { useSettingByKey } from '@/hooks/useSettings';
import useStaticData from '@/data/useStaticData';
import MegaMenuDropdown from '../MegaMenuDropdown';
import MegaMenuDropdownDestination from '../MegaMenuDropdownDestination';
import MobileDestinationSearch from '../Mobiledestinationsearch';
import { AppDispatch, RootState, useAppDispatch } from '@/redux/store/store';
import { toggleTopBar } from '@/redux/slice/topNavbarSlice';
import { useSelector } from 'react-redux';

export function NavbarNew() {
  const { isAuthenticated, isLoading, user, refetchUser } = useUser();
  const { toast } = useToast();
  const { languages, languageCode, setLanguage, t, language } = useTranslation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeMobileMenu, setActiveMobileMenu] = useState<string | null>(null);
  const [, setLocation] = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileDestinationSearchOpen, setIsMobileDestinationSearchOpen] = useState(false);
  const [visible, setVisible] = useState(true);
  const dispatch: AppDispatch = useAppDispatch();

  const { isExpanded } = useSelector((state: RootState) => state.topNavbar);

  const logo = useSettingByKey('logo');
  const staticData = useStaticData();

  const handleMegaMenuOpenChange = (isOpen: boolean) => {
    setIsMegaMenuOpen(isOpen);
  };

  const mobileMenuConfig = [
    {
      id: 'destinations',
      label: 'Destinations',
      icon: '📍',
      items: [
        {
          href: '/destinations',
          label: 'All Destinations',
          icon: '📍',
          description: 'Browse all countries & regions',
        },
        {
          href: '/destinations/popular',
          label: 'Popular',
          icon: '⭐',
          description: 'Top travel destinations',
        },
        {
          href: '/regions/europe',
          label: 'Europe',
          icon: '🇪🇺',
          description: '40+ European countries',
        },
        { href: '/regions/asia', label: 'Asia', icon: '🇨🇳', description: '25+ Asian destinations' },
        {
          href: '/regions/north-america',
          label: 'North America',
          icon: '🇺🇸',
          description: 'USA, Canada & more',
        },
      ],
    },
    {
      id: 'product',
      label: 'Product',
      icon: '🎁',
      items:
        staticData?.NavbarData?.productMegaMenuConfig?.columns?.flatMap((col: any) => col.items) ||
        [],
    },
    {
      id: 'resource',
      label: 'Resources',
      icon: '📚',
      items:
        staticData?.NavbarData?.rouceMegaMenuConfig?.columns?.flatMap((col: any) => col.items) ||
        [],
    },
    {
      id: 'offers',
      label: 'Offers',
      icon: '🎉',
      items:
        staticData?.NavbarData?.offersMegaMenuConfig?.columns?.flatMap((col: any) => col.items) ||
        [],
    },
    {
      id: 'help',
      label: 'Help',
      icon: '❓',
      items:
        staticData?.NavbarData?.helpMegaMenuConfig?.columns?.flatMap((col: any) => col.items) || [],
    },
  ];

  // Handle scroll event
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle logout
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
    setActiveMobileMenu(null);
  };

  const toggleMobileMenu = (menuId: string) => {
    setActiveMobileMenu(activeMobileMenu === menuId ? null : menuId);
  };

  const handleKeyDown = (e: React.KeyboardEvent, callback: () => void) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      callback();
    }
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      setLocation(`/search?q=${encodeURIComponent(searchQuery)}`);
      closeMobileMenu();
    }
  };

  const handleClose = () => {
    dispatch(toggleTopBar());
  };

  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-50">
        {/* <TopPromoBar /> */}
        <div className={`w-full bg-primary text-white relative ${isExpanded ? 'hidden' : 'block'}`}>
          <div className="max-w-7xl mx-auto px-8 sm:px-4 md:px-6 py-2 flex items-center justify-center gap-2 sm:gap-3 md:gap-4">
            {/* Message */}
            <p className="text-xs xs:text-sm sm:text-base md:text-sm font-medium text-center">
              ❄️ Get <span className="font-bold whitespace-nowrap">25% off 5GB+ plans</span> with
              the code{' '}
              <span className="font-bold bg-white/10 px-1.5 py-0.5 rounded whitespace-nowrap">
                SIMFINITY
              </span>
            </p>

            {/* Button - Responsive with different text on mobile */}
            <button className="px-2.5 sm:px-3 md:px-4 py-1 sm:py-1.5 md:py-2 text-xs sm:text-sm md:text-sm font-semibold border border-white rounded-full hover:bg-black hover:text-white transition whitespace-nowrap min-w-[80px] xs:min-w-[90px] sm:min-w-[110px] md:min-w-[120px]">
              <span className="hidden xs:inline">Get the Deal</span>
              <span className="xs:hidden">Get Deal</span>
            </button>
          </div>

          {/* Close Button */}
          <button
            onClick={handleClose}
            className="absolute right-2 sm:right-3 md:right-4 top-1/2 -translate-y-1/2 p-1 hover:opacity-70"
          >
            <X size={16} className="sm:w-[18px] sm:h-[18px]" />
          </button>
        </div>
        <header
          className={cn(
            'transition-all duration-300',
            // Default - always transparent
            'bg-transparent',
            // When mega menu is open - solid white background
            isMegaMenuOpen && '!bg-white',
            // When scrolled - blur background (but not if mega menu is open)
            isScrolled && !isMegaMenuOpen && 'backdrop-blur-2xl ',
            // Shadow when scrolled OR mega menu open
            (isScrolled || isMegaMenuOpen) && 'shadow-sm',
          )}
        >
          <div className="w-full">
            <div className="max-w-[1500px] mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
              <div className="flex items-center justify-between h-14 sm:h-16 md:h-18 lg:h-[72px] gap-2 sm:gap-3 md:gap-4 lg:gap-4 xl:gap-5">
                {/* 🔥 LEFT SIDE - LOGO */}
                <Link href="/" className="flex-shrink-0 z-10" data-testid="link-home">
                  {logo ? (
                    <img
                      src={logo}
                      alt="Logo"
                      className="h-7 sm:h-8 md:h-9 lg:h-12 xl:h-11 w-auto"
                    />
                  ) : (
                    <div className="flex items-center gap-2 cursor-pointer group">
                      <div className="h-7 w-7 sm:h-8 sm:w-8 md:h-9 md:w-9 lg:h-10 lg:w-10 xl:h-11 xl:w-11 rounded-lg bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center transition-transform duration-200 group-hover:rotate-6">
                        <Globe className="h-3.5 w-3.5 sm:h-4 sm:w-4 md:h-4.5 md:w-4.5 lg:h-5 lg:w-5 text-white" />
                      </div>
                      <span className="font-bold text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl dark:text-white text-gray-900 whitespace-nowrap">
                        Simfinity
                      </span>
                    </div>
                  )}
                </Link>

                {/* 🔥 RIGHT SIDE - PERFECT RESPONSIVE */}
                <div className="flex items-center flex-1 justify-end gap-1 sm:gap-1.5 md:gap-2 lg:gap-3 xl:gap-3 max-w-full">
                  {/* 🔥 DESKTOP NAV - XL+ ONLY */}
                  <nav className="hidden xl:flex items-center gap-0.5 xl:gap-0">
                    <MegaMenuDropdown
                      onOpenChange={handleMegaMenuOpenChange}
                      label={'Product'}
                      badge={'New'}
                      config={staticData?.NavbarData?.productMegaMenuConfig}
                    />
                    <MegaMenuDropdown
                      onOpenChange={handleMegaMenuOpenChange}
                      label={'Resources'}
                      config={staticData?.NavbarData?.rouceMegaMenuConfig}
                    />
                    <MegaMenuDropdown
                      onOpenChange={handleMegaMenuOpenChange}
                      label={'Offers'}
                      config={staticData?.NavbarData?.offersMegaMenuConfig}
                    />
                    <MegaMenuDropdown
                      onOpenChange={handleMegaMenuOpenChange}
                      label={'Help'}
                      config={staticData?.NavbarData?.helpMegaMenuConfig}
                    />
                  </nav>

                  {/* 🔥 DESKTOP DIVIDER */}

                  {/* 🔥 1. NOTIFICATION BELL - ALL DEVICES (BAHAR) */}

                  {/* 🔥 2. DESTINATIONS - LG+ DESKTOP ONLY */}
                  <MegaMenuDropdownDestination
                    label="Destinations"
                    onOpenChange={handleMegaMenuOpenChange}
                    className="hidden lg:inline-flex ml-1 md:ml-2"
                  />
                  <NotificationBell />

                  {/* 🔥 3. LANGUAGE SELECTOR - MD+ */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="hidden md:flex items-center gap-1 px-2 py-1.5 sm:px-2.5 sm:py-2 md:px-3 md:py-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-all">
                        <Globe className="h-3.5 w-3.5 md:h-4 md:w-4 text-black dark:text-gray-400" />
                        <span className="text-xs sm:text-sm md:text-sm font-medium text-black dark:text-gray-300 hidden sm:inline">
                          {languageCode.toUpperCase()}
                        </span>
                        <ChevronDown className="h-3 w-3 text-gray-500" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                      <div className="px-3 py-2 text-xs font-medium text-muted-foreground uppercase">
                        {t('common.button.selectLanguage', 'Select Language')}
                      </div>
                      {languages.map((lang) => {
                        const active = languageCode === lang.code;
                        return (
                          <DropdownMenuItem
                            key={lang.code}
                            onClick={() => setLanguage(lang.code)}
                            className="flex items-center justify-between cursor-pointer"
                          >
                            <div className="flex items-center gap-3">
                              <ReactCountryFlag
                                countryCode={lang.flagCode}
                                svg
                                style={{ width: '20px', height: '15px' }}
                              />
                              <div>
                                <div className="font-medium">{lang.nativeName}</div>
                                <div className="text-xs text-muted-foreground">{lang.name}</div>
                              </div>
                            </div>
                            {active && <div className="h-2 w-2 rounded-full bg-primary" />}
                          </DropdownMenuItem>
                        );
                      })}
                    </DropdownMenuContent>
                  </DropdownMenu>

                  {/* 🔥 4. UTILITIES - SM+ */}
                  <div className="hidden sm:flex items-center gap-1 md:gap-1.5 lg:gap-2">
                    <CurrencySelector />
                    {/* <ThemeToggle /> */}
                  </div>

                  {/* 🔥 5. AUTH SECTION - LG+ */}
                  {!isLoading && (
                    <>
                      {!isAuthenticated ? (
                        <Link href="/login" className="hidden lg:flex">
                          <button className="flex items-center gap-1.5 px-3 py-1.5 lg:px-4 lg:py-2 rounded-full border border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600 transition-all text-sm font-medium">
                            <User className="h-3.5 w-3.5 lg:h-4 lg:w-4" />
                            <span>{t('website.nav.signIn', 'Sign In')}</span>
                          </button>
                        </Link>
                      ) : (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button className="hidden lg:flex items-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 p-1.5 lg:p-2 transition-all">
                              <div className="h-7 w-7 lg:h-8 lg:w-8 rounded-full bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center">
                                <User className="h-4 w-4 text-white" />
                              </div>
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-56">
                            <div className="px-3 py-2 border-b">
                              <p className="text-sm font-medium truncate">{user?.name || 'User'}</p>
                              <p className="text-xs text-muted-foreground truncate">
                                {user?.email}
                              </p>
                            </div>
                            <DropdownMenuItem asChild>
                              <Link href="/account/profile" className="flex items-center gap-2">
                                <User className="h-4 w-4" />
                                Profile
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link href="/account/orders" className="flex items-center gap-2">
                                <ShoppingBag className="h-4 w-4" />
                                My Orders
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={handleLogout}
                              className="text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                            >
                              Sign Out
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </>
                  )}

                  {/* 🔥 MOBILE SEARCH ICON - SM & BELOW */}
                  <button
                    onClick={() => setIsMobileDestinationSearchOpen(true)}
                    className="lg:hidden p-1.5 sm:p-2 md:p-2.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all"
                    aria-label="Search destinations"
                  >
                    <Search className="h-5 w-5 sm:h-6 sm:w-6" />
                  </button>

                  {/* 🔥 MOBILE HAMBURGER - XL & BELOW */}
                  <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                    <SheetTrigger asChild>
                      <button
                        className="xl:hidden p-1.5 sm:p-2 md:p-2.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all ml-1 sm:ml-2"
                        aria-label="Open menu"
                      >
                        <Menu className="h-5 w-5 sm:h-6 sm:w-6" />
                      </button>
                    </SheetTrigger>
                    <SheetContent
                      side="right"
                      className="w-full p-0 pt-0 bg-white dark:bg-background flex flex-col"
                    >
                      {/* 🔥 MOBILE HEADER WITH LOGO & CLOSE */}
                      <SheetHeader className="border-b p-4 sticky top-0 bg-background/95 backdrop-blur-sm z-20">
                        <div className="flex items-center justify-between w-full">
                          <div className="flex items-center gap-2">
                            {logo ? (
                              <img src={logo} alt="Logo" className="h-7 w-auto" />
                            ) : (
                              <>
                                <div className="h-6 w-6 rounded-lg bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center">
                                  <Globe className="h-3.5 w-3.5 text-white" />
                                </div>
                                <span className="font-bold text-lg dark:text-white text-gray-900">
                                  Simfinity
                                </span>
                              </>
                            )}
                          </div>
                          <button
                            onClick={() => closeMobileMenu()}
                            className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all flex-shrink-0"
                            aria-label="Close menu"
                          >
                            <X className="h-5 w-5" />
                          </button>
                        </div>
                      </SheetHeader>

                      {/* 🔥 MOBILE CONTENT - SCROLLABLE */}
                      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
                        {/* 🔥 AUTHENTICATED USER PROFILE */}
                        {!isLoading && isAuthenticated && (
                          <div className="mb-4 pb-4 border-b rounded-xl p-3 bg-gradient-to-r from-teal-50/80 to-blue-50/80 dark:from-teal-900/30 dark:to-blue-900/30 backdrop-blur-sm">
                            <div className="flex items-center gap-3 mb-3">
                              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center flex-shrink-0 shadow-lg">
                                <User className="h-5 w-5 text-white" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold truncate">
                                  {user?.name || 'User'}
                                </p>
                                <p className="text-xs text-muted-foreground truncate">
                                  {user?.email}
                                </p>
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                              <Link
                                href="/account/profile"
                                onClick={closeMobileMenu}
                                className="flex items-center justify-center gap-2 p-2.5 rounded-lg border border-teal-200 dark:border-teal-700 hover:bg-white dark:hover:bg-gray-800 hover:shadow-md transition-all text-xs font-medium hover:border-teal-300"
                              >
                                <User className="h-4 w-4 flex-shrink-0" />
                                Profile
                              </Link>
                              <Link
                                href="/account/orders"
                                onClick={closeMobileMenu}
                                className="flex items-center justify-center gap-2 p-2.5 rounded-lg border border-teal-200 dark:border-teal-700 hover:bg-white dark:hover:bg-gray-800 hover:shadow-md transition-all text-xs font-medium hover:border-teal-300"
                              >
                                <ShoppingBag className="h-4 w-4 flex-shrink-0" />
                                Orders
                              </Link>
                            </div>
                          </div>
                        )}

                        {/* 🔥 ALL MOBILE MENU SECTIONS */}
                        <div className="space-y-2">
                          {mobileMenuConfig.map((menu) => (
                            <div
                              key={menu.id}
                              className="rounded-xl border border-gray-100 dark:border-gray-800 overflow-hidden"
                            >
                              <button
                                type="button"
                                onClick={() => toggleMobileMenu(menu.id)}
                                onKeyDown={(e) => handleKeyDown(e, () => toggleMobileMenu(menu.id))}
                                className="flex w-full items-center justify-between py-3 px-4 text-left text-sm font-semibold hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all group"
                                aria-expanded={activeMobileMenu === menu.id}
                              >
                                <span className="flex items-center gap-3">
                                  {/* <span className="text-lg">{menu.icon}</span> */}
                                  <span className="group-hover:text-teal-600 dark:group-hover:text-teal-400">
                                    {menu.label}
                                  </span>
                                </span>
                                <ChevronDown
                                  className={cn(
                                    'h-4 w-4 transition-transform duration-200 flex-shrink-0',
                                    activeMobileMenu === menu.id && 'rotate-180',
                                  )}
                                />
                              </button>

                              {activeMobileMenu === menu.id && (
                                <div className="bg-gray-50/80 dark:bg-gray-900/30 border-t border-gray-100 dark:border-gray-800 space-y-1 p-2">
                                  {menu.items.map((item, idx) => (
                                    <Link
                                      key={idx}
                                      href={item.href}
                                      onClick={closeMobileMenu}
                                      className="group flex items-center gap-3 p-3 rounded-lg hover:bg-white dark:hover:bg-gray-800 hover:shadow-sm transition-all text-sm"
                                    >
                                      <span className="text-base flex-shrink-0">
                                        {item.icon || '•'}
                                      </span>
                                      <div className="flex-1 min-w-0">
                                        <div className="font-medium text-sm group-hover:text-teal-600 dark:group-hover:text-teal-400 truncate">
                                          {item.label}
                                        </div>
                                        {item.description && (
                                          <div className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                                            {item.description}
                                          </div>
                                        )}
                                      </div>
                                    </Link>
                                  ))}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>

                        {/* 🔥 LANGUAGE & CURRENCY IN MOBILE MENU */}
                        <div className="space-y-2 mt-6 pt-4 border-t">
                          {/* Language Selector */}
                          <button
                            onClick={() => toggleMobileMenu('language')}
                            className="flex w-full items-center justify-between py-3 px-4 text-left text-sm font-semibold hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all rounded-lg border border-gray-100 dark:border-gray-800 group"
                          >
                            <span className="flex items-center gap-3">
                              <Globe className="h-4 w-4" />
                              <span className="group-hover:text-teal-600 dark:group-hover:text-teal-400">
                                {languageCode.toUpperCase()}
                              </span>
                            </span>
                            <ChevronDown
                              className={cn(
                                'h-4 w-4 transition-transform duration-200',
                                activeMobileMenu === 'language' && 'rotate-180',
                              )}
                            />
                          </button>

                          {activeMobileMenu === 'language' && (
                            <div className="bg-gray-50/80 dark:bg-gray-900/30 border border-gray-100 dark:border-gray-800 rounded-lg overflow-hidden space-y-1 p-2">
                              {languages.map((lang) => {
                                const active = languageCode === lang.code;
                                return (
                                  <button
                                    key={lang.code}
                                    onClick={() => {
                                      setLanguage(lang.code);
                                      setActiveMobileMenu(null);
                                    }}
                                    className={cn(
                                      'flex items-center justify-between w-full p-3 rounded-lg text-sm transition-all hover:bg-white dark:hover:bg-gray-800',
                                      active && 'bg-white dark:bg-gray-800 border border-teal-500',
                                    )}
                                  >
                                    <div className="flex items-center gap-3">
                                      <ReactCountryFlag
                                        countryCode={lang.flagCode}
                                        svg
                                        style={{ width: '18px', height: '13px' }}
                                      />
                                      <div className="text-left">
                                        <div className="font-medium text-sm">{lang.nativeName}</div>
                                        <div className="text-xs text-muted-foreground">
                                          {lang.name}
                                        </div>
                                      </div>
                                    </div>
                                    {active && <div className="h-2 w-2 rounded-full bg-teal-600" />}
                                  </button>
                                );
                              })}
                            </div>
                          )}

                          {/* Currency Selector */}
                          <div className="pt-2">
                            <CurrencySelector />
                          </div>
                        </div>
                      </div>

                      {/* 🔥 MOBILE BOTTOM FIXED CTA SECTION */}
                      <div className="p-4 border-t bg-gradient-to-r from-teal-50/90 to-blue-50/90 dark:from-teal-900/20 dark:to-blue-900/20 backdrop-blur-sm space-y-3 sticky bottom-0 shadow-lg">
                        {/* Primary CTA */}
                        <button
                          onClick={() => {
                            setIsMobileDestinationSearchOpen(true);
                            closeMobileMenu();
                          }}
                          className="block w-full bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white font-semibold py-3 px-6 rounded-2xl text-center text-sm shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
                        >
                          <Search className="h-4 w-4 flex-shrink-0" />
                          Search Destinations
                        </button>

                        {/* Auth Actions */}
                        {!isLoading && (
                          <>
                            {!isAuthenticated ? (
                              <>
                                <Link
                                  href="/login"
                                  onClick={closeMobileMenu}
                                  className="flex items-center justify-center gap-2 w-full border-2 border-teal-200 dark:border-teal-700 bg-white/90 dark:bg-gray-800 backdrop-blur-sm py-2.5 px-6 rounded-xl hover:bg-teal-50 dark:hover:bg-teal-900/30 hover:border-teal-300 hover:shadow-lg transition-all text-sm font-semibold text-teal-700 dark:text-teal-300 active:scale-[0.98]"
                                >
                                  <User className="h-4 w-4 flex-shrink-0" />
                                  Sign In
                                </Link>
                                <Link
                                  href="/register"
                                  onClick={closeMobileMenu}
                                  className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-2.5 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all text-sm active:scale-[0.98]"
                                >
                                  Get Started
                                </Link>
                              </>
                            ) : (
                              <button
                                onClick={() => {
                                  handleLogout();
                                  closeMobileMenu();
                                }}
                                className="w-full text-red-600 dark:text-red-400 border-2 border-red-200 dark:border-red-800 hover:bg-red-50 dark:hover:bg-red-900/20 py-2.5 px-6 rounded-xl hover:shadow-md transition-all text-sm font-semibold active:scale-[0.98]"
                              >
                                Sign Out
                              </button>
                            )}
                          </>
                        )}
                      </div>
                    </SheetContent>
                  </Sheet>
                </div>
              </div>
            </div>
          </div>
        </header>
      </div>

      {/* 🔥 MOBILE DESTINATION SEARCH - FULL SCREEN */}
      <MobileDestinationSearch
        isOpen={isMobileDestinationSearchOpen}
        onClose={() => setIsMobileDestinationSearchOpen(false)}
      />
    </>
  );
}

export default NavbarNew;
