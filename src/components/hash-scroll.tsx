"use client";

import { useEffect } from "react";

/** Scroll to `location.hash` after mount (e.g. /dashboard#services-table). */
export function HashScroll() {
  useEffect(() => {
    const hash = window.location.hash;
    if (!hash || hash.length < 2) return;

    const id = decodeURIComponent(hash.slice(1));
    const scrollToTarget = () => {
      const el = document.getElementById(id);
      if (!el) return;
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    };

    const timer = window.setTimeout(scrollToTarget, 100);
    return () => window.clearTimeout(timer);
  }, []);

  return null;
}
