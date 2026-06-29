import { cn } from "@/lib/utils";
import { config } from "@/lib/config";

type DiscoveryPageHeroProps = {
  title: string;
  description?: string;
  /** Defaults to config.SITE_SECTION_LABEL */
  eyebrow?: string;
  /** Large = home hero; default = inner discovery pages */
  size?: "default" | "large";
  /** Muted zinc eyebrow on inner pages; emerald on home */
  eyebrowTone?: "accent" | "muted";
  bordered?: boolean;
  className?: string;
  containerClassName?: string;
  children?: React.ReactNode;
};

export function DiscoveryPageHero({
  title,
  description,
  eyebrow = config.SITE_SECTION_LABEL,
  size = "default",
  eyebrowTone,
  bordered = true,
  className,
  containerClassName,
  children,
}: DiscoveryPageHeroProps) {
  const isLarge = size === "large";
  const tone = eyebrowTone ?? (isLarge ? "accent" : "muted");

  return (
    <div className={cn(bordered && "border-b border-[#1f1f1f]", className)}>
      <div
        className={cn(
          "max-w-7xl mx-auto px-2 sm:px-4 lg:px-6",
          isLarge ? "pt-20 pb-18" : "py-12 pb-10",
          containerClassName,
        )}
      >
        <p
          className={cn(
            "text-xs font-semibold uppercase tracking-[0.2em]",
            isLarge ? "mb-5" : "mb-3",
            tone === "accent" ? "text-emerald-500" : "text-zinc-500",
          )}
        >
          {eyebrow}
        </p>
        <h1
          className={cn(
            "font-semibold text-white tracking-tight",
            isLarge
              ? "text-5xl sm:text-6xl lg:text-7xl leading-[1.05] max-w-3xl"
              : "text-4xl",
          )}
        >
          {title}
        </h1>
        {description && (
          <p
            className={cn(
              "text-zinc-400 max-w-xl",
              isLarge
                ? "mt-6 text-[17px] leading-relaxed"
                : "mt-3 leading-relaxed",
            )}
          >
            {description}
          </p>
        )}
        {children}
      </div>
    </div>
  );
}
