'use client';

import { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { cn } from '@/lib/utils';
import { Menu, Globe, User, ShoppingBag, ChevronDown, ChevronRight, X } from 'lucide-react';
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
// import MegaMenuDropdown from '../MegaMenuDropdown';
import useStaticData from '@/data/useStaticData';
import MegaMenuDropdown from '../MegaMenuDropdown';
import TopPromoBar from './TopPromoBar';

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

  // Mobile menu config using mega menu data
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
      label: 'Resource',
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

  // Fetch pages/navlinks from API
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
      <div className="fixed top- left-0 right-0 z-50">
        <TopPromoBar />
        <header
          className={cn(
            ' transition-all duration-300 ',
            isScrolled || isMegaMenuOpen
              ? 'dark:bg-background/95 bg-white backdrop-blur-sm shadow-sm border-b dark:border-border/50 border-border/50'
              : 'bg-transparent ',
          )}
        >
          <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8">
            <div className="flex h-14 sm:h-16 lg:h-18 items-center justify-between gap-2 sm:gap-3 lg:gap-4">
              {/* Logo - RESPONSIVE */}
              <Link href="/" className="flex-shrink-0 min-w-0" data-testid="link-home">
                {logo ? (
                  <img src={logo} alt="Logo" className="h-6 sm:h-7 lg:h-8 w-auto" />
                ) : (
                  <div className="flex items-center gap-1.5 sm:gap-2 cursor-pointer transition-all duration-200 hover:scale-105 group">
                    <div className="h-6 w-6 sm:h-7 sm:w-7 lg:h-8 lg:w-8 rounded-lg bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center transition-transform duration-200 hover:rotate-12">
                      <Globe className="h-3 w-3 sm:h-3.5 sm:w-3.5 lg:h-4 lg:w-4 text-white" />
                    </div>
                    <span className="hidden xs:inline-block font-bold text-sm sm:text-base lg:text-lg dark:text-white text-foreground group-hover:text-teal-500 transition-colors duration-200 whitespace-nowrap">
                      eSIM<span className="text-teal-500">Connect</span>
                    </span>
                  </div>
                )}
              </Link>

              {/* Desktop Navigation - CENTERED */}
              <nav
                className="hidden xl:flex items-center gap-1 lg:gap-2 mx-auto flex-1 max-w-3xl 2xl:max-w-4xl justify-center"
                data-testid="nav-main"
              >
                <MegaMenuDropdown
                  onOpenChange={handleMegaMenuOpenChange}
                  label={'Resource'}
                  badge={'New'}
                  config={staticData?.NavbarData?.rouceMegaMenuConfig}
                />
                <MegaMenuDropdown
                  onOpenChange={handleMegaMenuOpenChange}
                  label={'Product'}
                  badge={'New'}
                  config={staticData?.NavbarData?.productMegaMenuConfig}
                />
                <MegaMenuDropdown
                  onOpenChange={handleMegaMenuOpenChange}
                  label={'Offers'}
                  badge={'New'}
                  config={staticData?.NavbarData?.offersMegaMenuConfig}
                />
                <MegaMenuDropdown
                  onOpenChange={handleMegaMenuOpenChange}
                  label={'Help'}
                  badge={'New'}
                  config={staticData?.NavbarData?.helpMegaMenuConfig}
                />
              </nav>

              {/* Right side controls - FULLY RESPONSIVE */}
              <div className="flex items-center gap-1 sm:gap-1.5 lg:gap-2 flex-shrink-0">
                {/* Language Selector - Desktop Only */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <span className="hidden lg:flex items-center gap-1.5 lg:gap-2 rounded-full px-2 lg:px-2.5 xl:px-3 py-1.5 lg:py-2 border dark:border-white/20 border-border/30 hover:dark:border-white/40 hover:border-foreground/30 hover:dark:bg-white/10 hover:bg-black/5 backdrop-blur-sm transition-all duration-200 cursor-pointer">
                      <ReactCountryFlag
                        countryCode={language?.flagCode || 'US'}
                        svg
                        style={{ width: '14px', height: '10px' }}
                        className="lg:w-4 lg:h-3"
                      />
                      <span className="text-xs lg:text-sm font-medium dark:text-white/90 text-foreground/90">
                        {languageCode.toUpperCase()}
                      </span>
                      <ChevronDown className="h-3 w-3 dark:text-white/80" />
                    </span>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="w-56 bg-card/95 backdrop-blur-lg border border-border/50"
                  >
                    <div className="px-3 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      {t('common.button.selectLanguage', 'Select Language')}
                    </div>
                    {languages.map((lang) => {
                      const active = languageCode === lang.code;
                      return (
                        <DropdownMenuItem
                          key={lang.code}
                          onClick={() => setLanguage(lang.code)}
                          className={cn(
                            'flex items-center justify-between cursor-pointer hover:bg-accent',
                          )}
                        >
                          <div className="flex items-center gap-3">
                            <ReactCountryFlag
                              countryCode={lang.flagCode}
                              svg
                              style={{ width: '20px', height: '15px' }}
                            />
                            <div>
                              <div className="font-medium text-foreground">{lang.nativeName}</div>
                              <div className="text-xs text-muted-foreground">{lang.name}</div>
                            </div>
                          </div>
                          {active && <div className="h-2 w-2 rounded-full bg-primary" />}
                        </DropdownMenuItem>
                      );
                    })}
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Notification - Hide on extra small */}
                <div className="hidden sm:flex">
                  <NotificationBell />
                </div>

                {/* Currency & Theme - Progressive showing */}
                <div className="hidden md:flex gap-1">
                  <CurrencySelector />
                  <ThemeToggle />
                </div>

                {/* CTA Button - Desktop Only */}
                <Link href="/destinations" className="hidden lg:flex">
                  <span className="text-xs xl:text-sm font-semibold bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white rounded-full px-3 xl:px-4 2xl:px-5 py-1.5 xl:py-2 transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl whitespace-nowrap">
                    {t('website.nav.seePacks', 'See packs')}
                  </span>
                </Link>

                {/* 🔥 AUTH SECTION - CONDITIONAL RENDERING */}
                {!isLoading && (
                  <>
                    {/* NOT AUTHENTICATED - Show Sign In */}
                    {!isAuthenticated && (
                      <Link href="/login" className="hidden lg:flex">
                        <span className="flex items-center gap-1.5 xl:gap-2 text-xs xl:text-sm font-medium dark:text-white/90 text-foreground/90 rounded-full px-2.5 xl:px-4 py-1.5 xl:py-2 border dark:border-white/20 border-border/30 hover:dark:border-white/40 hover:border-foreground/30 hover:dark:bg-white/10 hover:bg-black/5 backdrop-blur-sm transition-all duration-200 whitespace-nowrap">
                          <User className="h-3.5 w-3.5 xl:h-4 xl:w-4" />
                          <span className="hidden xl:inline">
                            {t('website.nav.signIn', 'Sign In')}
                          </span>
                        </span>
                      </Link>
                    )}

                    {/* AUTHENTICATED - Show User Dropdown */}
                    {isAuthenticated && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button className="hidden lg:flex items-center gap-2 rounded-full p-1 hover:dark:bg-white/10 hover:bg-black/5 backdrop-blur-sm transition-all duration-200">
                            <div className="h-7 w-7 xl:h-8 xl:w-8 rounded-full dark:bg-white/20 bg-black/10 backdrop-blur-sm flex items-center justify-center hover:dark:bg-white/30 hover:bg-black/20 transition-all duration-200">
                              <User className="h-4 w-4 xl:h-5 xl:w-5 dark:text-white text-foreground" />
                            </div>
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="end"
                          className="w-56 bg-white dark:bg-gray-900 backdrop-blur-lg border border-gray-200 dark:border-gray-800"
                        >
                          <div className="px-3 py-2 border-b border-gray-200 dark:border-gray-800">
                            <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                              {user?.name || 'User'}
                            </p>
                            <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
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

                {/* 🔥 MOBILE HAMBURGER - ALWAYS VISIBLE ON SMALL SCREENS */}
                <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                  <SheetTrigger asChild>
                    <button className="lg:hidden p-1.5 sm:p-2 hover:dark:bg-white/10 hover:bg-black/5 rounded-md transition-all duration-200">
                      <Menu className="h-5 w-5 sm:h-6 sm:w-6 dark:text-white text-foreground" />
                    </button>
                  </SheetTrigger>
                  <SheetContent
                    side="right"
                    className="w-[85vw] xs:w-[80vw] sm:w-80 p-0 dark:bg-background/95 bg-white/95 backdrop-blur-lg"
                  >
                    <SheetHeader className="border-b border-gray-200 dark:border-gray-700 p-4 sm:p-6">
                      <div className="flex items-center justify-between w-full">
                        <SheetTitle className="dark:text-foreground text-foreground text-base sm:text-lg font-semibold">
                          Menu
                        </SheetTitle>
                        <button
                          onClick={closeMobileMenu}
                          className="p-1.5 hover:dark:bg-white/10 hover:bg-black/5 rounded-md transition-all"
                          aria-label="Close menu"
                        >
                          <X className="h-5 w-5 sm:h-6 sm:w-6 dark:text-white text-foreground" />
                        </button>
                      </div>
                    </SheetHeader>

                    {/* 🔥 MOBILE MENU CONTENT - SCROLLABLE */}
                    <div className="flex flex-col h-[calc(100vh-80px)] overflow-y-auto">
                      <div className="p-4 sm:p-6 space-y-4 flex-1">
                        {/* 🔥 CONDITIONAL AUTH SECTION */}
                        {!isLoading && (
                          <>
                            {/* AUTHENTICATED USER PROFILE */}
                            {isAuthenticated && (
                              <div className="mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
                                <div className="flex items-center gap-3 mb-3">
                                  <div className="h-12 w-12 rounded-full dark:bg-white/20 bg-black/10 flex items-center justify-center flex-shrink-0">
                                    <User className="h-6 w-6 dark:text-white text-foreground" />
                                  </div>
                                  <div className="min-w-0 flex-1">
                                    <p className="text-sm font-semibold dark:text-white text-foreground truncate">
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
                                    className="flex items-center justify-center gap-2 p-3 rounded-lg hover:dark:bg-white/10 hover:bg-black/5 transition-all border border-gray-200 dark:border-gray-700"
                                  >
                                    <User className="h-4 w-4 flex-shrink-0" />
                                    <span className="text-xs font-medium">Profile</span>
                                  </Link>
                                  <Link
                                    href="/account/orders"
                                    onClick={closeMobileMenu}
                                    className="flex items-center justify-center gap-2 p-3 rounded-lg hover:dark:bg-white/10 hover:bg-black/5 transition-all border border-gray-200 dark:border-gray-700"
                                  >
                                    <ShoppingBag className="h-4 w-4 flex-shrink-0" />
                                    <span className="text-xs font-medium">Orders</span>
                                  </Link>
                                </div>
                              </div>
                            )}
                          </>
                        )}

                        {/* 🔥 MEGA MENU SECTIONS - COLLAPSIBLE */}
                        <div className="space-y-2">
                          {mobileMenuConfig.map((menu) => (
                            <div key={menu.id} className="w-full">
                              <button
                                type="button"
                                onClick={() => toggleMobileMenu(menu.id)}
                                onKeyDown={(e) => handleKeyDown(e, () => toggleMobileMenu(menu.id))}
                                className="flex w-full items-center justify-between rounded-lg px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm font-semibold text-foreground transition-all hover:dark:bg-white/10 hover:bg-black/5"
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
                                  {menu.items.map((item, index) => (
                                    <Link
                                      key={index}
                                      href={item.href}
                                      className="flex items-start gap-2 sm:gap-3 rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm transition-all hover:dark:bg-white/10 hover:bg-black/5"
                                      onClick={closeMobileMenu}
                                    >
                                      <span className="mt-0.5 flex-shrink-0 text-teal-500">
                                        {item.icon}
                                      </span>
                                      <div className="min-w-0 flex-1">
                                        <div className="font-medium text-foreground line-clamp-1">
                                          {item.label}
                                        </div>
                                        {item.description && (
                                          <div className="mt-0.5 text-[10px] sm:text-xs text-muted-foreground line-clamp-2">
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

                      {/* 🔥 BOTTOM FIXED SECTION - CTA & AUTH */}
                      <div className="p-4 sm:p-6 border-t border-gray-200 dark:border-gray-700 space-y-3 bg-white/50 dark:bg-background/50 backdrop-blur-sm">
                        {/* CTA Button */}
                        <Link
                          href="/destinations"
                          onClick={closeMobileMenu}
                          className="block w-full bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white font-semibold py-3 sm:py-4 px-4 sm:px-6 rounded-xl shadow-lg hover:shadow-xl text-center transition-all text-xs sm:text-sm"
                        >
                          {t('website.nav.seePacks', 'See packs')}
                        </Link>

                        {/* 🔥 AUTH BUTTONS - CONDITIONAL */}
                        {!isLoading && (
                          <>
                            {!isAuthenticated ? (
                              <Link
                                href="/login"
                                onClick={closeMobileMenu}
                                className="flex items-center justify-center gap-2 w-full border dark:border-white/20 border-border/30 text-xs sm:text-sm font-medium dark:text-white/90 text-foreground/90 py-3 sm:py-3.5 px-4 sm:px-6 rounded-xl hover:dark:bg-white/10 hover:bg-black/5 transition-all"
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
                                className="w-full text-destructive hover:bg-destructive/10 text-xs sm:text-sm font-medium py-3 sm:py-3.5 px-4 sm:px-6 rounded-xl transition-all border border-destructive/20 hover:border-destructive/40"
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
        </header>
      </div>
    </>
  );
}

export default NavbarNew;
