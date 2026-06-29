import { config } from "@/lib/config";

export function HomeFutureSection() {
  if (config.HOME_FUTURE_PLACEHOLDERS.length === 0) return null;

  return (
    <section className="border-b border-[#1f1f1f]" id="future-blocks">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 py-12">
        <div className="flex flex-wrap items-center gap-3 mb-2">
          <span className="text-[10px] font-semibold text-emerald-500/80 border border-emerald-500/20 rounded px-2 py-0.5">
            {config.HOME_FUTURE_BADGE}
          </span>
        </div>
        <h2 className="text-2xl font-semibold text-white mb-1">
          {config.HOME_FUTURE_TITLE}
        </h2>
        <p className="text-sm text-zinc-400 mb-8 max-w-2xl">
          {config.HOME_FUTURE_SUBTITLE}
        </p>
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
          {config.HOME_FUTURE_PLACEHOLDERS.map((label) => (
            <li
              key={label}
              className="rounded-lg border border-dashed border-[#2a2a2a] bg-[#0a0a0a] px-4 py-3 text-sm text-zinc-500"
            >
              {label}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
