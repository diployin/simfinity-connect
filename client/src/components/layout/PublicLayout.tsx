// src/components/layouts/PublicLayout.tsx
import { ReactNode } from 'react';
// import { Header } from './Header';
// import NewFooter from './NewFooter';
import SiteHeader from './SiteHeader';
import SiteFooter from './SiteFooter';
// import { TopBanner } from './marketing';

interface PublicLayoutProps {
  readonly children: ReactNode;
}

export function PublicLayout({ children }: Readonly<PublicLayoutProps>) {
  return (
    <div className="flex flex-col min-h-screen w-full relative overflow-x-hidden selection:bg-primary/10">
      <SiteHeader />
      <main id="main-content" className="flex-1 w-full relative isolate">
        {children}
      </main>
      <SiteFooter />
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
