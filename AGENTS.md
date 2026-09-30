# Link Me Marketplace — Workspace Instructions & Rules

Welcome to the **Link Me** codebase. This repository contains the modern, responsive web application for the Link Me local services marketplace.

## Project Structure & Tech Stack
- **Framework:** React 19 + TypeScript (Strict typing)
- **Bundler:** Vite 7 with `vite-plugin-singlefile`
- **Styling:** Tailwind CSS v4 (`@tailwindcss/vite`)
- **Animation & Motion:** Framer Motion (`motion`, `AnimatePresence`) + Lenis smooth scroll
- **Icons & Graphics:** Handcrafted optimized inline SVGs with brand gradients

## Workspace Skills
The following specialized skills are installed in `.agents/skills/`:
1. `marketplace-features`: Service provider profiles, search, filtering, quotes, and booking.
2. `realtime-chat-messaging`: Instant messaging between clients and providers, quote attachments, status indicators.
3. `tailwind-motion-design-system`: Visual standards, brand colors, wave page transitions, ripple feedback, spring modals.
4. `auth-and-access-control`: Client vs. Provider account roles, sign-in/up forms, password validation, demo accounts.
5. `marketplace-testing-deployment`: TypeScript verification, single-file bundling, dev server health, accessibility.

## Development Commands
- Start dev server: `npm run dev` (Runs on `http://localhost:5173/`)
- Type-check: `npx tsc --noEmit`
- Production build: `npm run build` (Outputs single bundle to `dist/index.html`)
