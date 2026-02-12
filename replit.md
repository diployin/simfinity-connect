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
- 2026-02-12: Initial Replit setup - configured database, allowed all hosts, made Stripe init conditional
