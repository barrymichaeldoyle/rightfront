# RightFront – Developer Context

### Purpose

RightFront fixes poor App Store “not found” pages by giving marketers and devs global redirect links that smartly route users to the right local storefront (e.g. `apps.apple.com/us/...`, `apps.apple.com/de/...`) or show a clean fallback page.

### Key Features

- Location-based redirection using Edge runtime
- iOS + Android (App Store + Play Store) support
- Friendly fallback UI
- Extendable tracking and analytics later
- Freemium-ready micro-SaaS

### Internal Terms

- `App ID`: The iOS app ID (e.g. `id123456789`) or Android package name.
- `Fallback`: Branded HTML page shown when a localized store entry is not found.
- `Link`: The RightFront short link endpoint (e.g. `/link?id=...`).

### Implementation Notes

- Hosted on Vercel for automatic geo support.
- `runtime = "edge"` where possible.
- `/link/route.ts` is the main redirection API.
- Uses `@/lib/geo` and `@/lib/resolve` helpers.
