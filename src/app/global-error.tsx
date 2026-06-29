"use client";

import Link from "next/link";
import { Home, Mail, RefreshCw } from "lucide-react";
import { config } from "@/lib/config";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang={config.HTML_LANG}>
      <body className="min-h-screen bg-[#0a0a0a] text-white antialiased">
        <div className="max-w-2xl mx-auto px-2 sm:px-4 lg:px-6 py-24 text-center">
          <p className="text-xs font-semibold text-emerald-500 uppercase tracking-[0.2em] mb-4">
            {config.SITE_SECTION_LABEL}
          </p>
          <h1 className="text-7xl sm:text-8xl font-semibold text-white tracking-tight">
            500
          </h1>
          <h2 className="mt-4 text-2xl font-semibold text-white">
            Something went wrong
          </h2>
          <p className="mt-4 text-zinc-400 leading-relaxed">
            An unexpected error occurred while loading this page. You can try
            again or return to the home hub.
          </p>

          <div className="mt-8 rounded-lg border border-[#1f1f1f] bg-[#0f0f0f] p-4 text-left">
            <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">
              Error details
            </p>
            <p className="text-sm text-zinc-400 font-mono break-words">
              {error.message}
            </p>
            {error.digest && (
              <p className="mt-2 text-xs text-zinc-600 font-mono">
                Digest: {error.digest}
              </p>
            )}
          </div>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              type="button"
              onClick={reset}
              className="inline-flex items-center gap-2 bg-white text-black font-medium text-sm px-5 py-2.5 rounded-md hover:bg-zinc-100 transition-colors"
            >
              <RefreshCw className="h-4 w-4" />
              Try again
            </button>
            <Link
              href="/"
              className="inline-flex items-center gap-2 border border-[#2f2f2f] text-white font-medium text-sm px-5 py-2.5 rounded-md hover:border-[#444] transition-colors"
            >
              <Home className="h-4 w-4" />
              Home
            </Link>
          </div>

          <div className="mt-10 flex flex-wrap justify-center gap-4 text-sm text-zinc-400">
            <Link
              href="/dashboard"
              className="hover:text-emerald-400 transition-colors"
            >
              Status dashboard
            </Link>
            <Link
              href={`mailto:${config.CONTACT_EMAIL}`}
              className="inline-flex items-center gap-1 hover:text-emerald-400 transition-colors"
            >
              <Mail className="h-4 w-4" />
              Contact
            </Link>
          </div>
        </div>
      </body>
    </html>
  );
}
