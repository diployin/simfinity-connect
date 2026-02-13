import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  Search,
  ChevronDown,
  ChevronUp,
  PlayCircle,
  CreditCard,
  Wrench,
  HelpCircle,
  Mail,
  MessageSquare,
  Plus,
  Minus,
} from 'lucide-react';
import { useSettingByKey } from '@/hooks/useSettings';
import { Button } from '@/components/ui/button';
import { Link, useLocation } from 'wouter';

interface Article {
  title: string;
  content: string;
}

interface Category {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  accentColor: string;
  borderColor: string;
  bgColor: string;
  articles: Article[];
}

const categories: Category[] = [
  {
    id: 'getting-started',
    title: 'Getting Started with Simfinity',
    description: 'Learn the basics of eSIM technology and how to get connected.',
    icon: <PlayCircle className="h-6 w-6" />,
    accentColor: 'text-green-600',
    borderColor: 'border-l-green-500',
    bgColor: 'bg-green-50',
    articles: [
      {
        title: 'What is an eSIM and how does it work?',
        content:
          'An eSIM (embedded SIM) is a digital SIM built into your device. Unlike physical SIM cards, eSIMs can be activated remotely — no need to swap tiny cards or visit a store. Simply download a data plan, scan a QR code, and connect instantly. The eSIM chip is already soldered into your phone during manufacturing, so it works seamlessly with your device hardware.',
      },
      {
        title: 'How do I install the eSIM on iOS?',
        content:
          'On iPhone XR or newer: Go to Settings > Cellular > Add eSIM > Use QR Code. Point your camera at the QR code from your Simfinity account. Once scanned, tap "Add Cellular Plan." Then toggle on Data Roaming under Settings > Cellular > your new eSIM plan. Finally, set the eSIM as your data line under Settings > Cellular > Cellular Data.',
      },
      {
        title: 'How do I install the eSIM on Android?',
        content:
          'On most Android phones (Samsung, Google Pixel, etc.): Go to Settings > Network & Internet > SIMs > Add eSIM (or "Download SIM" on Samsung). Scan the QR code from your Simfinity account. After installation, go to Settings > Network & Internet > your eSIM > enable Data Roaming. Some Samsung devices may require: Settings > Connections > SIM Manager > Add eSIM.',
      },
      {
        title: 'Which devices support eSIM?',
        content:
          'Most modern smartphones support eSIM: Apple iPhone XR, XS, 11, 12, 13, 14, 15, 16 and newer; Samsung Galaxy S20, S21, S22, S23, S24 and newer; Google Pixel 3, 4, 5, 6, 7, 8, 9 and newer; Motorola Razr series; Huawei P40 and newer; OnePlus and Xiaomi select models. iPads with cellular also support eSIM. Check our Supported Devices page for the full list.',
      },
      {
        title: 'How do I activate my eSIM?',
        content:
          "After purchasing a plan, you'll receive a QR code via email and in your Simfinity account dashboard. Scan it using your device's camera or eSIM settings before your trip while connected to Wi-Fi. The eSIM profile downloads instantly. When you arrive at your destination, just enable Data Roaming and the eSIM will connect to a local network automatically.",
      },
      {
        title: 'Can I install the eSIM before my trip?',
        content:
          'Yes, and we strongly recommend it! You can install your eSIM days or even weeks before traveling. The data plan only starts counting when you first connect to a network at your destination (for most plans). This way, you land with instant connectivity without needing airport Wi-Fi.',
      },
      {
        title: 'What is the difference between eSIM and physical SIM?',
        content:
          'A physical SIM is a removable card you insert into your phone. An eSIM is a chip permanently embedded in your device that can be programmed remotely. Benefits of eSIM: no risk of losing a tiny card, instant activation, ability to store multiple plans on one device, more environmentally friendly (no plastic), and you keep your original number active on your physical SIM while using eSIM for data.',
      },
      {
        title: 'How do I choose the right data plan?',
        content:
          'Consider these factors: 1) Duration of your trip — match the plan validity to your travel dates. 2) Data needs — light browsing and messaging needs 1-3GB, moderate use with maps and social media needs 3-5GB, heavy use with video calls and streaming needs 5-10GB+. 3) Coverage — choose a country-specific plan for one destination, or a regional/global plan if visiting multiple countries.',
      },
      {
        title: 'Do I need to unlock my phone to use eSIM?',
        content:
          'Your device must be carrier-unlocked to use a third-party eSIM. If you purchased your phone outright, it should already be unlocked. If it is on a contract, contact your carrier to request an unlock. You can check if your phone is unlocked by going to Settings > General > About (iOS) or Settings > About Phone (Android) and looking for carrier lock status.',
      },
      {
        title: 'How many eSIM profiles can I store on my device?',
        content:
          'Most modern phones can store 5-10+ eSIM profiles simultaneously, but only one or two can be active at a time (depending on the device). iPhone 13 and newer support dual active eSIMs. This means you can keep eSIM profiles from previous trips and reactivate them later without reinstalling.',
      },
    ],
  },
  {
    id: 'plans-payments',
    title: 'Plans and Payments',
    description: 'Information about pricing, payment methods, and billing.',
    icon: <CreditCard className="h-6 w-6" />,
    accentColor: 'text-blue-600',
    borderColor: 'border-l-blue-500',
    bgColor: 'bg-blue-50',
    articles: [
      {
        title: 'What payment methods are accepted?',
        content:
          'We accept all major credit and debit cards (Visa, Mastercard, American Express, Discover), digital wallets (PayPal, Apple Pay, Google Pay), and select local payment methods depending on your region. All transactions are processed securely with bank-level encryption.',
      },
      {
        title: 'Can I get a refund?',
        content:
          "Yes, you can request a full refund if your eSIM hasn't been installed or activated yet. Once the eSIM profile has been downloaded to your device, refunds are evaluated on a case-by-case basis. If you experience technical issues preventing activation, our support team will work with you to resolve the issue or process a refund. Contact support@simfinity.com for assistance.",
      },
      {
        title: 'How do I top up my data plan?',
        content:
          'If your current plan is running low or has expired, you can easily top up: Log into your Simfinity account, navigate to "My eSIMs," select the eSIM you want to top up, and choose a new data package. The additional data is added to your existing eSIM — no need to scan a new QR code. Top-ups are available for most country and regional plans.',
      },
      {
        title: 'Do plans auto-renew?',
        content:
          'No, Simfinity plans never auto-renew. You will never be charged unexpectedly. When your data allowance is used up or your plan validity expires, the connection simply stops. You can then choose to purchase a new plan or top up at your convenience. We believe in transparent, pay-as-you-go pricing.',
      },
      {
        title: 'How do I check my remaining data?',
        content:
          'You can check your remaining data in several ways: 1) Log into your Simfinity account and view your active eSIM dashboard — it shows remaining data, days left, and usage in real-time. 2) Check your phone settings under Cellular/Mobile Data for usage statistics. 3) Enable data usage notifications in your Simfinity account to receive alerts at 50%, 80%, and 95% usage.',
      },
      {
        title: 'What is the difference between local, regional, and global plans?',
        content:
          'Local plans cover a single country (e.g., France only) and typically offer the best value per GB. Regional plans cover multiple countries in a region (e.g., Europe, Southeast Asia) using a single eSIM — perfect for multi-country trips. Global plans work in 100+ countries worldwide with one eSIM. Choose based on your itinerary: single country = local, multi-country in one region = regional, world travel = global.',
      },
      {
        title: 'Are there any hidden fees or charges?',
        content:
          'No. The price you see is the price you pay — no activation fees, no service charges, no taxes added at checkout, and no auto-renewal. There are no roaming surcharges or speed throttling hidden fees. Your plan includes all data at the speeds available from the local carrier network.',
      },
      {
        title: 'Can I purchase a plan for someone else?',
        content:
          'Yes! After purchasing, you will receive a QR code that can be shared with anyone. Simply forward the QR code image or email to the person who needs it. They can scan and install it on their own eSIM-compatible device. This is perfect for setting up travel connectivity for family members or colleagues.',
      },
      {
        title: 'What currencies are supported for payment?',
        content:
          'We support payments in multiple currencies including USD, EUR, GBP, AUD, CAD, INR, and many more. The currency is automatically detected based on your location, but you can also manually select your preferred currency from the currency selector in the navigation bar. All prices are converted in real-time using current exchange rates.',
      },
      {
        title: 'How do I apply a promo or referral code?',
        content:
          'During checkout, look for the "Promo Code" or "Referral Code" field. Enter your code and click "Apply." The discount will be reflected in your order total immediately. Referral codes from friends give both you and the referrer a discount. You can find your own referral code in your account dashboard under "Referral Program."',
      },
    ],
  },
  {
    id: 'troubleshooting',
    title: 'Troubleshooting',
    description: 'Solutions for common issues and technical problems.',
    icon: <Wrench className="h-6 w-6" />,
    accentColor: 'text-orange-600',
    borderColor: 'border-l-orange-500',
    bgColor: 'bg-orange-50',
    articles: [
      {
        title: "My eSIM isn't connecting to the network",
        content:
          "Follow these steps: 1) Ensure Data Roaming is enabled (Settings > Cellular > your eSIM > Data Roaming ON). 2) Make sure the eSIM is set as your data line (Settings > Cellular > Cellular Data > select the eSIM). 3) Toggle Airplane Mode on for 10 seconds, then off. 4) Restart your device completely. 5) Check you're in a supported coverage area for your plan. 6) Try manually selecting a network: Settings > Cellular > Network Selection > turn off Automatic and pick a local carrier.",
      },
      {
        title: "I can't scan the QR code",
        content:
          'Try these solutions: 1) Display the QR code on another screen (not the same phone). 2) Ensure your camera is clean and focused. 3) Adjust the screen brightness of the device showing the QR code to maximum. 4) Hold your phone steady at about 6-8 inches from the QR code. 5) If scanning still fails, you can enter the activation details manually: find the SM-DP+ address and activation code in your order email, then enter them in Settings > Cellular > Add eSIM > Enter Details Manually.',
      },
      {
        title: 'Slow internet speeds',
        content:
          'Network speeds can vary based on location and congestion. Try: 1) Toggle Airplane Mode on/off to reconnect to a stronger tower. 2) Switch between LTE/4G and 5G in Settings > Cellular > Voice & Data. 3) Move to an area with better coverage (near windows, higher floors). 4) Check if your data allowance is almost depleted — some plans reduce speed after a threshold. 5) Disable VPN if active, as it can reduce speeds. 6) Close background apps consuming bandwidth.',
      },
      {
        title: 'How to remove an eSIM',
        content:
          'On iOS: Settings > Cellular > select the eSIM plan > Remove Cellular Plan. On Android: Settings > Network & Internet > SIMs > select the eSIM > Delete. On Samsung: Settings > Connections > SIM Manager > select eSIM > Remove. Warning: Removing an eSIM is permanent — any remaining data will be lost and cannot be recovered. If you plan to revisit the same country, consider keeping the profile installed and topping up later.',
      },
      {
        title: 'eSIM not showing in settings',
        content:
          "If your eSIM doesn't appear after installation: 1) Verify your device supports eSIM (check our Supported Devices page). 2) Make sure your device is carrier-unlocked. 3) Restart your phone and check again. 4) Some carriers block eSIM functionality — contact your primary carrier to confirm there are no restrictions. 5) Try removing and re-scanning the QR code. 6) Update your device to the latest software version. 7) Contact our support if the issue persists — we can resend your QR code or provide manual installation details.",
      },
      {
        title: 'eSIM installed but no internet access',
        content:
          'If the eSIM shows as installed but you cannot browse the internet: 1) Confirm Data Roaming is ON for the eSIM line. 2) Check that the eSIM is selected as your Cellular Data line. 3) Ensure your plan is active and has remaining data. 4) Reset network settings (Settings > General > Transfer or Reset > Reset Network Settings on iOS). Note: this will forget saved Wi-Fi passwords. 5) Try connecting in a different location. 6) Check APN settings — usually these are configured automatically, but some networks may require manual APN entry.',
      },
      {
        title: 'My eSIM stopped working mid-trip',
        content:
          'If your eSIM was working and suddenly stopped: 1) Check if your data allowance has been fully consumed in your Simfinity dashboard. 2) Verify the plan validity period hasn\'t expired. 3) Toggle Airplane Mode on/off. 4) Restart your device. 5) Try manually selecting a different network operator. 6) If you crossed a border into a country not covered by your plan, you\'ll need to purchase a new plan for that country. 7) Contact our 24/7 support for immediate assistance.',
      },
      {
        title: '"No Service" or "SOS Only" showing on my phone',
        content:
          'This usually indicates a network registration issue: 1) Make sure you are in a coverage area for your plan\'s destination. 2) Enable Data Roaming. 3) Go to Network Selection and try switching from Automatic to Manual, then select a supported carrier. 4) Wait 2-3 minutes after arriving in a new country — network registration can take a moment. 5) If the issue persists after restarting, contact support with your eSIM ICCID number (found in Settings > Cellular > your eSIM).',
      },
      {
        title: 'Can I reinstall a deleted eSIM?',
        content:
          'In most cases, once an eSIM profile is deleted from your device, it cannot be reinstalled using the same QR code (it is a one-time use code). However, contact our support team — we may be able to issue a replacement QR code if your plan still has remaining data and validity. For future reference, we recommend keeping your eSIM profile installed even after your trip ends, as you can top up later if you return.',
      },
      {
        title: 'My phone overheats when using eSIM data',
        content:
          'Some users notice increased heat during heavy data usage. This is normal and related to the cellular radio, not the eSIM specifically. To reduce heat: 1) Reduce screen brightness. 2) Close unused apps. 3) Avoid direct sunlight on your device. 4) Turn off unnecessary features like Bluetooth and GPS when not needed. 5) Avoid using your phone while charging. If overheating is severe, let the device cool before continuing use.',
      },
    ],
  },
  {
    id: 'faq',
    title: 'FAQ',
    description: 'Answers to the most frequently asked questions.',
    icon: <HelpCircle className="h-6 w-6" />,
    accentColor: 'text-purple-600',
    borderColor: 'border-l-purple-500',
    bgColor: 'bg-purple-50',
    articles: [
      {
        title: 'Can I use eSIM and physical SIM at the same time?',
        content:
          'Yes! Most eSIM-compatible devices support Dual SIM — one physical SIM + one eSIM active simultaneously. This means you can keep your regular phone number on your physical SIM for calls and texts, while using the eSIM for affordable local data. On iPhone 13 and newer, you can even use two eSIMs at the same time without a physical SIM.',
      },
      {
        title: 'Do I need Wi-Fi to install an eSIM?',
        content:
          'Yes, you need an internet connection (Wi-Fi or existing mobile data) to download and install the eSIM profile. The download is very small (a few KB), so any stable connection works. We strongly recommend installing your eSIM at home or hotel before heading to the airport to ensure a smooth experience.',
      },
      {
        title: 'Can I share my eSIM data with others?',
        content:
          "The eSIM data plan is tied to the specific device where it's installed and cannot be transferred. However, you can share your internet connection with other devices by enabling your phone's Personal Hotspot (tethering). Go to Settings > Personal Hotspot > Allow Others to Join. Be aware that hotspot usage consumes your data more quickly than regular browsing.",
      },
      {
        title: 'What happens when my data runs out?',
        content:
          'When your data is fully consumed, your internet connection stops but the eSIM profile remains installed on your device. You have two options: 1) Purchase a data top-up through your Simfinity account — the new data is added to your existing eSIM instantly. 2) Purchase a completely new plan if top-ups are not available for your current plan. Your phone calls and texts on your primary SIM are unaffected.',
      },
      {
        title: 'Is my personal data safe?',
        content:
          'Absolutely. We use AES-256 encryption for all data in transit and at rest. We never sell, share, or give third parties access to your personal information. Our eSIM connections use the same secure protocols as your regular carrier. We comply with GDPR, CCPA, and international data protection regulations. Your payment information is processed through PCI-compliant payment processors and is never stored on our servers.',
      },
      {
        title: 'Will my phone number change when using eSIM?',
        content:
          'No. Your Simfinity eSIM provides data-only connectivity. Your original phone number remains active on your physical SIM (or primary eSIM line). You can still receive calls and texts on your regular number. Apps like WhatsApp, iMessage, and Telegram will continue to work normally using your existing number over the eSIM data connection.',
      },
      {
        title: 'Can I use the eSIM for phone calls and texts?',
        content:
          'Simfinity eSIM plans are data-only, which means they do not include a phone number for traditional calls or SMS. However, you can make calls and send messages using internet-based apps over the eSIM data connection: WhatsApp, Telegram, FaceTime, Skype, Zoom, Google Meet, iMessage (over data), and any other VoIP app.',
      },
      {
        title: 'How long does it take to receive my eSIM after purchase?',
        content:
          'Your eSIM QR code is delivered instantly after purchase — typically within 30 seconds to 2 minutes. You will receive it via email and it will also appear in your Simfinity account dashboard. If you do not receive the email, check your spam/junk folder. You can always access your QR code by logging into your account.',
      },
      {
        title: 'Can I use the same eSIM on a different device?',
        content:
          'Generally, no. Once an eSIM profile is installed on a device, it is linked to that specific device and cannot be moved to another phone. If you get a new phone, you will need to purchase a new eSIM plan. Some plans may allow a one-time transfer — contact our support team to check availability for your specific plan.',
      },
      {
        title: 'Does the eSIM work on tablets and smartwatches?',
        content:
          'Yes, our eSIM works on any eSIM-compatible device, including iPads with cellular capability, Samsung Galaxy Tab devices, and some laptops with eSIM support. Smartwatch compatibility depends on the model — Apple Watch with cellular and Samsung Galaxy Watch with LTE support eSIM, but may have limitations with third-party eSIM providers. Check our Supported Devices page for the full compatibility list.',
      },
    ],
  },
];

export default function HelpCenter() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [expandedArticles, setExpandedArticles] = useState<Set<string>>(new Set());
  const siteName = useSettingByKey('platform_name');
  const [location] = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const cat = params.get('category');
    if (cat && categories.some((c) => c.id === cat)) {
      setSelectedCategory(cat);
    }
  }, [location]);

  const toggleArticle = (articleKey: string) => {
    setExpandedArticles((prev) => {
      const next = new Set(prev);
      if (next.has(articleKey)) {
        next.delete(articleKey);
      } else {
        next.add(articleKey);
      }
      return next;
    });
  };

  const handleCategoryClick = (categoryId: string) => {
    setSelectedCategory((prev) => (prev === categoryId ? null : categoryId));
  };

  const filteredCategories = categories
    .map((category) => ({
      ...category,
      articles: category.articles.filter(
        (article) =>
          article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          article.content.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    }))
    .filter((category) => category.articles.length > 0);

  const displayedCategories = searchQuery
    ? filteredCategories
    : selectedCategory
      ? categories.filter((c) => c.id === selectedCategory)
      : categories;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Helmet>
        <title>Help Center | {siteName || 'Simfinity'}</title>
        <meta
          name="description"
          content="Get help with your eSIM. Find answers about installation, plans, payments, troubleshooting, and more."
        />
      </Helmet>

      <section
        className="relative overflow-hidden"
        style={{
          background: 'linear-gradient(180deg, #f0f9f1 0%, #ffffff 100%)',
        }}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
              How can we help you?
            </h1>
            <p className="text-lg text-gray-500 mb-8">
              Search our knowledge base or browse categories below
            </p>
            <div className="max-w-xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="search"
                  placeholder="Search for answers..."
                  className="w-full pl-12 pr-4 h-14 text-base rounded-xl border border-gray-200 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-[#2c7338]/30 focus:border-[#2c7338] transition-all"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {!searchQuery && (
        <section className="py-12 md:py-16 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => handleCategoryClick(category.id)}
                    className={`group text-left p-6 rounded-xl border-l-4 ${category.borderColor} bg-white border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 ${
                      selectedCategory === category.id
                        ? 'ring-2 ring-[#2c7338]/20 shadow-md'
                        : ''
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className={`flex-shrink-0 w-12 h-12 rounded-lg ${category.bgColor} flex items-center justify-center ${category.accentColor}`}
                      >
                        {category.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-[#2c7338] transition-colors">
                          {category.title}
                        </h3>
                        <p className="text-sm text-gray-500">{category.description}</p>
                        <span className="inline-flex items-center gap-1 mt-2 text-sm font-medium text-[#2c7338]">
                          {selectedCategory === category.id ? (
                            <>
                              Hide articles <ChevronUp className="h-4 w-4" />
                            </>
                          ) : (
                            <>
                              View articles <ChevronDown className="h-4 w-4" />
                            </>
                          )}
                        </span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      <section className="py-12 md:py-16 bg-slate-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto space-y-8">
            {displayedCategories.map((category) => (
              <div key={category.id}>
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className={`w-8 h-8 rounded-lg ${category.bgColor} flex items-center justify-center ${category.accentColor}`}
                  >
                    {category.icon}
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900">{category.title}</h2>
                  <span className="text-sm text-gray-400">
                    {category.articles.length} articles
                  </span>
                </div>
                <div className="space-y-2">
                  {category.articles.map((article, idx) => {
                    const articleKey = `${category.id}-${idx}`;
                    const isExpanded = expandedArticles.has(articleKey);
                    return (
                      <div
                        key={articleKey}
                        className="bg-white rounded-lg border border-gray-100 overflow-hidden"
                      >
                        <button
                          onClick={() => toggleArticle(articleKey)}
                          className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-gray-50 transition-colors"
                        >
                          <span className="font-medium text-gray-900 pr-4">
                            {article.title}
                          </span>
                          {isExpanded ? (
                            <Minus className="h-5 w-5 text-[#2c7338] flex-shrink-0" />
                          ) : (
                            <Plus className="h-5 w-5 text-gray-400 flex-shrink-0" />
                          )}
                        </button>
                        {isExpanded && (
                          <div className="px-6 pb-4 text-gray-600 leading-relaxed border-t border-gray-50">
                            <p className="pt-3">{article.content}</p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
            {searchQuery && displayedCategories.length === 0 && (
              <div className="text-center py-12">
                <HelpCircle className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-lg text-gray-500">
                  No articles found matching "{searchQuery}"
                </p>
                <p className="text-sm text-gray-400 mt-2">
                  Try different keywords or browse the categories above
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
              Still need help?
            </h2>
            <p className="text-gray-500 mb-8">
              Our support team is ready to assist you with any questions
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
              <div className="p-6 rounded-xl border border-gray-100 bg-slate-50 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-4">
                  <Mail className="h-6 w-6 text-[#2c7338]" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">Email Support</h3>
                <a
                  href="mailto:support@simfinity.com"
                  className="text-[#2c7338] hover:underline text-sm"
                >
                  support@simfinity.com
                </a>
              </div>
              <div className="p-6 rounded-xl border border-gray-100 bg-slate-50 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-4">
                  <MessageSquare className="h-6 w-6 text-[#2c7338]" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">Live Chat</h3>
                <p className="text-sm text-gray-500">Available 24/7</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
