import type { TocItem } from "@/components/side-toc";
import { config } from "@/lib/config";

interface GuideInlineTocProps {
  items: TocItem[];
}

export function GuideInlineToc({ items }: GuideInlineTocProps) {
  if (items.length < 3) return null;

  return (
    <nav
      aria-label={config.GUIDE_INLINE_TOC_ARIA}
      className="md:hidden mb-8 rounded-lg border border-[#1f1f1f] bg-[#0f0f0f] p-4"
    >
      <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500 mb-3">
        {config.GUIDE_INLINE_TOC_LABEL}
      </p>
      <ul className="space-y-2">
        {items.map((item) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              className="text-sm text-zinc-300 hover:text-emerald-400 transition-colors"
            >
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
