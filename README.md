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

## 📈 Future Plans

- Add analytics tracking for link clicks.
- Support custom vanity links (`/r/myapp`).
- Add dashboard with link management.
