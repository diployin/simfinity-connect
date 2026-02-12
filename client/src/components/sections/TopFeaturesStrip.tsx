import { Wifi, CreditCard, Smartphone, Zap } from 'lucide-react';
import { useTranslation } from '@/contexts/TranslationContext';

export function TopFeaturesStrip() {
  const { t } = useTranslation();

  const features = [
    {
      icon: Wifi,
      titleKey: 'website.home.features.unlimited.title',
      descKey: 'website.home.features.unlimited.description',
      titleFallback: 'Unlimited data plans',
      descFallback: 'Stay connected with fast data worldwide.',
    },
    {
      icon: CreditCard,
      titleKey: 'website.home.features.noRoaming.title',
      descKey: 'website.home.features.noRoaming.description',
      titleFallback: 'No roaming charges',
      descFallback: 'Travel freely without extra charges.',
    },
    {
      icon: Smartphone,
      titleKey: 'website.home.features.keepSim.title',
      descKey: 'website.home.features.keepSim.description',
      titleFallback: 'Keep physical SIM',
      descFallback: 'Keep your local SIM for calls and texts.',
    },
    {
      icon: Zap,
      titleKey: 'website.home.features.quickSetup.title',
      descKey: 'website.home.features.quickSetup.description',
      titleFallback: 'Quick eSIM setup',
      descFallback: 'Activate online and connect in minutes.',
    },
  ];

  const marqueeItems = features.map((feature) => ({
    icon: feature.icon,
    text: t(feature.titleKey, feature.titleFallback),
  }));

  // Duplicate items for seamless infinite loop
  const doubledItems = [...marqueeItems, ...marqueeItems];

  return (
    <section className="bg-muted/40 dark:bg-muted/20 border-y border-border/30 overflow-hidden py-3">
      <style>{`
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        
        .marquee-container {
          display: flex;
          animation: marquee 30s linear infinite;
          gap: 2rem;
          width: fit-content;
        }
        
        .marquee-container:hover {
          animation-play-state: paused;
        }
        
        .marquee-item {
          flex-shrink: 0;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-weight: 500;
          font-size: 0.95rem;
          color: var(--foreground);
          white-space: nowrap;
        }
        
        .dark .marquee-item {
          color: var(--foreground);
        }
        
        .marquee-separator {
          color: var(--muted-foreground);
          opacity: 0.4;
          margin: 0 1.5rem;
        }
      `}</style>
      
      <div className="relative overflow-hidden">
        <div className="marquee-container">
          {doubledItems.map((item, index) => (
            <div key={index} className="marquee-item">
              <item.icon className="h-4 w-4" />
              <span>{item.text}</span>
              {index < doubledItems.length - 1 && <span className="marquee-separator">•</span>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
