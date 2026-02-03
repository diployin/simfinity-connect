import {
  Infinity,
  Smartphone,
  Phone,
  Headphones,
  Wifi,
  Zap,
  Globe,
  Shield,
  Clock,
} from 'lucide-react';

interface TickerItem {
  icon: React.ReactNode;
  text: string;
}

interface InfiniteScrollTickerProps {
  items?: TickerItem[];
  className?: string;
}

const defaultItems: TickerItem[] = [
  { icon: <Infinity className="h-5 w-5" />, text: 'One eSIM for lifetime' },
  { icon: <Smartphone className="h-5 w-5" />, text: 'Magic SIM Available' },
  { icon: <Phone className="h-5 w-5" />, text: 'Data + Voice + SMS' },
  { icon: <Headphones className="h-5 w-5" />, text: 'Customer Service' },
  { icon: <Wifi className="h-5 w-5" />, text: 'Hotspot Sharing' },
  { icon: <Globe className="h-5 w-5" />, text: '190+ Countries' },
  { icon: <Zap className="h-5 w-5" />, text: 'Instant Activation' },
  { icon: <Shield className="h-5 w-5" />, text: 'Secure & Reliable' },
  { icon: <Clock className="h-5 w-5" />, text: 'No Expiry Hassle' },
];

export function InfiniteScrollTicker({
  items = defaultItems,
  className = '',
}: InfiniteScrollTickerProps) {
  // Triple the items for smoother infinite scroll
  const duplicatedItems = [...items, ...items, ...items];

  return (
    <div
      className={`w-full overflow-hidden py-4 ${className}`}
      style={{ backgroundColor: '#c6ff00' }}
      data-testid="ticker-features"
    >
      <div className="animate-scroll-ticker flex items-center whitespace-nowrap">
        {duplicatedItems.map((item, index) => (
          <div
            key={index}
            className="flex items-center gap-3 px-8 text-base font-semibold text-gray-900"
            data-testid={`ticker-item-${index}`}
          >
            <span className="flex-shrink-0 text-gray-800">{item.icon}</span>
            <span data-testid={`ticker-text-${index}`}>{item.text}</span>
            {/* Separator dot */}
            <span className="mx-2 text-gray-700">•</span>
          </div>
        ))}
      </div>
    </div>
  );
}
