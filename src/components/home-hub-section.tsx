import Link from "next/link";
import {
  BookOpen,
  Compass,
  LayoutDashboard,
  Code2,
  Blocks,
  ArrowUpRight,
} from "lucide-react";
import { config, type HomeHubCard } from "@/lib/config";

const HUB_ICONS = {
  compass: Compass,
  dashboard: LayoutDashboard,
  code: Code2,
  book: BookOpen,
  blocks: Blocks,
} as const;

function HubCard({ card }: { card: HomeHubCard }) {
  const Icon = HUB_ICONS[card.icon] ?? Compass;

  return (
    <Link
      href={card.href}
      className="group flex flex-col justify-between p-5 rounded-lg border border-[#1f1f1f] hover:border-[#2f2f2f] bg-[#0f0f0f] hover:bg-[#141414] transition-all h-full"
    >
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Icon className="h-4 w-4 text-emerald-500" aria-hidden="true" />
          <h3 className="font-medium text-white">{card.title}</h3>
        </div>
        <p className="text-sm text-zinc-400 leading-relaxed">{card.description}</p>
      </div>
      <div className="mt-4 flex items-center justify-between">
        <span className="text-sm font-medium text-zinc-300 group-hover:text-white transition-colors">
          {card.cta}
        </span>
        <ArrowUpRight className="h-4 w-4 text-zinc-600 group-hover:text-emerald-400 transition-colors" />
      </div>
    </Link>
  );
}

export function HomeHubSection() {
  if (config.HOME_HUB_CARDS.length === 0) return null;

  return (
    <section className="border-b border-[#1f1f1f]" id="home-hub">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 py-12">
        <p className="text-xs font-semibold text-zinc-500 uppercase tracking-[0.2em] mb-2">
          {config.HOME_HUB_TITLE}
        </p>
        <h2 className="text-2xl font-semibold text-white mb-1">
          {config.HOME_HUB_SUBTITLE}
        </h2>
        <p className="text-sm text-zinc-400 mb-8 max-w-xl">{config.HOME_HUB_INTRO}</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {config.HOME_HUB_CARDS.map((card) => (
            <HubCard key={card.title} card={card} />
          ))}
        </div>
      </div>
    </section>
  );
}
