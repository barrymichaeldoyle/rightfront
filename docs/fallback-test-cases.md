# Fallback Page — Real App Store Test Cases

This file is a **curated list of real iOS App Store IDs** you can use to test the fallback experience.

All availability notes below were verified via Apple’s Lookup API (same endpoint used by `src/app/api/availability/route.ts`):

- Lookup format: `https://itunes.apple.com/lookup?id=<TRACK_ID>&country=<STOREFRONT>`
- `resultCount=0` means “not available in that storefront”
- `resultCount>0` means “available in that storefront”

> Note: storefront availability can change over time. If a test case stops behaving as expected, re-check it with the lookup URL above.

## Best “region mismatch” examples

These are the most useful for testing because they are **available in some storefronts** but **not in others**.

| App                           | App Store ID   | Known availability (verified)     | Good for testing                              |
| ----------------------------- | -------------- | --------------------------------- | --------------------------------------------- |
| VALR Crypto Exchange & Wallet | `id1453499428` | US ❌, ZA ✅, GB ✅, AU ✅, IN ✅ | “Not available in US but available elsewhere” |
| BBC iPlayer                   | `id416580485`  | GB ✅, US ❌, ZA ❌, AU ❌, IN ❌ | Strong UK‑only style restriction              |
| NHS App                       | `id1388411277` | GB ✅, US ✅, AU ✅, ZA ❌, IN ❌ | ZA user sees multiple alternative storefronts |
| JioHotstar                    | `id934459219`  | IN ✅, US ✅, ZA ❌, GB ❌, AU ❌ | ZA user sees IN/US as options                 |

## Copy/paste test URLs (fallback page)

Your fallback page reads query params:

- `id`: iOS app id (include the `id` prefix, e.g. `id1453499428`)
- `country`: user country (2‑letter storefront code; you’ve been testing with `za`)
- `scope` (optional): `all` to probe all storefront groups (useful when your continent‑optimized probing hides far‑away storefronts)

Examples:

- **ZA user** testing UK‑only app:
  - `/fallback?id=id416580485&country=za`
- **ZA user** testing “available in GB/US/AU, not ZA”:
  - `/fallback?id=id1388411277&country=za`
- **ZA user** testing “available in IN/US, not ZA”:
  - `/fallback?id=id934459219&country=za`
- **Force full probe** (cross‑continent debug):
  - `/fallback?id=id1453499428&country=us&scope=all`

## Raw lookup URLs (for re-verification)

Replace the country code as needed (`us`, `za`, `gb`, `au`, `in`, ...):

- VALR:
  - `https://itunes.apple.com/lookup?id=1453499428&country=us`
  - `https://itunes.apple.com/lookup?id=1453499428&country=za`
- BBC iPlayer:
  - `https://itunes.apple.com/lookup?id=416580485&country=gb`
  - `https://itunes.apple.com/lookup?id=416580485&country=us`
- NHS App:
  - `https://itunes.apple.com/lookup?id=1388411277&country=gb`
  - `https://itunes.apple.com/lookup?id=1388411277&country=za`
- JioHotstar:
  - `https://itunes.apple.com/lookup?id=934459219&country=in`
  - `https://itunes.apple.com/lookup?id=934459219&country=za`
