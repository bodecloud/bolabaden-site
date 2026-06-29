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

function AboutHubCard({ card }: { card: HomeHubCard }) {
  const Icon = HUB_ICONS[card.icon] ?? Compass;
  const href = card.href === "/projects" ? "/about#projects" : card.href;

  return (
    <Link
      href={href}
      className="group flex flex-col justify-between rounded-lg border border-border bg-background/70 p-5 transition-all hover:border-primary/50 hover:bg-background/90 h-full"
    >
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Icon className="h-4 w-4 text-primary" aria-hidden="true" />
          <h2 className="text-lg font-semibold text-foreground">{card.title}</h2>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {card.description}
        </p>
      </div>
      <div className="mt-4 flex items-center justify-between">
        <span className="text-sm font-medium text-primary group-hover:text-primary/80 transition-colors">
          {card.cta}
        </span>
        <ArrowUpRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
      </div>
    </Link>
  );
}

export function AboutHubStrip() {
  const cards = config.HOME_HUB_CARDS.slice(0, 3);
  if (cards.length === 0) return null;

  return (
    <section className="py-10 border-b border-border/50 bg-muted/10">
      <div className="container mx-auto px-2">
        <div className="grid gap-3 md:grid-cols-3">
          {cards.map((card) => (
            <AboutHubCard key={card.title} card={card} />
          ))}
        </div>
      </div>
    </section>
  );
}
