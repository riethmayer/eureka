"use client";

import * as Sentry from "@sentry/nextjs";
import { useState } from "react";

// Temporary route to verify Sentry capture end-to-end. Safe to delete once
// errors are confirmed to land in the Sentry dashboard.
export default function SentryTestPage() {
  const [sent, setSent] = useState(false);

  const handleCaptureMessage = () => {
    Sentry.captureMessage("Eureka Sentry test message");
    setSent(true);
  };

  const handleThrow = () => {
    throw new Error("Eureka Sentry test error (thrown from /sentry-test)");
  };

  return (
    <main className="mx-auto grid max-w-md gap-4 p-8">
      <h1 className="text-xl font-semibold">Sentry test</h1>
      <p>Use these to confirm events reach the eureka-nextjs-prod project.</p>
      <button
        onClick={handleCaptureMessage}
        className="rounded border border-gray-300 p-3 hover:bg-gray-100"
      >
        Send a test message
      </button>
      <button
        onClick={handleThrow}
        className="rounded border border-gray-300 p-3 hover:bg-gray-100"
      >
        Throw an uncaught error
      </button>
      {sent && <p>Message sent — check the Sentry dashboard.</p>}
    </main>
  );
}
