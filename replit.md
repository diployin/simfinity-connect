# eSIMConnect

## Overview
eSIMConnect is a full-stack eSIM marketplace application that allows users to browse, purchase, and manage eSIM data plans for global connectivity. It supports multiple eSIM providers (Airalo, eSIM Access, eSIM Go, Maya Mobile).

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
