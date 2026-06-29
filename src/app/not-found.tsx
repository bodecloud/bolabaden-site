"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Home, Mail, Search } from "lucide-react";
import { PageLayout } from "@/components/page-layout";
import { config } from "@/lib/config";

export default function NotFound() {
  const [stats, setStats] = useState<{
    totalServices: number;
    avgUptime: number;
    onlineServices: number;
  } | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("/api/services");
        if (res.ok) {
          const data = await res.json();
          setStats({
            totalServices: data?.stats?.totalServices ?? 0,
            avgUptime: data?.stats?.avgUptime ?? 0,
            onlineServices: data?.stats?.onlineServices ?? 0,
          });
        }
      } catch {
        /* optional live stats */
      }
    };
    fetchStats();
  }, []);

  return (
    <PageLayout>
      <div className="max-w-2xl mx-auto px-2 sm:px-4 lg:px-6 py-24 text-center">
        <p className="text-xs font-semibold text-emerald-500 uppercase tracking-[0.2em] mb-4">
          {config.SITE_SECTION_LABEL}
        </p>
        <h1 className="text-7xl sm:text-8xl font-semibold text-white tracking-tight">
          404
        </h1>
        <h2 className="mt-4 text-2xl font-semibold text-white">
          Page not found
        </h2>
        <p className="mt-4 text-zinc-400 leading-relaxed">
          That URL is not on this site. Try home, the service dashboard, or
          guides.
        </p>

        {stats && (
          <div className="mt-10 grid grid-cols-3 gap-3 text-left rounded-lg border border-[#1f1f1f] bg-[#0f0f0f] p-4">
            <div>
              <p className="text-lg font-semibold text-emerald-400">
                {stats.avgUptime.toFixed(1)}%
              </p>
              <p className="text-xs text-zinc-500">Avg uptime</p>
            </div>
            <div>
              <p className="text-lg font-semibold text-white">
                {stats.onlineServices}
              </p>
              <p className="text-xs text-zinc-500">Online</p>
            </div>
            <div>
              <p className="text-lg font-semibold text-white">
                {stats.totalServices}
              </p>
              <p className="text-xs text-zinc-500">Tracked</p>
            </div>
          </div>
        )}

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-white text-black font-medium text-sm px-5 py-2.5 rounded-md hover:bg-zinc-100 transition-colors"
          >
            <Home className="h-4 w-4" />
            Home
          </Link>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 border border-[#2f2f2f] text-white font-medium text-sm px-5 py-2.5 rounded-md hover:border-[#444] transition-colors"
          >
            <Search className="h-4 w-4" />
            Status
          </Link>
        </div>

        <div className="mt-10 flex flex-wrap justify-center gap-4 text-sm text-zinc-400">
          <Link
            href="/guides"
            className="inline-flex items-center gap-1 hover:text-emerald-400 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Guides
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
    </PageLayout>
  );
}
