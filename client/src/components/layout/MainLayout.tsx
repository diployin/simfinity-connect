import SiteHeader from './SiteHeader';
import SiteFooter from './SiteFooter';

export function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col w-full relative overflow-x-hidden selection:bg-primary/10">
      <SiteHeader />
      <main className="flex-1 w-full relative isolate">{children}</main>
      <SiteFooter />
    </div>
  );
}
