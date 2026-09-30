---
name: marketplace-features
description: >-
  Build, extend, and manage local services marketplace functionality for Link Me.
  Use when adding or modifying service provider profiles, category filters, search and sorting,
  hourly pricing calculation, quote requests, booking appointment calendars, and rating/review systems.
---

# Marketplace Features Skill

This skill guides the implementation, extension, and optimization of core marketplace functionality in the **Link Me** platform.

## Architecture & Data Flow

```
[User / Search Input] ──> [MarketplacePage Filter & Sort State]
                                  │
      ┌───────────────────────────┴───────────────────────────┐
      ▼                                                       ▼
[Provider Cards Grid]                                [Category Filter Bar]
      │
      ├─ Click Card ───> [ProfileModal: Reviews, Bio, Badges, Portfolio]
      ├─ Click Quote ──> [QuoteModal: Service details, Date, Hourly rate calculation]
      └─ Click Chat ───> [ChatRoom: Real-time direct inquiry]
```

## Core Procedures

### 1. Adding & Extending Provider Models
The service provider data model resides in `src/types.ts` (`ServiceProvider`) and demo datasets in `src/data.tsx` (`providers`).
When adding or extending providers:
- Maintain complete fields: `id`, `name`, `avatar`, `service`, `category`, `rating`, `reviews`, `price`, `location`, `verified`, `tags`.
- Support category matching against standard taxonomies (`cleaning`, `plumbing`, `electrical`, `carpentry`, `moving`, `landscaping`, `tech`, `wellness`).
- Always compute ratings with decimal precision (e.g. `4.9`) and review counts.

### 2. Search & Multi-Criteria Filtering
Implement fast, memoized filtering using `useMemo`:
```tsx
const filteredProviders = useMemo(() => {
  const q = search.toLowerCase().trim();
  return providers
    .filter((p) => {
      const matchCat = activeCategory === 'all' || p.category === activeCategory;
      const matchQuery =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.service.toLowerCase().includes(q) ||
        p.location.toLowerCase().includes(q) ||
        p.tags.some((tag) => tag.toLowerCase().includes(q));
      return matchCat && matchQuery;
    })
    .sort((a, b) => {
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'reviews') return b.reviews - a.reviews;
      if (sortBy === 'price_asc') return parseFloat(a.price.replace(/[^0-9.]/g, '')) - parseFloat(b.price.replace(/[^0-9.]/g, ''));
      if (sortBy === 'price_desc') return parseFloat(b.price.replace(/[^0-9.]/g, '')) - parseFloat(a.price.replace(/[^0-9.]/g, ''));
      return a.name.localeCompare(b.name);
    });
}, [search, activeCategory, sortBy, providers]);
```

### 3. Quote Request & Price Estimation Workflow
When configuring `QuoteModal.tsx`:
1. Calculate estimated costs: `(base_rate * hours) + material_fee = total`.
2. Collect job timeline, urgency level (`Standard`, `Next Day`, `Emergency`), and location zip code.
3. Validate user contact information and prompt for sign-in if guest.
4. Generate a quote receipt with confirmation ID and dispatch a notification into `ChatRoom`.

### 4. Verified Badge & Trust System
- Providers with `verified: true` display the verification checkmark badge.
- Include background check verification criteria, insurance validity, and identity verification checklist inside `ProfileModal.tsx`.
