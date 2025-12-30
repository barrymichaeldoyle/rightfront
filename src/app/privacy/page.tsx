import Link from "next/link";

import type { Metadata } from "next";

import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Privacy Policy — RightFront",
  description:
    "Privacy Policy for RightFront (rightfront.app): what we collect, how we use it, and your choices.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <main className="mx-auto w-full max-w-3xl px-6 py-12 text-slate-100">
      {/* Header */}
      <header className="mb-10 flex items-center justify-between border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-50">
            Privacy Policy
          </h1>
          <p className="mt-2 text-sm text-slate-400">
            Last updated: <time dateTime="2025-12-24">December 24, 2025</time>
          </p>
        </div>
        <Button href="/" variant="secondary" size="sm">
          ← Back to Home
        </Button>
      </header>

      {/* Body */}
      <article
        className={`prose-a:text-sky-300 hover:prose-a:text-sky-200 mt-8 space-y-6 text-[15px] leading-relaxed text-slate-300 [&>h2]:mt-10 [&>h2]:mb-2 [&>h2]:text-2xl [&>h2]:font-semibold [&>h2]:text-slate-100 [&>strong]:text-slate-100 [&>ul]:list-disc [&>ul]:pl-6 [&>ul>li]:mt-1.5`}
      >
        <p>
          RightFront (<strong>“we”</strong>, <strong>“us”</strong>) provides
          geo‑aware App Store links that redirect visitors to the right regional
          storefront. This policy explains what we collect on{" "}
          <strong>rightfront.app</strong> and how we use it.
        </p>

        <h2>Information we collect</h2>
        <ul>
          <li>
            <strong>Account data (via Clerk):</strong> if you create an account
            or sign in, authentication and basic profile data are handled by our
            identity provider (Clerk).
          </li>
          <li>
            <strong>Link analytics you generate:</strong> when someone clicks a
            RightFront link, we may store analytics such as country/region/city,
            device type, OS/browser, referrer, and the redirect outcome (e.g.,
            whether a fallback was used).
          </li>
          <li>
            <strong>Hashed IP (not raw IP):</strong> we may store a{" "}
            <em>hashed</em> IP address for uniqueness/abuse prevention and
            coarse analytics. We do not intentionally store raw IP addresses in
            our application database.
          </li>
          <li>
            <strong>Site performance & usage metrics:</strong> we use Vercel
            Analytics and Vercel Speed Insights to understand usage and improve
            performance.
          </li>
          <li>
            <strong>Geo lookup:</strong> we may infer country from platform geo
            headers. In some cases, we may use an IP‑based lookup to determine a
            visitor’s country for routing.
          </li>
        </ul>

        <h2>How we use information</h2>
        <ul>
          <li>
            <strong>Provide the service:</strong> redirect visitors to the
            correct storefront or show a fallback page.
          </li>
          <li>
            <strong>Operate and secure the product:</strong> prevent abuse,
            debug issues, and maintain reliability.
          </li>
          <li>
            <strong>Improve the product:</strong> aggregate anonymized analytics
            and performance insights to guide improvements.
          </li>
        </ul>

        <h2>Sharing</h2>
        <p>
          We use trusted service providers to run RightFront (for example,
          hosting, authentication, analytics). They process data strictly on our
          behalf to deliver those services. We do not sell or trade personal
          information.
        </p>

        <h2>Data retention</h2>
        <p>
          We retain data only as long as needed for the purposes described
          above. Link analytics may be preserved to provide historical reporting
          in your dashboard or help debug routing reliability.
        </p>

        <h2>Your choices</h2>
        <ul>
          <li>
            <strong>Account:</strong> you can sign out and manage your account
            through the account controls.
          </li>
          <li>
            <strong>Analytics:</strong> some analytics are required to operate
            the service. Where possible, you can use browser controls or
            extensions to limit tracking.
          </li>
        </ul>

        <h2>Contact</h2>
        <p>
          Have questions or concerns? Reach out via the in‑app contact form when
          signed in, or{" "}
          <Link href="/" className="underline underline-offset-2">
            return to the home page
          </Link>
          .
        </p>
      </article>
    </main>
  );
}
