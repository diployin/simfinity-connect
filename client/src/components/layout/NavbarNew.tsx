'use client';

import { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { cn } from '@/lib/utils';
import { Menu, Globe, User, ShoppingBag, ChevronDown, X, Search } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
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
import useStaticData from '@/data/useStaticData';
import MegaMenuDropdown from '../MegaMenuDropdown';
import TopPromoBar from './TopPromoBar';
import MegaMenuDropdownDestination from '../MegaMenuDropdownDestination';

export function NavbarNew() {
  const { isAuthenticated, isLoading, user, refetchUser } = useUser();
  const { toast } = useToast();
  const { languages, languageCode, setLanguage, t, language } = useTranslation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeMobileMenu, setActiveMobileMenu] = useState<string | null>(null);
  const [, setLocation] = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);

  const logo = useSettingByKey('logo');
  const staticData = useStaticData();

  const handleMegaMenuOpenChange = (isOpen: boolean) => {
    setIsMegaMenuOpen(isOpen);
  };

  // Mobile menu config
  const mobileMenuConfig = [
    {
      id: 'product',
      label: 'Product',
      items:
        staticData?.NavbarData?.productMegaMenuConfig?.columns?.flatMap((col: any) => col.items) ||
        [],
    },
    {
      id: 'resource',
      label: 'Resources',
      items:
        staticData?.NavbarData?.rouceMegaMenuConfig?.columns?.flatMap((col: any) => col.items) ||
        [],
    },
    {
      id: 'offers',
      label: 'Offers',
      items:
        staticData?.NavbarData?.offersMegaMenuConfig?.columns?.flatMap((col: any) => col.items) ||
        [],
    },
    {
      id: 'help',
      label: 'Help',
      items:
        staticData?.NavbarData?.helpMegaMenuConfig?.columns?.flatMap((col: any) => col.items) || [],
    },
  ];

  // Fetch pages/navlinks
  const { data: navlinks } = useQuery({
    queryKey: ['/api/pages'],
    queryFn: async () => {
      const res = await apiRequest('GET', '/api/pages');
      return res.json();
    },
  });

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

  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-50">
        <TopPromoBar />
        <header
          className={cn(
            'transition-all duration-300',
            isScrolled || isMegaMenuOpen
              ? 'dark:bg-background/95 bg-white backdrop-blur-sm shadow-sm border-b dark:border-border/50 border-border/50'
              : 'bg-transparent ',
          )}
        >
          {/* 🔥 TWO PART NAVBAR - LEFT: LOGO | RIGHT: EVERYTHING ELSE */}
          <div className="w-full">
            <div className="max-w-[1400px] mx-auto px-3 sm:px-4 lg:px-6">
              <div className="flex items-center justify-between h-14 sm:h-16 lg:h-[72px] gap-3 sm:gap-4">
                {/* 🔥 LEFT SIDE - LOGO ONLY */}
                <Link href="/" className="flex-shrink-0" data-testid="link-home">
                  {logo ? (
                    <img src={logo} alt="Logo" className="h-7 sm:h-10 lg:h-14 w-auto" />
                  ) : (
                    <div className="flex items-center gap-2 cursor-pointer group">
                      <div className="h-7 w-7 sm:h-8 sm:w-8 lg:h-9 lg:w-9 rounded-lg bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center transition-transform duration-200 group-hover:rotate-6">
                        <Globe className="h-3.5 w-3.5 sm:h-4 sm:w-4 lg:h-5 lg:w-5 text-white" />
                      </div>
                      <span className="font-bold text-base sm:text-lg lg:text-xl dark:text-white text-gray-900 whitespace-nowrap">
                        Simfinity
                      </span>
                    </div>
                  )}
                </Link>

                {/* 🔥 RIGHT SIDE - NAVIGATION + ALL BUTTONS */}
                <div className="flex items-center gap-1 sm:gap-2 lg:gap-3 flex-1 justify-end">
                  {/* 🔥 NAVIGATION LINKS - Desktop Only, Compact */}
                  <nav className="hidden xl:flex items-center gap-0.5">
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

                  {/* 🔥 DIVIDER - Between nav and buttons (Desktop) */}
                  <div className="hidden xl:block w-px h-6 bg-gray-300 dark:bg-gray-700 mx-2" />

                  {/* 🔥 ACTION BUTTONS - Progressive Responsive */}

                  {/* Search/Destinations Button */}
                  {/* <Link href="/destinations" className="hidden sm:flex">
                    <button className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 lg:px-4 py-1.5 sm:py-2 rounded-full border border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600 transition-all">
                      <Search className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-gray-600 dark:text-gray-400" />
                      <span className="hidden md:inline text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">
                        Destinations
                      </span>
                    </button>
                  </Link> */}
                  <MegaMenuDropdownDestination
                    label="Destinations"
                    onOpenChange={handleMegaMenuOpenChange}
                  />

                  {/* Language Selector - Desktop */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="hidden lg:flex items-center gap-1.5 px-2.5 lg:px-3 py-1.5 lg:py-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-all">
                        <Globe className="h-3.5 w-3.5 lg:h-4 lg:w-4 text-gray-600 dark:text-gray-400" />
                        <span className="text-xs lg:text-sm font-medium text-gray-700 dark:text-gray-300">
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

                  {/* Currency & Theme - Tablet+ */}
                  <div className="hidden md:flex items-center gap-1">
                    <CurrencySelector />
                    <ThemeToggle />
                  </div>

                  {/* 🔥 AUTH SECTION - Conditional */}
                  {!isLoading && (
                    <>
                      {!isAuthenticated ? (
                        <Link href="/login" className="hidden lg:flex">
                          <button className="flex items-center gap-1.5 px-3 lg:px-4 py-1.5 lg:py-2 rounded-full border border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600 transition-all">
                            <User className="h-3.5 w-3.5 lg:h-4 lg:w-4" />
                            <span className="text-xs lg:text-sm font-medium">
                              {t('website.nav.signIn', 'Sign In')}
                            </span>
                          </button>
                        </Link>
                      ) : (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button className="hidden lg:flex items-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 p-1.5 transition-all">
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
                              <Link
                                href="/account/profile"
                                className="flex items-center gap-2 cursor-pointer"
                              >
                                <User className="h-4 w-4" />
                                Profile
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link
                                href="/account/orders"
                                className="flex items-center gap-2 cursor-pointer"
                              >
                                <ShoppingBag className="h-4 w-4" />
                                My Orders
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={handleLogout}
                              className="text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 cursor-pointer"
                            >
                              Sign Out
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </>
                  )}

                  {/* 🔥 MOBILE HAMBURGER - Small Screens */}
                  <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                    <SheetTrigger asChild>
                      <button className="xl:hidden p-1.5 sm:p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all">
                        <Menu className="h-5 w-5 sm:h-6 sm:w-6" />
                      </button>
                    </SheetTrigger>
                    <SheetContent
                      side="right"
                      className="w-[85vw] xs:w-[80vw] sm:w-80 p-0 dark:bg-background bg-white"
                    >
                      <SheetHeader className="border-b p-4 sm:p-6">
                        <div className="flex items-center justify-between w-full">
                          <SheetTitle className="text-base sm:text-lg font-semibold">
                            Menu
                          </SheetTitle>
                          <button
                            onClick={closeMobileMenu}
                            className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all"
                            aria-label="Close menu"
                          >
                            <X className="h-5 w-5 sm:h-6 sm:w-6" />
                          </button>
                        </div>
                      </SheetHeader>

                      <div className="flex flex-col h-[calc(100vh-80px)] overflow-y-auto">
                        <div className="p-4 sm:p-6 space-y-4 flex-1">
                          {/* 🔥 User Profile - Mobile (Authenticated) */}
                          {!isLoading && isAuthenticated && (
                            <div className="mb-4 pb-4 border-b">
                              <div className="flex items-center gap-3 mb-3">
                                <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center flex-shrink-0">
                                  <User className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
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
                                  className="flex items-center justify-center gap-1.5 p-2.5 sm:p-3 rounded-lg border hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
                                >
                                  <User className="h-4 w-4 flex-shrink-0" />
                                  <span className="text-xs font-medium">Profile</span>
                                </Link>
                                <Link
                                  href="/account/orders"
                                  onClick={closeMobileMenu}
                                  className="flex items-center justify-center gap-1.5 p-2.5 sm:p-3 rounded-lg border hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
                                >
                                  <ShoppingBag className="h-4 w-4 flex-shrink-0" />
                                  <span className="text-xs font-medium">Orders</span>
                                </Link>
                              </div>
                            </div>
                          )}

                          {/* 🔥 Mobile Menu Sections - Collapsible */}
                          <div className="space-y-2">
                            {mobileMenuConfig.map((menu) => (
                              <div key={menu.id}>
                                <button
                                  type="button"
                                  onClick={() => toggleMobileMenu(menu.id)}
                                  onKeyDown={(e) =>
                                    handleKeyDown(e, () => toggleMobileMenu(menu.id))
                                  }
                                  className="flex w-full items-center justify-between rounded-lg px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
                                  aria-expanded={activeMobileMenu === menu.id}
                                >
                                  {menu.label}
                                  <ChevronDown
                                    className={cn(
                                      'h-4 w-4 sm:h-5 sm:w-5 transition-transform duration-200',
                                      activeMobileMenu === menu.id && 'rotate-180',
                                    )}
                                  />
                                </button>
                                {activeMobileMenu === menu.id && (
                                  <div className="mt-2 pl-4 sm:pl-6 space-y-1 border-l-2 border-teal-500/30">
                                    {menu.items.map((item, idx) => (
                                      <Link
                                        key={idx}
                                        href={item.href}
                                        onClick={closeMobileMenu}
                                        className="flex items-start gap-2 sm:gap-3 rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
                                      >
                                        <span className="text-teal-500 mt-0.5 flex-shrink-0">
                                          {item.icon}
                                        </span>
                                        <div className="flex-1 min-w-0">
                                          <div className="font-medium line-clamp-1">
                                            {item.label}
                                          </div>
                                          {item.description && (
                                            <div className="text-[10px] sm:text-xs text-muted-foreground mt-0.5 line-clamp-2">
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
                        </div>

                        {/* 🔥 Bottom Fixed - CTA & Auth Buttons */}
                        <div className="p-4 sm:p-6 border-t space-y-2.5 sm:space-y-3 bg-gray-50/50 dark:bg-gray-900/50">
                          {/* CTA Button */}
                          <Link
                            href="/destinations"
                            onClick={closeMobileMenu}
                            className="block w-full bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white font-semibold py-3 sm:py-4 rounded-xl text-center transition-all text-xs sm:text-sm"
                          >
                            {t('website.nav.seePacks', 'See packs')}
                          </Link>

                          {/* Auth Buttons - Conditional */}
                          {!isLoading && (
                            <>
                              {!isAuthenticated ? (
                                <Link
                                  href="/login"
                                  onClick={closeMobileMenu}
                                  className="flex items-center justify-center gap-2 w-full border py-3 sm:py-3.5 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-all text-xs sm:text-sm font-medium"
                                >
                                  <User className="h-4 w-4 sm:h-5 sm:w-5" />
                                  {t('website.nav.signIn', 'Sign In')}
                                </Link>
                              ) : (
                                <button
                                  onClick={() => {
                                    handleLogout();
                                    closeMobileMenu();
                                  }}
                                  className="w-full text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800 hover:bg-red-50 dark:hover:bg-red-900/20 py-3 sm:py-3.5 rounded-xl transition-all text-xs sm:text-sm font-medium"
                                >
                                  Sign Out
                                </button>
                              )}
                            </>
                          )}
                        </div>
                      </div>
                    </SheetContent>
                  </Sheet>
                </div>
              </div>
            </div>
          </div>
        </header>
      </div>
    </>
  );
}

export default NavbarNew;
