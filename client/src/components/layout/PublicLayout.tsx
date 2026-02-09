// src/components/layouts/PublicLayout.tsx
import { ReactNode } from 'react';
// import { Header } from './Header';
// import NewFooter from './NewFooter';
import SiteHeader from './SiteHeader';
import SiteFooter from './SiteFooter';
import FooterNew from './FooterNew';
// import { TopBanner } from './marketing';
import NavbarNew from './NavbarNew';
import { useLocation } from 'wouter';

interface PublicLayoutProps {
  readonly children: ReactNode;
}

const NO_PADDING_ROUTES = ['/', '/login', '/signup', '/security-features', '/esim-ultra-plan'];
 

export function PublicLayout({ children }: Readonly<PublicLayoutProps>) {
  const [location] = useLocation();

  // const shouldRemovePadding = NO_PADDING_ROUTES.includes(location);

  const shouldRemovePadding =
    NO_PADDING_ROUTES.includes(location) ||
    location.startsWith('/account');

  return (
    <div className="flex flex-col min-h-screen">
      <NavbarNew />

      <main
        className={`flex-1 ${shouldRemovePadding ? 'pt-8 mt-16 md:mt-0' : 'md:pt-40 lg:pt-48 xl:pt-[200px]'}`}
      >
        {children}
      </main>

      <FooterNew />
    </div>
  );
}

// src/components/layouts/EmptyLayout.tsx

interface EmptyLayoutProps {
  readonly children: ReactNode;
}

export function EmptyLayout({ children }: EmptyLayoutProps) {
  return <>{children}</>;
}
