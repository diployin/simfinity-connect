# Design Guidelines: eSIM Connect - Premium Marketplace Platform

## Design Approach

**Reference-Based Design:** Inspired by Zetexa, Airalo, and Holafly—vibrant travel-tech aesthetic with bold gradients, premium polish, and conversion-optimized flows. Modern, energetic, and trustworthy.

**Core Principles:**
- Vibrant gradient backgrounds with bold visual impact
- Premium white cards with sophisticated shadows
- Trust-first design with credibility markers
- Seamless light/dark mode support
- Mobile-first responsive approach

## Color System

**Light Mode:**
- Primary Gradients: Blue (#3B82F6) to Purple (#8B5CF6) to Violet (#A855F7)
- Hero Overlays: 45-degree gradient with 60% opacity over images
- Card Backgrounds: White (#FFFFFF)
- Accent CTAs: Emerald (#10B981), Coral (#F97316)
- Text: Deep Charcoal (#0F172A), Medium Gray (#64748B)
- Borders: #E2E8F0

**Dark Mode:**
- Primary Gradients: Bright Blue (#60A5FA) to Bright Purple (#A78BFA)
- Card Backgrounds: Dark Slate (#1E293B)
- Text: Off-white (#F1F5F9), Light Gray (#CBD5E1)
- Borders: #334155

**Gradient Applications:**
- Hero sections: Blue-purple-violet 45° gradient overlays
- CTA banners: Full-section gradient backgrounds
- Card hovers: Subtle gradient border glow
- Feature strips: Gradient icon backgrounds

## Typography

**Font Stack:** 'Inter' (Google Fonts CDN) - modern, versatile, excellent screen rendering

**Hierarchy:**
- Hero Headlines: text-5xl lg:text-7xl, font-extrabold, tracking-tight, leading-tight
- Section Titles: text-4xl lg:text-5xl, font-bold
- Card Headlines: text-2xl lg:text-3xl, font-semibold
- Body: text-base (16px), leading-relaxed
- Labels: text-sm, font-medium, uppercase, tracking-wider
- Captions: text-xs, text-gray-600

## Layout System

**Spacing Primitives:** Tailwind units of 4, 6, 8, 12, 16, 24, 32 for consistent rhythm

**Container Widths:**
- Marketing pages: max-w-7xl
- Content sections: max-w-6xl
- Comparison tables: max-w-5xl
- Forms: max-w-xl

**Vertical Spacing:**
- Hero section: py-24 md:py-40
- Content sections: py-16 md:py-24
- Feature strips: py-12 md:py-16
- Cards: p-6 md:p-8

## Component Library

### Hero Section
- Large background image (1920x1200): Diverse travelers at iconic destinations using phones
- Vibrant blue-purple-violet gradient overlay (60% opacity, 45° angle)
- Centered bold headline with text-shadow for depth
- Destination search bar: Rounded-2xl, shadow-2xl, white with autocomplete
- CTA buttons: backdrop-blur-lg, semi-transparent white background (bg-white/20)
- Trust row below: "Trusted by 500K+ travelers" + media logos (TechCrunch, Forbes) + "4.9★ rating"

### Destination Cards
- Grid: grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6
- White cards (dark: #1E293B) with rounded-2xl, shadow-lg
- Large country flag emoji or icon (top-left, size-12)
- Destination name: text-2xl, font-bold
- Data badges: Rounded-full pills showing tiers (1GB, 3GB, 5GB, Unlimited)
- Bold pricing: text-4xl, font-extrabold with "from" prefix
- Coverage details: Small text listing countries included
- Hover: Lift effect (translate-y-[-8px]), gradient border glow, shadow-2xl

### Feature Strips
- Alternating backgrounds: Gradient section, white section, gradient section
- Grid: grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8
- Large Heroicons (size-16) with gradient circle backgrounds
- Feature title: text-xl, font-semibold
- Short description: text-sm, text-gray-600
- Icons: Globe, Zap, Shield, Headphones representing instant delivery, global coverage, security, support

### How It Works Section
- Three-step timeline with large numbered circles (1→2→3)
- Gradient numbers with glow effect
- Bold step titles: text-2xl, font-bold
- Phone mockup illustrations showing: 1) Destination search, 2) QR code scan, 3) Connected status
- Connecting dotted lines between steps (desktop only)

### Trust & Awards Section
- Grid of certification badges: ISO, GDPR, SSL, PCI-DSS (rounded-xl cards)
- Award badges: "Best Travel App 2024", "Trustpilot 4.8★", "Featured in Forbes"
- Network partner logos carousel: Vodafone, T-Mobile, Orange, AT&T (grayscale with color on hover)
- Auto-scrolling marquee effect for logos

### Comparison Table
- Three-column table: Basic, Standard, Premium plans
- Sticky header on scroll
- Feature rows with checkmarks/crosses (Heroicons check-circle/x-circle)
- Highlighted "Popular" column with gradient border
- CTA button at bottom of each column
- Responsive: Horizontal scroll on mobile with sticky first column

### Testimonial Carousel
- Large quote marks decoration
- Customer photo (rounded-full, size-20), name, location, 5-star rating
- Quote text: text-xl, italic
- Navigation dots below (gradient active state)
- Auto-advance with pause on hover

### FAQ Accordion
- White cards with rounded-xl, shadow-md
- Question text: text-lg, font-semibold
- Chevron icon rotates on expand
- Smooth height transition (300ms ease)
- Answer padding with light background (#F8FAFC)

### CTA Banners
- Full-width gradient backgrounds (blue-purple-violet)
- Centered white text with bold headline
- Large CTA button with white background, gradient text
- Secondary text: "Join 500,000+ happy travelers"

### Payment & Security Row
- Payment logos: Visa, Mastercard, PayPal, Apple Pay, Google Pay
- Displayed as grayscale with subtle hover color
- Spacing: gap-6, flex-wrap
- Section title: "Secure payments powered by:"

## Images

**Required Images:**
1. **Hero Background** (1920x1200): Happy diverse travelers using phones at iconic global landmarks (Eiffel Tower, Tokyo crosswalk, NYC skyline). High-quality, aspirational travel photography with natural lighting.

2. **How-It-Works Phone Mockups**: Three iPhone screenshots showing app interface: destination search screen, QR code installation screen, connected status screen.

3. **Testimonial Avatars**: Circular customer photos (authentic, diverse backgrounds, casual travel settings).

4. **Destination Card Thumbnails** (optional): Small landmark images for premium packages (300x200).

5. **Network Partner Logos**: Vector logos of telecom carriers (SVG, transparent backgrounds).

## Responsive Behavior

**Mobile (<768px):** Single column, hamburger menu, stacked cards, horizontal scroll tables
**Tablet (768-1024px):** Two columns, condensed spacing
**Desktop (>1024px):** Three-four columns, full layout with hover states

## Animations

**Smooth Transitions (Use Sparingly):**
- Card hover: Lift (translate-y-[-8px]) + shadow increase (200ms ease)
- Button hover: Subtle scale (scale-105, 150ms ease)
- Accordion expand: Height transition (300ms ease)
- Logo carousel: Smooth scroll animation (no parallax)
- Page sections: Fade-in on scroll (intersection observer, 400ms)

## Accessibility

- WCAG AA contrast ratios (4.5:1 text, 3:1 UI)
- Focus rings: ring-2 ring-offset-2 ring-blue-500
- Semantic HTML with ARIA labels
- Keyboard navigation for accordion, carousel
- Alt text on all images
- Form labels properly associated
- Skip-to-content link