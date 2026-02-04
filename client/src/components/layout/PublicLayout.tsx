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

export function PublicLayout({ children }: Readonly<PublicLayoutProps>) {
  const [location] = useLocation();

  // ✅ Only home page without padding
  const isHome = location === '/';
  return (
    <div className="flex flex-col min-h-screen">
      {/* <TopBanner
        message="Get your eSIM in just 2 minutes on your mobile"
        ctaText="Order Here"
        ctaLink="/destinations"
      /> */}
      <NavbarNew />
      <main className={`flex-1 ${isHome ? '' : 'pt-[200px]'}`}>{children}</main>
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
