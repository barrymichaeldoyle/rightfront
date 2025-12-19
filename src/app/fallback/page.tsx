import { Suspense } from "react";

import { FallbackClient } from "./FallbackClient";

export default function FallbackPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen flex-col items-center justify-center p-6 text-center">
          <h1 className="mb-4 text-3xl font-semibold">Loading…</h1>
          <p className="mb-6 max-w-lg text-gray-600">
            Preparing fallback page.
          </p>
        </main>
      }
    >
      <FallbackClient />
    </Suspense>
  );
}
