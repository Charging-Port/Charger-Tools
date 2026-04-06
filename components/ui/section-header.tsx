import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  number: string;
  title: string;
  description?: string;
  className?: string;
}

export function SectionHeader({
  number,
  title,
  description,
  className,
}: SectionHeaderProps) {
  return (
    <div className={cn("mb-14 md:mb-20", className)}>
      <div className="flex items-center gap-3 mb-5">
        <span className="section-number font-mono text-xs text-accent/60 tabular-nums tracking-[0.15em]">
          {number}
        </span>
        <div className="h-px flex-1 max-w-[48px] bg-gradient-to-r from-border/60 to-transparent" />
      </div>
      <h2 className="font-display text-4xl md:text-6xl font-bold tracking-tight text-foreground leading-[0.92]">
        {title}
      </h2>
      {description && (
        <p className="mt-5 text-base text-muted-foreground/70 max-w-lg leading-relaxed">
          {description}
        </p>
      )}
    </div>
  );
}
