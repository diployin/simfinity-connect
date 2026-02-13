# Simfinity

## Overview
Simfinity is a full-stack eSIM marketplace application that allows users to browse, purchase, and manage eSIM data plans for global connectivity. It supports multiple eSIM providers (Airalo, eSIM Access, eSIM Go, Maya Mobile).

## Tech Stack
- **Frontend**: React 18 + TypeScript, Vite, TailwindCSS, Radix UI, Redux Toolkit
- **Backend**: Express.js (TypeScript), served on port 5000
- **Database**: PostgreSQL (Neon-backed via Replit), Drizzle ORM
- **Routing**: Wouter (client-side)
- **Payments**: Stripe, PayPal, Razorpay
- **Real-time**: Socket.IO

## Project Structure
```
client/           - React frontend (Vite)
  src/
    components/   - UI components
    pages/        - Page components
    contexts/     - React contexts
    hooks/        - Custom hooks
    redux/        - Redux store & slices
    locales/      - i18n translations
server/           - Express backend
  routes/         - API route handlers
  services/       - Business logic services
  providers/      - eSIM provider integrations
  middleware/     - Express middleware
  payments/       - Payment gateway integrations
shared/           - Shared types and schema (Drizzle)
migrations/       - Drizzle database migrations
```

## Development
- `npm run dev` - Start dev server (Express + Vite middleware on port 5000)
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run db:push` - Push schema changes to database
- `npm run db:generate` - Generate migrations

## Configuration
- Both frontend and backend are served on port 5000
- Vite runs in middleware mode during development
- `allowedHosts: true` configured for Replit proxy compatibility
- Stripe initialization is conditional (requires STRIPE_SECRET_KEY env var)

## Recent Changes
- 2026-02-13: Homepage sections redesign to match saily.com screenshots
  - BenefitsSection ("Why choose us"): Clean 3x2 grid, SVG line icons, bold titles, descriptions. No card backgrounds. Green label above heading.
  - HowItWorksSteps ("How does it work"): 3 rounded cards on slate-50 bg, numbered badges (1,2,3), plan selection/install/usage mockups inside each card
  - DownloadApp: New section with Trustpilot rating, app store badges (inline SVG), star ratings, phone+QR image
  - ReferAndEarn: New section with blue gradient banner, gift icon, referral headline, "Learn More" bordered button, friends photo
  - SiteFooter: Complete redesign — Simfinity logo + app store badges, 5-column link grid (Popular Destinations, Simfinity, eSIM, Help, Follow Us), dynamic social/page links, payment method badges, copyright bar
  - Home.tsx section order: Hero → WhatIsEsim → DestinationsTabs → InstantConnection → Benefits → HowItWorks → Testimonials → FAQ → DownloadApp → ReferAndEarn
  - Generated images: download-app-phone.png, refer-friends.png
  - All sections mobile responsive with grid breakpoints
- 2026-02-13: Rebrand from eSIMConnect to Simfinity with green (#2c7338) color scheme
  - Brand name: All "eSIMConnect" / "eSIM Connect" references replaced with "Simfinity"
  - Logo: "Sim" + gradient green "finity" text, green gradient icon
  - Color palette: Primary #2c7338, secondary #1e5427, light #3d9a4d, dark #194520
  - CSS variables updated in index.css (both light and dark mode palettes)
  - ThemeContext default colors updated
  - All Tailwind teal-* classes replaced with green hex equivalents
  - Gradients applied to buttons, badges, logo, hero elements for premium look
  - Hero background changed from light blue (#e8f4f8) to light green (#e8f5e9)
- 2026-02-13: Hero & top nav redesign to match saily.com screenshot
  - HeroSection: Light blue gradient bg (#e8f4f8) covering both header and hero seamlessly, two-column boxed layout (text left, phone+luggage image right, max-w-2xl), static headline with split t() keys preserved, rounded search bar, popular destinations, stats strip (12M downloads, 200+ destinations, data plans, ratings)
  - SiteHeader: Mega menu navigation with hover dropdowns — Products (Local/Regional/Global eSIMs with icon cards), Resources (What is eSIM, About Us, Reviews, Blog, Supported Devices), Help (FAQs, Getting Started, Troubleshooting, Contact Support). "Destinations" search button, boxed max-width layout. Mobile menu mirrors all desktop mega menu links.
  - WhatIsEsim: New section above DestinationsTabs — two-column layout with eSIM chip illustration (left) and "What is an eSIM?" explainer text (right), floating "eSIM #1 Active" badge
  - InstantConnection: New section below DestinationsTabs — "Instant connection and safer browsing" heading, 2-column card grid ("Connect instantly" gray bg + "Avoid waiting in line" blue bg) + full-width "Stay protected online" card with floating security badges
  - Home.tsx: Section order: Hero → WhatIsEsim → DestinationsTabs → InstantConnection → Benefits → HowItWorks → Testimonials → FAQ
  - Generated images: esim-chip-illustration.png, connect-instantly-travel.png, avoid-waiting-traveler.png, stay-protected-phone.png
  - Home.tsx: Adjusted header padding for new nav height (72px)
  - Generated phone+luggage hero image at /images/hero-phone-luggage.png
- 2026-02-12: Complete homepage redesign to match saily.com premium aesthetic
  - HeroSection: Left-aligned bold headline, rotating keywords, search bar, popular destinations strip
  - DestinationsTabs: Pill-style tabs, 3x3 grid list cards with flags, country names, pricing, chevrons
  - BenefitsSection: Feature cards grid (horizontal scroll on mobile, 3-column on desktop)
  - HowItWorksSteps: Clean 3-step numbered layout with interactive mockups
  - TravelerTestimonials: Masonry-style layout with Trustpilot badges and star ratings
  - FAQWithSupport: Minimal full-width accordion with centered help section
  - Home.tsx: Cleaned up to only include Hero → Destinations → Benefits → HowItWorks → Testimonials → FAQ
  - All translation hooks (t()), currency contexts, and API data fetching preserved
  - GlobalFloatingNav unchanged
- 2026-02-12: Initial Replit setup - configured database, allowed all hosts, made Stripe init conditional
