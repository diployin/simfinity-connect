import { Link, useLocation } from 'wouter';
import {
  User,
  Smartphone,
  Package,
  Shield,
  Headphones,
  ChevronRight,
  Settings,
  ArrowLeft,
  Home,
  BadgeCheck,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/contexts/TranslationContext';

interface AccountLayoutProps {
  children: React.ReactNode;
}

interface NavItem {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  description: string;
  href: string;
}

const accountNavItems: NavItem[] = [
  {
    icon: User,
    label: 'Account Information',
    description: 'Manage your personal details',
    href: '/account/profile',
  },
  {
    icon: Smartphone,
    label: 'My E-Sim Details',
    description: 'Manage your eSIM profiles',
    href: '/account/esims',
  },
  {
    icon: Package,
    label: 'Order History',
    description: 'View your purchase history',
    href: '/account/orders',
  },
  {
    icon: BadgeCheck,
    label: 'KYC Verification',
    description: 'Verify your identity',
    href: '/account/kyc',
  },
  {
    icon: Shield,
    label: 'Referrals',
    description: 'Get referrals',
    href: '/account/referrals',
  },
  {
    icon: Headphones,
    label: 'Customer Support',
    description: 'Get help and support',
    href: '/account/support',
  }
];

export function AccountLayout({ children }: AccountLayoutProps) {
  const [location] = useLocation();
  const { t } = useTranslation();

  const isActive = (href: string) => {
    if (href === '/account') return location === '/account';
    if (href.startsWith('/account/')) return location.startsWith(href);
    return location === href;
  };

  const getCurrentPageName = () => {
    const currentItem = accountNavItems.find((item) => isActive(item.href));
    return currentItem?.label || 'Account';
  };

  const isSubPage = location !== '/account' && location.startsWith('/account/');

  return (
    <>
      <main className="flex-1 pt-20 bg-background dark:bg-gray-950 transition-colors duration-300">
        <div className="container mx-auto px-4 py-8">
          {/* Mobile Navigation (Horizontal Scrollable) */}
          <div className="lg:hidden w-full overflow-x-auto pb-4 mb-2 scrollbar-none">
            <div className="flex gap-2 min-w-max">
              {accountNavItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);

                return (
                  <Link key={item.href} href={item.href}>
                    <div
                      className={cn(
                        'flex items-center gap-2 px-4 py-2 rounded-full cursor-pointer transition-all border text-sm font-medium whitespace-nowrap',
                        active
                          ? 'bg-primary text-white border-primary shadow-sm'
                          : 'bg-card dark:bg-gray-900 text-muted-foreground dark:text-gray-400 border-border dark:border-gray-800 hover:bg-muted dark:hover:bg-gray-800',
                      )}
                    >
                      <Icon className="h-4 w-4" />
                      <span>{item.label}</span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar */}
            <aside className="hidden lg:block lg:w-80 flex-shrink-0">
              <div className="bg-card dark:bg-gray-900 rounded-lg border border-border dark:border-gray-800 p-4 lg:sticky lg:top-24">
                <div className="flex items-center gap-2 mb-6">
                  <Settings className="h-5 w-5 text-foreground dark:text-white" />
                  <h2 className="font-semibold text-lg text-foreground dark:text-white">{t('website.account.sidebar.accountSettings', 'Account Settings')}</h2>
                </div>

                <nav className="space-y-1">
                  {accountNavItems.map((item) => {
                    const Icon = item.icon;
                    const active = isActive(item.href);

                    return (
                      <Link key={item.href} href={item.href}>
                        <div
                          className={cn(
                            'flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors',
                            active 
                              ? 'bg-primary/10 dark:bg-primary/20 border border-primary/20 dark:border-primary/30' 
                              : 'hover:bg-muted dark:hover:bg-gray-800',
                          )}
                        >
                          <div
                            className={cn(
                              'w-10 h-10 rounded-lg flex items-center justify-center',
                              active ? 'bg-primary/20 dark:bg-primary/30' : 'bg-muted dark:bg-gray-800',
                            )}
                          >
                            <Icon
                              className={cn(
                                'h-5 w-5',
                                active ? 'text-primary dark:text-primary-light' : 'text-muted-foreground dark:text-gray-400',
                              )}
                            />
                          </div>

                          <div className="flex-1 min-w-0">
                            <div
                              className={cn(
                                'font-medium text-sm',
                                active ? 'text-primary dark:text-primary-light' : 'text-foreground dark:text-gray-200',
                              )}
                            >
                              {item.label}
                            </div>
                            <div className="text-xs text-muted-foreground dark:text-gray-500 truncate">
                              {item.description}
                            </div>
                          </div>

                          <ChevronRight className={cn("h-4 w-4", active ? "text-primary dark:text-primary-light" : "text-muted-foreground")} />
                        </div>
                      </Link>
                    );
                  })}
                </nav>
              </div>
            </aside>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-6 text-sm">
                <Link href="/">
                  <Button variant="ghost" size="sm" className="gap-1 text-muted-foreground dark:text-gray-400 dark:hover:text-white">
                    <Home className="h-4 w-4" />{t('website.account.sidebar.home', 'Home')}</Button>
                </Link>

                <ChevronRight className="h-4 w-4 text-muted-foreground dark:text-gray-600" />

                {isSubPage ? (
                  <>
                    <Link href="/account/profile">
                      <Button variant="ghost" size="sm" className="gap-1 text-muted-foreground dark:text-gray-400 dark:hover:text-white">
                        Profile
                      </Button>
                    </Link>
                    <ChevronRight className="h-4 w-4 text-muted-foreground dark:text-gray-600" />
                    <span className="font-medium text-foreground dark:text-gray-300">{getCurrentPageName()}</span>
                  </>
                ) : (
                  <span className="font-medium text-foreground dark:text-gray-300">{t('website.account.sidebar.account', 'Account')}</span>
                )}
              </div>

              {children}
            </div>
          </div>
        </div>
      </main>
      {/* <SiteFooter /> */}
    </>
  );
}
