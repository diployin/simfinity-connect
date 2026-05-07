import { Hammer, Mail, Phone, Globe, ShieldCheck } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';

export default function Maintenance() {
  const { data: settings, isLoading } = useQuery<Record<string, string>>({
    queryKey: ['/api/public/settings'],
  });

  const logoUrl = settings?.logo;
  const platformName = settings?.platform_name || 'Voltey Connect';
  const siteName = settings?.site_name || platformName;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-[100px]" />
      </div>

      {/* Logo Section */}
      <div className="mb-6 relative z-10">
        {logoUrl ? (
          <img
            src={logoUrl.startsWith('http') ? logoUrl : `${window.location.origin}${logoUrl}`}
            alt={siteName}
            className="h-12 w-auto object-contain"
          />
        ) : (
          <div className="flex items-center gap-2">
            <Globe className="h-6 w-6 text-primary" />
            <span className="text-lg font-bold text-white tracking-tight">{siteName}</span>
          </div>
        )}
      </div>

      <Card className="max-w-md w-full border-0 bg-white/5 backdrop-blur-xl shadow-2xl border border-white/10 relative z-10 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-primary" />

        <CardContent className="p-8 text-center space-y-6">
          <div className="flex justify-center">
            <div className="bg-primary/10 p-4 rounded-2xl">
              <Hammer className="h-8 w-8 text-primary" />
            </div>
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
              Web Under <span className="text-primary">Maintenance</span>
            </h1>
            <p className="text-slate-400 text-sm md:text-base leading-relaxed">
              We're currently performing scheduled updates. We'll be back online shortly.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex flex-col items-center gap-1">
              <ShieldCheck className="h-5 w-5 text-primary" />
              <span className="text-[10px] uppercase font-bold text-slate-500">Security</span>
            </div>
            <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex flex-col items-center gap-1">
              <Globe className="h-5 w-5 text-blue-400" />
              <span className="text-[10px] uppercase font-bold text-slate-500">Global</span>
            </div>
          </div>

          <div className="pt-6 border-t border-white/10 space-y-4">
            <div className="flex flex-col gap-2">
              {settings?.email && (
                <a href={`mailto:${settings.email}`} className="flex items-center justify-center gap-2 text-slate-300 hover:text-primary transition-colors text-sm">
                  <Mail className="h-4 w-4" />
                  <span>{settings.email}</span>
                </a>
              )}
              {settings?.phone && (
                <a href={`tel:${settings.phone}`} className="flex items-center justify-center gap-2 text-slate-300 hover:text-primary transition-colors text-sm">
                  <Phone className="h-4 w-4" />
                  <span>{settings.phone}</span>
                </a>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <p className="mt-8 text-slate-600 text-[10px] font-medium tracking-widest uppercase">
        © {new Date().getFullYear()} {platformName}
      </p>
    </div>
  );
}
