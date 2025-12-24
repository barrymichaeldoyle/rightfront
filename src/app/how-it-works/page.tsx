import { BrandMark } from "@/components/BrandLogo";
import { ButtonLink } from "@/components/ui/Button";
import { config } from "@/lib/config";
import { features } from "@/lib/features";

import { AnchorHeading } from "./AnchorHeading";

export const metadata = {
  title: "How RightFront Works — Geo-Aware App Store Links",
  description:
    "Learn how RightFront fixes Apple App Store country issues and routes users to the correct App Store storefront automatically.",
};

export default function HowItWorksPage() {
  const androidEnabled = features.androidEnabled;
  return (
    <main className="mx-auto max-w-4xl px-6 py-16 text-slate-100">
      <header className="mb-10 flex items-center justify-between">
        <AnchorHeading id="top" as="h1">
          How <BrandMark /> Works
        </AnchorHeading>
        <ButtonLink href="/" variant="secondary" size="sm">
          ← Back to Home
        </ButtonLink>
      </header>

      <section className="mb-12">
        <AnchorHeading id="problem">
          The problem with app store links
        </AnchorHeading>
        <p className="mb-4 text-slate-300">
          There is no truly universal app store link.
        </p>
        <p className="mb-4 text-slate-300">
          When someone clicks a standard{" "}
          {androidEnabled ? "App Store or Play Store" : "App Store"} link, the
          store may open in the wrong country, show a “Not Available in Your
          Region” message, or display the wrong storefront language.
        </p>
        <p className="text-slate-300">
          This is especially common when sharing links internationally or
          running global campaigns.
        </p>
      </section>

      <section className="mb-12">
        <AnchorHeading id="apple-core-issue">
          Apple App Store: the core issue
        </AnchorHeading>
        <p className="mb-4 text-slate-300">
          Apple’s App Store does not provide a global link that automatically
          routes users to the correct country storefront.
        </p>
        <pre className="mb-4 rounded-md bg-slate-900 p-4 text-sm text-slate-200">
          https://apps.apple.com/us/app/id123456789
        </pre>
        <p className="text-slate-300">
          This link always opens the US App Store, even for users in other
          countries. If the app isn&apos;t available in that storefront, users
          are shown a “The page you&apos;re looking for can&apos;t be found”
          error.
        </p>
      </section>

      <section className="mb-12">
        <AnchorHeading id="how-it-works-apple">
          How <BrandMark /> fixes Apple App Store links
        </AnchorHeading>
        <p className="mb-4 text-slate-300">
          <BrandMark /> detects the user&apos;s country and redirects them to
          the correct Apple App Store storefront.
        </p>
        <ul className="ml-6 list-disc text-slate-300">
          <li>User in Germany → apps.apple.com/de/app/…</li>
          <li>User in Japan → apps.apple.com/jp/app/…</li>
          <li>User in Brazil → apps.apple.com/br/app/…</li>
        </ul>
      </section>

      {androidEnabled ? (
        <section className="mb-12">
          <AnchorHeading id="google-play">
            What about Google Play Store?
          </AnchorHeading>
          <p className="mb-4 text-slate-300">
            Google Play generally handles localization better than Apple and
            often auto-detects country and language.
          </p>
          <p className="text-slate-300">
            <BrandMark /> includes Play Store support as a best-effort
            enhancement. Actual localization depends on Google account settings,
            regional availability, and store behavior.
          </p>
        </section>
      ) : null}

      <section className="mb-12">
        <AnchorHeading id="what-it-does">
          What <BrandMark /> does (and doesn&apos;t do)
        </AnchorHeading>
        <ul className="ml-6 list-disc text-slate-300">
          <li>Detects user country automatically</li>
          <li>Routes users to the correct store front</li>
          <li>Works without SDKs or deep linking</li>
          <li>
            Supports Apple App Store{androidEnabled ? " and Google Play" : ""}
          </li>
          <li>Does not bypass store restrictions</li>
          <li>Does not change app availability</li>
          <li>Does not require user accounts</li>
        </ul>
      </section>

      <section>
        <AnchorHeading id="example">Example</AnchorHeading>
        <p className="mb-4 text-slate-300">
          Instead of sharing a country-specific App Store link:
        </p>
        <pre className="mb-4 rounded-md bg-slate-900 p-4 text-sm text-slate-200">
          https://apps.apple.com/us/app/id324684580
        </pre>
        <p className="mb-4 text-slate-300">
          Share a <BrandMark /> link:
        </p>
        <pre className="rounded-md bg-slate-900 p-4 text-sm text-slate-200">
          {`${config.siteUrl}/link?id=id324684580`}
        </pre>
        <p className="mt-4 text-slate-300">
          <BrandMark /> takes care of routing users to the correct App Store
          storefront automatically.
        </p>
      </section>
    </main>
  );
}
