# RightFront

RightFront is a micro‑SaaS that provides **smart app store link redirection** for developers and marketing teams.

Users get a short link that automatically redirects visitors to the correct App Store or Play Store page **based on their location**.  
If the app is unavailable in a country, RightFront shows a friendly fallback page instead of Apple's default “Not Available” page.

---

## 🧱 Tech Stack

- **Framework:** Next.js (with the `app/` router)
- **Language:** TypeScript
- **Runtime:** Edge (on Vercel or similar)
- **Styling:** Tailwind CSS
- **Geo Detection:** Vercel `request.geo` or `ipapi.co` API fallback

---

## 🗂️ Project Structure

```
src/
  app/
    link/route.ts       # Redirect handler
    fallback/page.tsx   # Fallback page
  lib/
    geo.ts              # Extract user country
    resolve.ts          # Check store link availability
  components/           # Reusable UI
  middleware.ts         # Optional request preprocessing
```

---

## 🚀 Core Flow

1. User visits `/link?id=<appId>&store=ios`.
2. RightFront detects user's country.
3. Checks the corresponding App Store page.
4. Redirects if found; otherwise shows `/fallback`.

---

## 🤖 Crawling & Indexing (pre-beta)

- Sitemap + robots are generated automatically on build via `next-sitemap`.
- Set **`NEXT_PUBLIC_SITE_URL`** (recommended) or **`SITE_URL`** in your deployment environment so generated URLs are correct.
- The `/link` redirect route sends `X-Robots-Tag: noindex` to avoid being indexed (prevents duplicate crawl).

---

## 🧪 Seeding analytics data (dev)

If you want to test the per-link analytics UI locally, you can seed your dev database with fake links + events.

1. Run migrations:

```bash
pnpm db:migrate
```

2. Seed (set `SEED_USER_ID` to **your Clerk userId**, so the dashboard can see the data):

```bash
SEED_USER_ID="user_..." pnpm db:seed
```

Optional knobs:

- `SEED_LINKS` (default `3`)
- `SEED_EVENTS_PER_LINK` (default `250`)
- `SEED_DAYS` (default `30`)
- `SEED_WIPE_USER=true` (delete existing data for that `SEED_USER_ID` first)
