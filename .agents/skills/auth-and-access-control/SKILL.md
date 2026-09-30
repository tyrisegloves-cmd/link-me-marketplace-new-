---
name: auth-and-access-control
description: >-
  Manage authentication, user registration, role-based workflows (Clients vs Service Professionals),
  session state, and protected actions in Link Me. Use when enhancing sign-in/up pages, profile management,
  demo accounts, or authorization checks for booking and messaging.
---

# Authentication & Access Control Skill

This skill outlines the procedures for user authentication, role assignment, and access control across **Link Me**.

## Roles & Permissions

1. **Client / Customer (`role === 'client'`):**
   - Can browse marketplace, search, and view provider profiles.
   - Can submit quote requests and book appointments.
   - Can start direct chat inquiries with verified pros.
   - Can leave ratings and verified reviews after job completion.

2. **Service Provider / Pro (`role === 'provider'`):**
   - Can configure business bio, hourly pricing, service radius, and trade categories.
   - Can upload licenses, proof of insurance, and portfolio photos for verification.
   - Can respond to customer inquiries and issue binding quote cards in chat.
   - Can accept or decline booking requests.

## Authentication UX Best Practices

### 1. Unified Entry Point
- Keep a single prominent **"Sign In / Sign Up"** button in the header navbar.
- Open the dedicated `AuthPage` with easy toggle between **Sign In** and **Create Account**.

### 2. Form Validation & Accessibility
- Always provide proper `name` and `autoComplete` attributes:
  - `email`: `autoComplete="email"`
  - `password` (login): `autoComplete="current-password"`
  - `password` (register): `autoComplete="new-password"`
  - `name`: `autoComplete="name"`
- Provide password strength calculation with visual feedback bars (Weak, Fair, Good, Strong).
- Include password visibility toggle eye icons for error prevention.

### 3. Quick Demo Authentication
- Always retain quick-access demo credentials:
  - Client: `sarah.jenkins@example.com`
  - Pro: `marcus.vance@example.com`
- This allows reviewers and testers to experience both perspectives without external database setup.

### 4. Session State & Protection
- Store user profile in app state or `localStorage` to persist across reloads.
- Intercept guest users when they click **"Request Quote"** or **"Send Message"** and direct them gracefully to the auth modal or page.
