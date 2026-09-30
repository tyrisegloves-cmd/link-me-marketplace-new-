---
name: tailwind-motion-design-system
description: >-
  Design guidelines, Tailwind CSS styling rules, and Framer Motion animation patterns for Link Me.
  Use when designing new UI components, implementing page transitions (wave, slide, fade), ripple feedback buttons,
  responsive layouts, glassmorphic headers, and Lenis smooth scrolling.
---

# Tailwind & Framer Motion Design System Skill

This skill governs visual design, brand consistency, Tailwind CSS v4 practices, and Framer Motion micro-interactions across **Link Me**.

## Design Tokens & Brand Palette

- **Primary Colors:**
  - Blue (`#2563eb` - `blue-600`, `#1d4ed8` - `blue-700`, `#3b82f6` - `blue-500`)
  - Indigo / Violet (`#4f46e5` - `indigo-600`, `#7c3aed` - `violet-600`)
- **Neutral Grayscale:**
  - Slate (`slate-900` for primary headings, `slate-600` for body copy, `slate-500` for captions, `slate-100` / `slate-50` for card backgrounds)
- **Status Colors:**
  - Emerald (`emerald-600` for verified badges and success states)
  - Amber (`amber-500` for star ratings)
  - Red (`red-500` for alerts and unread counters)

## Animation Patterns

### 1. Ripple Button Interactions (`RippleButton.tsx`)
Always wrap interactive CTA buttons and card links with `RippleButton`:
- Props: `rippleColor` (defaults to subtle white or translucent blue `rgba(37,99,235,0.25)`).
- Provides instant physical feedback before trigger actions.

### 2. Wave Page Transitions (`WaveTransition.tsx`)
Page changes across `home`, `marketplace`, `about`, `testimonials`, `contact`, and `auth` use radial expanding wave transitions originating from the click coordinates `(clientX, clientY)`:
```tsx
const triggerWave = (e: MouseEvent<HTMLElement>, target: PageType) => {
  if (target === currentPage) return;
  setWave({ active: true, x: e.clientX, y: e.clientY, target, isBack: false });
};
```

### 3. Modal Dialogs (`AnimatePresence` + Spring Physics)
When opening `ProfileModal`, `QuoteModal`, or preview modals:
```tsx
<motion.div
  initial={{ opacity: 0, scale: 0.95, y: 16 }}
  animate={{ opacity: 1, scale: 1, y: 0 }}
  exit={{ opacity: 0, scale: 0.95, y: 16 }}
  transition={{ type: 'spring', damping: 26, stiffness: 280 }}
  className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl ..."
>
```

### 4. Lenis Smooth Scrolling
- Initialized in `src/App.tsx`.
- Keep duration around `1.25s` with smooth wheel easing.
- Intercept internal anchor hash links to smoothly scroll with fixed header offset.
