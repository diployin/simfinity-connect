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
  MapPin,
  Star,
  Map,
  BookOpen,
  Gift,
  HelpCircle,
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
  const whiteLogo = useSettingByKey('white_logo');
  const [location] = useLocation();
  const staticData = useStaticData();

  const isHomePage = location === '/';
  // Use white logo only on homepage and only when NOT scrolled AND NOT mega menu open
  const displayLogo = (isHomePage && !isScrolled && !isMegaMenuOpen) ? (whiteLogo || logo) : logo;
  const isDarkBackground = isHomePage && !isScrolled && !isMegaMenuOpen;

  const handleMegaMenuOpenChange = (isOpen: boolean) => {
    setIsMegaMenuOpen(isOpen);
  };

  const mobileMenuConfig = [
    // {
    //   id: 'destinations',
    //   label: 'Destinations',
    //   icon: <MapPin className="h-4 w-4" />,
    //   items: [
    //     {
    //       href: '/destinations',
    //       label: 'All Destinations',
    //       icon: <Globe className="h-4 w-4" />,
    //       description: 'Browse all countries & regions',
    //     },
    //     {
    //       href: '/destinations/popular',
    //       label: 'Popular',
    //       icon: <Star className="h-4 w-4" />,
    //       description: 'Top travel destinations',
    //     },
    //     {
    //       href: '/regions/europe',
    //       label: 'Europe',
    //       icon: <Map className="h-4 w-4" />,
    //       description: '40+ European countries',
    //     },
    //     { href: '/regions/asia', label: 'Asia', icon: <Map className="h-4 w-4" />, description: '25+ Asian destinations' },
    //     {
    //       href: '/regions/north-america',
    //       label: 'North America',
    //       icon: <Map className="h-4 w-4" />,
    //       description: 'USA, Canada & more',
    //     },
    //   ],
    // },
    {
      id: 'product',
      label: 'Product',
      icon: <Package className="h-4 w-4" />,
      items:
        staticData?.NavbarData?.productMegaMenuConfig?.columns?.flatMap((col: any) => col.items) ||
        [],
    },
    {
      id: 'resource',
      label: 'Resources',
      icon: <BookOpen className="h-4 w-4" />,
      items:
        staticData?.NavbarData?.rouceMegaMenuConfig?.columns?.flatMap((col: any) => col.items) ||
        [],
    },
    {
      id: 'offers',
      label: 'Offers',
      icon: <Gift className="h-4 w-4" />,
      items:
        staticData?.NavbarData?.offersMegaMenuConfig?.columns?.flatMap((col: any) => col.items) ||
        [],
    },
    {
      id: 'help',
      label: 'Help',
      icon: <HelpCircle className="h-4 w-4" />,
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
        {/* TopPromoBar*/}
        <div className={`w-full bg-black text-white relative ${isExpanded ? 'hidden' : 'block'}`}>
          <div className="max-w-[1500px] mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-2 flex items-center justify-between">
            {/* Promo Content (Left aligned) */}
            <div className="flex items-center gap-3 sm:gap-4 md:gap-6">
              {/* Message */}
              <p className="text-xs xs:text-sm sm:text-base md:text-sm font-medium">
                ❄️ Get <span className="font-bold whitespace-nowrap">25% off 5GB+ plans</span> with
                the code{' '}
                <span className="font-bold bg-white/10 px-1.5 py-0.5 rounded whitespace-nowrap">
                  SIMFINITY
                </span>
              </p>

              {/* Button */}
              <button className="px-2.5 sm:px-3 md:px-4 py-1 sm:py-1.5 md:py-2 text-xs sm:text-sm md:text-sm font-semibold border border-white rounded-full hover:bg-white hover:text-black transition whitespace-nowrap">
                <span className="hidden xs:inline">Get the Deal</span>
                <span className="xs:hidden">Get Deal</span>
              </button>
            </div>

            {/* Close Button (Right aligned) */}
            <button
              onClick={handleClose}
              className="p-1 hover:opacity-70 transition-opacity"
              aria-label="Close promotion"
            >
              <X size={16} className="sm:w-[18px] sm:h-[18px]" />
            </button>
          </div>
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
                  {displayLogo ? (
                    <img
                      src={displayLogo}
                      alt="Logo"
                      className="h-12 sm:h-14 md:h-16 lg:h-20 xl:h-18 w-auto py-2"
                    />
                  ) : (
                    <div className="flex items-center gap-2 cursor-pointer group">
                      <div className="h-8 w-8 sm:h-9 sm:w-9 md:h-10 md:w-10 lg:h-11 lg:w-11 xl:h-10 xl:w-10 rounded-lg bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center transition-transform duration-200 group-hover:rotate-6">
                        <Globe className="h-4 w-4 sm:h-4.5 sm:w-4.5 md:h-5 md:w-5 lg:h-5.5 lg:w-5.5 text-white" />
                      </div>
                      <span className="font-bold text-base sm:text-lg md:text-xl lg:text-xl xl:text-2xl dark:text-white text-gray-900 whitespace-nowrap">
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
                      isDarkBackground={isDarkBackground}
                    />
                    <MegaMenuDropdown
                      onOpenChange={handleMegaMenuOpenChange}
                      label={'Resources'}
                      config={staticData?.NavbarData?.rouceMegaMenuConfig}
                      isDarkBackground={isDarkBackground}
                    />
                    <MegaMenuDropdown
                      onOpenChange={handleMegaMenuOpenChange}
                      label={'Offers'}
                      config={staticData?.NavbarData?.offersMegaMenuConfig}
                      isDarkBackground={isDarkBackground}
                    />
                    <MegaMenuDropdown
                      onOpenChange={handleMegaMenuOpenChange}
                      label={'Help'}
                      config={staticData?.NavbarData?.helpMegaMenuConfig}
                      isDarkBackground={isDarkBackground}
                    />
                  </nav>

                  {/* 🔥 DESKTOP DIVIDER */}

                  {/* 🔥 1. NOTIFICATION BELL - ALL DEVICES (BAHAR) */}

                  {/* 🔥 2. DESTINATIONS - LG+ DESKTOP ONLY */}
                  <MegaMenuDropdownDestination
                    label="Destinations"
                    onOpenChange={handleMegaMenuOpenChange}
                    className="hidden lg:inline-flex ml-1 md:ml-2"
                    isDarkBackground={isDarkBackground}
                  />
                  <div className="hidden lg:flex">
                    <NotificationBell className={isDarkBackground ? 'text-white' : 'text-foreground'} />
                  </div>

                  {/* 🔥 3. LANGUAGE SELECTOR - MD+ */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className={cn(
                        "hidden md:flex items-center gap-1 px-2 py-1.5 sm:px-2.5 sm:py-2 md:px-3 md:py-2 rounded-full transition-all",
                        isDarkBackground ? "hover:bg-white/10" : "hover:bg-gray-100 dark:hover:bg-gray-800"
                      )}>
                        <Globe className={cn("h-3.5 w-3.5 md:h-4 md:w-4 transition-colors", isDarkBackground ? "text-white" : "text-black dark:text-gray-400")} />
                        <span className={cn("text-xs sm:text-sm md:text-sm font-medium hidden sm:inline transition-colors", isDarkBackground ? "text-white" : "text-black dark:text-gray-300")}>
                          {languageCode.toUpperCase()}
                        </span>
                        <ChevronDown className={cn("h-3 w-3 transition-colors", isDarkBackground ? "text-white/70" : "text-gray-500")} />
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
                    <CurrencySelector isDarkBackground={isDarkBackground} />
                    {/* <ThemeToggle /> */}
                  </div>

                  {/* 🔥 5. AUTH SECTION - LG+ */}
                  {!isLoading && (
                    <>
                      {!isAuthenticated ? (
                        <Link href="/login" className="hidden lg:flex">
                          <button className={cn(
                            "flex items-center gap-1.5 px-3 py-1.5 lg:px-4 lg:py-2 rounded-full border transition-all text-sm font-medium",
                            isDarkBackground
                              ? "text-white border-white/30 hover:bg-white/10"
                              : "border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600"
                          )}>
                            <User className={cn("h-3.5 w-3.5 lg:h-4 lg:w-4 transition-colors", isDarkBackground ? "text-white" : "text-black")} />
                            <span>{t('website.nav.signIn', 'Sign In')}</span>
                          </button>
                        </Link>
                      ) : (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button className="hidden lg:flex items-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 p-1.5 lg:p-2 transition-all">
                              <div className="h-7 w-7 lg:h-8 lg:w-8 rounded-full bg-gray-500 flex items-center justify-center">
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
                            <DropdownMenuItem asChild className="focus:text-primary focus:bg-primary/10 cursor-pointer">
                              <Link href="/account/profile" className="flex items-center gap-2">
                                <User className="h-4 w-4" />
                                Profile
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild className="focus:text-primary focus:bg-primary/10 cursor-pointer">
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
                    className={cn(
                      "lg:hidden p-1.5 sm:p-2 md:p-2.5 rounded-lg transition-all",
                      isDarkBackground ? "hover:bg-white/10" : "hover:bg-gray-100 dark:hover:bg-gray-800"
                    )}
                    aria-label="Search destinations"
                  >
                    <Search className={cn("h-6 w-6 sm:h-6.5 sm:w-6.5 transition-colors", isDarkBackground ? "text-white" : "text-black")} />
                  </button>

                  {/* 🔥 MOBILE HAMBURGER - XL & BELOW */}
                  <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                    <SheetTrigger asChild>
                      <button
                        className={cn(
                          "xl:hidden p-1.5 sm:p-2 md:p-2.5 rounded-lg transition-all ml-1 sm:ml-2",
                          isDarkBackground ? "hover:bg-white/10" : "hover:bg-gray-100 dark:hover:bg-gray-800"
                        )}
                        aria-label="Open menu"
                      >
                        <Menu className={cn("h-7 w-7 sm:h-8 sm:w-8 transition-colors", isDarkBackground ? "text-white" : "text-black")} />
                      </button>
                    </SheetTrigger>
                    <SheetContent
                      side="right"
                      className="w-full p-0 pt-0 bg-white flex flex-col"
                    >
                      {/* 🔥 MOBILE HEADER WITH LOGO & CLOSE */}
                      <SheetHeader className="p-4 px-6 bg-white z-20 flex-shrink-0">
                        <div className="flex items-center justify-between w-full">
                          <Link href="/" onClick={closeMobileMenu}>
                            {logo ? (
                              <img src={logo} alt="Logo" className="h-8 w-auto" />
                            ) : (
                              <span className="font-bold text-2xl text-teal-600">Simfinity</span>
                            )}
                          </Link>
                          <div className="flex items-center gap-3">
                            {isAuthenticated && user ? (
                              <Link
                                href="/account/profile"
                                onClick={closeMobileMenu}
                                className="flex items-center justify-center"
                              >
                                <div className="h-8 w-8 rounded-full bg-gray-500 flex items-center justify-center shadow-sm">
                                  <User className="h-4 w-4 text-white" />
                                </div>
                              </Link>
                            ) : (
                              <Link href="/login" onClick={closeMobileMenu}>
                                <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-gray-300 text-sm font-medium text-gray-900 hover:bg-gray-50 transition-all">
                                  <User className="h-3.5 w-3.5" />
                                  <span>Sign In</span>
                                </button>
                              </Link>
                            )}
                            <button
                              onClick={() => closeMobileMenu()}
                              className="p-1 hover:bg-gray-100 rounded-full transition-all"
                            >
                              <X className="h-6 w-6 text-gray-900" />
                            </button>
                          </div>
                        </div>
                      </SheetHeader>

                      {/* 🔥 1. SEARCH BAR (New) */}
                      <div className="px-5 pb-2">
                        <button
                          onClick={() => {
                            setIsMobileDestinationSearchOpen(true);
                            closeMobileMenu();
                          }}
                          className="w-full flex items-center justify-between bg-gray-100 rounded-full pl-5 pr-2 py-2 text-gray-500 hover:bg-gray-200 transition-colors"
                        >
                          <span className="text-base text-gray-500 font-normal">
                            Where are you travelling to?
                          </span>
                          <div className="bg-black rounded-full p-2.5 text-white">
                            <Search size={18} />
                          </div>
                        </button>
                      </div>

                      {/* 🔥 MOBILE CONTENT - SCROLLABLE */}
                      <div className="flex-1 overflow-y-auto px-5 py-2 space-y-1">
                        {/* 🔥 MENU ITEMS */}
                        {mobileMenuConfig.map((menu) => (
                          <div
                            key={menu.id}
                            className="overflow-hidden border-b border-gray-100 last:border-0"
                          >
                            <button
                              type="button"
                              onClick={() => toggleMobileMenu(menu.id)}
                              className="flex w-full items-center justify-between py-4 text-left text-base font-semibold text-gray-900"
                            >
                              <div className="flex items-center gap-2">
                                <span>{menu.label}</span>
                                {menu.id === 'product' && (
                                  <span className="px-2 py-0.5 rounded-full border border-gray-300 text-[10px] font-bold uppercase tracking-wide text-gray-600">
                                    New
                                  </span>
                                )}
                              </div>
                              <ChevronDown
                                className={cn(
                                  'h-5 w-5 transition-transform duration-300 text-gray-400',
                                  activeMobileMenu === menu.id && 'rotate-180',
                                )}
                              />
                            </button>

                            <div
                              className={cn(
                                'grid transition-all duration-300 ease-in-out',
                                activeMobileMenu === menu.id
                                  ? 'grid-rows-[1fr] opacity-100 mb-4'
                                  : 'grid-rows-[0fr] opacity-0',
                              )}
                            >
                              <div className="overflow-hidden">
                                <div className="bg-gray-50 rounded-2xl p-2 space-y-1">
                                  {menu.items.map((item, idx) => (
                                    <Link
                                      key={idx}
                                      href={item.href || '#'}
                                      onClick={closeMobileMenu}
                                      className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-200/50 transition-all group"
                                    >
                                      {item.icon ? (
                                        <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary text-white transition-transform group-hover:scale-110">
                                          {item.icon}
                                        </div>
                                      ) : (
                                        <div className="h-8 w-8 rounded-full bg-yellow-400" />
                                      )}
                                      <span className="text-sm font-medium text-gray-900">
                                        {item.label}
                                      </span>
                                    </Link>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}

                        {/* 🔥 LANGUAGE SELECTOR */}
                        <div className="border-t border-gray-100">
                          <button
                            onClick={() => toggleMobileMenu('language')}
                            className="flex w-full items-center justify-between py-4 text-left text-base font-semibold text-gray-900"
                          >
                            <span className="flex items-center gap-2">
                              <Globe className="h-5 w-5" />
                              {languageCode.toUpperCase()}
                            </span>
                            <ChevronDown
                              className={cn(
                                'h-5 w-5 transition-transform duration-300 text-gray-400',
                                activeMobileMenu === 'language' && 'rotate-180',
                              )}
                            />
                          </button>

                          <div
                            className={cn(
                              'grid transition-all duration-300 ease-in-out',
                              activeMobileMenu === 'language'
                                ? 'grid-rows-[1fr] opacity-100 mb-4'
                                : 'grid-rows-[0fr] opacity-0',
                            )}
                          >
                            <div className="overflow-hidden">
                              <div className="bg-gray-50 rounded-2xl p-2 space-y-1">
                                {languages.map((lang) => (
                                  <button
                                    key={lang.code}
                                    onClick={() => {
                                      setLanguage(lang.code);
                                      setActiveMobileMenu(null);
                                    }}
                                    className={cn(
                                      'flex items-center justify-between w-full p-3 rounded-xl transition-all hover:bg-gray-200/50',
                                      languageCode === lang.code && 'bg-white shadow-sm',
                                    )}
                                  >
                                    <div className="flex items-center gap-3">
                                      <ReactCountryFlag
                                        countryCode={lang.flagCode}
                                        svg
                                        style={{ width: '20px', height: '15px' }}
                                      />
                                      <span className="text-sm font-medium text-gray-900">
                                        {lang.nativeName}
                                      </span>
                                    </div>
                                    {languageCode === lang.code && (
                                      <div className="h-2 w-2 rounded-full bg-green-500" />
                                    )}
                                  </button>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* 🔥 BOTTOM ACTIONS */}
                      <div className="p-5 pb-8 space-y-3 bg-white border-t border-gray-100">
                        <button className="w-full bg-black text-white rounded-full py-3.5 text-base font-bold hover:opacity-90 transition-opacity">
                          Download App
                        </button>
                        <Link
                          href="/destinations"
                          onClick={closeMobileMenu}
                          className="flex items-center justify-center w-full bg-white border border-black text-black rounded-full py-3.5 text-base font-bold hover:bg-gray-50 transition-colors"
                        >
                          View All Destinations
                        </Link>
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
