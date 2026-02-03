import { useLocation } from 'wouter';
import { FloatingDock } from '@/components/ui/floating-dock';
import { Home, Globe, Smartphone, ShoppingBag, HeadphonesIcon, User } from 'lucide-react';
import { RiCustomerService2Fill } from 'react-icons/ri';

const navLinks = [
  {
    title: 'Home',
    icon: <Home className="h-full w-full" />,
    href: '/',
  },
  {
    title: 'Destinations',
    icon: <Globe className="h-full w-full" />,
    href: '/destinations',
  },
  {
    title: 'Supported ',
    icon: <Smartphone className="h-full w-full" />,
    href: '/supported-devices',
  },
  {
    title: 'Orders',
    icon: <ShoppingBag className="h-full w-full" />,
    href: '/account/orders',
  },
  {
    title: 'Support',
    icon: <RiCustomerService2Fill className="h-full w-full" />,
    href: '/account/support',
  },
  {
    title: 'Account',
    icon: <User className="h-full w-full" />,
    href: '/account/profile',
  },
];

export function GlobalFloatingNav() {
  const [location] = useLocation();

  const hiddenPaths = [
    '/admin',
    '/enterprise/dashboard',
    '/enterprise/quotes',
    '/enterprise/orders',
    '/enterprise/esims',
    '/enterprise/login',
    '/checkout',
    '/login',
  ];

  const shouldHide = hiddenPaths.some((path) => location.startsWith(path));

  if (shouldHide) {
    return null;
  }

  return <FloatingDock items={navLinks} />;
}
