---
name: marketplace-testing-deployment
description: >-
  Build, validate, test, and package the Link Me marketplace application.
  Use when running TypeScript checks, verifying singlefile production bundles, fixing build errors,
  evaluating web performance (LCP, CLS, INP), and deploying to static or cloud hosts.
---

# Marketplace Testing & Deployment Skill

This skill defines the verification, quality assurance, and packaging pipeline for **Link Me**.

## Pre-Deployment Verification Checklist

Before publishing or marking tasks complete, execute:

### 1. TypeScript & Static Analysis Check
```bash
npx tsc --noEmit
```
- Verify zero type errors across `src/`.
- Ensure all new components export typed props and interface definitions in `src/types.ts`.

### 2. Single-File Production Build
```bash
npm run build
```
- Bundles the entire client into a high-performance single-file `dist/index.html` via `vite-plugin-singlefile`.
- Check bundle size to ensure no unneeded bloated assets are included.

### 3. Dev Server Health & EBUSY Prevention
- Vite watch config in `vite.config.ts` must ignore `**/dist/**`:
```typescript
server: {
  watch: {
    ignored: ['**/dist/**'],
  },
}
```
- Test local response with:
```powershell
Invoke-WebRequest -Uri "http://localhost:5173/" -UseBasicParsing
```

### 4. Accessibility & Core Web Vitals
- Ensure all images have descriptive `alt` tags.
- Interactive buttons must have visible focus rings (`focus:ring-2 focus:ring-blue-500`).
- Color contrast on text elements must meet WCAG 2.1 AA standards (minimum 4.5:1 for normal text).
